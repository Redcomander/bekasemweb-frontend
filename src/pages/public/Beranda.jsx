import { Link } from 'react-router-dom';
import {
    CalendarDaysIcon,
    BuildingLibraryIcon,
    NewspaperIcon,
    PhotoIcon,
    UserGroupIcon,
    ArrowRightIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

/**
 * Beranda (Homepage) - Premium Redesign
 */
export default function Beranda() {
    return (
        <div className="overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Mosque Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-kemenag-green-dark/95 via-kemenag-green/90 to-kemenag-green/40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-kemenag-gold"></span>
                            <span>Kantor Urusan Agama Kec. Sembawa</span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Pelayanan Keagamaan <br />
                            <span className="text-kemenag-gold">Profesional & Terpercaya</span>
                        </h1>

                        <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed">
                            Mewujudkan masyarakat Sembawa yang taat beragama, rukun, cerdas, dan sejahtera melalui layanan yang transparan dan akuntabel.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/layanan" className="btn-gold text-center">
                                Layanan Kami
                            </Link>
                            <Link to="/kontak" className="px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-kemenag-green transition-colors text-center">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Curve/Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L1440 120L1440 60C1440 60 1120 120 720 60C320 0 0 60 0 60L0 120Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-kemenag-gold font-bold tracking-wider text-sm uppercase">Layanan Unggulan</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-6">Kemudahan Akses Layanan Keagamaan</h2>
                        <p className="text-gray-600">
                            Nikmati kemudahan mengakses berbagai layanan KUA Sembawa secara digital. Cepat, transparan, dan akuntabel.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Pendaftaran Nikah',
                                desc: 'Daftar nikah online, cek syarat, dan pantau status berkas.',
                                icon: <UserGroupIcon className="w-8 h-8" />,
                                href: '/layanan/nikah',
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                title: 'Jadwal Nikah',
                                desc: 'Cek ketersediaan jadwal akad nikah dan penghulu.',
                                icon: <CalendarDaysIcon className="w-8 h-8" />,
                                href: '/jadwal-nikah',
                                color: 'bg-purple-50 text-purple-600'
                            },
                            {
                                title: 'Data Masjid',
                                desc: 'Direktori masjid, musholla, serta data imam dan khotib.',
                                icon: <BuildingLibraryIcon className="w-8 h-8" />,
                                href: '/masjid',
                                color: 'bg-green-50 text-green-600'
                            },
                        ].map((service, idx) => (
                            <Link key={idx} to={service.href} className="premium-card p-8 group hover:!bg-kemenag-green hover:!border-kemenag-green transition-all duration-300">
                                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-white">{service.title}</h3>
                                <p className="text-gray-600 mb-6 group-hover:text-white/80">{service.desc}</p>
                                <div className="flex items-center text-kemenag-green font-semibold group-hover:text-kemenag-gold group-hover:translate-x-2 transition-all">
                                    Akses Layanan <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWS SECTION */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-kemenag-green font-bold tracking-wider text-sm uppercase">Berita & Informasi</span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">Kabar Terkini KUA Sembawa</h2>
                        </div>
                        <Link to="/berita" className="hidden sm:flex items-center text-gray-500 hover:text-kemenag-green transition-colors">
                            Lihat Semua Berita <ArrowRightIcon className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Featured News (Large) */}
                        <div className="md:col-span-2 group cursor-pointer">
                            <div className="relative h-[400px] rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop"
                                    alt="Featured News"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="px-3 py-1 bg-kemenag-gold text-xs font-bold text-white rounded-full mb-3 inline-block">KEGIATAN</span>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-kemenag-gold transition-colors">
                                        Sosialisasi Bimbingan Perkawinan Pranikah Bagi Calon Pengantin Angkatan I 2026
                                    </h3>
                                    <p className="text-white/80 line-clamp-2">
                                        KUA Sembawa menggelar bimbingan perkawinan untuk membekali calon pengantin dengan pengetahuan agama dan psikologi keluarga.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent News List */}
                        <div className="space-y-6">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex gap-4 group cursor-pointer">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={`https://images.unsplash.com/photo-15${item}54121211835-e88c852648ab?q=80&w=200&auto=format&fit=crop`}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">12 Jan 2026</div>
                                        <h4 className="font-bold text-gray-900 leading-tight group-hover:text-kemenag-green transition-colors">
                                            Jadwal Sholat Idul Fitri 1447H di Masjid Besar Al-Ikhlas
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-kemenag-green-dark">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Siap Melayani Kebutuhan Anda</h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan seputar layanan pernikahan, haji, wakaf, dan kemasjidan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/layanan/antrian" className="btn-gold text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Ambil Antrian Online
                        </Link>
                        <Link to="/faq" className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white hover:text-kemenag-green transition-all backdrop-blur-sm">
                            Pertanyaan Umum (FAQ)
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
