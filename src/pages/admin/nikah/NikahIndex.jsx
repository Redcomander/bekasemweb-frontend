import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, DocumentIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function NikahIndex() {
    const [pendaftaran, setPendaftaran] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => { fetchData(); }, []);

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

    const updateStatus = async (id, status, catatan = '') => {
        try {
            await api.put(`/admin/pendaftaran-nikah/${id}/status`, { status, catatan });
            fetchData();
            setSelectedItem(null);
        } catch (error) {
            alert(error.message);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            diajukan: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon, label: 'Menunggu' },
            disetujui: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon, label: 'Disetujui' },
            revisi: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircleIcon, label: 'Revisi' },
        };
        const s = styles[status] || styles.diajukan;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${s.bg} ${s.text}`}>
                <s.icon className="w-3.5 h-3.5" /> {s.label}
            </span>
        );
    };

    const filtered = pendaftaran.filter(p => filter === 'all' || p.status === filter);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Nikah</h1>
                <p className="text-gray-500 text-sm">Verifikasi dan kelola pendaftaran nikah</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {['all', 'diajukan', 'disetujui', 'revisi'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-kemenag-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Memuat data...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Tidak ada data</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calon Pengantin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Nikah</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-sm">{item.kode_pendaftaran}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium">{item.nama_pria}</div>
                                            <div className="text-sm text-gray-500">&amp; {item.nama_wanita}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{item.tanggal_nikah}</td>
                                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedItem(item)} className="text-blue-600 hover:text-blue-800">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Detail Pendaftaran</h2>
                            {getStatusBadge(selectedItem.status)}
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Kode:</span> <span className="font-mono">{selectedItem.kode_pendaftaran}</span></div>
                                <div><span className="text-gray-500">Tanggal Nikah:</span> {selectedItem.tanggal_nikah}</div>
                                <div><span className="text-gray-500">Calon Suami:</span> {selectedItem.nama_pria}</div>
                                <div><span className="text-gray-500">Calon Istri:</span> {selectedItem.nama_wanita}</div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                                <button onClick={() => updateStatus(selectedItem.id, 'disetujui')} className="btn-primary flex-1">Setujui</button>
                                <button onClick={() => updateStatus(selectedItem.id, 'revisi')} className="btn-secondary flex-1 !text-red-600 !border-red-200">Minta Revisi</button>
                                <button onClick={() => setSelectedItem(null)} className="btn-secondary">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
