import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function AudioPlayer({ audioUrl, title, reciter, onNext, onPrev }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
    }, [volume, muted]);

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-5px_20px_rgba(0,0,0,0.05)] py-2">
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={() => { setIsPlaying(false); onNext?.(); }}
            />

            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">

                {/* Track Info */}
                <div className="flex items-center gap-3 w-full md:w-1/4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        ♫
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{title}</p>
                        <p className="text-xs text-muted-foreground truncate">{reciter}</p>
                    </div>
                </div>

                {/* Controls - Centered */}
                <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onNext} disabled={!onNext} className="h-8 w-8 text-muted-foreground">
                            <SkipBack className="w-4 h-4 fill-current" />
                        </Button>
                        <Button onClick={togglePlay} size="icon" className="h-10 w-10 rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onPrev} disabled={!onPrev} className="h-8 w-8 text-muted-foreground">
                            <SkipForward className="w-4 h-4 fill-current" />
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

                {/* Volume */}
                <div className="hidden md:flex items-center justify-end w-1/4 gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)} className="h-8 w-8">
                        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Slider
                        value={[muted ? 0 : volume]}
                        max={1}
                        step={0.01}
                        onValueChange={v => { setVolume(v[0]); setMuted(false); }}
                        className="w-20"
                    />
                </div>
            </div>
        </div>
    );
}

export default AudioPlayer;
