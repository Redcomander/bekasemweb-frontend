import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    HeartIcon, 
    ShareIcon, 
    ChatBubbleLeftIcon,
    EyeIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    ArrowLeftIcon,
    ClipboardIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import api from '../../../services/api';

// Storage URL for images
const STORAGE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STORAGE_URL}/storage/${path}`;
};

export default function BeritaDetail() {
    const { slug } = useParams();
    const [berita, setBerita] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Comment form
    const [commentForm, setCommentForm] = useState({ nama: '', email: '', komentar: '', website: '' });
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentMessage, setCommentMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchBerita();
    }, [slug]);

    const fetchBerita = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/berita/${slug}`);
            setBerita(response.data);
            setHasLiked(response.data.has_liked);
            setLikeCount(response.data.like_count);
            
            // Fetch comments
            const commentsRes = await api.get(`/berita/${response.data.id}/comments`);
            setComments(commentsRes.data || []);
        } catch (error) {
            console.error('Error fetching berita:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await api.post(`/berita/${slug}/like`);
            setHasLiked(response.data.liked);
            setLikeCount(response.data.like_count);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentForm.nama.trim() || !commentForm.komentar.trim()) return;

        setSubmittingComment(true);
        setCommentMessage({ type: '', text: '' });

        try {
            const response = await api.post(`/berita/${berita.id}/comments`, commentForm);
            setComments([response.data, ...comments]);
            setCommentForm({ nama: '', email: '', komentar: '', website: '' });
            setCommentMessage({ type: 'success', text: 'Komentar berhasil ditambahkan!' });
        } catch (error) {
            setCommentMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Gagal mengirim komentar. Coba lagi nanti.' 
            });
        } finally {
            setSubmittingComment(false);
        }
    };

    const shareToWhatsApp = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(berita.judul);
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(berita.judul);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-kemenag-green border-t-transparent"></div>
            </div>
        );
    }

    if (!berita) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Berita tidak ditemukan</h1>
                    <Link to="/berita" className="text-kemenag-green hover:underline">Kembali ke daftar berita</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Image */}
            {berita.gambar && (
                <div className="w-full h-[400px] relative">
                    <img 
                        src={getImageUrl(berita.gambar)} 
                        alt={berita.judul} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link to="/berita" className="inline-flex items-center gap-2 text-gray-600 hover:text-kemenag-green mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Kembali
                </Link>

                {/* Article Content */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            {berita.kategori && (
                                <span className="inline-flex items-center gap-1 bg-kemenag-green/10 text-kemenag-green px-3 py-1 rounded-full capitalize">
                                    <TagIcon className="w-4 h-4" />
                                    {berita.kategori}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(berita.published_at).toLocaleDateString('id-ID', { 
                                    day: 'numeric', month: 'long', year: 'numeric' 
                                })}
                            </span>
                            {berita.author && (
                                <span className="inline-flex items-center gap-1">
                                    <UserIcon className="w-4 h-4" />
                                    {berita.author}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                {berita.views} views
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{berita.judul}</h1>

                        {/* Summary */}
                        {berita.ringkasan && (
                            <p className="text-lg text-gray-600 italic border-l-4 border-kemenag-green pl-4 mb-8">
                                {berita.ringkasan}
                            </p>
                        )}

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-kemenag-green"
                            dangerouslySetInnerHTML={{ __html: berita.isi }}
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t">
                            <div className="flex items-center gap-4">
                                {/* Like Button */}
                                <button 
                                    onClick={handleLike} 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                                        hasLiked 
                                            ? 'bg-red-50 text-red-500' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                    }`}
                                >
                                    {hasLiked ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                                    <span>{likeCount}</span>
                                </button>

                                {/* Comment Count */}
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
                                    <ChatBubbleLeftIcon className="w-5 h-5" />
                                    <span>{comments.length}</span>
                                </span>
                            </div>

                            {/* Share Button */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-kemenag-green text-white rounded-full hover:bg-kemenag-green-dark"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                    Bagikan
                                </button>
                                
                                {showShareMenu && (
                                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl p-2 z-10 min-w-[180px]">
                                        <button onClick={shareToWhatsApp} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-left">
                                            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">WA</span>
                                            WhatsApp
                                        </button>
                                        <button onClick={shareToFacebook} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-left">
                                            <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">FB</span>
                                            Facebook
                                        </button>
                                        <button onClick={shareToTwitter} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-left">
                                            <span className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs">X</span>
                                            Twitter
                                        </button>
                                        <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-left">
                                            {copied ? <CheckIcon className="w-8 h-8 text-green-500" /> : <ClipboardIcon className="w-8 h-8 text-gray-400" />}
                                            {copied ? 'Tersalin!' : 'Copy Link'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Komentar ({comments.length})</h2>

                    {/* Comment Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Tulis Komentar</h3>
                        
                        {commentMessage.text && (
                            <div className={`p-3 rounded-lg mb-4 ${
                                commentMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                                {commentMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            {/* Honeypot - hidden field */}
                            <input 
                                type="text" 
                                name="website" 
                                value={commentForm.website}
                                onChange={(e) => setCommentForm({ ...commentForm, website: e.target.value })}
                                className="hidden"
                                tabIndex={-1}
                                autoComplete="off"
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                                    <input 
                                        type="text"
                                        value={commentForm.nama}
                                        onChange={(e) => setCommentForm({ ...commentForm, nama: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kemenag-green/20 focus:border-kemenag-green outline-none"
                                        placeholder="Nama Anda"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (opsional)</label>
                                    <input 
                                        type="email"
                                        value={commentForm.email}
                                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kemenag-green/20 focus:border-kemenag-green outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Komentar *</label>
                                <textarea 
                                    value={commentForm.komentar}
                                    onChange={(e) => setCommentForm({ ...commentForm, komentar: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kemenag-green/20 focus:border-kemenag-green outline-none resize-none"
                                    placeholder="Tulis komentar Anda..."
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submittingComment}
                                className="px-6 py-2 bg-kemenag-green text-white rounded-lg hover:bg-kemenag-green-dark disabled:opacity-50"
                            >
                                {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                            </button>
                        </form>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500">
                                Belum ada komentar. Jadilah yang pertama!
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-kemenag-green/10 rounded-full flex items-center justify-center text-kemenag-green font-bold">
                                            {comment.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{comment.nama}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString('id-ID', { 
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{comment.komentar}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
