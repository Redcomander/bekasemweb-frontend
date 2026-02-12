import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';
import ConfirmModal from '../../../components/ConfirmModal';

export default function ImamIndex() {
    const [imams, setImams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ nama: '', no_hp: '', alamat: '', is_active: true });
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/imam');
            setImams(response.data?.data || []);
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
                await api.put(`/admin/imam/${editingItem.id}`, formData);
            } else {
                await api.post('/admin/imam', formData);
            }
            fetchData();
            closeModal();
        } catch (error) {
            alert(error.message || 'Gagal menyimpan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/imam/${deleteConfirm.id}`);
            fetchData();
            setDeleteConfirm({ open: false, id: null });
        } catch (error) {
            alert(error.message);
        } finally {
            setDeleting(false);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { nama: item.nama, no_hp: item.no_hp || '', alamat: item.alamat || '', is_active: item.is_active } : { nama: '', no_hp: '', alamat: '', is_active: true });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const filtered = imams.filter(i => i.nama?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Imam</h1>
                    <p className="text-gray-500 text-sm">Kelola data imam masjid</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Tambah Imam
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative w-full md:max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari imam..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green outline-none" />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">Memuat data...</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">Belum ada data imam</div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {filtered.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-kemenag-green rounded-full flex items-center justify-center text-white">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.nama}</div>
                                            <div className="text-xs text-gray-500">{item.no_hp || '-'}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                                    <button onClick={() => openModal(item)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                                        <PencilSquareIcon className="w-4 h-4" /> Edit
                                    </button>
                                    <button onClick={() => setDeleteConfirm({ open: true, id: item.id })} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg">
                                        <TrashIcon className="w-4 h-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. HP</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-kemenag-green rounded-full flex items-center justify-center text-white">
                                                    <UserIcon className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-900">{item.nama}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.no_hp || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.alamat || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setDeleteConfirm({ open: true, id: item.id })} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Tambah'} Imam</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Nama Lengkap</label>
                                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">No. HP</label>
                                <input type="text" value={formData.no_hp} onChange={(e) => setFormData({...formData, no_hp: e.target.value})} className="form-input-premium" />
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="form-input-premium" rows="2" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-kemenag-green" />
                                <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                                <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                onConfirm={handleDelete}
                loading={deleting}
                title="Hapus Imam"
                message="Apakah Anda yakin ingin menghapus data imam ini?"
                confirmText="Hapus"
                type="danger"
            />
        </div>
    );
}
