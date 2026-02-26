import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ChevronLeft, ChevronRight, Home, Copy, Share2, Check, ExternalLink, Loader2, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HADITH_BOOKS, getBookById, getSectionName } from '@/utils/sunnahData';
import { API_URL } from '@/config';
import SEO from '@/components/SEO';

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// Extract matn (Prophet's actual words) — strip isnad chain
function extractMatn(text) {
    if (!text) return '';
    let t = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
    t = t.replace(/\uFDFA/g, 'صلى الله عليه وسلم');
    t = t.replace(/[^\u0621-\u064A\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const seps = [
        'قال رسول الله صلى الله عليه وسلم',
        'قال النبي صلى الله عليه وسلم',
        'رسول الله صلى الله عليه وسلم',
        'النبي صلى الله عليه وسلم',
    ];
    for (const sep of seps) {
        const idx = t.indexOf(sep);
        if (idx >= 0) {
            const after = t.slice(idx + sep.length).trim();
            if (after.length > 10) return after;
        }
    }
    if (/^(حدثنا|اخبرنا|وحدثنا)/.test(t)) {
        let last = -1, from = 0;
        while (true) { const i = t.indexOf('قال', from); if (i === -1) break; last = i; from = i + 3; }
        if (last > 10) { const after = t.slice(last + 3).trim(); if (after.length > 10) return after; }
    }
    return t;
}

export default function SunnahHadith() {
    const { bookId, sectionId, hadithNumber } = useParams();
    const navigate = useNavigate();

    const book = getBookById(bookId);
    const sectionNum = parseInt(sectionId, 10);
    const sectionName = getSectionName(bookId, sectionNum);
    const targetHadithNumber = parseInt(hadithNumber, 10);

    const [hadith, setHadith] = useState(null);
    const [allSectionHadiths, setAllSectionHadiths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sharh, setSharh] = useState(null);
    const [sharhLoading, setSharhLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!book) return;
        window.scrollTo(0, 0);
        setLoading(true);

        // Fetch all hadiths in this section to find the specific one and handle prev/next
        axios.get(`${BASE_URL}/${book.edition}/sections/${sectionNum}.json`)
            .then(res => {
                const hadiths = res.data.hadiths || [];
                setAllSectionHadiths(hadiths);

                // Find target hadith (matching arabicnumber or hadithnumber)
                const found = hadiths.find(h =>
                    h.arabicnumber === targetHadithNumber ||
                    h.hadithnumber === targetHadithNumber
                );

                if (found) {
                    setHadith(found);
                    fetchSharh(found.text);
                } else {
                    setHadith(null);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [book, sectionNum, targetHadithNumber]);

    const fetchSharh = async (text) => {
        setSharhLoading(true);
        setSharh(null);
        try {
            const res = await axios.get(`${API_URL}/api/hadith/sharh`, {
                params: { text: text?.slice(0, 500) },
                timeout: 15000,
            });
            if (res.data?.found) {
                setSharh({
                    takhrij: res.data.takhrij || [],
                    sharh: res.data.sharh || [],
                });
            }
        } catch (e) {
            console.error("Error fetching sharh:", e);
        } finally {
            setSharhLoading(false);
        }
    };

    const handleCopy = () => {
        const textToCopy = `${hadith?.text}\n\n[المصدر: ${book?.name} - رقم ${hadith?.arabicnumber || hadith?.hadithnumber}]`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${book?.name} - حديث ${hadith?.arabicnumber || hadith?.hadithnumber}`,
                text: hadith?.text,
                url: window.location.href
            });
        } else {
            handleCopy();
        }
    };

    if (!book) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]" dir="rtl">
            <p className="text-muted-foreground">الكتاب غير موجود</p>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa]" dir="rtl">
                <div className="bg-[#0f172a] py-16">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Skeleton className="h-6 w-40 mb-4 bg-slate-800 rounded-full" />
                        <Skeleton className="h-10 w-64 mb-2 bg-slate-800" />
                        <Skeleton className="h-5 w-48 bg-slate-800" />
                    </div>
                </div>
                <div className="container mx-auto px-4 max-w-3xl py-12 space-y-8">
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!hadith) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-amiri">الحديث غير موجود</h2>
                    <Button onClick={() => navigate(`/sunnah/${book.id}/${sectionNum}`)} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-changa rounded-full px-8">
                        العودة للباب
                    </Button>
                </div>
            </div>
        );
    }

    // Prev/Next Navigation
    const currentIndex = allSectionHadiths.findIndex(h => h.hadithnumber === hadith.hadithnumber);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex > -1 && currentIndex < allSectionHadiths.length - 1;

    const prevHadithNum = hasPrev ? (allSectionHadiths[currentIndex - 1].arabicnumber || allSectionHadiths[currentIndex - 1].hadithnumber) : null;
    const nextHadithNum = hasNext ? (allSectionHadiths[currentIndex + 1].arabicnumber || allSectionHadiths[currentIndex + 1].hadithnumber) : null;

    const matnText = extractMatn(hadith.text);
    const cleanSeoText = matnText.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
    const seoDescriptionText = cleanSeoText.length > 130 ? cleanSeoText.substring(0, 130) + '...' : cleanSeoText;

    const seoTitle = `حديث ${hadith.arabicnumber || hadith.hadithnumber} من ${book.name} - ${sectionName} | التخريج والشرح`;
    const seoDescription = `${seoDescriptionText} — اقرأ حديث ${hadith.arabicnumber || hadith.hadithnumber} من ${book.name} (${sectionName}) مع الشرح الوافي وخلاصة حكم المحدث والتخريج.`;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
            <SEO
                title={seoTitle}
                description={seoDescription}
                keywords={`حديث ${hadith.arabicnumber || hadith.hadithnumber}, ${book.name}, ${sectionName}, شرح حديث, تخريج الحديث, السنة النبوية`}
                url={`/sunnah/${bookId}/${sectionId}/${hadithNumber}`}
                type="article"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": `حديث ${hadith.arabicnumber || hadith.hadithnumber} من ${book.name}`,
                    "description": seoDescription,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://firdws.com/sunnah/${bookId}/${sectionId}/${hadithNumber}`
                    }
                }}
            />

            {/* Header */}
            <div className="bg-[#0f172a] text-white py-14 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <nav className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap">
                        <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" /> الرئيسية
                        </Link>
                        <span>/</span>
                        <Link to="/sunnah" className="hover:text-white transition-colors">السنة النبوية</Link>
                        <span>/</span>
                        <Link to={`/sunnah/${bookId}`} className="hover:text-white transition-colors">{book.name}</Link>
                        <span>/</span>
                        <Link to={`/sunnah/${bookId}/${sectionId}`} className="hover:text-white transition-colors">باب {sectionName}</Link>
                        <span>/</span>
                        <span className="text-[#f97316]">رقم {hadith.arabicnumber || hadith.hadithnumber}</span>
                    </nav>

                    <h1 className="text-3xl md:text-5xl font-bold font-amiri mb-3">
                        {book.name}
                    </h1>
                    <p className="text-lg text-white/60">
                        حديث رقم {hadith.arabicnumber || hadith.hadithnumber} — {sectionName}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
            </div>

            <div className="container mx-auto px-4 max-w-3xl -mt-8 relative z-20 space-y-6">

                {/* Hadith Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-[#0f172a] text-white px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center font-bold text-sm shrink-0">
                                {hadith.arabicnumber || hadith.hadithnumber}
                            </div>
                            <span className="font-changa text-sm text-white/80 line-clamp-1">
                                {book.name} — باب {sectionName}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="نسخ الحديث">
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="مشاركة">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <p className="font-amiri text-2xl md:text-3xl leading-[2.2] text-[#1a1a1a] text-justify text-right">
                            {hadith.text}
                        </p>
                    </div>

                    {hadith.reference && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" />
                            المرجع: كتاب {hadith.reference.book}، حديث {hadith.reference.hadith}
                        </div>
                    )}
                </div>

                {/* Takhrij / Sharh Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#f97316]" />
                        <h2 className="text-lg font-bold text-[#0f172a]">تخريج الحديث وحكمه (من الدرر السنية)</h2>
                    </div>

                    <div className="p-6 md:p-8">
                        {sharhLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
                                <p>جارٍ البحث عن التخريج والشرح...</p>
                            </div>
                        ) : sharh?.takhrij?.length > 0 ? (
                            <div className="space-y-4">
                                {sharh.takhrij.map((h, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm p-5">
                                        <p className="font-amiri text-lg leading-[2] text-[#1a1a1a] text-justify mb-4">{h.text}</p>

                                        {h.grade && (
                                            <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-bold border ${h.grade.includes('صحيح') ? 'bg-green-50 text-green-800 border-green-200' :
                                                h.grade.includes('ضعيف') ? 'bg-red-50 text-red-800 border-red-200' :
                                                    'bg-yellow-50 text-yellow-800 border-yellow-200'
                                                }`}>
                                                خلاصة حكم المحدث: {h.grade}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {h.rawi && <span className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">الراوي: <strong>{h.rawi}</strong></span>}
                                            {h.muhadith && <span className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">المحدث: <strong>{h.muhadith}</strong></span>}
                                            {h.source && <span className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">المصدر: <strong>{h.source}</strong></span>}
                                            {h.number && <span className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">رقم: <strong>{h.number}</strong></span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-800 flex flex-col items-center gap-2">
                                <BookOpen className="w-8 h-8 opacity-50" />
                                <p className="font-bold">لم يُعثر على نتائج تخريج مطابقة.</p>
                                <p className="text-sm opacity-80">قد يكون الحديث موجوداً بلفظ مختلف قليلاً.</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <a
                                href={`https://dorar.net/hadith/search?q=${encodeURIComponent(extractMatn(hadith?.text))}&st=a&t=3`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold transition-colors shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                بحث متقدم في موقع الدرر السنية
                            </a>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4 mt-8 pb-10">
                    {hasPrev ? (
                        <Link
                            to={`/sunnah/${bookId}/${sectionId}/${prevHadithNum}`}
                            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-[#f97316]/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#f97316]/10 transition-colors shrink-0">
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f97316]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">الحديث السابق</p>
                                    <p className="text-sm font-bold text-[#0f172a] truncate">رقم {prevHadithNum}</p>
                                </div>
                            </div>
                        </Link>
                    ) : <div className="flex-1" />}

                    <Link
                        to={`/sunnah/${bookId}/${sectionId}`}
                        className="w-12 h-12 bg-[#0f172a] rounded-full flex items-center justify-center hover:bg-[#f97316] transition-colors shadow-md shrink-0"
                        title={`باب ${sectionName}`}
                    >
                        <BookOpen className="w-5 h-5 text-white" />
                    </Link>

                    {hasNext ? (
                        <Link
                            to={`/sunnah/${bookId}/${sectionId}/${nextHadithNum}`}
                            className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-[#f97316]/30 hover:shadow-md transition-all group text-left"
                        >
                            <div className="flex items-center justify-end gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">الحديث التالي</p>
                                    <p className="text-sm font-bold text-[#0f172a] truncate">رقم {nextHadithNum}</p>
                                </div>
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#f97316]/10 transition-colors shrink-0">
                                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#f97316]" />
                                </div>
                            </div>
                        </Link>
                    ) : <div className="flex-1" />}
                </div>

            </div>
        </div>
    );
}
