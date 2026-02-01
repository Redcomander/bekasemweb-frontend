import { useState, useEffect } from 'react';
import { MegaphoneIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

export default function AntrianIndex() {
    const [antrian, setAntrian] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/antrian');
            setAntrian(response.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const callNext = async (id) => {
        try {
            await api.put(`/admin/antrian/${id}/call`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const completeQueue = async (id) => {
        try {
            await api.put(`/admin/antrian/${id}/complete`);
            fetchData();
        } catch (error) {
            alert(error.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = { waiting: 'bg-yellow-100 text-yellow-700', called: 'bg-blue-100 text-blue-700', serving: 'bg-green-100 text-green-700', completed: 'bg-gray-100 text-gray-500' };
        return colors[status] || colors.waiting;
    };

    const waiting = antrian.filter(a => a.status === 'waiting');
    const serving = antrian.filter(a => a.status === 'serving' || a.status === 'called');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Antrian</h1>
                    <p className="text-gray-500 text-sm">Kelola antrian layanan harian</p>
                </div>
                <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
                    <ArrowPathIcon className="w-5 h-5" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Currently Serving */}
                <div className="bg-gradient-to-br from-kemenag-green to-kemenag-green-dark rounded-2xl p-6 text-white">
                    <h2 className="text-lg font-bold mb-4 opacity-90">Sedang Dilayani</h2>
                    {serving.length === 0 ? (
                        <p className="text-white/70">Tidak ada antrian aktif</p>
                    ) : (
                        <div className="space-y-3">
                            {serving.map(item => (
                                <div key={item.id} className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-black">{item.kode_antrian}</div>
                                        <div className="text-sm opacity-80">{item.nama_pengunjung}</div>
                                    </div>
                                    <button onClick={() => completeQueue(item.id)} className="p-3 bg-white/20 rounded-full hover:bg-white/30">
                                        <CheckIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Waiting List */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Antrian Menunggu ({waiting.length})</h2>
                    {loading ? (
                        <p className="text-gray-500">Memuat...</p>
                    ) : waiting.length === 0 ? (
                        <p className="text-gray-500">Tidak ada antrian menunggu</p>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {waiting.map((item, idx) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-kemenag-gold/20 text-kemenag-gold flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.kode_antrian}</div>
                                            <div className="text-sm text-gray-500">{item.nama_pengunjung}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => callNext(item.id)} className="p-2 text-kemenag-green hover:bg-kemenag-green/10 rounded-lg">
                                        <MegaphoneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
