/**
 * SEO Keywords Library — Top 150 Sri Lanka Airport Taxi & Tour Keywords
 * Organized by cluster and search intent.
 * Used by the AI SEO Engine for bulk content generation and gap analysis.
 */

export const SEO_KEYWORD_CLUSTERS = [
    {
        id: 'airport-transfers',
        label: '✈️ Airport Transfers',
        color: 'blue',
        description: 'High-intent keywords for CMB airport pickup/drop',
        keywords: [
            'colombo airport taxi',
            'airport taxi sri lanka',
            'colombo airport transfer',
            'CMB airport cab',
            'bandaranaike airport taxi',
            'airport pickup sri lanka',
            'airport drop sri lanka',
            'airport taxi colombo to kandy',
            'airport taxi colombo to galle',
            'airport taxi colombo to negombo',
            'airport taxi colombo to sigiriya',
            'airport taxi colombo to mirissa',
            'airport taxi colombo to nuwara eliya',
            'airport taxi colombo to ella',
            'airport taxi colombo to bentota',
            'airport taxi colombo to unawatuna',
            'airport taxi colombo to hikkaduwa',
            'airport taxi colombo to trincomalee',
            'airport taxi colombo to arugam bay',
            'airport taxi colombo to dambulla',
        ]
    },
    {
        id: 'city-transfers',
        label: '🏙️ City Transfers',
        color: 'purple',
        description: 'Intercity taxi routes across Sri Lanka',
        keywords: [
            'taxi colombo to kandy',
            'taxi colombo to galle',
            'taxi kandy to ella',
            'taxi galle to mirissa',
            'taxi colombo to negombo',
            'private driver sri lanka',
            'intercity taxi sri lanka',
            'colombo to sigiriya taxi',
            'kandy to nuwara eliya taxi',
            'galle to colombo taxi',
            'ella to colombo taxi',
            'negombo to kandy taxi',
            'taxi hire sri lanka',
            'car hire with driver sri lanka',
            'chauffeur service sri lanka',
            'private car rental sri lanka',
            'van hire sri lanka',
            'kdh van rental sri lanka',
            'minivan hire sri lanka',
        ]
    },
    {
        id: 'day-tours',
        label: '🌴 Day Tours',
        color: 'green',
        description: 'Day trip tour packages from major cities',
        keywords: [
            'day tours from colombo airport',
            'day trips from colombo',
            'day tour from negombo',
            'kandy day tour from colombo',
            'sigiriya day tour from colombo',
            'galle day tour from colombo',
            'day tour packages sri lanka',
            'one day tour sri lanka',
            'colombo sightseeing tour',
            'sri lanka private day tour',
            'elephant orphanage day tour',
            'pinnawala day tour from colombo',
            'dambulla cave temple day tour',
            'botanical gardens kandy tour',
            'tea plantation tour sri lanka',
            'yala safari day tour',
        ]
    },
    {
        id: 'beach-routes',
        label: '🏖️ Beach Routes',
        color: 'cyan',
        description: 'Transfers to Sri Lanka beach destinations',
        keywords: [
            'taxi to mirissa beach',
            'taxi to unawatuna',
            'taxi to hikkaduwa',
            'taxi to arugam bay',
            'taxi to bentota beach',
            'taxi to negombo beach',
            'taxi to tangalle beach',
            'colombo to south coast taxi',
            'beach transfer sri lanka',
            'galle beach transfer',
            'weligama taxi transfer',
            'taxi to trincomalee beach',
        ]
    },
    {
        id: 'hills-routes',
        label: '⛰️ Hill Country Routes',
        color: 'amber',
        description: 'Routes to Sri Lanka hill country destinations',
        keywords: [
            'taxi to nuwara eliya',
            'taxi to ella sri lanka',
            'taxi to hatton sri lanka',
            'kandy to ella taxi',
            'colombo to hill country taxi',
            'nine arch bridge taxi',
            'little adam peak taxi',
            'ella rock taxi',
            'sri lanka tea country taxi',
            'hatton to ella taxi',
            'nuwara eliya to colombo taxi',
        ]
    },
    {
        id: 'cultural-triangle',
        label: '🏛️ Cultural Triangle',
        color: 'orange',
        description: 'Transfers to UNESCO heritage sites',
        keywords: [
            'sigiriya rock fortress taxi',
            'polonnaruwa taxi transfer',
            'anuradhapura taxi',
            'cultural triangle tour',
            'taxi to sigiriya',
            'dambulla cave temple taxi',
            'colombo to sigiriya driver',
            'minneriya elephant safari transfer',
            'colombo to anuradhapura taxi',
            'ancient cities tour sri lanka',
        ]
    },
    {
        id: 'wedding-special',
        label: '💍 Special Services',
        color: 'rose',
        description: 'Premium and specialty taxi services',
        keywords: [
            'airport taxi 24 hours sri lanka',
            'midnight airport taxi sri lanka',
            'early morning airport taxi sri lanka',
            'airport taxi with name board sri lanka',
            'luxury taxi sri lanka',
            'executive car service sri lanka',
            'wedding car hire sri lanka',
            'airport meet and greet sri lanka',
            'vip transfer sri lanka',
            'airport taxi booking sri lanka',
        ]
    },
    {
        id: 'comparison',
        label: '🔍 Comparison / Intent',
        color: 'slate',
        description: 'Comparison and decision-stage keywords',
        keywords: [
            'best taxi service sri lanka',
            'cheapest airport taxi colombo',
            'reliable airport taxi sri lanka',
            'trusted taxi service sri lanka',
            'top rated taxi sri lanka',
            'airport taxi vs uber sri lanka',
            'pickme vs airport taxi',
            'fixed rate airport taxi sri lanka',
            'no hidden charges taxi sri lanka',
            'english speaking driver sri lanka',
            'safe taxi service sri lanka',
        ]
    },
    {
        id: 'blog-content',
        label: '📝 Informational / Blog',
        color: 'indigo',
        description: 'Top-of-funnel content and blog keywords',
        keywords: [
            'how to get from colombo airport to colombo city',
            'how to get from airport to kandy',
            'things to do in sri lanka',
            'best places to visit in sri lanka',
            'sri lanka travel guide 2025',
            'sri lanka itinerary 7 days',
            'sri lanka itinerary 10 days',
            'colombo airport guide',
            'arriving at colombo airport guide',
            'sri lanka transportation guide',
            'best time to visit sri lanka',
            'sri lanka honeymoon itinerary',
            'cost of taxi in sri lanka',
            'is taxi safe in sri lanka',
            'sri lanka budget travel transport',
        ]
    }
];

// Flat list of all keywords for gap analysis
export const ALL_SEO_KEYWORDS = SEO_KEYWORD_CLUSTERS.flatMap(c => c.keywords);

// Total keyword count
export const TOTAL_KEYWORD_COUNT = ALL_SEO_KEYWORDS.length;
