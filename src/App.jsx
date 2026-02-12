import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public Layout & Pages
import { Layout } from './components/layout';
import Beranda from './pages/public/Beranda';
import Profil from './pages/public/Profil';
import Layanan from './pages/public/Layanan';
import Berita from './pages/public/Berita';
import BeritaDetail from './pages/public/berita/BeritaDetail';
import Galeri from './pages/public/Galeri';
import Kontak from './pages/public/Kontak';
import JadwalNikah from './pages/public/JadwalNikah';
import Masjid from './pages/public/Masjid';
import MajelisTaklim from './pages/public/MajelisTaklim';
import PendaftaranWizard from './pages/public/pendaftaran/PendaftaranWizard';
import PendaftaranSukses from './pages/public/pendaftaran/PendaftaranSukses';
import PendaftaranStatus from './pages/public/pendaftaran/PendaftaranStatus';
import LayananAntrian from './pages/public/layanan/LayananAntrian';
import LayananDetail from './pages/public/layanan/LayananDetail';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BeritaIndex from './pages/admin/berita/BeritaIndex';
import BeritaMetrics from './pages/admin/berita/BeritaMetrics';
import MasjidIndex from './pages/admin/masjid/MasjidIndex';
import GaleriIndex from './pages/admin/galeri/GaleriIndex';
import MajelisIndex from './pages/admin/majelis/MajelisIndex';
import NikahIndex from './pages/admin/nikah/NikahIndex';
import AntrianIndex from './pages/admin/antrian/AntrianIndex';
import UserIndex from './pages/admin/users/UserIndex';
import ImamIndex from './pages/admin/imam/ImamIndex';
import KhotibIndex from './pages/admin/khotib/KhotibIndex';
import NotificationIndex from './pages/admin/notifikasi/NotificationIndex';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * BEKASEMWEB Application
 * ======================
 * Website KUA Sembawa - Kementerian Agama
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Beranda />} />
            <Route path="profil" element={<Profil />} />
            <Route path="layanan" element={<Layanan />} />
            <Route path="berita" element={<Berita />} />
            <Route path="berita/:slug" element={<BeritaDetail />} />
            <Route path="galeri" element={<Galeri />} />
            <Route path="kontak" element={<Kontak />} />
            <Route path="jadwal-nikah" element={<JadwalNikah />} />
            <Route path="masjid" element={<Masjid />} />
            <Route path="majelis-taklim" element={<MajelisTaklim />} />
            <Route path="layanan/nikah" element={<PendaftaranWizard />} />
            <Route path="pendaftaran-sukses" element={<PendaftaranSukses />} />
            <Route path="layanan/nikah/cek" element={<PendaftaranStatus />} />
            <Route path="layanan/antrian" element={<LayananAntrian />} />
            <Route path="layanan/:slug" element={<LayananDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="berita" element={<BeritaIndex />} />
            <Route path="berita-metrics" element={<BeritaMetrics />} />
            <Route path="masjid" element={<MasjidIndex />} />
            <Route path="galeri" element={<GaleriIndex />} />
            <Route path="majelis" element={<MajelisIndex />} />
            <Route path="nikah" element={<NikahIndex />} />
            <Route path="antrian" element={<AntrianIndex />} />
            <Route path="users" element={<UserIndex />} />
            <Route path="imam" element={<ImamIndex />} />
            <Route path="khotib" element={<KhotibIndex />} />
            <Route path="notifikasi" element={<NotificationIndex />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
