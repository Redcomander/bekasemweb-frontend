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
                ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
                : 'bg-gradient-to-b from-black/70 to-transparent py-5'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logoKemenag}
                            alt="Logo Kemenag"
                            className="h-10 w-auto group-hover:drop-shadow-lg transition-all duration-300"
                        />
                        <div className={`flex flex-col transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            <span className="font-bold text-lg leading-none tracking-tight">KUA SEMBAWA</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] opacity-90">KAB. BANYUASIN</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`relative text-sm font-medium transition-colors duration-300 group py-1 ${isActive(item.href)
                                    ? (scrolled ? 'text-kemenag-green font-bold' : 'text-kemenag-gold font-bold')
                                    : (scrolled ? 'text-gray-600 hover:text-kemenag-green' : 'text-white/90 hover:text-white')
                                    }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-current transition-all duration-300 ease-out ${
                                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                            </Link>
                        ))}
                        <Link
                            to="/layanan/antrian"
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${scrolled
                                ? 'bg-kemenag-green text-white hover:bg-kemenag-green-dark hover:shadow-kemenag-green/30'
                                : 'bg-white text-kemenag-green hover:bg-gray-50'
                                }`}
                        >
                            Ambil Antrian
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-xl transition-all duration-300 ${scrolled 
                                ? 'text-gray-900 hover:bg-gray-100' 
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {isOpen ? (
                                <XMarkIcon className="h-7 w-7" />
                            ) : (
                                <Bars3Icon className="h-7 w-7" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 transition-all duration-300 origin-top ${
                    isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'
                }`}>
                    <div className="px-5 py-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(item.href)
                                    ? 'bg-kemenag-green/10 text-kemenag-green'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-kemenag-green hover:pl-6'
                                    }`}
                            >
                                {item.name}
                                {isActive(item.href) && <div className="w-1.5 h-1.5 rounded-full bg-kemenag-green"></div>}
                            </Link>
                        ))}
                        <div className="pt-4 mt-2 border-t border-gray-100">
                            <Link
                                to="/layanan/antrian"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center px-6 py-3.5 bg-kemenag-green text-white rounded-xl font-bold shadow-lg shadow-kemenag-green/20 active:scale-95 transition-all"
                            >
                                Ambil Antrian Online
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
