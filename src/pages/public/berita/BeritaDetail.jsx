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
import api, { beritaApi } from '../../../services/api';
import { formatDate } from '../../../utils/date';

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
            const response = await beritaApi.getBySlug(slug);
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
                                {formatDate(berita.published_at || berita.created_at || berita.date || berita.updated_at, true)}
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
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 break-words">{berita.judul}</h1>

                        {/* Summary */}
                        {berita.ringkasan && (
                            <p className="text-lg text-gray-600 italic border-l-4 border-kemenag-green pl-4 mb-8 break-words">
                                {berita.ringkasan}
                            </p>
                        )}

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-kemenag-green prose-img:rounded-xl prose-img:shadow-md prose-img:w-full prose-img:h-auto break-words overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: berita.isi }}
                        />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-12 pt-8 border-t gap-6">
                            <div className="flex items-center gap-4">
                                {/* Like Button */}
                                <button 
                                    onClick={handleLike} 
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all active:scale-95 shadow-sm border ${
                                        hasLiked 
                                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-500'
                                    }`}
                                >
                                    {hasLiked ? <HeartIconSolid className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
                                    <span className="font-medium">{likeCount} Suka</span>
                                </button>

                                {/* Comment Count */}
                                <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-full border border-gray-200 cursor-default">
                                    <ChatBubbleLeftIcon className="w-6 h-6" />
                                    <span className="font-medium">{comments.length} Komentar</span>
                                </div>
                            </div>

                            {/* Share Button */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-kemenag-green text-white rounded-full hover:bg-kemenag-green-dark transition-colors shadow-lg shadow-green-900/20 active:scale-95"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                    <span>Bagikan Artikel</span>
                                </button>
                                
                                {showShareMenu && (
                                    <div className="absolute right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-10 min-w-[200px] animate-fade-in-up">
                                        <div className="text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wider">Bagikan ke</div>
                                        <button onClick={shareToWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-left text-gray-700 transition-colors">
                                            <span className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white shrink-0">
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                            </span>
                                            WhatsApp
                                        </button>
                                        <button onClick={shareToFacebook} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-left text-gray-700 transition-colors">
                                            <span className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center text-white shrink-0">
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                            </span>
                                            Facebook
                                        </button>
                                        <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-left text-gray-700 transition-colors">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${copied ? 'bg-green-500' : 'bg-gray-700'}`}>
                                                {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                                            </span>
                                            {copied ? 'Tersalin!' : 'Salin Link'}
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
                            comments.filter(c => c && c.nama).map((comment) => (
                                <div key={comment.id} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-kemenag-green/10 rounded-full flex items-center justify-center text-kemenag-green font-bold">
                                            {comment.nama?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{comment.nama || 'Anonim'}</p>
                                            <p className="text-xs text-gray-500">
                                                {comment.created_at ? new Date(comment.created_at).toLocaleDateString('id-ID', { 
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                }) : '-'}
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
