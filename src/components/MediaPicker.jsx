import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhotoIcon, CheckIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

// Base URL for storage files
const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function MediaPicker({ isOpen, onClose, onSelect }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('gallery'); // 'gallery' | 'upload'

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            setSelected(null);
        }
    }, [isOpen]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/galeri', { params: { tipe: 'foto', per_page: 50 } });
            // Handle paginated response
            const data = response.data?.data || response.data || [];
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (item) => {
        if (!item) return '';
        // Try different possible field names
        if (item.url) return item.url;
        if (item.file_path) {
            // If it's a relative path, prepend storage URL
            if (item.file_path.startsWith('http')) return item.file_path;
            return `${STORAGE_URL}/storage/${item.file_path}`;
        }
        if (item.thumbnail) {
            if (item.thumbnail.startsWith('http')) return item.thumbnail;
            return `${STORAGE_URL}/storage/${item.thumbnail}`;
        }
        return '';
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('judul', file.name.replace(/\.[^/.]+$/, '')); // Remove extension
            formData.append('tipe', 'foto');

            const response = await api.post('/admin/galeri', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Get the uploaded item from response
            const uploadedItem = response.data?.data || response.data;
            if (uploadedItem) {
                setSelected(uploadedItem);
                setTab('gallery');
            }
            fetchImages();
        } catch (error) {
            alert(error.message || 'Gagal upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSelect = () => {
        if (selected) {
            // Return object with url
            onSelect({
                ...selected,
                url: getImageUrl(selected)
            });
            onClose();
            setSelected(null);
        }
    };

    const handleImageClick = (img) => {
        setSelected(img);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Pilih Media</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button 
                        onClick={() => setTab('gallery')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'gallery' ? 'text-kemenag-green border-b-2 border-kemenag-green' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <PhotoIcon className="w-5 h-5 inline mr-2" />
                        Galeri ({images.length})
                    </button>
                    <button 
                        onClick={() => setTab('upload')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'upload' ? 'text-kemenag-green border-b-2 border-kemenag-green' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowUpTrayIcon className="w-5 h-5 inline mr-2" />
                        Upload Baru
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {tab === 'gallery' ? (
                        loading ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="w-8 h-8 border-4 border-kemenag-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                Memuat gambar...
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <p>Belum ada gambar di galeri</p>
                                <button onClick={() => setTab('upload')} className="mt-4 text-kemenag-green hover:underline">
                                    Upload gambar baru
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {images.map((img) => (
                                    <div
                                        key={img.id}
                                        onClick={() => handleImageClick(img)}
                                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                            selected?.id === img.id 
                                                ? 'border-kemenag-green ring-2 ring-kemenag-green/30' 
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img 
                                            src={getImageUrl(img)} 
                                            alt={img.judul || 'Gambar'} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">No Image</text></svg>';
                                            }}
                                        />
                                        {selected?.id === img.id && (
                                            <div className="absolute inset-0 bg-kemenag-green/20 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-kemenag-green rounded-full flex items-center justify-center">
                                                    <CheckIcon className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <label className="cursor-pointer group">
                                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center group-hover:border-kemenag-green group-hover:bg-green-50 transition-colors">
                                    {uploading ? (
                                        <>
                                            <div className="w-10 h-10 border-4 border-kemenag-green border-t-transparent rounded-full animate-spin mb-3"></div>
                                            <span className="text-sm text-gray-500">Mengupload...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 group-hover:text-kemenag-green mb-3" />
                                            <span className="text-sm text-gray-500 group-hover:text-kemenag-green">Klik untuk upload</span>
                                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, max 5MB</span>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleUpload} 
                                    className="hidden" 
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                    <div className="text-sm text-gray-500">
                        {selected ? (
                            <span className="text-kemenag-green font-medium">✓ {selected.judul || 'Gambar dipilih'}</span>
                        ) : (
                            'Klik gambar untuk memilih'
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                            Batal
                        </button>
                        <button 
                            onClick={handleSelect} 
                            disabled={!selected}
                            className={`px-4 py-2 bg-kemenag-green text-white rounded-lg font-medium ${!selected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-kemenag-green-dark'}`}
                        >
                            Pilih Gambar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
