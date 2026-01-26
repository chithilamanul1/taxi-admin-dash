export interface Tour {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    includes: string[];
    image: string;
}

export interface Vehicle {
    id: string;
    name: string;
    type: string;
    ratePerKm: number;
    capacity: number;
}

export interface Booking {
    id: string;
    customerName: string;
    pickup: string;
    dropoff: string;
    vehicleType: string;
    status: 'Pending Driver' | 'Driver Assigned' | 'Completed';
    date: string;
    price: number;
}

export const TOURS: Tour[] = [
    {
        id: 't1',
        title: 'Kandy Day Tour',
        description: 'Explore the Sacred Tooth Relic Temple and Botanical Gardens in the hill capital.',
        price: 25000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Lunch', 'Entrance Fees'],
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162'
    },
    {
        id: 't2',
        title: 'Yala Safari Adventure',
        description: 'Leopard spotting and wildlife safari in Sri Lanka\'s most famous national park.',
        price: 35000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', '4x4 Jeep Safari', 'Driver/Guide', 'Park Entry'],
        image: 'https://images.unsplash.com/photo-1528120369764-0423708119ae'
    },
    {
        id: 't3',
        title: 'Colombo City Tour',
        description: 'Visit Gangarama Temple, Independence Square, and the vibrant Pettah market.',
        price: 15000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Snacks'],
        image: 'https://images.unsplash.com/photo-1625413063529-684a0c8edeed'
    },
    {
        id: 't4',
        title: 'Galle Fort Visit',
        description: 'Walk the ramparts of the historic Dutch Fort, a UNESCO World Heritage site.',
        price: 22000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Bottled Water'],
        image: 'https://images.unsplash.com/photo-1588600181512-caabc7644383'
    },
    {
        id: 't5',
        title: 'Sigiriya Rock Fortress',
        description: 'Climb the 5th-century rock fortress and witness the ancient frescoes.',
        price: 28000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'All Taxes'],
        image: 'https://images.unsplash.com/photo-1544015759-4081031d2836'
    },
    {
        id: 't6',
        title: 'Nuwara Eliya Tea Trails',
        description: 'Visit tea factories and enjoy the "Little England" of the highlands.',
        price: 30000,
        currency: 'LKR',
        duration: '1 Day',
        includes: ['AC Vehicle', 'English Speaking Driver', 'Tea Tasting'],
        image: 'https://images.unsplash.com/photo-1544015759-4081031d2836'
    }
];

export const FLEET: Vehicle[] = [
    { id: 'v1', name: 'Toyota Prius (Sedan)', type: 'Hybrid', ratePerKm: 120, capacity: 3 },
    { id: 'v2', name: 'Toyota KDH (Flat Roof)', type: 'Van', ratePerKm: 180, capacity: 7 },
    { id: 'v3', name: 'Suzuki Wagon R', type: 'Compact', ratePerKm: 100, capacity: 3 },
    { id: 'v4', name: 'Toyota Allion', type: 'Sedan', ratePerKm: 110, capacity: 3 },
    { id: 'v5', name: 'Toyota KDH (High Roof)', type: 'Luxury Van', ratePerKm: 200, capacity: 14 }
];

export const ACTIVE_BOOKINGS: Booking[] = [
    { id: 'b1', customerName: 'Alice Johnson', pickup: 'BIA (Airport)', dropoff: 'Taj Samudra, Colombo', vehicleType: 'Toyota Prius', status: 'Driver Assigned', date: '2026-01-23', price: 9500 },
    { id: 'b2', customerName: 'Bob Smith', pickup: 'Marino Beach Hotel', dropoff: 'BIA (Airport)', vehicleType: 'Suzuki Wagon R', status: 'Pending Driver', date: '2026-01-23', price: 7500 },
    { id: 'b3', customerName: 'Li Wei', pickup: 'BIA (Airport)', dropoff: 'The Grand Hotel, Nuwara Eliya', vehicleType: 'Toyota KDH', status: 'Completed', date: '2026-01-22', price: 32000 },
    { id: 'b4', customerName: 'Hans Müller', pickup: 'Kingsbury Hotel', dropoff: 'Galle Fort', vehicleType: 'Toyota Allion', status: 'Driver Assigned', date: '2026-01-24', price: 18000 },
    { id: 'b5', customerName: 'Yuki Tanaka', pickup: 'BIA (Airport)', dropoff: 'Anantara Peace Haven, Tangalle', vehicleType: 'Toyota KDH Luxury', status: 'Pending Driver', date: '2026-01-25', price: 45000 },
    { id: 'b6', customerName: 'Carlos Garcia', pickup: 'Cinnamon Grand', dropoff: 'Sigiriya Rock', vehicleType: 'Toyota Prius', status: 'Completed', date: '2026-01-21', price: 28000 },
    { id: 'b7', customerName: 'Emma Watson', pickup: 'Galle Face Hotel', dropoff: 'BIA (Airport)', vehicleType: 'Suzuki Wagon R', status: 'Driver Assigned', date: '2026-01-23', price: 8000 },
    { id: 'b8', customerName: 'Sanjay Gupta', pickup: 'BIA (Airport)', dropoff: 'Kandy City Centre', vehicleType: 'Toyota KDH', status: 'Pending Driver', date: '2026-01-24', price: 22000 }
];
