export interface Tour {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    includes: string[];
    image: string;
    category: string;
}

export interface Vehicle {
    id: string;
    name: string;
    type: string;
    ratePerKm: number;
    capacity: number;
    image: string;
}

export interface Booking {
    id: string;
    customerName: string;
    pickupLocation: string;
    dropLocation: string;
    vehicleType: string;
    price: number;
    status: 'Pending Driver' | 'Driver Assigned' | 'Completed' | 'Cancelled';
    date: string;
    time: string;
}

export const TOURS: Tour[] = [
    {
        id: 't1',
        title: 'Kandy Day Tour',
        description: 'Explore the Hill Capital of Sri Lanka. Visit the Temple of the Sacred Tooth Relic, Royal Botanical Gardens, and enjoy a scenic lake-view drive.',
        price: 25000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Lunch', 'Temple Entrance Fees'],
        image: '/images/tours/kandy.jpg',
        category: 'Day Tour'
    },
    {
        id: 't2',
        title: 'Yala Safari Adventure',
        description: 'Experience the wild in one of the world\'s best leopard-spotting parks. Includes a 4x4 safari and round-trip transport.',
        price: 35000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', '4x4 Safari Jeep', 'English Speaking Driver', 'National Park Fees'],
        image: '/images/tours/yala.jpg',
        category: 'Safari'
    },
    {
        id: 't3',
        title: 'Colombo City Tour',
        description: 'A vibrant journey through the commercial heart of Sri Lanka. Visit Gangaramaya Temple, Independence Square, and Galle Face Green.',
        price: 15000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'City Map', 'Snacks'],
        image: '/images/tours/colombo.jpg',
        category: 'City Tour'
    },
    {
        id: 't4',
        title: 'Galle Fort Visit',
        description: 'Walk through history in this UNESCO World Heritage Site. Explore the dutch ramparts, lighthouse, and charming streets.',
        price: 22000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Bottled Water'],
        image: '/images/tours/galle.jpg',
        category: 'Day Tour'
    },
    {
        id: 't5',
        title: 'Sigiriya Rock Fortress',
        description: 'Climb the iconic Lion Rock, a masterpiece of ancient urban planning and art. Visit Dambulla Cave Temple as well.',
        price: 28000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Temple Entrance'],
        image: '/images/tours/sigiriya.jpg',
        category: 'Cultural'
    },
    {
        id: 't6',
        title: 'Ella Scenic Day Trip',
        description: 'Head to the highlands to see Ravana Falls, Nine Arches Bridge, and enjoy breathtaking mountain views.',
        price: 30000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Tea Factory Visit'],
        image: '/images/tours/ella.jpg',
        category: 'Highlands'
    }
];

export const FLEET: Vehicle[] = [
    {
        id: 'v1',
        name: 'Toyota Prius (Sedan)',
        type: 'Hybrid Sedan',
        ratePerKm: 120,
        capacity: 3,
        image: '/images/fleet/prius.png'
    },
    {
        id: 'v2',
        name: 'Toyota KDH (Flat Roof)',
        type: 'Van',
        ratePerKm: 180,
        capacity: 7,
        image: '/images/fleet/kdh.png'
    },
    {
        id: 'v3',
        name: 'Suzuki Wagon R',
        type: 'Compact',
        ratePerKm: 100,
        capacity: 3,
        image: '/images/fleet/wagonr.png'
    },
    {
        id: 'v4',
        name: 'Toyota Axio',
        type: 'Sedan',
        ratePerKm: 110,
        capacity: 3,
        image: '/images/fleet/axio.png'
    },
    {
        id: 'v5',
        name: 'Toyota Commuter (High Roof)',
        type: 'Large Van',
        ratePerKm: 220,
        capacity: 14,
        image: '/images/fleet/commuter.png'
    }
];

export const ACTIVE_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        customerName: 'John Doe',
        pickupLocation: 'Bandaranaike International Airport (BIA)',
        dropLocation: 'Taj Samudra, Colombo',
        vehicleType: 'Toyota Prius (Sedan)',
        price: 9500,
        status: 'Driver Assigned',
        date: '2026-01-23',
        time: '08:00'
    },
    {
        id: 'b2',
        customerName: 'Jane Smith',
        pickupLocation: 'Marino Beach Hotel, Colombo',
        dropLocation: 'Bandaranaike International Airport (BIA)',
        vehicleType: 'Suzuki Wagon R',
        price: 7500,
        status: 'Pending Driver',
        date: '2026-01-23',
        time: '14:30'
    }
    ,
    {
        id: 'b3',
        customerName: 'Ahamed Rizwan',
        pickupLocation: 'Bandaranaike International Airport (BIA)',
        dropLocation: 'Queens Hotel, Kandy',
        vehicleType: 'Toyota KDH (Flat Roof)',
        price: 24500,
        status: 'Completed',
        date: '2026-01-22',
        time: '09:15'
    },
    {
        id: 'b4',
        customerName: 'Li Wei',
        pickupLocation: 'Cinnamon Grand, Colombo',
        dropLocation: 'Sigiriya Rock Fortress',
        vehicleType: 'Toyota Axio',
        price: 28000,
        status: 'Driver Assigned',
        date: '2026-01-23',
        time: '06:00'
    },
    {
        id: 'b5',
        customerName: 'Sarah Jenkins',
        pickupLocation: 'Hikka Tranz by Cinnamon',
        dropLocation: 'Bandaranaike International Airport (BIA)',
        vehicleType: 'Toyota Prius (Sedan)',
        price: 18500,
        status: 'Pending Driver',
        date: '2026-01-24',
        time: '10:00'
    },
    {
        id: 'b6',
        customerName: 'David Miller',
        pickupLocation: 'Bandaranaike International Airport (BIA)',
        dropLocation: 'Shangri-La Hambantota',
        vehicleType: 'Toyota Commuter (High Roof)',
        price: 45000,
        status: 'Completed',
        date: '2026-01-21',
        time: '23:00'
    },
    {
        id: 'b7',
        customerName: 'Elena Petrova',
        pickupLocation: 'Galle Fort Hotel',
        dropLocation: 'Cinnamon Lakeside, Colombo',
        vehicleType: 'Toyota Axio',
        price: 16000,
        status: 'Driver Assigned',
        date: '2026-01-23',
        time: '16:00'
    },
    {
        id: 'b8',
        customerName: 'Kenji Sato',
        pickupLocation: 'Bandaranaike International Airport (BIA)',
        dropLocation: 'Araliya Green Hills, Nuwara Eliya',
        vehicleType: 'Toyota KDH (Flat Roof)',
        price: 32000,
        status: 'Pending Driver',
        date: '2026-01-25',
        time: '11:00'
    }
];
