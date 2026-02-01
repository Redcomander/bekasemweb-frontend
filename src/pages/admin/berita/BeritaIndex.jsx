import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    MagnifyingGlassIcon, 
    PhotoIcon,
    EyeIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';
import MediaPicker from '../../../components/MediaPicker';

// Storage URL for images
const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

// Helper to get full image URL
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}/storage/${path}`;
};

export default function BeritaIndex() {
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ 
        judul: '', 
        konten: '', 
        kategori: '', 
        status: 'draft',
        gambar_url: '',
        ringkasan: ''
    });
    const [submitting, setSubmitting] = useState(false);
    
    // Category management
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [showCategorySection, setShowCategorySection] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    useEffect(() => {
        fetchBerita();
        fetchCategories();
    }, []);

    const fetchBerita = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/berita');
            setBerita(response.data || []);
        } catch (error) {
            console.error('Error fetching berita:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await api.get('/admin/kategori-berita');
            const cats = response.data || [];
            setCategories(cats);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Map frontend fields to backend expected fields
            const payload = {
                judul: formData.judul,
                isi: formData.konten, // Backend expects 'isi', not 'konten'
                ringkasan: formData.ringkasan,
                kategori: formData.kategori,
                status: formData.status,
                gambar: formData.gambar_url || null, // Send image path to backend
            };

            if (editingItem) {
                console.log('Updating berita ID:', editingItem.id, 'with payload:', payload);
                await api.put(`/admin/berita/${editingItem.id}`, payload);
            } else {
                console.log('Creating berita with payload:', payload);
                await api.post('/admin/berita', payload);
            }
            fetchBerita();
            closeModal();
        } catch (error) {
            alert(error.message || 'Gagal menyimpan berita');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus berita ini?')) return;
        try {
            await api.delete(`/admin/berita/${id}`);
            fetchBerita();
        } catch (error) {
            alert(error.message || 'Gagal menghapus berita');
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { 
            judul: item.judul, 
            konten: item.isi || '', // Backend uses 'isi', map to frontend 'konten'
            kategori: item.kategori || '', 
            status: item.status || 'draft',
            gambar_url: item.gambar ? getImageUrl(item.gambar) : '', // Convert path to full URL
            ringkasan: item.ringkasan || ''
        } : { 
            judul: '', 
            konten: '', 
            kategori: '', 
            status: 'draft',
            gambar_url: '',
            ringkasan: ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ judul: '', konten: '', kategori: '', status: 'draft', gambar_url: '', ringkasan: '' });
    };

    const handleMediaSelect = (media) => {
        setFormData({ ...formData, gambar_url: media.url });
    };

    // Preview modal functions
    const openPreview = (item) => {
        setPreviewItem(item);
        setShowPreviewModal(true);
    };

    const closePreview = () => {
        setShowPreviewModal(false);
        setPreviewItem(null);
    };

    // Category management functions - using API
    const addCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await api.post('/admin/kategori-berita', { nama: newCategory.trim() });
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Gagal menambah kategori');
        }
    };

    const updateCategory = async (id, nama) => {
        try {
            await api.put(`/admin/kategori-berita/${id}`, { nama: nama.trim() });
            setEditingCategoryIndex(null);
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Gagal update kategori');
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm('Hapus kategori ini?')) return;
        try {
            await api.delete(`/admin/kategori-berita/${id}`);
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Gagal menghapus kategori');
        }
    };

    const filteredBerita = berita.filter(b => 
        b.judul?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
                    <p className="text-gray-500 text-sm">Kelola berita dan pengumuman KUA</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Tambah Berita
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green focus:ring-2 focus:ring-kemenag-green/20 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                        Total: {filteredBerita.length}
                    </span>
                </div>
            </div>

            {/* Category Management */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button 
                    onClick={() => setShowCategorySection(!showCategorySection)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <span className="font-medium text-gray-700">Kelola Kategori</span>
                    {showCategorySection ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
                </button>
                {showCategorySection && (
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categoriesLoading ? (
                                <span className="text-sm text-gray-500">Memuat kategori...</span>
                            ) : categories.length === 0 ? (
                                <span className="text-sm text-gray-500">Belum ada kategori</span>
                            ) : (
                                categories.map((cat, index) => (
                                    <div key={cat.id} className="group flex items-center gap-1 bg-white border rounded-lg px-3 py-1.5 shadow-sm">
                                        {editingCategoryIndex === index ? (
                                            <input
                                                type="text"
                                                defaultValue={cat.nama}
                                                autoFocus
                                                onBlur={(e) => updateCategory(cat.id, e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && updateCategory(cat.id, e.target.value)}
                                                className="w-24 text-sm border-none outline-none bg-transparent"
                                            />
                                        ) : (
                                            <>
                                                <span className="text-sm text-gray-700 capitalize">{cat.nama}</span>
                                                <button onClick={() => setEditingCategoryIndex(index)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-blue-600 transition-opacity">
                                                    <PencilSquareIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => deleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-opacity">
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Kategori baru..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                                className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:border-kemenag-green"
                            />
                            <button onClick={addCategory} className="px-4 py-2 bg-kemenag-green text-white text-sm rounded-lg hover:bg-kemenag-green-dark">
                                Tambah
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Memuat data...</div>
                ) : filteredBerita.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p>Belum ada berita</p>
                    </div>
                ) : (
                    filteredBerita.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {item.gambar ? (
                                    <img src={getImageUrl(item.gambar)} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PhotoIcon className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        item.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                    }`}>
                                        {item.status === 'published' ? 'Terbit' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4">
                                <div className="text-xs text-gray-500 mb-2">
                                    {item.kategori && <span className="text-kemenag-green font-medium capitalize">{item.kategori}</span>}
                                    {item.kategori && ' • '}
                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    {item.author && (
                                        <>
                                            {' • '}
                                            <span className="text-gray-600">{item.author.name}</span>
                                        </>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-kemenag-green transition-colors">
                                    {item.judul}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {item.ringkasan || item.isi?.replace(/<[^>]*>/g, '').substring(0, 100)}
                                </p>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-1 mt-4 pt-4 border-t">
                                    <button onClick={() => openPreview(item)} className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                        <EyeIcon className="w-4 h-4" /> Preview
                                    </button>
                                    <Link to={`/berita/${item.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Publik
                                    </Link>
                                    <button onClick={() => openModal(item)} className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <PencilSquareIcon className="w-4 h-4" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <TrashIcon className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Editor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-6">
                                {/* Featured Image */}
                                <div>
                                    <label className="form-label">Gambar Utama</label>
                                    <div 
                                        onClick={() => setShowMediaPicker(true)}
                                        className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-kemenag-green transition-colors"
                                    >
                                        {formData.gambar_url ? (
                                            <div className="relative aspect-video">
                                                <img src={formData.gambar_url} alt="Featured" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-medium">Klik untuk ganti</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video flex flex-col items-center justify-center text-gray-400">
                                                <PhotoIcon className="w-12 h-12 mb-2" />
                                                <span className="text-sm">Klik untuk pilih gambar</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Title & Category */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="form-label">Judul Berita</label>
                                        <input
                                            type="text"
                                            value={formData.judul}
                                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                            className="form-input-premium"
                                            placeholder="Masukkan judul berita"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Kategori</label>
                                        <select
                                            value={formData.kategori}
                                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                            className="form-input-premium"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.slug}>{cat.nama}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <label className="form-label">Ringkasan <span className="font-normal text-gray-400">(opsional)</span></label>
                                    <textarea
                                        value={formData.ringkasan}
                                        onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                                        className="form-input-premium"
                                        rows="2"
                                        placeholder="Ringkasan singkat untuk preview"
                                    />
                                </div>

                                {/* Content Editor */}
                                <div>
                                    <label className="form-label">Konten</label>
                                    <div className="border rounded-xl overflow-hidden">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.konten}
                                            onChange={(value) => setFormData({ ...formData, konten: value })}
                                            modules={quillModules}
                                            placeholder="Tulis konten berita di sini..."
                                            className="h-64"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="form-label">Status Publikasi</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.status === 'draft' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="status" value="draft" checked={formData.status === 'draft'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="sr-only" />
                                            <div className="font-medium text-gray-900">Draft</div>
                                            <div className="text-sm text-gray-500">Simpan sebagai draft</div>
                                        </label>
                                        <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.status === 'published' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="status" value="published" checked={formData.status === 'published'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="sr-only" />
                                            <div className="font-medium text-gray-900">Terbitkan</div>
                                            <div className="text-sm text-gray-500">Publish ke publik</div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                                <button type="submit" disabled={submitting} className="btn-primary">
                                    {submitting ? 'Menyimpan...' : (editingItem ? 'Update Berita' : 'Simpan Berita')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Media Picker */}
            <MediaPicker 
                isOpen={showMediaPicker} 
                onClose={() => setShowMediaPicker(false)} 
                onSelect={handleMediaSelect} 
            />

            {/* Preview Modal */}
            {showPreviewModal && previewItem && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-kemenag-green to-kemenag-green-dark">
                            <div className="flex items-center gap-3">
                                <EyeIcon className="w-6 h-6 text-white" />
                                <span className="text-white font-semibold">Preview Berita</span>
                            </div>
                            <button onClick={closePreview} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Featured Image */}
                            {previewItem.gambar && (
                                <div className="w-full aspect-video bg-gray-100">
                                    <img 
                                        src={getImageUrl(previewItem.gambar)} 
                                        alt={previewItem.judul} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            {/* Content */}
                            <div className="p-6">
                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        previewItem.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {previewItem.status === 'published' ? 'Terbit' : 'Draft'}
                                    </span>
                                    {previewItem.kategori && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-kemenag-green/10 text-kemenag-green capitalize">
                                            {previewItem.kategori}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        {new Date(previewItem.created_at).toLocaleDateString('id-ID', { 
                                            day: 'numeric', month: 'long', year: 'numeric' 
                                        })}
                                    </span>
                                    {previewItem.author && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                            Penulis: {previewItem.author.name}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{previewItem.judul}</h1>

                                {/* Summary */}
                                {previewItem.ringkasan && (
                                    <p className="text-gray-600 italic border-l-4 border-kemenag-green pl-4 mb-6">
                                        {previewItem.ringkasan}
                                    </p>
                                )}

                                {/* Content (rendered HTML) */}
                                <div 
                                    className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-kemenag-green"
                                    dangerouslySetInnerHTML={{ __html: previewItem.isi }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                            <span className="text-sm text-gray-500">
                                ID: {previewItem.id} | Slug: {previewItem.slug}
                            </span>
                            <div className="flex gap-3">
                                <button onClick={closePreview} className="btn-secondary">Tutup</button>
                                <button onClick={() => { closePreview(); openModal(previewItem); }} className="btn-primary flex items-center gap-2">
                                    <PencilSquareIcon className="w-4 h-4" /> Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
