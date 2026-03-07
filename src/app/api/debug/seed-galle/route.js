import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

export async function POST() {
    try {
        await dbConnect();

        const galleTour = {
            title: 'Galle and Bentota Day-Tour From Colombo',
            slug: 'galle-and-bentota-day-tour-from-colombo',
            category: 'day-trip',
            duration: { days: 1, nights: 0 },
            description: "After being picked up at your hotel, hop onboard your Madu Ganga Magrove boat safari and explore the Madu River. See the mangrove forests and marshlands that surround the river. Stop at a cinnamon garden, and try some of the area’s famous cinnamon. The Madu Ganga River region is home to some of the best quality cinnamon in the world as well as a flourishing cinnamon industry. Afterward, marvel at the fishermen who stoically sit atop large branches planted in the middle of the water waiting for their catch.\n\nContinue to a local Turtle Hatchery, where your guide will introduce you to the many local varieties of turtles. End your tour with a visit to the Galle Fort, a UNESCO World Heritage Site. This fort illustrates the unique interaction of European architecture and South Asian traditions from the 16th to the 19th centuries. After discovering the fort, you will be returned to your hotel in Colombo",
            heroImage: '/DayTrips/maduriver.jpg',
            price: { amount: 59, currency: 'USD', type: 'per-person' },
            destinations: ['Bentota', 'Madu River', 'Kosgoda', 'Galle Fort'],
            inclusions: [
                'Hotel pickup and drop-off in a shared vehicle',
                'A bottle of water'
            ],
            exclusions: [
                'Entrance fees',
                'Madu River boat safari ($30 for solo travelers, $25 per person if 2 or more travelers)',
                'Turtle Hatchery ($10 per person)',
                'Tips'
            ],
            experience: [
                { heading: 'Pickup Location Options', text: 'Colombo , Negombo, Dehiwala, Mount Laviniya, Wadduwa, Kalutara' },
                { heading: 'Car', text: '(1 hours)' },
                { heading: 'Bentota', text: 'Photo stop (10 minutes)' },
                { heading: 'Car', text: '(30 minutes)' },
                { heading: 'Kosgoda Sea Turtle Conservation', text: 'Visit (45 minutes)' },
                { heading: 'Madu Ganga', text: 'Boat cruise (105 minutes)' },
                { heading: 'Car', text: '(20 minutes)' },
                { heading: 'Hikkaduwa', text: '(30 minutes)' },
                { heading: 'Galle Fort', text: 'Photo stop, Visit, Free time, Sightseeing, Walk, Sunset, Self-guided tour, Pass by (1 hour)' },
                { heading: 'Arrive back at', text: 'Colombo, Negombo, Wadduwa, kalutara, Dehiwala, Mount Laviniya' }
            ],
            notSuitableFor: [
                'Back problems',
                'Insect allergies',
                'Cold',
                'Kidney problems',
                'Recent surgeries',
                'Motion sickness',
                'Animal allergies',
                'Pregnant women',
                'Wheelchair user'
            ],
            notAllowed: [
                'Pets',
                'Explosive substances',
                'Nudity',
                'Fireworks',
                'Alcohol and drugs',
                'Drones',
                'Glass object',
                'Drinks in the vehicle',
                'Making noise',
                'Alcoholic drinks in the vehicle',
                'Touching/Feeding animals'
            ]
        };

        // Update if exists or create new
        await Tour.findOneAndUpdate(
            { slug: galleTour.slug },
            galleTour,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: 'Galle & Bentota tour updated!' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
