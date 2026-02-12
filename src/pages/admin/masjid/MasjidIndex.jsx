import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, MapPinIcon, UserIcon, MicrophoneIcon, DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';
import ConfirmModal from '../../../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function MasjidIndex() {
    const [masjid, setMasjid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ 
        nama: '', alamat: '', tipe: 'masjid', 
        jadwal_imam: '', jadwal_khotib: ''
    });
    const [files, setFiles] = useState({ jadwal_imam_file: null, jadwal_khotib_file: null });
    const [deleteFiles, setDeleteFiles] = useState({ jadwal_imam_file: false, jadwal_khotib_file: false });
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);

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
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });
            
            // Append files
            if (files.jadwal_imam_file) data.append('jadwal_imam_file', files.jadwal_imam_file);
            if (files.jadwal_khotib_file) data.append('jadwal_khotib_file', files.jadwal_khotib_file);
            
            // Append delete flags
            if (deleteFiles.jadwal_imam_file) data.append('delete_jadwal_imam_file', '1');
            if (deleteFiles.jadwal_khotib_file) data.append('delete_jadwal_khotib_file', '1');

            if (editingItem) {
                data.append('_method', 'PUT');
                await api.post(`/admin/masjid/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/admin/masjid', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchData();
            closeModal();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Gagal menyimpan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/masjid/${deleteConfirm.id}`);
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
        setFormData(item ? { 
            nama: item.nama, 
            alamat: item.alamat || '', 
            tipe: item.tipe || 'masjid',
            jadwal_imam: item.jadwal_imam || '',
            jadwal_khotib: item.jadwal_khotib || ''
        } : { 
            nama: '', alamat: '', tipe: 'masjid',
            jadwal_imam: '', jadwal_khotib: ''
        });
        setFiles({ jadwal_imam_file: null, jadwal_khotib_file: null });
        setDeleteFiles({ jadwal_imam_file: false, jadwal_khotib_file: false });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const getFileUrl = (path) => path ? `${API_URL}/storage/${path}` : null;
    const isImage = (path) => path && /\.(jpg|jpeg|png|webp|gif)$/i.test(path);

    const filtered = masjid.filter(m => m.nama?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Masjid</h1>
                    <p className="text-gray-500 text-sm">Kelola data masjid dan musholla</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                    <PlusIcon className="w-5 h-5" /> Tambah Masjid
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative w-full md:max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari masjid..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-kemenag-green outline-none" />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Memuat data...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">Belum ada data</div>
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.tipe === 'masjid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {item.tipe === 'masjid' ? 'Masjid' : 'Musholla'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800"><PencilSquareIcon className="w-5 h-5" /></button>
                                    <button onClick={() => setDeleteConfirm({ open: true, id: item.id })} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{item.nama}</h3>
                            <p className="text-sm text-gray-500 flex items-start gap-1 mb-3">
                                <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {item.alamat || '-'}
                            </p>

                            {/* Jadwal Imam & Khotib - Only for Masjid */}
                            {item.tipe === 'masjid' && (
                                <div className="pt-3 border-t border-gray-100 space-y-2">
                                    {/* Imam */}
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 text-kemenag-green font-medium mb-1">
                                            <UserIcon className="w-4 h-4" /> Jadwal Imam
                                        </div>
                                        {item.jadwal_imam ? (
                                            <p className="text-gray-600 text-xs whitespace-pre-line">{item.jadwal_imam}</p>
                                        ) : item.jadwal_imam_file ? (
                                            <a href={getFileUrl(item.jadwal_imam_file)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                                {isImage(item.jadwal_imam_file) ? <PhotoIcon className="w-4 h-4" /> : <DocumentIcon className="w-4 h-4" />}
                                                Lihat File
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Belum diatur</span>
                                        )}
                                    </div>
                                    {/* Khotib */}
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 text-amber-600 font-medium mb-1">
                                            <MicrophoneIcon className="w-4 h-4" /> Jadwal Khotib Jum'at
                                        </div>
                                        {item.jadwal_khotib ? (
                                            <p className="text-gray-600 text-xs whitespace-pre-line">{item.jadwal_khotib}</p>
                                        ) : item.jadwal_khotib_file ? (
                                            <a href={getFileUrl(item.jadwal_khotib_file)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                                {isImage(item.jadwal_khotib_file) ? <PhotoIcon className="w-4 h-4" /> : <DocumentIcon className="w-4 h-4" />}
                                                Lihat File
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Belum diatur</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b"><h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Tambah'} Masjid</h2></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="form-label">Nama</label>
                                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="form-input-premium" required />
                            </div>
                            <div>
                                <label className="form-label">Jenis</label>
                                <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} className="form-input-premium">
                                    <option value="masjid">Masjid</option>
                                    <option value="musholla">Musholla</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Alamat</label>
                                <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="form-input-premium" rows="2" />
                            </div>

                            {/* Jadwal Imam & Khotib - Only for Masjid */}
                            {formData.tipe === 'masjid' && (
                                <>
                                    {/* Jadwal Imam */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                        <label className="form-label flex items-center gap-2 text-kemenag-green">
                                            <UserIcon className="w-4 h-4" /> Jadwal Imam
                                        </label>
                                        <textarea 
                                            value={formData.jadwal_imam} 
                                            onChange={(e) => setFormData({...formData, jadwal_imam: e.target.value})} 
                                            className="form-input-premium" 
                                            rows="2" 
                                            placeholder="Ketik nama imam atau jadwal..."
                                        />
                                        <div className="text-xs text-gray-500">Atau upload file poster/PDF:</div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                accept="image/*,.pdf"
                                                onChange={(e) => setFiles({...files, jadwal_imam_file: e.target.files[0]})}
                                                className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-kemenag-green file:text-white file:cursor-pointer"
                                            />
                                            {editingItem?.jadwal_imam_file && !deleteFiles.jadwal_imam_file && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setDeleteFiles({...deleteFiles, jadwal_imam_file: true})}
                                                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                                                >
                                                    <XMarkIcon className="w-4 h-4" /> Hapus file
                                                </button>
                                            )}
                                        </div>
                                        {files.jadwal_imam_file && (
                                            <div className="text-xs text-green-600">File baru: {files.jadwal_imam_file.name}</div>
                                        )}
                                    </div>

                                    {/* Jadwal Khotib */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                        <label className="form-label flex items-center gap-2 text-amber-600">
                                            <MicrophoneIcon className="w-4 h-4" /> Jadwal Khotib Jum'at
                                        </label>
                                        <textarea 
                                            value={formData.jadwal_khotib} 
                                            onChange={(e) => setFormData({...formData, jadwal_khotib: e.target.value})} 
                                            className="form-input-premium" 
                                            rows="2" 
                                            placeholder="Ketik nama khotib atau jadwal..."
                                        />
                                        <div className="text-xs text-gray-500">Atau upload file poster/PDF:</div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                accept="image/*,.pdf"
                                                onChange={(e) => setFiles({...files, jadwal_khotib_file: e.target.files[0]})}
                                                className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer"
                                            />
                                            {editingItem?.jadwal_khotib_file && !deleteFiles.jadwal_khotib_file && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setDeleteFiles({...deleteFiles, jadwal_khotib_file: true})}
                                                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                                                >
                                                    <XMarkIcon className="w-4 h-4" /> Hapus file
                                                </button>
                                            )}
                                        </div>
                                        {files.jadwal_khotib_file && (
                                            <div className="text-xs text-green-600">File baru: {files.jadwal_khotib_file.name}</div>
                                        )}
                                    </div>
                                </>
                            )}

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
                title="Hapus Masjid"
                message="Apakah Anda yakin ingin menghapus data masjid ini?"
                confirmText="Hapus"
                type="danger"
            />
        </div>
    );
}
