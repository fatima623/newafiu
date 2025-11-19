import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { NewsEvent } from '@/types';

interface NewsCardProps {
  news: NewsEvent;
}

export default function NewsCard({ news }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/news-events/${news.id}`} className="h-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            news.category === 'news' ? 'bg-blue-950' : 'bg-green-600'
          }`}>
            {news.category.toUpperCase()}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-950 transition-colors flex-shrink-0">
            {news.title}
          </h3>
          <p className="text-gray-600 line-clamp-3 flex-1">{news.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
