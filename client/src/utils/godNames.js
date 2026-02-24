export const GOD_NAMES = [
    "الله", "الإله",
    "الرحمن", "الرحيم", "الملك", "القدوس", "السلام", "المؤمن", "المهيمن", "العزيز", "الجبار", "المتكبر",
    "الخالق", "البارئ", "المصور", "الغفار", "القهار", "الوهاب", "الرزاق", "الفتاح", "العليم",
    "القابض", "الباسط", "الخافض", "الرافع", "المعز", "المذل", "السميع", "البصير", "الحكم", "العدل",
    "اللطيف", "الخبير", "الحليم", "العظيم", "الغفور", "الشكور", "العلي", "الكبير", "الحفيظ", "المقيت",
    "الحسيب", "الجليل", "الكريم", "الرقيب", "المجيب", "الواسع", "الحكيم", "الودود", "المجيد", "الباعث",
    "الشهيد", "الحق", "الوكيل", "القوي", "المتين", "الولي", "الحميد", "المحصي", "المبدئ", "المعيد",
    "المحيي", "المميت", "الحي", "القيوم", "الواجد", "الماجد", "الواحد", "الصمد", "القادر", "المقتدر",
    "المقدم", "المؤخر", "الأول", "الآخر", "الظاهر", "الباطن", "الوالي", "المتعالي", "البر", "التواب",
    "المنتقم", "العفو", "الرؤوف", "مالك الملك", "ذو الجلال والإكرام", "المقسط", "الجامع", "الغني", "المغني",
    "المانع", "الضار", "النافع", "النور", "الهادي", "البديع", "الباقي", "الوارث", "الرشيد", "الصبور",
    "الأحد"
];

export const removeDiacritics = (text) => {
    if (!text) return '';
    let clean = text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    // Normalize alef wasla (ٱ) to regular alef
    clean = clean.replace(/\u0671/g, '\u0627');
    // Normalize all alef variants
    clean = clean.replace(/[إأآٱ]/g, 'ا');
    return clean;
};

export const isGodName = (word) => {
    if (!word) return false;
    const c = removeDiacritics(word.trim());

    // Exact match
    if (GOD_NAMES.includes(c)) return true;

    // Common Quranic forms of الله
    const allahForms = [
        "الله", "لله", "بالله", "تالله", "فالله", "والله",
        "فلله", "ولله", "اللهم", "اللهى", "الاله",
        "اللاه", "ءالله"
    ];
    if (allahForms.includes(c)) return true;

    // Common Quranic forms with رب
    const rabbForms = [
        "رب", "ربه", "ربها", "ربهم", "ربهما", "ربك", "ربكم",
        "ربكما", "ربي", "ربنا", "ربهن", "لربه", "لربها",
        "لربهم", "لربك", "لربكم", "لربي", "لربنا",
        "فربك", "فربكم", "وربك", "وربكم", "وربنا", "وربهم",
        "بربهم", "بربك", "بربكم", "بربنا", "بربي"
    ];
    if (rabbForms.includes(c)) return true;

    // Prefix stripping: try removing up to 2 prefixes
    const prefixes = ['و', 'ف', 'ب', 'ك', 'ل', 'ا', 'س'];

    let stripped = c;
    for (let round = 0; round < 2; round++) {
        for (const p of prefixes) {
            if (stripped.length > 2 && stripped.startsWith(p)) {
                const candidate = stripped.substring(p.length);
                if (GOD_NAMES.includes(candidate)) return true;
                if (allahForms.includes(candidate)) return true;
            }
        }
        // Actually strip one prefix for next round
        let didStrip = false;
        for (const p of prefixes) {
            if (stripped.length > 2 && stripped.startsWith(p)) {
                stripped = stripped.substring(p.length);
                didStrip = true;
                break;
            }
        }
        if (!didStrip) break;
    }

    // Check final stripped form
    if (GOD_NAMES.includes(stripped)) return true;

    // Suffix stripping on the original cleaned word
    const suffixes = ['هم', 'هما', 'ها', 'هن', 'كم', 'كما', 'نا', 'ه', 'ك', 'ي'];
    for (const s of suffixes) {
        if (c.endsWith(s) && c.length > s.length + 2) {
            const root = c.substring(0, c.length - s.length);
            if (GOD_NAMES.includes(root)) return true;
        }
    }

    return false;
};
