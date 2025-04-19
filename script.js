const sheetJsUrl = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
const jsPdfUrl = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
const jsPdfAutoTableUrl = 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';
const chartJsUrl = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

const fs = require('fs').promises;
const path = require('path');

// Define a storage abstraction
const storage = {
    storageFile: path.join(__dirname, 'storage.json'),

    async initStorageFile() {
        try {
            await fs.access(this.storageFile);
        } catch (error) {
            await fs.writeFile(this.storageFile, JSON.stringify({}));
        }
    },

    async getItem(key) {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem(key);
        } else {
            try {
                await this.initStorageFile();
                const data = await fs.readFile(this.storageFile, 'utf8');
                const storageData = JSON.parse(data || '{}');
                return storageData[key] || null;
            } catch (error) {
                console.error(`Error reading storage for key ${key}:`, error);
                return null;
            }
        }
    },

    async setItem(key, value) {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            try {
                await this.initStorageFile();
                const data = await fs.readFile(this.storageFile, 'utf8');
                const storageData = JSON.parse(data || '{}');
                storageData[key] = value;
                await fs.writeFile(this.storageFile, JSON.stringify(storageData));
            } catch (error) {
                console.error(`Error writing storage for key ${key}:`, error);
            }
        }
    }
};

function loadExternalScripts() {
    console.log("Loading external scripts...");
    const scripts = [
        { src: sheetJsUrl, loaded: false },
        { src: jsPdfUrl, loaded: false },
        { src: jsPdfAutoTableUrl, loaded: false },
        { src: chartJsUrl, loaded: false }
    ];

    let anyScriptLoaded = false;

    scripts.forEach(script => {
        const scriptElement = document.createElement('script');
        scriptElement.src = script.src;
        scriptElement.async = true;
        scriptElement.onload = () => {
            script.loaded = true;
            anyScriptLoaded = true;
            console.log(`${script.src} loaded`);
            if (scripts.every(s => s.loaded || s.failed)) {
                console.log("All scripts processed, initializing...");
                init();
            }
        };
        scriptElement.onerror = () => {
            script.failed = true;
            console.error(`Failed to load ${script.src}, proceeding anyway...`);
            if (scripts.every(s => s.loaded || s.failed)) {
                console.log("All scripts processed, initializing...");
                init();
            }
        };
        document.head.appendChild(scriptElement);
    });

    setTimeout(() => {
        if (!anyScriptLoaded) {
            console.warn("Script loading timeout, proceeding with initialization...");
            init();
        }
    }, 5000);
}

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

let state = {
    currentYear: 2082,
    currentMonth: 0,
    todayGregorian: new Date(),
    todayBS: '',
    selectedDate: '',
    encryptionKey: null,
    entries: [],
    categories: ["Food", "Salary", "Rent", "Utilities", "Transport", "Entertainment", "Freelance", "Other"],
    customTranslations: {},
    language: 'en'
};

