/* ============================================================
   نظام الصيدليات الزراعية - منطق التطبيق الكامل
   - بيانات في localStorage تحت المفتاح: agriPharmacyApp
   - جلسة الدخول في sessionStorage تحت المفتاح: activeAccountId
   - 4 عملات: TRY, USD, SYP, EUR
   - لا يوجد مستودع — كل عملية بيع حقولها يدوية بالكامل
   ============================================================ */

'use strict';

/* ============================================================
   الثوابت
============================================================ */
const STORAGE_KEY = 'agriPharmacyApp';
const SESSION_KEY = 'activeAccountId';

const CURRENCIES = {
  TRY: { name: 'ليرة تركية', symbol: '₺' },
  USD: { name: 'دولار',       symbol: '$' },
  SYP: { name: 'ليرة سورية',  symbol: 'ل.س' },
  EUR: { name: 'يورو',        symbol: '€' }
};
const CURRENCY_ORDER = ['TRY', 'USD', 'SYP', 'EUR'];

/* ============================================================
   أدوات عامة
============================================================ */
function uid(prefix) {
  return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function todayStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fmtMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function fmtAmount(amount, currency) {
  const cur = CURRENCIES[currency] || CURRENCIES.SYP;
  return fmtMoney(amount) + ' ' + cur.symbol;
}

function currencyName(code) {
  return (CURRENCIES[code] || CURRENCIES.SYP).name;
}

const AR_MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
function formatDateAr(iso) {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) return iso;
  const y = m[1], mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
  if (mo < 1 || mo > 12) return iso;
  return `${d} ${AR_MONTHS[mo - 1]} ${y}`;
}

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   التخزين
============================================================ */
function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accounts: [] };
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.accounts)) return { accounts: [] };
    return data;
  } catch (e) {
    return { accounts: [] };
  }
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getActiveAccountId() {
  return sessionStorage.getItem(SESSION_KEY);
}

function setActiveAccountId(id) {
  if (id) sessionStorage.setItem(SESSION_KEY, id);
  else sessionStorage.removeItem(SESSION_KEY);
}

function getActiveAccount() {
  const data = loadAppData();
  const id = getActiveAccountId();
  if (!id) return null;
  return data.accounts.find(a => a.id === id) || null;
}

function updateActiveAccount(mutator) {
  const data = loadAppData();
  const id = getActiveAccountId();
  if (!id) return;
  const idx = data.accounts.findIndex(a => a.id === id);
  if (idx === -1) return;
  mutator(data.accounts[idx]);
  saveAppData(data);
}

