
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

const SEED_TOURS = [
    {
        title: "Kandy Cultural Day Tour",
        slug: "kandy-cultural-day-tour",
        category: "city-tour", // Match enum
        duration: { days: 1, nights: 0 },
        price: { amount: 15000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop",
        description: "Explore the Sacred City of Kandy, a UNESCO World Heritage site. Visit the Temple of the Tooth Relic, Royal Botanical Gardens, and witness a traditional cultural dance performance.",
        isActive: true,
        sortOrder: 1
    },
    {
        title: "Sigiriya Rock Fortress & Dambulla",
        slug: "sigiriya-dambulla-tour",
        category: "day-trip",
        duration: { days: 1, nights: 0 },
        price: { amount: 18000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop",
        description: "Climb the majestic Sigiriya Lion Rock and explore the ancient Dambulla Cave Temple. A journey through Sri Lanka's rich history and stunning landscapes.",
        isActive: true,
        sortOrder: 2
    },
    {
        title: "Yala National Park Safari",
        slug: "yala-safari-adventure",
        category: "safari",
        duration: { days: 1, nights: 0 },
        price: { amount: 25000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop",
        description: "Experience the wild side of Sri Lanka. Spot leopards, elephants, and bears in Yala National Park with an expert naturalist guide.",
        isActive: true,
        sortOrder: 3
    },
    {
        title: "Ella Scenic Train Journey",
        slug: "ella-train-highlands",
        category: "tour-package",
        duration: { days: 3, nights: 2 },
        price: { amount: 45000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600&auto=format&fit=crop",
        description: "Take the world-famous train ride from Kandy to Ella. Visit Little Adam's Peak, Nine Arch Bridge, and enjoy the cool climate of the hill country.",
        isActive: true,
        sortOrder: 4
    },
    {
        title: "Galle Fort & Coastal Explorer",
        slug: "galle-fort-coastal",
        category: "day-trip",
        duration: { days: 1, nights: 0 },
        price: { amount: 12000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
        description: "Walk the ramparts of the Dutch Fort in Galle, visit the Turtle Hatchery, and relax on the pristine beaches of the south coast.",
        isActive: true,
        sortOrder: 5
    },
    {
        title: "Whale Watching in Mirissa",
        slug: "mirissa-whale-watching",
        category: "safari",
        duration: { days: 1, nights: 0 },
        price: { amount: 10000, currency: 'LKR', type: 'from' },
        heroImage: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1600&auto=format&fit=crop",
        description: "Set sail to sea to witness the Blue Whales, the largest animals on earth. A once-in-a-lifetime experience off the coast of Mirissa.",
        isActive: true,
        sortOrder: 6
    }
];

export async function GET() {
    try {
        await dbConnect();

        // Clear existing tours to prevent duplicates/mess
        await Tour.deleteMany({});

        // Insert new seeded tours
        await Tour.insertMany(SEED_TOURS);

        return NextResponse.json({
            success: true,
            message: 'Tours seeded successfully',
            count: SEED_TOURS.length
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