async function init() {
    try {
        console.log("Initializing application...");

        // Initialize storage-dependent state properties
        console.log("Fetching language from storage...");
        state.language = (await storage.getItem('language')) || 'en';
        console.log("Language set to:", state.language);

        console.log("Fetching entries from storage...");
        const entriesData = (await storage.getItem('entries')) || '[]';
        state.entries = JSON.parse(entriesData);
        console.log("Entries loaded:", state.entries.length);

        console.log("Fetching categories from storage...");
        state.categories = JSON.parse((await storage.getItem('categories')) || '["Food", "Salary", "Rent", "Utilities", "Transport", "Entertainment", "Freelance", "Other"]');
        console.log("Categories loaded:", state.categories);

        console.log("Fetching custom translations from storage...");
        state.customTranslations = JSON.parse((await storage.getItem('customTranslations')) || '{}');
        console.log("Custom translations loaded:", state.customTranslations);

        // Set today's BS date
        console.log("Converting today's date to BS...");
        state.todayBS = gregorianToBS(state.todayGregorian);
        if (!state.todayBS) {
            console.error("Failed to set todayBS, defaulting to Baishakh 1, 2082");
            state.todayBS = "2082-01-01";
        }
        console.log("Today BS Date:", state.todayBS);

        // Set the current month based on today's BS date if applicable
        console.log("Setting current month...");
        const [year, month] = state.todayBS.split('-').map(Number);
        if (year === state.currentYear) {
            state.currentMonth = month - 1;
        }
        console.log("Current month set to:", state.currentMonth);

        // Populate year filter
        console.log("Populating year filter...");
        const yearFilter = document.getElementById('yearFilter');
        if (yearFilter) {
            Object.keys(calendarData).forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                if (year == state.currentYear) option.selected = true;
                yearFilter.appendChild(option);
            });
            yearFilter.addEventListener('change', () => {
                state.currentYear = parseInt(yearFilter.value);
                state.currentMonth = 0;
                renderMonthTabs();
                renderCalendar();
            });
        } else {
            console.error("yearFilter element not found");
        }

        // Set up event listeners
        console.log("Setting up event listeners...");
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            state.currentMonth--;
            if (state.currentMonth < 0) {
                state.currentMonth = 11;
                state.currentYear--;
                yearFilter.value = state.currentYear;
            }
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            state.currentMonth++;
            if (state.currentMonth > 11) {
                state.currentMonth = 0;
                state.currentYear++;
                yearFilter.value = state.currentYear;
            }
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('todayButton')?.addEventListener('click', () => {
            const [year, month] = state.todayBS.split('-').map(Number);
            state.currentYear = year;
            state.currentMonth = month - 1;
            yearFilter.value = state.currentYear;
            renderMonthTabs();
            renderCalendar();
        });

        document.getElementById('languageToggle')?.addEventListener('click', async () => {
            state.language = state.language === 'en' ? 'ne' : 'en';
            await storage.setItem('language', state.language);
            updateLanguage();
        });

        document.getElementById('themeToggle')?.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });

        document.getElementById('addBirthdayReminder')?.addEventListener('click', () => {
            state.selectedDate = state.todayBS;
            openEntryForm();
        });

        document.getElementById('saveNote')?.addEventListener('click', saveEntry);
        document.getElementById('closeEntry')?.addEventListener('click', () => {
            document.getElementById('noteForm').style.display = 'none';
        });

        document.getElementById('viewNotes')?.addEventListener('click', openNotesModal);
        document.getElementById('closeModal')?.addEventListener('click', () => {
            document.getElementById('notesModal').style.display = 'none';
        });

        document.getElementById('viewFinance')?.addEventListener('click', openReportModal);
        document.getElementById('closeReportModal')?.addEventListener('click', () => {
            document.getElementById('reportModal').style.display = 'none';
        });

        document.getElementById('backupData')?.addEventListener('click', backupData);
        document.getElementById('restoreData')?.addEventListener('click', () => {
            document.getElementById('importExcelNotes').click();
        });

        document.getElementById('exportExcelMonth')?.addEventListener('click', exportMonthToExcel);
        document.getElementById('exportPDFMonth')?.addEventListener('click', exportMonthToPDF);

        // Set up report tabs
        const reportTabs = document.querySelectorAll('.report-tab');
        reportTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                reportTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                tab.setAttribute('tabindex', '0');
                renderReports(tab.id.replace('Tab', ''));
            });
        });

        // Update today section
        console.log("Updating today's date section...");
        const todayNepaliDate = document.getElementById('todayNepaliDate');
        const todayEnglishDate = document.getElementById('todayEnglishDate');
        if (todayNepaliDate) todayNepaliDate.textContent = state.todayBS;
        else console.error("todayNepaliDate element not found");
        if (todayEnglishDate) todayEnglishDate.textContent = state.todayGregorian.toISOString().split('T')[0];
        else console.error("todayEnglishDate element not found");

        // Force initial render
        console.log("Forcing initial render...");
        renderMonthTabs();
        renderCalendar();
        updateLanguage();
        console.log("Initialization complete");
    } catch (error) {
        console.error("Initialization failed:", error);
        showAlert("Failed to initialize the application. Please refresh the page.", "error");
    }
}

async function generateEncryptionKey() {
    try {
        const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedKey = await crypto.subtle.exportKey("raw", key);
        const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
        await storage.setItem('encryptionKey', keyString);
        return key;
    } catch (error) {
        console.error("Error generating encryption key:", error);
        throw error;
    }
}

