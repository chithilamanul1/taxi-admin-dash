import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';
import { isAdmin } from '@/lib/admin-check';
import { nanoid } from 'nanoid';

const VEHICLE_TYPES = [
    "mini-car",
    "sedan",
    "vezel",
    "suv",
    "mini-van-every",
    "mini-van-05",
    "normal-kdh",
    "kdh-van",
    "mini-bus",
    "coach-bus"
];

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .slice(0, 100);
}

// GET: Download CSV template or Export current destinations
export async function GET(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') || 'template'; // 'template' or 'export'

        // Define CSV headers
        const headers = [
            'Title',
            'Name',
            'Pickup Location',
            'Applicable Ride Type',
            'Is Active',
            'Sort Order',
            'Pickup Latitude',
            'Pickup Longitude',
            'Destination Latitude',
            'Destination Longitude'
        ];

        // Add vehicle columns
        VEHICLE_TYPES.forEach(vt => {
            headers.push(`${vt}_flat_0_20`);
            headers.push(`${vt}_flat_21_40`);
        });

        let csvContent = headers.join(',') + '\n';

        if (mode === 'export') {
            const destinations = await Destination.find({}).sort({ sortOrder: 1, title: 1 });
            destinations.forEach(d => {
                const row = [
                    `"${(d.title || '').replace(/"/g, '""')}"`,
                    `"${(d.name || '').replace(/"/g, '""')}"`,
                    `"${(d.pickupLocation || '').replace(/"/g, '""')}"`,
                    d.applicableRideType || 'all',
                    d.isActive !== false ? 'true' : 'false',
                    d.sortOrder || 99,
                    d.pickup_location?.latitude || '',
                    d.pickup_location?.longitude || '',
                    d.destination_location?.latitude || '',
                    d.destination_location?.longitude || ''
                ];

                // Extract vehicle tiers
                let vTiersMap = {};
                if (d.vehicleTiers) {
                    if (typeof d.vehicleTiers.get === 'function') {
                        vTiersMap = Object.fromEntries(d.vehicleTiers);
                    } else {
                        vTiersMap = d.vehicleTiers;
                    }
                }

                VEHICLE_TYPES.forEach(vt => {
                    const tiers = vTiersMap[vt] || [];
                    const tier1 = tiers.find(t => (t.minKm === 0 || t.min === 0) && (t.maxKm === 20 || t.max === 20));
                    const tier2 = tiers.find(t => (t.minKm === 21 || t.min === 21) && (t.maxKm === 40 || t.max === 40));

                    row.push(tier1 ? (tier1.value || tier1.price || '') : '');
                    row.push(tier2 ? (tier2.value || tier2.price || '') : '');
                });

                csvContent += row.join(',') + '\n';
            });
        } else {
            // Add a sample row for the template
            const sampleRow = [
                '"Sigiriya, Sri Lanka to Sigiriya, Sri Lanka"',
                '"Sigiriya, Sri Lanka"',
                '"Sigiriya, Sri Lanka"',
                'all',
                'true',
                '1',
                '7.9571107',
                '80.7601413',
                '7.9571107',
                '80.7601413',
                '7000', // mini-car 0-20
                '9000', // mini-car 21-40
                '9000', // sedan 0-20
                '12000' // sedan 21-40
            ];
            // Fill remaining columns with empty strings
            while (sampleRow.length < headers.length) {
                sampleRow.push('');
            }
            csvContent += sampleRow.join(',') + '\n';
        }

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=destinations_${mode}.csv`
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Upload and import CSV
export async function POST(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const text = await file.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length <= 1) {
            return NextResponse.json({ success: false, error: 'CSV file is empty' }, { status: 400 });
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

        // Helper to parse CSV row correctly handling quotes
        const parseCsvRow = (rowText) => {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < rowText.length; i++) {
                const char = rowText[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim().replace(/^["']|["']$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim().replace(/^["']|["']$/g, ''));
            return result;
        };

        let importCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const values = parseCsvRow(lines[i]);
            if (values.length < 2) continue;

            const rowData = {};
            headers.forEach((header, idx) => {
                rowData[header] = values[idx];
            });

            const title = rowData['Title'];
            const name = rowData['Name'];
            const pickupLocation = rowData['Pickup Location'];

            if (!title || !name) continue;

            // Construct vehicleTiers Map
            const vehicleTiers = {};
            VEHICLE_TYPES.forEach(vt => {
                const flat0_20 = rowData[`${vt}_flat_0_20`];
                const flat21_40 = rowData[`${vt}_flat_21_40`];

                const tiers = [];
                if (flat0_20 && Number(flat0_20) > 0) {
                    tiers.push({ minKm: 0, maxKm: 20, type: 'flat', value: Number(flat0_20) });
                }
                if (flat21_40 && Number(flat21_40) > 0) {
                    tiers.push({ minKm: 21, maxKm: 40, type: 'flat', value: Number(flat21_40) });
                }

                if (tiers.length > 0) {
                    vehicleTiers[vt] = tiers;
                }
            });

            // Construct pickup and destination location coordinates
            const pickup_lat = rowData['Pickup Latitude'];
            const pickup_lng = rowData['Pickup Longitude'];
            const dest_lat = rowData['Destination Latitude'];
            const dest_lng = rowData['Destination Longitude'];

            const pickup_location = pickup_lat && pickup_lng ? {
                name: pickupLocation || name,
                latitude: Number(pickup_lat),
                longitude: Number(pickup_lng)
            } : undefined;

            const destination_location = dest_lat && dest_lng ? {
                name: name,
                latitude: Number(dest_lat),
                longitude: Number(dest_lng)
            } : undefined;

            // Find existing destination by slug or title
            const slug = slugify(name);
            let dest = await Destination.findOne({ $or: [{ slug }, { title }] });

            const updateData = {
                title,
                name,
                pickupLocation,
                applicableRideType: rowData['Applicable Ride Type'] || 'all',
                isActive: rowData['Is Active'] !== 'false',
                sortOrder: Number(rowData['Sort Order']) || 99,
                vehicleTiers,
                pickup_location,
                destination_location,
                slug
            };

            if (dest) {
                // Update existing
                await Destination.updateOne({ _id: dest._id }, { $set: updateData });
            } else {
                // Create new
                updateData.id = `dest_${nanoid(8)}`;
                const prefix = pickupLocation ? slugify(pickupLocation).substring(0, 10) : 'global';
                const suffix = slugify(name).substring(0, 10);
                updateData.route_id = `route_${prefix}_${suffix}_${Date.now().toString().slice(-6)}`;
                await Destination.create(updateData);
            }

            importCount++;
        }

        return NextResponse.json({ success: true, message: `Successfully imported ${importCount} destinations.` });
    } catch (error) {
        console.error('[API/Destinations/CSV] POST Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
