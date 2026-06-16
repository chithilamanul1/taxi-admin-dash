const fs = require('fs');
const layouts = {
  'custom-trip': { title: 'Custom Trip Planner | Plan Your Dream Sri Lanka Tour', desc: 'Design your own custom tour in Sri Lanka. Choose destinations, select vehicles, and get instant pricing for your personalized itinerary.' },
  'gallery': { title: 'Gallery | Our Vehicles & Happy Travelers', desc: 'View photos of our luxury fleet and happy clients traveling across Sri Lanka.' },
  'reviews': { title: 'Client Reviews | Airport Taxis Sri Lanka', desc: 'Read what our clients say about our airport transfer and tour services in Sri Lanka. Trusted by thousands of happy travelers worldwide.' },
  'offers': { title: 'Special Offers & Discounts | Airport Taxis Sri Lanka', desc: 'Check out our latest special offers, seasonal discounts, and coupon codes for airport transfers and Sri Lanka round tours.' },
  'privacy-policy': { title: 'Privacy Policy | Airport Taxis Sri Lanka', desc: 'Our privacy policy explains how we collect, use, and protect your personal information when you use our taxi booking services.' },
  'refund-policy': { title: 'Refund Policy | Airport Taxis Sri Lanka', desc: 'Read our refund and cancellation policy for airport taxi bookings, day trips, and multi-day tours in Sri Lanka.' },
  'terms': { title: 'Terms & Conditions | Airport Taxis Sri Lanka', desc: 'Terms and conditions for using Airport Taxis Sri Lanka services, including booking rules, liability, and passenger guidelines.' },
  'support': { title: 'Customer Support | Airport Taxis Sri Lanka', desc: 'Need help with your booking? Contact our 24/7 customer support team for airport transfers and tours in Sri Lanka.' }
};

for (const [dir, data] of Object.entries(layouts)) {
  const content = `export const metadata = {
    title: '${data.title}',
    description: '${data.desc}',
    alternates: { canonical: 'https://srilankantaxi.lk/${dir}' }
};
export default function Layout({ children }) { return children; }
`;
  fs.writeFileSync(`src/app/${dir}/layout.js`, content);
}
