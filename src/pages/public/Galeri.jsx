import { useState } from 'react';
import { PlayCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';

export default function Galeri() {
    const [activeTab, setActiveTab] = useState('all');

    const items = [
        { type: 'photo', src: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800', title: 'Kegiatan Manasik Haji' },
        { type: 'video', src: 'https://images.unsplash.com/photo-1605306385567-27de111c19b6?q=80&w=800', title: 'Video Profil KUA' },
        { type: 'photo', src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800', title: 'Bimbingan Perkawinan' },
        { type: 'photo', src: 'https://images.unsplash.com/photo-1519817650390-e72938a8e3d6?q=80&w=800', title: 'Rapat Koordinasi' },
        { type: 'photo', src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800', title: 'Pelayanan Kantor' },
    ];

    const filteredItems = activeTab === 'all' ? items : items.filter(item => item.type === activeTab);

    return (
        <div>
            {/* Header */}
            <section className="bg-indigo-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold mb-4">Galeri Dokumentasi</h1>
                    <p className="text-white/80 max-w-2xl mx-auto mb-8">
                        Kumpulan dokumentasi kegiatan dan suasana pelayanan di lingkungan KUA Kecamatan Sembawa.
                    </p>

                    {/* Filter Tabs */}
                    <div className="inline-flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                        {['all', 'photo', 'video'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-kemenag-gold text-white shadow-lg'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {tab === 'all' ? 'Semua' : tab === 'photo' ? 'Foto' : 'Video'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 bg-white min-h-[50vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {filteredItems.map((item, idx) => (
                            <div key={idx} className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer">
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                                    {item.type === 'video' ? (
                                        <PlayCircleIcon className="w-16 h-16 mb-2 opacity-80" />
                                    ) : (
                                        <PhotoIcon className="w-12 h-12 mb-2 opacity-80" />
                                    )}
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
