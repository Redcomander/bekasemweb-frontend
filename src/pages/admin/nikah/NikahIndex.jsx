import { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentIcon,
    EyeIcon,
    CalendarDaysIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
    FunnelIcon,
    UserGroupIcon
} from '@heroicons/react/24/solid';
import api from '../../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

export default function NikahIndex() {
    const [pendaftaran, setPendaftaran] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [penghulus, setPenghulus] = useState([]);
    const [showJadwalModal, setShowJadwalModal] = useState(false);
    const [jadwalForm, setJadwalForm] = useState({ tanggal: '', jam_mulai: '', lokasi: '' });
    const [statusNote, setStatusNote] = useState('');
    const [activeTab, setActiveTab] = useState('info'); // info, dokumen, status

    useEffect(() => { fetchData(); fetchPenghulus(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/pendaftaran-nikah');
            setPendaftaran(response.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPenghulus = async () => {
        try {
            const response = await api.get('/admin/pendaftaran-nikah/penghulus');
            setPenghulus(response.data || []);
        } catch (error) {
            console.error('Error fetching penghulus:', error);
        }
    };

    const fetchDetail = async (id) => {
        setLoadingDetail(true);
        try {
            const response = await api.get(`/admin/pendaftaran-nikah/${id}`);
            setDetailData(response.data);
            setActiveTab('info');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const openDetail = (item) => {
        setSelectedItem(item);
        fetchDetail(item.id);
    };

    const updateStatus = async (status) => {
        try {
            await api.put(`/admin/pendaftaran-nikah/${selectedItem.id}/status`, { status, catatan: statusNote });
            fetchData();
            setSelectedItem(null);
            setDetailData(null);
            setStatusNote('');
        } catch (error) {
            alert(error.message);
        }
    };

    const assignPenghulu = async (penghuluId) => {
        try {
            await api.put(`/admin/pendaftaran-nikah/${selectedItem.id}/penghulu`, { penghulu_id: penghuluId });
            fetchDetail(selectedItem.id);
        } catch (error) {
            alert(error.message);
        }
    };

    const createJadwal = async () => {
        try {
            await api.post(`/admin/pendaftaran-nikah/${selectedItem.id}/jadwal`, jadwalForm);
            fetchDetail(selectedItem.id);
            setShowJadwalModal(false);
            setJadwalForm({ tanggal: '', jam_mulai: '', lokasi: '' });
        } catch (error) {
            alert(error.message);
        }
    };

    const updateDokumenStatus = async (dokumenId, status) => {
        try {
            await api.put(`/admin/pendaftaran-nikah/${selectedItem.id}/dokumen/${dokumenId}`, { status });
            fetchDetail(selectedItem.id);
        } catch (error) {
            alert(error.message);
        }
    };

    // Stats calculation
    const stats = {
        total: pendaftaran.length,
        pending: pendaftaran.filter(p => p.status === 'diajukan').length,
        verifying: pendaftaran.filter(p => p.status === 'verifikasi').length,
        approved: pendaftaran.filter(p => p.status === 'disetujui').length,
    };

    const getStatusBadge = (status, size = 'md') => {
        const styles = {
            diajukan: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon, label: 'Menunggu' },
            verifikasi: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ArrowPathIcon, label: 'Verifikasi' },
            disetujui: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Disetujui' },
            revisi: { bg: 'bg-orange-100', text: 'text-orange-700', icon: ExclamationCircleIcon, label: 'Revisi' },
            ditolak: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircleIcon, label: 'Ditolak' },
            selesai: { bg: 'bg-gray-100', text: 'text-gray-700', icon: DocumentCheckIcon, label: 'Selesai' },
        };
        const s = styles[status] || styles.diajukan;
        const dims = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
        const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
        
        return (
            <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${s.bg} ${s.text} ${dims}`}>
                <s.icon className={iconSize} /> {s.label}
            </span>
        );
    };

    const getDokumenStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'Pending', icon: ClockIcon },
            verified: { bg: 'bg-green-50', text: 'text-green-600', label: 'Valid', icon: CheckCircleIcon }, // Keeping legacy key for safety if some use it
            valid: { bg: 'bg-green-50', text: 'text-green-600', label: 'Valid', icon: CheckCircleIcon },
            rejected: { bg: 'bg-red-50', text: 'text-red-600', label: 'Invalid', icon: XCircleIcon }, // Legacy
            invalid: { bg: 'bg-red-50', text: 'text-red-600', label: 'Invalid', icon: XCircleIcon },
        };
        const s = styles[status] || styles.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${s.bg} ${s.text}`}>
                <s.icon className="w-3 h-3" /> {s.label}
            </span>
        );
    };

    const filtered = pendaftaran.filter(p => {
        const matchStatus = filter === 'all' || p.status === filter;
        const matchSearch = !search || 
            p.kode_pendaftaran?.toLowerCase().includes(search.toLowerCase()) ||
            p.nama_pria?.toLowerCase().includes(search.toLowerCase()) ||
            p.nama_wanita?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const InitialsAvatar = ({ name, color }) => (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${color}`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            {/* Header & Stats */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Nikah</h1>
                    <p className="text-gray-500">Kelola pengajuan, verifikasi dokumen, dan jadwal akad.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Pengajuan', value: stats.total, color: 'bg-purple-50 text-purple-700', icon: UserGroupIcon },
                        { label: 'Perlu Verifikasi', value: stats.verifying, color: 'bg-blue-50 text-blue-700', icon: ArrowPathIcon },
                        { label: 'Disetujui', value: stats.approved, color: 'bg-green-50 text-green-700', icon: CheckCircleIcon },
                        { label: 'Baru Masuk', value: stats.pending, color: 'bg-yellow-50 text-yellow-700', icon: ClockIcon },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="text-gray-500 text-sm font-medium mb-1">{stat.label}</div>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="flex bg-gray-200/50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                        {['all', 'diajukan', 'verifikasi', 'disetujui', 'selesai'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)} 
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative w-full sm:w-64">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama / kode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-kemenag-green focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Memuat data pendaftaran...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                        <DocumentIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p>Tidak ada data pendaftaran yang ditemukan</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">Pasangan</th>
                                    <th className="px-6 py-4 text-left">Jadwal Nikah</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Penghulu</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    <InitialsAvatar name={item.nama_pria || '?'} color="bg-blue-500 ring-2 ring-white" />
                                                    <InitialsAvatar name={item.nama_wanita || '?'} color="bg-pink-500 ring-2 ring-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{item.nama_pria} & {item.nama_wanita}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">{item.kode_pendaftaran}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                                {item.tanggal_nikah ? new Date(item.tanggal_nikah).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status, 'sm')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.penghulu ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {item.penghulu.name.charAt(0)}
                                                    </div>
                                                    <span className="text-gray-700">{item.penghulu.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Belum ditunjuk</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => openDetail(item)} 
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
                    <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col md:max-w-5xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detail Pendaftaran</h2>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="font-mono text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">{selectedItem.kode_pendaftaran}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block">
                                    {getStatusBadge(selectedItem.status)}
                                </div>
                                <button onClick={() => { setSelectedItem(null); setDetailData(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {loadingDetail ? (
                            <div className="p-20 text-center text-gray-400">Memuat detail pendaftaran...</div>
                        ) : detailData ? (
                            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                                {/* Sidebar Navigation */}
                                <div className="w-full md:w-64 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-2 sm:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0 scrollbar-hide">
                                    {[
                                        { id: 'info', label: 'Info Pasangan', icon: UserGroupIcon },
                                        { id: 'dokumen', label: 'Dokumen', icon: DocumentIcon },
                                        { id: 'status', label: 'Status & Jadwal', icon: CalendarDaysIcon },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all whitespace-nowrap md:w-full text-left ${
                                                activeTab === tab.id 
                                                ? 'bg-white text-kemenag-green shadow-sm ring-1 ring-gray-200' 
                                                : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                        >
                                            <tab.icon className="w-5 h-5 shrink-0" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                                    {activeTab === 'info' && (
                                        <div className="space-y-8">
                                            {/* Pasangan */}
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><UserIcon className="w-5 h-5"/></div>
                                                        <h3 className="font-bold text-gray-900">Calon Suami</h3>
                                                    </div>
                                                    <div className="space-y-3 text-sm">
                                                        <InfoRow label="Nama" value={detailData.nama_pria} highlight />
                                                        <InfoRow label="NIK" value={detailData.nik_pria} />
                                                        <InfoRow label="TTL" value={`${detailData.tempat_lahir_pria}, ${new Date(detailData.tanggal_lahir_pria).toLocaleDateString()}`} />
                                                        <InfoRow label="Alamat" value={detailData.alamat_pria} />
                                                        <InfoRow label="Pekerjaan" value={detailData.pekerjaan_pria} />
                                                        <InfoRow label="Status" value={detailData.status_pria} badge />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                                        <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><UserIcon className="w-5 h-5"/></div>
                                                        <h3 className="font-bold text-gray-900">Calon Istri</h3>
                                                    </div>
                                                    <div className="space-y-3 text-sm">
                                                        <InfoRow label="Nama" value={detailData.nama_wanita} highlight />
                                                        <InfoRow label="NIK" value={detailData.nik_wanita} />
                                                        <InfoRow label="TTL" value={`${detailData.tempat_lahir_wanita}, ${new Date(detailData.tanggal_lahir_wanita).toLocaleDateString()}`} />
                                                        <InfoRow label="Alamat" value={detailData.alamat_wanita} />
                                                        <InfoRow label="Pekerjaan" value={detailData.pekerjaan_wanita} />
                                                        <InfoRow label="Status" value={detailData.status_wanita} badge />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Wali Info */}
                                            <div className="bg-gray-50 rounded-2xl p-6">
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <UserGroupIcon className="w-5 h-5 text-gray-500" /> Data Wali & Rencana
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-6 text-sm">
                                                    <div className="space-y-2">
                                                        <InfoRow label="Nama Wali" value={detailData.nama_wali} />
                                                        <InfoRow label="Hubungan" value={detailData.hubungan_wali} />
                                                        <InfoRow label="Kontak Wali" value={detailData.no_hp_wali || '-'} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <InfoRow label="Rencana Tanggal" value={new Date(detailData.tanggal_nikah).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})} />
                                                        <InfoRow label="Rencana Lokasi" value={detailData.lokasi_nikah} />
                                                        <InfoRow label="Mahar" value={`Rp ${parseFloat(detailData.mahar || 0).toLocaleString('id-ID')}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'dokumen' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-gray-900">Kelengkapan Dokumen</h3>
                                                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                                    {detailData.dokumens?.filter(d => d.status === 'valid').length}/{detailData.dokumens?.length} Terverifikasi
                                                </span>
                                            </div>
                                            
                                            {detailData.dokumens?.length > 0 ? (
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {detailData.dokumens.map((doc) => (
                                                        <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white group">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                                        <DocumentIcon className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900 text-sm line-clamp-1" title={doc.jenis_label || doc.jenis}>{doc.jenis_label || doc.jenis}</div>
                                                                        <div className="text-xs text-gray-400 mt-0.5">Uploaded: {new Date(doc.created_at).toLocaleDateString()}</div>
                                                                    </div>
                                                                </div>
                                                                {getDokumenStatusBadge(doc.status)}
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-2">
                                                                <a 
                                                                    href={`${BASE_URL}/storage/${doc.file_path}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                                >
                                                                    Preview
                                                                </a>
                                                                {doc.status === 'pending' && (
                                                                    <>
                                                                        <button onClick={() => updateDokumenStatus(doc.id, 'valid')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg bg-green-50/50" title="Verifikasi">
                                                                            <CheckCircleIcon className="w-5 h-5" />
                                                                        </button>
                                                                        <button onClick={() => updateDokumenStatus(doc.id, 'invalid')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg bg-red-50/50" title="Tolak">
                                                                            <XCircleIcon className="w-5 h-5" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                    <DocumentIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500">Belum ada dokumen yang diunggah</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'status' && (
                                        <div className="space-y-8">
                                            {/* Penghulu Assignment */}
                                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <UserIcon className="w-5 h-5 text-gray-500" /> Penunjukan Penghulu
                                                </h3>
                                                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl">
                                                    <select
                                                        value={detailData.penghulu_id || ''}
                                                        onChange={(e) => assignPenghulu(e.target.value)}
                                                        className="w-full sm:w-auto flex-1 border-gray-200 rounded-lg text-sm focus:ring-kemenag-green"
                                                    >
                                                        <option value="">-- Pilih Penghulu --</option>
                                                        {penghulus.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name}</option>
                                                        ))}
                                                    </select>
                                                    {detailData.penghulu_id ? (
                                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                                            <CheckCircleIcon className="w-4 h-4" /> Ditugaskan
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-yellow-600 font-medium flex items-center gap-1">
                                                            <ExclamationCircleIcon className="w-4 h-4" /> Belum ditunjuk
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Jadwal Management */}
                                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                        <CalendarDaysIcon className="w-5 h-5 text-gray-500" /> Jadwal Akad Nikah
                                                    </h3>
                                                    {detailData.jadwal ? (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Terjadwal</span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Belum Ada</span>
                                                    )}
                                                </div>

                                                {detailData.jadwal ? (
                                                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                                        <div className="flex gap-4">
                                                            <div className="bg-white p-3 rounded-lg shadow-sm text-center min-w-[80px]">
                                                                <div className="text-xs text-gray-500 uppercase font-bold">Tgl</div>
                                                                <div className="text-xl font-bold text-green-600">{new Date(detailData.jadwal.tanggal).getDate()}</div>
                                                                <div className="text-xs text-gray-500">{new Date(detailData.jadwal.tanggal).toLocaleDateString(undefined, {month:'short'})}</div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-gray-900">{detailData.jadwal.lokasi}</div>
                                                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                                                    <ClockIcon className="w-4 h-4" /> {detailData.jadwal.jam_mulai} WIB
                                                                </div>
                                                                <div className="text-xs text-green-700 mt-2 bg-white px-2 py-1 rounded inline-block">
                                                                    Penghulu: {detailData.penghulu?.name || '-'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                                                        <p className="text-sm text-gray-500 mb-4">Jadwal belum dibuat. Pastikan pendaftaran disetujui terlebih dahulu.</p>
                                                        {detailData.status === 'disetujui' && (
                                                            <button 
                                                                onClick={() => setShowJadwalModal(true)} 
                                                                className="btn-primary"
                                                            >
                                                                Buat Jadwal Sekarang
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Workflow */}
                                            <div className="bg-gray-900 text-white p-6 rounded-2xl">
                                                <h3 className="font-bold mb-4">Update Status Pendaftaran</h3>
                                                <textarea
                                                    placeholder="Tambahkan catatan untuk pemohon..."
                                                    value={statusNote}
                                                    onChange={(e) => setStatusNote(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-kemenag-gold focus:border-transparent mb-4"
                                                />
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedItem.status === 'diajukan' && (
                                                        <button onClick={() => updateStatus('verifikasi')} className="btn-gold w-full sm:w-auto">Mulai Verifikasi</button>
                                                    )}
                                                    {['diajukan', 'verifikasi', 'revisi'].includes(selectedItem.status) && (
                                                        <>
                                                            <button onClick={() => updateStatus('disetujui')} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors w-full sm:w-auto">Setujui</button>
                                                            <button onClick={() => updateStatus('revisi')} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-colors w-full sm:w-auto">Minta Revisi</button>
                                                            <button onClick={() => updateStatus('ditolak')} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition-colors w-full sm:w-auto">Tolak</button>
                                                        </>
                                                    )}
                                                    {selectedItem.status === 'disetujui' && detailData.jadwal && (
                                                        <button onClick={() => updateStatus('selesai')} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors w-full sm:w-auto">Tandai Selesai</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Jadwal Modal */}
            {showJadwalModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">Buat Jadwal Nikah</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Akad</label>
                                <input type="date" value={jadwalForm.tanggal} onChange={(e) => setJadwalForm({...jadwalForm, tanggal: e.target.value})} className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-kemenag-green" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Mulai</label>
                                <input type="time" value={jadwalForm.jam_mulai} onChange={(e) => setJadwalForm({...jadwalForm, jam_mulai: e.target.value})} className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-kemenag-green" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                                <input type="text" value={jadwalForm.lokasi} onChange={(e) => setJadwalForm({...jadwalForm, lokasi: e.target.value})} placeholder="Contoh: KUA Sembawa" className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-kemenag-green" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button onClick={createJadwal} className="btn-primary flex-1 py-3 text-base">Simpan Jadwal</button>
                                <button onClick={() => setShowJadwalModal(false)} className="btn-secondary flex-1 py-3 text-base">Batal</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Component for Info Rows
function InfoRow({ label, value, highlight = false, badge = false }) {
    return (
        <div className="flex justify-between items-start gap-4">
            <span className="text-gray-500 shrink-0 w-24">{label}</span>
            {badge ? (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium uppercase">{value}</span>
            ) : (
                <span className={`font-medium text-right ${highlight ? 'text-gray-900' : 'text-gray-700'}`}>{value || '-'}</span>
            )}
        </div>
    );
}
