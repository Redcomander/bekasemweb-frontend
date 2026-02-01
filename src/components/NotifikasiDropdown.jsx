import { useState, useEffect, useRef } from 'react';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
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

    const markAsRead = async (id) => {
        try {
            await api.put(`/admin/notifikasi/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeIcon = (type) => {
        const icons = {
            'pendaftaran': '💒',
            'antrian': '🎫',
            'dokumen': '📄',
        };
        return icons[type] || '🔔';
    };

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setOpen(!open)} 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-bold text-gray-900">Notifikasi</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Memuat...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
                        ) : (
                            notifications.slice(0, 10).map(n => (
                                <div 
                                    key={n.id} 
                                    className={`p-4 border-b hover:bg-gray-50 flex items-start gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <span className="text-xl">{getTypeIcon(n.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 line-clamp-2">{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{n.created_at}</p>
                                    </div>
                                    {!n.read && (
                                        <button onClick={() => markAsRead(n.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
