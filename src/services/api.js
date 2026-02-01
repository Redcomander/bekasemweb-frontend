import axios from 'axios';

/**
 * BEKASEMWEB API Service
 * =====================
 * Centralized API client for all backend requests.
 */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'Terjadi kesalahan';

        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }

        return Promise.reject({ message, status: error.response?.status });
    }
);

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

export const lokasiApi = {
    getInfo: () => api.get('/lokasi'),
};

export const socialApi = {
    getLinks: () => api.get('/social'),
};

export const beritaApi = {
    getAll: (params) => api.get('/berita', { params }),
    getBySlug: (slug) => api.get(`/berita/${slug}`),
};

export const masjidApi = {
    getAll: (params) => api.get('/masjid', { params }),
    getById: (id) => api.get(`/masjid/${id}`),
};

export const galeriApi = {
    getAll: (params) => api.get('/galeri', { params }),
};

export const majelisTaklimApi = {
    getAll: (params) => api.get('/majelis-taklim', { params }),
};

export const jadwalNikahApi = {
    getAll: (params) => api.get('/jadwal-nikah', { params }),
};

export const pendaftaranApi = {
    submit: (data) => api.post('/pendaftaran-nikah', data),
    checkStatus: (kode) => api.get(`/pendaftaran-nikah/status/${kode}`),
};

export const antrianApi = {
    ambil: (layanan) => api.get('/antrian/ambil', { params: { layanan } }),
};

// ==========================================
// AUTH API
// ==========================================

export const authApi = {
    login: (credentials) => api.post('/admin/login', credentials),
    logout: () => api.post('/admin/logout'),
};

// ==========================================
// ADMIN API ENDPOINTS
// ==========================================

export const adminBeritaApi = {
    getAll: (params) => api.get('/admin/berita', { params }),
    getById: (id) => api.get(`/admin/berita/${id}`),
    create: (data) => api.post('/admin/berita', data),
    update: (id, data) => api.put(`/admin/berita/${id}`, data),
    delete: (id) => api.delete(`/admin/berita/${id}`),
};

export const adminMasjidApi = {
    getAll: (params) => api.get('/admin/masjid', { params }),
    getById: (id) => api.get(`/admin/masjid/${id}`),
    create: (data) => api.post('/admin/masjid', data),
    update: (id, data) => api.put(`/admin/masjid/${id}`, data),
    delete: (id) => api.delete(`/admin/masjid/${id}`),
};

export default api;
