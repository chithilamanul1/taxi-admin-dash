'use client';

import dynamic from 'next/dynamic';
import BookingWidgetSkeleton from './BookingWidgetSkeleton';

const BookingWidget = dynamic(() => import('./BookingWidget'), { 
  ssr: false,
  loading: () => <BookingWidgetSkeleton />
});

export default function AirportTransferWrapper() {
  return <BookingWidget />;
}
