// Day Trips and Tour Packages Data
// Sourced from dynamic catalog

export const dayTrips = [
    {
        id: 'galle-bentota-day-tour',
        title: 'Galle and Bentota Day-Tour From Colombo',
        duration: '12 hours',
        price: { amount: 59, currency: 'USD' },
        category: 'Leisure & History',
        tags: ['Coastal', 'Family Friendly', 'Wildlife'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wadduwa', 'Kalutara'],
        destinations: ['Bentota', 'Madu Ganga', 'Hikkaduwa', 'Galle Fort'],
        highlights: [
            'Madu Ganga Boat Safari through Mangroves',
            'UNESCO World Heritage Site: Galle Dutch Fort',
            'Sea Turtle Hatchery & Conservation Center',
            'Coastal Scenic Train/Drive Experience',
            'Authentic Sri Lankan Lunch by the Sea'
        ],
        description: 'Experience the magic of Sri Lanka\'s southern coast. This full-day journey takes you from the bustling streets of Colombo to the serene mangroves of the Madu River, the historic ramparts of Galle Fort, and the delicate conservation efforts at a turtle hatchery. Perfect for families and couples alike.',
        itinerary: [
            {
                day: 1,
                title: 'South Coast Exploration',
                description: 'Your day begins with a comfortable pickup in a private AC vehicle at 7:30 AM. We head towards Bentota for a scenic boat safari on the Madu Ganga River (1.5 hours), exploring hidden island temples and cinnamon gardens. After a refreshing herbal tea, we visit a turtle hatchery in Kosgoda where you can learn about conservation and see different species of turtles. The afternoon is spent walking through the cobblestone streets of Galle Fort, enjoying the colonial architecture, lunch at a premium restaurant, and sunset views over the Indian Ocean before returning to Colombo.'
            }
        ],
        experience: [
            { time: '07:30 AM', activity: 'Hotel Pickup (Colombo/Negombo)', icon: 'MapPin' },
            { time: '09:30 AM', activity: 'Madu River Boat Safari', icon: 'Ship' },
            { time: '11:00 AM', activity: 'Turtle Hatchery Visit', icon: 'Heart' },
            { time: '01:00 PM', activity: 'Lunch at Galle Fort', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Guided Tour of Galle Fort', icon: 'Castle' },
            { time: '04:30 PM', activity: 'Hikkaduwa Beach View', icon: 'Camera' },
            { time: '07:30 PM', activity: 'Drop back to Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Air-Conditioned Vehicle',
            'Hospitality from a Professional Driver-Guide',
            'Fuel, Tolls, and Parking Fees',
            'Hotel Pickup and Drop-off',
            'Daily Bottled Water'
        ],
        excludes: [
            'Entrance fees to sites (Galle Fort is free)',
            'Lunch and Personal expenses',
            'Tips for Driver-Guide'
        ],
        notSuitable: [
            'People with severe mobility issues'
        ],
        notAllowed: [
            'Smoking in the vehicle',
            'Littering at historic sites'
        ]
    },
    {
        id: 'kandy-pinnawala-day-trip',
        title: 'Kandy & Pinnawala Cultural Day Tour',
        type: 'day trip',
        duration: '13 hours',
        price: { amount: 50.63, currency: 'USD' },
        category: 'Culture & Nature',
        tags: ['Sacred', 'Wildlife', 'Historical'],
        image: '/kandy-new.png',
        pickupLocations: ['Colombo', 'Negombo', 'Wadduwa', 'Mount Lavinia'],
        destinations: ['Pinnawala', 'Kandy', 'Peradeniya'],
        highlights: [
            'Witness Baby Elephants at Pinnawala Orphanage',
            'Sacred Temple of the Tooth Relic (Dalada Maligawa)',
            'Royal Botanical Gardens, Peradeniya',
            'Kandy Lake & Viewpoint Walk',
            'Traditional Kandyan Cultural Dance'
        ],
        description: 'Immerse yourself in the heart of Sri Lankan culture and nature. This tour offers a blend of wildlife interaction, botanical beauty, and spiritual enlightenment in the hill capital of Kandy.',
        itinerary: [
            {
                day: 1,
                title: 'The Hill Capital Journey',
                description: 'Starting early from Colombo, our first stop is Pinnawala Elephant Orphanage to watch these majestic creatures bathing in the river. We then proceed to Kandy for a visit to the Royal Botanical Gardens, home to over 4,000 species of plants. The afternoon is dedicated to the Temple of the Tooth Relic, followed by an evening cultural show featuring traditional drums and fire walking. We return to Colombo after dinner.'
            }
        ],
        experience: [
            { time: '06:30 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '08:30 AM', activity: 'Pinnawala Elephant Orphanage', icon: 'Elephant' },
            { time: '11:00 AM', activity: 'Royal Botanical Gardens', icon: 'Leaf' },
            { time: '01:00 PM', activity: 'Lunch overlooking Kandy Lake', icon: 'Coffee' },
            { time: '02:30 PM', activity: 'Temple of the Tooth Relic', icon: 'Temple' },
            { time: '05:00 PM', activity: 'Kandyan Cultural Show', icon: 'Music' },
            { time: '08:30 PM', activity: 'Drop back to Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Luxury Vehicle',
            'English Speaking Chauffeur',
            'Hotel Pickup/Drop',
            'Parking and Highway Tolls',
            'Bottled Water'
        ],
        excludes: [
            'Entrance tickets',
            'Meals during the tour'
        ],
        notSuitable: [
            'People with heart problems (long walking)',
            'Strollers (some areas have uneven paths)'
        ],
        notAllowed: [
            'Revealing clothes at the Temple'
        ]
    },
    {
        id: 'sigiriya-dambulla-day-tour',
        title: 'Sigiriya Rock & Dambulla Cave Temple Day Trip',
        type: 'day trip',
        duration: '15 hours',
        price: { amount: 69, currency: 'USD' },
        category: 'History & Heritage',
        tags: ['UNESCO', 'Adventure', 'Culture'],
        image: '/sigiriya-new-hero.png',
        pickupLocations: ['Colombo', 'Negombo', 'Kalutara', 'Bentota', 'Hikkaduwa', 'Galle'],
        destinations: ['Sigiriya', 'Dambulla', 'Minneriya/Kaudulla'],
        highlights: [
            'Climb the 8th Wonder: Sigiriya Lion Rock',
            'Explore Ancient Dambulla Cave Temples',
            'Traditional Sri Lankan Village Lunch',
            'Wildlife Jeep Safari (Optional add-on)',
            'History Lessons from expert guide'
        ],
        description: 'Discover the Golden Triangle of Sri Lanka. Climb the iconic Sigiriya Rock fortress and explore the ancient cave temples of Dambulla, a UNESCO World Heritage site with stunning 2000-year-old paintings.',
        itinerary: [
            {
                day: 1,
                title: 'Ancient Kingdoms Discovery',
                description: 'A 5:00 AM start ensures we beat the heat. Our first major stop is the Dambulla Cave Temple, followed by a traditional lunch. Then we tackle the climb to the top of Sigiriya Lion Rock for breathtaking views. On the way back, we can stop for a Jeep Safari if time permits.'
            }
        ],
        experience: [
            { time: '05:00 AM', activity: 'Early Hotel Pickup', icon: 'Sun' },
            { time: '08:30 AM', activity: 'Dambulla Cave Temple', icon: 'Temple' },
            { time: '11:00 AM', activity: 'Sigiriya Rock Climb', icon: 'Mountain' },
            { time: '01:30 PM', activity: 'Village Style Lunch', icon: 'Utensils' },
            { time: '03:30 PM', activity: 'Optional Jeep Safari', icon: 'Car' },
            { time: '09:00 PM', activity: 'Drop back to Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Vehicle with AC',
            'Professional Driver-Guide',
            'Bottled Water',
            'Hotel Pickup and Drop'
        ],
        excludes: [
            'Entrance Tickets',
            'Meals and Personal Expenses'
        ],
        notSuitable: [
            'People with acrophobia (fear of heights)',
            'People with heart or respiratory issues'
        ],
        notAllowed: [
            'Drones in certain areas',
            'Photography inside cave temple'
        ]
    },
    {
        id: 'anuradhapura-sacred-city',
        title: 'Anuradhapura: The First Capital Heritage Tour',
        type: 'day trip',
        duration: '14-16 hours',
        price: { amount: 85, currency: 'USD' },
        category: 'Heritage',
        tags: ['History', 'Spirituality', 'UNESCO'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Sigiriya', 'Habarana', 'Dambulla', 'Colombo'],
        destinations: ['Anuradhapura Sacred City', 'Mihintale'],
        highlights: [
            'Visit the sacred Jaya Sri Maha Bodhi tree',
            'Explore the massive Ruwanwelisaya Stupa',
            'See the Twin Ponds (Kuttam Pokuna)',
            'Visit Mihintale - the cradle of Buddhism',
            'Witness the ancient Moonstones and Guard Stones'
        ],
        description: 'Explore the vast archaeological complex of the first kingdom of Sri Lanka. Anuradhapura is a city of colossal stupas and sacred sites that have been active for over 2,000 years.',
        itinerary: [
            {
                day: 1,
                title: 'Sacred Antiquity',
                description: 'We spend the day visiting the main stupas and the sacred Bodhi tree. In the late afternoon, we climb the steps of Mihintale for a sunset view over the dry zone plains.'
            }
        ],
        experience: [
            { time: '07:30 AM', activity: 'Departure from Sigiriya/Habarana', icon: 'Clock' },
            { time: '09:00 AM', activity: 'Sri Maha Bodhi & Brazen Palace', icon: 'Temple' },
            { time: '10:30 AM', activity: 'Ruwanwelisaya & Jethawanaramaya', icon: 'Sun' },
            { time: '12:30 PM', activity: 'Authentic Village Lunch', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Abhayagiri & Moonstone sites', icon: 'MapPin' },
            { time: '04:30 PM', activity: 'Mihintale Mountain Climb', icon: 'Mountain' },
            { time: '07:30 PM', activity: 'Return to Hotel', icon: 'Home' }
        ],
        includes: ['Private AC Vehicle', 'Expert Historical Guide', 'Airport/Hotel Transfer', 'Bottled Water'],
        excludes: ['Entrance Fees', 'Lunch'],
        notSuitable: ['People with significant walking issues'],
        notAllowed: ['Wearing hats/shoes inside sacred zones', 'Flash photography of monks']
    },
    {
        id: 'kitulgala-adventure-rafting',
        title: 'Kitulgala White Water Rafting & Adventure',
        type: 'day trip',
        duration: '10-12 hours',
        price: { amount: 65, currency: 'USD' },
        category: 'Adventure',
        tags: ['Rafting', 'Adrenaline', 'Rivers'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Kandy'],
        destinations: ['Kitulgala', 'Kelani River'],
        highlights: [
            'White water rafting on the Kelani River',
            'Canyoning and sliding down waterfalls',
            'Visit the filming location of "Bridge on the River Kwai"',
            'Guided jungle trek and stream sliding',
            'Fresh river-side lunch'
        ],
        description: 'For thrill-seekers, Kitulgala is the ultimate playground. Experience the rush of grade 2 and 3 rapids in a safe, professionally monitored environment.',
        itinerary: [
            {
                day: 1,
                title: 'The Great Wet Adventure',
                description: 'Morning white water rafting session covering 5 major rapids. After a river-side lunch, we proceed to canyoning and rock sliding in the jungle streams.'
            }
        ],
        experience: [
            { time: '07:00 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '09:30 AM', activity: 'Safety Briefing at Base Camp', icon: 'Shield' },
            { time: '10:00 AM', activity: 'White Water Rafting (6.5km)', icon: 'Ship' },
            { time: '12:30 PM', activity: 'River-side Rice and Curry', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Canyoning & stream sliding', icon: 'Mountain' },
            { time: '04:30 PM', activity: 'Evening Tea & Departure', icon: 'Coffee' },
            { time: '07:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private Transport', 'Rafting Gear & Helmets', 'Certified Instructor', 'Insurance Coverage'],
        excludes: ['Lunch fees', 'Personal extra clothing'],
        notSuitable: ['Non-swimmers (though life jackets are used)', 'Extreme hydrophobes'],
        notAllowed: ['Alcohol consumption before activities']
    },
    {
        id: 'private-sigiriya-dambulla',
        title: 'Private Sigiriya & Dambulla Heritage Tour',
        type: 'private tour',
        duration: '12-14 hours',
        price: { amount: 94, currency: 'USD' },
        category: 'Cultural Heritage',
        tags: ['UNESCO sites', 'Private', 'History'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Kalutara'],
        destinations: ['Sigiriya Rock', 'Dambulla Caves', 'Golden Temple'],
        highlights: [
            'Private guided climb of Sigiriya Rock Fortress',
            'Detailed exploration of Dambulla Cave complex',
            'Visit the majestic Golden Temple Dambulla',
            'Authentic Sri Lankan rice and curry lunch',
            'Flexible itinerary with a private vehicle'
        ],
        description: 'Discover two of Sri Lanka\'s most revered UNESCO World Heritage Sites in a single day. This private tour is perfect for history buffs and culture seekers who prefer a personalized, comfortable pace.',
        itinerary: [
            {
                day: 1,
                title: 'UNESCO Gems',
                description: 'Your day starts with a pickup in a comfortable private AC car. We head to Dambulla first to visit the Cave Temple complex. Then, after a relaxing lunch, we proceed to Sigiriya to climb the Lion Rock before the late afternoon heat. We return to your hotel by evening.'
            }
        ],
        experience: [
            { time: '07:00 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '10:30 AM', activity: 'Dambulla Cave Temple Exploration', icon: 'Temple' },
            { time: '12:30 PM', activity: 'Traditional Buffet Lunch', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Sigiriya Rock Fortress Climb', icon: 'Mountain' },
            { time: '05:00 PM', activity: 'Evening Tea & Departure', icon: 'Coffee' },
            { time: '08:30 PM', activity: 'Return to Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Air-Conditioned Vehicle',
            'Expert Chauffeur-Guide',
            'All Fuel, Tolls and Parking',
            'Flexible Departure Time'
        ],
        excludes: [
            'Entrance Tickets',
            'Lunch and Beverages',
            'Personal Expenses'
        ],
        notSuitable: ['People with mobility difficulties', 'Severe fear of heights'],
        notAllowed: ['Smoking at heritage sites', 'Pet animals']
    },
    {
        id: 'colombo-galle-bentota-day-trip',
        title: 'Southern Coast Discovery: Galle & Bentota',
        type: 'private tour',
        duration: '12-14 hours',
        price: { amount: 75, currency: 'USD' },
        category: 'Leisure & Culture',
        tags: ['Coastal', 'Bestseller', 'Family Friendly'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Waikkal'],
        destinations: ['Bentota', 'Madu River', 'Kosgoda', 'Galle'],
        highlights: [
            'Madu Ganga Mangrove Boat Safari',
            'Visit a Sea Turtle Hatchery & Conservation Center',
            'Explore the UNESCO Galle Dutch Fort',
            'Relax at the pristine Bentota Beach',
            'See the iconic Stilt Fishermen of the South'
        ],
        description: 'Explore the sun-kissed southern coast of Sri Lanka. From the tranquil waters of the Madu River to the historic ramparts of Galle Fort, this tour offers a perfect blend of nature, wildlife, and colonial history.',
        itinerary: [
            {
                day: 1,
                title: 'South Coast Wonders',
                description: 'We drive south along the coast to Bentota for a boat safari. Then, we visit the turtle hatchery to learn about conservation. The highlight of the afternoon is a walk through the charming streets of Galle Fort before heading back to Colombo.'
            }
        ],
        experience: [
            { time: '07:30 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '09:30 AM', activity: 'Madu River Boat Safari', icon: 'Ship' },
            { time: '11:00 AM', activity: 'Sea Turtle Hatchery Visit', icon: 'Heart' },
            { time: '01:00 PM', activity: 'Lunch at Galle Fort', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Galle Fort Guided Walk', icon: 'Castle' },
            { time: '04:30 PM', activity: 'Hikkaduwa Beach Photo Stop', icon: 'Camera' },
            { time: '07:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: [
            'Private AC Vehicle',
            'Professional Driver-Guide',
            'All Fuel, Tolls & Parking',
            'Pickup & Drop-off Service'
        ],
        excludes: [
            'Entrance Fees & Safari Costs',
            'Lunch and Personal expenses',
            'Driver Tips'
        ],
        notSuitable: ['People with severe back problems (Boat safari)'],
        notAllowed: ['Littering', 'Disturbing wildlife']
    },
    {
        id: 'colombo-city-tour',
        title: 'Colombo City Highlights & Heritage Tour',
        type: 'day trip',
        duration: '6-8 hours',
        price: { amount: 39, currency: 'USD' },
        category: 'City & Culture',
        tags: ['Capital', 'Sightseeing', 'Shopping'],
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo Hotels', 'Port of Colombo'],
        destinations: ['Colombo Fort', 'Pettah', 'Gangaramaya', 'Independence Square'],
        highlights: [
            'Visit the iconic Gangaramaya Temple',
            'Explore the Independence Memorial Hall',
            'Sightseeing at the Colombo Lotus Tower',
            'Drive through the historic Colombo Fort area',
            'Shopping at premium boutiques or Pettah market'
        ],
        description: 'Experience the vibrant blend of colonial heritage and modern urban life in Sri Lanka\'s capital. From ancient temples to futuristic towers, Colombo is a city of surprises.',
        itinerary: [
            {
                day: 1,
                title: 'Colombo Unveiled',
                description: 'We explore the heart of the city, starting with the historic Fort area. We then visit the beautiful Gangaramaya Temple and the Independence Square. The afternoon is reserved for a visit to the Lotus Tower and some time for shopping in the city\'s best districts.'
            }
        ],
        experience: [
            { time: '09:00 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '09:30 AM', activity: 'Colombo Fort & Old Lighthouse', icon: 'Castle' },
            { time: '11:00 AM', activity: 'Gangaramaya Temple Visit', icon: 'Temple' },
            { time: '12:30 PM', activity: 'Lunch at a City Restaurant', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Independence Memorial Hall', icon: 'Castle' },
            { time: '03:30 PM', activity: 'Lotus Tower & City Views', icon: 'Camera' },
            { time: '05:00 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Vehicle',
            'English Speaking Chauffeur-Guide',
            'All City Tolls & Parking',
            'Flexible Itinerary'
        ],
        excludes: [
            'Entrance Fees (Temple, Lotus Tower)',
            'Lunch & Refreshments',
            'Personal Shopping'
        ],
        notSuitable: ['People with significant mobility issues'],
        notAllowed: ['Improper attire at temples (shoulders/knees must be covered)']
    },
    {
        id: 'colombo-private-shopping',
        title: 'Colombo Exclusive Shopping & City Experience',
        type: 'private tour',
        duration: 'Flex (6-8 hours)',
        price: { amount: 26.25, currency: 'USD' },
        category: 'Lifestyle',
        tags: ['Shopping', 'City', 'Private'],
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Mount Lavinia'],
        destinations: ['Colombo Shopping Districts'],
        highlights: [
            'Personalized shopping assistant/driver',
            'Visit premium boutiques like Barefoot and Odel',
            'Explore the vibrant Pettah Floating Market',
            'Tea tasting at premium Ceylon Tea boutiques',
            'Visit the Dutch Hospital Shopping Precinct'
        ],
        description: 'A dedicated tour for those who want to find the best souvenirs, fashion, and tea Sri Lanka has to offer. Your private driver will take you to the most exclusive and authentic shopping spots in the city.',
        itinerary: [
            {
                day: 1,
                title: 'Shop Til You Drop',
                description: 'We tailor the day to your needs. Whether you want high-end fashion, authentic local crafts, or the best Ceylon Tea, we take you to the right places. We also include a stop at the historic Dutch Hospital precinct for lunch or refreshments.'
            }
        ],
        experience: [
            { time: '10:00 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '10:30 AM', activity: 'High-end Fashion (Odel/Cotton Collection)', icon: 'Clock' },
            { time: '12:00 PM', activity: 'Local Crafts (Barefoot/Laksala)', icon: 'Heart' },
            { time: '01:30 PM', activity: 'Lunch at Dutch Hospital', icon: 'Utensils' },
            { time: '03:00 PM', activity: 'Tea Tasting & Purchase', icon: 'Coffee' },
            { time: '04:30 PM', activity: 'Pettah Markets (Optional)', icon: 'Camera' },
            { time: '06:00 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Vehicle with AC',
            'Dedicated Driver-Guide',
            'In-car storage for your purchases',
            'City Navigation'
        ],
        excludes: [
            'Personal purchases',
            'Lunch & Refreshments',
            'Tips'
        ],
        notSuitable: ['People with knee issues (requires significant walking)'],
        notAllowed: ['Illegal item purchases']
    },
    {
        id: 'negombo-southern-coast',
        title: 'Southern Coast Explorer From Negombo',
        type: 'private tour',
        duration: '12-14 hours',
        price: { amount: 120, currency: 'USD' },
        category: 'Leisure & History',
        tags: ['Coastal', 'Scenic', 'Private'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Negombo Hotels'],
        destinations: ['Handunugoda', 'Ahangama', 'Galle Fort', 'Hikkaduwa'],
        highlights: [
            'Visit the Virgin White Tea Factory (Handunugoda)',
            'Witness the traditional Stilt Fishermen at Ahangama',
            'Guided exploration of the UNESCO Galle Fort',
            'Enjoy a scenic coastal drive through Hikkaduwa',
            'Visit a Sea Turtle Hatchery in Kosgoda'
        ],
        description: 'A long but rewarding day journey from Negombo to the far south of the island. Experience unique tea plantations, traditional fishing, and colonial architecture.',
        itinerary: [
            {
                day: 1,
                title: 'South Coast Secrets',
                description: 'We depart early from Negombo to beat the traffic. Our first destination is the Handunugoda Tea Estate, famous for its white tea. We then see the stilt fishermen before spending the afternoon in Galle. The return trip includes a visit to the turtle hatchery.'
            }
        ],
        experience: [
            { time: '06:30 AM', activity: 'Pickup from Negombo', icon: 'MapPin' },
            { time: '10:00 AM', activity: 'Handunugoda Tea Factory', icon: 'Leaf' },
            { time: '11:30 AM', activity: 'Stilt Fishermen Observation', icon: 'Camera' },
            { time: '01:00 PM', activity: 'Lunch at Galle Fort', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Galle Fort Exploration', icon: 'Castle' },
            { time: '04:30 PM', activity: 'Turtle Hatchery (Kosgoda)', icon: 'Heart' },
            { time: '08:00 PM', activity: 'Return to Negombo', icon: 'Home' }
        ],
        includes: [
            'Private Luxury Vehicle',
            'English Speaking Driver-Guide',
            'All Tolls & Fuel',
            'Bottled Water'
        ],
        excludes: [
            'Entrance Fees',
            'Lunch and personal items',
            'Gratuities'
        ],
        notSuitable: ['People with severe travel sickness'],
        notAllowed: ['Touching turtles directly (at most hatcheries)']
    },
    {
        id: 'negombo-sigiriya-safari',
        title: 'Sigiriya Rock & Minneriya Safari from Negombo',
        type: 'private tour',
        duration: '14-16 hours',
        price: { amount: 67.55, currency: 'USD' },
        category: 'History & Wildlife',
        tags: ['Cultural Heritage', 'Safari', 'Exclusive'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Negombo Hotels'],
        destinations: ['Sigiriya Lion Rock', 'Minneriya National Park', 'Dambulla Cave Temple'],
        highlights: [
            'Climb the ancient Sigiriya Lion Rock Fortress',
            '3-Hour Jeep Safari in Minneriya National Park',
            'Visit the Golden Temple and Giant Buddha Statue',
            'Explore the ancient Cave Temples of Dambulla',
            'Traditional Sri Lankan lunch in a village setting'
        ],
        description: 'A comprehensive journey into the cultural heart and wild landscapes of Sri Lanka. Starting from Negombo, this full-day tour covers the most iconic heritage sites and offers an unforgettable wildlife encounter.',
        itinerary: [
            {
                day: 1,
                title: 'Heritage & Wildlife Pack',
                description: 'We leave Negombo early to reach Sigiriya for an morning climb. After exploring the fortress, we enjoy a village lunch. The afternoon is dedicated to a safari in Minneriya to see wild elephants, followed by a visit to the Dambulla Cave Temples on the way back.'
            }
        ],
        experience: [
            { time: '06:00 AM', activity: 'Departure from Negombo', icon: 'Clock' },
            { time: '10:00 AM', activity: 'Sigiriya Rock Climb', icon: 'Mountain' },
            { time: '01:00 PM', activity: 'Traditional Village Lunch', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Minneriya 4x4 Safari', icon: 'Elephant' },
            { time: '05:30 PM', activity: 'Dambulla Cave Temple', icon: 'Temple' },
            { time: '10:30 PM', activity: 'Return to Negombo', icon: 'Home' }
        ],
        includes: [
            'Private AC Vehicle',
            'English Speaking Driver-Guide',
            'Hotel Pickup and Return',
            'All Transport Related Fees'
        ],
        excludes: [
            'Entrance Tickets (Sigiriya, Dambulla)',
            'Safari Jeep and Park Entrance',
            'Lunch and Beverages'
        ],
        notSuitable: ['People with knee or back problems', 'Very young children for long drives'],
        notAllowed: ['Smoking in the vehicle', 'Littering in the National Park']
    },
    {
        id: 'ambuluwawa-kandy',
        title: 'Ambuluwawa Tower & Kandy Heritage Tour',
        type: 'private tour',
        duration: '14-16 hours',
        price: { amount: 75, currency: 'USD' },
        category: 'Nature & Spirituality',
        tags: ['Iconic Tower', 'Temple of Tooth', 'Private'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Negombo', 'Katunayake', 'Colombo'],
        destinations: ['Ambuluwawa Tower', 'Temple of the Tooth', 'Kandy City'],
        highlights: [
            'Climb the spiral Ambuluwawa Biodiversity Tower',
            'Visit the sacred Temple of the Tooth Relic (Kandy)',
            'Explore the lush Peradeniya Botanical Gardens',
            'Panoramic views of Kandy from the Upper Lake Drive',
            'Experience a cultural dance performance (if timing permits)'
        ],
        description: 'A journey through the scenic hills to some of Sri Lanka\'s most spiritual and architectural wonders. From the dizzying heights of Ambuluwawa to the serene atmosphere of the Temple of the Tooth.',
        itinerary: [
            {
                day: 1,
                title: 'Highlands & Heritage',
                description: 'We depart early to visit the unique Ambuluwawa Tower first. After the climb, we head to Kandy for lunch and a visit to the sacred Temple of the Tooth. We also explore the city and its viewpoints before the return journey.'
            }
        ],
        experience: [
            { time: '06:30 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '09:30 AM', activity: 'Ambuluwawa Tower Climb', icon: 'Mountain' },
            { time: '12:30 PM', activity: 'Lunch in Kandy Town', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Temple of the Tooth Relic', icon: 'Temple' },
            { time: '04:00 PM', activity: 'Kandy Viewpoint & City Walk', icon: 'Camera' },
            { time: '05:30 PM', activity: 'Return Journey Starts', icon: 'Clock' },
            { time: '09:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Luxury AC Vehicle',
            'Dedicated English Speaking Driver',
            'All Tolls, Parking, and Fuel',
            'Service with a Smile'
        ],
        excludes: [
            'Entrance Fees (Tower, Temple, Gardens)',
            'Lunch & Personal Expenses',
            'Gratuities'
        ],
        notSuitable: ['People with a fear of heights (Ambuluwawa Tower)', 'People with vertigo'],
        notAllowed: ['Loud behavior in sacred areas', 'Short attire at Temple (must cover knees/shoulders)']
    },
    {
        id: 'colombo-negombo-galle-mirissa',
        title: 'Ultimate South Coast: Galle, Hikkaduwa & Mirissa',
        type: 'private tour',
        duration: '12-14 hours',
        price: { amount: 105, currency: 'USD' },
        category: 'Nature & Beach',
        tags: ['Coastal', 'Scenic', 'Private'],
        image: '/mirissa-new-fix.png',
        pickupLocations: ['Colombo', 'Negombo', 'Katunayake'],
        destinations: ['Madu River', 'Kosgoda', 'Galle Fort', 'Mirissa'],
        highlights: [
            'Madu Ganga River Boat Safari with Cinnamon Island',
            'Sea Turtle Hatchery & Conservation Visit',
            'Explore the historic Galle Dutch Fort',
            'Scenic drive along Hikkaduwa Beach',
            'Visit the Coconut Tree Hill in Mirissa'
        ],
        description: 'Experience the very best of Sri Lanka\'s southern coastline in a single day. From river safaris and wildlife conservation to colonial history and iconic beach vistas, this tour offers a bit of everything for the intrepid traveler.',
        itinerary: [
            {
                day: 1,
                title: 'South Coast Odyssey',
                description: 'We follow the scenic coastline southwards, stopping for a boat safari on the Madu River. We then visit the Turtle Hatchery before reaching Galle for a guided walk through the Fort. Our final stop is the picturesque Mirissa before we head back to your hotel.'
            }
        ],
        experience: [
            { time: '07:30 AM', activity: 'Hotel Pickup', icon: 'MapPin' },
            { time: '09:30 AM', activity: 'Madu River Safari', icon: 'Ship' },
            { time: '11:00 AM', activity: 'Turtle Hatchery Visit', icon: 'Heart' },
            { time: '01:00 PM', activity: 'Galle Fort Exploration & Lunch', icon: 'Castle' },
            { time: '03:30 PM', activity: 'Mirissa Coconut Tree Hill', icon: 'Camera' },
            { time: '05:00 PM', activity: 'Evening Sunset & Departure', icon: 'Clock' },
            { time: '08:30 PM', activity: 'Return to Hotel', icon: 'Home' }
        ],
        includes: [
            'Private Luxury AC Vehicle',
            'Professional Driver-Guide',
            'Bottled Water and Fuel',
            'Pickup and Drop-off'
        ],
        excludes: [
            'Entrance Fees (Safari, Hatchery, etc.)',
            'Lunch and Beverages',
            'Optional activities'
        ],
        notSuitable: ['People with significant travel fatigue'],
        notAllowed: ['Illegal fishing activities', 'Littering']
    },
    {
        id: 'nuwara-eliya-tea-gardens',
        title: 'Nuwara Eliya & Tea Gardens Full-Day Tour',
        type: 'day trip',
        duration: '14 hours',
        price: { amount: 85, currency: 'USD' },
        category: 'Nature & Heritage',
        tags: ['Highlands', 'Scenic', 'Photography'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Kandy'],
        destinations: ['Ramboda Falls', 'Tea Factory', 'Nuwara Eliya Town', 'Gregory Lake'],
        highlights: [
            'Visit the stunning Ramboda Waterfalls',
            'Tea Plantation & Guided Factory Tour',
            'Explore "Little England" (Nuwara Eliya Town)',
            'Scenic drive through the central highlands',
            'Visit Gregory Lake & Victoria Park'
        ],
        description: 'Escape to the "Little England" of Sri Lanka. This journey takes you deep into the heart of the tea country, where rolling green hills meet cascading waterfalls. Breathe in the crisp mountain air and learn the secrets of Ceylon Tea.',
        itinerary: [
            {
                day: 1,
                title: 'Highland Serenity',
                description: 'Starting early from Colombo, we climb into the misty highlands. Our first major stop is the majestic Ramboda Falls. We then visit a premium tea plantation and factory to witness the production of the world\'s finest tea. In the afternoon, we explore the colonial charm of Nuwara Eliya.'
            }
        ],
        experience: [
            { time: '06:00 AM', activity: 'Departure from Hotel', icon: 'Clock' },
            { time: '09:30 AM', activity: 'Breakfast Stop (St. Clair View)', icon: 'Coffee' },
            { time: '11:00 AM', activity: 'Ramboda Falls Visit', icon: 'Mountain' },
            { time: '01:00 PM', activity: 'Tea Factory & Plantation Tour', icon: 'Leaf' },
            { time: '02:30 PM', activity: 'Lunch in Nuwara Eliya', icon: 'Utensils' },
            { time: '04:00 PM', activity: 'Gregory Lake & City Exploration', icon: 'Camera' },
            { time: '08:30 PM', activity: 'Return to Hotel', icon: 'Home' }
        ],
        includes: ['Private Luxury Vehicle', 'Expert Chauffeur-Guide', 'All Tolls & Parking Fees', 'Fresh Bottled Water'],
        excludes: ['Entrance Fees', 'Lunch & Snacks', 'Driver Gratitude'],
        notSuitable: ['People with severe motion sickness'],
        notAllowed: ['Smoking in vehicle']
    },
    {
        id: 'ella-explorer-adventure',
        title: 'Ella Explorer: Nine Arch Bridge & Little Adams Peak',
        type: 'day trip',
        duration: '16 hours',
        price: { amount: 39, currency: 'USD' },
        category: 'Adventure & Scenic',
        tags: ['Hiking', 'Iconic', 'Adventure'],
        image: '/Hero/ella.jpg',
        pickupLocations: ['Colombo', 'Negombo', 'Kandy'],
        destinations: ['Ella', 'Nine Arch Bridge', 'Little Adams Peak', 'Rawana Falls'],
        highlights: [
            'Walk across the world-famous Nine Arch Bridge',
            'Hike to the summit of Little Adam\'s Peak',
            'Marvel at the powerful Rawana Waterfalls',
            'Explore the vibrant Ella backpacker town',
            'Incredible mountain vistas and photo ops'
        ],
        description: 'Immerse yourself in the breathtaking landscapes of Ella. This adventure-packed day trip covers the most iconic spots in the hills, from architectural marvels to stunning mountain peaks.',
        itinerary: [
            {
                day: 1,
                title: 'Ella Peak Experience',
                description: 'A dedicated journey to the most picturesque town in Sri Lanka. We start early to reach Ella by mid-morning. Our first stop is the Nine Arch Bridge. We then hike the gentle trail to Little Adam\'s Peak for panoramic views before visiting Rawana Falls.'
            }
        ],
        experience: [
            { time: '05:30 AM', activity: 'Early Morning Pickup', icon: 'Clock' },
            { time: '10:30 AM', activity: 'Arrive in Ella', icon: 'MapPin' },
            { time: '11:00 AM', activity: 'Nine Arch Bridge Walk', icon: 'Camera' },
            { time: '12:30 PM', activity: 'Authentic Village Lunch', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Hike Little Adam\'s Peak', icon: 'Mountain' },
            { time: '04:00 PM', activity: 'Rawana Falls Photography', icon: 'Camera' },
            { time: '10:00 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private Luxury AC Vehicle', 'English Speaking Driver-Guide', 'Hotel Pickup and Return', 'Refreshments Onboard'],
        excludes: ['Entrance Fees', 'Lunch and Personal Meals'],
        notSuitable: ['People with mobility issues (Hiking required)'],
        notAllowed: ['Drone photography without license']
    },
    {
        id: 'udawalawe-wildlife-safari',
        title: 'Udawalawe National Park Wildlife Safari',
        type: 'day trip',
        duration: '12-14 hours',
        price: { amount: 99, currency: 'USD' },
        category: 'Wildlife & Nature',
        tags: ['Safaris', 'Elephants', 'Conservation'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Bentota', 'Galle'],
        destinations: ['Udawalawe National Park', 'Elephant Transit Home'],
        highlights: [
            'Guaranteed Wild Elephant sightings',
            'Visit the Elephant Transit Home (ETH)',
            '3-Hour 4x4 Jeep Safari in the Park',
            'See water buffalo, crocodiles, and exotic birds',
            'Scenic drive through the southern plains'
        ],
        description: 'Udawalawe is the best place in Sri Lanka to see herds of wild elephants in their natural habitat throughout the year. This tour includes a visit to the dedicated elephant rehabilitation center.',
        itinerary: [
            {
                day: 1,
                title: 'Safari Expedition',
                description: 'Early morning pickup to reach Udawalawe by sunrise or mid-morning. We first visit the Elephant Transit Home to watch the baby elephants being fed. Then, we embark on a 3-hour safari in the national park with a professional tracker.'
            }
        ],
        experience: [
            { time: '05:30 AM', activity: 'Early Hotel Pickup', icon: 'Clock' },
            { time: '09:30 AM', activity: 'Elephant Transit Home Visit', icon: 'Heart' },
            { time: '11:00 AM', activity: 'Udawalawe 4x4 Jeep Safari', icon: 'Elephant' },
            { time: '02:00 PM', activity: 'Lunch at a Local Resort', icon: 'Utensils' },
            { time: '03:30 PM', activity: 'Return Journey Starts', icon: 'Clock' },
            { time: '07:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private Luxury Vehicle', 'All Fuel and Tolls', 'Expert Chauffeur-Guide', 'Bottled Water'],
        excludes: ['Park Entrance Fees', 'Safari Jeep Rental', 'ETH Entrance Fee', 'Lunch'],
        notSuitable: ['Very young infants', 'Expectant mothers'],
        notAllowed: ['Feeding animals', 'Loud noise in the park']
    },
    {
        id: 'yala-national-park-safari',
        title: 'Yala National Park Leopard Safari',
        type: 'day trip',
        duration: '14-16 hours',
        price: { amount: 99, currency: 'USD' },
        category: 'Wildlife',
        tags: ['Leopards', 'Safari', 'Bestseller'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Bentota', 'Galle', 'Mirissa', 'Hambantota'],
        destinations: ['Yala National Park'],
        highlights: [
            'High probability of Leopard sightings',
            'Explore the largest sanctuary in Sri Lanka',
            'Witness Sloth Bears, Elephants, and Crocodiles',
            'Professional 4x4 Jeep Safari with tracker',
            'Incredible photography opportunities'
        ],
        description: 'Yala is world-renowned for having one of the highest leopard densities on earth. This safari takes you through diverse ecosystems, from dense jungles to open brackish lagoons.',
        itinerary: [
            {
                day: 1,
                title: 'Leopard Quest',
                description: 'We start extremely early to reach the park gates by dawn. A dedicated 3-4 hour morning safari covers the prime leopard territories. After lunch, we explore more of the park\'s diverse wildlife before the return journey.'
            }
        ],
        experience: [
            { time: '04:00 AM', activity: 'Early Morning Pickup', icon: 'Clock' },
            { time: '06:00 AM', activity: 'Arrive at Yala National Park', icon: 'MapPin' },
            { time: '06:15 AM', activity: 'Morning 4x4 Safari Starts', icon: 'Camera' },
            { time: '10:30 AM', activity: 'Safari Break & Picnic', icon: 'Coffee' },
            { time: '12:30 PM', activity: 'Lunch outside the Park', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'Optional afternoon drive', icon: 'Clock' },
            { time: '07:00 PM', activity: 'Return to Hotel', icon: 'Home' }
        ],
        includes: ['Private AC Vehicle', 'Expert Driver', 'Bottled Water', 'Airport/Hotel Transfer'],
        excludes: ['Park Entrance Fees', 'Jeep Hire', 'Lunch'],
        notSuitable: ['People with spinal issues', 'Very young children'],
        notAllowed: ['Getting out of the vehicle inside the park']
    },
    {
        id: 'sinharaja-rainforest-trek',
        title: 'Sinharaja Rainforest Guided Trek',
        type: 'day trip',
        duration: '12 hours',
        price: { amount: 90, currency: 'USD' },
        category: 'Nature',
        tags: ['Eco-Tourism', 'Trekking', 'Birds'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Bentota', 'Galle'],
        destinations: ['Sinharaja Forest Reserve'],
        highlights: [
            'Explore a UNESCO World Heritage Rainforest',
            'Spot endemic birds and colorful reptiles',
            'Swim in a crystal-clear jungle waterfall',
            'Guided walk with a professional naturalist',
            'Immerse in pure, undisturbed nature'
        ],
        description: 'Discover the last remaining primary tropical rainforest in Sri Lanka. Sinharaja is a biodiversity hotspot, home to over 50% of the island\'s endemic species.',
        itinerary: [
            {
                day: 1,
                title: 'Jungle Immersion',
                description: 'We enter the forest through a scenic entry point. Our naturalist guide leads us through the dense canopy, explaining the unique flora and fauna. We reach a secluded waterfall for a refreshing dip before a local village lunch.'
            }
        ],
        experience: [
            { time: '07:00 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '09:30 AM', activity: 'Arrive at Sinharaja Entrance', icon: 'MapPin' },
            { time: '10:00 AM', activity: 'Guided Trek Starts', icon: 'Mountain' },
            { time: '12:00 PM', activity: 'Waterfall Visit & Swim', icon: 'Umbrella' },
            { time: '01:30 PM', activity: 'Traditional Village Lunch', icon: 'Utensils' },
            { time: '03:00 PM', activity: 'Return Trek through core zone', icon: 'Clock' },
            { time: '07:00 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private AC Vehicle', 'Professional Naturalist Guide', 'All Entry Permits', 'Leech Socks Provided'],
        excludes: ['Lunch & Refreshments'],
        notSuitable: ['People with significant walking difficulties'],
        notAllowed: ['Carrying plastic bottles into the forest', 'Smoking']
    },
    {
        id: 'polonnaruwa-ancient-city',
        title: 'Polonnaruwa Ancient City Cycle Tour',
        type: 'day trip',
        duration: '14 hours',
        price: { amount: 80.72, currency: 'USD' },
        category: 'History',
        tags: ['Archaeology', 'UNESCO', 'Cycling'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Dambulla', 'Habarana', 'Sigiriya', 'Kandy'],
        destinations: ['Polonnaruwa Ancient City'],
        highlights: [
            'Explore the ruins of the 12th-century capital',
            'Visit the Gal Vihara rock-cut Buddha statues',
            'See the Vatadage and ancient Royal Palaces',
            'Cycle through the historic archaeological park',
            'Visit the Polonnaruwa Archaeological Museum'
        ],
        description: 'Step back in time to the golden age of Sri Lankan history. Polonnaruwa offers a better-preserved look at ancient architecture and irrigation systems than any other site.',
        itinerary: [
            {
                day: 1,
                title: 'The Medieval Capital',
                description: 'We explore the site primarily by bicycle, which is the best way to see the scattered ruins. We visit the Sea of Parakrama, the Royal Palace, and the stunning religious monuments of the Quadrangle before ending at the Gal Vihara.'
            }
        ],
        experience: [
            { time: '08:00 AM', activity: 'Pickup from Habarana/Sigiriya', icon: 'MapPin' },
            { time: '09:00 AM', activity: 'Arrive at Museum & Site Ticket Office', icon: 'Clock' },
            { time: '09:30 AM', activity: 'Cycle Tour of Northern Ruins', icon: 'Bike' },
            { time: '11:00 AM', activity: 'Gal Vihara Statues Visit', icon: 'Temple' },
            { time: '12:30 PM', activity: 'Inland Rice and Curry Lunch', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Exploring the Royal Palace Zone', icon: 'Castle' },
            { time: '04:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private Vehicle', 'Bicycle Rental', 'Expert Chauffeur-Guide', 'Entrance Ticket Management'],
        excludes: ['Entrance Fees (approx $30)', 'Lunch'],
        notSuitable: ['People who cannot cycle (available by vehicle too)'],
        notAllowed: ['Turning back on Buddha statues for photos']
    },
    {
        id: 'whale-watching-mirissa',
        title: 'Mirissa Whale Watching Expedition',
        type: 'day trip',
        duration: '10-12 hours',
        price: { amount: 55, currency: 'USD' },
        category: 'Wildlife',
        tags: ['Whales', 'Dolphins', 'Ocean'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Galle', 'Unawatuna', 'Weligama', 'Mirissa'],
        destinations: ['Mirissa Harbor', 'Indian Ocean'],
        highlights: [
            'Spot Blue Whales, Sperm Whales, and Bryde\'s Whales',
            'High chance of seeing spinner dolphins',
            'Travel in a modern, safety-compliant vessel',
            'On-board breakfast and refreshments included',
            'Professional wildlife naturalist on board'
        ],
        description: 'Mirissa is one of the best places in the world to see the Blue Whale, the largest mammal on earth. This early morning excursion takes you into the deep waters of the Indian Ocean for a breathtaking wildlife encounter.',
        itinerary: [
            {
                day: 1,
                title: 'Ocean Giants',
                description: 'We depart before dawn to reach the Mirissa harbor. The boat sets sail at 7 AM. We spend 3-5 hours on the water spotting whales and dolphins. After returning, you have free time on Mirissa beach before the transfer back.'
            }
        ],
        experience: [
            { time: '05:30 AM', activity: 'Early Morning Pickup', icon: 'Clock' },
            { time: '06:30 AM', activity: 'Arrive at Mirissa Harbor', icon: 'MapPin' },
            { time: '07:00 AM', activity: 'Boat Sets Sail', icon: 'Ship' },
            { time: '09:00 AM', activity: 'Peak Whale Spotting Time', icon: 'Camera' },
            { time: '11:30 AM', activity: 'Return to Harbor', icon: 'Clock' },
            { time: '12:30 PM', activity: 'Lunch overlooking the Bay', icon: 'Utensils' },
            { time: '03:00 PM', activity: 'Transfer back to Hotel', icon: 'Home' }
        ],
        includes: ['Private Boat Ticket (Group Boat)', 'On-board Breakfast', 'Insurance', 'Hotel Transfers'],
        excludes: ['Lunch', 'Personal expenses'],
        notSuitable: ['People with severe sea-sickness', 'Expectant mothers'],
        notAllowed: ['Touching marine life', 'Littering in the ocean']
    },
    {
        id: 'pinnawala-elephant-orphanage-tour',
        title: 'Pinnawala Elephant Experience',
        type: 'day trip',
        duration: '8-10 hours',
        price: { amount: 50, currency: 'USD' },
        category: 'Wildlife',
        tags: ['Elephants', 'Family Friendly', 'Educational'],
        image: 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Kandy'],
        destinations: ['Pinnawala Elephant Orphanage', 'Maha Oya River'],
        highlights: [
            'Watch baby elephants being bottle-fed',
            'Witness the massive herd bathing in the river',
            'Visit the Elephant Millennium Foundation',
            'Learn about elephant conservation and rescue',
            'Interaction and photo opportunities'
        ],
        description: 'See the world\'s largest collection of captive elephants. Pinnawala is famous for its semi-wild environment where orphaned and injured elephants are cared for.',
        itinerary: [
            {
                day: 1,
                title: 'Gentle Giants',
                description: 'We time our visit to catch the 9:15 AM bottle-feeding and the 10:00 AM river bath. In the afternoon, we visit a nearby spice garden or a small tea factory before returning.'
            }
        ],
        experience: [
            { time: '07:00 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '09:00 AM', activity: 'Arrive at Pinnawala', icon: 'MapPin' },
            { time: '09:15 AM', activity: 'Observation of Bottle Feeding', icon: 'Heart' },
            { time: '10:00 AM', activity: 'Herd Bathing in the River', icon: 'Waves' },
            { time: '12:00 PM', activity: 'Lunch with River View', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'Millennium Elephant Foundation', icon: 'Camera' },
            { time: '04:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private AC Vehicle', 'Service of a Chauffeur', 'Fuel and Parking', 'Bottled Water'],
        excludes: ['Entrance Fees', 'Lunch'],
        notSuitable: ['None'],
        notAllowed: ['Feeding unapproved food to elephants']
    },
    {
        id: 'kandy-heritage-cultural-tour',
        title: 'Kandy: The Last Kingdom Tour',
        type: 'day trip',
        duration: '12 hours',
        price: { amount: 41.50, currency: 'USD' },
        category: 'Cultural',
        tags: ['Temple of Tooth', 'Botanical Gardens', 'Bazaar'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Negombo', 'Bentota'],
        destinations: ['Kandy City', 'Temple of the Tooth', 'Peradeniya Gardens'],
        highlights: [
            'Sacred Temple of the Tooth Relic',
            'Royal Botanical Gardens, Peradeniya',
            'Upper Lake Drive for stunning city views',
            'Explore the local Kandy market and bazaar',
            'Traditional Kandyan Dance performance'
        ],
        description: 'Immerse yourself in the rich culture and history of the last independent kingdom of Sri Lanka. Kandy is the spiritual heart of the country.',
        itinerary: [
            {
                day: 1,
                title: 'Royal Heritage',
                description: 'We drive to Kandy, visiting the Botanical Gardens first. After lunch, we explore the city streets and the lake. The evening is spent at the Temple of the Tooth for the puja ceremony.'
            }
        ],
        experience: [
            { time: '07:30 AM', activity: 'Departure from Hotel', icon: 'Clock' },
            { time: '10:30 AM', activity: 'Royal Botanical Gardens', icon: 'Leaf' },
            { time: '01:00 PM', activity: 'Authentic Kandyan Lunch', icon: 'Utensils' },
            { time: '02:30 PM', activity: 'City Walk & Market Visit', icon: 'MapPin' },
            { time: '04:00 PM', activity: 'Upper Lake Drive Viewpoint', icon: 'Camera' },
            { time: '05:30 PM', activity: 'Temple of the Tooth Relic', icon: 'Temple' },
            { time: '08:00 PM', activity: 'Return Journey Starts', icon: 'Home' }
        ],
        includes: ['Private Vehicle', 'Expert Chauffeur-Guide', 'All Tolls/Parking', 'Flexible Schedule'],
        excludes: ['Entrance Fees', 'Lunch'],
        notSuitable: ['None'],
        notAllowed: ['Photography inside the main shrine of the Temple']
    },
    {
        id: 'ratnapura-gem-mining-tour',
        title: 'Ratnapura: City of Gems Experience',
        type: 'day trip',
        duration: '10-12 hours',
        price: { amount: 75, currency: 'USD' },
        category: 'Heritage',
        tags: ['Gems', 'Mining', 'Local Life'],
        image: 'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Bentota', 'Kalutara'],
        destinations: ['Ratnapura City', 'Gem Mines', 'Gem Museum'],
        highlights: [
            'Descent into a traditional gem mine',
            'Witness the washing and cutting of raw gems',
            'Visit a private Gem Museum and gallery',
            'Explore the historic Maha Saman Devalaya',
            'Learn about the gem trade in Sri Lanka'
        ],
        description: 'Ratnapura is the world\'s gem capital. This tour offers a rare behind-the-scenes look at how precious stones like Blue Sapphires and Rubies are extracted from the earth using ancient methods.',
        itinerary: [
            {
                day: 1,
                title: 'Underground Treasure',
                description: 'We visit an active gem mine where workers manually extract gravel. You will see the entire process from extraction to the final polished stone. We also visit the local gem market and a historic temple.'
            }
        ],
        experience: [
            { time: '08:00 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '10:30 AM', activity: 'Gem Mine Site Visit', icon: 'Mountain' },
            { time: '12:00 PM', activity: 'Gem Washing & Sorting', icon: 'Heart' },
            { time: '01:30 PM', activity: 'Traditional Lunch', icon: 'Utensils' },
            { time: '03:00 PM', activity: 'Gem Museum & Gallery Tour', icon: 'Camera' },
            { time: '04:30 PM', activity: 'Maha Saman Devalaya Visit', icon: 'Temple' },
            { time: '07:30 PM', activity: 'Drop back at Hotel', icon: 'Home' }
        ],
        includes: ['Private AC Vehicle', 'Expert Local Guide', 'Mine Entry Permission', 'Bottled Water'],
        excludes: ['Lunch', 'Personal item purchases'],
        notSuitable: ['People with claustrophobia (mine descent)', 'People with mobility issues'],
        notAllowed: ['Photography in certain high-security gem galleries']
    },
    {
        id: 'hikkaduwa-marine-park-day-tour',
        title: 'Hikkaduwa Marine Park & Corals',
        type: 'day trip',
        duration: '8-10 hours',
        price: { amount: 45, currency: 'USD' },
        category: 'Nature',
        tags: ['Corals', 'Beach', 'Snorkeling'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Galle', 'Bentota', 'Colombo'],
        destinations: ['Hikkaduwa Marine Park', 'Tsunami Museum'],
        highlights: [
            'Glass bottom boat ride over the coral reef',
            'Snorkeling with tropical fish and sea turtles',
            'Visit the Hikkaduwa Beach and local town',
            'Visit the Tsunami Photo Museum',
            'Relax at the vibrant Hikkaduwa beachfront'
        ],
        description: 'Hikkaduwa is famous for its shallow coral reef and abundant marine life. It\'s the perfect spot for families and beginners to experience the underwater world of the Indian Ocean.',
        itinerary: [
            {
                day: 1,
                title: 'Coral Coast Adventure',
                description: 'We spend the morning on a glass bottom boat. In the afternoon, you can snorkel directly from the beach. We also stop at the Tsunami memorial and museum on the way back.'
            }
        ],
        experience: [
            { time: '09:00 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '10:30 AM', activity: 'Glass Bottom Boat Ride', icon: 'Ship' },
            { time: '12:00 PM', activity: 'Snorkeling/Beach Time', icon: 'Camera' },
            { time: '01:30 PM', activity: 'Seafood Lunch on the Beach', icon: 'Utensils' },
            { time: '03:30 PM', activity: 'Tsunami Photo Museum', icon: 'Castle' },
            { time: '05:00 PM', activity: 'Transfer back to Hotel', icon: 'Home' }
        ],
        includes: ['Private Vehicle', 'Glass Bottom Boat Ride', 'Snorkeling Gear provided', 'Driver assistance'],
        excludes: ['Lunch', 'Personal expenses'],
        notSuitable: ['None'],
        notAllowed: ['Touching or stepping on corals', 'Feeding fish']
    },
    {
        id: 'negombo-city-lagoon-tour',
        title: 'Negombo Heritage & Lagoon Tour',
        type: 'day trip',
        duration: '6-8 hours',
        price: { amount: 35, currency: 'USD' },
        category: 'Leisure',
        tags: ['Fishing Village', 'Lagoon', 'Canals'],
        image: 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
        pickupLocations: ['Colombo', 'Airport Hotels', 'Katunayake'],
        destinations: ['Negombo Fish Market', 'Dutch Canal', 'Negombo Lagoon'],
        highlights: [
            'Visit the bustling Lellama Fish Market',
            'Boat ride through the historic Dutch Canals',
            'Explore the Negombo Lagoon and mangrove swamps',
            'Visit the St. Mary\'s Church ("Little Rome")',
            'See the traditional "Oruwa" fishing catamarans'
        ],
        description: 'Discover the charm of this historic fishing town. Negombo is known for its strong Dutch influence, colorful churches, and its vital role in the island\'s fishing industry.',
        itinerary: [
            {
                day: 1,
                title: 'Fisherman\'s Tale',
                description: 'We start at the fish market to see the morning catch. Then, we take a boat through the canals and into the lagoon to observe traditional fishing methods and birdlife.'
            }
        ],
        experience: [
            { time: '08:30 AM', activity: 'Hotel Pickup', icon: 'Clock' },
            { time: '09:00 AM', activity: 'Negombo Fish Market Visit', icon: 'MapPin' },
            { time: '10:30 AM', activity: 'Dutch Canal Boat Safari', icon: 'Ship' },
            { time: '12:30 PM', activity: 'Fresh Seafood Lunch', icon: 'Utensils' },
            { time: '02:00 PM', activity: 'St. Mary\'s Church & City sights', icon: 'Castle' },
            { time: '04:00 PM', activity: 'Beach Walk & Sundowner', icon: 'Camera' },
            { time: '05:30 PM', activity: 'Transfer back to Hotel', icon: 'Home' }
        ],
        includes: ['Private Transport', 'Canal Boat Safari', 'Chauffeur-Guide', 'All Fuel/Parking'],
        excludes: ['Lunch', 'Tips'],
        notSuitable: ['None'],
        notAllowed: ['Littering in the lagoon']
    },
];

// Combine into a main export if needed, or just export dayTrips as tourPackages
export const tourPackages = dayTrips;
