import { BuildingOffice2Icon, UserGroupIcon, MapIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Profil() {
    return (
        <div className="overflow-x-hidden">
            {/* Header / Hero */}
            <section className="relative py-24 bg-kemenag-green text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-kemenag-green-dark/50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                    <span className="text-kemenag-gold font-bold tracking-widest text-sm uppercase mb-3 block">Tentang Kami</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Profil KUA Kecamatan Sembawa</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Mengenal lebih dekat Kantor Urusan Agama Kecamatan Sembawa sebagai garda terdepan pelayanan Kementerian Agama.
                    </p>
                </div>
            </section>

            {/* Visi Misi */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1605306385567-27de111c19b6?q=80&w=2070&auto=format&fit=crop"
                                    alt="KUA Office"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-kemenag-green/20"></div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-kemenag-gold/20 text-kemenag-gold flex items-center justify-center text-sm">01</span>
                                    Visi Kami
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-kemenag-gold pl-4">
                                    "Terwujudnya masyarakat Sembawa yang taat beragama, rukun, cerdas, dan sejahtera lahir batin dalam rangka mewujudkan Indonesia Maju yang berdaulat, mandiri, dan berkepribadian berdasarkan gotong royong."
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-kemenag-green/20 text-kemenag-green flex items-center justify-center text-sm">02</span>
                                    Misi Kami
                                </h2>
                                <ul className="space-y-4">
                                    {[
                                        'Meningkatkan kualitas kesalehan umat beragama.',
                                        'Memperkuat moderasi beragama dan kerukunan umat beragama.',
                                        'Meningkatkan layanan keagamaan yang adil, mudah dan merata.',
                                        'Meningkatkan produktivitas dan daya saing pendidikan keagamaan.',
                                        'Memantapkan tata kelola pemerintahan yang baik (Good Governance).'
                                    ].map((misi, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                            <CheckBadgeIcon className="w-6 h-6 text-kemenag-green flex-shrink-0 mt-0.5" />
                                            <span>{misi}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats / Wilayah */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Wilayah Kerja</h2>
                        <p className="text-gray-600">Cakupan wilayah pelayanan KUA Kecamatan Sembawa</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <MapIcon className="w-8 h-8" />, value: '11', label: 'Desa/Kelurahan' },
                            { icon: <UserGroupIcon className="w-8 h-8" />, value: '32.500+', label: 'Penduduk Muslim' },
                            { icon: <BuildingOffice2Icon className="w-8 h-8" />, value: '55', label: 'Masjid' },
                            { icon: <ChartBarIcon className="w-8 h-8" />, value: '92%', label: 'Indeks Kepuasan' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm text-center hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-16 h-16 mx-auto bg-kemenag-green/10 text-kemenag-green rounded-full flex items-center justify-center mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi simple */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Struktur Organisasi</h2>
                        <p className="text-gray-600">Tim profesional KUA Kecamatan Sembawa siap melayani Anda</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 justify-center">
                        {/* Kepala KUA */}
                        <div className="md:col-start-2 text-center group">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-kemenag-gold/20 group-hover:border-kemenag-gold transition-colors">
                                <img
                                    src="https://ui-avatars.com/api/?name=Kepala+KUA&background=0E6D4E&color=fff&size=512"
                                    alt="Kepala KUA"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">H. Ahmad Fauzi, S.Ag</h3>
                            <p className="text-kemenag-green font-medium">Kepala KUA</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {[
                            { name: 'Drs. H. M. Ali', role: 'Penghulu Muda' },
                            { name: 'Siti Aminah, S.Th.I', role: 'Penyuluh Agama' },
                            { name: 'Budi Santoso, S.Kom', role: 'Staff Administrasi' },
                        ].map((staff, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-kemenag-green/30 transition-colors">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${staff.name}&background=f3f4f6&color=374151&size=256`}
                                        alt={staff.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
                                <p className="text-gray-500 text-sm">{staff.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function CheckBadgeIcon(props) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
    )
}
