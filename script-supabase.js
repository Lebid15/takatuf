// ===== Auto Slideshow =====
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

// ===== Supabase Configuration =====
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make supabase available globally for testing
window.supabase = supabase;

console.log('Supabase initialized successfully!');

// ===== Helper Functions =====
let currentDonorsData = { usd: null, try: null };
let latestDonation = null;
let tickerBaseMessage = '';
let adminHandlersInitialized = false;

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
if (window.location.pathname.includes('index.html') || 
    window.location.pathname.endsWith('/takatuf/') || 
    window.location.pathname.endsWith('/') ||
    window.location.pathname === '/takatuf' ||
    document.getElementById('totalUSD')) {
    console.log('Loading public page data...');
    loadPublicPageData();
    setupPaymentTabs();
}

async function loadPublicPageData() {
    try {
        // Load USD donors
        await loadDonors('usd');
        
        // Load TRY donors
        await loadDonors('try');
        
        // Load payment methods
        await loadPaymentMethods();
        
        // Load settings
        await loadSettings();
        
        // Subscribe to real-time changes
        subscribeToChanges();
    } catch (error) {
        console.error('Error loading public page data:', error);
    }
}

async function loadDonors(currency) {
    const tableName = `donors_${currency}`;
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('timestamp', { ascending: false });
    
    if (error) {
        console.error(`Error loading ${currency} donors:`, error);
        return;
    }
    
    updateDonationsSummary(currency, data);
}

async function loadPaymentMethods() {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('timestamp', { ascending: false });
    
    if (error) {
        console.error('Error loading payment methods:', error);
        return;
    }
    
    displayPaymentMethods(data);
}

async function loadSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*');
    
    if (error) {
        console.error('Error loading settings:', error);
        return;
    }
    
    const tickerSetting = data.find(s => s.key === 'tickerMessage');
    if (tickerSetting) {
        tickerBaseMessage = tickerSetting.value?.trim() || '';
        updateTickerText();
    }
}

function subscribeToChanges() {
    // Subscribe to USD donors changes
    supabase
        .channel('donors_usd_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'donors_usd' },
            () => loadDonors('usd')
        )
        .subscribe();
    
    // Subscribe to TRY donors changes
    supabase
        .channel('donors_try_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'donors_try' },
            () => loadDonors('try')
        )
        .subscribe();
    
    // Subscribe to payment methods changes
    supabase
        .channel('payment_methods_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'payment_methods' },
            () => loadPaymentMethods()
        )
        .subscribe();
    
    // Subscribe to settings changes
    supabase
        .channel('settings_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'settings' },
            () => loadSettings()
        )
        .subscribe();
}

function updateDonationsSummary(currency, donors) {
    // Store donors data for modal
    currentDonorsData[currency] = donors;
    refreshLatestDonation();
    
    if (!donors || donors.length === 0) {
        document.getElementById(`total${currency.toUpperCase()}`).textContent = '0';
        document.getElementById(`count${currency.toUpperCase()}`).textContent = '0';
        return;
    }
    
    const total = donors.reduce((sum, donor) => sum + (parseFloat(donor.amount) || 0), 0);
    const count = donors.length;
    
    document.getElementById(`total${currency.toUpperCase()}`).textContent = formatNumber(total);
    document.getElementById(`count${currency.toUpperCase()}`).textContent = count;
}

