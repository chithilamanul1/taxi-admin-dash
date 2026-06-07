import RecentPosts from '@/components/RecentPosts';

export const metadata = {
  title: 'Travel Insights & Journal | Airport Taxi Tours Sri Lanka',
  description: 'Discover Sri Lanka through the eyes of our expert travel guides and professional chauffeurs.',
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors pt-12">
      <RecentPosts />
    </main>
  );
}
