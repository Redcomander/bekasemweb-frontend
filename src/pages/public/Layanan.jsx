import { Link } from 'react-router-dom';
import { servicesContent } from '../../data/servicesContent';

export default function Layanan() {
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
                        {servicesContent.map((service, idx) => (
                            <Link
                                key={idx}
                                to={service.customLink || `/layanan/${service.slug}`}
                                className="premium-card p-8 group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-kemenag-green transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3">
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
