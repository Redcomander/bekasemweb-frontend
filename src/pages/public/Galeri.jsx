import { useState, useEffect } from 'react';
import { PlayCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { galeriApi } from '../../services/api';

// Storage URL helper
const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function Galeri() {
    const [activeTab, setActiveTab] = useState('all');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchGaleri();
    }, []);

    const fetchGaleri = async () => {
        try {
            const response = await galeriApi.getAll();
            setItems(response.data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${STORAGE_URL}/storage/${path}`;
    };

    const getMediaType = (path) => {
        if (!path) return 'photo';
        const ext = path.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
        return 'photo';
    };

    // Filter items based on detected type
    const filteredItems = activeTab === 'all' 
        ? items 
        : items.filter(item => getMediaType(item.file_path) === activeTab);

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
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-kemenag-green border-t-transparent"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Belum ada dokumentasi.</p>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {filteredItems.map((item) => {
                                const type = getMediaType(item.file_path);
                                const url = getImageUrl(item.file_path);
                                const title = item.judul || item.title;
                                const description = item.deskripsi || item.description;
                                
                                return (
                                    <div 
                                        key={item.id} 
                                        onClick={() => setSelectedItem(item)}
                                        className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-gray-100 mb-8 cursor-pointer hover:shadow-xl transition-all duration-300"
                                    >
                                        {type === 'video' ? (
                                            <div className="relative">
                                                <video 
                                                    src={url} 
                                                    className="w-full h-auto" 
                                                    muted
                                                    preload="metadata"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                                    <PlayCircleIcon className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                    <PlayCircleIcon className="w-4 h-4" /> Video
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={url}
                                                alt={title}
                                                className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        )}
                                        
                                        {/* Overlay (For Photo) */}
                                        {type === 'photo' && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                                                <PhotoIcon className="w-12 h-12 mb-2 opacity-80" />
                                                <h3 className="font-bold text-lg">{title}</h3>
                                                {description && (
                                                    <p className="text-sm mt-2 opacity-90 line-clamp-2">{description}</p>
                                                )}
                                            </div>
                                        )}
                                        {/* Info (For Video) */}
                                        {type === 'video' && (
                                            <div className="p-4 bg-white border-t">
                                                <h3 className="font-bold text-gray-900">{title}</h3>
                                                {description && (
                                                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setSelectedItem(null)}
                >
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-[110]"
                    >
                        <XMarkIcon className="w-10 h-10" />
                    </button>
                    
                    <div 
                        className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {getMediaType(selectedItem.file_path) === 'video' ? (
                            <video 
                                src={getImageUrl(selectedItem.file_path)} 
                                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" 
                                controls 
                                autoPlay 
                            />
                        ) : (
                            <img 
                                src={getImageUrl(selectedItem.file_path)} 
                                alt={selectedItem.judul || selectedItem.title} 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                            />
                        )}
                        
                        <div className="mt-4 text-center text-white">
                            <h3 className="text-xl font-bold">{selectedItem.judul || selectedItem.title}</h3>
                            {(selectedItem.deskripsi || selectedItem.description) && (
                                <p className="text-white/80 mt-1">{selectedItem.deskripsi || selectedItem.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