/* ============================================================
   Toast
============================================================ */
let toastTimer = null;
function showToast(msg, type) {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast show ' + (type || '');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ============================================================
   إدارة الشاشات / التبويبات
============================================================ */
function showScreen(screenId) {
  $all('.screen').forEach(s => s.classList.remove('active'));
  $('#' + screenId).classList.add('active');
}

function switchAuthTab(tab) {
  $all('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  $('#login-form').classList.toggle('active', tab === 'login');
  $('#register-form').classList.toggle('active', tab === 'register');
}

function showResetStep(stepId) {
  $all('#reset-screen .auth-form').forEach(f => f.classList.remove('active'));
  $('#' + stepId).classList.add('active');
}

/* ============================================================
   المصادقة
============================================================ */
function registerAccount(payload) {
  const data = loadAppData();
  const emailLower = (payload.email || '').trim().toLowerCase();
  if (data.accounts.some(a => a.email.toLowerCase() === emailLower)) {
    showToast('البريد الإلكتروني مستخدم مسبقًا.', 'error');
    return false;
  }
  const acc = {
    id: uid('acc'),
    pharmacyName: payload.pharmacyName.trim(),
    ownerName: payload.ownerName.trim(),
    email: emailLower,
    password: payload.password,
    phone: payload.phone || '',
    address: payload.address || '',
    logoData: '',
    customers: [],
    sales: [],
    payments: [],
    createdAt: new Date().toISOString()
  };
  data.accounts.push(acc);
  saveAppData(data);
  setActiveAccountId(acc.id);
  showToast('تم إنشاء الحساب بنجاح.', 'success');
  enterApp();
  return true;
}

function loginAccount(email, password) {
  const data = loadAppData();
  const emailLower = (email || '').trim().toLowerCase();
  const acc = data.accounts.find(a => a.email.toLowerCase() === emailLower);
  if (!acc || acc.password !== password) {
    showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
    return false;
  }
  setActiveAccountId(acc.id);
  showToast('تم تسجيل الدخول بنجاح.', 'success');
  enterApp();
  return true;
}

function logoutAccount() {
  setActiveAccountId(null);
  showScreen('auth-screen');
  switchAuthTab('login');
  $('#login-form').reset();
  $('#register-form').reset();
}

let resetState = { email: '', code: '' };

function startPasswordRecovery(email) {
  const data = loadAppData();
  const emailLower = (email || '').trim().toLowerCase();
  const acc = data.accounts.find(a => a.email.toLowerCase() === emailLower);
  if (!acc) {
    showToast('البريد غير مسجل في النظام.', 'error');
    return false;
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetState = { email: emailLower, code };
  $('#demo-code-display').textContent = code;
  showResetStep('reset-step-2');
  showToast('تم توليد كود التحقق التجريبي.', 'success');
  return true;
}

function verifyResetCode(code) {
  if (code !== resetState.code) {
    showToast('كود التحقق غير صحيح.', 'error');
    return false;
  }
  showResetStep('reset-step-3');
  return true;
}

function resetPassword(newPass) {
  const data = loadAppData();
  const idx = data.accounts.findIndex(a => a.email.toLowerCase() === resetState.email);
  if (idx === -1) return false;
  data.accounts[idx].password = newPass;
  saveAppData(data);
  resetState = { email: '', code: '' };
  showToast('تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن.', 'success');
  showScreen('auth-screen');
  switchAuthTab('login');
  return true;
}

/* ============================================================
   دوال الحساب — كل المبالغ مفصولة حسب العملة
============================================================ */
function emptyTotals() {
  const t = {};
  CURRENCY_ORDER.forEach(c => { t[c] = 0; });
  return t;
}

function calculateCustomerTotals(customerId) {
  const acc = getActiveAccount();
  const debit = emptyTotals();
  const credit = emptyTotals();
  if (!acc) return { debit, credit, balance: emptyTotals() };

  // فقط عمليات الدين تدخل في رصيد الزبون؛ النقدي مسدد فوراً
  acc.sales.filter(s => s.customerId === customerId && (s.paymentType || 'debt') === 'debt').forEach(s => {
    const c = s.currency || 'SYP';
    debit[c] = (debit[c] || 0) + Number(s.amount || 0);
  });
  acc.payments.filter(p => p.customerId === customerId).forEach(p => {
    const c = p.currency || 'SYP';
    credit[c] = (credit[c] || 0) + Number(p.amount || 0);
  });

  const balance = emptyTotals();
  CURRENCY_ORDER.forEach(c => { balance[c] = (debit[c] || 0) - (credit[c] || 0); });
  return { debit, credit, balance };
}

function calculateAllTotals() {
  const acc = getActiveAccount();
  const sales = emptyTotals();      // كل المبيعات (نقدي + دين)
  const debtSales = emptyTotals();  // فقط الدين
  const payments = emptyTotals();
  if (!acc) return { sales, debtSales, payments, balance: emptyTotals() };
  acc.sales.forEach(s => {
    const c = s.currency || 'SYP';
    const amt = Number(s.amount || 0);
    sales[c] = (sales[c] || 0) + amt;
    if ((s.paymentType || 'debt') === 'debt') debtSales[c] = (debtSales[c] || 0) + amt;
  });
  acc.payments.forEach(p => {
    const c = p.currency || 'SYP';
    payments[c] = (payments[c] || 0) + Number(p.amount || 0);
  });
  const balance = emptyTotals();
  CURRENCY_ORDER.forEach(c => { balance[c] = debtSales[c] - payments[c]; });
  return { sales, debtSales, payments, balance };
}

function customerActiveCurrencies(customerId) {
  const t = calculateCustomerTotals(customerId);
  return CURRENCY_ORDER.filter(c => t.debit[c] || t.credit[c]);
}

function formatBalancesShort(balances) {
  const parts = [];
  CURRENCY_ORDER.forEach(c => {
    if (balances[c]) parts.push(fmtAmount(balances[c], c));
  });
  return parts.join(' • ') || '—';
}

/* ============================================================
   الدخول إلى النظام
============================================================ */
function enterApp() {
  showScreen('app-screen');
  refreshHeader();
  navigateTo('dashboard');
}

function refreshHeader() {
  const acc = getActiveAccount();
  if (!acc) return;
  $('#header-pharmacy-name').textContent = acc.pharmacyName;
  $('#header-owner-name').textContent = acc.ownerName;
  const logo = $('#header-logo');
  if (acc.logoData) {
    logo.src = acc.logoData;
    logo.style.display = 'block';
  } else {
    logo.removeAttribute('src');
    logo.style.display = 'none';
  }
}

function navigateTo(view) {
  $all('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $all('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  $('#sidebar').classList.remove('open');
  switch (view) {
    case 'dashboard': renderDashboard(); break;
    case 'customers': renderCustomers(); break;
    case 'sales':     renderSales();     break;
    case 'payments':  renderPayments();  break;
    case 'reports':   renderReports();   break;
    case 'log':       renderLog();       break;
    case 'settings':  renderSettings();  break;
  }
}

/* ============================================================
   عرض: لوحة التحكم
============================================================ */
function renderDashboard() {
  const acc = getActiveAccount();
  if (!acc) return;

  $('#stat-customers').textContent = acc.customers.length;
  $('#stat-sales-count').textContent = acc.sales.length;
  $('#stat-payments-count').textContent = acc.payments.length;

  const totals = calculateAllTotals();
  const rows = CURRENCY_ORDER
    .filter(c => totals.sales[c] || totals.payments[c])
    .map(c => `<tr>
      <td>${currencyName(c)}</td>
      <td>${fmtAmount(totals.sales[c], c)}</td>
      <td>${fmtAmount(totals.payments[c], c)}</td>
      <td><strong>${fmtAmount(totals.balance[c], c)}</strong></td>
    </tr>`).join('');
  $('#totals-by-currency-body').innerHTML = rows ||
    `<tr><td colspan="4" class="empty">لا توجد بيانات بعد.</td></tr>`;

  const recent = [...acc.sales].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8);
  $('#recent-sales-body').innerHTML = recent.length
    ? recent.map(s => {
        const cust = acc.customers.find(c => c.id === s.customerId);
        return `<tr>
          <td>${escapeHtml(formatDateAr(s.date))}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${escapeHtml(s.productName)}</td>
          <td>${escapeHtml(s.qty)}</td>
          <td>${fmtMoney(s.amount)}</td>
          <td>${escapeHtml(currencyName(s.currency))}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="6" class="empty">لا توجد حركات بعد.</td></tr>`;
}

/* ============================================================
   عرض: الزبائن
============================================================ */
function renderCustomers() {
  const acc = getActiveAccount();
  if (!acc) return;
  const tbody = $('#customers-body');
  if (!acc.customers.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">لا يوجد زبائن. أضف زبونًا للبدء.</td></tr>`;
    return;
  }
  tbody.innerHTML = acc.customers.map((c, i) => {
    const t = calculateCustomerTotals(c.id);
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.phone || '—')}</td>
      <td>${escapeHtml(c.address || '—')}</td>
      <td><strong>${formatBalancesShort(t.balance)}</strong></td>
      <td class="no-print">
        <button class="btn btn-secondary btn-sm" data-print-customer="${c.id}">🖨️ كشف</button>
        <button class="btn btn-danger btn-sm" data-del-customer="${c.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: بيع جديد
============================================================ */
function renderSales() {
  const acc = getActiveAccount();
  if (!acc) return;
  populateSelect('#sale-customer', acc.customers.map(c => ({ value: c.id, text: c.name })), 'اختر الزبون');
  if (!$('#sale-date').value) $('#sale-date').value = todayStr();

  const tbody = $('#sales-body');
  if (!acc.sales.length) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty">لا توجد عمليات بيع بعد.</td></tr>`;
    return;
  }
  const sorted = [...acc.sales].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  tbody.innerHTML = sorted.map((s, i) => {
    const cust = acc.customers.find(c => c.id === s.customerId);
    const type = s.paymentType || 'debt';
    const typeBadge = type === 'cash'
      ? '<span class="badge badge-ok">نقدي</span>'
      : '<span class="badge badge-warn">دين</span>';
    const dueCell = type === 'debt' ? escapeHtml(formatDateAr(s.dueDate) || '—') : '—';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(formatDateAr(s.date))}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td>${escapeHtml(s.productName)}</td>
      <td>${escapeHtml(s.qty)}</td>
      <td><strong>${fmtMoney(s.amount)}</strong></td>
      <td>${escapeHtml(currencyName(s.currency))}</td>
      <td>${typeBadge}</td>
      <td>${dueCell}</td>
      <td>${escapeHtml(s.notes || '—')}</td>
      <td class="no-print">
        <button class="btn btn-secondary btn-sm" data-print-sale="${s.id}">🖨️ إيصال</button>
        <button class="btn btn-danger btn-sm" data-del-sale="${s.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: الدفعات
============================================================ */
function renderPayments() {
  const acc = getActiveAccount();
  if (!acc) return;
  populateSelect('#payment-customer', acc.customers.map(c => ({ value: c.id, text: c.name })), 'اختر الزبون');
  if (!$('#payment-date').value) $('#payment-date').value = todayStr();

  const tbody = $('#payments-body');
  if (!acc.payments.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty">لا توجد دفعات بعد.</td></tr>`;
    return;
  }
  const sorted = [...acc.payments].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  tbody.innerHTML = sorted.map((p, i) => {
    const cust = acc.customers.find(c => c.id === p.customerId);
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(formatDateAr(p.date))}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td><strong>${fmtMoney(p.amount)}</strong></td>
      <td>${escapeHtml(currencyName(p.currency))}</td>
      <td>${escapeHtml(p.notes || '—')}</td>
      <td class="no-print">
        <button class="btn btn-secondary btn-sm" data-print-payment="${p.id}">🖨️ إيصال</button>
        <button class="btn btn-danger btn-sm" data-del-payment="${p.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: كشف الحساب
============================================================ */
function renderReports() {
  const acc = getActiveAccount();
  if (!acc) return;
  populateSelect('#report-customer', acc.customers.map(c => ({ value: c.id, text: c.name })), 'اختر الزبون');
  renderReportContent($('#report-customer').value);
}

function renderReportContent(customerId) {
  const acc = getActiveAccount();
  const box = $('#report-content');
  if (!customerId || !acc) {
    box.innerHTML = `<p class="hint">اختر زبونًا لعرض كشف الحساب.</p>`;
    return;
  }
  const cust = acc.customers.find(c => c.id === customerId);
  if (!cust) {
    box.innerHTML = `<p class="hint">الزبون غير موجود.</p>`;
    return;
  }
  const t = calculateCustomerTotals(customerId);
  const activeCurs = customerActiveCurrencies(customerId);
  const sales = acc.sales.filter(s => s.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const payments = acc.payments.filter(p => p.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  let html = `<div style="margin-bottom:10px"><strong>${escapeHtml(cust.name)}</strong>
    ${cust.phone ? ' | ' + escapeHtml(cust.phone) : ''}
    ${cust.address ? ' | ' + escapeHtml(cust.address) : ''}</div>`;

  if (!activeCurs.length) {
    html += `<p class="hint">لا توجد مبيعات أو دفعات لهذا الزبون.</p>`;
  } else {
    html += `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>العملة</th><th>مدين (مبيعات)</th><th>دائن (دفعات)</th><th>المتبقي</th></tr></thead>
      <tbody>
      ${activeCurs.map(c => `<tr>
        <td>${currencyName(c)}</td>
        <td>${fmtAmount(t.debit[c], c)}</td>
        <td>${fmtAmount(t.credit[c], c)}</td>
        <td><strong>${fmtAmount(t.balance[c], c)}</strong></td>
      </tr>`).join('')}
      </tbody>
    </table></div>`;
  }

  html += `<h4 class="sub-title">حركات الزبون</h4>`;
  if (!sales.length) {
    html += `<p class="hint">لا توجد حركات.</p>`;
  } else {
    html += `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>التاريخ</th><th>المنتج</th><th>الكمية</th><th>المبلغ</th><th>العملة</th><th>ملاحظات</th></tr></thead>
      <tbody>
      ${sales.map(s => `<tr>
        <td>${escapeHtml(formatDateAr(s.date))}</td>
        <td>${escapeHtml(s.productName)}</td>
        <td>${escapeHtml(s.qty)}</td>
        <td>${fmtMoney(s.amount)}</td>
        <td>${escapeHtml(currencyName(s.currency))}</td>
        <td>${escapeHtml(s.notes || '—')}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>`;
  }

  html += `<h4 class="sub-title">دفعات الزبون</h4>`;
  if (!payments.length) {
    html += `<p class="hint">لا توجد دفعات.</p>`;
  } else {
    html += `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>التاريخ</th><th>المبلغ</th><th>العملة</th><th>ملاحظات</th></tr></thead>
      <tbody>
      ${payments.map(p => `<tr>
        <td>${escapeHtml(formatDateAr(p.date))}</td>
        <td>${fmtMoney(p.amount)}</td>
        <td>${escapeHtml(currencyName(p.currency))}</td>
        <td>${escapeHtml(p.notes || '—')}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>`;
  }
  box.innerHTML = html;
}

/* ============================================================
   عرض: السجل (timeline)
============================================================ */
let logFilter = { from: '', to: '', customerId: '', type: '' };

function buildLogEntries() {
  const acc = getActiveAccount();
  if (!acc) return [];
  const entries = [];
  acc.sales.forEach(s => {
    const type = s.paymentType || 'debt';
    const typeLabel = type === 'cash' ? 'نقدي' : 'دين';
    const dueInfo = (type === 'debt' && s.dueDate) ? ` - تسديد: ${formatDateAr(s.dueDate)}` : '';
    entries.push({
      id: s.id, kind: 'sale', date: s.date, customerId: s.customerId,
      detail: `${s.productName} — ${s.qty} [${typeLabel}${dueInfo}]` + (s.notes ? ` (${s.notes})` : ''),
      amount: s.amount, currency: s.currency
    });
  });
  acc.payments.forEach(p => entries.push({
    id: p.id, kind: 'payment', date: p.date, customerId: p.customerId,
    detail: 'دفعة' + (p.notes ? ` — ${p.notes}` : ''),
    amount: p.amount, currency: p.currency
  }));
  return entries;
}

function applyLogFilter(entries) {
  return entries.filter(e => {
    if (logFilter.from && e.date < logFilter.from) return false;
    if (logFilter.to && e.date > logFilter.to) return false;
    if (logFilter.customerId && e.customerId !== logFilter.customerId) return false;
    if (logFilter.type && e.kind !== logFilter.type) return false;
    return true;
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function renderLog() {
  const acc = getActiveAccount();
  if (!acc) return;
  populateSelect('#log-customer', acc.customers.map(c => ({ value: c.id, text: c.name })), 'كل الزبائن');
  const entries = applyLogFilter(buildLogEntries());
  const tbody = $('#log-body');
  if (!entries.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty">لا توجد سجلات.</td></tr>`;
    return;
  }
  tbody.innerHTML = entries.map((e, i) => {
    const cust = acc.customers.find(c => c.id === e.customerId);
    const typeBadge = e.kind === 'sale'
      ? '<span class="badge badge-warn">بيع</span>'
      : '<span class="badge badge-ok">دفعة</span>';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(formatDateAr(e.date))}</td>
      <td>${typeBadge}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td>${escapeHtml(e.detail)}</td>
      <td><strong>${fmtMoney(e.amount)}</strong></td>
      <td>${escapeHtml(currencyName(e.currency))}</td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: الإعدادات
============================================================ */
function renderSettings() {
  const acc = getActiveAccount();
  if (!acc) return;
  $('#set-pharmacy').value = acc.pharmacyName;
  $('#set-owner').value = acc.ownerName;
  $('#set-email').value = acc.email;
  $('#set-phone').value = acc.phone || '';
  $('#set-address').value = acc.address || '';
  const prev = $('#set-logo-preview');
  if (acc.logoData) prev.src = acc.logoData;
  else prev.removeAttribute('src');
}

/* ============================================================
   تعبئة select
============================================================ */
function populateSelect(selector, options, placeholder) {
  const sel = $(selector);
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = `<option value="">${placeholder || ''}</option>` +
    options.map(o => `<option value="${o.value}">${escapeHtml(o.text)}</option>`).join('');
  if (current && options.some(o => o.value === current)) sel.value = current;
}

/* ============================================================
   النسخ الاحتياطي
============================================================ */
function exportBackup() {
  const acc = getActiveAccount();
  if (!acc) return;
  const payload = JSON.stringify(acc, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agri-pharmacy-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('تم تصدير النسخة الاحتياطية.', 'success');
}

function importBackup(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || typeof parsed !== 'object') throw new Error('شكل غير صحيح');
      if (!Array.isArray(parsed.customers) || !Array.isArray(parsed.sales) || !Array.isArray(parsed.payments)) {
        throw new Error('بنية غير صحيحة');
      }
      if (!confirm('سيتم استبدال بيانات الحساب الحالي بالنسخة المستوردة، هل تريد المتابعة؟')) return;
      updateActiveAccount(a => {
        a.customers = parsed.customers;
        a.sales = parsed.sales;
        a.payments = parsed.payments;
        if (parsed.pharmacyName) a.pharmacyName = parsed.pharmacyName;
        if (parsed.ownerName) a.ownerName = parsed.ownerName;
        if (parsed.phone !== undefined) a.phone = parsed.phone;
        if (parsed.address !== undefined) a.address = parsed.address;
        if (parsed.logoData !== undefined) a.logoData = parsed.logoData;
      });
      refreshHeader();
      navigateTo('dashboard');
      showToast('تم استيراد النسخة بنجاح.', 'success');
    } catch (err) {
      showToast('ملف غير صالح.', 'error');
    }
  };
  reader.readAsText(file);
}

function deleteCurrentAccountData() {
  if (!confirm('سيتم حذف جميع بيانات الحساب الحالي (زبائن، مبيعات، دفعات). هل أنت متأكد؟')) return;
  if (!confirm('تأكيد نهائي: هل تريد المتابعة بالحذف؟')) return;
  updateActiveAccount(a => {
    a.customers = [];
    a.sales = [];
    a.payments = [];
  });
  showToast('تم حذف بيانات الحساب.', 'success');
  navigateTo('dashboard');
}

/* ============================================================
   الطباعة
============================================================ */
function buildPrintTemplate(title, bodyHtml, note) {
  const acc = getActiveAccount();
  const logoTag = acc && acc.logoData ? `<img src="${acc.logoData}" alt="logo" />` : '';
  return `
    <div class="print-header">
      ${logoTag}
      <div>
        <h2>${escapeHtml(acc ? acc.pharmacyName : '')}</h2>
        <div class="print-meta">
          المالك: ${escapeHtml(acc ? acc.ownerName : '')}
          ${acc && acc.phone ? ' | الهاتف: ' + escapeHtml(acc.phone) : ''}
          ${acc && acc.address ? ' | العنوان: ' + escapeHtml(acc.address) : ''}
        </div>
        <div class="print-meta">تاريخ الطباعة: ${todayStr()}</div>
      </div>
    </div>
    <h3 style="margin-bottom:10px">${escapeHtml(title)}</h3>
    ${bodyHtml}
    <div class="print-footer">
      <div>توقيع صاحب الصيدلية: ____________________</div>
      <div>توقيع المستلم / المحاسب: ____________________</div>
    </div>
    <div class="print-note">
      ملاحظة: تم إنشاء هذا التقرير تلقائيًا من النظام، ويرجى مراجعة الأرقام قبل الاعتماد النهائي.
      ${note ? '<br>' + escapeHtml(note) : ''}
    </div>
  `;
}

function printArea(html) {
  const area = $('#print-area');
  area.innerHTML = html;
  window.print();
}

function cleanupPrintMode() {
  $('#print-area').innerHTML = '';
}

window.addEventListener('afterprint', cleanupPrintMode);

/* ----- طباعة قسم كامل ----- */
function printSection(viewId) {
  const acc = getActiveAccount();
  if (!acc) return;
  let title = '';
  let body = '';

  switch (viewId) {
    case 'view-customers': {
      title = 'قائمة الزبائن';
      const rows = acc.customers.map((c, i) => {
        const t = calculateCustomerTotals(c.id);
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.phone || '—')}</td>
          <td>${escapeHtml(c.address || '—')}</td>
          <td>${escapeHtml(formatBalancesShort(t.balance))}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>العنوان</th><th>الأرصدة</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">لا يوجد زبائن.</td></tr>`}</tbody>
      </table>`;
      break;
    }
    case 'view-sales': {
      title = 'سجل المبيعات';
      const rows = acc.sales.map((s, i) => {
        const cust = acc.customers.find(c => c.id === s.customerId);
        const type = s.paymentType || 'debt';
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(formatDateAr(s.date))}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${escapeHtml(s.productName)}</td>
          <td>${escapeHtml(s.qty)}</td>
          <td>${fmtMoney(s.amount)}</td>
          <td>${escapeHtml(currencyName(s.currency))}</td>
          <td>${type === 'cash' ? 'نقدي' : 'دين'}</td>
          <td>${type === 'debt' ? escapeHtml(formatDateAr(s.dueDate) || '—') : '—'}</td>
          <td>${escapeHtml(s.notes || '—')}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>التاريخ</th><th>الزبون</th><th>المنتج</th><th>الكمية</th><th>المبلغ</th><th>العملة</th><th>النوع</th><th>تاريخ التسديد</th><th>ملاحظات</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="10">لا توجد مبيعات.</td></tr>`}</tbody>
      </table>`;
      break;
    }
    case 'view-payments': {
      title = 'سجل الدفعات';
      const rows = acc.payments.map((p, i) => {
        const cust = acc.customers.find(c => c.id === p.customerId);
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(formatDateAr(p.date))}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${fmtMoney(p.amount)}</td>
          <td>${escapeHtml(currencyName(p.currency))}</td>
          <td>${escapeHtml(p.notes || '—')}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>التاريخ</th><th>الزبون</th><th>المبلغ</th><th>العملة</th><th>ملاحظات</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">لا توجد دفعات.</td></tr>`}</tbody>
      </table>`;
      break;
    }
    case 'view-log': {
      title = 'السجل الكامل';
      const entries = applyLogFilter(buildLogEntries());
      const rows = entries.map((e, i) => {
        const cust = acc.customers.find(c => c.id === e.customerId);
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(formatDateAr(e.date))}</td>
          <td>${e.kind === 'sale' ? 'بيع' : 'دفعة'}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${escapeHtml(e.detail)}</td>
          <td>${fmtMoney(e.amount)}</td>
          <td>${escapeHtml(currencyName(e.currency))}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>التاريخ</th><th>النوع</th><th>الزبون</th><th>التفاصيل</th><th>المبلغ</th><th>العملة</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="7">لا توجد سجلات.</td></tr>`}</tbody>
      </table>`;
      break;
    }
  }
  printArea(buildPrintTemplate(title, body));
}

/* ----- إيصال عملية بيع واحدة ----- */
function printSaleReceipt(saleId) {
  const acc = getActiveAccount();
  if (!acc) return;
  const s = acc.sales.find(x => x.id === saleId);
  if (!s) return;
  const cust = acc.customers.find(c => c.id === s.customerId);
  const type = s.paymentType || 'debt';
  const typeLabel = type === 'cash' ? 'نقدي (مسدد)' : 'دين';
  const dueRow = type === 'debt'
    ? `<tr><th>تاريخ التسديد</th><td>${escapeHtml(formatDateAr(s.dueDate) || 'غير محدد')}</td></tr>`
    : '';
  const body = `
    <table>
      <tbody>
        <tr><th style="width:35%">التاريخ</th><td>${escapeHtml(formatDateAr(s.date))}</td></tr>
        <tr><th>الزبون</th><td>${escapeHtml(cust ? cust.name : '—')}${cust && cust.phone ? ' — ' + escapeHtml(cust.phone) : ''}</td></tr>
        <tr><th>المنتج</th><td>${escapeHtml(s.productName)}</td></tr>
        <tr><th>الكمية</th><td>${escapeHtml(s.qty)}</td></tr>
        <tr><th>السعر الإجمالي</th><td><strong>${fmtAmount(s.amount, s.currency)}</strong></td></tr>
        <tr><th>نوع الدفع</th><td>${typeLabel}</td></tr>
        ${dueRow}
        <tr><th>ملاحظات</th><td>${escapeHtml(s.notes || '—')}</td></tr>
      </tbody>
    </table>
  `;
  printArea(buildPrintTemplate('إيصال بيع', body));
}

/* ----- إيصال دفعة واحدة ----- */
function printPaymentReceipt(paymentId) {
  const acc = getActiveAccount();
  if (!acc) return;
  const p = acc.payments.find(x => x.id === paymentId);
  if (!p) return;
  const cust = acc.customers.find(c => c.id === p.customerId);
  const body = `
    <table>
      <tbody>
        <tr><th style="width:35%">التاريخ</th><td>${escapeHtml(formatDateAr(p.date))}</td></tr>
        <tr><th>الزبون</th><td>${escapeHtml(cust ? cust.name : '—')}${cust && cust.phone ? ' — ' + escapeHtml(cust.phone) : ''}</td></tr>
        <tr><th>المبلغ المستلم</th><td><strong>${fmtAmount(p.amount, p.currency)}</strong></td></tr>
        <tr><th>ملاحظات</th><td>${escapeHtml(p.notes || '—')}</td></tr>
      </tbody>
    </table>
  `;
  printArea(buildPrintTemplate('إيصال دفعة', body));
}

/* ----- كشف زبون كامل ----- */
function printCustomerStatement(customerId) {
  const acc = getActiveAccount();
  if (!acc || !customerId) return;
  const cust = acc.customers.find(c => c.id === customerId);
  if (!cust) return;
  const t = calculateCustomerTotals(customerId);
  const activeCurs = customerActiveCurrencies(customerId);
  const sales = acc.sales.filter(s => s.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const payments = acc.payments.filter(p => p.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  let body = `<div style="margin-bottom:10px">
    <strong>الزبون:</strong> ${escapeHtml(cust.name)}
    ${cust.phone ? ' | <strong>الهاتف:</strong> ' + escapeHtml(cust.phone) : ''}
    ${cust.address ? ' | <strong>العنوان:</strong> ' + escapeHtml(cust.address) : ''}
  </div>`;

  if (activeCurs.length) {
    body += `<table>
      <thead><tr><th>العملة</th><th>مدين</th><th>دائن</th><th>المتبقي</th></tr></thead>
      <tbody>${activeCurs.map(c => `<tr class="totals-row">
        <td>${currencyName(c)}</td>
        <td>${fmtAmount(t.debit[c], c)}</td>
        <td>${fmtAmount(t.credit[c], c)}</td>
        <td>${fmtAmount(t.balance[c], c)}</td>
      </tr>`).join('')}</tbody>
    </table>`;
  }

  body += `<h4 style="margin-top:14px">المبيعات</h4>
    <table>
      <thead><tr><th>التاريخ</th><th>المنتج</th><th>الكمية</th><th>المبلغ</th><th>العملة</th><th>ملاحظات</th></tr></thead>
      <tbody>${sales.map(s => `<tr>
        <td>${escapeHtml(formatDateAr(s.date))}</td>
        <td>${escapeHtml(s.productName)}</td>
        <td>${escapeHtml(s.qty)}</td>
        <td>${fmtMoney(s.amount)}</td>
        <td>${escapeHtml(currencyName(s.currency))}</td>
        <td>${escapeHtml(s.notes || '—')}</td>
      </tr>`).join('') || `<tr><td colspan="6">لا توجد مبيعات.</td></tr>`}</tbody>
    </table>
    <h4 style="margin-top:14px">الدفعات</h4>
    <table>
      <thead><tr><th>التاريخ</th><th>المبلغ</th><th>العملة</th><th>ملاحظات</th></tr></thead>
      <tbody>${payments.map(p => `<tr>
        <td>${escapeHtml(formatDateAr(p.date))}</td>
        <td>${fmtMoney(p.amount)}</td>
        <td>${escapeHtml(currencyName(p.currency))}</td>
        <td>${escapeHtml(p.notes || '—')}</td>
      </tr>`).join('') || `<tr><td colspan="4">لا توجد دفعات.</td></tr>`}</tbody>
    </table>`;
  printArea(buildPrintTemplate('كشف حساب الزبون', body));
}

/* ============================================================
   ربط الأحداث
============================================================ */
function bindEvents() {

  /* تبديل تبويبات المصادقة */
  $all('.tab-btn').forEach(b => b.addEventListener('click', () => switchAuthTab(b.dataset.tab)));

  /* زر العين لكلمة المرور */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.eye-btn');
    if (!btn) return;
    const input = $('#' + btn.dataset.target);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
    else { input.type = 'password'; btn.textContent = '👁️'; }
  });

  /* تسجيل الدخول / إنشاء حساب */
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    loginAccount($('#login-email').value, $('#login-password').value);
  });
  $('#register-form').addEventListener('submit', e => {
    e.preventDefault();
    registerAccount({
      pharmacyName: $('#reg-pharmacy').value,
      ownerName: $('#reg-owner').value,
      email: $('#reg-email').value,
      phone: $('#reg-phone').value,
      address: $('#reg-address').value,
      password: $('#reg-password').value
    });
  });

  /* نسيت كلمة المرور */
  $('#forgot-link').addEventListener('click', () => {
    showResetStep('reset-step-1');
    showScreen('reset-screen');
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    showScreen(t.dataset.go);
  });
  $('#reset-step-1').addEventListener('submit', e => {
    e.preventDefault();
    startPasswordRecovery($('#reset-email').value);
  });
  $('#reset-step-2').addEventListener('submit', e => {
    e.preventDefault();
    verifyResetCode($('#reset-code').value.trim());
  });
  $('#reset-step-3').addEventListener('submit', e => {
    e.preventDefault();
    resetPassword($('#reset-new-password').value);
  });

  /* تسجيل الخروج + التنقل */
  $('#logout-btn').addEventListener('click', logoutAccount);
  $all('.nav-btn').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.view)));
  $('#sidebar-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

  /* الزبائن */
  $('#customer-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#customer-name').value.trim();
    if (!name) { showToast('أدخل اسم الزبون.', 'warn'); return; }
    updateActiveAccount(a => {
      a.customers.push({
        id: uid('cust'),
        name,
        phone: $('#customer-phone').value.trim(),
        address: $('#customer-address').value.trim(),
        notes: $('#customer-notes').value.trim()
      });
    });
    e.target.reset();
    showToast('تم حفظ الزبون.', 'success');
    renderCustomers();
  });

  /* بيع جديد */
  $('#sale-type').addEventListener('change', () => {
    const isDebt = $('#sale-type').value === 'debt';
    $('#sale-due-date-wrap').style.display = isDebt ? '' : 'none';
    if (!isDebt) $('#sale-due-date').value = '';
  });

  $('#sale-form').addEventListener('submit', e => {
    e.preventDefault();
    const customerId = $('#sale-customer').value;
    if (!customerId) { showToast('اختر زبونًا أولًا.', 'warn'); return; }
    const productName = $('#sale-product-name').value.trim();
    const qty = $('#sale-qty').value.trim();
    const amount = Number($('#sale-amount').value) || 0;
    const currency = $('#sale-currency').value;
    if (!productName) { showToast('اكتب اسم المنتج.', 'warn'); return; }
    if (!qty) { showToast('اكتب الكمية.', 'warn'); return; }
    if (amount <= 0) { showToast('أدخل السعر الإجمالي.', 'warn'); return; }
    if (!CURRENCIES[currency]) { showToast('اختر عملة صحيحة.', 'warn'); return; }

    updateActiveAccount(a => {
      a.sales.push({
        id: uid('sale'),
        customerId, productName, qty, amount, currency,
        paymentType: $('#sale-type').value || 'debt',
        dueDate: ($('#sale-type').value === 'debt') ? ($('#sale-due-date').value || '') : '',
        date: $('#sale-date').value || todayStr(),
        notes: $('#sale-notes').value.trim()
      });
    });
    e.target.reset();
    $('#sale-date').value = todayStr();
    $('#sale-type').value = 'debt';
    $('#sale-due-date-wrap').style.display = '';
    showToast('تم حفظ العملية.', 'success');
    renderSales();
  });

  /* الدفعات */
  $('#payment-form').addEventListener('submit', e => {
    e.preventDefault();
    const customerId = $('#payment-customer').value;
    if (!customerId) { showToast('اختر زبونًا أولًا.', 'warn'); return; }
    const amount = Number($('#payment-amount').value) || 0;
    const currency = $('#payment-currency').value;
    if (amount <= 0) { showToast('أدخل مبلغًا صحيحًا.', 'warn'); return; }
    if (!CURRENCIES[currency]) { showToast('اختر عملة صحيحة.', 'warn'); return; }
    updateActiveAccount(a => {
      a.payments.push({
        id: uid('pay'),
        customerId, amount, currency,
        date: $('#payment-date').value || todayStr(),
        notes: $('#payment-notes').value.trim()
      });
    });
    e.target.reset();
    $('#payment-date').value = todayStr();
    showToast('تم حفظ الدفعة.', 'success');
    renderPayments();
  });

  /* الحذف وأزرار الطباعة (event delegation) */
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-del-customer]');
    if (c) {
      if (!confirm('سيتم حذف الزبون وجميع حركاته ودفعاته. هل أنت متأكد؟')) return;
      const id = c.dataset.delCustomer;
      updateActiveAccount(a => {
        a.customers = a.customers.filter(x => x.id !== id);
        a.sales = a.sales.filter(x => x.customerId !== id);
        a.payments = a.payments.filter(x => x.customerId !== id);
      });
      showToast('تم حذف العنصر.', 'success');
      renderCustomers();
      return;
    }
    const s = e.target.closest('[data-del-sale]');
    if (s) {
      if (!confirm('حذف العملية؟')) return;
      const id = s.dataset.delSale;
      updateActiveAccount(a => { a.sales = a.sales.filter(x => x.id !== id); });
      showToast('تم حذف العنصر.', 'success');
      renderSales();
      return;
    }
    const pay = e.target.closest('[data-del-payment]');
    if (pay) {
      if (!confirm('حذف الدفعة؟')) return;
      const id = pay.dataset.delPayment;
      updateActiveAccount(a => { a.payments = a.payments.filter(x => x.id !== id); });
      showToast('تم حذف العنصر.', 'success');
      renderPayments();
      return;
    }

    const printSale = e.target.closest('[data-print-sale]');
    if (printSale) { printSaleReceipt(printSale.dataset.printSale); return; }

    const printPay = e.target.closest('[data-print-payment]');
    if (printPay) { printPaymentReceipt(printPay.dataset.printPayment); return; }

    const printCust = e.target.closest('[data-print-customer]');
    if (printCust) { printCustomerStatement(printCust.dataset.printCustomer); return; }

    const printSec = e.target.closest('[data-print]');
    if (printSec) { printSection(printSec.dataset.print); return; }
  });

  /* التقارير */
  $('#report-customer').addEventListener('change', e => renderReportContent(e.target.value));
  $('#print-report-btn').addEventListener('click', () => {
    const id = $('#report-customer').value;
    if (!id) { showToast('اختر زبونًا أولًا.', 'warn'); return; }
    printCustomerStatement(id);
  });

  /* السجل */
  $('#log-filter-btn').addEventListener('click', () => {
    logFilter = {
      from: $('#log-from').value,
      to: $('#log-to').value,
      customerId: $('#log-customer').value,
      type: $('#log-type').value
    };
    renderLog();
  });
  $('#log-clear-btn').addEventListener('click', () => {
    logFilter = { from: '', to: '', customerId: '', type: '' };
    $('#log-from').value = '';
    $('#log-to').value = '';
    $('#log-customer').value = '';
    $('#log-type').value = '';
    renderLog();
  });

  /* النسخ الاحتياطي */
  $('#export-btn').addEventListener('click', exportBackup);
  $('#import-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importBackup(file);
    e.target.value = '';
  });
  $('#delete-data-btn').addEventListener('click', deleteCurrentAccountData);

  /* الإعدادات */
  $('#settings-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = loadAppData();
    const newEmail = $('#set-email').value.trim().toLowerCase();
    const id = getActiveAccountId();
    if (data.accounts.some(a => a.id !== id && a.email.toLowerCase() === newEmail)) {
      showToast('البريد الإلكتروني مستخدم مسبقًا.', 'error');
      return;
    }
    updateActiveAccount(a => {
      a.pharmacyName = $('#set-pharmacy').value.trim();
      a.ownerName = $('#set-owner').value.trim();
      a.email = newEmail;
      a.phone = $('#set-phone').value.trim();
      a.address = $('#set-address').value.trim();
    });
    refreshHeader();
    showToast('تم حفظ الإعدادات.', 'success');
  });

  $('#set-logo').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      showToast('حجم الصورة كبير جدًا (الحد 2MB).', 'warn');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      updateActiveAccount(a => { a.logoData = ev.target.result; });
      $('#set-logo-preview').src = ev.target.result;
      refreshHeader();
      showToast('تم حفظ الشعار.', 'success');
    };
    reader.readAsDataURL(file);
  });

  $('#set-logo-remove').addEventListener('click', () => {
    updateActiveAccount(a => { a.logoData = ''; });
    $('#set-logo-preview').removeAttribute('src');
    refreshHeader();
    showToast('تم إزالة الشعار.', 'success');
  });

  $('#change-password-form').addEventListener('submit', e => {
    e.preventDefault();
    const acc = getActiveAccount();
    if (!acc) return;
    if (acc.password !== $('#old-password').value) {
      showToast('كلمة المرور الحالية غير صحيحة.', 'error');
      return;
    }
    updateActiveAccount(a => { a.password = $('#new-password').value; });
    e.target.reset();
    showToast('تم تحديث كلمة المرور.', 'success');
  });
}

/* ============================================================
   التشغيل
============================================================ */
function init() {
  bindEvents();
  const acc = getActiveAccount();
  if (acc) enterApp();
  else {
    showScreen('auth-screen');
    switchAuthTab('login');
  }
}

document.addEventListener('DOMContentLoaded', init);
