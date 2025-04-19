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
        { name: "Baishakh", days: 31, gregStart: "2025-04-14" },
        { name: "Jestha", days: 31, gregStart: "2025-05-15" },
        { name: "Ashadh", days: 32, gregStart: "2025-06-15" },
        { name: "Shrawan", days: 31, gregStart: "2025-07-17" },
        { name: "Bhadra", days: 31, gregStart: "2025-08-17" },
        { name: "Asoj", days: 31, gregStart: "2025-09-17" },
        { name: "Kartik", days: 30, gregStart: "2025-10-18" },
        { name: "Mangsir", days: 29, gregStart: "2025-11-17" },
        { name: "Poush", days: 30, gregStart: "2025-12-16" },
        { name: "Magh", days: 29, gregStart: "2026-01-15" },
        { name: "Falgun", days: 30, gregStart: "2026-02-13" },
        { name: "Chaitra", days: 31, gregStart: "2026-03-16" }
    ]
};

// Festival data
const festivals = {
    "2082-01-06": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-01-13": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-01-20": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-01-27": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-02-03": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-02-10": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-02-17": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-02-24": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-02-31": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-03-07": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-03-14": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-03-21": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-03-28": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-04-03": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-04-10": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-04-17": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-04-24": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-04-30": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-05-07": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-05-14": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-05-21": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-05-28": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-06-04": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-06-11": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-06-18": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-06-25": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-07-01": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-07-08": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-07-15": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-07-22": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-07-29": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-08-06": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-08-13": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-08-20": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-08-27": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-09-05": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-09-12": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-09-19": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-09-26": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-10-03": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-10-10": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-10-17": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-10-24": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-11-02": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-11-09": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-11-16": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-11-23": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-11-30": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-12-07": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-12-14": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-12-21": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-12-28": { name: "Saturday (Weekly Holiday)", class: "saturday" },
    "2082-06-13": { name: "Dashain", class: "dashain" },
    "2082-06-14": { name: "Dashain", class: "dashain" },
    "2082-06-15": { name: "Dashain (Vijaya Dashami)", class: "dashain" },
    "2082-06-16": { name: "Dashain", class: "dashain" },
    "2082-06-17": { name: "Dashain", class: "dashain" },
    "2082-06-18": { name: "Dashain", class: "dashain" },
    "2082-07-03": { name: "Tihar", class: "tihar" },
    "2082-07-04": { name: "Tihar", class: "tihar" },
    "2082-07-05": { name: "Tihar (Deepawali)", class: "tihar" },
    "2082-07-06": { name: "Tihar", class: "tihar" },
    "2082-07-07": { name: "Tihar", class: "tihar" },
    "2082-01-01": { name: "New Year", class: "national" },
    "2082-01-05": { name: "Ram Navami", class: "national" },
    "2082-01-29": { name: "Ubauli Parva (Kirant Community), Buddha Jayanti", class: "national" },
    "2084-04-24": { name: "Rakshya Bandhan", class: "national" },
    "2082-04-30": { name: "Krishna Janmashtami", class: "national" },
    "2082-06-06": { name: "Ghatasthapana", class: "national" },
    "2082-07-10": { name: "Chhath", class: "national" },
    "2082-08-18": { name: "Udhauli Parva, Yomari Punhi", class: "national" },
    "2082-09-10": { name: "Christmas", class: "national" },
    "2082-09-15": { name: "Tamu Lhosar", class: "national" },
    "2082-10-01": { name: "Maghe Sankranti", class: "national" },
    "2082-10-05": { name: "Sonam Lhosar", class: "national" },
    "2082-11-03": { name: "Maha Shivaratri", class: "national" },
    "2082-11-06": { name: "Gyalpo Lhosar", class: "national" },
    "2082-11-18": { name: "Fagu Purnima (56 Districts)", class: "national" },
    "2082-12-01": { name: "Fagu Purnima (Remaining Districts)", class: "national" },
    "2082-04-25": { name: "Gai Jatra (Newars, Kathmandu Valley)", class: "jatra" },
    "2082-05-15": { name: "Gaura Parva", class: "ethnic" },
    "2082-05-10": { name: "Haritalika (Teej)", class: "women" },
    "2082-05-30": { name: "Jitiya Festival", class: "women" },
    "2082-10-09": { name: "Basanta Panchami", class: "education" },
    "2082-05-21": { name: "Indra Jatra", class: "jatra" },
    "2082-12-04": { name: "Ghode Jatra", class: "jatra" },
    "2082-01-18": { name: "May Day", class: "observed" },
    "2082-02-15": { name: "Republic Day", class: "observed" },
    "2082-06-03": { name: "Constitution Day", class: "observed" },
    "2082-10-16": { name: "Martyrs Day", class: "observed" },
    "2082-11-07": { name: "Democracy Day", class: "observed" },
    "2082-11-24": { name: "International Women's Day", class: "observed" },
    "2082-08-17": { name: "International Day of Persons with Disabilities", class: "disability" },
    "2082-07-25": { name: "Falgunanda Jayanti (Kirants)", class: "birth" },
    "2082-09-27": { name: "Prithvi Jayanti", class: "birth" }
};

// State
let currentYear = 2082;
let currentMonth = 0;
let language = localStorage.getItem('language') || 'en';
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [
    "Food", "Salary", "Rent", "Utilities", "Transport", "Entertainment", "Freelance", "Other"
];
let customTranslations = JSON.parse(localStorage.getItem('customTranslations')) || {};
const todayGregorian = new Date();
let todayBS = '';
let selectedDate = '';
let observers = [];
let encryptionKey = null;

