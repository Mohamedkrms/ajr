import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Book, Headphones, Bookmark, PenLine, Search, Menu, ScrollText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = useMemo(() => [
        { to: '/', label: 'القرآن', icon: Book },
        { to: '/sunnah', label: 'السنة', icon: ScrollText },
        { to: '/listen', label: 'الاستماع', icon: Headphones },
        { to: '/bookmarks', label: 'المفضلة', icon: Bookmark },
        { to: '/blog', label: 'المدونة', icon: PenLine },
    ], []);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = e.target.search.value.trim();
        if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
            e.target.reset();
        }
    };

    return (
        // Navy Blue Background (#0f172a) from theme
        <header className="sticky top-0 z-50 w-full bg-[#0f172a] text-white shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        {/* Orange Icon */}
                        <div className="w-8 h-8 rounded bg-[#f97316] flex items-center justify-center text-white font-amiri font-bold text-lg shadow-sm group-hover:bg-[#ea580c] transition-colors">
                            أ
                        </div>
                        <div className="hidden sm:block leading-none">
                            <h1 className="text-xl font-bold tracking-wide">القرآن الكريم</h1>
                        </div>
                    </Link>

                    {/* Desktop Nav - White text, Orange hover */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => {
                            const active = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                                        ${active
                                            ? 'bg-white/10 text-[#f97316]'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Search & Mobile */}
                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="hidden lg:block relative">
                        <Input
                            name="search"
                            type="search"
                            placeholder="بحث في السور..."
                            className="w-64 h-9 pr-4 pl-10 bg-white/10 border-transparent text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-[#f97316] transition-all rounded-full text-sm"
                        />
                        <button type="submit" className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#f97316] rounded-full hover:bg-[#ea580c] transition-colors text-white">
                            <Search className="w-3 h-3" />
                        </button>
                    </form>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-0 border-l-[#f97316] rtl">
                            <div className="p-6 bg-[#0f172a] text-white">
                                <Link to="/" className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#f97316] rounded flex items-center justify-center font-bold text-2xl">
                                        أ
                                    </div>
                                    <span className="font-bold text-xl">القرآن الكريم</span>
                                </Link>
                            </div>
                            <div className="flex flex-col p-2">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="flex items-center gap-3 px-4 py-3 rounded-md text-foreground hover:bg-muted font-medium"
                                    >
                                        <link.icon className="w-5 h-5 text-muted-foreground" />
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
