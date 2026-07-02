const fs = require('fs');

const meta = {
  'src/app/about/page.js': {
    title: 'About Airport Taxis (Pvt) Ltd - Sri Lanka | Our Story & Mission',
    description: 'Learn about Airport Taxis (Pvt) Ltd, Sri Lanka\'s most trusted travel and taxi service provider. Discover our mission to provide safe, reliable, and premium transportation.',
    keywords: ['about sri lanka taxi', 'trusted taxi service colombo', 'sri lanka travel agency', 'airport taxis pvt ltd']
  },
  'src/app/contact/page.js': {
    title: 'Contact Us | Airport Taxis (Pvt) Ltd - Sri Lanka 24/7 Support',
    description: 'Get in touch with Airport Taxis (Pvt) Ltd. We offer 24/7 customer support for taxi bookings, airport transfers, and custom Sri Lanka round tours.',
    keywords: ['contact sri lanka taxi', 'taxi booking phone number colombo', 'customer support airport taxi sri lanka', 'book a cab sri lanka']
  },
  'src/app/fleet/page.js': {
    title: 'Our Vehicle Fleet | Premium Cars, Vans & SUVs - Sri Lanka Taxi',
    description: 'Explore our modern fleet of vehicles in Sri Lanka. From comfortable sedans and luxury SUVs to spacious vans and mini-buses for group tours. Safe and reliable.',
    keywords: ['sri lanka taxi fleet', 'rent KDH van sri lanka', 'luxury suv taxi colombo', 'premium cars for rent sri lanka']
  },
  'src/app/services/page.js': {
    title: 'Our Services | Airport Transfers, Round Tours & Taxi Hire in Sri Lanka',
    description: 'Discover the premier transportation services offered by Airport Taxis (Pvt) Ltd. We specialize in airport drop-offs, intercity rides, and custom holiday tours across Sri Lanka.',
    keywords: ['sri lanka taxi services', 'airport transfer sri lanka', 'hire car with driver colombo', 'tourist transport services sri lanka']
  },
  'src/app/tour-packages/page.js': {
    title: 'Sri Lanka Tour Packages | Best Round Tours & Holiday Itineraries',
    description: 'Book the best holiday tour packages in Sri Lanka. Explore our curated itineraries featuring Kandy, Ella, Sigiriya, Galle, and wildlife safaris with private drivers.',
    keywords: ['sri lanka tour packages', 'best holiday itineraries sri lanka', 'private driver tours colombo', 'sri lanka round tour packages']
  },
  'src/app/day-trips/page.js': {
    title: 'Sri Lanka Day Trips & Excursions | 1-Day Tours from Colombo',
    description: 'Discover amazing 1-day trips in Sri Lanka. Book quick excursions to Sigiriya, Galle Fort, Kandy, or wildlife safaris with our professional drivers.',
    keywords: ['sri lanka day trips', '1 day tour colombo', 'sigiriya day trip', 'galle day tour', 'short excursions sri lanka']
  }
};

for (const [file, data] of Object.entries(meta)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('export const metadata')) {
      const metadataStr = \`
export const metadata = {
  title: '\${data.title}',
  description: '\${data.description}',
  keywords: \${JSON.stringify(data.keywords)},
};
\`;
      // Inject after the last import statement
      const importRegex = /import.*?['\"].*?['\"];?/g;
      let lastMatch = null;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastMatch = match;
      }
      
      if (lastMatch) {
        const insertIndex = lastMatch.index + lastMatch[0].length;
        content = content.slice(0, insertIndex) + '\n' + metadataStr + content.slice(insertIndex);
      } else {
        content = metadataStr + '\n' + content;
      }
      fs.writeFileSync(file, content);
      console.log('Updated ' + file);
    } else {
      console.log('Skipped ' + file + ' (already has metadata)');
    }
  } else {
    console.log('Not found: ' + file);
  }
}
