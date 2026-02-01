import { Link } from 'react-router-dom';
import {
    UserGroupIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    ScaleIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

export default function Layanan() {
    const services = [
        {
            title: 'Pendaftaran Nikah',
            desc: 'Layanan pendaftaran pencatatan nikah secara online. Cek syarat, prosedur, dan status berkas Anda disini.',
            icon: <UserGroupIcon className="w-8 h-8" />,
            link: '/layanan/nikah',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Rekomendasi Nikah',
            desc: 'Pengurusan surat rekomendasi nikah untuk calon pengantin yang akan menikah di luar kecamatan domisili.',
            icon: <DocumentTextIcon className="w-8 h-8" />,
            link: '/layanan/rekomendasi',
            color: 'bg-indigo-50 text-indigo-600'
        },
        {
            title: 'Bimbingan Perkawinan (BIMWIN)',
            desc: 'Kursus pra-nikah untuk membekali calon pengantin dengan pengetahuan agama dan ketahanan keluarga.',
            icon: <AcademicCapIcon className="w-8 h-8" />,
            link: '/layanan/bimwin',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            title: 'Konsultasi Keluarga',
            desc: 'Layanan konsultasi keluarga sakinah (BP4) untuk membantu menyelesaikan masalah rumah tangga.',
            icon: <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />,
            link: '/layanan/konsultasi',
            color: 'bg-pink-50 text-pink-600'
        },
        {
            title: 'Wakaf & Kemasjidan',
            desc: 'Pelayanan administrasi ikrar wakaf, pendaftaran masjid/musholla, dan pengukuran arah kiblat.',
            icon: <BuildingLibraryIcon className="w-8 h-8" />,
            link: '/layanan/wakaf',
            color: 'bg-green-50 text-green-600'
        },
        {
            title: 'Legalisir Dokumen',
            desc: 'Legalisir buku nikah dan dokumen keagamaan lainnya yang diterbitkan oleh KUA.',
            icon: <ScaleIcon className="w-8 h-8" />,
            link: '/layanan/legalisir',
            color: 'bg-yellow-50 text-yellow-600'
        }
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-teal-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Layanan KUA Sembawa</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Kami menyediakan berbagai jenis layanan keagamaan untuk memenuhi kebutuhan masyarakat dengan standar pelayanan prima.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <Link
                                key={idx}
                                to={service.link}
                                className="premium-card p-8 group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-kemenag-green transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                    {service.desc}
                                </p>
                                <div className="text-kemenag-green font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Persyaratan & Prosedur
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-16 bg-kemenag-green-dark text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Tidak menemukan layanan yang Anda cari?</h2>
                        <p className="text-white/80">Silakan hubungi kami untuk informasi lebih lanjut atau konsultasi langsung.</p>
                    </div>
                    <Link to="/kontak" className="btn-gold whitespace-nowrap">
                        Hubungi Petugas
                    </Link>
                </div>
            </section>
        </div>
    );
}
