export const GOD_NAMES = [
    "الله", "الإله", // Allah, Al-Ilah
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
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0671]/g, '');
};

export const isGodName = (word) => {
    if (!word) return false;
    const cleanWord = removeDiacritics(word);

    // Check exact match first
    if (GOD_NAMES.includes(cleanWord)) return true;

    // Special case for Allah derivatives
    if (["لله", "بالله", "تالله", "فالله", "والله", "للرحمن"].includes(cleanWord)) return true;

    // Remove prefixes
    const prefixes = ['و', 'ف', 'ب', 'ك', 'ل'];

    for (const prefix of prefixes) {
        if (cleanWord.startsWith(prefix)) {
            const stripped = cleanWord.substring(prefix.length);
            if (GOD_NAMES.includes(stripped)) return true;
            // Check for "wa-l-..." (combining wa/fa with al-)
            if (stripped.startsWith('ال') && GOD_NAMES.includes(stripped)) return true;
        }
    }

    return false;
};
