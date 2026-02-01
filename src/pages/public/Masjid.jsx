import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BuildingLibraryIcon, MapPinIcon, UsersIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Masjid() {
    const [filter, setFilter] = useState('all');

    // Dummy data
    const masjids = [
        { id: 1, name: 'Masjid Besar Al-Ikhlas', type: 'Masjid Besar', address: 'Jl. Palembang-Betung Km. 29', capacity: 500, image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800' },
        { id: 2, name: 'Masjid Nurul Huda', type: 'Masjid Jami', address: 'Desa Pulau Harapan', capacity: 300, image: 'https://images.unsplash.com/photo-1552592659-009d7367856d?q=80&w=800' },
        { id: 3, name: 'Musholla Al-Amin', type: 'Musholla', address: 'Komplek Perkantoran', capacity: 50, image: 'https://images.unsplash.com/photo-1519817650390-e72938a8e3d6?q=80&w=800' },
    ];

    return (
        <div>
            {/* Header */}
            <section className="bg-emerald-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <h1 className="text-4xl font-bold mb-4">Data Masjid & Musholla</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Direktori tempat ibadah di wilayah Kecamatan Sembawa.
                    </p>
                </div>
            </section>

            {/* Directory */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Cari nama masjid..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-kemenag-green focus:ring-kemenag-green shadow-sm"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-kemenag-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >Semua</button>
                            <button
                                onClick={() => setFilter('masjid')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'masjid' ? 'bg-kemenag-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >Masjid</button>
                            <button
                                onClick={() => setFilter('musholla')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'musholla' ? 'bg-kemenag-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >Musholla</button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {masjids.map((masjid) => (
                            <div key={masjid.id} className="premium-card group hover:-translate-y-1 transition-transform">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={masjid.image}
                                        alt={masjid.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-gray-800 shadow-sm">
                                        {masjid.type}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{masjid.name}</h3>
                                    <p className="flex items-start gap-2 text-gray-600 text-sm mb-4 min-h-[40px]">
                                        <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        {masjid.address}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <UsersIcon className="w-4 h-4" />
                                            <span>Kapasitas {masjid.capacity}</span>
                                        </div>
                                        <Link to={`/masjid/${masjid.id}`} className="text-emerald-600 text-sm font-semibold hover:underline">
                                            Detail Info
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
