// ===== Auto Slideshow =====
// Initialize slideshow on page load
if (document.querySelector('.slideshow-container')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto change slide every 4 seconds
    setInterval(nextSlide, 4000);
    
    // Show first slide
    showSlide(0);
}

// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, push, get, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// ===== Firebase Configuration =====
// ⚠️ Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAbXalN5P8eDUqFYgRNtEe-Kwzmsq4EmD8",
    authDomain: "takatuf-6b239.firebaseapp.com",
    databaseURL: "https://takatuf-6b239-default-rtdb.firebaseio.com",
    projectId: "takatuf-6b239",
    storageBucket: "takatuf-6b239.firebasestorage.app",
    messagingSenderId: "669115329115",
    appId: "1:669115329115:web:4e8a4d65bf913c6ac5ad7e",
    measurementId: "G-7D0S4SN4WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Firebase initialized successfully!');
console.log('Database:', database);

// ===== Helper Functions =====
let currentDonorsData = { usd: null, try: null };
let latestDonation = null;
let tickerBaseMessage = '';

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

function escapeHtml(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return String(str).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char] || char));
}

function normalizeContactText(text) {
    return text
        .replace(/<br\s*\/?>(\s)?/gi, ' ')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

// ===== Public Page Functions =====
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/takatuf/')) {
    loadPublicPageData();
    setupPaymentTabs();
}

async function loadPublicPageData() {
    try {
        // Load donors data
        const donorsUSDRef = ref(database, 'donors/usd');
        const donorsTRYRef = ref(database, 'donors/try');
        
        onValue(donorsUSDRef, (snapshot) => {
            const donors = snapshot.val();
            updateDonationsSummary('usd', donors);
        });
        
        onValue(donorsTRYRef, (snapshot) => {
            const donors = snapshot.val();
            updateDonationsSummary('try', donors);
        });
        
        // Load payment methods
        const paymentMethodsRef = ref(database, 'paymentMethods');
        onValue(paymentMethodsRef, (snapshot) => {
            const methods = snapshot.val();
            displayPaymentMethods(methods);
        });
        
        // Load settings
        const settingsRef = ref(database, 'settings');
        onValue(settingsRef, (snapshot) => {
            const settings = snapshot.val();
            if (settings) {
                // Update ticker only (logo and images are static files)
                tickerBaseMessage = settings.tickerMessage?.trim() || '';
                updateTickerText();
            }
        });
    } catch (error) {
        console.error('Error loading public page data:', error);
    }
}

function updateDonationsSummary(currency, donors) {
    // Store donors data for modal
    currentDonorsData[currency] = donors;
    refreshLatestDonation();
    
    if (!donors) {
        document.getElementById(`total${currency.toUpperCase()}`).textContent = '0';
        document.getElementById(`count${currency.toUpperCase()}`).textContent = '0';
        return;
    }
    
    const donorsArray = Object.values(donors);
    const total = donorsArray.reduce((sum, donor) => sum + (donor.amount || 0), 0);
    const count = donorsArray.length;
    
    document.getElementById(`total${currency.toUpperCase()}`).textContent = formatNumber(total);
    document.getElementById(`count${currency.toUpperCase()}`).textContent = count;
}

function refreshLatestDonation() {
    let latest = null;
    ['usd', 'try'].forEach((currency) => {
        const donors = currentDonorsData[currency];
        if (!donors) return;

        Object.values(donors).forEach((donor) => {
            const timestampValue = donor.timestamp ? Date.parse(donor.timestamp) : 0;
            const timestamp = Number.isFinite(timestampValue) ? timestampValue : 0;
            if (!latest || timestamp > latest.timestamp) {
                latest = {
                    name: donor.name || 'متبرع كريم',
                    amount: typeof donor.amount === 'number' ? donor.amount : Number(donor.amount) || 0,
                    currency,
                    timestamp
                };
            }
        });
    });

    latestDonation = latest;
    updateTickerText();
}

