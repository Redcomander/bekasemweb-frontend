import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import {
    TicketIcon,
    UserIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    QrCodeIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const services = [
    { id: 'pendaftaran_nikah', label: 'Pendaftaran Nikah/Rujuk' },
    { id: 'konsultasi', label: 'Konsultasi Keluarga Sakinah' },
    { id: 'legalisir', label: 'Legalisir Dokumen' },
    { id: 'bimwin', label: 'Bimbingan Perkawinan (Bimwin)' },
    { id: 'lainnya', label: 'Layanan Lainnya' },
];

export default function LayananAntrian() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Auto-fill date for display
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/antrian/ambil', {
                ...data,
                tanggal: new Date().toISOString().split('T')[0] // Send today's date YYYY-MM-DD
            });
            setTicket(response.data.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal mengambil antrian. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-kemenag-green relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-white mb-2">Ambil Antrian Online</h1>
                    <p className="text-white/80">Dapatkan nomor antrian layanan KUA tanpa perlu menunggu lama di lokasi.</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-50 rounded-t-3xl transform translate-y-2"></div>
            </div>

            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">

                {!ticket ? (
                    /* Antrian Form */
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <div className="bg-green-50 p-2 rounded-lg">
                                <TicketIcon className="w-6 h-6 text-kemenag-green" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Formulir Antrian</h2>
                                <p className="text-xs text-gray-500">{today}</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="form-label">Pilih Layanan</label>
                                <select
                                    {...register('layanan', { required: 'Pilih layanan terlebih dahulu' })}
                                    className={`form-input-premium ${errors.layanan ? '!border-red-500' : ''}`}
                                >
                                    <option value="">-- Pilih Layanan --</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                                {errors.layanan && <p className="text-red-500 text-xs mt-1">{errors.layanan.message}</p>}
                            </div>

                            <div>
                                <label className="form-label">Nama Lengkap</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        {...register('nama_pengunjung', { required: 'Nama wajib diisi' })}
                                        className={`form-input-premium pl-10 ${errors.nama_pengunjung ? '!border-red-500' : ''}`}
                                        placeholder="Sesuai KTP"
                                    />
                                </div>
                                {errors.nama_pengunjung && <p className="text-red-500 text-xs mt-1">{errors.nama_pengunjung.message}</p>}
                            </div>

                            <div>
                                <label className="form-label">No. WhatsApp <span className="font-normal text-gray-400">(Opsional)</span></label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        {...register('no_hp')}
                                        className="form-input-premium pl-10"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Keperluan Khusus <span className="font-normal text-gray-400">(Opsional)</span></label>
                                <textarea
                                    {...register('keperluan')}
                                    className="form-input-premium"
                                    rows="2"
                                    placeholder="Contoh: Konsultasi masalah waris, dll"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3 flex justify-center items-center gap-2 mt-4"
                            >
                                {loading ? 'Memproses...' : 'Ambil Nomor Antrian'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Ticket Display */
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-kemenag-gold p-0 overflow-hidden animate-scale-in relative">
                        {/* Ticket Header */}
                        <div className="bg-kemenag-green text-white p-6 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold">KUA KECAMATAN SEMBAWA</h3>
                                <p className="text-xs opacity-80">Tiket Antrian Digital</p>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-8 text-center bg-pattern bg-opacity-5">
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">Nomor Antrian</p>
                            <div className="text-6xl font-black text-gray-900 mb-2 tracking-tighter">
                                {ticket.kode_antrian || 'A-XXX'}
                            </div>
                            <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-6">
                                {services.find(s => s.id === ticket.layanan)?.label || ticket.layanan}
                            </div>

                            <div className="border-t border-dashed border-gray-300 py-4 mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Nama</span>
                                    <span className="font-semibold text-gray-900">{ticket.nama_pengunjung}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal</span>
                                    <span className="font-semibold text-gray-900">{ticket.tanggal}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center gap-4 mb-6">
                                <QrCodeIcon className="w-12 h-12 text-gray-800" />
                                <div className="text-left text-xs text-gray-500">
                                    <p>Tunjukkan tiket ini kepada</p>
                                    <p>petugas saat dipanggil.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="btn-secondary w-full justify-center flex items-center gap-2"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Simpan / Cetak Tiket
                            </button>

                            <button
                                onClick={() => setTicket(null)}
                                className="mt-4 text-xs text-blue-600 hover:underline"
                            >
                                Ambil antrian lain
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
