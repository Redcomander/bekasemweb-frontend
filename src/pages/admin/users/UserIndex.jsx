import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function UserIndex() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', role: 'staff' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data || []);
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
            const payload = { ...formData };
            if (!payload.password) delete payload.password;
            
            if (editingItem) {
                await api.put(`/admin/users/${editingItem.id}`, payload);
            } else {
                await api.post('/admin/users', payload);
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
        if (!confirm('Yakin ingin menghapus user ini?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item ? { name: item.name, username: item.username, email: item.email, password: '', role: item.roles?.[0] || 'staff' } : { name: '', username: '', email: '', password: '', role: 'staff' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const getRoleBadge = (roles) => {
        const role = roles?.[0] || 'staff';
        const colors = {
            'Super Admin': 'bg-purple-100 text-purple-700',
            'Admin KUA': 'bg-blue-100 text-blue-700',
            'Penghulu': 'bg-green-100 text-green-700',
            'Penyuluh': 'bg-yellow-100 text-yellow-700',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
    };

    const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="text-gray-500 text-sm">Kelola user dan role akses</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Tambah User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari user..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green outline-none" />
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-kemenag-green rounded-full flex items-center justify-center text-white font-bold">
                                                    {item.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{item.username}</td>
                                        <td className="px-6 py-4">{getRoleBadge(item.roles)}</td>
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
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Tambah'} User</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Nama Lengkap</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Username</label>
                                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Password {editingItem && '(kosongkan jika tidak diubah)'}</label>
                                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="form-input-premium" {...(!editingItem && { required: true })} />
                            </div>
                            <div>
                                <label className="form-label">Role</label>
                                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="form-input-premium">
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Admin KUA">Admin KUA</option>
                                    <option value="Penghulu">Penghulu</option>
                                    <option value="Penyuluh">Penyuluh</option>
                                </select>
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
