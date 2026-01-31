
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

const SEED_TOURS = [
    {
        title: "Kandy Cultural Day Tour",
        slug: "kandy-cultural-day-tour",
        category: "City Tours",
        duration: 1,
        price: 45000, // LKR
        image: "https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop",
        description: "Explore the Sacred City of Kandy, a UNESCO World Heritage site. Visit the Temple of the Tooth Relic, Royal Botanical Gardens, and witness a traditional cultural dance performance.",
        highlights: ["Temple of the Tooth", "Botanical Gardens", "Cultural Dance", "Spice Garden"],
        isActive: true,
        order: 1
    },
    {
        title: "Sigiriya Rock Fortress & Dambulla",
        slug: "sigiriya-dambulla-tour",
        category: "Day Tours",
        duration: 1,
        price: 55000,
        image: "https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop",
        description: "Climb the majestic Sigiriya Lion Rock and explore the ancient Dambulla Cave Temple. A journey through Sri Lanka's rich history and stunning landscapes.",
        highlights: ["Sigiriya Rock", "Dambulla Caves", "Village Safari", "Lunch with Locals"],
        isActive: true,
        order: 2
    },
    {
        title: "Yala National Park Safari",
        slug: "yala-safari-adventure",
        category: "Safari",
        duration: 2,
        price: 85000,
        image: "https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop",
        description: "Experience the wild side of Sri Lanka. Spot leopards, elephants, and bears in Yala National Park with an expert naturalist guide. Includes overnight stay.",
        highlights: ["Jeep Safari", "Leopard Spotting", "Bird Watching", "Beach Visit"],
        isActive: true,
        order: 3
    },
    {
        title: "Ella Scenic Train Journey",
        slug: "ella-train-highlands",
        category: "Multi-Day",
        duration: 3,
        price: 120000,
        image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600&auto=format&fit=crop",
        description: "Take the world-famous train ride from Kandy to Ella. Visit Little Adam's Peak, Nine Arch Bridge, and enjoy the cool climate of the hill country.",
        highlights: ["Scenic Train Ride", "Nine Arch Bridge", "Tea Plantations", "Little Adam's Peak"],
        isActive: true,
        order: 4
    },
    {
        title: "Galle Fort & Coastal Explorer",
        slug: "galle-fort-coastal",
        category: "Day Tours",
        duration: 1,
        price: 40000,
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop",
        description: "Walk the ramparts of the Dutch Fort in Galle, visit the Turtle Hatchery, and relax on the pristine beaches of the south coast.",
        highlights: ["Galle Fort", "Turtle Hatchery", "Stilt Fishermen", "Bentota River Safari"],
        isActive: true,
        order: 5
    },
    {
        title: "Whale Watching in Mirissa",
        slug: "mirissa-whale-watching",
        category: "Safari",
        duration: 1,
        price: 35000,
        image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1600&auto=format&fit=crop",
        description: "Set sail to sea to witness the Blue Whales, the largest animals on earth. A once-in-a-lifetime experience off the coast of Mirissa.",
        highlights: ["Blue Whales", "Dolphins", "Coconut Tree Hill", "Secret Beach"],
        isActive: true,
        order: 6
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