function updateTickerText() {
    const currencySymbols = {
        usd: '$',
        try: '₺'
    };

    const parts = [];

    if (latestDonation) {
        const symbol = currencySymbols[latestDonation.currency] || '';
        const formattedAmount = formatNumber(latestDonation.amount || 0);
        parts.push(`قام ${latestDonation.name} بالتبرع بمبلغ ${symbol}${formattedAmount}`);
    }

    const baseMessage = tickerBaseMessage || 'كل ما تقدمه اليوم يبقى أثره غدًا 💙';
    if (baseMessage) {
        parts.push(baseMessage);
    }

    const finalMessage = parts.join(' • ');
    const publicTicker = document.getElementById('tickerText');
    const displayTicker = document.getElementById('displayTicker');

    if (publicTicker) {
        publicTicker.textContent = finalMessage;
    }

    if (displayTicker) {
        displayTicker.textContent = finalMessage;
    }
}

function displayPaymentMethods(methods) {
    const container = document.getElementById('allPaymentMethods');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!methods || Object.keys(methods).length === 0) {
        // No additional payment methods - ShamCash card is already shown
        return;
    }
    
    Object.entries(methods).forEach(([id, method]) => {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        
        const title = method.title || method.name || 'وسيلة دفع';
        const entityName = method.entityName || '';
        const contactRaw = method.contact || method.details || '';
        const contactDisplay = contactRaw ? normalizeContactText(contactRaw) : '';
        
        card.innerHTML = `
            <div class="payment-card-header">
                <span class="payment-method-name">${escapeHtml(title)}</span>
            </div>
            ${entityName ? `<div class="payment-method-details">${escapeHtml(entityName)}</div>` : ''}
            ${contactDisplay ? `<div class="payment-method-details">${escapeHtml(contactDisplay)}</div>` : ''}
            ${contactDisplay ? `<button class="btn-copy" onclick="copyToClipboard('${contactRaw.replace(/'/g, "\\'")}')">📋 نسخ</button>` : ''}
        `;
        
        container.appendChild(card);
    });
}

function setupPaymentTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.info('Copied to clipboard');
    });
};

// ===== Donors Modal Functions =====

window.showDonors = function(currency) {
    console.log('showDonors called with currency:', currency);
    const modal = document.getElementById('donorsModal');
    const titleElement = document.getElementById('modalTitle');
    const containerElement = document.getElementById('donorsListContainer');
    
    console.log('Modal element:', modal);
    
    // Update title
    const currencyName = currency === 'usd' ? 'الدولار' : 'الليرة التركية';
    titleElement.textContent = `قائمة المتبرعين (${currencyName})`;
    
    // Get donors data
    const donors = currentDonorsData[currency];
    
    console.log('Donors data:', donors);
    
    if (!donors || Object.keys(donors).length === 0) {
        containerElement.innerHTML = '<p class="no-donors">لا يوجد متبرعون بعد</p>';
    } else {
        const donorsArray = Object.entries(donors).map(([id, donor]) => ({
            id,
            name: donor.name || 'متبرع كريم',
            amount: donor.amount || 0,
            timestamp: donor.timestamp || null
        }));
        
        // Sort by amount descending (highest first) for public display
        donorsArray.sort((a, b) => b.amount - a.amount);
        
        const currencySymbol = currency === 'usd' ? '$' : '₺';
        
        containerElement.innerHTML = donorsArray.map(donor => `
            <div class="donor-list-item">
                <span class="donor-name">${donor.name}</span>
                <span class="donor-amount">${currencySymbol}${formatNumber(donor.amount)}</span>
            </div>
        `).join('');
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeDonorsModal = function() {
    const modal = document.getElementById('donorsModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

// ===== Admin Page Functions =====
if (window.location.pathname.includes('admin.html')) {
    console.log('Admin page detected!');
    console.log('Session storage adminLoggedIn:', sessionStorage.getItem('adminLoggedIn'));
    
    // Wait for admin login before loading data
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted!');
        setTimeout(() => {
            loadAdminPageData();
            setupAdminHandlers();
        }, 100);
    });
    
    // If already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        console.log('User already logged in, setting up handlers...');
        loadAdminPageData();
        setupAdminHandlers();
    }
}

async function loadAdminPageData() {
    try {
        // Load USD donors
        const donorsUSDRef = ref(database, 'donors/usd');
        onValue(donorsUSDRef, (snapshot) => {
            const donors = snapshot.val();
            displayDonorsTable('usd', donors);
        });
        
        // Load TRY donors
        const donorsTRYRef = ref(database, 'donors/try');
        onValue(donorsTRYRef, (snapshot) => {
            const donors = snapshot.val();
            displayDonorsTable('try', donors);
        });
        
        // Load payment methods
        const paymentMethodsRef = ref(database, 'paymentMethods');
        onValue(paymentMethodsRef, (snapshot) => {
            const methods = snapshot.val();
            displayPaymentMethodsList(methods);
        });
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function displayDonorsTable(currency, donors) {
    const tableId = `donors${currency.toUpperCase()}Table`;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.innerHTML = '';
    
    if (!donors) {
        table.innerHTML = '<tr><td colspan="5" style="text-align: center;">لا توجد تبرعات بعد</td></tr>';
        return;
    }
    
    const donorsArray = Object.entries(donors)
        .map(([id, donor]) => ({ id, ...donor }))
        .sort((a, b) => {
            // Sort by timestamp (newest first)
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        });
    
    const totalDonors = donorsArray.length;
    
    donorsArray.forEach((donor, index) => {
        const row = document.createElement('tr');
        const date = donor.timestamp ? new Date(donor.timestamp).toLocaleDateString('ar-EG') : '-';
        const currencySymbol = currency === 'usd' ? '$' : '₺';
        
        // Reverse the numbering: newest gets highest number
        const displayNumber = totalDonors - index;
        
        row.innerHTML = `
            <td data-label="#">${displayNumber}</td>
            <td data-label="الاسم">${donor.name}</td>
            <td data-label="المبلغ">${currencySymbol}${formatNumber(donor.amount)}</td>
            <td data-label="التاريخ">${date}</td>
            <td data-label="إجراءات">
                <button class="btn-edit" onclick="editDonor('${donor.id}', '${currency}', '${donor.name}', ${donor.amount})">تعديل</button>
                <button class="btn-delete" onclick="deleteDonor('${donor.id}', '${currency}')">حذف</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

function displayPaymentMethodsList(methods) {
    const table = document.getElementById('paymentMethodsTable');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (!methods) {
        table.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد وسائل دفع بعد</td></tr>';
        return;
    }
    
    const methodsArray = Object.entries(methods)
        .map(([id, method]) => ({ id, ...method }));
    
    methodsArray.forEach((method, index) => {
        const row = document.createElement('tr');
        
        const title = method.title || method.name || '-';
        const entityName = method.entityName || '-';
        const contactRaw = method.contact || method.details || '-';
        const hasContact = contactRaw && contactRaw !== '-';
        const contactDisplay = hasContact ? normalizeContactText(contactRaw) : '-';
        const contactCell = hasContact ? `<span class="payment-contact">${escapeHtml(contactDisplay)}</span>` : '-';
        
        const methodDataJson = JSON.stringify({
            title: method.title || method.name || '',
            entityName: method.entityName || '',
            contact: method.contact || method.details || ''
        }).replace(/"/g, '&quot;');
        
        row.innerHTML = `
            <td data-label="#">${index + 1}</td>
            <td data-label="العنوان">${escapeHtml(title)}</td>
            <td data-label="اسم الجهة">${entityName !== '-' ? escapeHtml(entityName) : '-'}</td>
            <td data-label="رقم الجوال / الحساب">${contactCell}</td>
            <td data-label="إجراءات">
                <button class="btn-edit" onclick='editPaymentMethod("${method.id}", ${methodDataJson})'>تعديل</button>
                <button class="btn-delete" onclick="deletePaymentMethod('${method.id}')">حذف</button>
            </td>
        `;
        
        table.appendChild(row);
    });
}

function setupAdminHandlers() {
    console.log('Setting up admin handlers...');
    
    const addDonorUSD = document.getElementById('addDonorUSD');
    const addDonorTRY = document.getElementById('addDonorTRY');
    
    console.log('addDonorUSD button:', addDonorUSD);
    console.log('addDonorTRY button:', addDonorTRY);
    
    // Add donor buttons
    addDonorUSD?.addEventListener('click', () => {
        console.log('Add USD donor clicked!');
        openDonorModal('usd');
    });
    addDonorTRY?.addEventListener('click', () => {
        console.log('Add TRY donor clicked!');
        openDonorModal('try');
    });
    
    // Add payment method button
    document.getElementById('addPaymentMethod')?.addEventListener('click', openPaymentMethodModal);
    
    // Donor form submit
    document.getElementById('donorForm')?.addEventListener('submit', saveDonor);
    
    // Payment method form submit
    document.getElementById('paymentForm')?.addEventListener('submit', savePaymentMethod);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    document.getElementById('cancelDonor')?.addEventListener('click', closeModals);
    document.getElementById('cancelPayment')?.addEventListener('click', closeModals);
}

function openDonorModal(currency) {
    console.log('openDonorModal called with currency:', currency);
    const modal = document.getElementById('donorModal');
    console.log('Modal element:', modal);
    console.log('Modal classes before:', modal.className);
    
    modal.classList.add('active');
    
    console.log('Modal classes after:', modal.className);
    console.log('Modal computed display:', window.getComputedStyle(modal).display);
    
    document.getElementById('donorCurrency').value = currency;
    document.getElementById('donorId').value = '';
    document.getElementById('donorName').value = '';
    document.getElementById('donorAmount').value = '';
    document.getElementById('modalTitle').textContent = 'إضافة متبرع جديد';
}

window.editDonor = function(id, currency, name, amount) {
    document.getElementById('donorModal').classList.add('active');
    document.getElementById('donorId').value = id;
    document.getElementById('donorCurrency').value = currency;
    document.getElementById('donorName').value = name;
    document.getElementById('donorAmount').value = amount;
    document.getElementById('modalTitle').textContent = 'تعديل متبرع';
};

window.deleteDonor = async function(id, currency) {
    if (!confirm('هل أنت متأكد من حذف هذا المتبرع؟')) return;
    
    try {
        await remove(ref(database, `donors/${currency}/${id}`));
    } catch (error) {
        console.error('Error deleting donor:', error);
    }
};

async function saveDonor(e) {
    e.preventDefault();
    
    const id = document.getElementById('donorId').value;
    const currency = document.getElementById('donorCurrency').value;
    const name = document.getElementById('donorName').value;
    const amount = parseFloat(document.getElementById('donorAmount').value);
    
    const donorData = {
        name,
        amount,
        timestamp: getCurrentTimestamp()
    };
    
    try {
        if (id) {
            // Update existing donor
            await update(ref(database, `donors/${currency}/${id}`), donorData);
        } else {
            // Add new donor
            await push(ref(database, `donors/${currency}`), donorData);
        }
        
        closeModals();
    } catch (error) {
        console.error('Error saving donor:', error);
    }
}

function openPaymentMethodModal() {
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentId').value = '';
    document.getElementById('paymentTitle').value = '';
    document.getElementById('paymentEntityName').value = '';
    document.getElementById('paymentContact').value = '';
    document.getElementById('paymentModalTitle').textContent = 'إضافة وسيلة دفع';
}

window.editPaymentMethod = function(id, data) {
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentId').value = id;
    document.getElementById('paymentTitle').value = data.title || data.name || '';
    document.getElementById('paymentEntityName').value = data.entityName || '';
    document.getElementById('paymentContact').value = data.contact || data.details || '';
    document.getElementById('paymentModalTitle').textContent = 'تعديل وسيلة دفع';
};

window.deletePaymentMethod = async function(id) {
    if (!confirm('هل أنت متأكد من حذف وسيلة الدفع؟')) return;
    
    try {
        await remove(ref(database, `paymentMethods/${id}`));
    } catch (error) {
        console.error('Error deleting payment method:', error);
    }
};

async function savePaymentMethod(e) {
    e.preventDefault();
    
    const id = document.getElementById('paymentId').value;
    const title = document.getElementById('paymentTitle').value;
    const entityName = document.getElementById('paymentEntityName').value;
    const contact = document.getElementById('paymentContact').value;
    
    try {
        const methodData = {
            title: title || '',
            entityName: entityName || '',
            contact: contact || '',
            timestamp: getCurrentTimestamp()
        };
        
        if (id) {
            await update(ref(database, `paymentMethods/${id}`), methodData);
        } else {
            await push(ref(database, 'paymentMethods'), methodData);
        }
        
        closeModals();
    } catch (error) {
        console.error('Error saving payment method:', error);
    }
}

async function saveTickerMessage() {
    const message = document.getElementById('tickerMessage').value;
    
    if (!message) {
        return;
    }
    
    try {
        await set(ref(database, 'settings/tickerMessage'), message);
    } catch (error) {
        console.error('Error saving ticker message:', error);
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ===== Display Page Functions =====
if (window.location.pathname.includes('display.html')) {
    loadDisplayPageData();
    
    // Auto-refresh every 5 seconds
    setInterval(loadDisplayPageData, 5000);
}

async function loadDisplayPageData() {
    try {
        // Load USD donors - top 10
        const donorsUSDRef = ref(database, 'donors/usd');
        onValue(donorsUSDRef, (snapshot) => {
            const donors = snapshot.val();
            displayTopDonors('USD', donors);
            updateDisplayTotal('USD', donors);
            currentDonorsData.usd = donors;
            refreshLatestDonation();
        });
        
        // Load TRY donors - top 10
        const donorsTRYRef = ref(database, 'donors/try');
        onValue(donorsTRYRef, (snapshot) => {
            const donors = snapshot.val();
            displayTopDonors('TRY', donors);
            updateDisplayTotal('TRY', donors);
            currentDonorsData.try = donors;
            refreshLatestDonation();
        });
        
        // Load settings
        const settingsRef = ref(database, 'settings');
        onValue(settingsRef, (snapshot) => {
            const settings = snapshot.val();
            if (settings) {
                // Update ticker only (logo is static file)
                tickerBaseMessage = settings.tickerMessage?.trim() || tickerBaseMessage;
                updateTickerText();
            }
        });
    } catch (error) {
        console.error('Error loading display data:', error);
    }
}

function displayTopDonors(currency, donors) {
    const containerId = `topDonors${currency}`;
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!donors) {
        container.innerHTML = '<div class="donor-item"><span>لا توجد تبرعات بعد</span></div>';
        return;
    }
    
    const donorsArray = Object.values(donors)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10); // Top 10
    
    const currencySymbol = currency === 'USD' ? '$' : '₺';
    
    donorsArray.forEach(donor => {
        const donorElement = document.createElement('div');
        donorElement.className = 'donor-item';
        donorElement.innerHTML = `
            <span class="donor-name">${donor.name}</span>
            <span class="donor-amount">${currencySymbol}${formatNumber(donor.amount)}</span>
        `;
        container.appendChild(donorElement);
    });
}

function updateDisplayTotal(currency, donors) {
    if (!donors) {
        document.getElementById(`displayTotal${currency}`).textContent = '0';
        return;
    }
    
    const total = Object.values(donors).reduce((sum, donor) => sum + (donor.amount || 0), 0);
    document.getElementById(`displayTotal${currency}`).textContent = formatNumber(total);
    
    // Update donor count
    const totalDonors = Object.keys(donors).length;
    const otherCurrency = currency === 'USD' ? 'TRY' : 'USD';
    const otherDonorsRef = ref(database, `donors/${otherCurrency.toLowerCase()}`);
    get(otherDonorsRef).then(snapshot => {
        const otherDonors = snapshot.val();
        const otherCount = otherDonors ? Object.keys(otherDonors).length : 0;
        document.getElementById('displayDonorCount').textContent = totalDonors + otherCount;
    });
}

// Export functions for global use
window.copyToClipboard = copyToClipboard;

const fullscreenButton = document.getElementById('displayFullscreen');

if (fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    });
}
