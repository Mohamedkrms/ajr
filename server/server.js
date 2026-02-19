require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { JSDOM } = require("jsdom");
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

// Helper to remove tashkeel and normalize text for search
function normalizeText(text) {
    if (!text) return '';

    // Normalize Alif variants (ٱ, آ, أ, إ -> ا)
    let normalized = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
    normalized = normalized.replace(/[إأآٱ]/g, 'ا');

    // Normalize Taa Marbuta (ة -> ه) - Common in search
    normalized = normalized.replace(/ة/g, 'ه');

    // Normalize Yaa / Alif Maqsura (ى -> ي)
    normalized = normalized.replace(/ى/g, 'ي');

    return normalized;
}

// ─── Search ───────────────────────────────────────────
const quranData = require('./data/quran.json');

// ─── Search ───────────────────────────────────────────
app.get('/api/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ code: 200, data: { matches: [] } });

        const normalizedQuery = normalizeText(q);

        const matches = [];
        const LIMIT = 50;

        // Limit results to prevent huge payload


        for (const surah of quranData) {
            for (const verse of surah.verses) {
                const normalizedText = normalizeText(verse.text);

                // Check for exact word match or substring? 
                // Substring is safer for general search.
                if (normalizedText.includes(normalizedQuery)) {
                    matches.push({
                        number: verse.id,
                        text: verse.text,
                        surah: {
                            number: surah.id,
                            name: surah.name,
                            englishName: surah.transliteration,
                            revelationType: surah.type
                        },
                        numberInSurah: verse.id
                    });
                    if (matches.length >= LIMIT) break;
                }
            }
            if (matches.length >= LIMIT) break;
        }


        res.json({
            code: 200,
            status: "OK",
            data: {
                count: matches.length,
                matches: matches
            }
        });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ message: 'Error searching' });
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

// ─── Dorar.net API Proxy ─────────────────────────────────────────────────────

// Helper to remove tashkeel (diacritics)
function removeTashkeel(text) {
    return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
}

// Helper: parse takhrij HTML from Dorar API
function parseTakhrijHTML(htmlResult) {
    const dom = new JSDOM(htmlResult);
    const doc = dom.window.document;
    const hadiths = [];
    const hadithDivs = doc.querySelectorAll('div.hadith');

    hadithDivs.forEach((div) => {
        const text = div.textContent.trim();
        const infoDiv = div.nextElementSibling;
        let rawi = "", muhadith = "", source = "", number = "", grade = "";

        if (infoDiv && infoDiv.className.includes("hadith-info")) {
            const spans = infoDiv.querySelectorAll("span.info-subtitle");
            spans.forEach((span) => {
                const key = span.textContent.replace(":", "").trim();
                // Collect text from all following siblings until next info-subtitle
                let value = '';
                let node = span.nextSibling;
                while (node) {
                    if (node.nodeType === 1 && node.classList?.contains('info-subtitle')) break;
                    value += node.textContent || '';
                    node = node.nextSibling;
                }
                value = value.replace(/[\[\]]/g, '').trim();
                switch (key) {
                    case "الراوي": rawi = value; break;
                    case "المحدث": muhadith = value; break;
                    case "المصدر": source = value; break;
                    case "الصفحة أو الرقم": number = value; break;
                    case "خلاصة حكم المحدث": grade = value; break;
                }
            });
        }
        hadiths.push({ text, rawi, muhadith, source, number, grade });
    });
    // Sort by grade strength: صحيح (strongest) → ضعيف (weakest)
    hadiths.sort((a, b) => gradeRank(a.grade) - gradeRank(b.grade));
    return hadiths;
}

// Rank hadith grade: lower = stronger (check specific grades BEFORE generic)
function gradeRank(grade) {
    if (!grade) return 99;
    const g = grade.trim();
    if (g.includes('متواتر')) return 0;           // Mutawatir (highest)
    if (g.includes('موضوع')) return 10;           // Fabricated (lowest)
    if (g.includes('لا أصل له')) return 9;        // No basis
    if (g.includes('منكر')) return 8;             // Rejected
    if (g.includes('ضعيف جدا')) return 7;         // Very weak
    if (g.includes('ضعيف')) return 6;             // Weak
    if (g.includes('لا بأس به')) return 5;        // Acceptable
    if (g.includes('إسناده حسن')) return 4;       // Good chain
    if (g.includes('إسناده صحيح')) return 3;      // Authentic chain
    if (g.includes('حسن')) return 2;              // Good
    if (g.includes('صحيح')) return 1;             // Authentic
    return 50;
}

// Helper: parse sharh HTML from Dorar website
function parseSharhHTML(html) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const results = [];

    // Dorar sharh page uses div.hadith-sharh or similar patterns
    // The sharh search with t=3 returns sharh content alongside hadiths
    const sharhDivs = doc.querySelectorAll('.sharh, .hadith-sharh, [class*="sharh"]');

    if (sharhDivs.length > 0) {
        sharhDivs.forEach(div => {
            results.push(div.textContent.trim());
        });
    }

    // Also try to extract from the general result structure
    if (results.length === 0) {
        // Fallback: look for any text content that looks like sharh
        const allDivs = doc.querySelectorAll('div.hadith');
        allDivs.forEach(div => {
            const text = div.textContent.trim();
            if (text.length > 50) {
                results.push(text);
            }
        });
    }

    return results;
}

