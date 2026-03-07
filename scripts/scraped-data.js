const toursData = [
    {
        "title": "Galle and Bentota Day-Tour From Colombo",
        "category": "day-trip",
        "description": "After being picked up at your hotel, hop onboard your Madu Ganga Magrove boat safari and explore the Madu River. See the mangrove forests and marshlands that surround the river. Stop at a cinnamon garden and see a local family at work. Then, head to a turtle sanctuary and see the conservation efforts for sea turtles. Afterward, continue to the Galle Fort, a UNESCO World Heritage Site.",
        "inclusions": ["English-speaking driver", "Hotel pickup and drop-off (Colombo city & coastal areas)", "AC Transport", "Expressway toll", "Bottled water"],
        "exclusions": ["Madu river boat safari ($30 solo / $25 pp)", "Turtle Hatchery Ticket ($15)", "Galle Fort entry (Free)", "Food & drinks"],
        "experience": [
            { "heading": "Madu Ganga", "text": "Explore the mangrove forests and marshlands on a boat safari." },
            { "heading": "Local Cinnamon Garden", "text": "Visit a cinnamon garden and witness the traditional process." },
            { "heading": "Turtle Sanctuary", "text": "Learn about the conservation efforts for sea turtles." },
            { "heading": "Stilt fishermen", "text": "See the famous stilt fishermen in action along the coast." },
            { "heading": "Galle Fort", "text": "Visit the historic Galle Fort, a UNESCO World Heritage Site." }
        ],
        "notSuitableFor": ["Back problems", "Insect allergies", "Pregnant women", "Wheelchair users"],
        "notAllowed": ["Pets", "Nudity", "Alcohol/Drugs", "Smoking in vehicle"]
    },
    {
        "title": "From Colombo : Day Trip to Kandy | Pinnwala | Royal Gardens",
        "category": "day-trip",
        "description": "Explore the highlights of Kandy and Pinnawala on a full-day tour from Colombo. Visit the Pinnawala Elephant Orphanage, see the majestic elephants in the river, then head to the Temple of the Sacred Tooth Relic in Kandy. Enjoy the beauty of the Royal Botanical Gardens and explore a local tea factory.",
        "inclusions": ["Complimentary pickup and drop-off", "Luxury, air-conditioned vehicle", "Experienced Driver/Guide", "Bottled water"],
        "exclusions": ["Pinnwala Entrance ($16)", "Royal Botanical Gardens ($10)", "Temple of Tooth ($6)", "Lunch"],
        "experience": [
            { "heading": "Pinnawala Elephant Orphanage", "text": "Observe elephants as they bathe in the river and learn about conservation." },
            { "heading": "Temple of the Sacred Tooth Relic", "text": "Visit the most sacred Buddhist site in Sri Lanka." },
            { "heading": "Royal Botanical Gardens", "text": "Stroll through the lush gardens and see the giant bamboo and orchids." },
            { "heading": "Tea Factory", "text": "Learn about the tea-making process and enjoy a fresh cup of Ceylon tea." }
        ],
        "notSuitableFor": ["Back problems", "Mobility issues"],
        "notAllowed": ["Smoking", "Nudity at religious sites"]
    },
    {
        "title": "From Colombo : Sigiriya and Dambulla Day Trip and Safari",
        "category": "day-trip",
        "description": "Discover the ancient wonders of Sigiriya and Dambulla. Climb the Sigiriya Lion Rock for stunning views, explore the Dambulla Cave Temple with its ancient frescoes, and embark on a thrilling wildlife safari in Minneriya National Park.",
        "inclusions": ["Hotel pickup/drop-off", "English-speaking driver", "Bottled water", "Guide Assistance in Sigiriya", "King coconut"],
        "exclusions": ["Entrance fees", "Safari Jeep charges", "Lunch"],
        "experience": [
            { "heading": "Sigiriya Lion Rock", "text": "Climb the ancient fortress and see the world-famous frescoes." },
            { "heading": "Dambulla Cave Temple", "text": "Explore the five caves filled with statues and paintings of Buddha." },
            { "heading": "Wildlife Safari", "text": "Spot wild elephants and other wildlife in Minneriya National Park." }
        ],
        "notSuitableFor": ["Back problems", "Heart conditions", "Fear of heights"],
        "notAllowed": ["Pets", "Alcohol"]
    },
    {
        "title": "06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo",
        "category": "tour-package",
        "duration": { "days": 6, "nights": 5 },
        "description": "A comprehensive 6-day tour covering major cultural and natural landmarks including the Pinnawala Elephant Orphanage, Temple of the Tooth in Kandy, Royal Botanical Gardens, Sigiriya Rock Fortress, Sea Turtle Hatchery in Kosgoda, and a city tour of Colombo.",
        "inclusions": [
            "Meeting at airport & assistance",
            "AC Transportation",
            "English speaking chauffeur/guide",
            "Accommodation (selected category)",
            "Meals as per itinerary (HB/FB)",
            "2 water bottles per day"
        ],
        "exclusions": [
            "International Air Fare",
            "Entrance fees to parks/sites",
            "Jeep/Boat charges",
            "Travel Insurance",
            "Tips & extras"
        ],
        "experience": [
            { "heading": "Day 1: Airport - Pinnawala - Kandy", "text": "Visit Pinnawala Elephant Orphanage, then Kandy Temple & Cultural Show." },
            { "heading": "Day 2: Kandy - Peradeniya - Nuwara Eliya", "text": "Visit Botanical Garden, Tea Factory, Ramboda Falls and Little England." },
            { "heading": "Day 3: Kandy - Dambulla - Minneriya", "text": "Visit Spice Garden, Cave Temple and Minneriya Safari." },
            { "heading": "Day 4: Sigiriya - Colombo", "text": "Climb Sigiriya Rock Fortress, then transfer to Colombo city." },
            { "heading": "Day 5: Colombo - Bentota - Galle", "text": "Madu River boat ride, Turtle Hatchery, Moonstone Mines, and Galle Fort." },
            { "heading": "Day 6: Colombo City - Airport", "text": "City tour of Colombo and transfer to airport." }
        ],
        "notSuitableFor": ["Wheelchair users", "Severe back issues"],
        "notAllowed": ["Drones", "Pets", "Nudity"]
    },
    {
        "title": "Sri Lanka Classic & Northern Tour -10 Days | 09 Nights",
        "category": "tour-package",
        "duration": { "days": 10, "nights": 9 },
        "description": "A 10-day northern adventure covering the cultural triangle and the northern capital, Jaffna. Highlights include Anuradhapura, Jaffna, Trincomalee, Polonnaruwa, and Sigiriya.",
        "inclusions": ["AC Transportation", "Guide Service", "Accommodation", "Half Board meals", "Water bottles"],
        "experience": [
            { "heading": "Day 1-2: Anuradhapura", "text": "Explore the sacred city ruins and Bodhi Tree." },
            { "heading": "Day 3: Jaffna", "text": "Visit Nallur Kovil and Jaffna Fort." },
            { "heading": "Day 4-5: Trincomalee", "text": "Beach relaxation and Koneswaram Temple visit." },
            { "heading": "Day 6: Polonnaruwa", "text": "Explore the medieval capital ruins." },
            { "heading": "Day 7: Sigiriya & Dambulla", "text": "Climb Lion Rock and see Cave Temples." },
            { "heading": "Day 8-9: Kandy & Colombo", "text": "Temple of Tooth and Colombo City tour." },
            { "heading": "Day 10: Departure", "text": "Transfer to Airport." }
        ]
    }
    // ... (Full data will be included in the script)
];

module.exports = toursData;
