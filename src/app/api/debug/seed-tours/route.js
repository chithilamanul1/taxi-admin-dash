import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

export async function POST() {
    try {
        await dbConnect();

        // Force model reload
        await Tour.deleteMany({});

        const safaris = [
            {
                title: 'Yala National Park Safari',
                slug: 'yala-national-park-safari',
                type: 'safari',
                duration: { days: 1, nights: 0 },
                description: 'Experience the highest leopard density in the world at Yala National Park. Our safari takes you deep into the jungle to spot leopards, elephants, sloth bears, and crocodiles.',
                shortDescription: 'Spot leopards and elephants in Sri Lanka’s most famous park.',
                price: { amount: 150, currency: 'USD', type: 'from' },
                destinations: ['Yala', 'Tissamaharama'],
                inclusions: ['Safari Jeep (Private)', 'Entrance Tickets', 'Experienced Driver/Tracker', 'Water Bottles'],
                exclusions: ['Tips', 'Personal Expenses'],
                heroImage: '/tours/safari_yala.png',
                images: [],
                itinerary: [
                    { day: 1, title: 'Game Drive', description: 'Morning or Afternoon game drive.', activities: ['Leopard Spotting', 'Bird Watching'] }
                ]
            },
            {
                title: 'Udawalawe National Park Safari',
                slug: 'udawalawe-national-park-safari',
                type: 'safari',
                duration: { days: 1, nights: 0 },
                description: 'Famous for its large population of elephants, Udawalawe guarantees elephant sightings. It rivals the savannah reserves of Africa.',
                shortDescription: 'Guaranteed elephant sightings in their natural habitat.',
                price: { amount: 120, currency: 'USD', type: 'from' },
                destinations: ['Udawalawe'],
                inclusions: ['Safari Jeep', 'Park Fees', 'Guide'],
                heroImage: '/tours/safari_udawalawe.png',
                itinerary: [
                    { day: 1, title: 'Elephant Encounter', description: '3-4 hour game drive.', activities: ['Elephant Watching', 'Visit Transit Home'] }
                ]
            },
            {
                title: 'Minneriya National Park Safari',
                slug: 'minneriya-national-park-safari',
                type: 'safari',
                duration: { days: 1, nights: 0 },
                description: 'Witness "The Gathering", the largest meeting of Asian elephants in the world, usually happening during the dry season.',
                shortDescription: 'Home to the largest gathering of Asian elephants.',
                price: { amount: 130, currency: 'USD', type: 'from' },
                destinations: ['Minneriya', 'Habarana'],
                inclusions: ['Jeep Hire', 'Tickets'],
                heroImage: '/tours/safari_minneriya.png',
                itinerary: [
                    { day: 1, title: 'The Gathering', description: 'Afternoon safari is best for seeing elephants gathering at the tank.', activities: ['Elephant Gathering'] }
                ]
            },
            {
                title: 'Wilpattu National Park Safari',
                slug: 'wilpattu-national-park-safari',
                type: 'safari',
                duration: { days: 1, nights: 0 },
                description: 'Sri Lanka’s largest and oldest national park, known for its "Willus" (natural lakes) and leopard population.',
                shortDescription: 'Explore the land of Willus and Leopards.',
                price: { amount: 160, currency: 'USD', type: 'from' },
                destinations: ['Wilpattu', 'Anuradhapura'],
                inclusions: ['Private Jeep', 'Entrance Fees'],
                heroImage: '/tours/safari_wilpattu.png',
                itinerary: [
                    { day: 1, title: 'Jungle Expedition', description: 'Full day or half day tour.', activities: ['Leopard Tracking', 'Scenic Lakes'] }
                ]
            }
        ];

        const tours = [
            {
                title: '06 Days Excursions from Kandy, Sigiriya & Colombo',
                slug: '06-days-excursions-kandy-sigiriya-colombo',
                type: 'tour-package',
                duration: { days: 6, nights: 5 },
                description: 'A perfect introductory tour to Sri Lanka covering the cultural triangle, hill country, and the capital.',
                price: { amount: 300, currency: 'USD', type: 'from' },
                destinations: ['Kandy', 'Sigiriya', 'Colombo', 'Dambulla'],
                heroImage: '/tours/sigiriya.jpg',
                itinerary: [
                    { day: 1, title: 'Arrival & Transfer to Sigiriya', description: 'Pickup from Airport.', activities: ['Dambulla Cave Temple'] },
                    { day: 2, title: 'Sigiriya Rock Fortress', description: 'Climb the 8th wonder of the world.', activities: ['Sigiriya Climb', 'Village Tour'] },
                    { day: 3, title: 'Transfer to Kandy', description: 'Visit Spice Garden en route.', activities: ['Temple of Tooth'] },
                    { day: 4, title: 'Kandy City Tour', description: 'Botanical Gardens and Cultural Show.', activities: ['Peradeniya Gardens'] },
                    { day: 5, title: 'Transfer to Colombo', description: 'Scenic drive.', activities: ['Colombo City Tour'] },
                    { day: 6, title: 'Departure', description: 'Transfer to Airport.', activities: [] }
                ]
            }
        ];

        await Tour.insertMany([...safaris, ...tours]);

        return NextResponse.json({ success: true, message: 'Tours and Safaris seeded!' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
