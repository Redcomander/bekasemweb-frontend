import { BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function MajelisTaklim() {
    return (
        <div>
            {/* Header */}
            <section className="bg-cyan-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <h1 className="text-4xl font-bold mb-4">Majelis Taklim</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Jadwal pengajian dan kegiatan majelis taklim di wilayah Kecamatan Sembawa.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    <BookOpenIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Sedang Dalam Pengembangan</h2>
                    <p>Konten Majelis Taklim akan segera tersedia.</p>
                </div>
            </section>
        </div>
    );
}