// Normalize Arabic text: remove tashkeel + replace all punctuation with spaces + collapse spaces
function normalizeArabic(text) {
    if (!text) return '';
    // Remove tashkeel
    let t = removeTashkeel(text);
    // Replace ﷺ with spelled out form
    t = t.replace(/\uFDFA/g, 'صلى الله عليه وسلم');
    // Replace all non-Arabic-letter, non-space chars with space (removes ، ـ " . etc)
    t = t.replace(/[^\u0621-\u064A\s]/g, ' ');
    // Collapse multiple spaces
    t = t.replace(/\s+/g, ' ').trim();
    return t;
}

// Extract matn (Prophet's actual words) from full hadith text that includes isnad
function extractMatn(fullText) {
    if (!fullText) return fullText;

    const normalized = normalizeArabic(fullText);
    console.log(`[Dorar] Normalized text: "${normalized.slice(0, 120)}..."`);

    // Separator phrases: everything AFTER these is the matn
    const separators = [
        'قال رسول الله صلى الله عليه وسلم',
        'قال النبي صلى الله عليه وسلم',
        'يقول رسول الله صلى الله عليه وسلم',
        'سمعت رسول الله صلى الله عليه وسلم يقول',
        'سمعت النبي صلى الله عليه وسلم يقول',
        'ان رسول الله صلى الله عليه وسلم قال',
        'ان النبي صلى الله عليه وسلم قال',
        'عن رسول الله صلى الله عليه وسلم انه قال',
        'عن النبي صلى الله عليه وسلم انه قال',
        'عن رسول الله صلى الله عليه وسلم قال',
        'عن النبي صلى الله عليه وسلم قال',
        'رسول الله صلى الله عليه وسلم',
        'النبي صلى الله عليه وسلم',
    ];

    for (const sep of separators) {
        const idx = normalized.indexOf(sep);
        if (idx >= 0) {
            const afterSep = normalized.slice(idx + sep.length).trim();
            if (afterSep.length > 10) {
                console.log(`[Dorar] ✓ Extracted matn: "${afterSep.slice(0, 80)}..."`);
                return afterSep;
            }
        }
    }

    // Fallback: if starts with isnad words, find the LAST "قال" and take text after it
    const isnadStarters = ['حدثنا', 'اخبرنا', 'حدثني', 'اخبرني', 'وحدثني', 'وحدثنا'];
    const firstWord = normalized.split(' ')[0];
    if (isnadStarters.includes(firstWord)) {
        // Find all occurrences of "قال" and use the last one
        let lastQalaIdx = -1;
        let searchFrom = 0;
        while (true) {
            const idx = normalized.indexOf('قال', searchFrom);
            if (idx === -1) break;
            lastQalaIdx = idx;
            searchFrom = idx + 3;
        }
        if (lastQalaIdx > 10) {
            const afterQala = normalized.slice(lastQalaIdx + 3).trim();
            if (afterQala.length > 10) {
                console.log(`[Dorar] ✓ Extracted matn (fallback قال): "${afterQala.slice(0, 80)}..."`);
                return afterQala;
            }
        }
    }

    console.log(`[Dorar] ✗ Could not extract matn, using full text`);
    return normalized;
}

app.get('/api/hadith/sharh', async (req, res) => {
    try {
        const { text } = req.query;
        if (!text) return res.status(400).json({ error: 'text required' });

        // Extract matn (actual hadith text, not isnad/chain) - extractMatn handles normalization
        const matn = extractMatn(text);
        // Take first 8 words for search
        const searchWords = removeTashkeel(matn).split(/\s+/).filter(w => w.length > 1).slice(0, 8).join(' ');
        const encoded = encodeURIComponent(searchWords);

        console.log(`[Dorar] Searching for: "${searchWords}"`);

        // Make two parallel calls: one for takhrij, one for sharh
        const [takhrijRes, sharhRes] = await Promise.allSettled([
            // 1) Takhrij from Dorar API
            fetch(`https://dorar.net/dorar_api.json?skey=${encoded}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(10000)
            }).then(r => r.json()),

            // 2) Sharh from Dorar API (t=3 scope = شروح الأحاديث)
            fetch(`https://dorar.net/dorar_api.json?skey=${encoded}&t=3`, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(10000)
            }).then(r => r.json())
        ]);

        // Parse takhrij results
        let takhrij = [];
        if (takhrijRes.status === 'fulfilled') {
            const htmlResult = takhrijRes.value.ahadith?.result;
            if (htmlResult && !htmlResult.includes('لا يوجد نتائج')) {
                takhrij = parseTakhrijHTML(htmlResult);
            }
        }

        // Parse sharh results
        let sharh = [];
        if (sharhRes.status === 'fulfilled') {
            const sharhHtml = sharhRes.value.ahadith?.result;
            if (sharhHtml && !sharhHtml.includes('لا يوجد نتائج')) {
                const sharhParsed = parseTakhrijHTML(sharhHtml);
                sharh = sharhParsed;
            }
        }

        const found = takhrij.length > 0 || sharh.length > 0;
        res.json({ found, takhrij, sharh });

    } catch (error) {
        console.error('Dorar proxy error:', error.message);
        res.json({ found: false, takhrij: [], sharh: [] });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

