import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Menu, LogIn, X, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useAudio } from '@/context/AudioContext';

function Navbar() {
    const navigate = useNavigate();
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const { currentAudio, isPlaying, togglePlay } = useAudio();

    const handleSearch = (e) => {
        e.preventDefault();
        const q = e.target.search.value.trim();
        if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
            e.target.reset();
            setMobileSearchOpen(false);
        }
    };

    return (
        <header
            className="sticky top-0 z-50 w-full bg-[#0f172a] text-white"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
            <div className="px-4 h-14 flex items-center justify-between gap-4">

                {/* Logo + hamburger */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
                        className="md:hidden p-2 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="القائمة"
                    >
                        <Menu className="w-5 h-5 text-gray-300" />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="فردوس" className="w-28 h-14 object-contain" />
                    </Link>
                </div>

                {/* Center Search Bar — Desktop */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-auto">
                    <div className="relative w-full flex">
                        <Input
                            name="search"
                            type="search"
                            placeholder="ابحث في القرآن والسنة..."
                            className="w-full h-9 pr-4 pl-11 text-sm text-white placeholder:text-gray-500 rounded-full transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        />
                        <button
                            type="submit"
                            className="absolute left-0.5 top-1/2 -translate-y-1/2 p-2 bg-[#f97316] rounded-full hover:bg-[#ea580c] transition-colors text-white"
                        >
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </form>

                {/* Mobile Now Playing + Search + Auth */}
                <div className="flex items-center gap-2 flex-shrink-0">

                    {/* Mobile now-playing pill */}

                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        {mobileSearchOpen ? <X className="w-5 h-5 text-gray-300" /> : <Search className="w-5 h-5 text-gray-300" />}
                    </button>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="default" className="bg-[#f97316] hover:bg-[#ea580c] text-white flex items-center gap-2 text-xs h-8 px-3.5 rounded-full">
                                <LogIn className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">تسجيل الدخول</span>
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                    </SignedIn>
                </div>
            </div>

            {/* Mobile Search Dropdown */}
            {mobileSearchOpen && (
                <div className="md:hidden px-4 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <form onSubmit={handleSearch} className="relative mt-2">
                        <Input
                            name="search"
                            type="search"
                            placeholder="ابحث في القرآن والسنة..."
                            autoFocus
                            className="w-full h-9 pr-4 pl-11 text-sm text-white placeholder:text-gray-500 rounded-full transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        />
                        <button type="submit" className="absolute left-0.5 top-1/2 -translate-y-1/2 p-2 bg-[#f97316] rounded-full hover:bg-[#ea580c] transition-colors text-white">
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
}

export default Navbar;
