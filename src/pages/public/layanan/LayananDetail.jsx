import { useParams, Link, Navigate } from 'react-router-dom';
import { servicesContent } from '../../../data/servicesContent';
import { CheckCircleIcon, ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function LayananDetail() {
    const { slug } = useParams();
    const service = servicesContent.find(s => s.slug === slug);

    if (!service) {
        return <Navigate to="/layanan" replace />;
    }

    const Icon = service.icon;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-teal-900 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/layanan" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Kembali ke Layanan
                    </Link>
                    <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
                        <div className={`w-16 h-16 rounded-2xl ${service.color.replace('bg-', 'bg-white/10 ').replace('text-', 'text-white ')} flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20`}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">{service.desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div className="p-8 md:p-10">
                        <div className="prose max-w-none text-gray-600 mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Tentang Layanan</h3>
                            <p className="text-lg leading-relaxed">{service.details}</p>
                        </div>

                        {service.requirements && (
                            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-kemenag-gold rounded-full"></span>
                                    Persyaratan Dokumen
                                </h3>
                                <ul className="space-y-4">
                                    {service.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-gray-700">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-100">
                            <Link 
                                to={`/layanan/antrian?service=${slug}`} 
                                className="btn-primary py-4 px-8 flex items-center justify-center gap-2 text-lg shadow-lg shadow-green-900/20"
                            >
                                <CalendarDaysIcon className="w-6 h-6" />
                                Ambil Antrian Sekarang
                            </Link>
                            {/* Optional: Add contact button if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
