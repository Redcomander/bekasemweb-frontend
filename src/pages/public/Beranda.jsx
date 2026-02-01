import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarDaysIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    ArrowRightIcon,
    ClockIcon,
    MapPinIcon,
    HeartIcon
} from '@heroicons/react/24/solid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

/**
 * Beranda (Homepage) - Elegant Redesign
 */
export default function Beranda() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [weddings, setWeddings] = useState([]);
    const [news, setNews] = useState([]);
    const [loadingWeddings, setLoadingWeddings] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Prayer Times
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const today = new Date();
                const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
                const response = await fetch(
                    `https://api.aladhan.com/v1/timings/${dateStr}?latitude=-3.0497&longitude=104.5483&method=20`
                );
                const data = await response.json();
                if (data.code === 200) {
                    setPrayerTimes(data.data.timings);
                }
            } catch (error) {
                console.error('Error fetching prayer times:', error);
            }
        };
        fetchPrayerTimes();
    }, []);

    // Fetch Weddings (Kalender Nikah)
    useEffect(() => {
        const fetchWeddings = async () => {
            try {
                const response = await fetch(`${API_URL}/jadwal-nikah?per_page=6`);
                const data = await response.json();
                if (data.success) {
                    setWeddings(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching weddings:', error);
            } finally {
                setLoadingWeddings(false);
            }
        };
        fetchWeddings();
    }, []);

    // Fetch News (Berita)
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${API_URL}/berita/latest`);
                const data = await response.json();
                if (data.success) {
                    setNews(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoadingNews(false);
            }
        };
        fetchNews();
    }, []);

    // Calculate next prayer
    useEffect(() => {
        if (!prayerTimes) return;
        const prayers = [
            { name: 'Subuh', time: prayerTimes.Fajr },
            { name: 'Dzuhur', time: prayerTimes.Dhuhr },
            { name: 'Ashar', time: prayerTimes.Asr },
            { name: 'Maghrib', time: prayerTimes.Maghrib },
            { name: 'Isya', time: prayerTimes.Isha },
        ];
        const now = currentTime;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        for (const prayer of prayers) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            if (hours * 60 + minutes > nowMinutes) {
                setNextPrayer(prayer);
                return;
            }
        }
        setNextPrayer({ name: 'Subuh', time: prayerTimes.Fajr, tomorrow: true });
    }, [prayerTimes, currentTime]);

    const formatTime = (date) => date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formatDate = (date) => date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const getFileUrl = (path) => path ? `${BASE_URL}/storage/${path}` : 'https://via.placeholder.com/800x600?text=No+Image';

    return (
        <div className="overflow-x-hidden font-sans">
            {/* HERO SECTION */}
            <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-kemenag-gold animate-pulse"></span>
                            <span>Kantor Urusan Agama Kec. Sembawa</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8">
                            Layanan Keagamaan <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kemenag-gold to-amber-300">
                                Profesional & Terpercaya
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Mewujudkan masyarakat Sembawa yang taat beragama, rukun, cerdas, dan sejahtera melalui layanan digital yang transparan.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/layanan" className="btn-gold px-8 py-4 text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all">
                                Layanan Kami
                            </Link>
                            <Link to="/kontak" className="px-8 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRAYER TIMES & LIVE CLOCK */}
            <section className="-mt-20 relative z-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <ClockIcon className="w-8 h-8 text-kemenag-green" />
                                        Jadwal Waktu Sholat
                                    </h2>
                                    <p className="text-gray-500 mt-1">Kecamatan Sembawa, Banyuasin</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold font-mono text-gray-900 tracking-wider">
                                        {formatTime(currentTime)}
                                    </div>
                                    <div className="text-gray-500 font-medium mt-1">
                                        {formatDate(currentTime)}
                                    </div>
                                </div>
                            </div>

                            {prayerTimes ? (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { name: 'Subuh', time: prayerTimes.Fajr },
                                        { name: 'Dzuhur', time: prayerTimes.Dhuhr },
                                        { name: 'Ashar', time: prayerTimes.Asr },
                                        { name: 'Maghrib', time: prayerTimes.Maghrib },
                                        { name: 'Isya', time: prayerTimes.Isha },
                                    ].map((prayer) => (
                                        <div
                                            key={prayer.name}
                                            className={`rounded-2xl p-5 text-center transition-all ${
                                                nextPrayer?.name === prayer.name
                                                    ? 'bg-kemenag-green text-white shadow-lg scale-105'
                                                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">
                                                {prayer.name}
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {prayer.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">Memuat jadwal...</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-kemenag-gold font-bold tracking-wider text-sm uppercase">Layanan Unggulan</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Akses Layanan Digital</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Pendaftaran Nikah',
                                desc: 'Daftar nikah online, cek syarat, dan pantau status berkas.',
                                icon: <UserGroupIcon className="w-8 h-8" />,
                                href: '/layanan/nikah',
                                color: 'bg-blue-600'
                            },
                            {
                                title: 'Jadwal Nikah',
                                desc: 'Cek ketersediaan jadwal akad nikah dan penghulu.',
                                icon: <CalendarDaysIcon className="w-8 h-8" />,
                                href: '/jadwal-nikah',
                                color: 'bg-purple-600'
                            },
                            {
                                title: 'Data Masjid',
                                desc: 'Direktori masjid, musholla, serta data imam dan khotib.',
                                icon: <BuildingLibraryIcon className="w-8 h-8" />,
                                href: '/masjid',
                                color: 'bg-emerald-600'
                            },
                        ].map((service, idx) => (
                            <Link key={idx} to={service.href} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-2xl ${service.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-500 mb-6 leading-relaxed">{service.desc}</p>
                                <div className="flex items-center text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">
                                    Akses Layanan <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* KALENDER NIKAH (NEW) */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                        <div>
                            <span className="text-pink-500 font-bold tracking-wider text-sm uppercase">Agenda Bahagia</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Jadwal Akad Nikah Terkini</h2>
                            <p className="text-gray-500 mt-2 max-w-xl">Pasangan yang akan melangsungkan pernikahan di KUA Kecamatan Sembawa.</p>
                        </div>
                        <Link to="/jadwal-nikah" className="btn-secondary">
                            Lihat Semua Jadwal
                        </Link>
                    </div>

                    {loadingWeddings ? (
                        <div className="text-center py-12 text-gray-400">Memuat jadwal nikah...</div>
                    ) : weddings.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {weddings.map((wedding) => (
                                <div key={wedding.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            Akan Menikah
                                        </div>
                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            {new Date(wedding.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-center w-full">
                                            <div className="font-bold text-gray-900 text-lg">{wedding.pendaftaran?.nama_pria || 'Pria'}</div>
                                            <HeartIcon className="w-5 h-5 text-pink-500 mx-auto my-1" />
                                            <div className="font-bold text-gray-900 text-lg">{wedding.pendaftaran?.nama_wanita || 'Wanita'}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-gray-50 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-gray-400" />
                                            {wedding.jam_mulai} WIB
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <span className="line-clamp-1">{wedding.lokasi}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-500">
                            Belum ada jadwal nikah yang akan datang.
                        </div>
                    )}
                </div>
            </section>

            {/* BERITA & INFORMASI */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-kemenag-green font-bold tracking-wider text-sm uppercase">Berita & Informasi</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Kabar KUA Sembawa</h2>
                        </div>
                        <Link to="/berita" className="hidden sm:inline-flex btn-secondary">
                            Lihat Semua
                        </Link>
                    </div>

                    {loadingNews ? (
                        <div className="text-center py-12 text-gray-400">Memuat berita...</div>
                    ) : news.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((item) => (
                                <Link key={item.id} to={`/berita/${item.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={getFileUrl(item.gambar)} 
                                            alt={item.judul}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                {item.kategori || 'Berita'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs text-gray-500 mb-2">
                                            {new Date(item.published_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-kemenag-green transition-colors">
                                            {item.judul}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {item.ringkasan}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl text-gray-500 border border-gray-100">
                            Belum ada berita terbaru.
                        </div>
                    )}
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-24 bg-kemenag-green-dark overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Melayani Kebutuhan Anda</h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Kami berkomitmen memberikan pelayanan terbaik, transparan, dan mudah diakses bagi seluruh masyarakat Kecamatan Sembawa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/layanan/antrian" className="btn-gold px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Ambil Antrian
                        </Link>
                        <Link to="/faq" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-kemenag-green font-semibold transition-all backdrop-blur-sm">
                            Pertanyaan Umum
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
