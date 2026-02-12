import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    BellIcon, 
    CheckCircleIcon, 
    InformationCircleIcon,
    HeartIcon,
    DocumentTextIcon,
    QueueListIcon,
    ClockIcon,
    TrashIcon
} from '@heroicons/react/24/solid';
import api from '../services/api';

export default function NotifikasiDropdown() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        fetchNotifications();
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/notifikasi');
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await api.put(`/admin/notifikasi/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const markAllRead = async () => {
        try {
            // Assuming backend supports this or loop
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            await Promise.all(unreadIds.map(id => api.put(`/admin/notifikasi/${id}/read`)));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type) => {
        switch(type) {
            case 'pendaftaran':
                return <HeartIcon className="w-5 h-5 text-pink-500" />;
            case 'dokumen':
                return <DocumentTextIcon className="w-5 h-5 text-blue-500" />;
            case 'antrian':
                return <QueueListIcon className="w-5 h-5 text-orange-500" />;
            default:
                return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getBgColor = (type) => {
        switch(type) {
            case 'pendaftaran': return 'bg-pink-50';
            case 'dokumen': return 'bg-blue-50';
            case 'antrian': return 'bg-orange-50';
            default: return 'bg-gray-50';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setOpen(!open)} 
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    open ? 'bg-kemenag-green/10 text-kemenag-green' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
                <BellIcon className={`w-6 h-6 transition-transform duration-300 ${open ? 'scale-110' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
            </button>

            {open && (
                <div 
                    className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform origin-top-right transition-all duration-200 animate-scale-in z-50"
                >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Notifikasi</h3>
                            <p className="text-xs text-gray-500">Anda memiliki {unreadCount} pesan belum dibaca</p>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllRead}
                                className="text-xs font-semibold text-kemenag-green hover:underline flex items-center gap-1"
                            >
                                <CheckCircleIcon className="w-3 h-3" /> Tandai semua
                            </button>
                        )}
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                <div className="animate-spin w-6 h-6 border-2 border-kemenag-green border-t-transparent rounded-full mx-auto mb-2"></div>
                                Memuat...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <BellIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Tidak ada notifikasi baru</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.slice(0, 10).map((n, i) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!n.read ? 'bg-green-50/30' : ''}`}
                                        onClick={() => markAsRead(n.id, { stopPropagation: () => {} })} // Simple view trigger
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(n.type)}`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-semibold mb-0.5 ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {n.title || n.type?.toUpperCase() || 'INFO'}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                                                        <ClockIcon className="w-3 h-3" />
                                                        {formatDate(n.created_at)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm line-clamp-2 leading-relaxed ${!n.read ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {n.message}
                                                </p>
                                            </div>
                                            {!n.read && (
                                                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={(e) => markAsRead(n.id, e)}
                                                        className="p-1.5 bg-white text-green-600 shadow-sm rounded-full border border-gray-100 hover:scale-110 transition-transform"
                                                        title="Tandai dibaca"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {!n.read && (
                                                <div className="flex-shrink-0 self-center">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full block"></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                        <Link to="/admin/notifikasi" onClick={() => setOpen(false)} className="text-xs font-semibold text-gray-600 hover:text-kemenag-green transition-colors block w-full">
                            Lihat Semua Notifikasi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
