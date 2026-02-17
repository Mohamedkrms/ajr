require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/quran_app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Ajr API Running');
});

// ─── Surahs ───────────────────────────────────────────
app.get('/api/surahs', async (req, res) => {
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

// ─── Reciters ─────────────────────────────────────────
app.get('/api/reciters', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.quran.com/api/v4/resources/recitations');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching reciters:', error);
        res.status(500).json({ message: 'Error fetching reciters' });
    }
});

// ─── Bookmarks ────────────────────────────────────────
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

// ─── Blog Posts ───────────────────────────────────────
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
