import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    HomeIcon, 
    NewspaperIcon, 
    ChartBarIcon,
    BuildingLibraryIcon, 
    PhotoIcon, 
    UserGroupIcon,
    HeartIcon,
    QueueListIcon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import NotifikasiDropdown from '../../components/NotifikasiDropdown';
import logoKemenag from '../../assets/images/logo-kemenag.png';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Berita', href: '/admin/berita', icon: NewspaperIcon },
    { name: 'Metrics Berita', href: '/admin/berita-metrics', icon: ChartBarIcon },
    { name: 'Masjid', href: '/admin/masjid', icon: BuildingLibraryIcon },
    { name: 'Galeri', href: '/admin/galeri', icon: PhotoIcon },
    { name: 'Majelis Taklim', href: '/admin/majelis', icon: UserGroupIcon },
    { name: 'Pendaftaran Nikah', href: '/admin/nikah', icon: HeartIcon },
    { name: 'Antrian', href: '/admin/antrian', icon: QueueListIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-kemenag-green-dark transform transition-transform duration-300 z-50 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                        <img src={logoKemenag} alt="Logo" className="h-10 w-auto" />
                        <div className="text-white">
                            <h2 className="font-bold text-sm leading-tight">KUA SEMBAWA</h2>
                            <p className="text-xs text-white/60">Admin Panel</p>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="ml-auto lg:hidden text-white/70 hover:text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                end={item.href === '/admin'}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-white/60 truncate">{user?.role || 'Administrator'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>

                        <div className="flex-1" />

                        {/* Notifications */}
                        <NotifikasiDropdown />
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
