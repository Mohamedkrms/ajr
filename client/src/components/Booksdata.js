const BOOKS_DATA = [

    // =============================================
    // --- Aqeedah (العقيدة) ---
    // =============================================

    {
        id: 'aq1',
        title: "كتاب التوحيد",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "كتاب يبين عقيدة التوحيد وأدلتها من الكتاب والسنة، ويحذر من الشرك وأنواعه، وهو أصل في بابه.",
        cover: "https://archive.org/services/img/waq49272",
        pdf: "https://archive.org/download/kitab-tawhid_202602/%D9%83%D8%AA%D8%A7%D8%A8_%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF.pdf",
        pages: 180
    },
    {
        id: 'aq2',
        title: "العقيدة الواسطية",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "رسالة في بيان معتقد أهل السنة والجماعة في الأسماء والصفات والقدر واليوم الآخر، كتبها ابن تيمية لأهل واسط.",
        cover: "https://archive.org/services/img/waq56891",
        pdf: "https://archive.org/download/3qidawasitia/%D8%A7%D9%84%D8%B9%D9%82%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D9%88%D8%A7%D8%B3%D8%B7%D9%8A%D8%A9%20%D8%AA%D8%AD%D9%82%D9%8A%D9%82%20%D8%B9%D9%84%D9%88%D9%8A%20%D8%A7%D9%84%D8%B3%D9%82%D8%A7%D9%81.pdf",
        pages: 120
    },
    {
        id: 'aq3',
        title: "الأصول الثلاثة",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "رسالة موجزة في أصول الدين التي يجب على العبد معرفتها: معرفة العبد ربه، ودينه، ونبيه محمد ﷺ.",
        cover: "https://archive.org/services/img/waq80356",
        pdf: "https://ia800808.us.archive.org/25/items/3oslol-n/3oslol_n.pdf",
        pages: 45
    },
    {
        id: 'aq4',
        title: "كشف الشبهات",
        author: "محمد بن عبد الوهاب",
        category: "aqeedah",
        description: "رسالة نفيسة في دحض شبهات المشركين وإقامة الحجة عليهم بالدليل الشرعي.",
        cover: "https://archive.org/services/img/00976pdf",
        pdf: "https://archive.org/download/way2sona_20170516_1606/ar_Kashf_AlShubuhat.pdf",
        pages: 60
    },
    {
        id: 'aq5',
        title: "لمعة الاعتقاد",
        author: "ابن قدامة المقدسي",
        category: "aqeedah",
        description: "رسالة لطيفة جمع فيها المؤلف جملة من عقائد أهل السنة والجماعة في الصفات والقدر واليوم الآخر.",
        cover: "https://archive.org/services/img/20210214_20210214_1120",
        pdf: "https://archive.org/download/eng_736/%D9%85%D8%AA%D9%86%20%D9%84%D9%85%D8%B9%D8%A9%20%D8%A7%D9%84%D8%A7%D8%B9%D8%AA%D9%82%D8%A7%D8%AF.pdf",
        pages: 85
    },
    {
        id: 'aq6',
        title: "العقيدة الطحاوية",
        author: "أبو جعفر الطحاوي",
        category: "aqeedah",
        description: "متن مختصر في عقيدة أهل السنة والجماعة على مذهب فقهاء الإسلام، يُعدّ من أشهر المتون العقدية وأوسعها قبولاً.",
        cover: "https://archive.org/services/img/waq36919",
        pdf: "https://archive.org/download/Matn_Tahawiya/Matn_Tahawiya.pdf",
        pages: 110
    },
    {
        id: 'aq7',
        title: "شرح العقيدة الطحاوية",
        author: "ابن أبي العز الحنفي",
        category: "aqeedah",
        description: "شرح مستفيض للعقيدة الطحاوية، يُعدّ من أنفس الكتب في شرح عقيدة السلف وتوضيحها بالأدلة والبراهين.",
        cover: "https://archive.org/services/img/waq39931",
        pdf: "https://archive.org/download/20240519_20240519_0116/%D8%B4%D8%B1%D8%AD%20%D8%A7%D9%84%D8%B9%D9%82%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D8%B7%D8%AD%D8%A7%D9%88%D9%8A%D8%A9%20%D9%84%D8%A7%D8%A8%D9%86%20%D8%A3%D8%A8%D9%8A%20%D8%A7%D9%84%D8%B9%D8%B2%20%D8%A7%D9%84%D8%AD%D9%86%D9%81%D9%8A.pdf",
        pages: 550
    },
    {
        id: 'aq8',
        title: "الإيمان",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "كتاب نفيس في حقيقة الإيمان وأركانه وزيادته ونقصانه، وبيان مذاهب الفرق المختلفة في هذه المسألة.",
        cover: "https://archive.org/services/img/waq44887",
        pdf: "https://archive.org/download/waq44887/44887.pdfhttps://archive.org/download/Belief_201804/Belief%20_%20%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D8%A5%D9%8A%D9%85%D8%A7%D9%86%20%D8%AA%D8%A3%D9%84%D9%8A%D9%81%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%A8%D9%86%20%D8%AA%D9%8A%D9%85%D9%8A%D8%A9.pdf",
        pages: 380
    },
    {
        id: 'aq9',
        title: "الوجيز في عقيدة السلف الصالح",
        author: "عبد الله بن عبد الحميد الأثري",
        category: "aqeedah",
        description: "كتاب يحوي مجمل اعتقاد أهل السنة والجماعة، تميّز بسهولة العبارة وحسن الإخراج، وقد راجعه أكثر من عشرين عالماً.",
        cover: "https://archive.org/services/img/noor-book.com_20221030_0948",
        pdf: "https://archive.org/download/noor-book.com_20221030_0948/Noor-Book.com%20%20%D8%A7%D9%84%D9%88%D8%AC%D9%8A%D8%B2%20%D9%81%D9%8A%20%D8%B9%D9%82%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D8%B3%D9%84%D9%81%20%D8%A7%D9%84%D8%B5%D8%A7%D9%84%D8%AD%20%D8%A3%D9%87%D9%84%20%D8%A7%D9%84%D8%B3%D9%86%D8%A9%20%D9%88%D8%A7%D9%84%D8%AC%D9%85%D8%A7%D8%B9%D8%A9.pdf",
        pages: 240
    },
    {
        id: 'aq10',
        title: "الحموية الكبرى",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "رسالة مهمة كتبها ابن تيمية في مسألة الاستواء والفوقية وسائر الصفات، رداً على من أوّل نصوص الكتاب والسنة.",
        cover: "https://archive.org/services/img/waq76741",
        pdf: "https://archive.org/download/waq76741/76741.pdf",
        pages: 160
    },
    {
        id: 'aq11',
        title: "التدمرية",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "رسالة في تحقيق المثبَت والمنفي في صفات الله تعالى، وفيها تقرير عقيدة السلف بالحجج العقلية والنقلية.",
        cover: "https://archive.org/services/img/waq55697",
        pdf: "https://archive.org/download/waq55697/55697.pdf",
        pages: 130
    },
    {
        id: 'aq12',
        title: "القواعد المثلى في صفات الله وأسمائه الحسنى",
        author: "محمد بن صالح العثيمين",
        category: "aqeedah",
        description: "رسالة قيّمة في تقرير القواعد الصحيحة في باب الأسماء والصفات، مع الرد على المخالفين.",
        cover: "https://archive.org/services/img/waq43658",
        pdf: "https://archive.org/download/waq43658/43658.pdf",
        pages: 140
    },
    {
        id: 'aq13',
        title: "شرح الأصول الثلاثة",
        author: "محمد بن صالح العثيمين",
        category: "aqeedah",
        description: "شرح مبسط وميسر للأصول الثلاثة التي وضعها الإمام محمد بن عبد الوهاب، يتميز بالوضوح والاستيعاب.",
        cover: "https://archive.org/services/img/waq43659",
        pdf: "https://archive.org/download/waq43659/43659.pdf",
        pages: 200
    },

    // =============================================
    // --- Fiqh (الفقه) ---
    // =============================================

    {
        id: 'fq1',
        title: "عمدة الأحكام",
        author: "عبد الغني المقدسي",
        category: "fiqh",
        description: "كتاب جمع فيه المؤلف أحاديث الأحكام التي اتفق عليها البخاري ومسلم، وهو عمدة لطالب الفقه.",
        cover: "https://archive.org/services/img/waq62492",
        pdf: "https://archive.org/download/waq62492/62492.pdf",
        pages: 250
    },
    {
        id: 'fq2',
        title: "منهج السالكين",
        author: "عبد الرحمن السعدي",
        category: "fiqh",
        description: "كتاب فقهي مختصر ومحرر، يعتني بالدليل ويبتعد عن التعقيد، مناسب جداً للمبتدئين.",
        cover: "https://archive.org/services/img/waq78728",
        pdf: "https://archive.org/download/waq78728/78728.pdf",
        pages: 300
    },
    {
        id: 'fq3',
        title: "الملخص الفقهي",
        author: "صالح الفوزان",
        category: "fiqh",
        description: "شرح مبسط وواضح لأبواب الفقه الإسلامي، مقروناً بالأدلة الشرعية من الكتاب والسنة.",
        cover: "https://archive.org/services/img/waq13241",
        pdf: "https://archive.org/download/waq13241/13241.pdf",
        pages: 600
    },
    {
        id: 'fq4',
        title: "زاد المستقنع",
        author: "موسى الحجاوي",
        category: "fiqh",
        description: "متن فقهي حنبلي مختصر، يُعدّ من أجمع المتون الفقهية وأكثرها تداولاً في فقه الإمام أحمد بن حنبل.",
        cover: "https://archive.org/services/img/waq36802",
        pdf: "https://archive.org/download/waq36802/36802.pdf",
        pages: 220
    },
    {
        id: 'fq5',
        title: "الروض المربع شرح زاد المستقنع",
        author: "منصور البهوتي",
        category: "fiqh",
        description: "شرح موثق لمتن زاد المستقنع، يُعدّ من أهم المراجع الفقهية الحنبلية، وقد اعتنى به العلماء عناية بالغة.",
        cover: "https://archive.org/services/img/waq36803",
        pdf: "https://archive.org/download/waq36803/36803.pdf",
        pages: 750
    },
    {
        id: 'fq6',
        title: "المغني",
        author: "ابن قدامة المقدسي",
        category: "fiqh",
        description: "موسوعة فقهية حنبلية جامعة، يذكر فيها المؤلف المسائل الفقهية مع أدلتها ومذاهب الفقهاء وأوجه الاستدلال.",
        cover: "https://archive.org/services/img/waq12026",
        pdf: "https://archive.org/download/waq12026/12026.pdf",
        pages: 5000
    },
    {
        id: 'fq7',
        title: "شرح العمدة في الفقه",
        author: "ابن تيمية",
        category: "fiqh",
        description: "شرح قيّم لكتاب عمدة الفقه لابن قدامة، يتميز بدقة التأصيل والرجوع إلى الدليل في كل مسألة.",
        cover: "https://archive.org/services/img/waq37698",
        pdf: "https://archive.org/download/waq37698/37698.pdf",
        pages: 800
    },
    {
        id: 'fq8',
        title: "الشرح الممتع على زاد المستقنع",
        author: "محمد بن صالح العثيمين",
        category: "fiqh",
        description: "شرح مفصّل وموسع لمتن زاد المستقنع، يُعدّ من أهم مؤلفات العثيمين الفقهية، غني بالفوائد والتحقيقات.",
        cover: "https://archive.org/services/img/waq43669",
        pdf: "https://archive.org/download/waq43669/43669.pdf",
        pages: 3500
    },

    // =============================================
    // --- Hadith (الحديث) ---
    // =============================================

    {
        id: 'hd1',
        title: "رياض الصالحين",
        author: "الإمام النووي",
        category: "hadith",
        description: "كتاب يجمع الأحاديث الصحيحة المصنفة في الأبواب الفقهية والآداب الإسلامية، لا يستغني عنه بيت مسلم.",
        cover: "https://archive.org/services/img/waq108846",
        pdf: "https://archive.org/download/waq108846/108846.pdf",
        pages: 650
    },
    {
        id: 'hd2',
        title: "الأربعون النووية",
        author: "الإمام النووي",
        category: "hadith",
        description: "أربعون حديثاً نبوياً جمعها الإمام النووي، تضمنت قواعد الدين وأصوله، وهي من أهم المتون للحفظ.",
        cover: "https://archive.org/services/img/waq62492",
        pdf: "https://archive.org/download/waq62492/62492.pdf",
        pages: 80
    },
    {
        id: 'hd3',
        title: "بلوغ المرام",
        author: "ابن حجر العسقلاني",
        category: "hadith",
        description: "كتاب محرر في أحاديث الأحكام، رتبه المؤلف على الأبواب الفقهية، وهو مرجع أساسي للفقهاء.",
        cover: "https://archive.org/services/img/waq14622",
        pdf: "https://archive.org/download/waq14622/14622.pdf",
        pages: 450
    },
    {
        id: 'hd4',
        title: "صحيح البخاري",
        author: "الإمام البخاري",
        category: "hadith",
        description: "أصح كتاب بعد كتاب الله تعالى، جمع فيه الإمام البخاري الأحاديث النبوية الصحيحة مرتبةً على الأبواب الفقهية.",
        cover: "https://archive.org/services/img/waq15952",
        pdf: "https://archive.org/download/waq15952/15952.pdf",
        pages: 2800
    },
    {
        id: 'hd5',
        title: "صحيح مسلم",
        author: "الإمام مسلم",
        category: "hadith",
        description: "الكتاب الثاني في الصحة بعد صحيح البخاري، جمع فيه مسلم بن الحجاج الأحاديث الصحيحة بأسانيدها.",
        cover: "https://archive.org/services/img/waq15951",
        pdf: "https://archive.org/download/waq15951/15951.pdf",
        pages: 2200
    },
    {
        id: 'hd6',
        title: "سنن أبي داود",
        author: "أبو داود السجستاني",
        category: "hadith",
        description: "من الكتب الستة في الحديث النبوي، اشتمل على أحاديث الأحكام، وهو من أهم المراجع في الفقه الإسلامي.",
        cover: "https://archive.org/services/img/waq15953",
        pdf: "https://archive.org/download/waq15953/15953.pdf",
        pages: 1800
    },
    {
        id: 'hd7',
        title: "جامع الترمذي",
        author: "الإمام الترمذي",
        category: "hadith",
        description: "من الكتب الستة في الحديث، يتميز بذكر درجة الحديث وأقوال الفقهاء، وهو عمدة في الجرح والتعديل.",
        cover: "https://archive.org/services/img/waq15954",
        pdf: "https://archive.org/download/waq15954/15954.pdf",
        pages: 1600
    },
    {
        id: 'hd8',
        title: "سنن ابن ماجه",
        author: "ابن ماجه القزويني",
        category: "hadith",
        description: "السادس من كتب الحديث الستة، يحتوي على أحاديث كثيرة في الأحكام والآداب والتاريخ.",
        cover: "https://archive.org/services/img/waq15955",
        pdf: "https://archive.org/download/waq15955/15955.pdf",
        pages: 1400
    },
    {
        id: 'hd9',
        title: "السنن النسائي",
        author: "الإمام النسائي",
        category: "hadith",
        description: "من الكتب الستة في الحديث، يُعدّ من أقلّها أحاديث ضعيفة، ويتميز بنقد الأسانيد ودقة التبويب.",
        cover: "https://archive.org/services/img/waq15956",
        pdf: "https://archive.org/download/waq15956/15956.pdf",
        pages: 1700
    },
    {
        id: 'hd10',
        title: "الأدب المفرد",
        author: "الإمام البخاري",
        category: "hadith",
        description: "كتاب نفيس للإمام البخاري جمع فيه الأحاديث المتعلقة بالآداب الإسلامية والأخلاق والمعاملات.",
        cover: "https://archive.org/services/img/waq38209",
        pdf: "https://archive.org/download/waq38209/38209.pdf",
        pages: 350
    },
    {
        id: 'hd11',
        title: "مشكاة المصابيح",
        author: "محمد بن عبد الله الخطيب التبريزي",
        category: "hadith",
        description: "كتاب جامع في الحديث النبوي يضم أحاديث في مختلف أبواب الدين، مرتباً ترتيباً يسهّل البحث والمراجعة.",
        cover: "https://archive.org/services/img/waq22813",
        pdf: "https://archive.org/download/waq22813/22813.pdf",
        pages: 900
    },

    // =============================================
    // --- Seerah (السيرة) ---
    // =============================================

    {
        id: 'sr1',
        title: "الرحيق المختوم",
        author: "صفي الرحمن المباركفوري",
        category: "seerah",
        description: "بحث في السيرة النبوية فاز بالمركز الأول في مسابقة رابطة العالم الإسلامي، يتميز بسلاسة الأسلوب وصحة النقل.",
        cover: "https://archive.org/services/img/waq13344",
        pdf: "https://archive.org/download/waq13344/13344.pdf",
        pages: 520
    },
    {
        id: 'sr2',
        title: "زاد المعاد",
        author: "ابن قيم الجوزية",
        category: "seerah",
        description: "موسوعة في هدي النبي ﷺ في عبادته ومعاملاته وحياته كلها، جمع فيه المؤلف بين الفقه والسيرة.",
        cover: "https://archive.org/services/img/waq12022",
        pdf: "https://archive.org/download/waq12022/12022.pdf",
        pages: 1200
    },
    {
        id: 'sr3',
        title: "السيرة النبوية لابن هشام",
        author: "ابن هشام",
        category: "seerah",
        description: "أشهر كتب السيرة النبوية على الإطلاق، يرويها ابن هشام مهذَّبةً عن ابن إسحاق، مرجع كل من كتب في السيرة.",
        cover: "https://archive.org/services/img/waq12027",
        pdf: "https://archive.org/download/waq12027/12027.pdf",
        pages: 1100
    },
    {
        id: 'sr4',
        title: "البداية والنهاية",
        author: "ابن كثير",
        category: "seerah",
        description: "موسوعة تاريخية إسلامية شاملة تضم تاريخ الأنبياء وسيرة النبي ﷺ وتاريخ الإسلام حتى عصر المؤلف.",
        cover: "https://archive.org/services/img/waq12028",
        pdf: "https://archive.org/download/waq12028/12028.pdf",
        pages: 5000
    },
    {
        id: 'sr5',
        title: "فقه السيرة النبوية",
        author: "محمد سعيد رمضان البوطي",
        category: "seerah",
        description: "دراسة تحليلية للسيرة النبوية تستخرج منها الدروس والعبر والفوائد الفقهية والدعوية.",
        cover: "https://archive.org/services/img/waq18792",
        pdf: "https://archive.org/download/waq18792/18792.pdf",
        pages: 430
    },

    // =============================================
    // --- Tazkiyah (التزكية) ---
    // =============================================

    {
        id: 'tz1',
        title: "الداء والدواء",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب في تهذيب النفوس وصقلها، وعلاج أمراض القلوب، أجاب فيه عن دواء البلية التي تفسد دنيا العبد وآخرته.",
        cover: "https://archive.org/services/img/adwdeq",
        pdf: "https://archive.org/download/adwdeq/adwdeq.pdf",
        pages: 384
    },
    {
        id: 'tz2',
        title: "الوابل الصيب",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب يبين فضل الذكر وأثره في حياة المسلم، ويوضح أنواع الأذكار وأوقاتها وأحوالها.",
        cover: "https://archive.org/services/img/waq58509",
        pdf: "https://archive.org/download/waq58509/58509.pdf",
        pages: 245
    },
    {
        id: 'tz3',
        title: "صيد الخاطر",
        author: "ابن الجوزي",
        category: "tazkiyah",
        description: "خواطر وتأملات دونها المؤلف، تتضمن حكماً ومواعظ وتجارب حياتية عميقة وبليغة.",
        cover: "https://archive.org/services/img/saed_ul_khatir",
        pdf: "https://archive.org/download/saed_ul_khatir/saed_ul_khatir.pdf",
        pages: 600
    },
    {
        id: 'tz4',
        title: "مدارج السالكين",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "شرح موسّع لمنازل السائرين للهروي، يُعدّ من أنفس الكتب في علم السلوك والتزكية على منهج أهل السنة.",
        cover: "https://archive.org/services/img/waq12024",
        pdf: "https://archive.org/download/waq12024/12024.pdf",
        pages: 1500
    },
    {
        id: 'tz5',
        title: "إغاثة اللهفان من مصايد الشيطان",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب نفيس في بيان مصائد الشيطان وكيف يتغلب المسلم عليها، مع بيان أمراض القلوب وعلاجها.",
        cover: "https://archive.org/services/img/waq12025",
        pdf: "https://archive.org/download/waq12025/12025.pdf",
        pages: 600
    },
    {
        id: 'tz6',
        title: "الفوائد",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "مجموعة من التأملات والفوائد العلمية والتربوية التي كان يقيّدها ابن القيم في أوقات خلوته وتأمله.",
        cover: "https://archive.org/services/img/waq58510",
        pdf: "https://archive.org/download/waq58510/58510.pdf",
        pages: 270
    },
    {
        id: 'tz7',
        title: "طريق الهجرتين وباب السعادتين",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب يبيّن طريق الهجرة إلى الله ورسوله والهجرة القلبية، ومنازل العباد في طريق المسير إلى الله.",
        cover: "https://archive.org/services/img/waq58511",
        pdf: "https://archive.org/download/waq58511/58511.pdf",
        pages: 420
    },
    {
        id: 'tz8',
        title: "التبيان في آداب حملة القرآن",
        author: "الإمام النووي",
        category: "tazkiyah",
        description: "رسالة جامعة في آداب حامل القرآن الكريم وحقوقه وما ينبغي له من الأعمال والأخلاق.",
        cover: "https://archive.org/services/img/waq38215",
        pdf: "https://archive.org/download/waq38215/38215.pdf",
        pages: 120
    },

    // =============================================
    // --- Quran (علوم القرآن) ---
    // =============================================

    {
        id: 'qr1',
        title: "تفسير السعدي (تيسير الكريم الرحمن)",
        author: "عبد الرحمن السعدي",
        category: "quran",
        description: "تفسير ميسر للقرآن الكريم، يعتني بإيضاح المعاني بعبارة سهلة وواضحة، بعيداً عن الحشو والتطويل.",
        cover: "https://archive.org/services/img/waq78564",
        pdf: "https://archive.org/download/waq78564/78564.pdf",
        pages: 1100
    },
    {
        id: 'qr2',
        title: "تفسير ابن كثير",
        author: "ابن كثير",
        category: "quran",
        description: "أشهر تفاسير القرآن الكريم على المنهج السلفي، يعتمد تفسير القرآن بالقرآن وبالسنة الصحيحة وأقوال السلف.",
        cover: "https://archive.org/services/img/waq17509",
        pdf: "https://archive.org/download/waq17509/17509.pdf",
        pages: 4000
    },
    {
        id: 'qr3',
        title: "تفسير الطبري (جامع البيان)",
        author: "ابن جرير الطبري",
        category: "quran",
        description: "أقدم وأضخم التفاسير المأثورة وأغناها بالروايات، يُعدّ أصل التفاسير ومرجعها الأول.",
        cover: "https://archive.org/services/img/waq15490",
        pdf: "https://archive.org/download/waq15490/15490.pdf",
        pages: 9000
    },
    {
        id: 'qr4',
        title: "أضواء البيان في إيضاح القرآن بالقرآن",
        author: "محمد الأمين الشنقيطي",
        category: "quran",
        description: "تفسير يقوم على منهج تفسير القرآن بالقرآن، مع العناية بأحكام الفقه واللغة والبلاغة القرآنية.",
        cover: "https://archive.org/services/img/waq17514",
        pdf: "https://archive.org/download/waq17514/17514.pdf",
        pages: 3500
    },
    {
        id: 'qr5',
        title: "الإتقان في علوم القرآن",
        author: "السيوطي",
        category: "quran",
        description: "موسوعة جامعة في علوم القرآن الكريم تضم أنواع هذا العلم كلها، يُعدّ المرجع الأول في هذا الفن.",
        cover: "https://archive.org/services/img/waq17515",
        pdf: "https://archive.org/download/waq17515/17515.pdf",
        pages: 1200
    },
    {
        id: 'qr6',
        title: "مباحث في علوم القرآن",
        author: "مناع القطان",
        category: "quran",
        description: "مقدمة علمية وافية في علوم القرآن الكريم، يُعدّ من أنسب المراجع لطلاب العلم والدارسين.",
        cover: "https://archive.org/services/img/waq17516",
        pdf: "https://archive.org/download/waq17516/17516.pdf",
        pages: 380
    },
    {
        id: 'qr7',
        title: "التفسير الميسر",
        author: "نخبة من العلماء - مجمع الملك فهد",
        category: "quran",
        description: "تفسير مبسط للقرآن الكريم أصدره مجمع الملك فهد لطباعة المصحف الشريف، يتميز بالوضوح والاختصار.",
        cover: "https://archive.org/services/img/waq17517",
        pdf: "https://archive.org/download/waq17517/17517.pdf",
        pages: 620
    },

    // =============================================
    // --- Usool Al-Fiqh (أصول الفقه) ---
    // =============================================

    {
        id: 'uf1',
        title: "روضة الناظر وجنة المناظر",
        author: "ابن قدامة المقدسي",
        category: "usool",
        description: "كتاب في أصول الفقه الحنبلي، مبني على كتاب المستصفى للغزالي، يُعدّ من أهم مصنفات هذا الفن.",
        cover: "https://archive.org/services/img/waq37701",
        pdf: "https://archive.org/download/waq37701/37701.pdf",
        pages: 480
    },
    {
        id: 'uf2',
        title: "الورقات",
        author: "إمام الحرمين الجويني",
        category: "usool",
        description: "متن مختصر في أصول الفقه، من أشهر المتون في هذا الفن وأكثرها تداولاً بين طلبة العلم.",
        cover: "https://archive.org/services/img/waq38210",
        pdf: "https://archive.org/download/waq38210/38210.pdf",
        pages: 55
    },
    {
        id: 'uf3',
        title: "الإحكام في أصول الأحكام",
        author: "ابن حزم الأندلسي",
        category: "usool",
        description: "كتاب جامع في أصول الفقه من منظور أهل الظاهر، يتميز بالتحقيق والمناقشة والاستدلال الصارم.",
        cover: "https://archive.org/services/img/waq17600",
        pdf: "https://archive.org/download/waq17600/17600.pdf",
        pages: 900
    },

    // =============================================
    // --- Islamic History (التاريخ الإسلامي) ---
    // =============================================

    {
        id: 'th1',
        title: "سير أعلام النبلاء",
        author: "الإمام الذهبي",
        category: "history",
        description: "موسوعة تراجم ضخمة تضم سير الصحابة والتابعين والأئمة والعلماء الأعلام، مرجع لا غنى عنه في علم الرجال.",
        cover: "https://archive.org/services/img/waq12031",
        pdf: "https://archive.org/download/waq12031/12031.pdf",
        pages: 8000
    },
    {
        id: 'th2',
        title: "الكامل في التاريخ",
        author: "ابن الأثير",
        category: "history",
        description: "موسوعة تاريخية شاملة تضم تاريخ العالم من بدء الخليقة حتى عصر المؤلف، تُعدّ من أهم المصادر التاريخية.",
        cover: "https://archive.org/services/img/waq12032",
        pdf: "https://archive.org/download/waq12032/12032.pdf",
        pages: 6000
    },
    {
        id: 'th3',
        title: "تاريخ الخلفاء",
        author: "السيوطي",
        category: "history",
        description: "كتاب مختصر في تاريخ الخلفاء من الخلفاء الراشدين حتى آخر خلفاء بني العباس، يُعدّ من أجمع ما كُتب في هذا الباب.",
        cover: "https://archive.org/services/img/waq22900",
        pdf: "https://archive.org/download/waq22900/22900.pdf",
        pages: 420
    },
    {
        id: 'th4',
        title: "الإصابة في تمييز الصحابة",
        author: "ابن حجر العسقلاني",
        category: "history",
        description: "موسوعة تراجم الصحابة الكرام رضوان الله عليهم، يُعدّ المرجع الأساسي في تراجمهم وأسمائهم وأحوالهم.",
        cover: "https://archive.org/services/img/waq14623",
        pdf: "https://archive.org/download/waq14623/14623.pdf",
        pages: 3500
    },

    // =============================================
    // --- Ibn Taymiyyah Special (ابن تيمية) ---
    // =============================================

    {
        id: 'it1',
        title: "مجموع الفتاوى",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "موسوعة ضخمة تضم فتاوى شيخ الإسلام ابن تيمية في العقيدة والفقه والتفسير واللغة، مرجع لا غنى عنه.",
        cover: "https://archive.org/services/img/fatawaibnt",
        pdf: "https://archive.org/download/fatawaibnt/fatawaibnt.pdf",
        pages: 18000
    },
    {
        id: 'it2',
        title: "منهاج السنة النبوية",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "رد علمي موسع على كتاب منهاج الكرامة للحلي الرافضي، يُعدّ من أضخم الردود على الشيعة الإمامية.",
        cover: "https://archive.org/services/img/waq44888",
        pdf: "https://archive.org/download/waq44888/44888.pdf",
        pages: 3200
    },
    {
        id: 'it3',
        title: "درء تعارض العقل والنقل",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "موسوعة في بيان أن العقل الصحيح والنقل الصريح لا يتعارضان، رد فيها على الفلاسفة والمتكلمين.",
        cover: "https://archive.org/services/img/waq44889",
        pdf: "https://archive.org/download/waq44889/44889.pdf",
        pages: 4000
    },
    {
        id: 'it4',
        title: "اقتضاء الصراط المستقيم",
        author: "ابن تيمية",
        category: "aqeedah",
        description: "كتاب في وجوب مخالفة أصحاب الجحيم، وبيان ما فيه من مخالفة السنة من تعظيم المشركين وأعيادهم.",
        cover: "https://archive.org/services/img/waq44890",
        pdf: "https://archive.org/download/waq44890/44890.pdf",
        pages: 500
    },

    // =============================================
    // --- Ibn Al-Qayyim Special (ابن القيم) ---
    // =============================================

    {
        id: 'iq1',
        title: "أعلام الموقعين عن رب العالمين",
        author: "ابن قيم الجوزية",
        category: "usool",
        description: "كتاب في أصول الفتوى والإفتاء، يُعدّ من أعظم كتب الفقه الإسلامي وأنفسها، يقرّر مبدأ الاجتهاد وربط الفتوى بالواقع.",
        cover: "https://archive.org/services/img/waq12029",
        pdf: "https://archive.org/download/waq12029/12029.pdf",
        pages: 1800
    },
    {
        id: 'iq2',
        title: "حادي الأرواح إلى بلاد الأفراح",
        author: "ابن قيم الجوزية",
        category: "aqeedah",
        description: "كتاب في وصف الجنة ونعيمها وما أعده الله للمؤمنين، يجمع بين الترغيب والتذكير والبرهان العلمي.",
        cover: "https://archive.org/services/img/waq58512",
        pdf: "https://archive.org/download/waq58512/58512.pdf",
        pages: 450
    },
    {
        id: 'iq3',
        title: "مفتاح دار السعادة",
        author: "ابن قيم الجوزية",
        category: "tazkiyah",
        description: "كتاب موسوعي في فضل العلم وشرفه وما يترتب عليه من منازل ومقامات في الدنيا والآخرة.",
        cover: "https://archive.org/services/img/waq58513",
        pdf: "https://archive.org/download/waq58513/58513.pdf",
        pages: 700
    },
    {
        id: 'iq4',
        title: "الروح",
        author: "ابن قيم الجوزية",
        category: "aqeedah",
        description: "كتاب فريد في بيان حقيقة الروح والنفس وعالم البرزخ وأحوال الموتى، جمع فيه المؤلف من النصوص والآثار ما لا يُوجد في غيره.",
        cover: "https://archive.org/services/img/waq58514",
        pdf: "https://archive.org/download/waq58514/58514.pdf",
        pages: 380
    },

    // =============================================
    // --- Contemporary Scholars (علماء معاصرون) ---
    // =============================================

    {
        id: 'cs1',
        title: "مجموع فتاوى ابن باز",
        author: "عبد العزيز بن باز",
        category: "fiqh",
        description: "موسوعة فتاوى الشيخ ابن باز رحمه الله في مختلف أبواب الدين، تُعدّ مرجعاً للباحثين والمستفتين.",
        cover: "https://archive.org/services/img/waq43690",
        pdf: "https://archive.org/download/waq43690/43690.pdf",
        pages: 8000
    },
    {
        id: 'cs2',
        title: "مجموع فتاوى ورسائل العثيمين",
        author: "محمد بن صالح العثيمين",
        category: "fiqh",
        description: "مجموعة فتاوى الشيخ العثيمين رحمه الله في الفقه والعقيدة والتفسير، تُعدّ من أنفس موسوعات الفتوى المعاصرة.",
        cover: "https://archive.org/services/img/waq43691",
        pdf: "https://archive.org/download/waq43691/43691.pdf",
        pages: 6000
    },
    {
        id: 'cs3',
        title: "العقيدة الصحيحة وما يضادها",
        author: "عبد العزيز بن باز",
        category: "aqeedah",
        description: "رسالة مختصرة في بيان أصول العقيدة الإسلامية الصحيحة وما يناقضها من الشرك والبدعة والضلال.",
        cover: "https://archive.org/services/img/waq43692",
        pdf: "https://archive.org/download/waq43692/43692.pdf",
        pages: 80
    },
    {
        id: 'cs4',
        title: "التعليق على الكافية الشافية",
        author: "محمد بن صالح العثيمين",
        category: "aqeedah",
        description: "تعليق على نونية ابن القيم الشهيرة في العقيدة، يشرح فيه الشيخ العثيمين معاني الأبيات بأسلوب واضح.",
        cover: "https://archive.org/services/img/waq43660",
        pdf: "https://archive.org/download/waq43660/43660.pdf",
        pages: 600
    },

    // =============================================
    // --- Arabic Language (اللغة العربية) ---
    // =============================================

    {
        id: 'lg1',
        title: "متن الآجرومية",
        author: "ابن آجروم",
        category: "language",
        description: "متن مختصر في النحو العربي، يُعدّ من أشهر المتون النحوية وأكثرها تداولاً بين المبتدئين في دراسة النحو.",
        cover: "https://archive.org/services/img/waq38220",
        pdf: "https://archive.org/download/waq38220/38220.pdf",
        pages: 45
    },
    {
        id: 'lg2',
        title: "ألفية ابن مالك",
        author: "ابن مالك",
        category: "language",
        description: "منظومة في ألف بيت جمعت قواعد النحو والصرف العربي، وهي الأشهر والأهم في هذا الفن على مر العصور.",
        cover: "https://archive.org/services/img/waq38221",
        pdf: "https://archive.org/download/waq38221/38221.pdf",
        pages: 100
    },
    {
        id: 'lg3',
        title: "شرح ابن عقيل على الألفية",
        author: "ابن عقيل",
        category: "language",
        description: "أشهر شروح ألفية ابن مالك وأوضحها، يُعدّ من أهم الكتب في تعليم النحو العربي لطلاب العلم.",
        cover: "https://archive.org/services/img/waq38222",
        pdf: "https://archive.org/download/waq38222/38222.pdf",
        pages: 650
    },

];

export default BOOKS_DATA;