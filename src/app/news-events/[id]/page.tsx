import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { newsEvents } from '@/data/siteData';

export default function NewsDetailPage({ params }: { params: any }) {
  const news = newsEvents.find((n) => n.id === params.id);

  if (!news) {
    notFound();
  }

  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10">
        <div className="container mx-auto px-4">
          <Link href="/news-events" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4">
            <ArrowLeft size={20} />
            Back to News & Events
          </Link>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4 ${
            news.category === 'news' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {news.category.toUpperCase()}
          </span>
          <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
            />
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-6">{news.excerpt}</p>
              <p className="text-gray-600">{news.content || 'Full content coming soon...'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
