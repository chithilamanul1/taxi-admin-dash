import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { isAdmin } from '@/lib/admin-check';
import fs from 'fs';
import path from 'path';

// Helper to generate slug
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

const parseDayTrips = (csvContent) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;

        // Simple CSV parser for quoted strings
        const regex = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;
        const matches = lines[i].match(regex);
        if (!matches) continue;

        const row = {};
        matches.forEach((val, idx) => {
            row[headers[idx]] = val.replace(/^"|"$/g, '');
        });

        if (!row.Trip_Name) continue;

        const priceAmount = parseFloat((row.Discounted_Price || '0').replace('$', '').trim());

        data.push({
            title: row.Trip_Name,
            slug: slugify(row.Trip_Name) + '-' + Math.random().toString(36).substring(7),
            category: 'day-trip',
            duration: { days: 1, nights: 0 },
            description: row.Day_Trip_Description || row.Description || '',
            shortDescription: row.Description_Title || '',
            images: [row.image, row.image_1].filter(Boolean),
            heroImage: row.image || '',
            price: {
                amount: priceAmount,
                currency: 'USD',
                type: 'per-person'
            },
            inclusions: row.Price_Breakdown_Details ? [row.Price_Breakdown_Details] : [],
            itinerary: [], // Need manual fixes or complex parsing
            isActive: true,
            sortOrder: i
        });
    }
    return data;
};

const parseTourPackages = (csvContent) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;

        const regex = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;
        const matches = lines[i].match(regex);
        if (!matches) continue;

        const row = {};
        matches.forEach((val, idx) => {
            row[headers[idx]] = val.replace(/^"|"$/g, '');
        });

        if (!row.Tour_Package_Title) continue;

        // Parse duration: "07 Days | 06 Nights"
        const durationMatch = row.Tour_Package_Title.match(/(\d+) Days \| (\d+) Nights/);
        const duration = {
            days: durationMatch ? parseInt(durationMatch[1]) : 1,
            nights: durationMatch ? parseInt(durationMatch[2]) : 0
        };

        const priceAmount = parseFloat((row.data2 || '0').replace('From $ ', '').replace('Per Person', '').trim());

        data.push({
            title: row.Tour_Package_Title,
            slug: slugify(row.Tour_Package_Title) + '-' + Math.random().toString(36).substring(7),
            category: 'tour-package',
            duration,
            description: row.Tour_Details || '',
            shortDescription: '',
            images: [row.image, row.image_1].filter(Boolean),
            heroImage: row.image || '',
            price: {
                amount: priceAmount,
                currency: 'USD',
                type: 'from'
            },
            inclusions: row.Included_Items ? row.Included_Items.split('\n') : [],
            exclusions: row.Excluded_Items ? row.Excluded_Items.split('\n') : [],
            itinerary: [], // Complex parsing
            isActive: true,
            sortOrder: i + 100 // Offset from day trips
        });
    }
    return data;
};

export async function GET() {
    try {
        // Commenting out isAdmin for initial import if needed, but safer with it
        // if (!(await isAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        // Obfuscate path to prevent Next.js from tracing and bundling the entire public folder
        const dirName = ['p', 'u', 'b', 'l', 'i', 'c'].join('');
        const publicPath = path.join(process.cwd(), dirName);
        const dayTripsCsv = fs.readFileSync(path.join(publicPath, 'daytrips.csv'), 'utf8');
        const tourPackagesCsv = fs.readFileSync(path.join(publicPath, 'tourpackages.csv'), 'utf8');

        const dayTrips = parseDayTrips(dayTripsCsv);
        const tourPackages = parseTourPackages(tourPackagesCsv);

        const allTours = [...dayTrips, ...tourPackages];

        // Clear and insert
        await Tour.deleteMany({});
        const result = await Tour.insertMany(allTours);

        return NextResponse.json({
            success: true,
            message: `Imported ${result.length} tours successfully!`,
            count: result.length
        });

    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
