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
        image: '/tours/maduriver.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wadduwa', 'Kalutara'],
        destinations: ['Bentota', 'Madu Ganga', 'Hikkaduwa', 'Galle Fort'],
        highlights: [
            'Bentota Beach photo stop',
            'Kosgoda Sea Turtle Conservation visit',
            'Madu Ganga boat cruise (1.5 hours)',
            'Hikkaduwa Beach visit',
            'Galle Fort sightseeing & sunset'
        ],
        description: 'Experience the best of Sri Lanka\'s southern coast in one day. Visit turtle hatcheries, cruise through mangroves, and explore the historic Galle Fort.',
        itinerary: [
            { day: 1, title: 'South Coast Adventure', desc: 'Depart from Colombo and head to Bentota. Visit the Sea Turtle Conservation project, enjoy a boat safari on Madu River, proceed to Hikkaduwa details, and finally explore the Dutch Galle Fort.' }
        ]
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
        destinations: ['Pinnawala', 'Kandy', 'Peradeniya'],
        highlights: [
            'Pinnawala Elephant Orphanage',
            'Temple of the Tooth Relic',
            'Royal Botanical Gardens',
            'Kandy Lake viewpoint',
            'Gem Museum visit'
        ],
        description: 'Discover the cultural heart of Sri Lanka with visits to the sacred Temple of the Tooth, elephant orphanage, and the beautiful hill city of Kandy.',
        itinerary: [
            { day: 1, title: 'Hill Country Capital', desc: 'Visit the Pinnawala Elephant Orphanage to feed elephants. Proceed to Kandy to visit the Royal Botanical Gardens and the Sacred Temple of the Tooth Relic.' }
        ]
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
        destinations: ['Sigiriya', 'Dambulla', 'Minneriya/Kaudulla'],
        highlights: [
            'Sigiriya Lion Rock climb',
            'Dambulla Cave Temple',
            'Village safari experience',
            'Traditional Sri Lankan lunch',
            'Wildlife viewing'
        ],
        description: 'Climb the iconic Sigiriya Lion Rock, explore ancient cave temples, and enjoy a wildlife safari - all in one incredible day trip.',
        itinerary: [
            { day: 1, title: 'Ancient Kingdoms & Wildlife', desc: 'Visit the Dambulla Cave Temple. Climb the Sigiriya Lion Rock fortress. Enjoy a village safari with traditional lunch and a wildlife jeep safari.' }
        ]
    },
    {
        id: 'sigiriya-dambulla-minneriya-private',
        title: 'From Colombo | Negombo: Sigiriya, Dambulla and Minneriya Day Trip',
        type: 'private tour',
        duration: '24 hours',
        price: 114.20,
        originalPrice: 127,
        currency: 'USD',
        tags: ['Small Groups', '10% Off'],
        image: '/tours/sigiriya2.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wennappuwa'],
        destinations: ['Sigiriya', 'Minneriya', 'Dambulla'],
        highlights: [
            'Sigiriya Lion Rock (2.5 hours)',
            'Minneriya National Park safari (4 hours)',
            'Dambulla Cave Temple',
            'Elephant gathering (seasonal)',
            'Professional guide'
        ],
        description: 'The ultimate cultural and wildlife experience combining Sigiriya, ancient temples, and the famous elephant gathering at Minneriya.',
        itinerary: [
            { day: 1, title: 'Full Day Expedition', desc: 'Climb Sigiriya Rock, take a 4x4 safari in Minneriya National Park to see wild elephants, and visit the Dambulla Golden Temple.' }
        ]
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
        image: '/tours/sigiriya3.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wennappuwa'],
        destinations: ['Sigiriya', 'Dambulla'],
        highlights: [
            'Private vehicle & guide',
            'Dambulla breakfast stop',
            'Cave Temple exploration',
            'Sigiriya Rock guided climb',
            'Traditional lunch break'
        ],
        description: 'A private, flexible tour to Sri Lanka\'s most famous UNESCO sites. Climb the rock fortress and explore the golden caves with your own guide.',
        itinerary: [
            { day: 1, title: 'UNESCO Heritage Tour', desc: 'Private transfer to Sigiriya and Dambulla. Climb the rock fortress and explore the ancient cave temple complex at your own pace.' }
        ]
    },
    {
        id: 'colombo-galle-bentota-day-trip',
        title: 'Colombo: Galle and Bentota Day Trip From Colombo City',
        type: 'private tour',
        duration: '14 hours',
        price: 70.25,
        originalPrice: 74.00,
        currency: 'USD',
        tags: ['New activity', 'Private'],
        image: '/tours/galle.jpg',
        pickupLocations: ['Colombo', 'Dehiwala', 'Mount Lavinia', 'Negombo'],
        destinations: ['Bentota', 'Madu River', 'Galle'],
        highlights: [
            'Bentota Beach visit',
            'Kosgoda Sea Turtle Conservation',
            'Madu Ganga boat safari (1 hour)',
            'Hikkaduwa Beach photo stop',
            'Galle Fort guided walk'
        ],
        description: 'A comprehensive day tour covering the best of the South Coast: turtles, boat safaris, pristine beaches, and colonial history.',
        itinerary: [
            { day: 1, title: 'Southern Coast Highlights', desc: 'Visit Bentota Beach, Kosgoda Turtle Hatchery, Madu River Boat Safari, and the UNESCO World Heritage Galle Fort.' }
        ]
    },
    {
        id: 'colombo-city-tour',
        title: 'Colombo Full day city tour',
        type: 'day trip',
        duration: '6 hours',
        price: 39.00,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity'],
        image: '/tours/colombo.jpg',
        pickupLocations: ['Colombo City Limits'],
        destinations: ['Colombo City'],
        highlights: [
            'Independence Square',
            'Gangaramaya Temple',
            'Colombo Lotus Tower',
            'Old Parliament & Lighthouse',
            'Shopping at Pettah/City Centre'
        ],
        description: 'Discover the vibrant capital of Colombo. Visit historic landmarks, modern attractions, and enjoy some shopping in this guided city tour.',
        itinerary: [
            { day: 1, title: 'Colombo City Tour', desc: 'Sightseeing in Colombo including Independence Square, Gangaramaya Temple, BMICH, and shopping at Odel or Pettah market.' }
        ]
    },
    {
        id: 'colombo-private-shopping',
        title: 'Colombo Private Day Tour and Shopping',
        type: 'private tour',
        duration: 'Flex',
        price: 26.25,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity'],
        image: '/tours/colombo2.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Kalutara', 'Galle', 'Bentota'],
        destinations: ['Colombo'],
        highlights: [
            'Customizable itinerary',
            'Independence Square',
            'Jami Ul-Alfar Mosque (Red Mosque)',
            'Shopping Malls & Markets',
            'City sightseeing'
        ],
        description: 'A flexible private tour focused on Colombo\'s highlights and best shopping spots. Perfect for finding souvenirs and seeing the city sights.',
        itinerary: [
            { day: 1, title: 'Shopping & Sightseeing', desc: 'Customizable city tour focusing on shopping hotspots and key landmarks like the Red Mosque and Independence Square.' }
        ]
    },
    {
        id: 'negombo-southern-coast',
        title: 'From Negombo: Southern Coast Highlights Private Day Tour',
        type: 'private tour',
        duration: '12 hours',
        price: 120.00,
        originalPrice: null,
        currency: 'USD',
        tags: ['Pickup available', 'New activity'],
        image: '/tours/galle2.jpg',
        pickupLocations: ['Negombo'],
        destinations: ['Handunugoda', 'Ahangama', 'Galle'],
        highlights: [
            'Handunugoda Tea Estate',
            'Ahangama stilt fishermen',
            'Galle Fort lunch & tour',
            'Kosgoda Turtle Conservation',
            'Scenic coastal drive'
        ],
        description: 'Depart from Negombo to explore the southern coast\'s tea estates, stilt fishermen, and the magnificent Galle Fort.',
        itinerary: [
            { day: 1, title: 'Tea, Stick Fishermen & Fort', desc: 'Visit the Handunugoda Tea Estate (Virgin White Tea), see stilt fishermen, and explore the Galle Dutch Fort.' }
        ]
    },
    {
        id: 'negombo-sigiriya-safari',
        title: 'From Negombo: Sigiriya Dambulla and Village Safari Day Tour',
        type: 'private tour',
        duration: 'Full Day',
        price: 80.00,
        originalPrice: 89.00,
        currency: 'USD',
        tags: ['New activity'],
        image: '/tours/sigiriya4.jpg',
        pickupLocations: ['Negombo'],
        destinations: ['Sigiriya', 'Habarana', 'Minneriya'],
        highlights: [
            'Sigiriya Lion Rock sunrise/visit',
            'Habarana village walk',
            'Minneriya National Park Safari',
            'Dambulla Royal Cave Temple'
        ],
        description: 'An action-packed day from Negombo features ancient fortress climbing, a village safari experience, and wildlife watching.',
        itinerary: [
            { day: 1, title: 'Adventure Trio', desc: 'Climb Sigiriya, enjoy a traditional village lunch and safari, and visit the Dambulla Cave Temple.' }
        ]
    },
    {
        id: 'ambuluwawa-kandy',
        title: 'From Negombo: Ambuluwawa Tower & Tea Factory, Kandy Day Trip',
        type: 'private tour',
        duration: '15 hours',
        price: 67.55,
        originalPrice: 77.35,
        currency: 'USD',
        tags: ['New activity'],
        image: '/tours/ambuluwawa.jpg',
        pickupLocations: ['Negombo', 'Katunayake', 'Waikkal'],
        destinations: ['Ambuluwawa', 'Pinnawala', 'Kandy'],
        highlights: [
            'Pinnawala Elephant Orphanage',
            'Ambuluwawa Tower climb',
            'Tea Factory & Museum',
            'Temple of the Tooth Relic',
            'Kandy City Viewpoint'
        ],
        description: 'Visit the biodiversity complex of Ambuluwawa Tower, see the elephants at Pinnawala, and explore the sacred city of Kandy.',
        itinerary: [
            { day: 1, title: 'Nature & Culture', desc: 'Visit the unique Ambuluwawa Tower, Pinnawala Elephant Orphanage, a Tea Factory, and Kandy Temple.' }
        ]
    },
    {
        id: 'colombo-negombo-galle-mirissa',
        title: 'Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour',
        type: 'private tour',
        duration: '8-10 hours',
        price: 94.56,
        originalPrice: 105.18,
        currency: 'USD',
        tags: ['New activity'],
        image: '/tours/galle3.jpg',
        pickupLocations: ['Negombo', 'Colombo'],
        destinations: ['Madu River', 'Unawatuna', 'Galle', 'Mirissa'],
        highlights: [
            'Madu Ganga River Safari',
            'Kosgoda Turtle Hatchery',
            'Unawatuna Beach',
            'Galle Fort exploration',
            'Mirissa optional stop'
        ],
        description: 'A perfect coastal getaway visiting the best beaches and cultural sites of the south, including a river safari and colonial fort visit.',
        itinerary: [
            { day: 1, title: 'Coastal Splendor', desc: 'River safari, turtle hatchery, Unawatuna Beach, Galle Fort, and optional visit to Mirissa.' }
        ]
    }
];

// Combine into a main export if needed, or just export dayTrips as tourPackages
export const tourPackages = dayTrips;
