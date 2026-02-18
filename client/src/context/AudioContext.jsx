import { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioContext = createContext();

export function useAudio() {
    return useContext(AudioContext);
}

export function AudioProvider({ children }) {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentReciter, setCurrentReciter] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const playTrack = (track, list = [], reciter = null, index = -1) => {
        setCurrentAudio(track);
        setIsPlaying(true);
        if (list.length > 0) {
            setPlaylist(list);
            setCurrentIndex(index);
        }
        if (reciter) {
            setCurrentReciter(reciter);
        }
    };

    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    const playNext = () => {
        if (currentIndex < playlist.length - 1 && currentIndex !== -1 && currentReciter) {
            const nextIndex = currentIndex + 1;
            const nextSurah = playlist[nextIndex];

            const chapterNum = String(nextSurah.id).padStart(3, '0');
            const url = `https://download.quranicaudio.com/quran/${currentReciter.slug}/${chapterNum}.mp3`;

            setCurrentAudio({
                url,
                title: nextSurah.name_arabic,
                reciter: currentReciter.name,
            });
            setCurrentIndex(nextIndex);
            setIsPlaying(true);
        }
    };

    const playPrev = () => {
        if (currentIndex > 0 && currentReciter) {
            const prevIndex = currentIndex - 1;
            const prevSurah = playlist[prevIndex];

            const chapterNum = String(prevSurah.id).padStart(3, '0');
            const url = `https://download.quranicaudio.com/quran/${currentReciter.slug}/${chapterNum}.mp3`;

            setCurrentAudio({
                url,
                title: prevSurah.name_arabic,
                reciter: currentReciter.name,
            });
            setCurrentIndex(prevIndex);
            setIsPlaying(true);
        }
    };

    const value = {
        currentAudio,
        isPlaying,
        setIsPlaying,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
        playlist,
        currentReciter,
        currentIndex,
        hasNext: currentIndex < playlist.length - 1 && currentIndex !== -1,
        hasPrev: currentIndex > 0
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}
