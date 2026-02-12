import { Fragment } from 'react';
import { ExclamationTriangleIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const iconMap = {
    danger: { icon: TrashIcon, bg: 'bg-red-100', color: 'text-red-600' },
    warning: { icon: ExclamationTriangleIcon, bg: 'bg-yellow-100', color: 'text-yellow-600' },
    success: { icon: CheckCircleIcon, bg: 'bg-green-100', color: 'text-green-600' },
};

const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
};

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Konfirmasi', 
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'danger', // 'danger', 'warning', 'success'
    loading = false,
}) {
    if (!isOpen) return null;

    const { icon: Icon, bg, color } = iconMap[type] || iconMap.danger;
    const buttonStyle = buttonStyles[type] || buttonStyles.danger;

    return (
        <Fragment>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 ${color}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors disabled:opacity-50 ${buttonStyle}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Memproses...
                                </span>
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
