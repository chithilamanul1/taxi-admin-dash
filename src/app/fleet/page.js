import FleetSection from '@/components/FleetSection';

export const metadata = {
  title: 'Our Premium Fleet | Airport Taxi Tours Sri Lanka',
  description: 'Explore our premium fleet of vehicles including Mini Cars, Sedans, SUVs, and KDH Vans for your Sri Lankan journey.',
};

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors pt-12">
      <FleetSection />
    </main>
  );
}
