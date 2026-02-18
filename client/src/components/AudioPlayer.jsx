import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Download } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/context/AudioContext";

function AudioPlayer() {
    const { currentAudio, isPlaying, setIsPlaying, playNext, playPrev, hasNext, hasPrev, togglePlay, clearAudio } = useAudio();
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
    }, [volume, muted]);

    useEffect(() => {
        if (!currentAudio) return;

        // If the audio source changes, we load it.
        // We only auto-play if isPlaying is true, which it should be when set from context.
        if (audioRef.current) {
            // Check if source changed or just re-rendered
            const srcChanged = audioRef.current.src !== currentAudio.url;
            if (srcChanged) {
                audioRef.current.src = currentAudio.url;
                audioRef.current.load();
                if (isPlaying) {
                    audioRef.current.play().catch(e => console.error("Play error:", e));
                }
            } else {
                // specific case: if identical source (maybe restarting?), but here we assume persistence.
                // if isPlaying changed from false to true via context elsewhere?
                if (isPlaying && audioRef.current.paused) {
                    audioRef.current.play().catch(e => console.error("Play error:", e));
                } else if (!isPlaying && !audioRef.current.paused) {
                    audioRef.current.pause();
                }
            }
        }
    }, [currentAudio, isPlaying]);

    // Handle Play/Pause toggle from UI
    const handleTogglePlay = () => {
        togglePlay();
        // The effect above will handle the actual audio play/pause
    };

    const handleSeek = (val) => {
        if (audioRef.current && duration) {
            const time = (val[0] / 100) * duration;
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (t) => {
        if (isNaN(t)) return '0:00';
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleDownload = async () => {
        if (!currentAudio) return;
        try {
            const response = await fetch(currentAudio.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentAudio.title}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback
            const link = document.createElement('a');
            link.href = currentAudio.url;
            link.download = `${currentAudio.title}.mp3`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!currentAudio) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] py-2">
            <audio
                ref={audioRef}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={() => {
                    setIsPlaying(false);
                    if (hasNext) playNext();
                }}
            />

            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">

                {/* Track Info */}
                <div className="flex items-center gap-3 w-full md:w-1/4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ♫
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{currentAudio.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentAudio.reciter}</p>
                    </div>
                </div>

                {/* Controls - Centered */}
                <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={playPrev} disabled={!hasPrev} className="h-8 w-8 text-muted-foreground">
                            <SkipForward className="w-4 h-4 fill-current" />
                        </Button>
                        <Button onClick={handleTogglePlay} size="icon" className="h-10 w-10 rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={playNext} disabled={!hasNext} className="h-8 w-8 text-muted-foreground">
                            <SkipBack className="w-4 h-4 fill-current" />
                        </Button>
                    </div>

                    <div className="w-full flex items-center gap-2 text-xs font-mono text-muted-foreground dir-ltr">
                        <span className="w-8 text-right">{formatTime(currentTime)}</span>
                        <Slider
                            value={[duration ? (currentTime / duration) * 100 : 0]}
                            max={100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="flex-1"
                        />
                        <span className="w-8">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="hidden md:flex items-center justify-end w-1/4 gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)} className="h-8 w-8 cursor-pointer">
                        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Slider
                        value={[muted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={v => { setVolume(v[0]); setMuted(false); }}
                        className="w-20"
                    />

                    <div className="w-px h-6 bg-border mx-2" />

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground  hover:bg-slate-100  cursor-pointer" onClick={handleDownload} title="تحميل">
                        <Download className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={clearAudio} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer" title="إغلاق">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AudioPlayer;
