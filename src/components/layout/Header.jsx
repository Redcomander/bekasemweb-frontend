import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logoKemenag from '../../assets/images/logo-kemenag.png';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: 'Beranda', href: '/' },
        { name: 'Profil', href: '/profil' },
        { name: 'Layanan', href: '/layanan' },
        { name: 'Cek Status', href: '/layanan/nikah/cek' },
        { name: 'Berita', href: '/berita' },
        { name: 'Galeri', href: '/galeri' },
        { name: 'Kontak', href: '/kontak' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logoKemenag}
                            alt="Logo Kemenag"
                            className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className={`flex flex-col transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            <span className="font-bold text-lg leading-none">KUA SEMBAWA</span>
                            <span className="text-xs font-medium tracking-wider opacity-90">KAB. BANYUASIN</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${isActive(item.href)
                                    ? 'text-kemenag-gold font-bold'
                                    : scrolled
                                        ? 'text-gray-600 hover:text-kemenag-green'
                                        : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/layanan/antrian"
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${scrolled
                                ? 'bg-kemenag-green text-white hover:bg-kemenag-green-dark'
                                : 'bg-white text-kemenag-green hover:bg-gray-100'
                                }`}
                        >
                            Ambil Antrian
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
                                }`}
                        >
                            {isOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 animate-fade-in-up">
                        <div className="px-4 py-6 space-y-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-kemenag-green/10 text-kemenag-green'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-kemenag-green'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                to="/layanan/antrian"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center mt-4 px-6 py-3 bg-kemenag-green text-white rounded-lg font-semibold shadow-md active:scale-95 transition-transform"
                            >
                                Ambil Antrian Online
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
