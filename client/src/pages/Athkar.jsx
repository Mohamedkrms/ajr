import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Moon, Sun, Coffee, BookOpen, Compass,
    Share2, Copy, Check, RotateCcw,
    Search, ArrowRight, ChevronLeft, ChevronRight, Play, Pause,
    Volume2, Info
} from 'lucide-react';
import ADHKAR_DATA from '@/assets/adhkar.json';
import SEO from '@/components/SEO';
import { useAudio } from '@/context/AudioContext';

const AUDIO_BASE_URL = 'https://www.hisnmuslim.com';

const CATEGORY_ICONS = {
    "أذكار الصباح والمساء": Sun,
    "أذكار الصباح": Sun,
    "أذكار المساء": Moon,
    "أذكار النوم": Moon,
    "أذكار الاستيقاظ": Sun,
    "أذكار الصلاة": Coffee,
    "أذكار بعد الصلاة": Coffee,
    "أذكار المسجد": Compass,
    "أذكار الوضوء": BookOpen,
    "default": BookOpen
};

const PrayerBowlIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 18c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V11c0-3.3-2.7-6-6-6s-6 2.7-6 6v7Z" />
        <path d="M6 18H2v2c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-2h-4" />
        <path d="M12 2v3" />
        <path d="M12 11v3" />
        <path d="M10 14h4" />
    </svg>
);