function refreshLatestDonation() {
    let latest = null;
    ['usd', 'try'].forEach((currency) => {
        const donors = currentDonorsData[currency];
        if (!donors || donors.length === 0) return;

        donors.forEach((donor) => {
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
    
    if (!methods || methods.length === 0) {
        return;
    }
    
    methods.forEach((method) => {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        
        const title = method.title || 'وسيلة دفع';
        const entityName = method.entity_name || '';
        const contactRaw = method.contact || '';
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
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.info('Copied to clipboard');
    });
}

window.copyToClipboard = copyToClipboard;

// ===== Donors Modal Functions =====
window.showDonors = function(currency) {
    const modal = document.getElementById('donorsModal');
    const titleElement = document.getElementById('modalTitle');
    const containerElement = document.getElementById('donorsListContainer');
    
    const currencyName = currency === 'usd' ? 'الدولار' : 'الليرة التركية';
    titleElement.textContent = `قائمة المتبرعين (${currencyName})`;
    
    const donors = currentDonorsData[currency];
    
    if (!donors || donors.length === 0) {
        containerElement.innerHTML = '<p class="no-donors">لا يوجد متبرعون بعد</p>';
    } else {
        const sortedDonors = [...donors].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        const currencySymbol = currency === 'usd' ? '$' : '₺';
        
        containerElement.innerHTML = sortedDonors.map(donor => `
            <div class="donor-list-item">
                <span class="donor-name">${donor.name || 'متبرع كريم'}</span>
                <span class="donor-amount">${currencySymbol}${formatNumber(donor.amount)}</span>
            </div>
        `).join('');
    }
    
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
    console.log('Admin page detected');
    
    // Setup handlers immediately
    setupAdminHandlers();
    
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login submitted, loading data...');
        setTimeout(() => {
            loadAdminPageData();
        }, 100);
    });
    
    // If already logged in, load data immediately
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        console.log('Already logged in, loading data...');
        setTimeout(() => {
            loadAdminPageData();
        }, 500);
    }
}

async function loadAdminPageData() {
    console.log('loadAdminPageData called');
    try {
        // Load USD donors
        const { data: usdDonors, error: usdError } = await supabase
            .from('donors_usd')
            .select('*')
            .order('timestamp', { ascending: false });
        
        console.log('USD donors loaded:', usdDonors);
        if (!usdError) displayDonorsTable('usd', usdDonors);
        
        // Load TRY donors
        const { data: tryDonors, error: tryError } = await supabase
            .from('donors_try')
            .select('*')
            .order('timestamp', { ascending: false });
        
        console.log('TRY donors loaded:', tryDonors);
        if (!tryError) displayDonorsTable('try', tryDonors);
        
        // Load payment methods
        const { data: methods, error: methodsError } = await supabase
            .from('payment_methods')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (!methodsError) displayPaymentMethodsList(methods);
        
        // Subscribe to real-time changes for admin
        subscribeToAdminChanges();
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function subscribeToAdminChanges() {
    // Subscribe to USD donors changes
    supabase
        .channel('admin_donors_usd')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'donors_usd' },
            () => {
                console.log('USD donors changed, reloading...');
                loadAdminPageData();
            }
        )
        .subscribe();
    
    // Subscribe to TRY donors changes
    supabase
        .channel('admin_donors_try')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'donors_try' },
            () => {
                console.log('TRY donors changed, reloading...');
                loadAdminPageData();
            }
        )
        .subscribe();
}

