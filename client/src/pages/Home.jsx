import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Book, Headphones, Tv, PenLine, ScrollText, Library,
    ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Radio,
    MessageCircle, Calendar, GraduationCap, Play, Star
} from 'lucide-react';
import { RECITERS_DATA } from '@/components/recitersdata';
import { API_URL } from '@/config';
import SEO from '@/components/SEO';

const CATEGORIES = [
    { id: 'all', label: 'الكل' },
    { id: 'quran', label: 'القرآن الكريم' },
    { id: 'reciters', label: 'القراء' },
    { id: 'sunnah', label: 'السنة النبوية' },
    { id: 'books', label: 'الكتب' },
    { id: 'live', label: 'البث المباشر' },
    { id: 'blog', label: 'المدونة' },
];

const POPULAR_SURAHS = [
    { id: 1, name: 'الفاتحة', verses: 7, type: 'مكية' },
    { id: 2, name: 'البقرة', verses: 286, type: 'مدنية' },
    { id: 18, name: 'الكهف', verses: 110, type: 'مكية' },
    { id: 36, name: 'يس', verses: 83, type: 'مكية' },
    { id: 55, name: 'الرحمن', verses: 78, type: 'مدنية' },
    { id: 56, name: 'الواقعة', verses: 96, type: 'مكية' },
    { id: 67, name: 'الملك', verses: 30, type: 'مكية' },
    { id: 78, name: 'النبأ', verses: 40, type: 'مكية' },
];

const QUICK_ACCESS = [
    { icon: ScrollText, title: 'السنة النبوية', desc: 'الأحاديث الصحيحة من الكتب الستة', link: '/sunnah' },
    { icon: Library, title: 'مكتبة الكتب', desc: 'كتب في العقيدة والفقه والسيرة', link: '/books' },
    { icon: Tv, title: 'البث المباشر', desc: 'إذاعات قرآنية على مدار الساعة', link: '/live' },
    { icon: GraduationCap, title: 'دروس العلماء', desc: 'محاضرات ودروس من كبار العلماء', link: '/ulama' },
    { icon: PenLine, title: 'المدونة', desc: 'مقالات إسلامية ونقاشات', link: '/blog' },
    { icon: MessageCircle, title: 'المنتدى', desc: 'شارك وناقش مع المجتمع', link: '/forum' },
];

