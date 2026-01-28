// Day Trips and Tour Packages Data
// Sourced from airporttaxis.lk

export const dayTrips = [
    {
        id: 'galle-bentota-day-tour',
        title: 'Galle and Bentota Day-Tour From Colombo',
        type: 'water activity',
        duration: '12 hours',
        price: 59,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available'],
        image: '/tours/galle-bentota.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wadduwa', 'Kalutara'],
        highlights: [
            'Bentota Beach photo stop',
            'Kosgoda Sea Turtle Conservation visit',
            'Madu Ganga boat cruise (1.5 hours)',
            'Hikkaduwa Beach visit',
            'Galle Fort sightseeing & sunset'
        ],
        description: 'Experience the best of Sri Lanka\'s southern coast in one day. Visit turtle hatcheries, cruise through mangroves, and explore the historic Galle Fort.'
    },
    {
        id: 'kandy-pinnawala-day-trip',
        title: 'From Colombo: Day Trip to Kandy | Pinnawala | Royal Gardens',
        type: 'day trip',
        duration: '13 hours',
        price: 50.63,
        originalPrice: 102.26,
        currency: 'USD',
        tags: ['Pickup available', 'New activity', '50% Off'],
        image: '/tours/kandy.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Wadduwa', 'Mount Lavinia'],
        highlights: [
            'Pinnawala Elephant Orphanage',
            'Temple of the Tooth Relic',
            'Royal Botanical Gardens',
            'Kandy Lake viewpoint',
            'Gem Museum visit'
        ],
        description: 'Discover the cultural heart of Sri Lanka with visits to the sacred Temple of the Tooth, elephant orphanage, and the beautiful hill city of Kandy.'
    },
    {
        id: 'sigiriya-dambulla-safari',
        title: 'From Colombo: Sigiriya and Dambulla Day Trip and Safari',
        type: 'day trip',
        duration: '14-16 hours',
        price: 69,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available'],
        image: '/tours/sigiriya.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Kalutara', 'Bentota', 'Hikkaduwa', 'Galle'],
        highlights: [
            'Sigiriya Lion Rock climb',
            'Dambulla Cave Temple',
            'Village safari experience',
            'Traditional Sri Lankan lunch',
            'Wildlife viewing'
        ],
        description: 'Climb the iconic Sigiriya Lion Rock, explore ancient cave temples, and enjoy a wildlife safari - all in one incredible day trip.'
    },
    {
        id: 'sigiriya-dambulla-minneriya',
        title: 'From Colombo | Negombo: Sigiriya, Dambulla and Minneriya Day Trip',
        type: 'private tour',
        duration: '24 hours',
        price: 114.20,
        originalPrice: 127,
        currency: 'USD',
        tags: ['Small Groups', '10% Off'],
        image: '/tours/sigiriya-minneriya.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wennappuwa'],
        highlights: [
            'Sigiriya Lion Rock (2.5 hours)',
            'Minneriya National Park safari (4 hours)',
            'Dambulla Cave Temple',
            'Elephant gathering (seasonal)',
            'Professional guide'
        ],
        description: 'The ultimate cultural and wildlife experience combining Sigiriya, ancient temples, and the famous elephant gathering at Minneriya.'
    },
    {
        id: 'private-sigiriya-dambulla',
        title: 'Private Sigiriya and Dambulla Day Tour from Colombo',
        type: 'private tour',
        duration: '14 hours',
        price: 94,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'Private'],
        image: '/tours/sigiriya-private.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wennappuwa'],
        highlights: [
            'Private vehicle & guide',
            'Dambulla breakfast stop',
            'Cave Temple exploration',
            'Sigiriya Rock guided climb',
            'Local village lunch experience'
        ],
        description: 'Exclusive private tour to Sri Lanka\'s most iconic UNESCO sites with personal guide and flexible itinerary.'
    },
    {
        id: 'colombo-galle-bentota-private',
        title: 'Colombo: Galle and Bentota Day Trip From Colombo City',
        type: 'private tour',
        duration: '14 hours',
        price: 70.25,
        originalPrice: 74,
        currency: 'USD',
        tags: ['New activity', '5% Off'],
        image: '/tours/galle-private.jpg',
        pickupLocations: ['Colombo', 'Dehiwala', 'Mount Lavinia', 'Negombo'],
        highlights: [
            'Bentota Beach',
            'Kosgoda Turtle Conservation',
            'Madu River boat ride',
            'Hikkaduwa Beach',
            'Galle Fort walking tour'
        ],
        description: 'Private tour along the stunning southern coastline with beach stops, turtle sanctuary, river cruise, and historic fort exploration.'
    },
    {
        id: 'colombo-city-tour',
        title: 'Colombo Full Day City Tour',
        type: 'day trip',
        duration: '6 hours',
        price: 39,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity', 'Budget Friendly'],
        image: '/tours/colombo.jpg',
        pickupLocations: ['Colombo', 'Negombo'],
        highlights: [
            'Independence Square',
            'Gangaramaya Temple',
            'Colombo Lotus Tower',
            'Galle Face Green',
            'Pettah Market'
        ],
        description: 'Explore Sri Lanka\'s vibrant capital city - from colonial architecture to modern landmarks and bustling markets.'
    },
    {
        id: 'colombo-shopping-tour',
        title: 'Colombo Private Day Tour and Shopping',
        type: 'private tour',
        duration: '24 hours',
        price: 26.25,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity', 'Best Value'],
        image: '/tours/colombo-shopping.jpg',
        pickupLocations: ['Colombo', 'Mirissa', 'Negombo', 'Galle', 'Bentota', 'Kandy', 'Hikkaduwa'],
        highlights: [
            'Independence Square',
            'Gangaramaya Temple',
            'Old Parliament House',
            'Red Mosque (Jami Ul-Alfar)',
            'Colombo Lotus Tower',
            'Shopping time included'
        ],
        description: 'Perfect combination of sightseeing and shopping in Colombo with pickup from anywhere in Sri Lanka.'
    },
    {
        id: 'negombo-southern-coast',
        title: 'From Negombo: Southern Coast Highlights Private Day Tour',
        type: 'private tour',
        duration: '12 hours',
        price: 120,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity', 'Premium'],
        image: '/tours/southern-coast.jpg',
        pickupLocations: ['Negombo'],
        highlights: [
            'Handunugoda Tea Estate (Virgin White Tea)',
            'Ahangama stilt fishermen',
            'Galle Fort guided tour',
            'Kosgoda Turtle Conservation',
            'Scenic coastal drive'
        ],
        description: 'Premium private tour of Sri Lanka\'s beautiful southern coast with tea estate visit, marine life, and historic fortress.'
    },
    {
        id: 'negombo-sigiriya-village',
        title: 'From Negombo: Sigiriya Dambulla and Village Safari Day Tour',
        type: 'private tour',
        duration: '24 hours',
        price: 80,
        originalPrice: 89,
        currency: 'USD',
        tags: ['New activity', '10% Off'],
        image: '/tours/sigiriya-village.jpg',
        pickupLocations: ['Negombo'],
        highlights: [
            'Sigiriya sunrise climb',
            'Habarana village experience',
            'Minneriya wildlife safari',
            'Dambulla Cave Temple',
            'Traditional food tasting'
        ],
        description: 'Experience authentic Sri Lankan village life combined with ancient wonders and incredible wildlife.'
    },
    {
        id: 'ambuluwawa-kandy',
        title: 'From Negombo: Ambuluwawa Tower & Tea Factory, Kandy Day Trip',
        type: 'private tour',
        duration: '15 hours',
        price: 67.55,
        originalPrice: 77.35,
        currency: 'USD',
        tags: ['New activity', '13% Off'],
        image: '/tours/ambuluwawa.jpg',
        pickupLocations: ['Negombo', 'Katunayake', 'Seeduwa', 'Waikkal', 'Kochchikade'],
        highlights: [
            'Pinnawala Elephant Orphanage',
            'Ambuluwawa Tower (spiral staircase)',
            'Ceylon Tea Factory tour',
            'Gem Museum visit',
            'Temple of the Tooth Relic',
            'Kandy Lake viewpoint'
        ],
        description: 'Unique day trip combining the stunning Ambuluwawa Tower with Kandy\'s cultural treasures and elephant encounters.'
    },
    {
        id: 'galle-hikkaduwa-mirissa',
        title: 'Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour',
        type: 'private tour',
        duration: '8 hours',
        price: 94.56,
        originalPrice: 105.18,
        currency: 'USD',
        tags: ['New activity', '10% Off'],
        image: '/tours/mirissa.jpg',
        pickupLocations: ['Negombo', 'Colombo'],
        highlights: [
            'Madu River boat cruise',
            'Kosgoda Turtle Conservation',
            'Unawatuna Beach lunch',
            'Galle Fort exploration',
            'Secret beach stop'
        ],
        description: 'Discover Sri Lanka\'s most beautiful beaches from Hikkaduwa to Mirissa with historic Galle Fort.'
    }
];