// Encryption Functions using Web Crypto API
async function generateEncryptionKey() {
    try {
        const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedKey = await crypto.subtle.exportKey("raw", key);
        const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
        localStorage.setItem('encryptionKey', keyString);
        return key;
    } catch (error) {
        console.error("Error generating encryption key:", error);
        throw error;
    }
}

async function importEncryptionKey() {
    try {
        const keyString = localStorage.getItem('encryptionKey');
        if (!keyString) return null;
        const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
        return await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
    } catch (error) {
        console.error("Error importing encryption key:", error);
        return null;
    }
}

async function encryptData(data) {
    try {
        if (!encryptionKey) {
            encryptionKey = await importEncryptionKey() || await generateEncryptionKey();
        }
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(data);
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            encryptionKey,
            encodedData
        );
        const encryptedArray = new Uint8Array(encrypted);
        return {
            iv: btoa(String.fromCharCode(...iv)),
            data: btoa(String.fromCharCode(...encryptedArray))
        };
    } catch (error) {
        console.error("Error encrypting data:", error);
        throw error;
    }
}

async function decryptData(encryptedObj) {
    try {
        if (!encryptionKey) {
            encryptionKey = await importEncryptionKey();
            if (!encryptionKey) throw new Error("Encryption key not found.");
        }
        const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
        const data = Uint8Array.from(atob(encryptedObj.data), c => c.charCodeAt(0));
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            encryptionKey,
            data
        );
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error("Error decrypting data:", error);
        throw error;
    }
}

async function resetEncryptionKey() {
    if (confirm("Resetting the encryption key will clear all encrypted data. Are you sure?")) {
        localStorage.removeItem('encryptionKey');
        entries = [];
        localStorage.setItem('entries', JSON.stringify(entries));
        encryptionKey = null;
        notifyObservers();
        showAlert("Encryption key reset successfully. All encrypted data has been cleared.", "success");
    }
}

