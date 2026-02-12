import { useState, useEffect } from 'react';
import { 
    BellIcon, 
    CheckCircleIcon, 
    InformationCircleIcon, 
    HeartIcon, 
    DocumentTextIcon, 
    QueueListIcon, 
    TrashIcon,
    EnvelopeOpenIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';
import ConfirmModal from '../../../components/ConfirmModal';

export default function NotificationIndex() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/notifikasi');
            // Assuming response.data is the array of notifications based on NotifikasiDropdown
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
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            
            // If backend has a dedicated endpoint for mark all read, use it.
            // Otherwise, we might need to loop (which is not ideal) or assume the backend provided one.
            // efficient way is sending a request to mark all.
            // Based on drop down implementation, it loops. Let's try to assume there might be a bulk endpoint or just loop for now to be safe with existing code patterns.
            // Actually, let's just use the loop as in NotifikasiDropdown to be consistent for now, or improved if possible.
            // Checking NotifikasiDropdown again... it filters unread and maps promises.
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length > 0) {
                await Promise.all(unreadIds.map(id => api.put(`/admin/notifikasi/${id}/read`)));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/notifikasi/${deleteConfirm.id}`);
            setNotifications(prev => prev.filter(n => n.id !== deleteConfirm.id));
            setDeleteConfirm({ open: false, id: null });
        } catch (error) {
            alert('Gagal menghapus notifikasi');
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'pendaftaran': return <HeartIcon className="w-6 h-6 text-pink-500" />;
            case 'dokumen': return <DocumentTextIcon className="w-6 h-6 text-blue-500" />;
            case 'antrian': return <QueueListIcon className="w-6 h-6 text-orange-500" />;
            default: return <InformationCircleIcon className="w-6 h-6 text-gray-500" />;
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

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
                    <p className="text-gray-500 text-sm">Pusat informasi dan pemberitahuan sistem</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={markAllRead} 
                        className="btn-secondary flex items-center gap-2 text-sm"
                        disabled={!notifications.some(n => !n.read)}
                    >
                        <CheckCircleIcon className="w-4 h-4" /> Tandai Semua Dibaca
                    </button>
                    <button onClick={fetchNotifications} className="btn-secondary p-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2 overflow-x-auto">
                {['all', 'unread', 'read'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            filter === f 
                                ? 'bg-kemenag-green text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {f === 'all' && 'Semua'}
                        {f === 'unread' && 'Belum Dibaca'}
                        {f === 'read' && 'Sudah Dibaca'}
                        <span className="ml-2 opacity-70 text-xs py-0.5 px-1.5 bg-white/20 rounded-full">
                            {f === 'all' ? notifications.length : notifications.filter(n => f === 'unread' ? !n.read : n.read).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="animate-spin w-8 h-8 border-4 border-kemenag-green border-t-transparent rounded-full mr-3"></div>
                        Memuat notifikasi...
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BellIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Tidak ada notifikasi</h3>
                        <p className="text-sm">Anda tidak memiliki notifikasi pada filter ini</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredNotifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`p-6 transition-colors hover:bg-gray-50 flex gap-4 ${!notification.read ? 'bg-green-50/40' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-base font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.title || notification.type?.toUpperCase()}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                                            {new Date(notification.created_at).toLocaleString('id-ID', { 
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-3 ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {!notification.read && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-medium text-kemenag-green hover:underline flex items-center gap-1"
                                            >
                                                <EnvelopeOpenIcon className="w-3.5 h-3.5" /> Tandai dibaca
                                            </button>
                                        )}
                                        {notification.read && (
                                            <span className="text-xs text-gray-400 flex items-center gap-1 cursor-default">
                                                <EnvelopeIcon className="w-3.5 h-3.5" /> Sudah dibaca
                                            </span>
                                        )}
                                        <button 
                                            onClick={() => setDeleteConfirm({ open: true, id: notification.id })}
                                            className="text-xs font-medium text-red-600 hover:underline flex items-center gap-1 ml-auto"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                onConfirm={handleDelete}
                loading={deleting}
                title="Hapus Notifikasi"
                message="Apakah Anda yakin ingin menghapus notifikasi ini? Ini tidak dapat dikembalikan."
                confirmText="Hapus"
                type="danger"
            />
        </div>
    );
}
