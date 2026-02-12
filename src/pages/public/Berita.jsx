import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDaysIcon, EyeIcon, UserIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { beritaApi } from '../../services/api';
import { formatDate } from '../../utils/date';

// Storage URL helper
const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function Berita() {
    const [beritas, setBeritas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get page from URL or default to 1
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        fetchBerita(page);
    }, [page]);

    const fetchBerita = async (pageNumber) => {
        setLoading(true);
        try {
            const response = await beritaApi.getAll({ page: pageNumber });
            setBeritas(response.data || []);
            setPagination({
                current_page: response.current_page || 1,
                last_page: response.last_page || 1,
                total: response.total
            });
        } catch (error) {
            console.error('Error fetching berita:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setSearchParams({ page: newPage });
            window.scrollTo(0, 0); // Scroll to top
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop'; // Default fallback
        if (path.startsWith('http')) return path;
        return `${STORAGE_URL}/storage/${path}`;
    };

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
            <section className="py-16 bg-white min-h-[60vh]">
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
                    ) : beritas.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-gray-500 text-lg">Belum ada berita yang diterbitkan.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {beritas.map((berita) => (
                                    <article key={berita.id} className="premium-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
                                        <Link to={`/berita/${berita.slug}`} className="block h-full flex flex-col">
                                            <div className="h-48 overflow-hidden relative flex-shrink-0">
                                                <img
                                                    src={getImageUrl(berita.gambar)}
                                                    alt={berita.judul}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {berita.kategori && (
                                                    <div className="absolute top-4 left-4 bg-kemenag-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                                                        {berita.kategori}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDaysIcon className="w-4 h-4" /> 
                                                        {formatDate(berita.published_at || berita.created_at || berita.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <EyeIcon className="w-4 h-4" /> {berita.views || 0}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-kemenag-green transition-colors line-clamp-2">
                                                    {berita.judul}
                                                </h2>
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                                    {berita.ringkasan}
                                                </p>
                                                <div className="text-kemenag-gold font-semibold text-sm flex items-center gap-1 mt-auto">
                                                    Baca Selengkapnya
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-2">
                                    <button 
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    
                                    <span className="px-4 text-sm font-medium text-gray-600">
                                        Halaman {pagination.current_page} dari {pagination.last_page}
                                    </span>

                                    <button 
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
