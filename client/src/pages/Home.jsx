import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In production, this would hit our backend which proxies to Quran API
        // For now, hitting backend which should be proxying or returning mock
        axios.get('http://localhost:5000/api/surahs')
            .then(response => {
                setSurahs(response.data.chapters || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="surah-list">
            {surahs.map(surah => (
                <Link to={`/surah/${surah.id}`} key={surah.id} className="surah-card">
                    <div className="surah-number">{surah.id}</div>
                    <div className="surah-info">
                        <h3>{surah.name_simple}</h3>
                        <p>{surah.translated_name.name}</p>
                    </div>
                    <div className="surah-arabic">{surah.name_arabic}</div>
                </Link>
            ))}
        </div>
    );
}

export default Home;
