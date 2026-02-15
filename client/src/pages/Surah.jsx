import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Surah() {
    const { id } = useParams();
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching verses for the surah from quran.com API directly for now since backend proxy only does list
        // Ideally backend should handle this too to hide API keys or manage rate limits
        axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`)
            .then(response => {
                setVerses(response.data.verses || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching verses:', error);
                setLoading(false);
            });
    }, [id]);

    const handleBookmark = (verseKey) => {
        const [surahNum, ayahNum] = verseKey.split(':');
        axios.post('http://localhost:5000/api/bookmarks', {
            surahNumber: surahNum,
            ayahNumber: ayahNum,
            note: `Bookmarked at ${new Date().toLocaleTimeString()}`
        })
            .then(() => alert('Bookmark saved!'))
            .catch(err => console.error('Error saving bookmark:', err));
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="surah-container">
            <h2>Surah {id}</h2>
            <div className="verses">
                {verses.map(verse => (
                    <div key={verse.id} className="verse">
                        <span className="verse-text">{verse.text_uthmani}</span>
                        <span className="verse-number">({verse.verse_key})</span>
                        <button onClick={() => handleBookmark(verse.verse_key)} className="bookmark-btn">
                            Bookmark
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Surah;
