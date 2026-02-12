import {
    UserGroupIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    ScaleIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

export const servicesContent = [
    {
        slug: 'nikah',
        title: 'Pendaftaran Nikah',
        desc: 'Layanan pendaftaran pencatatan nikah secara online. Cek syarat, prosedur, dan status berkas Anda disini.',
        icon: UserGroupIcon,
        color: 'bg-blue-50 text-blue-600',
        customLink: '/layanan/nikah', // Links to wizard
        details: 'Pendaftaran nikah dapat dilakukan secara online melalui SIMKAH atau datang langsung ke KUA. Layanan ini mencakup pemeriksaan berkas, penentuan jadwal akad, hingga penerbitan buku nikah.',
        requirements: [
            'Surat Pengantar Nikah dari Kelurahan (N1)',
            'Surat Persetujuan Mempelai (N3)',
            'Surat Izin Orang Tua (N5) jika usia di bawah 21 tahun',
            'Fotocopy KTP & KK Calon Pengantin',
            'Fotocopy KTP & KK Orang Tua',
            'Fotocopy KTP & KK Wali Nikah',
            'Fotocopy Akta Kelahiran / Ijazah Terakhir',
            'Pas Foto 2x3 (4 lembar) dan 4x6 (2 lembar) latar biru',
            'Surat Cerai / Akta Kematian (jika status duda/janda)',
            'Surat Dispensasi Pengadilan (jika usia kurang dari 19 tahun)',
            'Surat Rekomendasi Nikah (jika menikah di luar kecamatan domisili)'
        ]
    },
    {
        slug: 'rekomendasi',
        title: 'Rekomendasi Nikah',
        desc: 'Pengurusan surat rekomendasi nikah untuk calon pengantin yang akan menikah di luar kecamatan domisili.',
        icon: DocumentTextIcon,
        color: 'bg-indigo-50 text-indigo-600',
        details: 'Surat Rekomendasi Nikah diperlukan bagi warga Kecamatan Sembawa yang hendak melangsungkan pernikahan di wilayah kecamatan lain. Dokumen ini diterbitkan oleh KUA Kecamatan Sembawa sebagai pengantar ke KUA tujuan.',
        requirements: [
            'Surat Pengantar dari RT/RW',
            'Surat Pengantar dari Kelurahan/Desa (N1, N2, N4)',
            'Fotocopy KTP & KK Calon Pengantin (CPW & CPP)',
            'Fotocopy KTP & KK Orang Tua',
            'Fotocopy Akta Kelahiran / Ijazah',
            'Fotocopy Buku Nikah Orang Tua (jika anak pertama)',
            'Surat Belum Menikah dari Desa/Kelurahan',
            'Pas Foto 2x3 dan 4x6 masing-masing 2 lembar (latar biru)'
        ]
    },
    {
        slug: 'bimwin',
        title: 'Bimbingan Perkawinan (BIMWIN)',
        desc: 'Kursus pra-nikah untuk membekali calon pengantin dengan pengetahuan agama dan ketahanan keluarga.',
        icon: AcademicCapIcon,
        color: 'bg-purple-50 text-purple-600',
        details: 'Bimbingan Perkawinan (Bimwin) adalah program pembekalan bagi calon pengantin untuk mewujudkan keluarga sakinah, mawaddah, wa rahmah. Materi meliputi pondasi keluarga, kesehatan reproduksi, manajemen konflik, dan psikologi perkawinan.',
        requirements: [
            'Telah mendaftar kehendak nikah di KUA',
            'Mengisi formulir kesediaan mengikuti Bimwin',
            'Hadir tepat waktu sesuai jadwal yang ditentukan',
            'Mengikuti seluruh sesi materi (biasanya 2 hari)'
        ]
    },
    {
        slug: 'konsultasi',
        title: 'Konsultasi Keluarga',
        desc: 'Layanan konsultasi keluarga sakinah (BP4) untuk membantu menyelesaikan masalah rumah tangga.',
        icon: ChatBubbleBottomCenterTextIcon,
        color: 'bg-pink-50 text-pink-600',
        details: 'Layanan konsultasi dan mediasi bagi pasangan suami istri yang menghadapi permasalahan rumah tangga. Dilayani oleh penghulu dan penyuluh agama Islam yang kompeten melalui Badan Penasihatan Pembinaan dan Pelestarian Perkawinan (BP4).',
        requirements: [
            'Datang langsung ke KUA atau mendaftar antrian online',
            'Membawa KTP dan Buku Nikah (asli/fotocopy)',
            'Mengisi formulir permohonan konsultasi',
            'Bersedia mengikuti prosedur mediasi'
        ]
    },
    {
        slug: 'wakaf',
        title: 'Wakaf & Kemasjidan',
        desc: 'Pelayanan administrasi ikrar wakaf, pendaftaran masjid/musholla, dan pengukuran arah kiblat.',
        icon: BuildingLibraryIcon,
        color: 'bg-green-50 text-green-600',
        details: 'Layanan ini mencakup penerbitan Akta Ikrar Wakaf (AIW), konsultasi pengelolaan wakaf, pendaftaran data masjid/musholla (SIMAS), serta layanan pengukuran dan kalibrasi arah kiblat oleh Tim Hisab Rukyat.',
        requirements: [
            'Surat Permohonan (untuk wakaf/kalibrasi kiblat)',
            'Sertifikat Tanah / Bukti Kepemilikan (untuk wakaf)',
            'KTP Wakif, Nazhir, dan Saksi (untuk wakaf)',
            'Surat Keterangan Domisili Masjid/Musholla (untuk pendaftaran SIMAS)',
            'Susunan Pengurus Masjid/Musholla'
        ]
    },
    {
        slug: 'legalisir',
        title: 'Legalisir Dokumen',
        desc: 'Legalisir buku nikah dan dokumen keagamaan lainnya yang diterbitkan oleh KUA.',
        icon: ScaleIcon,
        color: 'bg-yellow-50 text-yellow-600',
        details: 'Pengesahan salinan dokumen (legalisir) seperti Buku Nikah, Duplikat Buku Nikah, atau surat keterangan lainnya yang diterbitkan oleh KUA Kecamatan Sembawa.',
        requirements: [
            'Membawa Dokumen Asli (Buku Nikah, dll)',
            'Fotocopy dokumen yang akan dilegalisir (maksimal 5 lembar)',
            'KTP Pemohon',
            'Bagi perwakilan, menyertakan Surat Kuasa bermeterai'
        ]
    }
];
