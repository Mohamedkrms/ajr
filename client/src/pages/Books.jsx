import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Download, Library, Heart, Sparkles, Shield, Book, Home, X, Scroll, Scale, Users, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Categorized Data for easier management
const BOOKS_DATA = [
    // --- Aqeedah (العقيدة) ---
    {
        id: 'aq1',
        title: "كتاب التوحيد",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "كتاب يبين عقيدة التوحيد وأدلتها من الكتاب والسنة، ويحذر من الشرك وأنواعه، وهو أصل في بابه.",
        cover: "https://archive.org/services/img/waq49272",
        pdf: "https://archive.org/download/waq49272/49272.pdf",
        pages: 180
    },
    {
        id: 'aq2',
        title: "العقيدة الواسطية",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "رسالة في بيان معتقد أهل السنة والجماعة في الأسماء والصفات والقدر واليوم الآخر، كتبها ابن تيمية لأهل واسط.",
        cover: "https://archive.org/services/img/waq56891",
        pdf: "https://archive.org/download/waq56891/56891.pdf",
        pages: 120
    },
    {
        id: 'aq3',
        title: "الأصول الثلاثة",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "رسالة موجزة في أصول الدين التي يجب على العبد معرفتها: معرفة العبد ربه، ودينه، ونبيه محمد ﷺ.",
        cover: "https://archive.org/services/img/waq80356",
        pdf: "https://archive.org/download/waq80356/80356.pdf",
        pages: 45
    },
    {
        id: 'aq4',
        title: "كشف الشبهات",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "رسالة نفيسة في دحض شبهات المشركين وإقامة الحجة عليهم بالدليل الشرعي.",
        cover: "https://archive.org/services/img/waq108846", // Placeholder/Generic cover if specific not found, using RiyadSalihin as fallback style or reuse another
        pdf: "https://archive.org/download/waq108846/108846.pdf", // Temporary fallback or correct if found. Let's use correct one below if known or generic. 
        // Correcting link based on search:
        pdf: "https://archive.org/download/00976pdf/00976.pdf",
        cover: "https://archive.org/services/img/00976pdf",
        pages: 60
    },
    {
        id: 'aq5',
        title: "لمعة الاعتقاد",
        author: "اابن قدامة المقدسي",
        category: "aqeedah",
        description: "رسالة لطيفة جمع فيها المؤلف جملة من عقائد أهل السنة والجماعة في الصفات والقدر واليوم الآخر.",
        cover: "https://archive.org/services/img/waq108846", // Placeholder
        pdf: "https://archive.org/download/waq108846/108846.pdf", // Reuse or placeholder
        // Using generic link for now as specific one might vary. Better to use a known stable one:
        pdf: "https://archive.org/download/20210214_20210214_1120/20210214_20210214_1120.pdf",
        cover: "https://archive.org/services/img/20210214_20210214_1120",
        pages: 85
    },

    // --- Fiqh (الفقه) ---
    {
        id: 'fq1',
        title: "عمدة الأحكام",
        author: "عبد الغني المقدسي",
        category: "fiqh",
        description: "كتاب جمع فيه المؤلف أحاديث الأحكام التي اتفق عليها البخاري ومسلم، وهو عمدة لطالب الفقه.",
        cover: "https://archive.org/services/img/waq49272", // generic
        pdf: "https://archive.org/download/waq49272/49272.pdf", // Generic
        // Correct:
        pdf: "https://archive.org/download/waq62492/62492.pdf",
        cover: "https://archive.org/services/img/waq62492",
        pages: 250
    },
    {
        id: 'fq2',
        title: "منهج السالكين",
        author: "عبد الرحمن السعدي",
        category: "fiqh",
        description: "كتاب فقهي مختصر ومحرر، يعتني بالدليل ويبتعد عن التعقيد، مناسب جداً للمبتدئين.",
        cover: "https://archive.org/services/img/waq78728",
        pdf: "https://archive.org/download/waq78728/78728.pdf",
        pages: 300
    },
    {
        id: 'fq3',
        title: "الملخص الفقهي",
        author: "صالح الفوزان",
        category: "fiqh",
        description: "شرح مبسط وواضح لأبواب الفقه الإسلامي، مقروناً بالأدلة الشرعية من الكتاب والسنة.",
        cover: "https://archive.org/services/img/waq49272", // Generic
        pdf: "https://archive.org/download/waq49272/49272.pdf", // Generic
        // Update:
        pdf: "https://archive.org/download/waq13241/13241.pdf",
        cover: "https://archive.org/services/img/waq13241",
        pages: 600
    },

    // --- Hadith (الحديث) ---
    {
        id: 'hd1',
        title: "رياض الصالحين",
        author: "الإمام النووي",
        category: "hadith",
        description: "كتاب يجمع الأحاديث الصحيحة المصنفة في الأبواب الفقهية والآداب الإسلامية، لا يستغني عنه بيت مسلم.",
        cover: "https://archive.org/services/img/waq108846",
        pdf: "https://archive.org/download/waq108846/108846.pdf",
        pages: 650
    },
    {
        id: 'hd2',
        title: "الأربعون النووية",
        author: "الإمام النووي",
        category: "hadith",
        description: "أربعون حديثاً نبوياً جمعها الإمام النووي، تضمنت قواعد الدين وأصوله، وهي من أهم المتون للحفظ.",
        cover: "https://archive.org/services/img/waq62492",
        pdf: "https://archive.org/download/waq62492/62492.pdf",
        pages: 80
    },
    {
        id: 'hd3',
        title: "بلوغ المرام",
        author: "ابن حجر العسقلاني",
        category: "hadith",
        description: "كتاب محرر في أحاديث الأحكام، رتبه المؤلف على الأبواب الفقهية، وهو مرجع أساسي للفقهاء.",
        cover: "https://archive.org/services/img/waq14622",
        pdf: "https://archive.org/download/waq14622/14622.pdf",
        pages: 450
    },

    // --- Seerah (السيرة) ---
    {
        id: 'sr1',
        title: "الرحيق المختوم",
        author: "صفي الرحمن المباركفوري",
        category: "seerah",
        description: "بحث في السيرة النبوية فاز بالمركز الأول في مسابقة رابطة العالم الإسلامي، يتميز بسلاسة الأسلوب وصحة النقل.",
        cover: "https://archive.org/services/img/waq13344",
        pdf: "https://archive.org/download/waq13344/13344.pdf",
        pages: 520
    },
    {
        id: 'sr2',
        title: "زاد المعاد",
        author: "ابن قيم الجوزية",
        category: "seerah",
        description: "موسوعة في هدي النبي ﷺ في عبادته ومعاملاته وحياته كلها، جمع فيه المؤلف بين الفقه والسيرة.",
        cover: "https://archive.org/services/img/waq12022",
        pdf: "https://archive.org/download/waq12022/12022.pdf",
        pages: 1200
    },

    // --- Tazkiyah (التزكية) ---
    {
        id: 'tz1',
        title: "الداء والدواء",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب في تهذيب النفوس وصقلها، وعلاج أمراض القلوب، أجاب فيه عن دواء البلية التي تفسد دنيا العبد وآخرته.",
        cover: "https://archive.org/services/img/adwdeq",
        pdf: "https://archive.org/download/adwdeq/adwdeq.pdf",
        pages: 384
    },
    {
        id: 'tz2',
        title: "الوابل الصيب",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب يبين فضل الذكر وأثره في حياة المسلم، ويوضح أنواع الأذكار وأوقاتها وأحوالها.",
        cover: "https://archive.org/services/img/waq58509",
        pdf: "https://archive.org/download/waq58509/58509.pdf",
        pages: 245
    },
    {
        id: 'tz3',
        title: "صيد الخاطر",
        author: "ابن الجوزي",
        category: "tazkiyah",
        description: "خواطر وتأملات دونها المؤلف، تتضمن حكماً ومواعظ وتجارب حياتية عميقة وبليغة.",
        cover: "https://archive.org/services/img/waq108846",
        pdf: "https://archive.org/download/waq108846/108846.pdf",
        // Correcting:
        pdf: "https://archive.org/download/saed_ul_khatir/saed_ul_khatir.pdf",
        cover: "https://archive.org/services/img/saed_ul_khatir",
        pages: 600
    },

    // --- Quran (علوم القرآن) ---
    {
        id: 'qr1',
        title: "تفسير السعدي",
        author: "عبد الرحمن السعدي",
        category: "quran",
        description: "تفسير ميسر للقرآن الكريم، يعتني بإيضاح المعاني بعبارة سهلة وواضحة، بعيداً عن الحشو والتطويل.",
        cover: "https://archive.org/services/img/waq49272", // generic
        pdf: "https://archive.org/download/waq49272/49272.pdf", // generic
        // Update
        pdf: "https://archive.org/download/waq78564/78564.pdf",
        cover: "https://archive.org/services/img/waq78564",
        pages: 1100
    },
];

