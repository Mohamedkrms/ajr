import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { Tv, Radio, Plus, Trash2, PlayCircle, Loader2, Sparkles, Play, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const TV_STATIONS = [
    { _id: 'static-tv-1', title: 'قناة القرآن الكريم (السعودية - مكة)', url: 'https://youtu.be/_pJTDb92ShQ', type: 'tv' },
    { _id: 'static-tv-2', title: 'قناة السنة النبوية (السعودية - المدينة)', url: 'https://www.youtube.com/watch?v=gT1Ea-a4rV4', type: 'tv' },
    { _id: 'static-tv-3', title: 'قناة القرآن الكريم (الجزائر)', url: 'https://www.youtube.com/watch?v=l_tQz4HqgVw', type: 'tv' },
];

const RADIO_STATIONS = [
    { _id: 'static-radio-1', title: 'إذاعة القرآن الكريم (السعودية)', url: 'https://backup.qurango.net/radio/sunna', type: 'radio' },
    { _id: 'static-radio-2', title: 'إذاعة القرآن الكريم (الجزائر)', url: 'https://webradio.tda.dz/Coran_64K.mp3', type: 'radio' },
    { _id: 'static-radio-3', title: 'إذاعة الزيتونة للقرآن (تونس)', url: 'https://stream6.tanitweb.com/zaytouna', type: 'radio' },
    { _id: 'static-radio-4', title: 'اذاعة قران الكريم ', url: 'https://qurango.net/radio/tarateel', type: 'radio' },
];

function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
        ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
        : url;
}

