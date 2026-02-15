require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/quran_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Quran App API Running');
});

// Simple proxy route for Surahs (fetching from an external API or local source in future)
app.get('/api/surahs', async (req, res) => {
    // Placeholder: Return a static list or fetch from quran.com API
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.quran.com/api/v4/chapters');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching surahs:', error);
        res.status(500).json({ message: 'Error fetching surahs' });
    }
});

// Bookmark Route
const BookmarkSchema = new mongoose.Schema({
    surahNumber: Number,
    ayahNumber: Number,
    note: String,
    date: { type: Date, default: Date.now }
});
const Bookmark = mongoose.model('Bookmark', BookmarkSchema);

app.post('/api/bookmarks', async (req, res) => {
    try {
        const { surahNumber, ayahNumber, note } = req.body;
        const newBookmark = new Bookmark({ surahNumber, ayahNumber, note });
        await newBookmark.save();
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ message: 'Error saving bookmark' });
    }
});

app.get('/api/bookmarks', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ date: -1 });
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookmarks' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
