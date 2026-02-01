import { Link } from 'react-router-dom';
import logoKemenag from '../../assets/images/logo-kemenag.png';

export default function Footer() {
    return (
        <footer className="bg-kemenag-green text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="2" fill="currentColor" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src={logoKemenag}
                                alt="Logo Kemenag"
                                className="h-12 w-auto"
                            />
                            <div>
                                <h3 className="font-bold text-xl leading-none">KUA SEMBAWA</h3>
                                <p className="text-xs text-white/70 tracking-widest mt-1">KAB. BANYUASIN</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                            Melayani dengan Ikhlas, Mewujudkan Masyarakat yang Taat Beragama, Rukun, Cerdas, dan Sejahtera.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kemenag-gold hover:text-white transition-all duration-300">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kemenag-gold hover:text-white transition-all duration-300">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.315 2m0-2c-2.73 0-3.076.012-4.156.061-1.08.049-1.815.223-2.458.473a6.906 6.906 0 00-2.51 1.63 6.906 6.906 0 00-1.63 2.51c-.25.643-.424 1.378-.473 2.458C1.012 8.239 1 8.586 1 11.315v.63c0 2.73.012 3.076.061 4.156.049 1.08.223 1.815.473 2.458a6.906 6.906 0 001.63 2.51 6.906 6.906 0 002.51 1.63c.643.25 1.378.424 2.458.473 1.08.049 1.426.061 4.156.061h.63c2.73 0 3.076-.012 4.156-.061 1.08-.049 1.815-.223 2.458-.473a6.906 6.906 0 002.51-1.63 6.906 6.906 0 001.63-2.51c.25-.643.424-1.378.473-2.458.049-1.08.061-1.426.061-4.156v-.63c0-2.73-.012-3.076-.061-4.156-.049-1.08-.223-1.815-.473-2.458a6.906 6.906 0 00-1.63-2.51 6.906 6.906 0 00-2.51-1.63c-.643-.25-1.378-.424-2.458-.473C15.391 2.012 15.045 2 12.315 2z" clipRule="evenodd" /><path d="M12.315 5.92a5.4 5.4 0 100 10.796 5.4 5.4 0 000-10.796zm0 8.796a3.4 3.4 0 110-6.8 3.4 3.4 0 010 6.8z" clipRule="evenodd" /><path d="M19.014 4.986a1.28 1.28 0 100 2.56 1.28 1.28 0 000-2.56z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kemenag-gold hover:text-white transition-all duration-300">
                                <span className="sr-only">YouTube</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.254.419-4.813a2.505 2.505 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-kemenag-gold hover:text-white transition-all duration-300">
                                <span className="sr-only">Twitter</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-kemenag-gold">Tautan Cepat</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Profil KUA', href: '/profil' },
                                { name: 'Jadwal Nikah', href: '/jadwal-nikah' },
                                { name: 'Daftar Masjid', href: '/masjid' },
                                { name: 'Majelis Taklim', href: '/majelis-taklim' },
                                { name: 'Berita Terkini', href: '/berita' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Layanan */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-kemenag-gold">Layanan Kami</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Pendaftaran Nikah', href: '/layanan/nikah' },
                                { name: 'Rekomendasi Nikah', href: '/layanan/rekomendasi' },
                                { name: 'Legalisir Dokumen', href: '/layanan/legalisir' },
                                { name: 'Konsultasi Keluarga', href: '/layanan/konsultasi' },
                                { name: 'Bimbingan Perkawinan', href: '/layanan/bimwin' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-kemenag-gold">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-white/80">
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-kemenag-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Jl. Palembang - Jambi Km. 29, Kec. Sembawa, Kab. Banyuasin, Sumatera Selatan</span>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-kemenag-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>(0711) 1234567</span>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-kemenag-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>kua.sembawa@kemenag.go.id</span>
                            </li>
                            <li className="flex gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 text-kemenag-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Senin - Jumat (08:00 - 16:00)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-kemenag-green-dark py-6 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                    <p>&copy; {new Date().getFullYear()} KUA Sembawa. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