async function importEncryptionKey() {
    try {
        const keyString = await storage.getItem('encryptionKey');
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
        if (!state.encryptionKey) {
            state.encryptionKey = await importEncryptionKey() || await generateEncryptionKey();
        }
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(data);
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            state.encryptionKey,
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
        if (!state.encryptionKey) {
            state.encryptionKey = await importEncryptionKey();
            if (!state.encryptionKey) throw new Error("Encryption key not found.");
        }
        const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
        const data = Uint8Array.from(atob(encryptedObj.data), c => c.charCodeAt(0));
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            state.encryptionKey,
            data
        );
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error("Error decrypting data:", error);
        throw error;
    }
}

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

function translate(text, lang) {
    try {
        if (lang === 'ne') {
            return state.customTranslations[text] || document.querySelector(`[data-en="${text}"]`)?.getAttribute('data-ne') || text;
        }
        return text;
    } catch (error) {
        console.error("Error translating text:", error);
        return text;
    }
}

function updateLanguage() {
    try {
        console.log("Updating language to:", state.language);
        document.querySelectorAll('[data-en]').forEach(elem => {
            const text = elem.getAttribute('data-en');
            elem.textContent = translate(text, state.language);
        });
        renderMonthTabs();
        renderCalendar();
    } catch (error) {
        console.error("Error updating language:", error);
    }
}

function showAlert(message, type) {
    try {
        const alert = document.getElementById('alertMessage');
        if (!alert) throw new Error("Alert element not found");
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        setTimeout(() => alert.style.display = 'none', 3000);
    } catch (error) {
        console.error("Error showing alert:", error);
    }
}

function renderMonthTabs() {
    try {
        console.log("Rendering month tabs...");
        const monthTabs = document.getElementById('monthTabs');
        if (!monthTabs) {
            console.error("monthTabs element not found in DOM");
            throw new Error("monthTabs element not found");
        }
        monthTabs.innerHTML = '';
        const months = calendarData[state.currentYear];
        if (!months) {
            console.error("No months data for year", state.currentYear);
            throw new Error("Months data not found");
        }
        months.forEach((month, idx) => {
            const tab = document.createElement('div');
            tab.className = `month-tab ${state.language === 'ne' ? 'nepali' : ''} ${idx === state.currentMonth ? 'active' : ''}`;
            tab.textContent = state.language === 'ne' ? month.name : translate(month.name, 'en');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', idx === state.currentMonth ? 'true' : 'false');
            tab.setAttribute('tabindex', idx === state.currentMonth ? '0' : '-1');
            tab.addEventListener('click', () => {
                console.log(`Switching to month ${idx}`);
                state.currentMonth = idx;
                renderMonthTabs();
                renderCalendar();
            });
            monthTabs.appendChild(tab);
        });
        console.log("Month tabs rendered successfully");
    } catch (error) {
        console.error("Error rendering month tabs:", error);
        showAlert("Failed to render month tabs.", "error");
    }
}

