import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function MajelisIndex() {
    const [majelis, setMajelis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ nama: '', ketua: '', alamat: '', jumlah_anggota: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/majelis-taklim');
            setMajelis(response.data || []);
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
                await api.put(`/admin/majelis-taklim/${editingItem.id}`, formData);
            } else {
                await api.post('/admin/majelis-taklim', formData);
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
            await api.delete(`/admin/majelis-taklim/${id}`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || { nama: '', ketua: '', alamat: '', jumlah_anggota: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const filtered = majelis.filter(m => m.nama?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Majelis Taklim</h1>
                    <p className="text-gray-500 text-sm">Kelola data majelis taklim</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Tambah Majelis
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari majelis..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green outline-none" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Memuat data...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Belum ada data</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketua</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anggota</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-kemenag-green/10 rounded-lg flex items-center justify-center">
                                                    <UserGroupIcon className="w-5 h-5 text-kemenag-green" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.nama}</div>
                                                    <div className="text-sm text-gray-500">{item.alamat || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.ketua || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.jumlah_anggota || '-'} orang</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Tambah'} Majelis</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Nama Majelis</label>
                                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Nama Ketua</label>
                                <input type="text" value={formData.ketua} onChange={(e) => setFormData({...formData, ketua: e.target.value})} className="form-input-premium" />
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="form-input-premium" rows="2" />
                            </div>
                            <div>
                                <label className="form-label">Jumlah Anggota</label>
                                <input type="number" value={formData.jumlah_anggota} onChange={(e) => setFormData({...formData, jumlah_anggota: e.target.value})} className="form-input-premium" />
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