function displayDonorsTable(currency, donors) {
    const tableId = `donors${currency.toUpperCase()}Table`;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.innerHTML = '';
    
    if (!donors || donors.length === 0) {
        table.innerHTML = '<tr><td colspan="5" style="text-align: center;">لا توجد تبرعات بعد</td></tr>';
        return;
    }
    
    const totalDonors = donors.length;
    
    donors.forEach((donor, index) => {
        const row = document.createElement('tr');
        const date = donor.timestamp ? new Date(donor.timestamp).toLocaleDateString('ar-EG') : '-';
        const currencySymbol = currency === 'usd' ? '$' : '₺';
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
    
    if (!methods || methods.length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد وسائل دفع بعد</td></tr>';
        return;
    }
    
    methods.forEach((method, index) => {
        const row = document.createElement('tr');
        
        const title = method.title || '-';
        const entityName = method.entity_name || '-';
        const contactRaw = method.contact || '-';
        const hasContact = contactRaw && contactRaw !== '-';
        const contactDisplay = hasContact ? normalizeContactText(contactRaw) : '-';
        const contactCell = hasContact ? `<span class="payment-contact">${escapeHtml(contactDisplay)}</span>` : '-';
        
        const methodDataJson = JSON.stringify({
            title: method.title || '',
            entityName: method.entity_name || '',
            contact: method.contact || ''
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
    if (adminHandlersInitialized) {
        return;
    }
    adminHandlersInitialized = true;
    
    document.getElementById('addDonorUSD')?.addEventListener('click', () => openDonorModal('usd'));
    document.getElementById('addDonorTRY')?.addEventListener('click', () => openDonorModal('try'));
    document.getElementById('addPaymentMethod')?.addEventListener('click', openPaymentMethodModal);
    document.getElementById('donorForm')?.addEventListener('submit', saveDonor);
    document.getElementById('paymentForm')?.addEventListener('submit', savePaymentMethod);
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    document.getElementById('cancelDonor')?.addEventListener('click', closeModals);
    document.getElementById('cancelPayment')?.addEventListener('click', closeModals);
}

function openDonorModal(currency) {
    const modal = document.getElementById('donorModal');
    modal.classList.add('active');
    
    document.getElementById('donorCurrency').value = currency;
    document.getElementById('donorId').value = '';
    document.getElementById('donorName').value = '';
    document.getElementById('donorAmount').value = '';
    document.getElementById('modalTitle').textContent = 'إضافة متبرع جديد';
}

window.openDonorModal = openDonorModal;

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
        const tableName = `donors_${currency}`;
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        await loadAdminPageData();
    } catch (error) {
        console.error('Error deleting donor:', error);
        alert('حدث خطأ أثناء الحذف');
    }
};

async function saveDonor(e) {
    e?.preventDefault();
    
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
        const tableName = `donors_${currency}`;
        
        if (id) {
            // Update existing donor
            const { error } = await supabase
                .from(tableName)
                .update(donorData)
                .eq('id', id);
            
            if (error) throw error;
        } else {
            // Add new donor
            const { error } = await supabase
                .from(tableName)
                .insert([donorData]);
            
            if (error) throw error;
        }
        
        closeModals();
        await loadAdminPageData();
        return false;
    } catch (error) {
        console.error('Error saving donor:', error);
        alert('حدث خطأ أثناء الحفظ');
        return false;
    }
}

window.saveDonor = saveDonor;

function openPaymentMethodModal() {
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentId').value = '';
    document.getElementById('paymentTitle').value = '';
    document.getElementById('paymentEntityName').value = '';
    document.getElementById('paymentContact').value = '';
    document.getElementById('paymentModalTitle').textContent = 'إضافة وسيلة دفع';
}

window.openPaymentMethodModal = openPaymentMethodModal;

window.editPaymentMethod = function(id, data) {
    document.getElementById('paymentModal').classList.add('active');
    document.getElementById('paymentId').value = id;
    document.getElementById('paymentTitle').value = data.title || '';
    document.getElementById('paymentEntityName').value = data.entityName || '';
    document.getElementById('paymentContact').value = data.contact || '';
    document.getElementById('paymentModalTitle').textContent = 'تعديل وسيلة دفع';
};

window.deletePaymentMethod = async function(id) {
    if (!confirm('هل أنت متأكد من حذف وسيلة الدفع؟')) return;
    
    try {
        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        await loadAdminPageData();
    } catch (error) {
        console.error('Error deleting payment method:', error);
        alert('حدث خطأ أثناء الحذف');
    }
};

async function savePaymentMethod(e) {
    e?.preventDefault();
    
    const id = document.getElementById('paymentId').value;
    const title = document.getElementById('paymentTitle').value;
    const entityName = document.getElementById('paymentEntityName').value;
    const contact = document.getElementById('paymentContact').value;
    
    try {
        const methodData = {
            title: title || '',
            entity_name: entityName || '',
            contact: contact || '',
            timestamp: getCurrentTimestamp()
        };
        
        if (id) {
            const { error } = await supabase
                .from('payment_methods')
                .update(methodData)
                .eq('id', id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('payment_methods')
                .insert([methodData]);
            
            if (error) throw error;
        }
        
        closeModals();
        await loadAdminPageData();
        return false;
    } catch (error) {
        console.error('Error saving payment method:', error);
        alert('حدث خطأ أثناء الحفظ');
        return false;
    }
}

window.savePaymentMethod = savePaymentMethod;

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

window.closeModals = closeModals;

// ===== Display Page Functions =====
if (window.location.pathname.includes('display.html')) {
    loadDisplayPageData();
    
    // Auto-refresh every 5 seconds
    setInterval(loadDisplayPageData, 5000);
}

async function loadDisplayPageData() {
    try {
        // Load USD donors - top 10
        const { data: usdDonors } = await supabase
            .from('donors_usd')
            .select('*')
            .order('amount', { ascending: false })
            .limit(10);
        
        displayTopDonors('USD', usdDonors);
        updateDisplayTotal('USD', usdDonors);
        currentDonorsData.usd = usdDonors;
        
        // Load TRY donors - top 10
        const { data: tryDonors } = await supabase
            .from('donors_try')
            .select('*')
            .order('amount', { ascending: false })
            .limit(10);
        
        displayTopDonors('TRY', tryDonors);
        updateDisplayTotal('TRY', tryDonors);
        currentDonorsData.try = tryDonors;
        
        refreshLatestDonation();
        
        // Load settings
        const { data: settings } = await supabase
            .from('settings')
            .select('*');
        
        const tickerSetting = settings?.find(s => s.key === 'tickerMessage');
        if (tickerSetting) {
            tickerBaseMessage = tickerSetting.value?.trim() || tickerBaseMessage;
            updateTickerText();
        }
    } catch (error) {
        console.error('Error loading display data:', error);
    }
}

function displayTopDonors(currency, donors) {
    const containerId = `topDonors${currency}`;
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!donors || donors.length === 0) {
        container.innerHTML = '<div class="donor-item"><span>لا توجد تبرعات بعد</span></div>';
        return;
    }
    
    const currencySymbol = currency === 'USD' ? '$' : '₺';
    
    donors.forEach(donor => {
        const donorElement = document.createElement('div');
        donorElement.className = 'donor-item';
        donorElement.innerHTML = `
            <span class="donor-name">${donor.name}</span>
            <span class="donor-amount">${currencySymbol}${formatNumber(donor.amount)}</span>
        `;
        container.appendChild(donorElement);
    });
}

async function updateDisplayTotal(currency, donors) {
    if (!donors || donors.length === 0) {
        document.getElementById(`displayTotal${currency}`).textContent = '0';
        return;
    }
    
    const total = donors.reduce((sum, donor) => sum + (parseFloat(donor.amount) || 0), 0);
    document.getElementById(`displayTotal${currency}`).textContent = formatNumber(total);
    
    // Update total donor count
    const { count: usdCount } = await supabase
        .from('donors_usd')
        .select('*', { count: 'exact', head: true });
    
    const { count: tryCount } = await supabase
        .from('donors_try')
        .select('*', { count: 'exact', head: true });
    
    document.getElementById('displayDonorCount').textContent = (usdCount || 0) + (tryCount || 0);
}

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