async function renderCalendar() {
    try {
        console.log("Rendering calendar...");
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) {
            console.error("calendarGrid element not found in DOM");
            throw new Error("calendarGrid element not found");
        }
        calendarGrid.innerHTML = '';
        const monthData = calendarData[state.currentYear][state.currentMonth];
        if (!monthData) {
            console.error("Month data not found for year", state.currentYear, "month", state.currentMonth);
            throw new Error("Month data not found");
        }
        const startDate = new Date(monthData.gregStart);
        const startDay = startDate.getDay();
        const daysInMonth = monthData.days;

        const daysOfWeek = state.language === 'ne' ? ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const gregDate = bsToGregorian(dateStr);
            if (!gregDate) {
                console.error("Failed to convert BS date to Gregorian:", dateStr);
                continue;
            }
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.setAttribute('tabindex', '0');
            dayDiv.setAttribute('role', 'gridcell');
            dayDiv.setAttribute('aria-label', `Day ${day}, ${monthData.name}`);

            if (festivals[dateStr]) {
                dayDiv.classList.add(festivals[dateStr].class);
                const festivalSpan = document.createElement('span');
                festivalSpan.className = 'festival';
                festivalSpan.textContent = state.language === 'ne' ? translate(festivals[dateStr].name, 'ne') : festivals[dateStr].name;
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

            const dayEntries = state.entries.filter(e => e.date === dateStr);
            for (const entry of dayEntries) {
                let title = "[Encrypted]";
                try {
                    if (entry.encrypted) {
                        title = await decryptData(entry.title);
                    } else {
                        title = entry.title;
                    }
                } catch (error) {
                    console.error("Failed to decrypt entry title for date", dateStr, ":", error);
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

            if (dateStr === state.todayBS) {
                dayDiv.classList.add('today');
            }

            dayDiv.addEventListener('click', () => {
                console.log(`Opening entry form for date ${dateStr}`);
                state.selectedDate = dateStr;
                openEntryForm();
            });
            calendarGrid.appendChild(dayDiv);
        }

        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${monthData.name} ${state.currentYear} BS`;
        } else {
            console.error("currentMonth element not found in DOM");
        }
        renderHolidays();
        renderSummary();
        renderReminders();
        console.log("Calendar rendered successfully");
    } catch (error) {
        console.error("Error rendering calendar:", error);
        showAlert("Failed to render calendar.", "error");
    }
}

function renderHolidays() {
    try {
        console.log("Rendering holidays...");
        const holidayList = document.getElementById('holidayList');
        if (!holidayList) throw new Error("holidayList element not found");
        holidayList.innerHTML = '';
        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const holidays = Object.keys(festivals)
            .filter(date => date.startsWith(monthStr))
            .map(date => ({
                date,
                festival: festivals[date]
            }));
        
        if (holidays.length === 0) {
            const noHoliday = document.createElement('p');
            noHoliday.textContent = state.language === 'ne' ? 'यो महिनामा कुनै चाडपर्व छैन।' : 'No holidays this month.';
            holidayList.appendChild(noHoliday);
        } else {
            holidays.forEach(holiday => {
                const holidayItem = document.createElement('div');
                holidayItem.className = 'holiday-item';
                const dateSpan = document.createElement('span');
                dateSpan.className = 'holiday-date';
                dateSpan.textContent = holiday.date;
                const nameSpan = document.createElement('span');
                nameSpan.className = 'holiday-name';
                nameSpan.textContent = state.language === 'ne' ? translate(holiday.festival.name, 'ne') : holiday.festival.name;
                holidayItem.appendChild(dateSpan);
                holidayItem.appendChild(nameSpan);
                holidayList.appendChild(holidayItem);
            });
        }
        console.log("Holidays rendered successfully");
    } catch (error) {
        console.error("Error rendering holidays:", error);
        showAlert("Failed to render holidays.", "error");
    }
}

function renderSummary() {
    try {
        console.log("Rendering summary...");
        const summaryList = document.getElementById('summaryList');
        if (!summaryList) throw new Error("summaryList element not found");
        summaryList.innerHTML = '';

        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const monthEntries = state.entries.filter(e => e.date.startsWith(monthStr));

        const summary = {
            income: 0,
            expense: 0,
            reminders: 0
        };

        monthEntries.forEach(entry => {
            if (entry.type === 'income') summary.income += parseFloat(entry.amount || 0);
            if (entry.type === 'expense') summary.expense += parseFloat(entry.amount || 0);
            if (entry.reminder) summary.reminders++;
        });

        const incomeItem = document.createElement('p');
        incomeItem.textContent = `${state.language === 'ne' ? 'आय' : 'Income'}: ${summary.income}`;
        summaryList.appendChild(incomeItem);

        const expenseItem = document.createElement('p');
        expenseItem.textContent = `${state.language === 'ne' ? 'खर्च' : 'Expense'}: ${summary.expense}`;
        summaryList.appendChild(expenseItem);

        const reminderItem = document.createElement('p');
        reminderItem.textContent = `${state.language === 'ne' ? 'रिमाइन्डरहरू' : 'Reminders'}: ${summary.reminders}`;
        summaryList.appendChild(reminderItem);

        console.log("Summary rendered successfully");
    } catch (error) {
        console.error("Error rendering summary:", error);
        showAlert("Failed to render summary.", "error");
    }
}

function renderReminders() {
    try {
        console.log("Rendering reminders...");
        const reminderList = document.getElementById('reminderList');
        if (!reminderList) throw new Error("reminderList element not found");
        reminderList.innerHTML = '';

        const upcomingReminders = state.entries
            .filter(e => e.reminder && e.reminderTime && e.date >= state.todayBS)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5);

        if (upcomingReminders.length === 0) {
            const noReminder = document.createElement('p');
            noReminder.textContent = state.language === 'ne' ? 'कुनै आगामी रिमाइन्डरहरू छैनन्।' : 'No upcoming reminders.';
            reminderList.appendChild(noReminder);
        } else {
            upcomingReminders.forEach(async reminder => {
                const reminderItem = document.createElement('div');
                reminderItem.className = 'reminder-item';
                const dateSpan = document.createElement('span');
                dateSpan.className = 'reminder-date';
                dateSpan.textContent = reminder.date;
                const titleSpan = document.createElement('span');
                titleSpan.className = 'reminder-title';
                let title = reminder.title;
                if (reminder.encrypted) {
                    try {
                        title = await decryptData(reminder.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                titleSpan.textContent = title;
                reminderItem.appendChild(dateSpan);
                reminderItem.appendChild(titleSpan);
                reminderList.appendChild(reminderItem);
            });
        }
        console.log("Reminders rendered successfully");
    } catch (error) {
        console.error("Error rendering reminders:", error);
        showAlert("Failed to render reminders.", "error");
    }
}

function openEntryForm() {
    try {
        console.log("Opening entry form...");
        const form = document.getElementById('noteForm');
        if (!form) throw new Error("noteForm element not found");
        form.style.display = 'block';
        document.getElementById('entryDate').value = state.selectedDate;
        document.getElementById('entryTitle').value = '';
        document.getElementById('entryAmount').value = '';
        document.getElementById('entryType').value = 'expense';
        document.getElementById('entryCategory').innerHTML = state.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        document.getElementById('entryReminder').checked = false;
        document.getElementById('entryReminderTime').value = '';
        document.getElementById('entryReminderTime').style.display = 'none';
        document.getElementById('entryEncrypt').checked = false;

        document.getElementById('entryReminder').addEventListener('change', (e) => {
            document.getElementById('entryReminderTime').style.display = e.target.checked ? 'block' : 'none';
        });
    } catch (error) {
        console.error("Error opening entry form:", error);
        showAlert("Failed to open entry form.", "error");
    }
}

async function saveEntry() {
    try {
        console.log("Saving entry...");
        const date = document.getElementById('entryDate').value;
        let title = document.getElementById('entryTitle').value;
        const amount = document.getElementById('entryAmount').value;
        const type = document.getElementById('entryType').value;
        const category = document.getElementById('entryCategory').value;
        const reminder = document.getElementById('entryReminder').checked;
        const reminderTime = document.getElementById('entryReminderTime').value;
        const encrypt = document.getElementById('entryEncrypt').checked;

        if (!date || !title) {
            showAlert("Date and title are required.", "error");
            return;
        }

        let entry = {
            date,
            title,
            amount,
            type,
            category,
            reminder,
            reminderTime,
            encrypted: false
        };

        if (encrypt) {
            entry.title = await encryptData(title);
            entry.encrypted = true;
        }

        state.entries.push(entry);
        await storage.setItem('entries', JSON.stringify(state.entries));
        document.getElementById('noteForm').style.display = 'none';
        renderCalendar();
        showAlert("Entry saved successfully.", "success");
    } catch (error) {
        console.error("Error saving entry:", error);
        showAlert("Failed to save entry.", "error");
    }
}

async function openNotesModal() {
    try {
        console.log("Opening notes modal...");
        const modal = document.getElementById('notesModal');
        if (!modal) throw new Error("notesModal element not found");
        const notesList = document.getElementById('notesList');
        if (!notesList) throw new Error("notesList element not found");
        notesList.innerHTML = '';

        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const monthEntries = state.entries.filter(e => e.date.startsWith(monthStr));

        if (monthEntries.length === 0) {
            const noNotes = document.createElement('p');
            noNotes.textContent = state.language === 'ne' ? 'यो महिनामा कुनै नोटहरू छैनन्।' : 'No notes for this month.';
            notesList.appendChild(noNotes);
        } else {
            for (const entry of monthEntries) {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                const dateSpan = document.createElement('span');
                dateSpan.className = 'note-date';
                dateSpan.textContent = entry.date;
                const titleSpan = document.createElement('span');
                titleSpan.className = 'note-title';
                let title = entry.title;
                if (entry.encrypted) {
                    try {
                        title = await decryptData(entry.title);
                    } catch (error) {
                        title = "[Encrypted]";
                    }
                }
                titleSpan.textContent = title;
                noteItem.appendChild(dateSpan);
                noteItem.appendChild(titleSpan);
                notesList.appendChild(noteItem);
            }
        }
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error opening notes modal:", error);
        showAlert("Failed to open notes modal.", "error");
    }
}

function openReportModal() {
    try {
        console.log("Opening report modal...");
        const modal = document.getElementById('reportModal');
        if (!modal) throw new Error("reportModal element not found");
        modal.style.display = 'block';
        renderReports('summary');
    } catch (error) {
        console.error("Error opening report modal:", error);
        showAlert("Failed to open report modal.", "error");
    }
}

async function renderReports(type) {
    try {
        console.log(`Rendering ${type} report...`);
        const reportContent = document.getElementById('reportContent');
        if (!reportContent) throw new Error("reportContent element not found");
        reportContent.innerHTML = '';

        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const monthEntries = state.entries.filter(e => e.date.startsWith(monthStr));

        if (type === 'summary') {
            const summary = { income: 0, expense: 0 };
            monthEntries.forEach(entry => {
                if (entry.type === 'income') summary.income += parseFloat(entry.amount || 0);
                if (entry.type === 'expense') summary.expense += parseFloat(entry.amount || 0);
            });

            const canvas = document.createElement('canvas');
            canvas.id = 'financeChart';
            reportContent.appendChild(canvas);

            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: [state.language === 'ne' ? 'आय' : 'Income', state.language === 'ne' ? 'खर्च' : 'Expense'],
                    datasets: [{
                        label: state.language === 'ne' ? 'रकम' : 'Amount',
                        data: [summary.income, summary.expense],
                        backgroundColor: ['#4CAF50', '#FF5733']
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        } else if (type === 'category') {
            const categorySummary = {};
            state.categories.forEach(cat => categorySummary[cat] = { income: 0, expense: 0 });
            monthEntries.forEach(entry => {
                if (entry.type === 'income') categorySummary[entry.category].income += parseFloat(entry.amount || 0);
                if (entry.type === 'expense') categorySummary[entry.category].expense += parseFloat(entry.amount || 0);
            });

            const table = document.createElement('table');
            table.className = 'report-table';
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ['Category', 'Income', 'Expense'].forEach(header => {
                const th = document.createElement('th');
                th.textContent = state.language === 'ne' ? translate(header, 'ne') : header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            state.categories.forEach(cat => {
                const row = document.createElement('tr');
                const catCell = document.createElement('td');
                catCell.textContent = cat;
                const incomeCell = document.createElement('td');
                incomeCell.textContent = categorySummary[cat].income;
                const expenseCell = document.createElement('td');
                expenseCell.textContent = categorySummary[cat].expense;
                row.appendChild(catCell);
                row.appendChild(incomeCell);
                row.appendChild(expenseCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            reportContent.appendChild(table);
        } else if (type === 'trends') {
            const monthlyData = { income: [], expense: [] };
            const labels = calendarData[state.currentYear].map(m => m.name);
            for (let month = 0; month < 12; month++) {
                const monthKey = `${state.currentYear}-${String(month + 1).padStart(2, '0')}`;
                const entries = state.entries.filter(e => e.date.startsWith(monthKey));
                let income = 0, expense = 0;
                entries.forEach(entry => {
                    if (entry.type === 'income') income += parseFloat(entry.amount || 0);
                    if (entry.type === 'expense') expense += parseFloat(entry.amount || 0);
                });
                monthlyData.income.push(income);
                monthlyData.expense.push(expense);
            }

            const canvas = document.createElement('canvas');
            canvas.id = 'trendsChart';
            reportContent.appendChild(canvas);

            new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: state.language === 'ne' ? 'आय' : 'Income',
                            data: monthlyData.income,
                            borderColor: '#4CAF50',
                            fill: false
                        },
                        {
                            label: state.language === 'ne' ? 'खर्च' : 'Expense',
                            data: monthlyData.expense,
                            borderColor: '#FF5733',
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
        console.log(`${type} report rendered successfully`);
    } catch (error) {
        console.error(`Error rendering ${type} report:`, error);
        showAlert(`Failed to render ${type} report.`, "error");
    }
}

async function exportMonthToExcel() {
    try {
        console.log("Exporting month to Excel...");
        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const monthEntries = state.entries.filter(e => e.date.startsWith(monthStr));

        const data = [];
        for (const entry of monthEntries) {
            let title = entry.title;
            if (entry.encrypted) {
                try {
                    title = await decryptData(entry.title);
                } catch (error) {
                    title = "[Encrypted]";
                }
            }
            data.push({
                Date: entry.date,
                Title: title,
                Amount: entry.amount,
                Type: entry.type,
                Category: entry.category,
                Reminder: entry.reminder ? 'Yes' : 'No',
                ReminderTime: entry.reminderTime || ''
            });
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Entries");
        XLSX.writeFile(wb, `Entries_${monthStr}.xlsx`);
        showAlert("Exported to Excel successfully.", "success");
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        showAlert("Failed to export to Excel.", "error");
    }
}

async function exportMonthToPDF() {
    try {
        console.log("Exporting month to PDF...");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const monthStr = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
        const monthEntries = state.entries.filter(e => e.date.startsWith(monthStr));

        const data = [];
        for (const entry of monthEntries) {
            let title = entry.title;
            if (entry.encrypted) {
                try {
                    title = await decryptData(entry.title);
                } catch (error) {
                    title = "[Encrypted]";
                }
            }
            data.push([
                entry.date,
                title,
                entry.amount,
                entry.type,
                entry.category,
                entry.reminder ? 'Yes' : 'No',
                entry.reminderTime || ''
            ]);
        }

        doc.text(`Entries for ${monthStr}`, 10, 10);
        doc.autoTable({
            head: [['Date', 'Title', 'Amount', 'Type', 'Category', 'Reminder', 'Reminder Time']],
            body: data,
            startY: 20
        });
        doc.save(`Entries_${monthStr}.pdf`);
        showAlert("Exported to PDF successfully.", "success");
    } catch (error) {
        console.error("Error exporting to PDF:", error);
        showAlert("Failed to export to PDF.", "error");
    }
}

async function backupData() {
    try {
        console.log("Backing up data...");
        const data = {
            entries: state.entries,
            categories: state.categories,
            customTranslations: state.customTranslations,
            language: state.language
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar_backup.json';
        a.click();
        URL.revokeObjectURL(url);
        showAlert("Data backed up successfully.", "success");
    } catch (error) {
        console.error("Error backing up data:", error);
        showAlert("Failed to backup data.", "error");
    }
}

document.getElementById('importExcelNotes')?.addEventListener('change', async (event) => {
    try {
        console.log("Importing data...");
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                state.entries = data.entries || [];
                state.categories = data.categories || state.categories;
                state.customTranslations = data.customTranslations || state.customTranslations;
                state.language = data.language || state.language;
                await storage.setItem('entries', JSON.stringify(state.entries));
                await storage.setItem('categories', JSON.stringify(state.categories));
                await storage.setItem('customTranslations', JSON.stringify(state.customTranslations));
                await storage.setItem('language', state.language);
                renderCalendar();
                showAlert("Data restored successfully.", "success");
            } catch (error) {
                console.error("Error parsing imported data:", error);
                showAlert("Failed to parse imported data.", "error");
            }
        };
        reader.readAsText(file);
    } catch (error) {
        console.error("Error importing data:", error);
        showAlert("Failed to import data.", "error");
    }
});

if (typeof window !== 'undefined') {
    window.onload = loadExternalScripts;
} else {
    init();
}