import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';

// Specific fixed-rate routes for Sigiriya and Ella
const ROUTES = [
    {
        route_id: 'route_sigiriya_kandy',
        title: 'Sigiriya to Kandy',
        name: 'Kandy, Sri Lanka',
        pickupLocation: 'Sigiriya, Sri Lanka',
        slug: 'sigiriya-to-kandy',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Sigiriya, Sri Lanka', latitude: 7.9573, longitude: 80.7601 },
        destination_location: { name: 'Kandy, Sri Lanka', latitude: 7.2906, longitude: 80.6337 },
        pricing: { 'mini-car': 15000, 'sedan': 17000, 'kdh': 25000 },
    },
    {
        route_id: 'route_sigiriya_ella',
        title: 'Sigiriya to Ella',
        name: 'Ella, Sri Lanka',
        pickupLocation: 'Sigiriya, Sri Lanka',
        slug: 'sigiriya-to-ella',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Sigiriya, Sri Lanka', latitude: 7.9573, longitude: 80.7601 },
        destination_location: { name: 'Ella, Sri Lanka', latitude: 6.8667, longitude: 81.0464 },
        pricing: { 'mini-car': 30000, 'sedan': 35000, 'kdh': 45000 },
    },
    {
        route_id: 'route_sigiriya_polonnaruwa',
        title: 'Sigiriya to Polonnaruwa',
        name: 'Polonnaruwa, Sri Lanka',
        pickupLocation: 'Sigiriya, Sri Lanka',
        slug: 'sigiriya-to-polonnaruwa',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Sigiriya, Sri Lanka', latitude: 7.9573, longitude: 80.7601 },
        destination_location: { name: 'Polonnaruwa, Sri Lanka', latitude: 7.9403, longitude: 81.0188 },
        pricing: { 'mini-car': 15000, 'sedan': 18000, 'kdh': 30000 },
    },
    {
        route_id: 'route_ella_kandy',
        title: 'Ella to Kandy',
        name: 'Kandy, Sri Lanka',
        pickupLocation: 'Ella, Sri Lanka',
        slug: 'ella-to-kandy',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Ella, Sri Lanka', latitude: 6.8667, longitude: 81.0464 },
        destination_location: { name: 'Kandy, Sri Lanka', latitude: 7.2906, longitude: 80.6337 },
        pricing: { 'mini-car': 20000, 'sedan': 25000, 'kdh': 35000 },
    },
    {
        route_id: 'route_ella_sigiriya',
        title: 'Ella to Sigiriya',
        name: 'Sigiriya, Sri Lanka',
        pickupLocation: 'Ella, Sri Lanka',
        slug: 'ella-to-sigiriya',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Ella, Sri Lanka', latitude: 6.8667, longitude: 81.0464 },
        destination_location: { name: 'Sigiriya, Sri Lanka', latitude: 7.9573, longitude: 80.7601 },
        pricing: { 'mini-car': 30000, 'sedan': 35000, 'kdh': 45000 },
    },
    {
        route_id: 'route_ella_udawalawe',
        title: 'Ella to Udawalawe',
        name: 'Udawalawe, Sri Lanka',
        pickupLocation: 'Ella, Sri Lanka',
        slug: 'ella-to-udawalawe',
        applicableRideType: 'non-airport-only',
        pickup_location: { name: 'Ella, Sri Lanka', latitude: 6.8667, longitude: 81.0464 },
        destination_location: { name: 'Udawalawe, Sri Lanka', latitude: 6.4374, longitude: 80.8979 },
        pricing: { 'mini-car': 15000, 'sedan': 18000, 'kdh': 30000 },
    },
];

export async function GET(req) {
    try {
        await dbConnect();
        const results = [];

        for (const route of ROUTES) {
            const { pricing, pickup_location, destination_location, ...routeData } = route;

            // Build pricing map
            const pricingMap = new Map(Object.entries(pricing));

            const update = {
                ...routeData,
                pricing: pricingMap,
                pickup_location,
                destination_location,
                isActive: true,
            };

            const doc = await Destination.findOneAndUpdate(
                { route_id: route.route_id },
                { $set: update },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            // Handle missing id field for new docs
            if (!doc.id) {
                doc.id = `dest_${Date.now()}_${route.route_id}`;
                await doc.save();
            }

            results.push({ route: route.title, status: 'OK' });
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('[API/SeedRates] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
