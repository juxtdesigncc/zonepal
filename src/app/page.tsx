import { Suspense } from 'react';
import { ZonePalContent } from '@/components/zonepal-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZonePal - World Time Zone Converter',
  description: 'Convert and compare times across different time zones with an intuitive interface.',
};

export default function ZonePalPage() {
  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <Suspense fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      }>
        <ZonePalContent />
      </Suspense>
    </main>
  );
} 