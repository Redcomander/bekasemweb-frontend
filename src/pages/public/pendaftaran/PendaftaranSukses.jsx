import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PendaftaranSukses() {
    const location = useLocation();
    const result = location.state?.result;

    console.log('PendaftaranSukses Location:', location);
    console.log('PendaftaranSukses Result:', result);

    // Flexible data extraction (handle wrapper or direct object)
    const data = result?.data || result;
    const kode = data?.kode_pendaftaran;

    // Fallback if accessed directly or invalid data
    if (!kode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in-up">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <DocumentTextIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Tidak Ditemukan</h1>
                    <p className="text-gray-600 mb-6 mt-2">
                        Halaman ini hanya dapat diakses setelah melakukan pendaftaran.
                        Pastikan Anda telah mengisi formulir dengan benar.
                    </p>
                    <Link to="/layanan/nikah" className="btn-primary w-full block">Kembali ke Formulir</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
            <div className="max-w-xl w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-scale-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h1>
                    <p className="text-gray-600 mb-8">
                        {data?.message || 'Data pendaftaran pernikahan Anda telah berhasil dikirim ke KUA Sembawa.'}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Kode Pendaftaran</p>
                        <div className="text-4xl font-mono font-bold text-kemenag-green tracking-wider">
                            {kode}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Simpan kode ini untuk mengecek status berkas.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm text-left">
                            <strong>Langkah Selanjutnya:</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Upload dokumen persyaratan (KTP, KK, N1, dll).</li>
                                <li>Tunggu verifikasi dari petugas KUA.</li>
                                <li>Datang ke KUA untuk pemeriksaan berkas fisik.</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/" className="btn-secondary w-full flex items-center justify-center text-center">
                                Beranda
                            </Link>
                            <Link
                                to="/layanan/nikah/cek"
                                state={{ kode: result?.data?.kode_pendaftaran }}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                Upload Dokumen
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
