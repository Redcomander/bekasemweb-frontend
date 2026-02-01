import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function MasjidIndex() {
    const [masjid, setMasjid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ nama: '', alamat: '', jenis: 'masjid', latitude: '', longitude: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/masjid');
            setMasjid(response.data || []);
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
            if (editingItem) {
                await api.put(`/admin/masjid/${editingItem.id}`, formData);
            } else {
                await api.post('/admin/masjid', formData);
            }
            fetchData();
            closeModal();
        } catch (error) {
            alert(error.message || 'Gagal menyimpan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus?')) return;
        try {
            await api.delete(`/admin/masjid/${id}`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { nama: '', alamat: '', jenis: 'masjid', latitude: '', longitude: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const filtered = masjid.filter(m => m.nama?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Masjid</h1>
                    <p className="text-gray-500 text-sm">Kelola data masjid dan musholla</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Tambah Masjid
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari masjid..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Memuat data...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Belum ada data</div>
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.jenis === 'masjid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {item.jenis === 'masjid' ? 'Masjid' : 'Musholla'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><PencilSquareIcon className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{item.nama}</h3>
                            <p className="text-sm text-gray-500 flex items-start gap-1">
                                <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.alamat || '-'}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Tambah'} Masjid</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Nama</label>
                                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Jenis</label>
                                <select value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})} className="form-input-premium">
                                    <option value="masjid">Masjid</option>
                                    <option value="musholla">Musholla</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="form-input-premium" rows="2" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
