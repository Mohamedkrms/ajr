import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Music, Video, Book, Play, Pause, Trash2, Plus, Filter, Tag, X, GraduationCap, Share2, Download, FileSymlink } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from '@/config';
import SEO from '@/components/SEO';
import { Textarea } from "@/components/ui/textarea";

const TYPE_CONFIG = {
    audios: { label: 'الصوتيات', icon: Music, singular: 'صوتية' },
    videos: { label: 'الفيديو', icon: Video, singular: 'فيديو' },
    bio: { label: 'السيرة الذاتية', icon: Book, singular: 'السيرة' },
};

function UlamaContent() {
    const { scholarId, type } = useParams();
    const navigate = useNavigate();

    const [scholar, setScholar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAddPopup, setShowAddPopup] = useState(false);

    const { user } = useUser();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const isAdmin = !!user && !!ADMIN_EMAIL && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
    const adminEmail = isAdmin ? user.primaryEmailAddress?.emailAddress : '';

    const { playTrack, togglePlay, currentAudio, isPlaying: isGlobalPlaying } = useAudio();

    const [contentForm, setContentForm] = useState({
        type: type === 'videos' ? 'video' : 'audio',
        title: '',
        url: '',
        thumbnail: '',
        category: '',
        description: '',
        duration: ''
    });

    const config = TYPE_CONFIG[type];

    useEffect(() => {
        const fetchScholar = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/ulama/${scholarId}`);
                setScholar(response.data);
            } catch (error) {
                console.error('Error fetching scholar:', error);
                navigate('/ulama');
            } finally {
                setLoading(false);
            }
        };
        fetchScholar();
    }, [scholarId, navigate]);

    // Redirect if invalid type
    useEffect(() => {
        if (!config) {
            navigate(`/ulama/${scholarId}`);
        }
    }, [type, config, scholarId, navigate]);

    const handleDeleteContent = async (contentId, contentType) => {
        if (!scholar || !isAdmin || !adminEmail) return;
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;

        try {
            const endpoint = contentType === 'audio' ? 'audios' : 'videos';

            const response = await axios.delete(
                `${API_URL}/api/ulama/${scholar._id}/${endpoint}/${contentId}?adminEmail=${adminEmail}`
            );
            setScholar(response.data);
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('خطأ في حذف المحتوى');
        }
    };

    const handleAddContent = async (e) => {
        e.preventDefault();
        if (!scholar || !isAdmin || !adminEmail) return;

        try {
            const endpoint = contentForm.type === 'audio' ? 'audios' : 'videos';

            const payload = {
                adminEmail,
                title: contentForm.title,
                category: contentForm.category,
                ...(contentForm.description && { description: contentForm.description }),
                url: contentForm.url,
                duration: contentForm.duration ? parseInt(contentForm.duration) : 0,
            };

            if (contentForm.type === 'video' && contentForm.thumbnail) {
                payload.thumbnail = contentForm.thumbnail;
            }

            const response = await axios.post(
                `${API_URL}/api/ulama/${scholar._id}/${endpoint}`,
                payload
            );

            setScholar(response.data);
            setContentForm({ type: type === 'videos' ? 'video' : 'audio', title: '', url: '', thumbnail: '', category: '', description: '', duration: '' });
            setShowAddPopup(false);
        } catch (error) {
            console.error('Error adding content:', error);
            alert('خطأ في إضافة المحتوى: ' + error.response?.data?.message);
        }
    };

    const handlePlayAudio = (audio, index) => {
        const isCurrentTrack = currentAudio?.id === audio.id;
        if (isCurrentTrack) {
            togglePlay();
            return;
        }

        playTrack({
            url: audio.url,
            title: audio.title,
            reciter: scholar?.name,
            id: audio.id
        }, scholar?.audios || [], scholar, index);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("تم نسخ الرابط بنجاح!");
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (loading || !scholar || !config) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    const IconComponent = config.icon;
    const items = type === 'bio' ? (scholar.bio ? [scholar.bio] : []) : (scholar[type] || []);

    // Build categories for filtering
    const categories = type !== 'bio'
        ? [...new Set(items.map(item => item.category).filter(Boolean))]
        : [];

    const filteredItems = selectedCategory
        ? items.filter(item => item.category === selectedCategory)
        : items;

    // Available content types for navigation (excluding current)
    const otherTypes = Object.keys(TYPE_CONFIG).filter(t => {
        if (t === type) return false;
        if (t === 'bio') return !!scholar.bio;
        return (scholar[t] || []).length > 0;
    });

    return (
        <div className={`min-h-screen bg-background pb-24`} dir="rtl">
            <SEO
                title={type === 'audios'
                    ? `${config.label} - ${scholar.name} mp3 استمع وحمل | فِردوس`
                    : type === 'videos'
                        ? `${config.label} - ${scholar.name} شاهد الآن | فِردَوس`
                        : `السيرة الذاتية - ${scholar.name} | فِردَوس`}
                description={type === 'audios'
                    ? `استمع وحمل جميع صوتيات الشيخ ${scholar.name} بجودة عالية mp3. دروس ومحاضرات إسلامية.`
                    : type === 'videos'
                        ? `شاهد جميع فيديوهات الشيخ ${scholar.name}. دروس ومحاضرات إسلامية مرئية.`
                        : `السيرة الذاتية للشيخ ${scholar.name}. ${scholar.description || ''}`}
                keywords={`${scholar.name}, ${config.label}, دروس, محاضرات, ${type === 'audios' ? 'صوتيات, mp3, استماع, تحميل' : type === 'videos' ? 'فيديو, مشاهدة' : 'سيرة ذاتية'}, إسلام`}
                url={`/ulama/${scholar.slug || scholarId}/${type}`}
                schema={{
                    "@context": "https://schema.org",
                    "@type": type === 'audios' ? "MusicPlaylist" : type === 'videos' ? "VideoGallery" : "AboutPage",
                    "name": `${config.label} - ${scholar.name}`,
                    "description": scholar.description,
                    "url": `${window.location.origin}/ulama/${scholar.slug || scholarId}/${type}`
                }}
            />

            {/* Header */}
            <div className="relative overflow-hidden bg-[#0f172a] text-white py-16 flex items-center min-h-[300px]">
                {scholar.image && (
                    <>
                        <img
                            src={scholar.image}
                            alt={scholar.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/60" />
                    </>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <button
                        onClick={() => navigate(`/ulama/${scholar.slug || scholarId}`)}
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors text-sm font-changa group"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                        العودة لصفحة {scholar.name}
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-8 justify-center max-w-4xl mx-auto">
                        {/* Scholar Avatar */}
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden shrink-0 relative bg-black">
                            {scholar.image ? (
                                <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                                    <GraduationCap className="w-16 h-16 opacity-50" />
                                </div>
                            )}
                        </div>

                        {/* Info & Controls */}
                        <div className="text-center md:text-right space-y-6 flex-1">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold font-amiri mb-3 text-[#f97316]">
                                    {config.label}
                                </h1>
                                <p className="text-xl md:text-2xl font-changa text-gray-200 flex items-center justify-center md:justify-start gap-3">
                                    <IconComponent className="w-6 h-6 text-white/50" />
                                    {scholar.name}
                                </p>
                                {type !== 'bio' && (
                                    <p className="text-sm text-white/40 font-changa mt-2">
                                        {items.length} {config.singular}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <button
                                    onClick={handleShare}
                                    className="h-12 w-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                                    title="مشاركة"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>

                                {/* Admin add button */}
                                {isAdmin && type !== 'bio' && (
                                    <button
                                        onClick={() => {
                                            setContentForm({ type: type === 'videos' ? 'video' : 'audio', title: '', url: '', thumbnail: '', category: '', description: '', duration: '' });
                                            setShowAddPopup(true);
                                        }}
                                        className="h-12 px-4 flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full transition-colors text-sm font-changa"
                                    >
                                        <Plus className="w-4 h-4" />
                                        إضافة {type === 'videos' ? 'فيديو' : 'صوتية'}
                                    </button>
                                )}

                                {/* Other content type navigation */}
                                {otherTypes.map(t => {
                                    const tc = TYPE_CONFIG[t];
                                    const TIcon = tc.icon;
                                    return (
                                        <Link
                                            key={t}
                                            to={`/ulama/${scholar.slug || scholarId}/${t}`}
                                            className="h-12 px-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm text-sm font-changa"
                                        >
                                            <TIcon className="w-4 h-4" />
                                            {tc.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">

                {/* Category Filter */}
                {categories.length > 1 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-gray-400 ml-1" />
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-full text-sm font-bold font-changa transition-all duration-200 ${selectedCategory === ''
                                ? 'bg-[#0f172a] text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#f97316] hover:text-[#f97316]'
                                }`}
                        >
                            الكل ({items.length})
                        </button>
                        {categories.map(cat => {
                            const count = items.filter(item => item.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold font-changa transition-all duration-200 ${selectedCategory === cat
                                        ? 'bg-[#f97316] text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#f97316] hover:text-[#f97316]'
                                        }`}
                                >
                                    {cat} ({count})
                                </button>
                            );
                        })}
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory('')}
                                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="إزالة الفلتر"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Bio Content */}
                {type === 'bio' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {scholar.bio ? (
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed font-changa whitespace-pre-wrap text-lg">{scholar.bio}</p>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-changa">لا توجد سيرة ذاتية</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Audios Content */}
                {type === 'audios' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-changa text-[#0f172a]">
                                <Music className="w-5 h-5 text-[#f97316]" />
                                {config.label}
                            </h2>
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{filteredItems.length}</span>
                            {selectedCategory && (
                                <span className="bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {selectedCategory}
                                </span>
                            )}
                        </div>

                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredItems.map((audio, idx) => {
                                    const isCurrentTrack = currentAudio?.id === audio.id;
                                    const isPlaying = isCurrentTrack && isGlobalPlaying;
                                    const realIndex = (scholar.audios || []).findIndex(a => a.id === audio.id);

                                    return (
                                        <div
                                            key={audio.id}
                                            onClick={() => handlePlayAudio(audio, realIndex)}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md font-changa
                                                ${isCurrentTrack
                                                    ? 'bg-[#f97316]/5 border-[#f97316] ring-1 ring-[#f97316]'
                                                    : 'bg-white hover:border-[#f97316]/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-10 h-10 rounded-lg flex shrink-0 items-center justify-center font-bold text-sm transition-colors
                                                    ${isCurrentTrack ? 'bg-[#f97316] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="truncate">
                                                    <p className={`font-bold text-sm truncate ${isCurrentTrack ? 'text-[#f97316]' : 'text-slate-800'}`}>
                                                        {audio.title}
                                                    </p>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[9px] font-bold bg-[#f97316]/10 text-[#f97316] px-1.5 py-0.5 rounded uppercase tracking-wide">mp3</span>
                                                        {audio.category && <p className="text-xs text-muted-foreground">{audio.category}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isPlaying && (
                                                    <div className="flex gap-0.5 h-3 items-end">
                                                        <span className="w-0.5 h-full bg-[#f97316] animate-[bounce_1s_infinite]" />
                                                        <span className="w-0.5 h-2/3 bg-[#f97316] animate-[bounce_1.2s_infinite]" />
                                                        <span className="w-0.5 h-full bg-[#f97316] animate-[bounce_0.8s_infinite]" />
                                                    </div>
                                                )}
                                                {audio.url && (
                                                    <a
                                                        href={audio.url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-full transition-colors"
                                                        title="تحميل الصوتية"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <Link
                                                    to={`/ulama/${scholar.slug || scholarId}/audios/${audio.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-full transition-colors"
                                                    title="صفحة الصوتية"
                                                >
                                                    <FileSymlink className="w-4 h-4" />
                                                </Link>
                                                <Button
                                                    size="icon" variant={isCurrentTrack ? "default" : "ghost"}
                                                    className={`h-8 w-8 rounded-full ${isCurrentTrack ? 'bg-[#f97316] hover:bg-[#ea580c]' : 'hover:bg-[#f97316]/10 hover:text-[#f97316]'}`}
                                                    onClick={(e) => { e.stopPropagation(); handlePlayAudio(audio, realIndex); }}
                                                >
                                                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                                </Button>
                                                {isAdmin && (
                                                    <Button
                                                        size="sm" variant="ghost"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteContent(audio.id, 'audio'); }}
                                                        className="hover:bg-red-100 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold font-changa text-gray-600 mb-1">
                                    {selectedCategory ? `لا توجد نتائج في "${selectedCategory}"` : 'لا توجد صوتيات'}
                                </h3>
                                {selectedCategory && (
                                    <button onClick={() => setSelectedCategory('')} className="mt-2 text-[#f97316] text-sm font-bold hover:underline font-changa">
                                        عرض الكل
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Videos Content */}
                {type === 'videos' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-changa text-[#0f172a]">
                                <Video className="w-5 h-5 text-[#f97316]" />
                                {config.label}
                            </h2>
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{filteredItems.length}</span>
                        </div>

                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.map((video) => (
                                    <div key={video.id} className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all bg-gray-50 group">
                                        <div className="relative w-full bg-gray-200 h-48 flex items-center justify-center">
                                            {video.thumbnail ? (
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Video className="w-12 h-12 text-gray-400" />
                                            )}
                                            <Link to={`/ulama/${scholar.slug || scholarId}/videos/${video.id}`} className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                                                <Play className="w-14 h-14 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                            </Link>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3 className="font-bold text-sm font-changa">{video.title}</h3>
                                            {video.description && (
                                                <p className="text-xs text-gray-600 font-changa line-clamp-2">{video.description}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs">{video.category}</Badge>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        to={`/ulama/${scholar.slug || scholarId}/videos/${video.id}`}
                                                        className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-full transition-colors"
                                                        title="صفحة الفيديو"
                                                    >
                                                        <FileSymlink className="w-4 h-4" />
                                                    </Link>
                                                    {isAdmin && (
                                                        <Button
                                                            size="sm" variant="ghost"
                                                            onClick={() => handleDeleteContent(video.id, 'video')}
                                                            className="hover:bg-red-100 h-8 w-8 p-0"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-red-600" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-changa">لا توجد فيديوهات</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation: back to scholar */}
                <div className="flex items-center justify-center">
                    <Link
                        to={`/ulama/${scholar.slug || scholarId}`}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-[#f97316] hover:shadow-md transition-all group inline-flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#f97316]/10 flex items-center justify-center group-hover:bg-[#f97316] transition-colors">
                            <ArrowRight className="w-5 h-5 text-[#f97316] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-changa">العودة إلى</p>
                            <p className="font-bold font-amiri text-[#0f172a] group-hover:text-[#f97316] transition-colors">
                                {scholar.name}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Add Content Popup Modal */}
            {showAddPopup && isAdmin && adminEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAddPopup(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                            <h3 className="text-lg font-bold font-changa flex items-center gap-2">
                                {contentForm.type === 'audio' ? <Music className="w-5 h-5 text-[#f97316]" /> : <Video className="w-5 h-5 text-[#f97316]" />}
                                {contentForm.type === 'audio' ? 'إضافة صوتية' : 'إضافة فيديو'}
                            </h3>
                            <button onClick={() => setShowAddPopup(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddContent} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">العنوان *</label>
                                <Input
                                    placeholder="عنوان المحتوى"
                                    value={contentForm.title}
                                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                    required
                                    className="font-changa"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">رابط الملف *</label>
                                <Input
                                    placeholder={contentForm.type === 'audio' ? 'رابط الملف الصوتي (mp3)' : 'رابط الفيديو (YouTube أو mp4)'}
                                    value={contentForm.url}
                                    onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
                                    required
                                    className="font-changa"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">الفئة/الموضوع</label>
                                <Input
                                    placeholder="مثال: فقه، عقيدة، تفسير"
                                    value={contentForm.category}
                                    onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })}
                                    className="font-changa"
                                    dir="rtl"
                                />
                            </div>
                            {contentForm.type === 'video' && (
                                <div>
                                    <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">رابط الصورة المصغرة</label>
                                    <Input
                                        placeholder="رابط صورة الغلاف"
                                        value={contentForm.thumbnail}
                                        onChange={(e) => setContentForm({ ...contentForm, thumbnail: e.target.value })}
                                        className="font-changa"
                                        dir="ltr"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">المدة بالثواني</label>
                                <Input
                                    placeholder="مثال: 3600"
                                    type="number"
                                    value={contentForm.duration}
                                    onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                                    className="font-changa"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold font-changa text-gray-700 mb-1 block">الوصف</label>
                                <Textarea
                                    placeholder="وصف مختصر عن المحتوى"
                                    value={contentForm.description}
                                    onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                                    className="font-changa h-24"
                                    dir="rtl"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" className="flex-1 bg-[#f97316] hover:bg-[#ea580c] font-changa">
                                    <Plus className="w-4 h-4 ml-1" />
                                    حفظ
                                </Button>
                                <Button type="button" onClick={() => setShowAddPopup(false)} variant="outline" className="font-changa">
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UlamaContent;
