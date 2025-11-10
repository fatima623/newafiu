import NewsCard from '@/components/ui/NewsCard';
import { newsEvents } from '@/data/siteData';

export default function NewsEventsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-950 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">News & Events</h1>
          <p className="text-xl text-blue-100">Stay Updated with Latest Happenings at AFIU</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsEvents.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