function Home() {
    const recitersScrollRef = useRef(null);
    const topReciters = RECITERS_DATA.slice(0, 16);
    const [posts, setPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        axios.get(`${API_URL}/api/posts?isBlog=true`)
            .then(res => setPosts((res.data || []).slice(0, 6)))
            .catch(() => { });
    }, []);

    const scrollReciters = (dir) => {
        if (!recitersScrollRef.current) return;
        recitersScrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <SEO
                title="فردوس - القرآن الكريم والسنة النبوية | اقرأ واستمع وتدبر في آيات الله"
                description="فردوس منصة إسلامية شاملة لقراءة القرآن الكريم كاملاً بالخط العثماني، الاستماع لأكثر من 100 قارئ، تصفح الأحاديث النبوية الصحيحة من الكتب الستة، مكتبة كتب إسلامية، إذاعات القرآن الكريم المباشرة، والمدونة الإسلامية"
                keywords="فردوس, القرآن الكريم, السنة النبوية, استماع القرآن, قراءة القرآن اون لاين, تفسير القرآن, أحاديث نبوية, صحيح البخاري, صحيح مسلم, كتب إسلامية, إذاعة القرآن الكريم, تلاوات خاشعة, قراء القرآن"
                url="/"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "فردوس",
                    "url": "https://firdws.com/"
                }}
            />

            {/* ═══ CATEGORY CHIPS ═══ */}
            <div className="sticky top-16 z-30 bg-[#f9fafb] border-b border-gray-200/80 px-4 py-2.5">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeCategory === cat.id
                                    ? 'bg-[#0f172a] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>




            <div className="p-4 md:p-6 space-y-8">  {/* ═══ DAILY VERSE ═══ */}
                {activeCategory === 'all' && (
                    <section>
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                            <div className="relative z-10">
                                <p className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#f97316]" />
                                    آية اليوم
                                </p>
                                <p className="text-xl md:text-2xl leading-[2.2] font-quran text-center mb-4" dir="rtl">
                                    ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا ﴾
                                </p>
                                <p className="text-xs text-gray-400 text-center">سورة الإسراء — الآية ٩</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ═══ QURAN SECTION ═══ */}
                {(activeCategory === 'all' || activeCategory === 'quran') && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                                <Book className="w-5 h-5 text-[#f97316]" />
                                القرآن الكريم
                            </h2>
                            <Link to="/quran" className="text-sm text-[#f97316] hover:text-[#ea580c] font-medium flex items-center gap-1 transition-colors">
                                عرض الكل
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 min-[300px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {POPULAR_SURAHS.map(surah => (
                                <Link
                                    key={surah.id}
                                    to={`/surah/${surah.id}`}
                                    className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-[#f97316]/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                            {surah.id}
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                                            {surah.type}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors mb-1">
                                        سورة {surah.name}
                                    </h3>
                                    <p className="text-xs text-gray-400">{surah.verses} آية</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══ RECITERS SECTION ═══ */}
                {(activeCategory === 'all' || activeCategory === 'reciters') && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                                <Headphones className="w-5 h-5 text-[#f97316]" />
                                أبرز القراء
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollReciters(1)}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                    onClick={() => scrollReciters(-1)}
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                                </button>
                                <Link to="/listen" className="text-sm text-[#f97316] hover:text-[#ea580c] font-medium flex items-center gap-1 transition-colors mr-2">
                                    عرض الكل
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div
                            ref={recitersScrollRef}
                            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {topReciters.map(reciter => (
                                <Link
                                    key={reciter.id}
                                    to={`/listen/${reciter.id}`}
                                    className="group flex-shrink-0 w-36"
                                >
                                    <div className="relative mx-auto w-24 h-24 mb-2.5 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#f97316] transition-all duration-200 shadow-sm">
                                        <img
                                            src={reciter.img}
                                            alt={reciter.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" fill="white" />
                                        </div>
                                    </div>
                                    <h4 className="text-xs font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors text-center leading-tight">
                                        {reciter.name}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══ QUICK ACCESS GRID ═══ */}
                {(activeCategory === 'all' || activeCategory === 'sunnah' || activeCategory === 'books' || activeCategory === 'live') && (
                    <section>
                        <h2 className="text-xl font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-[#f97316]" />
                            الوصول السريع
                        </h2>
                        <div className="grid grid-cols-1 min-[300px]:grid-cols-2 md:grid-cols-3 gap-3">
                            {QUICK_ACCESS.filter(item => {
                                if (activeCategory === 'all') return true;
                                if (activeCategory === 'sunnah') return item.link === '/sunnah';
                                if (activeCategory === 'books') return item.link === '/books';
                                if (activeCategory === 'live') return item.link === '/live';
                                return true;
                            }).map(item => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-[#0f172a]/15 transition-all duration-200"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#0f172a]/5 flex items-center justify-center mb-3 group-hover:bg-[#0f172a]/10 transition-colors">
                                        <item.icon className="w-5 h-5 text-[#0f172a]" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0f172a] mb-1 group-hover:text-[#f97316] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ═══ BLOG POSTS ═══ */}
                {posts.length > 0 && (activeCategory === 'all' || activeCategory === 'blog') && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                                <PenLine className="w-5 h-5 text-[#f97316]" />
                                آخر المقالات
                            </h2>
                            <Link to="/blog" className="text-sm text-[#f97316] hover:text-[#ea580c] font-medium flex items-center gap-1 transition-colors">
                                عرض الكل
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {posts.map(post => (
                                <Link key={post._id} to={`/blog/${post._id}`} className="group">
                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
                                        {post.imageUrl && (
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-sm font-bold text-[#0f172a] mb-2 line-clamp-2 group-hover:text-[#f97316] transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                                                {post.content?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                                            </p>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-300">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.date).toLocaleDateString('ar-SA')}
                                                </span>
                                                {post.replyCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="w-3 h-3" />
                                                        {post.replyCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}


            </div>
        </div>
    );
}

export default Home;
