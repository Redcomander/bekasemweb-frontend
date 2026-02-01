import { EnvelopeIcon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Kontak() {
    return (
        <div>
            {/* Header */}
            <section className="bg-kemenag-green py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Kami siap membantu dan melayani kebutuhan keagamaan Anda. Silakan hubungi kami melalui saluran yang tersedia.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-8 rounded-3xl">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Informasi Kontak</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-kemenag-green flex-shrink-0">
                                            <MapPinIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Alamat Kantor</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Jl. Lintas Timur Km. 29, Komplek Perkantoran Pemkab Banyuasin<br />
                                                Kecamatan Sembawa, Kabupaten Banyuasin<br />
                                                Sumatera Selatan 30953
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-kemenag-green flex-shrink-0">
                                            <PhoneIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Telepon/WhatsApp</h3>
                                            <p className="text-gray-600">+62 821-2345-6789</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-kemenag-green flex-shrink-0">
                                            <EnvelopeIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                            <p className="text-gray-600">kua.sembawa@kemenag.go.id</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-kemenag-green flex-shrink-0">
                                            <ClockIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Jam Operasional</h3>
                                            <p className="text-gray-600">Senin - Kamis: 07.30 - 16.00 WIB</p>
                                            <p className="text-gray-600">Jumat: 07.30 - 16.30 WIB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maps & Form */}
                        <div className="space-y-8">
                            <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15938.9082723377!2d104.570176!3d-2.894208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b730000000001%3A0x123456789!2sKantor%20Urusan%20Agama%20(KUA)%20Kecamatan%20Sembawa!5e0!3m2!1sid!2sid!4v1625633456789!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
