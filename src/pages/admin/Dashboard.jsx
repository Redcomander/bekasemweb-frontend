import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
    UserGroupIcon, 
    DocumentTextIcon, 
    QueueListIcon, 
    HeartIcon,
    ArrowTrendingUpIcon,
    CalendarDaysIcon,
    ClockIcon,
    EyeIcon,
    ArrowRightIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentNikah, setRecentNikah] = useState([]);
    const [activeAntrian, setActiveAntrian] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live clock - updates every second with Jakarta timezone
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Call the correct dashboard endpoint
            const dashboardRes = await api.get('/admin/dashboard');
            const dashboardData = dashboardRes.data?.data || dashboardRes.data || {};
            
            // Extract stats from the nested structure
            const statsData = dashboardData.stats || {};
            setStats({
                pendaftaran: statsData.pendaftaran_pending || 0,
                pendaftaran_today: dashboardData.this_month?.pendaftaran_baru || 0,
                antrian: statsData.antrian_hari_ini || 0,
                antrian_waiting: statsData.antrian_hari_ini || 0,
                berita: statsData.total_berita || 0,
                berita_draft: 0,
                masjid: statsData.total_masjid || 0,
                musholla: statsData.total_musholla || 0,
            });
            
            // Use recent pendaftaran from dashboard response
            setRecentNikah(dashboardData.recent_pendaftaran || []);
            
            // Antrian endpoint doesn't exist, so we'll leave it empty for now
            setActiveAntrian([]);
        } catch (error) {
            console.error('Dashboard error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format date and time with Jakarta timezone
    const dateString = currentTime.toLocaleDateString('id-ID', { 
        timeZone: 'Asia/Jakarta',
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    const timeString = currentTime.toLocaleTimeString('id-ID', { 
        timeZone: 'Asia/Jakarta',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });

    const statCards = [
        { name: 'Pendaftaran Nikah', value: stats?.pendaftaran || '0', change: `${stats?.pendaftaran_today || 0} hari ini`, icon: HeartIcon, color: 'bg-gradient-to-br from-pink-500 to-rose-600', link: '/admin/nikah' },
        { name: 'Antrian Hari Ini', value: stats?.antrian || '0', change: `${stats?.antrian_waiting || 0} menunggu`, icon: QueueListIcon, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', link: '/admin/antrian' },
        { name: 'Berita Aktif', value: stats?.berita || '0', change: `${stats?.berita_draft || 0} draft`, icon: DocumentTextIcon, color: 'bg-gradient-to-br from-emerald-500 to-green-600', link: '/admin/berita' },
        { name: 'Masjid & Musholla', value: stats?.masjid || '0', change: `${stats?.musholla || 0} musholla`, icon: BuildingLibraryIcon, color: 'bg-gradient-to-br from-orange-500 to-amber-600', link: '/admin/masjid' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            diajukan: 'bg-yellow-100 text-yellow-700',
            disetujui: 'bg-green-100 text-green-700',
            revisi: 'bg-red-100 text-red-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-kemenag-green via-kemenag-green to-kemenag-green-dark rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">
                            Selamat Datang, {user?.name || 'Admin'}! 👋
                        </h1>
                        <p className="text-white/80">Dashboard Admin KUA Kecamatan Sembawa</p>
                    </div>
                    <div className="flex items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                            <CalendarDaysIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">{dateString}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                            <ClockIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">{timeString}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Link 
                        key={stat.name} 
                        to={stat.link}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{loading ? '...' : stat.value}</p>
                                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <ArrowTrendingUpIcon className="w-4 h-4" />
                                {stat.change}
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-kemenag-green group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Pendaftaran */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Pendaftaran Terbaru</h2>
                        <Link to="/admin/nikah" className="text-sm text-kemenag-green hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Memuat...</div>
                        ) : recentNikah.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Belum ada pendaftaran</div>
                        ) : (
                            <div className="space-y-3">
                                {recentNikah.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                <HeartIcon className="w-5 h-5 text-pink-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.nama_pria} & {item.nama_wanita}</p>
                                                <p className="text-xs text-gray-500">{item.tanggal_nikah}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Antrian */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Antrian Menunggu</h2>
                        <Link to="/admin/antrian" className="text-sm text-kemenag-green hover:underline">Kelola Antrian</Link>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Memuat...</div>
                        ) : activeAntrian.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <QueueListIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                <p>Tidak ada antrian aktif</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeAntrian.map((item, idx) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-kemenag-gold/20 rounded-full flex items-center justify-center font-bold text-kemenag-gold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-mono font-bold text-gray-900">{item.kode_antrian}</p>
                                                <p className="text-xs text-gray-500">{item.nama_pengunjung}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                            Menunggu
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/nikah" className="p-4 rounded-xl border border-gray-200 hover:border-kemenag-green hover:bg-green-50 transition-colors text-center group">
                        <HeartIcon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-kemenag-green mb-2" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-kemenag-green">Verifikasi Nikah</span>
                    </Link>
                    <Link to="/admin/antrian" className="p-4 rounded-xl border border-gray-200 hover:border-kemenag-green hover:bg-green-50 transition-colors text-center group">
                        <QueueListIcon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-kemenag-green mb-2" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-kemenag-green">Panggil Antrian</span>
                    </Link>
                    <Link to="/admin/berita" className="p-4 rounded-xl border border-gray-200 hover:border-kemenag-green hover:bg-green-50 transition-colors text-center group">
                        <DocumentTextIcon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-kemenag-green mb-2" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-kemenag-green">Tambah Berita</span>
                    </Link>
                    <Link to="/admin/galeri" className="p-4 rounded-xl border border-gray-200 hover:border-kemenag-green hover:bg-green-50 transition-colors text-center group">
                        <EyeIcon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-kemenag-green mb-2" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-kemenag-green">Upload Galeri</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
