const quranData = require('./server/data/quran.json');

function normalize(text) {
    // Remove Tashkeel (diacritics)
    let normalized = text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');

    // Normalize Alif variants
    normalized = normalized.replace(/[إأآٱ]/g, 'ا');

    // Normalize Yaa/Alif Maqsura
    // normalized = normalized.replace(/ى/g, 'ي'); // Sometimes needed, sometimes not depending on input

    // Normalize Taa Marbuta
    // normalized = normalized.replace(/ة/g, 'ه'); // Use caution

    return normalized;
}

const query = "الله";
const normalizedQuery = normalize(query);

console.log(`Query: ${query} -> Normalized: ${normalizedQuery}`);

console.log("Checking first surah 5 verses...");
const verses = quranData[0].verses.slice(0, 5);

verses.forEach(v => {
    const norm = normalize(v.text);
    const match = norm.includes(normalizedQuery);
    console.log(`Verse ${v.id}: ${v.text}`);
    console.log(`Normalized: ${norm}`);
    console.log(`Match: ${match}`);
    console.log('---');
});