// Date conversion utility
function gregorianToBS(gregorianDate) {
    try {
        const gregYear = gregorianDate.getFullYear();
        const gregMonth = gregorianDate.getMonth() + 1;
        const gregDay = gregorianDate.getDate();
        for (const year in calendarData) {
            const months = calendarData[year];
            for (let monthIdx = 0; monthIdx < months.length; monthIdx++) {
                const month = months[monthIdx];
                const startDate = new Date(month.gregStart);
                const startYear = startDate.getFullYear();
                const startMonth = startDate.getMonth() + 1;
                const startDay = startDate.getDate();
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + month.days - 1);
                const endYear = endDate.getFullYear();
                const endMonth = endDate.getMonth() + 1;
                const endDay = endDate.getDate();
                const gregDateStr = `${gregYear}-${String(gregMonth).padStart(2, '0')}-${String(gregDay).padStart(2, '0')}`;
                const startDateStr = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
                const endDateStr = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
                if (gregDateStr >= startDateStr && gregDateStr <= endDateStr) {
                    const diffDays = Math.floor((gregorianDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(diffDays).padStart(2, '0')}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error converting Gregorian to BS:", error);
        return null;
    }
}

function bsToGregorian(bsDate) {
    try {
        const [year, month, day] = bsDate.split('-').map(Number);
        const monthData = calendarData[year][month - 1];
        const startDate = new Date(monthData.gregStart);
        const gregDate = new Date(startDate);
        gregDate.setDate(startDate.getDate() + day - 1);
        return gregDate;
    } catch (error) {
        console.error("Error converting BS to Gregorian:", error);
        return null;
    }
}

// Translation utility
function translate(text, lang) {
    try {
        if (lang === 'ne') {
            return customTranslations[text] || document.querySelector(`[data-en="${text}"]`)?.getAttribute('data-ne') || text;
        }
        return text;
    } catch (error) {
        console.error("Error translating text:", error);
        return text;
    }
}

function updateLanguage() {
    try {
        document.querySelectorAll('[data-en]').forEach(elem => {
            const text = elem.getAttribute('data-en');
            elem.textContent = translate(text, language);
        });
        document.querySelectorAll('.month-tab').forEach((tab, idx) => {
            tab.textContent = language === 'ne' ? calendarData[currentYear][idx].name : translate(calendarData[currentYear][idx].name, 'en');
            tab.classList.toggle('nepali', language === 'ne');
        });
        renderCalendar();
    } catch (error) {
        console.error("Error updating language:", error);
    }
}

// Observer pattern for state changes
function addObserver(observer) {
    observers.push(observer);
}

function notifyObservers() {
    observers.forEach(observer => observer());
}

// Weather fetch
async function fetchWeather() {
    try {
        const response = await fetch('https://api.grok.com/weather?location=Kathmandu');
        const data = await response.json();
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = `
            <img src="${data.icon}" alt="Weather Icon">
            <span>${data.temperature}°C, ${data.description}</span>
        `;
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById('weatherInfo').innerHTML = "Unable to fetch weather.";
    }
}

// Render functions
function renderMonthTabs() {
    try {
        const monthTabs = document.getElementById('monthTabs');
        monthTabs.innerHTML = '';
        calendarData[currentYear].forEach((month, idx) => {
            const tab = document.createElement('div');
            tab.className = `month-tab ${language === 'ne' ? 'nepali' : ''} ${idx === currentMonth ? 'active' : ''}`;
            tab.textContent = language === 'ne' ? month.name : translate(month.name, 'en');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', idx === currentMonth ? 'true' : 'false');
            tab.setAttribute('tabindex', idx === currentMonth ? '0' : '-1');
            tab.addEventListener('click', () => {
                currentMonth = idx;
                document.querySelectorAll('.month-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');
                renderCalendar();
            });
            monthTabs.appendChild(tab);
        });
    } catch (error) {
        console.error("Error rendering month tabs:", error);
    }
}

async function renderCalendar() {
    try {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        const monthData = calendarData[currentYear][currentMonth];
        const startDate = new Date(monthData.gregStart);
        const startDay = startDate.getDay();
        const daysInMonth = monthData.days;

        // Add day headers
        const daysOfWeek = language === 'ne' ? ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add empty slots before the first day
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const gregDate = bsToGregorian(dateStr);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.setAttribute('tabindex', '0');
            dayDiv.setAttribute('role', 'gridcell');
            dayDiv.setAttribute('aria-label', `Day ${day}, ${monthData.name}`);

            if (festivals[dateStr]) {
                dayDiv.classList.add(festivals[dateStr].class);
                const festivalSpan = document.createElement('span');
                festivalSpan.className = 'festival';
                festivalSpan.textContent = language === 'ne' ? translate(festivals[dateStr].name, 'ne') : festivals[dateStr].name;
                const tooltip = document.createElement('span');
                tooltip.className = 'festival-tooltip';
                tooltip.textContent = festivalSpan.textContent;
                dayDiv.appendChild(tooltip);
                dayDiv.appendChild(festivalSpan);
            }

            const bsDate = document.createElement('div');
            bsDate.className = 'bs-date';
            bsDate.textContent = day;
            dayDiv.appendChild(bsDate);

            const gregDateDiv = document.createElement('div');
            gregDateDiv.className = 'greg-date';
            gregDateDiv.textContent = gregDate.toISOString().split('T')[0];
            dayDiv.appendChild(gregDateDiv);

            // Check for entries
            const dayEntries = entries.filter(e => e.date === dateStr);
            for (const entry of dayEntries) {
                let title = entry.title;
                if (entry.encrypted) {
                    try {
                        title = await decryptData(entry.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                const indicator = document.createElement('div');
                indicator.className = `${entry.type}-indicator`;
                const tooltip = document.createElement('span');
                tooltip.className = `${entry.type}-tooltip`;
                tooltip.textContent = title;
                dayDiv.appendChild(indicator);
                dayDiv.appendChild(tooltip);

                if (entry.reminder && entry.reminderTime) {
                    const reminderIndicator = document.createElement('div');
                    reminderIndicator.className = 'reminder-indicator';
                    const reminderTooltip = document.createElement('span');
                    reminderTooltip.className = 'reminder-tooltip';
                    reminderTooltip.textContent = `Reminder: ${title}`;
                    dayDiv.appendChild(reminderIndicator);
                    dayDiv.appendChild(reminderTooltip);
                }
            }

            if (dateStr === todayBS) {
                dayDiv.classList.add('today');
            }

            dayDiv.addEventListener('click', () => {
                selectedDate = dateStr;
                openEntryForm();
            });
            dayDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    selectedDate = dateStr;
                    openEntryForm();
                }
            });

            calendarGrid.appendChild(dayDiv);
        }

        document.getElementById('currentMonth').textContent = `${monthData.name} ${currentYear} BS`;
        renderHolidays();
        renderSummary();
        renderReminders();
    } catch (error) {
        console.error("Error rendering calendar:", error);
    }
}

function renderHolidays() {
    try {
        const holidayList = document.getElementById('holidayList');
        holidayList.innerHTML = '';
        const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        Object.keys(festivals).forEach(date => {
            if (date.startsWith(monthStr)) {
                const li = document.createElement('li');
                li.textContent = `${date}: ${language === 'ne' ? translate(festivals[date].name, 'ne') : festivals[date].name}`;
                li.classList.add(language === 'ne' ? 'nepali' : '');
                holidayList.appendChild(li);
            }
        });
    } catch (error) {
        console.error("Error rendering holidays:", error);
    }
}

function renderSummary() {
    try {
        const summary = document.getElementById('monthlySummary');
        const monthEntries = entries.filter(e => e.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
        const income = monthEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + (parseFloat(e.title.data || e.title) || 0), 0);
        const expense = monthEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + (parseFloat(e.title.data || e.title) || 0), 0);
        summary.textContent = `Income: ${income.toFixed(2)}, Expense: ${expense.toFixed(2)}, Balance: ${(income - expense).toFixed(2)}`;
    } catch (error) {
        console.error("Error rendering summary:", error);
    }
}

function renderReminders() {
    try {
        const remindersList = document.getElementById('upcomingReminders');
        remindersList.innerHTML = '';
        const upcomingEntries = entries.filter(e => e.reminder && e.reminderTime).sort((a, b) => a.date.localeCompare(b.date));
        const now = new Date();
        for (const entry of upcomingEntries) {
            const entryDate = bsToGregorian(entry.date);
            entryDate.setHours(parseInt(entry.time.split(':')[0]), parseInt(entry.time.split(':')[1]));
            const reminderTime = new Date(entryDate.getTime() - entry.reminderTime * 60 * 1000);
            if (reminderTime > now) {
                const li = document.createElement('li');
                let title = entry.title;
                if (entry.encrypted) {
                    try {
                        title = await decryptData(entry.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                li.textContent = `${entry.date} ${entry.time}: ${title} (${entry.reminderTime} minutes before)`;
                li.classList.add(language === 'ne' ? 'nepali' : '');
                remindersList.appendChild(li);
            }
        }
    } catch (error) {
        console.error("Error rendering reminders:", error);
    }
}

// Entry form handling
function openEntryForm() {
    try {
        const form = document.getElementById('noteForm');
        const selectedDateSpan = document.getElementById('selectedDate');
        const entryType = document.getElementById('entryType');
        const noteTitle = document.getElementById('noteTitle');
        const noteTime = document.getElementById('noteTime');
        const setReminder = document.getElementById('setReminder');
        const reminderTime = document.getElementById('reminderTime');
        const recurringOption = document.getElementById('recurringOption');
        const noteDescription = document.getElementById('noteDescription');
        const entryCategory = document.getElementById('entryCategory');

        selectedDateSpan.textContent = selectedDate;
        noteTitle.value = '';
        noteTime.value = '';
        setReminder.checked = false;
        reminderTime.style.display = 'none';
        recurringOption.value = 'none';
        noteDescription.value = '';
        entryCategory.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            entryCategory.appendChild(option);
        });

        entryType.addEventListener('change', () => {
            noteTitle.placeholder = entryType.value === 'note' ? 'Note Title' : 'Amount';
            entryCategory.style.display = entryType.value === 'note' ? 'none' : 'block';
        });

        setReminder.addEventListener('change', () => {
            reminderTime.style.display = setReminder.checked ? 'block' : 'none';
        });

        form.classList.add('active');
    } catch (error) {
        console.error("Error opening entry form:", error);
    }
}

async function saveEntry() {
    try {
        const entryType = document.getElementById('entryType').value;
        const noteTitle = document.getElementById('noteTitle').value;
        const noteTime = document.getElementById('noteTime').value;
        const setReminder = document.getElementById('setReminder').checked;
        const reminderTime = document.getElementById('reminderTime').value;
        const recurringOption = document.getElementById('recurringOption').value;
        const noteDescription = document.getElementById('noteDescription').value;
        const entryCategory = document.getElementById('entryCategory').value;

        if (!noteTitle) {
            showAlert("Title or amount is required.", "error");
            return;
        }

        const encryptedTitle = await encryptData(noteTitle);
        let encryptedDescription = null;
        if (noteDescription) {
            encryptedDescription = await encryptData(noteDescription);
        }

        const entry = {
            date: selectedDate,
            type: entryType,
            title: encryptedTitle,
            time: noteTime,
            reminder: setReminder,
            reminderTime: setReminder ? reminderTime : null,
            recurring: recurringOption,
            description: encryptedDescription,
            category: entryType !== 'note' ? entryCategory : null,
            encrypted: true
        };

        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        notifyObservers();
        document.getElementById('noteForm').classList.remove('active');
        showAlert("Entry saved successfully.", "success");

        // Handle recurring entries
        if (recurringOption !== 'none') {
            let nextDate = bsToGregorian(selectedDate);
            const [year, month] = selectedDate.split('-').map(Number);
            while (nextDate.getFullYear() <= 2082) {
                if (recurringOption === 'daily') nextDate.setDate(nextDate.getDate() + 1);
                else if (recurringOption === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
                else if (recurringOption === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
                const nextBSDate = gregorianToBS(nextDate);
                if (!nextBSDate || parseInt(nextBSDate.split('-')[0]) > 2082) break;
                entries.push({ ...entry, date: nextBSDate });
            }
            localStorage.setItem('entries', JSON.stringify(entries));
        }
    } catch (error) {
        console.error("Error saving entry:", error);
        showAlert("Error saving entry.", "error");
    }
}

// Notes modal
async function openNotesModal() {
    try {
        const modal = document.getElementById('notesModal');
        const monthFilter = document.getElementById('monthFilter');
        monthFilter.innerHTML = '<option value="all">All Months</option>';
        calendarData[currentYear].forEach((month, idx) => {
            const option = document.createElement('option');
            option.value = idx + 1;
            option.textContent = language === 'ne' ? month.name : translate(month.name, 'en');
            monthFilter.appendChild(option);
        });

        modal.style.display = 'block';
        renderNotesList();
    } catch (error) {
        console.error("Error opening notes modal:", error);
    }
}

async function renderNotesList() {
    try {
        const notesList = document.getElementById('notesList');
        const monthFilter = document.getElementById('monthFilter').value;
        const dateFrom = document.getElementById('notesDateFrom').value;
        const dateTo = document.getElementById('notesDateTo').value;
        const typeFilter = document.getElementById('notesTypeFilter').value;
        const sortBy = document.getElementById('notesSortBy').value;
        const searchQuery = document.getElementById('notesSearch').value.toLowerCase();

        let filteredEntries = [...entries];
        if (monthFilter !== 'all') {
            filteredEntries = filteredEntries.filter(e => e.date.startsWith(`${currentYear}-${String(monthFilter).padStart(2, '0')}`));
        }
        if (dateFrom) {
            filteredEntries = filteredEntries.filter(e => e.date >= dateFrom.replace(/-/g, '-'));
        }
        if (dateTo) {
            filteredEntries = filteredEntries.filter(e => e.date <= dateTo.replace(/-/g, '-'));
        }
        if (typeFilter !== 'all') {
            filteredEntries = filteredEntries.filter(e => e.type === typeFilter);
        }
        if (searchQuery) {
            filteredEntries = filteredEntries.filter(async e => {
                let title = e.title;
                if (e.encrypted) {
                    try {
                        title = await decryptData(e.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                return title.toLowerCase().includes(searchQuery);
            });
        }

        if (sortBy === 'date-asc') filteredEntries.sort((a, b) => a.date.localeCompare(b.date));
        else if (sortBy === 'date-desc') filteredEntries.sort((a, b) => b.date.localeCompare(a.date));
        else if (sortBy === 'title-asc') filteredEntries.sort(async (a, b) => {
            const titleA = a.encrypted ? await decryptData(a.title) : a.title;
            const titleB = b.encrypted ? await decryptData(b.title) : b.title;
            return titleA.localeCompare(titleB);
        });
        else if (sortBy === 'title-desc') filteredEntries.sort(async (a, b) => {
            const titleA = a.encrypted ? await decryptData(a.title) : a.title;
            const titleB = b.encrypted ? await decryptData(b.title) : b.title;
            return titleB.localeCompare(titleA);
        });

        notesList.innerHTML = '';
        for (const entry of filteredEntries) {
            const div = document.createElement('div');
            div.className = 'note-item';
            let title = entry.title;
            let description = entry.description;
            if (entry.encrypted) {
                try {
                    title = await decryptData(entry.title);
                    if (entry.description) description = await decryptData(entry.description);
                } catch (error) {
                    title = "[Encrypted]";
                    description = "[Encrypted]";
                }
            }
            div.innerHTML = `
                <p><strong>${entry.date} (${entry.type})</strong>: ${title}</p>
                ${description ? `<p>${description}</p>` : ''}
                <div class="note-actions">
                    <span class="edit-note">Edit</span>
                    <span class="delete-note">Delete</span>
                </div>
            `;
            div.querySelector('.edit-note').addEventListener('click', () => editEntry(entry));
            div.querySelector('.delete-note').addEventListener('click', () => deleteEntry(entry));
            notesList.appendChild(div);
        }
    } catch (error) {
        console.error("Error rendering notes list:", error);
    }
}

function editEntry(entry) {
    try {
        selectedDate = entry.date;
        openEntryForm();
        document.getElementById('entryType').value = entry.type;
        document.getElementById('noteTitle').value = entry.encrypted ? decryptData(entry.title) : entry.title;
        document.getElementById('noteTime').value = entry.time || '';
        document.getElementById('setReminder').checked = entry.reminder;
        document.getElementById('reminderTime').value = entry.reminderTime || '0';
        document.getElementById('reminderTime').style.display = entry.reminder ? 'block' : 'none';
        document.getElementById('recurringOption').value = entry.recurring || 'none';
        document.getElementById('noteDescription').value = entry.description ? (entry.encrypted ? decryptData(entry.description) : entry.description) : '';
        document.getElementById('entryCategory').value = entry.category || '';
        document.getElementById('saveNote').style.display = 'none';
        document.getElementById('editEntry').style.display = 'block';
        document.getElementById('editEntry').onclick = async () => {
            const updatedEntry = {
                date: selectedDate,
                type: document.getElementById('entryType').value,
                title: await encryptData(document.getElementById('noteTitle').value),
                time: document.getElementById('noteTime').value,
                reminder: document.getElementById('setReminder').checked,
                reminderTime: document.getElementById('setReminder').checked ? document.getElementById('reminderTime').value : null,
                recurring: document.getElementById('recurringOption').value,
                description: document.getElementById('noteDescription').value ? await encryptData(document.getElementById('noteDescription').value) : null,
                category: document.getElementById('entryType').value !== 'note' ? document.getElementById('entryCategory').value : null,
                encrypted: true
            };
            const index = entries.indexOf(entry);
            entries[index] = updatedEntry;
            localStorage.setItem('entries', JSON.stringify(entries));
            notifyObservers();
            document.getElementById('noteForm').classList.remove('active');
            renderNotesList();
            showAlert("Entry updated successfully.", "success");
        };
    } catch (error) {
        console.error("Error editing entry:", error);
    }
}

function deleteEntry(entry) {
    try {
        if (confirm("Are you sure you want to delete this entry?")) {
            entries = entries.filter(e => e !== entry);
            localStorage.setItem('entries', JSON.stringify(entries));
            notifyObservers();
            renderNotesList();
            showAlert("Entry deleted successfully.", "success");
        }
    } catch (error) {
        console.error("Error deleting entry:", error);
    }
}

// Financial reports modal
function openReportModal() {
    try {
        const modal = document.getElementById('reportModal');
        const financeCategoryFilter = document.getElementById('financeCategoryFilter');
        financeCategoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            financeCategoryFilter.appendChild(option);
        });
        modal.style.display = 'block';
        renderReports('weeklySummary');
    } catch (error) {
        console.error("Error opening report modal:", error);
    }
}

async function renderReports(tab) {
    try {
        const reportContent = document.getElementById('reportContent');
        const dateFrom = document.getElementById('financeDateFrom').value;
        const dateTo = document.getElementById('financeDateTo').value;
        const categoryFilter = document.getElementById('financeCategoryFilter').value;
        const sortBy = document.getElementById('financeSortBy').value;
        const searchQuery = document.getElementById('financeSearch').value.toLowerCase();

        let filteredEntries = entries.filter(e => e.type === 'income' || e.type === 'expense');
        if (dateFrom) {
            filteredEntries = filteredEntries.filter(e => e.date >= dateFrom.replace(/-/g, '-'));
        }
        if (dateTo) {
            filteredEntries = filteredEntries.filter(e => e.date <= dateTo.replace(/-/g, '-'));
        }
        if (categoryFilter !== 'all') {
            filteredEntries = filteredEntries.filter(e => e.category === categoryFilter);
        }
        if (searchQuery) {
            filteredEntries = filteredEntries.filter(async e => {
                let title = e.title;
                if (e.encrypted) {
                    try {
                        title = await decryptData(e.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                return title.toLowerCase().includes(searchQuery);
            });
        }

        if (sortBy === 'date-asc') filteredEntries.sort((a, b) => a.date.localeCompare(b.date));
        else if (sortBy === 'date-desc') filteredEntries.sort((a, b) => b.date.localeCompare(a.date));
        else if (sortBy === 'amount-asc') filteredEntries.sort(async (a, b) => {
            const amountA = parseFloat(a.encrypted ? await decryptData(a.title) : a.title) || 0;
            const amountB = parseFloat(b.encrypted ? await decryptData(b.title) : b.title) || 0;
            return amountA - amountB;
        });
        else if (sortBy === 'amount-desc') filteredEntries.sort(async (a, b) => {
            const amountA = parseFloat(a.encrypted ? await decryptData(a.title) : a.title) || 0;
            const amountB = parseFloat(b.encrypted ? await decryptData(b.title) : b.title) || 0;
            return amountB - amountA;
        });

        reportContent.innerHTML = '';
        if (tab === 'weeklySummary') {
            const weeklyData = {};
            for (const entry of filteredEntries) {
                const gregDate = bsToGregorian(entry.date);
                const weekNumber = Math.ceil((gregDate.getDate() + gregDate.getDay()) / 7);
                const key = `${gregDate.getFullYear()}-${weekNumber}`;
                if (!weeklyData[key]) weeklyData[key] = { income: 0, expense: 0 };
                const amount = parseFloat(entry.encrypted ? await decryptData(entry.title) : entry.title) || 0;
                if (entry.type === 'income') weeklyData[key].income += amount;
                else weeklyData[key].expense += amount;
            }
            const table = document.createElement('table');
            table.className = 'report-table';
            table.innerHTML = `
                <tr><th>Week</th><th>Income</th><th>Expense</th><th>Balance</th></tr>
            `;
            for (const [week, data] of Object.entries(weeklyData)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${week}</td>
                    <td>${data.income.toFixed(2)}</td>
                    <td>${data.expense.toFixed(2)}</td>
                    <td>${(data.income - data.expense).toFixed(2)}</td>
                `;
                table.appendChild(row);
            }
            reportContent.appendChild(table);
        } else if (tab === 'weekly') {
            const table = document.createElement('table');
            table.className = 'report-table';
            table.innerHTML = `
                <tr><th>Date</th><th>Type</th><th>Amount</th><th>Category</th></tr>
            `;
            for (const entry of filteredEntries) {
                let amount = entry.title;
                if (entry.encrypted) {
                    amount = await decryptData(entry.title);
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.type}</td>
                    <td>${amount}</td>
                    <td>${entry.category || '-'}</td>
                `;
                table.appendChild(row);
            }
            reportContent.appendChild(table);
        } else if (tab === 'monthly') {
            const monthlyData = {};
            for (const entry of filteredEntries) {
                const month = entry.date.substring(0, 7);
                if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
                const amount = parseFloat(entry.encrypted ? await decryptData(entry.title) : entry.title) || 0;
                if (entry.type === 'income') monthlyData[month].income += amount;
                else monthlyData[month].expense += amount;
            }
            const table = document.createElement('table');
            table.className = 'report-table';
            table.innerHTML = `
                <tr><th>Month</th><th>Income</th><th>Expense</th><th>Balance</th></tr>
            `;
            for (const [month, data] of Object.entries(monthlyData)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${month}</td>
                    <td>${data.income.toFixed(2)}</td>
                    <td>${data.expense.toFixed(2)}</td>
                    <td>${(data.income - data.expense).toFixed(2)}</td>
                `;
                table.appendChild(row);
            }
            reportContent.appendChild(table);
        } else if (tab === 'yearly') {
            const yearlyData = {};
            for (const entry of filteredEntries) {
                const year = entry.date.substring(0, 4);
                if (!yearlyData[year]) yearlyData[year] = { income: 0, expense: 0 };
                const amount = parseFloat(entry.encrypted ? await decryptData(entry.title) : entry.title) || 0;
                if (entry.type === 'income') yearlyData[year].income += amount;
                else yearlyData[year].expense += amount;
            }
            const table = document.createElement('table');
            table.className = 'report-table';
            table.innerHTML = `
                <tr><th>Year</th><th>Income</th><th>Expense</th><th>Balance</th></tr>
            `;
            for (const [year, data] of Object.entries(yearlyData)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${year}</td>
                    <td>${data.income.toFixed(2)}</td>
                    <td>${data.expense.toFixed(2)}</td>
                    <td>${(data.income - data.expense).toFixed(2)}</td>
                `;
                table.appendChild(row);
            }
            reportContent.appendChild(table);
        } else if (tab === 'analytics') {
            const monthlyIncome = Array(12).fill(0);
            const monthlyExpense = Array(12).fill(0);
            for (const entry of filteredEntries) {
                const month = parseInt(entry.date.split('-')[1]) - 1;
                const amount = parseFloat(entry.encrypted ? await decryptData(entry.title) : entry.title) || 0;
                if (entry.type === 'income') monthlyIncome[month] += amount;
                else monthlyExpense[month] += amount;
            }
            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart-container';
            const canvas = document.createElement('canvas');
            chartDiv.appendChild(canvas);
            reportContent.appendChild(chartDiv);
            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: calendarData[currentYear].map(m => m.name),
                    datasets: [
                        {
                            label: 'Income',
                            data: monthlyIncome,
                            backgroundColor: '#28a745'
                        },
                        {
                            label: 'Expense',
                            data: monthlyExpense,
                            backgroundColor: '#dc3545'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error rendering reports:", error);
    }
}

// Export functions
async function exportToExcel(data, filename, type) {
    try {
        const decryptedData = [];
        for (const entry of data) {
            let title = entry.title;
            let description = entry.description;
            if (entry.encrypted) {
                title = await decryptData(entry.title);
                if (entry.description) description = await decryptData(entry.description);
            }
            decryptedData.push({ ...entry, title, description });
        }
        const ws = XLSX.utils.json_to_sheet(decryptedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, type);
        XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
        console.error(`Error exporting ${type} to Excel:`, error);
        showAlert(`Error exporting ${type} to Excel.`, "error");
    }
}

async function exportToPDF(data, filename, type) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const decryptedData = [];
        for (const entry of data) {
            let title = entry.title;
            let description = entry.description;
            if (entry.encrypted) {
                title = await decryptData(entry.title);
                if (entry.description) description = await decryptData(entry.description);
            }
            decryptedData.push([entry.date, entry.type, title, description || '', entry.category || '']);
        }
        doc.autoTable({
            head: [['Date', 'Type', 'Title/Amount', 'Description', 'Category']],
            body: decryptedData
        });
        doc.save(`${filename}.pdf`);
    } catch (error) {
        console.error(`Error exporting ${type} to PDF:`, error);
        showAlert(`Error exporting ${type} to PDF.`, "error");
    }
}

// Import functions
function importFromExcel(file, type) {
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            if (type === 'notes') {
                for (const entry of json) {
                    entries.push({
                        date: entry.date,
                        type: entry.type || 'note',
                        title: await encryptData(entry.title),
                        time: entry.time || '',
                        description: entry.description ? await encryptData(entry.description) : null,
                        encrypted: true
                    });
                }
            } else if (type === 'finance') {
                for (const entry of json) {
                    entries.push({
                        date: entry.date,
                        type: entry.type,
                        title: await encryptData(entry.title),
                        category: entry.category || 'Other',
                        encrypted: true
                    });
                }
            }
            localStorage.setItem('entries', JSON.stringify(entries));
            notifyObservers();
            showAlert("Data imported successfully.", "success");
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error(`Error importing ${type} from Excel:`, error);
        showAlert(`Error importing ${type} from Excel.`, "error");
    }
}

// Utility functions
function showAlert(message, type) {
    try {
        const alert = document.getElementById('alertMessage');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error("Error showing alert:", error);
    }
}

// Initialization
async function init() {
    try {
        // Initialize todayBS
        todayBS = gregorianToBS(todayGregorian);
        if (todayBS) {
            const [year, month] = todayBS.split('-').map(Number);
            currentYear = year;
            currentMonth = month - 1;
            selectedDate = todayBS;
        } else {
            currentMonth = 0; // Default to Baishakh if todayBS is not in 2082
        }

        // Set up today date display
        document.getElementById('todayNepaliDate').textContent = `Nepali: ${todayBS}`;
        document.getElementById('todayEnglishDate').textContent = `Gregorian: ${todayGregorian.toISOString().split('T')[0]}`;

        // Populate year filter
        const yearFilter = document.getElementById('yearFilter');
        Object.keys(calendarData).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year} BS`;
            yearFilter.appendChild(option);
        });
        yearFilter.value = currentYear;

        // Set up event listeners
        yearFilter.addEventListener('change', () => {
            currentYear = parseInt(yearFilter.value);
            currentMonth = 0;
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('prevMonth').addEventListener('click', () => {
            if (currentMonth > 0) {
                currentMonth--;
            } else if (currentYear > Math.min(...Object.keys(calendarData).map(Number))) {
                currentYear--;
                currentMonth = calendarData[currentYear].length - 1;
                yearFilter.value = currentYear;
            }
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            if (currentMonth < calendarData[currentYear].length - 1) {
                currentMonth++;
            } else if (currentYear < Math.max(...Object.keys(calendarData).map(Number))) {
                currentYear++;
                currentMonth = 0;
                yearFilter.value = currentYear;
            }
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('todayButton').addEventListener('click', () => {
            if (todayBS) {
                const [year, month] = todayBS.split('-').map(Number);
                currentYear = year;
                currentMonth = month - 1;
                yearFilter.value = currentYear;
                renderMonthTabs();
                renderCalendar();
            }
        });

        document.getElementById('languageToggle').addEventListener('click', () => {
            language = language === 'en' ? 'ne' : 'en';
            localStorage.setItem('language', language);
            updateLanguage();
        });

        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });

        document.getElementById('resetEncryption').addEventListener('click', resetEncryptionKey);

        document.getElementById('saveNote').addEventListener('click', saveEntry);
        document.getElementById('closeEntry').addEventListener('click', () => {
            document.getElementById('noteForm').classList.remove('active');
        });

        document.getElementById('viewNotes').addEventListener('click', openNotesModal);
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('notesModal').style.display = 'none';
        });

        document.getElementById('monthFilter').addEventListener('change', renderNotesList);
        document.getElementById('notesDateFrom').addEventListener('change', renderNotesList);
        document.getElementById('notesDateTo').addEventListener('change', renderNotesList);
        document.getElementById('notesTypeFilter').addEventListener('change', renderNotesList);
        document.getElementById('notesSortBy').addEventListener('change', renderNotesList);
        document.getElementById('notesSearch').addEventListener('input', renderNotesList);
        document.getElementById('clearNotes').addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all notes?")) {
                entries = entries.filter(e => e.type !== 'note');
                localStorage.setItem('entries', JSON.stringify(entries));
                notifyObservers();
                renderNotesList();
                showAlert("Notes cleared successfully.", "success");
            }
        });

        document.getElementById('viewFinance').addEventListener('click', openReportModal);
        document.getElementById('closeReportModal').addEventListener('click', () => {
            document.getElementById('reportModal').style.display = 'none';
        });

        document.getElementById('weeklySummaryTab').addEventListener('click', () => {
            document.querySelectorAll('.report-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });
            document.getElementById('weeklySummaryTab').classList.add('active');
            document.getElementById('weeklySummaryTab').setAttribute('aria-selected', 'true');
            document.getElementById('weeklySummaryTab').setAttribute('tabindex', '0');
            renderReports('weeklySummary');
        });

        document.getElementById('weeklyReportTab').addEventListener('click', () => {
            document.querySelectorAll('.report-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });
            document.getElementById('weeklyReportTab').classList.add('active');
            document.getElementById('weeklyReportTab').setAttribute('aria-selected', 'true');
            document.getElementById('weeklyReportTab').setAttribute('tabindex', '0');
            renderReports('weekly');
        });

        document.getElementById('monthlyReportTab').addEventListener('click', () => {
            document.querySelectorAll('.report-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });
            document.getElementById('monthlyReportTab').classList.add('active');
            document.getElementById('monthlyReportTab').setAttribute('aria-selected', 'true');
            document.getElementById('monthlyReportTab').setAttribute('tabindex', '0');
            renderReports('monthly');
        });

        document.getElementById('yearlyReportTab').addEventListener('click', () => {
            document.querySelectorAll('.report-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });
            document.getElementById('yearlyReportTab').classList.add('active');
            document.getElementById('yearlyReportTab').setAttribute('aria-selected', 'true');
            document.getElementById('yearlyReportTab').setAttribute('tabindex', '0');
            renderReports('yearly');
        });

        document.getElementById('analyticsTab').addEventListener('click', () => {
            document.querySelectorAll('.report-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
            });
            document.getElementById('analyticsTab').classList.add('active');
            document.getElementById('analyticsTab').setAttribute('aria-selected', 'true');
            document.getElementById('analyticsTab').setAttribute('tabindex', '0');
            renderReports('analytics');
        });

        document.getElementById('financeDateFrom').addEventListener('change', () => renderReports(document.querySelector('.report-tab.active').id.replace('Tab', '')));
        document.getElementById('financeDateTo').addEventListener('change', () => renderReports(document.querySelector('.report-tab.active').id.replace('Tab', '')));
        document.getElementById('financeCategoryFilter').addEventListener('change', () => renderReports(document.querySelector('.report-tab.active').id.replace('Tab', '')));
        document.getElementById('financeSortBy').addEventListener('change', () => renderReports(document.querySelector('.report-tab.active').id.replace('Tab', '')));
        document.getElementById('financeSearch').addEventListener('input', () => renderReports(document.querySelector('.report-tab.active').id.replace('Tab', '')));

        // Export event listeners
        document.getElementById('exportExcelNotes').addEventListener('click', () => {
            const notes = entries.filter(e => e.type === 'note');
            exportToExcel(notes, 'notes_export', 'Notes');
        });
        document.getElementById('exportExcelFinance').addEventListener('click', () => {
            const finances = entries.filter(e => e.type === 'income' || e.type === 'expense');
            exportToExcel(finances, 'finance_export', 'Finance');
        });
        document.getElementById('exportExcelMonth').addEventListener('click', () => {
            const monthEntries = entries.filter(e => e.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
            exportToExcel(monthEntries, 'month_export', 'Month');
        });
        document.getElementById('exportExcelYear').addEventListener('click', () => {
            const yearEntries = entries.filter(e => e.date.startsWith(`${currentYear}`));
            exportToExcel(yearEntries, 'year_export', 'Year');
        });
        document.getElementById('exportExcelHoliday').addEventListener('click', () => {
            const holidays = Object.entries(festivals).map(([date, info]) => ({ date, name: info.name }));
            exportToExcel(holidays, 'holidays_export', 'Holidays');
        });

        document.getElementById('exportPDFNotes').addEventListener('click', () => {
            const notes = entries.filter(e => e.type === 'note');
            exportToPDF(notes, 'notes_export', 'Notes');
        });
        document.getElementById('exportPDFFinance').addEventListener('click', () => {
            const finances = entries.filter(e => e.type === 'income' || e.type === 'expense');
            exportToPDF(finances, 'finance_export', 'Finance');
        });
        document.getElementById('exportPDFMonth').addEventListener('click', () => {
            const monthEntries = entries.filter(e => e.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
            exportToPDF(monthEntries, 'month_export', 'Month');
        });
        document.getElementById('exportPDFYear').addEventListener('click', () => {
            const yearEntries = entries.filter(e => e.date.startsWith(`${currentYear}`));
            exportToPDF(yearEntries, 'year_export', 'Year');
        });
        document.getElementById('exportPDFHoliday').addEventListener('click', () => {
            const holidays = Object.entries(festivals).map(([date, info]) => ({ date, name: info.name }));
            exportToPDF(holidays, 'holidays_export', 'Holidays');
        });

        // Import event listeners
        document.getElementById('importExcelNotes').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importFromExcel(e.target.files[0], 'notes');
                e.target.value = ''; // Reset file input
            }
        });
        document.getElementById('importExcelFinance').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importFromExcel(e.target.files[0], 'finance');
                e.target.value = '';
            }
        });

        // Backup and Restore
        document.getElementById('backupData').addEventListener('click', () => {
            const backup = {
                entries,
                categories,
                customTranslations
            };
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'calendar_backup.json';
            a.click();
            URL.revokeObjectURL(url);
            showAlert("Data backed up successfully.", "success");
        });

        document.getElementById('restoreData').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const backup = JSON.parse(event.target.result);
                        entries = backup.entries || [];
                        categories = backup.categories || [];
                        customTranslations = backup.customTranslations || {};
                        localStorage.setItem('entries', JSON.stringify(entries));
                        localStorage.setItem('categories', JSON.stringify(categories));
                        localStorage.setItem('customTranslations', JSON.stringify(customTranslations));
                        notifyObservers();
                        showAlert("Data restored successfully.", "success");
                    } catch (error) {
                        console.error("Error restoring data:", error);
                        showAlert("Error restoring data.", "error");
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        // Add observer to update calendar on entries change
        addObserver(() => {
            renderCalendar();
            renderNotesList();
            renderReports(document.querySelector('.report-tab.active')?.id.replace('Tab', '') || 'weeklySummary');
        });

        // Initial render
        renderMonthTabs();
        renderCalendar();
        fetchWeather();
        updateLanguage();
    } catch (error) {
        console.error("Error initializing application:", error);
        showAlert("Error initializing application.", "error");
    }
}

// Start the application
loadExternalScripts();