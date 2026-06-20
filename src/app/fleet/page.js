import FleetSection from '@/components/FleetSection';

export const metadata = {
  title: 'Our Premium Fleet | Airport Taxis Sri Lanka',
  description: 'Explore our premium fleet of vehicles including Mini Cars, Sedans, SUVs, and luxury KDH Vans for your Sri Lankan journey. All vehicles are AC equipped and driven by professionals.',
  alternates: { canonical: 'https://airporttaxis.lk/fleet' },
  openGraph: {
      title: 'Our Premium Fleet | Airport Taxis Sri Lanka',
      description: 'Choose the perfect vehicle for your journey in Sri Lanka. Comfortable, AC-equipped Mini Cars, Sedans, and luxury KDH Vans.',
      url: 'https://airporttaxis.lk/fleet',
  }
};

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors pt-12">
      <FleetSection />
    </div>
  );
}
