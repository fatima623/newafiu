import NewsCard from '@/components/ui/NewsCard';
import { newsEvents } from '@/data/siteData';

export default function NewsEventsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#051238] to-[#2A7B9B] text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-lg text-white">Stay Updated with Latest Happenings at AFIU</p>
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
