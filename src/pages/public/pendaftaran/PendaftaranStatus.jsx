import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    DocumentIcon
} from '@heroicons/react/24/outline';

const documentTypes = [
    { id: 'ktp_pria', label: 'KTP Calon Suami', group: 'Suami', required: true },
    { id: 'kk_pria', label: 'KK Calon Suami', group: 'Suami', required: true },
    { id: 'akta_lahir_pria', label: 'Akta Lahir Calon Suami', group: 'Suami', required: true },
    { id: 'foto_pria', label: 'Pas Foto Calon Suami (2x3 & 4x6)', group: 'Suami', required: true },
    { id: 'ktp_wanita', label: 'KTP Calon Istri', group: 'Istri', required: true },
    { id: 'kk_wanita', label: 'KK Calon Istri', group: 'Istri', required: true },
    { id: 'akta_lahir_wanita', label: 'Akta Lahir Calon Istri', group: 'Istri', required: true },
    { id: 'foto_wanita', label: 'Pas Foto Calon Istri (2x3 & 4x6)', group: 'Istri', required: true },
    { id: 'surat_n1', label: 'Surat N1 (Pengantar Kelurahan)', group: 'Administrasi', required: true },
    { id: 'surat_n2', label: 'Surat N2 (Permohonan Kehendak)', group: 'Administrasi', required: true },
    { id: 'surat_n4', label: 'Surat N4 (Persetujuan Mempelai)', group: 'Administrasi', required: true },
    { id: 'ijazah_pria', label: 'Ijazah Terakhir Suami', group: 'Tambahan', required: false },
    { id: 'ijazah_wanita', label: 'Ijazah Terakhir Istri', group: 'Tambahan', required: false },
    { id: 'akta_cerai', label: 'Akta Cerai (Jika Janda/Duda)', group: 'Tambahan', required: false },
    { id: 'surat_kematian', label: 'Surat Kematian (Jika Cerai Mati)', group: 'Tambahan', required: false },
    { id: 'surat_izin_orang_tua', label: 'Surat Izin Orang Tua (Jika < 21 Th)', group: 'Tambahan', required: false },
];

export default function PendaftaranStatus() {
    const location = useLocation();
    const [searchCode, setSearchCode] = useState(location.state?.kode || '');
    const [pendaftaran, setPendaftaran] = useState(null);
    const [dokumens, setDokumens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(null);

    // Auto search if code provided via state
    useEffect(() => {
        if (location.state?.kode) {
            handleSearch(null, location.state.kode);
        }
    }, [location.state]);

    const handleSearch = async (e, codeOverride = null) => {
        if (e) e.preventDefault();
        const code = codeOverride || searchCode;
        if (!code) return;

        setLoading(true);
        setError(null);
        setPendaftaran(null);

        try {
            const response = await api.get(`/pendaftaran-nikah/status/${code}`);
            setPendaftaran(response.data.data.pendaftaran);
            setDokumens(response.data.data.dokumens);
        } catch (err) {
            setError(err.response?.data?.message || 'Kode pendaftaran tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (docTypeId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('jenis', docTypeId);
        formData.append('file', file);

        setUploading(docTypeId);
        try {
            await api.post(`/pendaftaran-nikah/upload/${pendaftaran.kode_pendaftaran}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh data
            const response = await api.get(`/pendaftaran-nikah/status/${pendaftaran.kode_pendaftaran}`);
            setDokumens(response.data.data.dokumens);
            alert('Upload berhasil!');
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal upload file');
        } finally {
            setUploading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'disetujui': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Disetujui</span>;
            case 'revisi': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Perlu Revisi</span>;
            case 'diajukan': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Menunggu Verifikasi</span>;
            default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{status}</span>;
        }
    };

    const getDocStatus = (docTypeId) => {
        const doc = dokumens.find(d => d.jenis === docTypeId);
        if (doc) {
            if (doc.status === 'valid') return { color: 'text-green-600', icon: CheckCircleIcon, label: 'Valid' };
            if (doc.status === 'invalid') return { color: 'text-red-600', icon: XCircleIcon, label: 'Ditolak/Revisi' };
            return { color: 'text-yellow-600', icon: ClockIcon, label: 'Menunggu Cek' };
        }
        return { color: 'text-gray-400', icon: DocumentIcon, label: 'Belum Upload' };
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Dark Hero */}
            <div className="bg-kemenag-green relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-white mb-2">Cek Status & Upload Dokumen</h1>
                    <p className="text-white/80">Pantau progres pendaftaran dan lengkapi berkas pernikahan Anda.</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-50 rounded-t-3xl transform translate-y-2"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="form-label">Kode Pendaftaran</label>
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                className="form-input-premium font-mono uppercase tracking-widest text-lg"
                                placeholder="CONTOH: NIKAH-xxxxx"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 mb-[2px]">
                            {loading ? 'Mencari...' : <><MagnifyingGlassIcon className="w-5 h-5" /> Cek Status</>}
                        </button>
                    </form>
                    {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
                </div>

                {/* Result Section */}
                {pendaftaran && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Status Overview */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{pendaftaran.nama_pria} & {pendaftaran.nama_wanita}</h2>
                                    <p className="text-gray-500">Tanggal Akad: {new Date(pendaftaran.tanggal_nikah).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                {getStatusBadge(pendaftaran.status)}
                            </div>
                            {pendaftaran.catatan_admin && (
                                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm border border-yellow-100">
                                    <strong>Catatan KUA:</strong> {pendaftaran.catatan_admin}
                                </div>
                            )}
                        </div>

                        {/* Document List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <DocumentIcon className="w-6 h-6 text-kemenag-green" />
                                Kelengkapan Dokumen
                            </h3>

                            <div className="space-y-6">
                                {Object.entries(documentTypes.reduce((acc, doc) => {
                                    (acc[doc.group] = acc[doc.group] || []).push(doc);
                                    return acc;
                                }, {})).map(([group, docs]) => (
                                    <div key={group}>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 pl-2 border-l-4 border-kemenag-gold">{group}</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {docs.map(doc => {
                                                const status = getDocStatus(doc.id);
                                                const uploadedDoc = dokumens.find(d => d.jenis === doc.id);
                                                return (
                                                    <div key={doc.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 text-sm">{doc.label}</p>
                                                                {doc.required && <span className="text-xs text-red-500">*Wajib</span>}
                                                            </div>
                                                            <status.icon className={`w-5 h-5 ${status.color}`} />
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className={`text-xs font-medium ${status.color}`}>
                                                                {status.label}
                                                            </span>

                                                            <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${uploading === doc.id ? 'bg-gray-200 text-gray-500' : 'bg-white border border-gray-200 text-gray-700 hover:bg-kemenag-green hover:text-white hover:border-kemenag-green'
                                                                }`}>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                                    onChange={(e) => handleUpload(doc.id, e.target.files[0])}
                                                                    disabled={uploading === doc.id}
                                                                />
                                                                {uploading === doc.id ? 'Mengupload...' : <><ArrowUpTrayIcon className="w-3 h-3" /> Upload</>}
                                                            </label>
                                                        </div>
                                                        {uploadedDoc?.catatan && (
                                                            <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                                Revisi: {uploadedDoc.catatan}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