function Athkar() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { playTrack, currentAudio, isPlaying, togglePlay } = useAudio();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        if (categoryId) {
            const decodedId = decodeURIComponent(categoryId);
            const catArr = ADHKAR_DATA.find(c => c.category === decodedId || c.category === categoryId);
            if (catArr) {
                setSelectedCategory(catArr);
                const initialCounts = {};
                catArr.array.forEach(item => {
                    initialCounts[item.id] = item.count;
                });
                setCounts(initialCounts);
                window.scrollTo(0, 0);
            }
        } else {
            setSelectedCategory(null);
        }
    }, [categoryId]);

    const handleDecrement = (id) => {
        setCounts(prev => ({
            ...prev,
            [id]: Math.max(0, prev[id] - 1)
        }));
    };

    const resetCount = (id, originalCount) => {
        setCounts(prev => ({
            ...prev,
            [id]: originalCount
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handlePlay = (item) => {
        const audioUrl = item.audio.startsWith('http')
            ? item.audio
            : `${AUDIO_BASE_URL}${item.audio}`;

        if (currentAudio?.url === audioUrl) {
            togglePlay();
        } else {
            playTrack({
                url: audioUrl,
                title: item.text.slice(0, 50) + '...',
                reciter: selectedCategory.category,
                id: `athkar-${item.id}`
            });
        }
    };

    const filteredCategories = ADHKAR_DATA.filter(cat =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory) {
        const Icon = CATEGORY_ICONS[selectedCategory.category] || CATEGORY_ICONS.default;
        const categoryName = selectedCategory.category;

        return (
            <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
                <SEO
                    title={`${categoryName} كاملة - حصن المسلم - فردوس`}
                    description={`أذكار ${categoryName} مكتوبة من حصن المسلم. اقرأ واستمع إلى ${selectedCategory.array.length} ذكر مأثور مع عداد لتكرار الأذكار وفضل كل ذكر.`}
                    keywords={`${categoryName}, حصن المسلم, أذكار المسلم, أدعية مأثورة, فردوس`}
                    url={`/athkar/${encodeURIComponent(categoryName)}`}
                    schema={{
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": [{
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "الرئيسية",
                                    "item": "https://firdws.com/"
                                }, {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "حصن المسلم",
                                    "item": "https://firdws.com/athkar"
                                }, {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": categoryName,
                                    "item": `https://firdws.com/athkar/${encodeURIComponent(categoryName)}`
                                }]
                            },
                            {
                                "@type": "ItemList",
                                "name": categoryName,
                                "numberOfItems": selectedCategory.array.length,
                                "itemListElement": selectedCategory.array.slice(0, 10).map((item, index) => ({
                                    "@type": "ListItem",
                                    "position": index + 1,
                                    "name": item.text.slice(0, 100) + (item.text.length > 100 ? "..." : ""),
                                    "description": item.notes || ""
                                }))
                            }
                        ]
                    }}
                />

                {/* ─── HEADER ─── */}
                <div className="bg-[#0f172a] text-white py-8 border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors w-fit cursor-pointer" onClick={() => navigate('/athkar')}>
                            <ChevronRight className="w-4 h-4" /> العودة للأقسام
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#f97316] rounded-xl flex items-center justify-center shadow-lg shadow-[#f97316]/20 shrink-0">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold font-amiri">{selectedCategory.category}</h1>
                                <p className="text-gray-400 text-sm mt-1">{selectedCategory.array.length} ذكر مأثور</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {selectedCategory.array.map((item) => {
                            const isThisPlaying = currentAudio?.id === `athkar-${item.id}` && isPlaying;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-[#f97316]/30 transition-all duration-300"
                                >
                                    <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center text-xs font-bold">
                                                {item.id}
                                            </span>
                                            {item.audio && (
                                                <button
                                                    onClick={() => handlePlay(item)}
                                                    className={`p-1.5 rounded-lg transition-colors ${isThisPlaying ? 'bg-[#f97316] text-white' : 'bg-white border text-[#f97316] hover:bg-[#f97316]/10'}`}
                                                    title="استماع"
                                                >
                                                    {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => copyToClipboard(item.text)}
                                                className="p-1.5 rounded-lg bg-white border text-gray-400 hover:text-[#f97316] transition-colors"
                                                title="نسخ"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-10">
                                        <p className="text-xl md:text-2xl leading-[2.2] text-[#1a1a1a] font-quran text-justify mb-8" dir="rtl">
                                            {item.text.split(/،\s*/).map((part, i, arr) => (
                                                <span key={i}>
                                                    {part}
                                                    {i < arr.length - 1 && <span className="comma-separator mx-2 text-[#000]">,</span>}
                                                </span>
                                            ))}
                                        </p>

                                        {item.notes && (
                                            <div className="bg-amber-50/50 border-r-4 border-amber-400 p-4 rounded-xl mb-6">
                                                <div className="flex items-center gap-2 text-amber-800 font-bold mb-1 text-sm">
                                                    <Info className="w-4 h-4" />
                                                    <span>الفضل والملاحظة:</span>
                                                </div>
                                                <p className="text-sm text-amber-900/80 leading-relaxed">
                                                    {item.notes}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                {counts[item.id] !== item.count && (
                                                    <button
                                                        onClick={() => resetCount(item.id, item.count)}
                                                        className="flex items-center gap-1.5 text-gray-400 hover:text-[#f97316] transition-colors"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        إعادة الضبط
                                                    </button>
                                                )}
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/50">
                                                    عدد المرات المطلوبة: {item.count}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDecrement(item.id)}
                                                disabled={counts[item.id] === 0}
                                                className={`relative flex items-center justify-center gap-3 px-10 py-3.5 rounded-2xl font-bold transition-all duration-300 min-w-[160px]
                                                    ${counts[item.id] === 0
                                                        ? 'bg-green-50 text-green-600 border-2 border-green-200 cursor-default'
                                                        : 'bg-[#0f172a] text-white hover:bg-[#1e293b] active:scale-95 shadow-lg shadow-[#0f172a]/20'
                                                    }`}
                                            >
                                                {counts[item.id] === 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Check className="w-6 h-6" />
                                                        <span>تم تماماً</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl font-bold leading-none">{counts[item.id]}</span>
                                                        <span className="text-xs opacity-60 uppercase tracking-widest mt-1">المتبقي</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
            <SEO
                title="حصن المسلم كامل - الأذكار والأوراد اليومية - فردوس"
                description="حصن المسلم كامل للأذكار اليومية: أذكار الصباح والمساء، أذكار النوم، أذكار الصلاة، وأدعية مأثورة. تصفح الأذكار مع العداد وتنبيهات التكرار والصوت."
                keywords="حصن المسلم, أذكار الصباح والمساء, أذكار اليوم والليلة, أدعية نبوية, أذكار النوم, أذكار الصلاة, فردوس"
                url="/athkar"
                schema={{
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "الرئيسية",
                        "item": "https://firdws.com/"
                    }, {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "حصن المسلم",
                        "item": "https://firdws.com/athkar"
                    }]
                }}
            />

            {/* ─── HOME HEADER ─── */}
            <div className="bg-[#0f172a] text-white py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur border border-white/10 text-[#f97316]">
                            <PrayerBowlIcon className="w-8 h-8 text-[#f97316]" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-amiri mb-3">حصن المسلم</h1>
                    <p className="text-gray-300 text-lg max-w-xl mx-auto">تصفح الأذكار والأوراد اليومية بتوظيف تقني يساعدك على الاستمرار</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="max-w-2xl mx-auto mb-10">
                    <div className="relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#f97316] transition-colors" />
                        <input
                            type="text"
                            placeholder="ابحث في أقسام الأذكار..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-12 pl-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all text-lg font-medium"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-8">
                    <span className="w-1.5 h-8 bg-[#f97316] rounded-full block" />
                    <h2 className="text-2xl font-bold text-[#0f172a]">الأقسام والتصنيفات</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((cat, idx) => {
                        const Icon = CATEGORY_ICONS[cat.category] || CATEGORY_ICONS.default;
                        return (
                            <Link
                                key={idx}
                                to={`/athkar/${encodeURIComponent(cat.category)}`}
                                className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#f97316]/40 transition-all duration-300 text-right"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#f97316]/10 transition-colors">
                                        <Icon className="w-7 h-7 text-gray-400 group-hover:text-[#f97316] transition-all" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors text-lg mb-0.5">{cat.category}</h3>
                                        <p className="text-xs text-gray-400 font-bold">{cat.array.length} ذكر متاح</p>
                                    </div>
                                </div>
                                <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-[#f97316] group-hover:-translate-x-1 transition-all" />
                            </Link>
                        );
                    })}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">لا توجد نتائج لبحثك</h3>
                        <p className="text-gray-500 mt-2">جرب البحث بكلمات أخرى</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Athkar;
