import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Headphones, Play, Pause, User, Music } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const RECITER_AUDIO_MAP = {
    7: { slug: 'mishaari_raashid_al_3afaasee', name: 'مشاري بن راشد العفاسي' },
    2: { slug: 'abdul_basit_murattal', name: 'عبد الباسط عبد الصمد - مرتل' },
    1: { slug: 'abdulbaset_mujawwad', name: 'عبد الباسط عبد الصمد - مجود' },
    3: { slug: 'abdurrahmaan_as-sudays', name: 'عبد الرحمن السديس' },
    4: { slug: 'abu_bakr_ash-shaatree', name: 'أبو بكر الشاطري' },
    5: { slug: 'hani_ar-rifai', name: 'هاني الرفاعي' },
    6: { slug: 'mahmoud_khaleel_al-husairee', name: 'محمود خليل الحصري' },
    12: { slug: 'mahmoud_khaleel_al-husairee_muallim', name: 'محمود خليل الحصري - معلم' },
    9: { slug: 'muhammad_siddeeq_al-minshawee', name: 'محمد صديق المنشاوي - مرتل' },
    8: { slug: 'muhammad_siddeeq_al-minshawee', name: 'محمد صديق المنشاوي - مجود' },
    10: { slug: 'sa3ood_ash-shuraym', name: 'سعود الشريم' },
    11: { slug: 'muhammad_al-tablawi', name: 'محمد الطبلاوي' },
};

function Listen() {
    const [reciters, setReciters] = useState([]);
    const [surahs, setSurahs] = useState([]);
    const [selectedReciter, setSelectedReciter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentSurahIndex, setCurrentSurahIndex] = useState(-1);
    const [filterReciter, setFilterReciter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recitersRes, surahsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/reciters'),
                    axios.get('http://localhost:5000/api/surahs'),
                ]);
                setReciters(recitersRes.data.recitations || []);
                setSurahs(surahsRes.data.chapters || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const playSurah = (reciterId, surahIndex) => {
        const surah = surahs[surahIndex];
        if (!surah) return;
        const chapterNum = String(surah.id).padStart(3, '0');
        const reciterInfo = RECITER_AUDIO_MAP[reciterId] || RECITER_AUDIO_MAP[7];
        const url = `https://download.quranicaudio.com/quran/${reciterInfo.slug}/${chapterNum}.mp3`;

        setCurrentAudio({
            url,
            title: surah.name_arabic,
            reciter: reciterInfo.name,
        });
        setCurrentSurahIndex(surahIndex);
    };

    const playNext = () => {
        if (currentSurahIndex < surahs.length - 1 && selectedReciter) {
            playSurah(selectedReciter.id, currentSurahIndex + 1);
        }
    };

    const playPrev = () => {
        if (currentSurahIndex > 0 && selectedReciter) {
            playSurah(selectedReciter.id, currentSurahIndex - 1);
        }
    };

    const filteredReciters = reciters.filter(r => {
        const name = RECITER_AUDIO_MAP[r.id]?.name || r.reciter_name;
        return name.includes(filterReciter);
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-background  pb-20 ${currentAudio ? 'pb-32' : ''}`}>
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-12 px-4">
                <div className="container mx-auto text-center max-w-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
                        <Headphones className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">المكتبة الصوتية</h1>
                    <p className="opacity-80 leading-relaxed">
                        استمع إلى القرآن الكريم بأصوات نخبة من القراء المتميزين بجودة عالية
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-10">
                {/* Reciters */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            اختر القارئ
                        </h2>
                        <Input
                            placeholder="بحث عن قارئ..."
                            className="w-48 md:w-64 h-9 bg-muted/50"
                            value={filterReciter}
                            onChange={e => setFilterReciter(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-[280px] w-full rounded-xl border bg-muted/20 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {filteredReciters.map(reciter => {
                                const info = RECITER_AUDIO_MAP[reciter.id];
                                const isSelected = selectedReciter?.id === reciter.id;
                                return (
                                    <div
                                        key={reciter.id}
                                        onClick={() => setSelectedReciter(reciter)}
                                        className={`group relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 border
                                            ${isSelected
                                                ? 'bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary ring-offset-2'
                                                : 'bg-card hover:border-primary/50 hover:shadow-md'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center transition-colors
                                            ${isSelected ? 'bg-white/20' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}
                                        >
                                            <User className="w-6 h-6" />
                                        </div>
                                        <p className="font-semibold text-xs text-center leading-tight line-clamp-2">
                                            {info?.name || reciter.reciter_name}
                                        </p>
                                        {reciter.style && (
                                            <span className={`text-[10px] mt-1 px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
                                                {reciter.style}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* Surah List */}
                {selectedReciter && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Music className="w-5 h-5 text-primary" />
                                قائمة السور
                            </h2>
                            <Badge variant="secondary" className="font-normal text-sm">
                                القارئ: {RECITER_AUDIO_MAP[selectedReciter.id]?.name || selectedReciter.reciter_name}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {surahs.map((surah, index) => {
                                const isPlaying = currentSurahIndex === index;
                                return (
                                    <div
                                        key={surah.id}
                                        onClick={() => playSurah(selectedReciter.id, index)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md
                                            ${isPlaying
                                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                                : 'bg-card hover:border-primary/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors
                                                ${isPlaying ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                {surah.id}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${isPlaying ? 'text-primary' : ''}`}>
                                                    {surah.name_arabic}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {surah.translated_name.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isPlaying && (
                                                <div className="flex gap-0.5 h-3 items-end">
                                                    <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite]" />
                                                    <span className="w-0.5 h-2/3 bg-primary animate-[bounce_1.2s_infinite]" />
                                                    <span className="w-0.5 h-full bg-primary animate-[bounce_0.8s_infinite]" />
                                                </div>
                                            )}
                                            <Button
                                                size="icon" variant={isPlaying ? "default" : "ghost"}
                                                className={`h-8 w-8 rounded-full ${isPlaying ? '' : 'hover:bg-primary/10 hover:text-primary'}`}
                                            >
                                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Audio Player */}
            {currentAudio && (
                <AudioPlayer
                    audioUrl={currentAudio.url}
                    title={currentAudio.title}
                    reciter={currentAudio.reciter}
                    onNext={currentSurahIndex < surahs.length - 1 ? playNext : null}
                    onPrev={currentSurahIndex > 0 ? playPrev : null}
                />
            )}
        </div>
    );
}

export default Listen;
