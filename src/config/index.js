/**
 * Social Media Configuration
 * ==========================
 * Static links for footer display.
 * Fallback if API is unavailable.
 */

export const socialMedia = {
    youtube: {
        url: 'https://youtube.com/@kuasembawa',
        label: 'YouTube',
        icon: 'youtube',
    },
    facebook: {
        url: 'https://facebook.com/kuasembawa',
        label: 'Facebook',
        icon: 'facebook',
    },
    instagram: {
        url: 'https://instagram.com/kuasembawa',
        label: 'Instagram',
        icon: 'instagram',
    },
};

/**
 * Location Configuration (Fallback)
 */
export const lokasiKUA = {
    nama: 'KUA Kecamatan Sembawa',
    alamat: 'Jl. Raya Sembawa, Kec. Sembawa, Kab. Banyuasin',
    telepon: '0711-XXXXXXX',
    email: 'kua.sembawa@kemenag.go.id',
};

/**
 * Navigation Links
 */
export const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/profil', label: 'Profil' },
    { path: '/layanan', label: 'Layanan' },
    { path: '/jadwal-nikah', label: 'Jadwal Nikah' },
    { path: '/masjid', label: 'Masjid' },
    { path: '/majelis-taklim', label: 'Majelis Taklim' },
    { path: '/berita', label: 'Berita' },
    { path: '/galeri', label: 'Galeri' },
    { path: '/kontak', label: 'Kontak' },
];
