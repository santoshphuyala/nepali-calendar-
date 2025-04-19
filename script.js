// Include external libraries for Excel, PDF, and Chart.js operations
const sheetJsUrl = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
const jsPdfUrl = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
const jsPdfAutoTableUrl = 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';
const chartJsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

function loadExternalScripts() {
    const scripts = [
        { src: sheetJsUrl, loaded: false },
        { src: jsPdfUrl, loaded: false },
        { src: jsPdfAutoTableUrl, loaded: false },
        { src: chartJsUrl, loaded: false }
    ];

    scripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script.src;
        scriptElement.async = true;
        scriptElement.onload = () => {
            script.loaded = true;
            if (scripts.every(s => s.loaded)) {
                init();
            }
        };
        scriptElement.onerror = () => console.error(`Failed to load ${script.src}`);
        document.head.appendChild(scriptElement);
    });
}

// Calendar data
const calendarData = {
    2082: [
        {name:"Baishakh",days:31,gregStart:"2025-04-14"},
        {name:"Jestha",days:31,gregStart:"2025-05-15"},
        {name:"Ashadh",days:32,gregStart:"2025-06-15"},
        {name:"Shrawan",days:31,gregStart:"2025-07-17"},
        {name:"Bhadra",days:31,gregStart:"2025-08-17"},
        {name:"Asoj",days:31,gregStart:"2025-09-17"},
        {name:"Kartik",days:30,gregStart:"2025-10-18"},
        {name:"Mangsir",days:29,gregStart:"2025-11-17"},
        {name:"Poush",days:30,gregStart:"2025-12-16"},
        {name:"Magh",days:29,gregStart:"2026-01-15"},
        {name:"Falgun",days:30,gregStart:"2026-02-13"},
        {name:"Chaitra",days:31,gregStart:"2026-03-16"}
    ]
};

// Festival data
const festivals = {
    "2082-01-06":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-01-13":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-01-20":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-01-27":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-02-03":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-02-10":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-02-17":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-02-24":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-02-31":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-03-07":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-03-14":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-03-21":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-03-28":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-04-03":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-04-10":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-04-17":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-04-24":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-04-30":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-05-07":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-05-14":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-05-21":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-05-28":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-06-04":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-06-11":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-06-18":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-06-25":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-07-01":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-07-08":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-07-15":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-07-22":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-07-29":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-08-06":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-08-13":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-08-20":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-08-27":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-09-05":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-09-12":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-09-19":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-09-26":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-10-03":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-10-10":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-10-17":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-10-24":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-11-02":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-11-09":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-11-16":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-11-23":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-11-30":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-12-07":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-12-14":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-12-21":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-12-28":{name:"Saturday (Weekly Holiday)",class:"saturday"},"2082-06-13":{name:"Dashain",class:"dashain"},"2082-06-14":{name:"Dashain",class:"dashain"},"2082-06-15":{name:"Dashain (Vijaya Dashami)",class:"dashain"},"2082-06-16":{name:"Dashain",class:"dashain"},"2082-06-17":{name:"Dashain",class:"dashain"},"2082-06-18":{name:"Dashain",class:"dashain"},"2082-07-03":{name:"Tihar",class:"tihar"},"2082-07-04":{name:"Tihar",class:"tihar"},"2082-07-05":{name:"Tihar (Deepawali)",class:"tihar"},"2082-07-06":{name:"Tihar",class:"tihar"},"2082-07-07":{name:"Tihar",class:"tihar"},"2082-01-01":{name:"New Year",class:"national"},"2082-01-05":{name:"Ram Navami",class:"national"},"2082-01-29":{name:"Ubauli Parva (Kirant Community), Buddha Jayanti",class:"national"},"2084-04-24":{name:"Rakshya Bandhan",class:"national"},"2082-04-30":{name:"Krishna Janmashtami",class:"national"},"2082-06-06":{name:"Ghatasthapana",class:"national"},"2082-07-10":{name:"Chhath",class:"national"},"2082-08-18":{name:"Udhauli Parva, Yomari Punhi",class:"national"},"2082-09-10":{name:"Christmas",class:"national"},"2082-09-15":{name:"Tamu Lhosar",class:"national"},"2082-10-01":{name:"Maghe Sankranti",class:"national"},"2082-10-05":{name:"Sonam Lhosar",class:"national"},"2082-11-03":{name:"Maha Shivaratri",class:"national"},"2082-11-06":{name:"Gyalpo Lhosar",class:"national"},"2082-11-18":{name:"Fagu Purnima (56 Districts)",class:"national"},"2082-12-01":{name:"Fagu Purnima (Remaining Districts)",class:"national"},"2082-04-25":{name:"Gai Jatra (Newars, Kathmandu Valley)",class:"jatra"},"2082-05-15":{name:"Gaura Parva",class:"ethnic"},"2082-05-10":{name:"Haritalika (Teej)",class:"women"},"2082-05-30":{name:"Jitiya Festival",class:"women"},"2082-10-09":{name:"Basanta Panchami",class:"education"},"2082-05-21":{name:"Indra Jatra",class:"jatra"},"2082-12-04":{name:"Ghode Jatra",class:"jatra"},"2082-01-18":{name:"May Day",class:"observed"},"2082-02-15":{name:"Republic Day",class:"observed"},"2082-06-03":{name:"Constitution Day",class:"observed"},"2082-10-16":{name:"Martyrs Day",class:"observed"},"2082-11-07":{name:"Democracy Day",class:"observed"},"2082-11-24":{name:"International Women's Day",class:"observed"},"2082-08-17":{name:"International Day of Persons with Disabilities",class:"disability"},"2082-07-25":{name:"Falgunanda Jayanti (Kirants)",class:"birth"},"2082-09-27":{name:"Prithvi Jayanti",class:"birth"}
};