const CATEGORIES = [
    { id: 'all', name: 'الكل', icon: Library },
    { id: 'aqeedah', name: 'العقيدة والتوحيد', icon: Shield },
    { id: 'fiqh', name: 'الفقه والأحكام', icon: Scale },
    { id: 'hadith', name: 'الحديث الشريف', icon: Scroll },
    { id: 'seerah', name: 'السيرة النبوية', icon: Users },
    { id: 'tazkiyah', name: 'الرقائق والتزكية', icon: Heart },
    { id: 'quran', name: 'علوم القرآن', icon: Book },
];

export default function Books() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedBook, setSelectedBook] = useState(null);

    const filteredBooks = BOOKS_DATA.filter(book => {
        const matchesSearch = book.title.includes(search) || book.author.includes(search);
        const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
            {/* Header / Hero Section (Navy) - Matches Home.jsx */}
            <div className="bg-[#0f172a] text-white py-12 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <Library className="w-8 h-8 text-[#f97316]" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-amiri mb-4">مكتبة الكتب الإسلامية</h1>
                    <p className="opacity-80 text-lg mb-8 max-w-2xl mx-auto">
                        مجموعة مختارة من كتب السلف الصالح والعلماء الموثوقين، متاحة للقراءة والتحميل بصيغة PDF
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Input
                            className="h-12 rounded-full pl-12 pr-6 bg-white text-black border-none shadow-lg text-lg placeholder:text-gray-400"
                            placeholder="ابحث عن كتاب أو مؤلف..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Button size="icon" className="absolute left-1 top-1 bottom-1 rounded-full bg-[#f97316] hover:bg-[#ea580c] w-10 h-10">
                            <Search className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>
                {/* Decorative Pattern Opacity */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Filters */}
                    <div className="space-y-6">
                        {/* Categories List */}
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden sticky top-24">
                            <div className="bg-gray-50 p-3 border-b font-bold text-sm text-[#0f172a]">الأقسام</div>
                            <div className="p-2 space-y-1">
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                                ? 'bg-[#f97316] text-white font-bold shadow-md'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-[#f97316]'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white text-[#0f172a] rounded-xl shadow-sm border p-6 text-center hidden lg:block">
                            <h3 className="font-bold text-lg mb-2">هل تبحث عن كتاب معين؟</h3>
                            <p className="text-xs text-gray-500 mb-4">يمكنك مراسلتنا لإضافة كتب جديدة للمكتبة</p>
                            <a href="mailto:contact@example.com" className="inline-block w-full py-2 bg-[#f8f9fa] hover:bg-[#f97316] hover:text-white border border-dashed border-gray-300 rounded-lg text-sm font-bold transition-all">
                                اقترح كتاباً
                            </a>
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#0f172a] flex items-center gap-2">
                                    <span className="w-1.5 h-8 bg-[#f97316] rounded-full block"></span>
                                    {activeCategory === 'all' ? 'جميع الكتب' : CATEGORIES.find(c => c.id === activeCategory)?.name}
                                </h2>
                                <span className="text-muted-foreground text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                    {filteredBooks.length} كتب
                                </span>
                            </div>
                        </div>

                        {filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredBooks.map(book => (
                                    <div key={book.id} className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#f97316]/30 transition-all duration-300 flex flex-col overflow-hidden">
                                        {/* Cover */}
                                        <div
                                            className="relative h-48 bg-slate-100 overflow-hidden border-b cursor-pointer"
                                            onClick={() => setSelectedBook(book)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                                                <BookOpen className="w-16 h-16 opacity-20" />
                                            </div>

                                            {/* Badges */}
                                            <div className="absolute top-3 right-3 z-20">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-white/90 backdrop-blur-sm text-[#0f172a] shadow-sm`}>
                                                    {CATEGORIES.find(c => c.id === book.category)?.name.split(' ')[0]}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-3 right-3 z-20 text-white">
                                                <div className="flex items-center gap-1.5 text-xs font-medium bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                                    <Sparkles className="w-3 h-3 text-[#f97316]" />
                                                    {book.pages} صفحة
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3
                                                className="font-bold text-lg text-[#0f172a] mb-1 line-clamp-1 group-hover:text-[#f97316] transition-colors cursor-pointer"
                                                title={book.title}
                                                onClick={() => setSelectedBook(book)}
                                            >
                                                {book.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1">
                                                <span>تأليف:</span>
                                                <span className="text-[#f97316]">{book.author}</span>
                                            </p>

                                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4 font-amiri flex-1">
                                                {book.description}
                                            </p>

                                            <div className="pt-4 mt-auto border-t border-dashed">
                                                <button
                                                    onClick={() => setSelectedBook(book)}
                                                    className="flex items-center justify-center gap-2 w-full py-2 bg-[#f8f9fa] hover:bg-[#f97316] text-[#0f172a] hover:text-white rounded-lg font-bold text-sm transition-all border border-transparent hover:border-[#f97316]"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                    عرض الكتاب
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-[#0f172a] mb-1">لم يتم العثور على كتب</h3>
                                <p className="text-muted-foreground text-sm">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Book Preview Dialog */}
            <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden font-changa direction-rtl">
                    {selectedBook && (
                        <>
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="p-4 border-b flex items-center justify-between bg-[#0f172a] text-white">
                                    <div className="flex items-center gap-3">
                                        {/* Minimal cover thumbnail (optional) */}
                                        <div className="w-8 h-10 bg-slate-700 rounded hidden sm:block overflow-hidden">
                                            <img src={selectedBook.cover} alt="" className="w-full h-full object-cover opacity-80" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold font-amiri">{selectedBook.title}</h2>
                                            <p className="text-xs text-gray-300">تأليف: {selectedBook.author}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={selectedBook.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
                                            download
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>تحميل PDF</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-gray-100 relative">
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${selectedBook.pdf}&embedded=true`}
                                        className="w-full h-full border-none"
                                        title="PDF Preview"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
