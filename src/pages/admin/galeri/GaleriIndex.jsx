import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function GaleriIndex() {
    const [galeri, setGaleri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ judul: '', deskripsi: '', file: null });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/galeri');
            setGaleri(response.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('deskripsi', formData.deskripsi);
            if (formData.file) data.append('file', formData.file);
            
            await api.post('/admin/galeri', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchData();
            closeModal();
        } catch (error) {
            alert(error.message || 'Gagal upload');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus?')) return;
        try {
            await api.delete(`/admin/galeri/${id}`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ judul: '', deskripsi: '', file: null });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Galeri</h1>
                    <p className="text-gray-500 text-sm">Kelola foto dan dokumentasi</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Upload Foto
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Memuat...</div>
                ) : galeri.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Belum ada foto</div>
                ) : (
                    galeri.map((item) => (
                        <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <img src={item.url} alt={item.judul} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                <p className="text-white text-sm font-medium truncate">{item.judul}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">Upload Foto</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Judul</label>
                                <input type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Deskripsi</label>
                                <textarea value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="form-input-premium" rows="2" />
                            </div>
                            <div>
                                <label className="form-label">File Foto</label>
                                <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} className="form-input-premium" required />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Mengupload...' : 'Upload'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