// State
let currentYear = 2082, currentMonth = 0, language = localStorage.getItem('language') || 'en';
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [
    "Food", "Salary", "Rent", "Utilities", "Transport", "Entertainment", "Freelance", "Other"
];
let customTranslations = JSON.parse(localStorage.getItem('customTranslations')) || {};
const todayGregorian = new Date();
let todayBS = '';
let selectedDate = todayBS;
let observers = [];

// Simulated data for testing
function initializeTestData() {
    if (entries.length === 0) {
        entries = [
            { type: 'note', date: '2082-01-05', title: 'Meeting with team', time: '14:00', description: 'Discuss project timeline', reminder: true, reminderTime: 10, recurring: 'none' },
            { type: 'income', date: '2082-01-05', amount: 50000, time: '10:00', description: 'Monthly salary', category: 'Salary', reminder: false, recurring: 'monthly' },
            { type: 'expense', date: '2082-01-06', amount: 5000, time: '12:00', description: 'Grocery shopping', category: 'Food', reminder: false, recurring: 'none' },
            { type: 'note', date: '2082-02-01', title: 'Doctor Appointment', time: '15:00', description: 'Check-up', reminder: true, reminderTime: 60, recurring: 'none' },
            { type: 'expense', date: '2082-02-01', amount: 2000, time: '09:00', description: 'Bus fare', category: 'Transport', reminder: false, recurring: 'daily' }
        ];
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}

// Find today's BS date
function findTodayBSDate() {
    todayBS = '';
    calendarData[2082].forEach((month, monthIndex) => {
        const gregStart = new Date(month.gregStart);
        for (let day = 1; day <= month.days; day++) {
            const currentGreg = new Date(gregStart.getTime() + (day - 1) * 86400000);
            if (currentGreg.toISOString().split('T')[0] === todayGregorian.toISOString().split('T')[0]) {
                currentMonth = monthIndex;
                todayBS = `2082-${(monthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            }
        }
    });
    if (!todayBS) {
        todayBS = '2082-01-01';
        currentMonth = 0;
    }
    selectedDate = todayBS;
}

// Language translations
const translations = {
    months: {
        Baishakh: "बैशाख", Jestha: "जेठ", Ashadh: "असार", Shrawan: "साउन", Bhadra: "भदौ", Asoj: "असोज",
        Kartik: "कार्तिक", Mangsir: "मंसिर", Poush: "पुस", Magh: "माघ", Falgun: "फागुन", Chaitra: "चैत"
    },
    festivals: {
        "Saturday (Weekly Holiday)": "शनिबार (साप्ताहिक बिदा)", "Dashain": "दशैं", "Dashain (Vijaya Dashami)": "दशैं (विजया दशमी)",
        "Tihar": "तिहार", "Tihar (Deepawali)": "तिहार (दीपावली)", "New Year": "नयाँ वर्ष", "Ram Navami": "राम नवमी",
        "Ubauli Parva (Kirant Community), Buddha Jayanti": "उबौली पर्व (किराँत समुदाय), बुद्ध जयन्ती",
        "Rakshya Bandhan": "रक्षा बन्धन", "Krishna Janmashtami": "कृष्ण जन्माष्टमी", "Ghatasthapana": "घटस्थापना",
        "Chhath": "छठ", "Udhauli Parva, Yomari Punhi": "उधौली पर्व, योमरी पूर्णिमा", "Christmas": "क्रिसमस",
        "Tamu Lhosar": "तमु ल्होसार", "Maghe Sankranti": "माघे संक्रान्ति", "Sonam Lhosar": "सोनम ल्होसार",
        "Maha Shivaratri": "महाशिवरात्रि", "Gyalpo Lhosar": "ग्याल्पो ल्होसार", "Fagu Purnima (56 Districts)": "फागु पूर्णिमा (५६ जिल्ला)",
        "Fagu Purnima (Remaining Districts)": "फागु पूर्णिमा (बाँकी जिल्ला)", "Gai Jatra (Newars, Kathmandu Valley)": "गाईजात्रा (नेवार समुदाय, काठमाडौं उपत्यका)",
        "Gaura Parva": "गौरा पर्व", "Haritalika (Teej)": "हरितालिका (तीज)", "Jitiya Festival": "जितिया पर्व",
        "Basanta Panchami": "बसन्त पञ्चमी", "Indra Jatra": "इन्द्रजात्रा", "Ghode Jatra": "घोडेजात्रा",
        "May Day": "मे दिवस", "Republic Day": "गणतन्त्र दिवस", "Constitution Day": "संविधान दिवस",
        "Martyrs Day": "शहीद दिवस", "Democracy Day": "प्रजातन्त्र दिवस", "International Women's Day": "अन्तर्राष्ट्रिय महिला दिवस",
        "International Day of Persons with Disabilities": "अन्तर्राष्ट्रिय अपाङ्गता दिवस", "Falgunanda Jayanti (Kirants)": "फाल्गुनन्द जयन्ती (किराँत समुदाय)",
        "Prithvi Jayanti": "पृथ्वी जयन्ती"
    },
    weekdays: {Sun:"आइत",Mon:"सोम",Tue:"मंगल",Wed:"बुध",Thu:"बिही",Fri:"शुक्र",Sat:"शनि"},
    categories: {
        Food: "खाना", Salary: "तलब", Rent: "भाडा", Utilities: "उपयोगिताहरू", Transport: "यातायात",
        Entertainment: "मनोरञ्जन", Freelance: "फ्रीलान्स", Other: "अन्य"
    }
};

// Mock weather data (since real API calls are restricted)
const mockWeatherData = {
    temperature: 25,
    condition: 'Sunny',
    icon: 'https://imgs.search.brave.com/zW0o7uR0Z0z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5