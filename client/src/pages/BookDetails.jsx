import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Download, User, Layers, FileText, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SEO from '@/components/SEO';
import BOOKS_DATA from '../components/Booksdata';

export default function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const book = BOOKS_DATA.find(b => b.id.toString() === id);

    useEffect(() => {
        if (!book) {
            navigate('/books', { replace: true });
        }
        window.scrollTo(0, 0);
    }, [book, navigate]);

    if (!book) return null;

    const pageUrl = `${window.location.origin}/books/${book.id}`;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-24 font-changa" dir="rtl">
            <SEO
                title={`كتاب ${book.title} - تحميل وقراءة`}
                description={book.description.substring(0, 150) + '...'}
                keywords={`كتاب ${book.title}, ${book.author}, تحميل ${book.title} pdf, قراءة كتب إسلامية`}
                url={`/books/${book.id}`}
                image={book.cover}
                type="book"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Book",
                    "name": book.title,
                    "author": {
                        "@type": "Person",
                        "name": book.author
                    },
                    "numberOfPages": book.pages,
                    "inLanguage": "ar",
                    "description": book.description,
                    "image": book.cover
                }}
            />

            {/* Header Area */}
            <div className="bg-[#0f172a] pt-8 pb-32 text-white relative">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                <div className="container mx-auto px-4 relative z-10">
                    <Link to="/books" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8">
                        <ArrowRight className="w-4 h-4" />
                        العودة للمكتبة
                    </Link>
                </div>
            </div>

            {/* Book Details Card */}
            <div className="container mx-auto px-4 -mt-24 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 mb-8 max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                        {/* Cover Image */}
                        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 aspect-[2/3] relative">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
                                    <BookOpen className="w-20 h-20 opacity-20" />
                                </div>
                            </div>
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-[#f97316] rounded-full">
                                    {book.category}
                                </span>
                                <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {book.pages} صفحة
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-amiri font-bold text-[#0f172a] mb-4 leading-tight">
                                {book.title}
                            </h1>

                            <div className="flex items-center gap-2 text-gray-600 mb-6 font-medium">
                                <User className="w-5 h-5 text-[#f97316]" />
                                <span>تأليف: {book.author}</span>
                            </div>

                            <div className="prose prose-sm md:prose-base text-gray-600 mb-8 font-amiri leading-relaxed max-w-none border-t border-b border-dashed py-6">
                                <p>{book.description}</p>
                            </div>

                            <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="bg-[#f97316] hover:bg-[#ea580c] text-white gap-2 h-12 px-8 rounded-full shadow-lg shadow-orange-500/20 text-lg flex-1 sm:flex-none"
                                    onClick={() => window.open(book.pdf, '_blank')}
                                >
                                    <BookOpen className="w-5 h-5 fill-current" />
                                    قراءة الكتاب
                                </Button>

                                <a
                                    href={book.pdf}
                                    download={`${book.title}.pdf`}
                                    className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-bold transition-colors flex-1 sm:flex-none border"
                                >
                                    <Download className="w-5 h-5" />
                                    تحميل PDF
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional: PDF Embed Area (Can be conditionally rendered if requested) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-5xl mx-auto h-[800px]">
                    <div className="bg-gray-50 border-b p-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-[#f97316]" />
                        <h3 className="font-bold text-[#0f172a]">معاينة الكتاب</h3>
                    </div>
                    <iframe
                        src={`https://docs.google.com/viewer?url=${book.pdf}&embedded=true`}
                        className="w-full h-full border-none bg-gray-100"
                        title={`معاينة كتاب ${book.title}`}
                    />
                </div>
            </div>
        </div>
    );
}