export default function Live() {
    const { user } = useUser();
    const { playTrack, currentAudio, isPlaying, togglePlay } = useAudio();
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formTitle, setFormTitle] = useState('');
    const [formUrl, setFormUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAdmin = user && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

    useEffect(() => {
        fetchStreams();
    }, []);

    const fetchStreams = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/livestreams');
            setStreams(res.data);
        } catch (error) {
            console.error('Error fetching livestreams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStream = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/livestreams', {
                title: formTitle,
                url: formUrl,
                type: 'tv',
                adminEmail: user.primaryEmailAddress.emailAddress
            });
            setIsDialogOpen(false);
            setFormTitle('');
            setFormUrl('');
            fetchStreams();
        } catch (error) {
            console.error("Error adding stream:", error);
            alert("حدث خطأ أثناء الإضافة.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin || !window.confirm('هل أنت متأكد من حذف هذا البث؟')) return;
        try {
            await axios.delete(`http://localhost:5000/api/livestreams/${id}`, {
                params: { adminEmail: user.primaryEmailAddress.emailAddress }
            });
            setStreams(streams.filter(s => s._id !== id));
        } catch (error) {
            console.error("Error deleting stream:", error);
        }
    };

    const allStreams = [...streams, ...TV_STATIONS, ...RADIO_STATIONS];
    const tvStreams = allStreams.filter(s => s.type === 'tv');
    const radioStreams = allStreams.filter(s => s.type === 'radio');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
            {/* Header */}
            <div className="bg-[#0f172a] text-white py-12 relative overflow-hidden shadow-lg mb-8">
                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur border border-white/10 text-[#f97316]">
                        <Tv className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-amiri mb-4 flex items-center justify-center gap-3">
                        البث المباشر
                        <Sparkles className="w-6 h-6 text-[#f97316] animate-pulse" />
                    </h1>
                    <p className="text-lg text-white/80 font-changa mt-2 opacity-90 mb-6">
                        فيديوهات وقنوات مرئية وإذاعية مختارة من القرآن الكريم والسنة النبوية
                    </p>

                    {isAdmin && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-changa rounded-full px-6 shadow-md transition-all gap-2">
                                    <Plus className="w-4 h-4" /> إضافة بث أو فيديو يوتيوب
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white font-changa" dir="rtl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-[#0f172a] font-amiri">إضافة بث يوتيوب جديد</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddStream} className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">اسم البث</label>
                                        <Input
                                            required
                                            value={formTitle}
                                            onChange={e => setFormTitle(e.target.value)}
                                            placeholder="مثال: قناة القرآن الكريم بث مباشر"
                                            className="bg-gray-50 text-right"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">رابط يوتيوب (URL)</label>
                                        <Input
                                            required
                                            type="url"
                                            value={formUrl}
                                            onChange={e => setFormUrl(e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="bg-gray-50 text-left"
                                            dir="ltr"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0f172a] hover:bg-[#0f172a]/90 text-white font-bold h-10 mt-2">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ البث'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl space-y-16">

                {/* ✅ TV Section */}
                <section className="mt-10  " >
                    <div className="flex items-center  gap-3 mb-6 pb-2 border-b border-gray-200">
                        <Tv className="w-6 h-6 text-[#f97316]" />
                        <h2 className="text-2xl font-bold font-amiri text-[#0f172a]">الفيديوهات والبث المرئي</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{tvStreams.length}</span>
                    </div>

                    {tvStreams.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                            <Tv className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold font-changa text-gray-800 mb-1">لا توجد فيديوهات أو قنوات مرئية حالياً</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {tvStreams.map((stream) => (
                                <div key={stream._id} className="relative group rounded-xl overflow-hidden shadow-md bg-white flex flex-col">

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(stream._id)}
                                            className="absolute top-2 right-2 z-20 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                            title="حذف البث"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}

                                    {/* 🔥 Taller Video — 16:9 aspect ratio */}
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={getYouTubeEmbedUrl(stream.url)}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allowFullScreen
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                        <div className="absolute top-3 left-3 z-10 flex gap-2 pointer-events-none">
                                            <span className="px-2.5 py-1 text-[10px] font-bold rounded flex items-center gap-1 shadow-sm backdrop-blur-md bg-blue-500/90 text-white">
                                                <Tv className="w-3 h-3" />
                                                فيديو / بث
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col justify-center text-center">
                                        <h3 className="text-xl font-bold text-[#0f172a] font-amiri group-hover:text-[#f97316] transition-colors line-clamp-2">
                                            {stream.title}
                                        </h3>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Radio Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-2 mt-12 border-b border-gray-200">
                        <Radio className="w-6 h-6 text-[#f97316]" />
                        <h2 className="text-2xl font-bold font-amiri text-[#0f172a]">الإذاعات الصوتية</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">{radioStreams.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {radioStreams.map((stream) => {
                            const isCurrentTrack = currentAudio?.title === stream.title && currentAudio?.reciter === 'البث المباشر';
                            const isCurrentlyPlaying = isCurrentTrack && isPlaying;

                            return (
                                <div
                                    key={stream._id}
                                    onClick={() => {
                                        if (isCurrentTrack) {
                                            togglePlay();
                                        } else {
                                            playTrack({
                                                url: stream.url,
                                                title: stream.title,
                                                reciter: 'البث المباشر',
                                                id: stream._id
                                            }, [], null, -1);
                                        }
                                    }}
                                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-xl transition-all duration-300 relative flex flex-col cursor-pointer
                                    ${isCurrentTrack ? 'border-[#f97316] ring-1 ring-[#f97316]' : 'border-gray-100 hover:border-[#f97316]/30'}`}
                                >
                                    <div className="aspect-[2/1] w-full bg-[#0f172a] relative flex flex-col items-center justify-center overflow-hidden p-6">
                                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                                        <div className="relative z-10 flex items-center justify-center">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${isCurrentTrack ? 'bg-[#f97316] scale-110' : 'bg-white/10 backdrop-blur-sm group-hover:bg-[#f97316]'}`}>
                                                {isCurrentlyPlaying ? (
                                                    <Pause className={`w-8 h-8 ${isCurrentTrack ? 'text-white' : 'text-[#f97316] group-hover:text-white'}`} />
                                                ) : (
                                                    <Play className={`w-8 h-8 ml-1 ${isCurrentTrack ? 'text-white' : 'text-[#f97316] group-hover:text-white'}`} />
                                                )}
                                            </div>
                                        </div>
                                        {isCurrentlyPlaying && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 h-4 items-end z-10">
                                                <span className="w-1 h-full bg-[#f97316] animate-[bounce_1s_infinite]" />
                                                <span className="w-1 h-2/3 bg-[#f97316] animate-[bounce_1.2s_infinite]" />
                                                <span className="w-1 h-full bg-[#f97316] animate-[bounce_0.8s_infinite]" />
                                                <span className="w-1 h-1/2 bg-[#f97316] animate-[bounce_1.1s_infinite]" />
                                                <span className="w-1 h-4/5 bg-[#f97316] animate-[bounce_0.9s_infinite]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`p-4 flex-1 flex flex-col justify-center text-center transition-colors border-t
                                        ${isCurrentTrack ? 'bg-[#f97316]/5 border-[#f97316]/20' : 'bg-gray-50/50 border-gray-100'}`}
                                    >
                                        <h3 className={`text-lg font-bold font-amiri transition-colors line-clamp-2
                                            ${isCurrentTrack ? 'text-[#f97316]' : 'text-[#0f172a] group-hover:text-[#f97316]'}`}>
                                            {stream.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
}