export const tourPackages = [
    {
        id: '6-days-cultural',
        title: '06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo',
        duration: '6 Days / 5 Nights',
        price: 300,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/6-days-cultural.jpg',
        mapImage: '/tours/map-6-days.png', // Added map image
        destinations: ['Kandy', 'Sigiriya', 'Colombo'],
        highlights: [
            'Temple of the Tooth Relic',
            'Sigiriya Rock Fortress',
            'Dambulla Cave Temple',
            'Colombo city tour',
            'Tea plantation visit'
        ],
        includes: [
            '5 nights accommodation',
            'Daily breakfast',
            'Private AC vehicle',
            'English-speaking driver',
            'All entrance fees',
            'Meeting at the airport upon arrival and assistance during the stay',
            'Transportation by air-conditioned vehicle according to the itinerary',
            'Service of an English Speaking chauffeur up to 6 pax and Guide service included from 7 pax onwards',
            'Accommodation at the Hotels as selected by you',
            'Meal plan according to the itinerary',
            'Two water bottles per day during tour'
        ],
        itinerary: [
            {
                day: 1,
                title: 'Airport - Pinnawala - Kandy',
                description: 'Upon arrival at Bandaranaike International Airport you will be greeted by the Airport Representative and Professional Chauffeur Guide at the arrival lounge. Then you will act out for Kandy. En route visit Pinnawala Elephant Orphanage. (Approx: 3 hours) Check in to the Hotel in Kandy. In the evening witness a cultural dance performance and visit the Temple of the Tooth Relic. Dinner and overnight stay at Kandy.'
            },
            {
                day: 2,
                title: 'Kandy - Matale - Sigiriya',
                description: 'After breakfast leave for Sigiriya. En route visit a Spice Garden in Matale to see different spices for which Sri Lanka is famous for. Witness a Cookery demonstration. Proceed to Sigiriya. Afternoon climb the Sigiriya Lion Rock Fortress. Dinner and overnight stay at Sigiriya.'
            },
            {
                day: 3,
                title: 'Sigiriya - Polonnaruwa - Sigiriya',
                description: 'After breakfast proceed to Polonnaruwa. Visit the ancient city of Polonnaruwa (A UNESCO World Heritage Site). Return to hotel. Afternoon take a jeep safari comfortably through the Kaudulla or Minneriya National Parks to see the elephants and other wild animals. Dinner and overnight stay at Sigiriya.'
            },
            {
                day: 4,
                title: 'Sigiriya - Dambulla - Colombo',
                description: 'After breakfast leave for Colombo. En route visit Dambulla Cave Temple. (Golden Temple). Proceed to Colombo. Check in to the hotel. Evening at leisure or small city tour / shopping. Dinner and overnight stay at Colombo.'
            },
            {
                day: 5,
                title: 'Colombo - Airport',
                description: 'After breakfast proceed to the airport for your departure flight. (Approx: 45 mins)'
            },
            {
                day: 6,
                title: 'End of Tour',
                description: 'End of services. We wish you a safe flight back home.'
            }
        ],
        description: 'Perfect introduction to Sri Lanka covering the cultural triangle, hill country, and capital city.'
    },
    {
        id: '10-days-northern',
        title: 'Sri Lanka Classic & Northern Tour - 10 Days | 09 Nights',
        duration: '10 Days / 9 Nights',
        price: 350,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/10-days-northern.jpg',
        destinations: ['Colombo', 'Jaffna', 'Anuradhapura', 'Sigiriya', 'Kandy'],
        highlights: [
            'Jaffna Peninsula exploration',
            'Anuradhapura ancient city',
            'Sigiriya Rock climb',
            'Kandy cultural sites',
            'Northern cuisine experience'
        ],
        includes: [
            '9 nights accommodation',
            'Daily breakfast',
            'Private AC vehicle',
            'Ferry crossing to islands',
            'All entrance fees'
        ],
        description: 'Comprehensive tour including the culturally rich Northern Province rarely visited by tourists.'
    },
    {
        id: '8-days-kandy-bentota',
        title: '08 Days Tour - Kandy, Nuwara Eliya & Bentota',
        duration: '8 Days / 7 Nights',
        price: 450,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/8-days-hills.jpg',
        destinations: ['Kandy', 'Nuwara Eliya', 'Bentota'],
        highlights: [
            'Scenic train ride to hill country',
            'Tea plantation experience',
            'Horton Plains National Park',
            'Beach relaxation at Bentota',
            'Water sports activities'
        ],
        includes: [
            '7 nights accommodation',
            'Daily breakfast',
            'Train tickets',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'From misty mountains to sunny beaches - experience Sri Lanka\'s incredible diversity.'
    },
    {
        id: '10-days-east-coast',
        title: '10 Days - Nature, Culture & East Coast',
        duration: '10 Days / 9 Nights',
        price: 450,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/10-days-east.jpg',
        destinations: ['Colombo', 'Sigiriya', 'Trincomalee', 'Kandy'],
        highlights: [
            'Sigiriya Rock Fortress',
            'Trincomalee beaches',
            'Pigeon Island snorkeling',
            'Whale watching (seasonal)',
            'Hot water wells at Kanniya'
        ],
        includes: [
            '9 nights accommodation',
            'Daily breakfast',
            'Snorkeling equipment',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'Explore Sri Lanka\'s unspoiled eastern coast combined with cultural triangle highlights.'
    },
    {
        id: '12-days-complete',
        title: 'Sri Lanka Culture Nature Tour - 12 Days | 11 Nights',
        duration: '12 Days / 11 Nights',
        price: 750,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/12-days-complete.jpg',
        destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Yala', 'Galle'],
        highlights: [
            'Complete cultural triangle',
            'Nine Arch Bridge',
            'Yala Safari',
            'Galle Fort',
            'Southern beaches'
        ],
        includes: [
            '11 nights accommodation',
            'Daily breakfast',
            'Safari jeep',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'The ultimate Sri Lanka experience covering every major attraction in comfort and style.'
    },
    {
        id: '5-days-highlights',
        title: '05 Days | 04 Nights - Kandy, Nuwara Eliya, Bentota, Colombo',
        duration: '5 Days / 4 Nights',
        price: 450,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/5-days-highlights.jpg',
        destinations: ['Kandy', 'Nuwara Eliya', 'Bentota', 'Colombo'],
        highlights: [
            'Temple of the Tooth',
            'Tea country experience',
            'Beach time at Bentota',
            'Colombo shopping'
        ],
        includes: [
            '4 nights accommodation',
            'Daily breakfast',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'Short but comprehensive tour perfect for travelers with limited time.'
    },
    {
        id: '10-days-ramayana',
        title: '10 Days | 09 Nights Ramayana Trail Tour',
        duration: '10 Days / 9 Nights',
        price: 450,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/ramayana-tour.jpg',
        destinations: ['Colombo', 'Negombo', 'Munneswaram', 'Trincomalee', 'Kandy', 'Nuwara Eliya'],
        highlights: [
            'Ashok Vatika (Sita Eliya)',
            'Munneswaram Temple',
            'Koneswaram Temple',
            'Divurumpola (Sita\'s trial)',
            'Ravana Falls & Cave'
        ],
        includes: [
            '9 nights accommodation',
            'Daily breakfast',
            'Temple offerings included',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'Follow the epic Ramayana trail across Sri Lanka visiting sacred sites connected to the ancient legend.'
    },
    {
        id: '7-days-buddhist',
        title: '07 Days | 06 Nights Buddhist Cultural Tour',
        duration: '7 Days / 6 Nights',
        price: 450,
        currency: 'USD',
        priceType: 'Per Person',
        image: '/tours/buddhist-tour.jpg',
        destinations: ['Colombo', 'Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Kandy'],
        highlights: [
            'Sri Maha Bodhi tree',
            'Polonnaruwa ancient city',
            'Dambulla Cave Temple',
            'Temple of the Tooth Relic',
            'Meditation experience'
        ],
        includes: [
            '6 nights accommodation',
            'Daily breakfast',
            'Monastery visit',
            'Private AC vehicle',
            'All entrance fees'
        ],
        description: 'Spiritual journey through Sri Lanka\'s most sacred Buddhist sites and temples.'
    }
];

// Helper function to get tours by category
export const getToursByType = (type) => {
    return dayTrips.filter(trip => trip.type === type);
};

// Get featured tours (those with discounts)
export const getFeaturedTours = () => {
    return dayTrips.filter(trip => trip.originalPrice !== null);
};

// Get budget-friendly tours (under $50)
export const getBudgetTours = () => {
    return dayTrips.filter(trip => trip.price < 50);
};
