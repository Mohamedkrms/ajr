import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Search, Plus, Trash2, Music, Video, Book, Play, Pause, X, ArrowRight, Filter, Tag, Download, FileSymlink } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from '@/config';
import SEO from '@/components/SEO';
import { Textarea } from "@/components/ui/textarea";

function Ulama() {
    const { scholarId } = useParams();
    const navigate = useNavigate();

    const [ulama, setUlama] = useState([]);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAddPopup, setShowAddPopup] = useState(false);

    const { user, isLoaded } = useUser();
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    const isAdmin = !!user && !!ADMIN_EMAIL && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
    const adminEmail = isAdmin ? user.primaryEmailAddress?.emailAddress : '';

    const [contentForm, setContentForm] = useState({
        type: 'audio',
        title: '',
        url: '',
        thumbnail: '',
        category: '',
        description: '',
        duration: ''
    });

    const { playTrack, togglePlay, currentAudio, isPlaying: isGlobalPlaying } = useAudio();

    // Fetch all ulama for list view, or single scholar for detail view
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (scholarId) {
                    // Detail view: fetch single scholar
                    const response = await axios.get(`${API_URL}/api/ulama/${scholarId}`);
                    setSelectedScholar(response.data);
                } else {
                    // List view: fetch all
                    const response = await axios.get(`${API_URL}/api/ulama`);
                    setUlama(response.data);
                }
            } catch (error) {
                console.error('Error fetching ulama:', error);
                if (scholarId) {
                    // Invalid scholar ID, redirect to list
                    navigate('/ulama');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [scholarId, navigate]);

    const filteredUlama = ulama.filter(u =>
        u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.description?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Build unique categories from scholar's audios
    const audioCategories = selectedScholar?.audios
        ? [...new Set(selectedScholar.audios.map(a => a.category).filter(Boolean))]
        : [];

    const handleAddContent = async (e) => {
        e.preventDefault();
        if (!selectedScholar || !isAdmin || !adminEmail) return;

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
                `${API_URL}/api/ulama/${selectedScholar.slug || selectedScholar._id}/${endpoint}`,
                payload
            );

            setSelectedScholar(response.data);
            setContentForm({ type: 'audio', title: '', url: '', thumbnail: '', category: '', description: '', duration: '' });
            setShowAddPopup(false);
        } catch (error) {
            console.error('Error adding content:', error);
            alert('خطأ في إضافة المحتوى: ' + error.response?.data?.message);
        }
    };

    const handleDeleteContent = async (contentId, type) => {
        if (!selectedScholar || !isAdmin || !adminEmail) return;
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;

        try {
            const endpoint = type === 'audio' ? 'audios' : 'videos';

            const response = await axios.delete(
                `${API_URL}/api/ulama/${selectedScholar.slug || selectedScholar._id}/${endpoint}/${contentId}?adminEmail=${adminEmail}`
            );

            setSelectedScholar(response.data);
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('خطأ في حذف المحتوى');
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
            reciter: selectedScholar?.name,
            id: audio.id
        }, selectedScholar?.audios || [], selectedScholar, index);
    };

    const openAddPopup = (type) => {
        setContentForm({ type, title: '', url: '', thumbnail: '', category: '', description: '', duration: '' });
        setShowAddPopup(true);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────
    // DETAIL VIEW — /ulama/:scholarId
    // ─────────────────────────────────────────────────────
    if (scholarId && selectedScholar) {
        const audios = selectedScholar.audios || [];
        const videos = selectedScholar.videos || [];

        // Filter audios by category
        const filteredAudios = selectedCategory
            ? audios.filter(a => a.category === selectedCategory)
            : audios;

        return (
            <div className={`min-h-screen bg-background pb-20 ${currentAudio ? 'pb-32' : ''}`}>
                <SEO
                    title={`${selectedScholar.name} - دروس ومحاضرات صوتية ومرئية استمع وحمل | فردوس`}
                    description={`استمع وحمل دروس ومحاضرات الشيخ ${selectedScholar.name}. صوتيات mp3 وفيديوهات إسلامية بجودة عالية.`}
                    keywords={`${selectedScholar.name}, دروس, محاضرات, صوتيات, mp3, فيديو, علماء, إسلام, استماع, تحميل`}
                    url={`/ulama/${selectedScholar.slug || selectedScholar._id}`}
                    schema={{
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": selectedScholar.name,
                        "description": selectedScholar.description,
                        "image": selectedScholar.image,
                        "url": `${window.location.origin}/ulama/${selectedScholar.slug || selectedScholar._id}`
                    }}
                />

                {/* Header */}
                <div className="bg-[#0f172a] text-white py-12 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                    <div className="container mx-auto max-w-4xl">
                        <Link to="/ulama" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors group">
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-[-2px] transition-transform" />
                            عودة للعلماء
                        </Link>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 shadow-xl overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                                {selectedScholar.image ? (
                                    <img src={selectedScholar.image} alt={selectedScholar.name} className="w-full h-full object-cover" />
                                ) : (
                                    <GraduationCap className="w-16 h-16 opacity-50" />
                                )}
                            </div>
                            <div className="text-center md:text-right space-y-2 flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold font-amiri">{selectedScholar.name}</h1>
                                {selectedScholar.style && (
                                    <Badge variant="secondary" className="bg-[#f97316] text-white hover:bg-[#f97316]/90 border-none px-3 py-1 text-sm font-changa">
                                        {selectedScholar.style}
                                    </Badge>
                                )}
                                <p className="text-white/60 font-changa max-w-lg">{selectedScholar.description}</p>

                                {/* Content summary badges */}
                                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                                    {audios.length > 0 && (
                                        <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/audios`} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                                            <Music className="w-3.5 h-3.5 text-[#f97316]" />
                                            <span className="text-xs font-changa">{audios.length} صوتية</span>
                                        </Link>
                                    )}
                                    {videos.length > 0 && (
                                        <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/videos`} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                                            <Video className="w-3.5 h-3.5 text-[#f97316]" />
                                            <span className="text-xs font-changa">{videos.length} فيديو</span>
                                        </Link>
                                    )}
                                    {selectedScholar.bio && (
                                        <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/bio`} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                                            <Book className="w-3.5 h-3.5 text-[#f97316]" />
                                            <span className="text-xs font-changa">السيرة</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 space-y-6" id="content-list">

                    {/* Audio Category Filter Bar */}
                    {audioCategories.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap" dir="rtl">
                            <Filter className="w-4 h-4 text-gray-400 ml-1" />
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-full text-sm font-bold font-changa transition-all duration-200 ${selectedCategory === ''
                                    ? 'bg-[#0f172a] text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#f97316] hover:text-[#f97316]'
                                    }`}
                            >
                                الكل ({audios.length})
                            </button>
                            {audioCategories.map(cat => {
                                const count = audios.filter(a => a.category === cat).length;
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

                    {/* Audios Section */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-changa text-[#0f172a]">
                                <Music className="w-5 h-5 text-[#f97316]" />
                                الصوتيات
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{filteredAudios.length}</span>
                                {selectedCategory && (
                                    <span className="bg-[#f97316]/10 text-[#f97316] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {selectedCategory}
                                    </span>
                                )}
                                {audios.length > 0 && (
                                    <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/audios`} className="text-xs text-[#f97316] hover:underline font-changa">
                                        عرض الكل
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Button
                                        onClick={() => openAddPopup('audio')}
                                        className="bg-[#f97316] hover:bg-[#ea580c]"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 ml-1" />
                                        إضافة
                                    </Button>
                                )}
                            </div>
                        </div>

                        {filteredAudios.length > 0 ? (
                            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredAudios.map((audio, idx) => {
                                    const isCurrentTrack = currentAudio?.id === audio.id;
                                    const isPlaying = isCurrentTrack && isGlobalPlaying;
                                    // Find real index in full audios array for playlist continuity
                                    const realIndex = audios.findIndex(a => a.id === audio.id);

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
                                                    to={`/ulama/${selectedScholar.slug || selectedScholar._id}/audios/${audio.id}`}
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
                                                        size="sm"
                                                        variant="ghost"
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

                    {/* Videos Section */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 font-changa text-[#0f172a]">
                                <Video className="w-5 h-5 text-[#f97316]" />
                                الفيديو
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{videos.length}</span>
                                {videos.length > 0 && (
                                    <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/videos`} className="text-xs text-[#f97316] hover:underline font-changa">
                                        عرض الكل
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Button
                                        onClick={() => openAddPopup('video')}
                                        className="bg-[#f97316] hover:bg-[#ea580c]"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4 ml-1" />
                                        إضافة
                                    </Button>
                                )}
                            </div>
                        </div>

                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {videos.slice(0, 6).map((video) => (
                                    <div key={video.id} className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all bg-gray-50 group">
                                        <div className="relative w-full bg-gray-200 h-40 flex items-center justify-center">
                                            {video.thumbnail ? (
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Video className="w-12 h-12 text-gray-400" />
                                            )}
                                            <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/videos/${video.id}`} className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                                                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                            </Link>
                                        </div>
                                        <div className="p-3 space-y-2">
                                            <h3 className="font-bold text-sm font-changa truncate">{video.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-[#f97316]/10 text-[#f97316] text-xs">{video.category}</Badge>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        to={`/ulama/${selectedScholar.slug || selectedScholar._id}/videos/${video.id}`}
                                                        className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-full transition-colors"
                                                        title="صفحة الفيديو"
                                                    >
                                                        <FileSymlink className="w-4 h-4" />
                                                    </Link>
                                                    {isAdmin && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
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
                            <div className="text-center py-8">
                                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-changa">لا توجد فيديوهات</p>
                            </div>
                        )}
                    </div>

                    {/* Bio Section */}
                    {selectedScholar.bio && (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 font-changa text-[#0f172a]">
                                    <Book className="w-5 h-5 text-[#f97316]" />
                                    السيرة الذاتية
                                </h2>
                                <Link to={`/ulama/${selectedScholar.slug || selectedScholar._id}/bio`} className="text-xs text-[#f97316] hover:underline font-changa">
                                    المزيد
                                </Link>
                            </div>
                            <p className="text-gray-700 leading-relaxed font-changa whitespace-pre-wrap line-clamp-6">{selectedScholar.bio}</p>
                        </div>
                    )}
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

                            {/* Type Tabs */}
                            <div className="flex border-b px-6">
                                <button
                                    onClick={() => setContentForm({ ...contentForm, type: 'audio' })}
                                    className={`flex-1 py-3 text-sm font-bold font-changa border-b-2 transition-colors ${contentForm.type === 'audio'
                                        ? 'border-[#f97316] text-[#f97316]'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Music className="w-4 h-4 inline ml-1" />
                                    صوتية
                                </button>
                                <button
                                    onClick={() => setContentForm({ ...contentForm, type: 'video' })}
                                    className={`flex-1 py-3 text-sm font-bold font-changa border-b-2 transition-colors ${contentForm.type === 'video'
                                        ? 'border-[#f97316] text-[#f97316]'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Video className="w-4 h-4 inline ml-1" />
                                    فيديو
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

    // ─────────────────────────────────────────────────────
    // LIST VIEW — /ulama
    // ─────────────────────────────────────────────────────
    return (
        <div className={`min-h-screen bg-background pb-20 ${currentAudio ? 'pb-32' : ''}`}>
            <SEO
                title="دروس العلماء والمحاضرات الإسلامية - صوتيات mp3 وفيديو | فِردَوس"
                description="استمع وحمل دروس ومحاضرات نخبة من العلماء والدعاة. صوتيات mp3 وفيديوهات إسلامية بجودة عالية مع إمكانية التحميل المباشر."
                keywords="علماء, دروس إسلامية, محاضرات, صوتيات, mp3, فيديو, فقه, عقيدة, تفسير, حديث, استماع, تحميل, فِردَوس"
                url="/ulama"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "دروس العلماء والمحاضرات الإسلامية",
                    "description": "استمع لدروس ومحاضرات نخبة من العلماء والدعاة",
                    "url": `${window.location.origin}/ulama`
                }}
            />

            {/* Header */}
            <div className="bg-[#0f172a] text-white py-12 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto text-center max-w-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur border border-white/10 text-[#f97316]">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-amiri font-bold mb-3">دروس العلماء</h1>
                    <p className="opacity-80 leading-relaxed font-changa">
                        استمع لدروس ومحاضرات نخبة من العلماء والدعاة
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Search & Admin */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 font-changa">
                            <GraduationCap className="w-5 h-5 text-[#f97316]" />
                            اختر العالم
                        </h2>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {isLoaded && isAdmin && (
                                <Link to="/admin/ulama">
                                    <Button className="bg-[#f97316] hover:bg-[#ea580c] font-changa" size="sm">
                                        <Plus className="w-4 h-4 ml-1" />
                                        عالم جديد
                                    </Button>
                                </Link>
                            )}
                            <div className="relative flex-1 md:w-64">
                                <Input
                                    placeholder="بحث عن عالم..."
                                    className="pl-10 text-right font-changa w-full"
                                    value={searchFilter}
                                    onChange={e => setSearchFilter(e.target.value)}
                                />
                                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Scholars Grid */}
                    {filteredUlama.length > 0 ? (
                        <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 text-center">
                            {filteredUlama.map((scholar) => (
                                <Link
                                    key={scholar._id}
                                    to={`/ulama/${scholar.slug || scholar._id}`}
                                    className="group cursor-pointer p-4 rounded-xl transition-all duration-200 block hover:bg-gray-50"
                                >
                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#f97316] transition-all mb-3 shadow-sm bg-gray-100 flex items-center justify-center">
                                        {scholar.image ? (
                                            <img
                                                src={scholar.image}
                                                alt={scholar.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <GraduationCap className="w-8 h-8 text-gray-400 group-hover:text-[#f97316]" />
                                        )}
                                    </div>
                                    <p className="text-xs font-bold truncate transition-colors font-changa group-hover:text-[#f97316]">
                                        {scholar.name}
                                    </p>
                                    {scholar.style && (
                                        <span className="text-[10px] mt-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-changa">
                                            {scholar.style}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-changa">لا توجد نتائج</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ulama;
