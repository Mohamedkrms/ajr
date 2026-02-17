import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Play, BookOpen, ChevronLeft, ChevronRight, Home, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AudioPlayer from '@/components/AudioPlayer';

function Surah() {
    const { id } = useParams();
    const [verses, setVerses] = useState([]);
    const [surahInfo, setSurahInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState(null);
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        const load = async () => {
            try {
                const [vRes, sRes] = await Promise.all([
                    axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`),
                    axios.get('http://localhost:5000/api/surahs'),
                ]);
                setVerses(vRes.data.verses || []);
                setSurahInfo(sRes.data.chapters.find(c => c.id === parseInt(id)));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const playAudio = () => {
        const num = String(id).padStart(3, '0');
        setAudioUrl(`https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${num}.mp3`);
    };

    if (loading) return <div className="p-12"><Skeleton className="h-40 w-full mb-8" /><Skeleton className="h-[600px] w-full" /></div>;

    const surahId = parseInt(id);

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            {/* Breadcrumb / Nav Header */}
            <div className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Link to="/" className="hover:text-[#f97316] flex items-center gap-1"><Home className="w-4 h-4" /> الرئيسية</Link>
                        <span>/</span>
                        <span className="text-foreground font-bold">{surahInfo?.name_arabic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {surahId < 114 && (
                            <Link to={`/surah/${surahId + 1}`} className="flex items-center gap-1 text-[#0f172a] hover:text-[#f97316] font-medium">
                                سورة {surahId + 1} <ChevronLeft className="w-4 h-4" />
                            </Link>
                        )}
                        {surahId > 1 && (
                            <Link to={`/surah/${surahId - 1}`} className="flex items-center gap-1 text-[#0f172a] hover:text-[#f97316] font-medium">
                                <ChevronRight className="w-4 h-4" /> سورة {surahId - 1}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-4xl mx-auto">
                    {/* Surah Title Header */}
                    <div className="bg-[#0f172a] text-white py-6 px-8 text-center relative overflow-hidden">
                        <h1 className="text-4xl font-amiri font-bold mb-2">سورة {surahInfo?.name_arabic}</h1>
                        <p className="opacity-80 text-sm">{surahInfo?.revelation_place === 'makkah' ? 'مكية' : 'مدنية'} • عدد الآيات {surahInfo?.verses_count}</p>

                        <div className="absolute top-1/2 left-4 -translate-y-1/2">
                            <Button onClick={playAudio} className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full gap-2">
                                <Play className="w-4 h-4" /> استماع
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        {surahId !== 1 && surahId !== 9 && (
                            <div className="text-center mb-10">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg"
                                    className="h-12 md:h-16 mx-auto opacity-80"
                                    alt="Bismillah"
                                />
                            </div>
                        )}

                        <div className="text-center leading-[3] text-3xl md:text-4xl font-amiri text-black space-y-8 quran-text-block">
                            {verses.map((verse, i) => (
                                <span key={verse.id} className="inline relative hover:bg-[#f97316]/5 rounded px-1 transition-colors group cursor-pointer" title={`آية ${verse.verse_number}`}>
                                    {verse.text_uthmani}
                                    <span className="text-[#f97316] font-sans text-2xl mx-1 inline-block border border-[#f97316] rounded-full w-8 h-8 text-center leading-7 text-base shadow-sm">
                                        {verse.verse_number}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {audioUrl && (
                <AudioPlayer
                    audioUrl={audioUrl}
                    title={surahInfo?.name_arabic}
                    reciter="مشاري العفاسي"
                />
            )}
        </div>
    );
}

export default Surah;
