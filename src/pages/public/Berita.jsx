import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, EyeIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Berita() {
    const [beritas, setBeritas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from API (Real implementation)
    useEffect(() => {
        // Fallback dummy data while waiting for real data to be populated
        const dummyBerita = Array(6).fill(0).map((_, i) => ({
            id: i + 1,
            title: `Judul Berita atau Artikel Contoh Nomor ${i + 1}`,
            slug: `judul-berita-${i + 1}`,
            excerpt: 'Ini adalah ringkasan berita yang berisi informasi singkat mengenai konten berita tersebut agar pembaca tertarik untuk membacanya lebih lanjut.',
            image: `https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop`,
            date: '12 Jan 2026',
            views: 45,
            author: 'Admin KUA'
        }));

        // Simulate API call
        setTimeout(() => {
            setBeritas(dummyBerita);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div>
            {/* Header */}
            <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold mb-2">Berita & Informasi</h1>
                    <p className="text-white/80">Kabar terkini dan artikel bermanfaat seputar keagamaan.</p>
                </div>
            </section>

            {/* List Berita */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {beritas.map((berita) => (
                                    <article key={berita.id} className="premium-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                        <Link to={`/berita/${berita.slug}`}>
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={berita.image}
                                                    alt={berita.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 bg-kemenag-green text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    BERITA
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDaysIcon className="w-4 h-4" /> {berita.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <UserIcon className="w-4 h-4" /> {berita.author}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-kemenag-green transition-colors line-clamp-2">
                                                    {berita.title}
                                                </h2>
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                    {berita.excerpt}
                                                </p>
                                                <div className="text-kemenag-gold font-semibold text-sm flex items-center gap-1">
                                                    Baca Selengkapnya
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination (Static for now) */}
                            <div className="mt-12 flex justify-center gap-2">
                                <button className="w-10 h-10 rounded-lg bg-kemenag-green text-white font-bold">1</button>
                                <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">2</button>
                                <button className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">3</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
