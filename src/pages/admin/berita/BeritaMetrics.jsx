import { useState, useEffect, useCallback } from 'react';
import {
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import api from '../../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  // VITE_API_URL is http://localhost:8000/api, we need http://localhost:8000 for storage
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
  return `${baseUrl}/storage/${imagePath}`;
};

export default function BeritaMetrics() {
  const [overview, setOverview] = useState(null);
  const [topArticles, setTopArticles] = useState([]);
  const [trends, setTrends] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('views');
  const [commentStatus, setCommentStatus] = useState('pending');
  const [commentsPagination, setCommentsPagination] = useState({ current_page: 1, last_page: 1 });
  const [trendPeriod, setTrendPeriod] = useState('30');

  const fetchOverview = useCallback(async () => {
    try {
      const response = await api.get('/admin/berita-metrics/overview');
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  }, []);

  const fetchTopArticles = useCallback(async () => {
    try {
      const response = await api.get(`/admin/berita-metrics/top-articles?sort_by=${sortBy}&limit=10`);
      setTopArticles(response.data);
    } catch (error) {
      console.error('Error fetching top articles:', error);
    }
  }, [sortBy]);

  const fetchTrends = useCallback(async () => {
    try {
      const response = await api.get(`/admin/berita-metrics/trends?period=${trendPeriod}`);
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  }, [trendPeriod]);

  const fetchComments = useCallback(async (page = 1) => {
    try {
      const response = await api.get(`/admin/berita-metrics/comments?status=${commentStatus}&page=${page}`);
      setComments(response.data.data);
      setCommentsPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [commentStatus]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOverview(), fetchTopArticles(), fetchTrends(), fetchComments()]);
      setLoading(false);
    };
    loadData();
  }, [fetchOverview, fetchTopArticles, fetchTrends, fetchComments]);

  useEffect(() => {
    fetchTopArticles();
  }, [sortBy, fetchTopArticles]);

  useEffect(() => {
    fetchTrends();
  }, [trendPeriod, fetchTrends]);

  useEffect(() => {
    fetchComments();
  }, [commentStatus, fetchComments]);

  const handleApproveComment = async (id) => {
    try {
      await api.put(`/admin/berita-metrics/comments/${id}/approve`);
      fetchComments(commentsPagination.current_page);
      fetchOverview();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleMarkSpam = async (id) => {
    try {
      await api.put(`/admin/berita-metrics/comments/${id}/spam`);
      fetchComments(commentsPagination.current_page);
      fetchOverview();
    } catch (error) {
      console.error('Error marking spam:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return;
    try {
      await api.delete(`/admin/berita-metrics/comments/${id}`);
      fetchComments(commentsPagination.current_page);
      fetchOverview();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Chart data
  const likesChartData = {
    labels: trends?.likes_trend?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Likes',
        data: trends?.likes_trend?.map(item => item.count) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const commentsChartData = {
    labels: trends?.comments_trend?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Komentar',
        data: trends?.comments_trend?.map(item => item.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: trends?.category_distribution?.map(item => item.kategori) || [],
    datasets: [
      {
        data: trends?.category_distribution?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Metrics & Laporan Berita</h1>
        <p className="text-gray-600 mt-1">Pantau performa artikel dan kelola komentar</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'articles', label: 'Top Artikel' },
            { id: 'trends', label: 'Tren' },
            { id: 'comments', label: 'Komentar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.id === 'comments' && overview?.comments?.pending > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  {overview.comments.pending}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Artikel"
              value={overview.articles.total}
              subtext={`${overview.articles.published} dipublikasi`}
              icon={DocumentTextIcon}
              color="blue"
              trend={overview.articles.this_month > overview.articles.last_month ? 'up' : 'down'}
              trendValue={`${overview.articles.this_month} bulan ini`}
            />
            <StatCard
              title="Total Views"
              value={overview.views.total.toLocaleString()}
              subtext={`${overview.views.this_month.toLocaleString()} bulan ini`}
              icon={EyeIcon}
              color="green"
            />
            <StatCard
              title="Total Likes"
              value={overview.likes.total.toLocaleString()}
              subtext={`${overview.likes.this_month.toLocaleString()} bulan ini`}
              icon={HeartIcon}
              color="red"
            />
            <StatCard
              title="Total Komentar"
              value={overview.comments.total}
              subtext={
                <span className="flex items-center gap-2">
                  {overview.comments.pending > 0 && (
                    <span className="text-amber-600">{overview.comments.pending} pending</span>
                  )}
                  {overview.comments.spam > 0 && (
                    <span className="text-red-600">{overview.comments.spam} spam</span>
                  )}
                </span>
              }
              icon={ChatBubbleLeftRightIcon}
              color="purple"
            />
          </div>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Likes (30 Hari Terakhir)</h3>
              <div className="h-64">
                <Line data={likesChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Distribusi Kategori</h3>
              <div className="h-64">
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Articles Tab */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Artikel Terpopuler</h3>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="views">Views</option>
                <option value="likes">Likes</option>
                <option value="comments">Komentar</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topArticles.map((article, index) => (
              <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                  {index + 1}
                </div>
                {article.gambar && (
                  <img
                    src={getImageUrl(article.gambar)}
                    alt=""
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{article.judul}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{article.kategori}</span>
                    <span>{article.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <EyeIcon className="w-4 h-4" />
                    {article.view_count.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-red-500">
                    <HeartIcon className="w-4 h-4" />
                    {article.likes_count}
                  </div>
                  <div className="flex items-center gap-1 text-blue-500">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {article.comments_count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <select
              value={trendPeriod}
              onChange={(e) => setTrendPeriod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="7">7 Hari Terakhir</option>
              <option value="30">30 Hari Terakhir</option>
              <option value="90">90 Hari Terakhir</option>
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Tren Likes</h3>
              <div className="h-64">
                <Line data={likesChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Tren Komentar</h3>
              <div className="h-64">
                <Line data={commentsChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Distribusi Kategori</h3>
            <div className="h-80 max-w-lg mx-auto">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Moderasi Komentar</h3>
            <div className="flex items-center gap-2">
              <select
                value={commentStatus}
                onChange={(e) => setCommentStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="pending">Menunggu ({overview?.comments?.pending || 0})</option>
                <option value="approved">Disetujui</option>
                <option value="spam">Spam ({overview?.comments?.spam || 0})</option>
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Tidak ada komentar {commentStatus === 'pending' ? 'yang menunggu' : commentStatus === 'spam' ? 'spam' : ''}
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                      {comment.nama?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{comment.nama}</span>
                        {comment.email && (
                          <span className="text-sm text-gray-500">({comment.email})</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{comment.komentar}</p>
                      <div className="flex items-center gap-3 text-sm">
                        {comment.berita && (
                          <span className="text-green-600">
                            Pada: {comment.berita.judul}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {commentStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproveComment(comment.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Setujui"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                      {commentStatus !== 'spam' && (
                        <button
                          onClick={() => handleMarkSpam(comment.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Tandai Spam"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
          {commentsPagination.last_page > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <button
                onClick={() => fetchComments(commentsPagination.current_page - 1)}
                disabled={commentsPagination.current_page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Halaman {commentsPagination.current_page} dari {commentsPagination.last_page}
              </span>
              <button
                onClick={() => fetchComments(commentsPagination.current_page + 1)}
                disabled={commentsPagination.current_page === commentsPagination.last_page}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtext, icon: Icon, color, trend, trendValue }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
    </div>
  );
}
