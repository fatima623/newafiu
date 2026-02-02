'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGalleryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard/gallery');
  }, [router]);

  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950 mx-auto"></div>
    </div>
  );
}
