/* ============================================================
   نظام الصيدليات الزراعية - منطق التطبيق الكامل
   - بيانات محفوظة في localStorage تحت المفتاح: agriPharmacyApp
   - جلسة الدخول في sessionStorage تحت المفتاح: activeAccountId
   ============================================================ */

'use strict';

/* ============================================================
   مفاتيح التخزين والثوابت
============================================================ */
const STORAGE_KEY = 'agriPharmacyApp';
const SESSION_KEY = 'activeAccountId';

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

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

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
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 2600);
}

/* ============================================================
   إدارة الشاشات
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
    inventory: [],
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

/* استعادة كلمة المرور (كود تجريبي محلي) */
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
   الحسابات (دوال الحساب)
============================================================ */
function calculateProductSoldQty(productId) {
  const acc = getActiveAccount();
  if (!acc) return 0;
  return acc.sales
    .filter(s => s.productId === productId)
    .reduce((sum, s) => sum + Number(s.qty || 0), 0);
}

function calculateProductAvailableQty(product) {
  const sold = calculateProductSoldQty(product.id);
  return Number(product.qty || 0) - sold;
}

function saleTotal(sale) {
  return Number(sale.price || 0) * Number(sale.qty || 0);
}

function calculateCustomerTotals(customerId) {
  const acc = getActiveAccount();
  if (!acc) return { debit: 0, credit: 0, balance: 0 };
  const debit = acc.sales
    .filter(s => s.customerId === customerId)
    .reduce((sum, s) => sum + saleTotal(s), 0);
  const credit = acc.payments
    .filter(p => p.customerId === customerId)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return { debit, credit, balance: debit - credit };
}

function calculateAllTotals() {
  const acc = getActiveAccount();
  if (!acc) return { totalSales: 0, totalPayments: 0, totalBalance: 0 };
  const totalSales = acc.sales.reduce((sum, s) => sum + saleTotal(s), 0);
  const totalPayments = acc.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  return { totalSales, totalPayments, totalBalance: totalSales - totalPayments };
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
    case 'inventory': renderInventory(); break;
    case 'sales': renderSales(); break;
    case 'payments': renderPayments(); break;
    case 'reports': renderReports(); break;
    case 'settings': renderSettings(); break;
  }
}

/* ============================================================
   عرض: لوحة التحكم
============================================================ */
function renderDashboard() {
  const acc = getActiveAccount();
  if (!acc) return;
  const totals = calculateAllTotals();
  const lowStock = acc.inventory.filter(p => calculateProductAvailableQty(p) <= Number(p.alertLevel || 0)).length;

  $('#stat-customers').textContent = acc.customers.length;
  $('#stat-products').textContent = acc.inventory.length;
  $('#stat-sales').textContent = fmtMoney(totals.totalSales);
  $('#stat-payments').textContent = fmtMoney(totals.totalPayments);
  $('#stat-balance').textContent = fmtMoney(totals.totalBalance);
  $('#stat-low-stock').textContent = lowStock;

  const tbody = $('#recent-sales-body');
  const recent = [...acc.sales].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8);
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">لا توجد حركات بعد.</td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(s => {
    const cust = acc.customers.find(c => c.id === s.customerId);
    return `<tr>
      <td>${escapeHtml(s.date)}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td>${escapeHtml(s.productName)}</td>
      <td>${s.qty}</td>
      <td>${fmtMoney(saleTotal(s))}</td>
    </tr>`;
  }).join('');
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
    const totals = calculateCustomerTotals(c.id);
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.phone || '—')}</td>
      <td>${escapeHtml(c.address || '—')}</td>
      <td><strong>${fmtMoney(totals.balance)}</strong></td>
      <td class="no-print">
        <button class="btn btn-danger btn-sm" data-del-customer="${c.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: المستودع
============================================================ */
function renderInventory() {
  const acc = getActiveAccount();
  if (!acc) return;
  const tbody = $('#inventory-body');
  if (!acc.inventory.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty">لا توجد منتجات. أضف منتجًا للبدء.</td></tr>`;
    return;
  }
  tbody.innerHTML = acc.inventory.map((p, i) => {
    const sold = calculateProductSoldQty(p.id);
    const available = Number(p.qty) - sold;
    const alert = Number(p.alertLevel || 0);
    let badge = '<span class="badge badge-ok">جيد</span>';
    if (available <= 0) badge = '<span class="badge badge-danger">نفد</span>';
    else if (available <= alert) badge = '<span class="badge badge-warn">منخفض</span>';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.type || '—')}</td>
      <td>${escapeHtml(p.unit || '—')}</td>
      <td>${fmtMoney(p.price)}</td>
      <td>${p.qty}</td>
      <td>${sold}</td>
      <td><strong>${available}</strong></td>
      <td>${badge}</td>
      <td class="no-print">
        <button class="btn btn-danger btn-sm" data-del-product="${p.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: الحركات
============================================================ */
function renderSales() {
  const acc = getActiveAccount();
  if (!acc) return;
  populateSelect('#sale-customer', acc.customers.map(c => ({ value: c.id, text: c.name })), 'اختر الزبون');
  populateSelect('#sale-product', acc.inventory.map(p => ({ value: p.id, text: p.name + (p.type ? ` (${p.type})` : '') })), 'اختر المنتج');
  $('#sale-date').value = $('#sale-date').value || todayStr();

  const tbody = $('#sales-body');
  if (!acc.sales.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty">لا توجد حركات بعد.</td></tr>`;
    return;
  }
  const sorted = [...acc.sales].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  tbody.innerHTML = sorted.map((s, i) => {
    const cust = acc.customers.find(c => c.id === s.customerId);
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.date)}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td>${escapeHtml(s.productName)}</td>
      <td>${s.qty}</td>
      <td>${fmtMoney(s.price)}</td>
      <td><strong>${fmtMoney(saleTotal(s))}</strong></td>
      <td class="no-print">
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
  $('#payment-date').value = $('#payment-date').value || todayStr();

  const tbody = $('#payments-body');
  if (!acc.payments.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">لا توجد دفعات بعد.</td></tr>`;
    return;
  }
  const sorted = [...acc.payments].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  tbody.innerHTML = sorted.map((p, i) => {
    const cust = acc.customers.find(c => c.id === p.customerId);
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(p.date)}</td>
      <td>${escapeHtml(cust ? cust.name : '—')}</td>
      <td><strong>${fmtMoney(p.amount)}</strong></td>
      <td>${escapeHtml(p.notes || '—')}</td>
      <td class="no-print">
        <button class="btn btn-danger btn-sm" data-del-payment="${p.id}">حذف</button>
      </td>
    </tr>`;
  }).join('');
}

/* ============================================================
   عرض: التقارير / كشف الحساب
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
  const totals = calculateCustomerTotals(customerId);
  const sales = acc.sales.filter(s => s.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const payments = acc.payments.filter(p => p.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  let html = `
    <div class="report-summary">
      <div class="stat-card"><div class="stat-label">الزبون</div><div class="stat-value" style="font-size:18px">${escapeHtml(cust.name)}</div></div>
      <div class="stat-card"><div class="stat-label">مدين (مبيعات)</div><div class="stat-value">${fmtMoney(totals.debit)}</div></div>
      <div class="stat-card stat-warn"><div class="stat-label">دائن (دفعات)</div><div class="stat-value">${fmtMoney(totals.credit)}</div></div>
      <div class="stat-card stat-danger"><div class="stat-label">المتبقي</div><div class="stat-value">${fmtMoney(totals.balance)}</div></div>
    </div>
  `;

  html += `<h4 class="sub-title">حركات الزبون</h4>`;
  if (!sales.length) {
    html += `<p class="hint">لا توجد حركات.</p>`;
  } else {
    html += `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>التاريخ</th><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
      <tbody>
      ${sales.map(s => `<tr>
        <td>${escapeHtml(s.date)}</td>
        <td>${escapeHtml(s.productName)}</td>
        <td>${s.qty}</td>
        <td>${fmtMoney(s.price)}</td>
        <td>${fmtMoney(saleTotal(s))}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>`;
  }

  html += `<h4 class="sub-title">دفعات الزبون</h4>`;
  if (!payments.length) {
    html += `<p class="hint">لا توجد دفعات.</p>`;
  } else {
    html += `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>التاريخ</th><th>المبلغ</th><th>ملاحظات</th></tr></thead>
      <tbody>
      ${payments.map(p => `<tr>
        <td>${escapeHtml(p.date)}</td>
        <td>${fmtMoney(p.amount)}</td>
        <td>${escapeHtml(p.notes || '—')}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>`;
  }

  box.innerHTML = html;
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
  if (acc.logoData) {
    prev.src = acc.logoData;
  } else {
    prev.removeAttribute('src');
  }
}

/* ============================================================
   تعبئة select
============================================================ */
function populateSelect(selector, options, placeholder) {
  const sel = $(selector);
  const current = sel.value;
  sel.innerHTML = `<option value="">${placeholder || ''}</option>` +
    options.map(o => `<option value="${o.value}">${escapeHtml(o.text)}</option>`).join('');
  if (current && options.some(o => o.value === current)) sel.value = current;
}

/* ============================================================
   حماية بسيطة من HTML
============================================================ */
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
      if (!Array.isArray(parsed.customers) || !Array.isArray(parsed.inventory)
          || !Array.isArray(parsed.sales) || !Array.isArray(parsed.payments)) {
        throw new Error('بنية غير صحيحة');
      }
      if (!confirm('سيتم استبدال بيانات الحساب الحالي بالنسخة المستوردة، هل تريد المتابعة؟')) return;
      updateActiveAccount(a => {
        a.customers = parsed.customers;
        a.inventory = parsed.inventory;
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
  if (!confirm('سيتم حذف جميع بيانات الحساب الحالي (زبائن، حركات، دفعات، مستودع). هل أنت متأكد؟')) return;
  if (!confirm('تأكيد نهائي: هل تريد المتابعة بالحذف؟')) return;
  updateActiveAccount(a => {
    a.customers = [];
    a.inventory = [];
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
  const today = todayStr();
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
        <div class="print-meta">تاريخ الطباعة: ${today}</div>
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
          <td>${fmtMoney(t.balance)}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>العنوان</th><th>المتبقي</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">لا يوجد زبائن.</td></tr>`}</tbody>
      </table>`;
      break;
    }
    case 'view-inventory': {
      title = 'قائمة المستودع';
      const rows = acc.inventory.map((p, i) => {
        const sold = calculateProductSoldQty(p.id);
        const av = Number(p.qty) - sold;
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.type || '—')}</td>
          <td>${escapeHtml(p.unit || '—')}</td>
          <td>${fmtMoney(p.price)}</td>
          <td>${p.qty}</td>
          <td>${sold}</td>
          <td>${av}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>الاسم</th><th>النوع</th><th>الوحدة</th><th>السعر</th><th>المضاف</th><th>المباع</th><th>المتوفر</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="8">لا توجد منتجات.</td></tr>`}</tbody>
      </table>`;
      break;
    }
    case 'view-sales': {
      title = 'سجل الحركات';
      const totals = acc.sales.reduce((s, x) => s + saleTotal(x), 0);
      const rows = acc.sales.map((s, i) => {
        const cust = acc.customers.find(c => c.id === s.customerId);
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(s.date)}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${escapeHtml(s.productName)}</td>
          <td>${s.qty}</td>
          <td>${fmtMoney(s.price)}</td>
          <td>${fmtMoney(saleTotal(s))}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>التاريخ</th><th>الزبون</th><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="7">لا توجد حركات.</td></tr>`}
        <tr class="totals-row"><td colspan="6">الإجمالي العام</td><td>${fmtMoney(totals)}</td></tr>
        </tbody>
      </table>`;
      break;
    }
    case 'view-payments': {
      title = 'سجل الدفعات';
      const totals = acc.payments.reduce((s, x) => s + Number(x.amount || 0), 0);
      const rows = acc.payments.map((p, i) => {
        const cust = acc.customers.find(c => c.id === p.customerId);
        return `<tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(p.date)}</td>
          <td>${escapeHtml(cust ? cust.name : '—')}</td>
          <td>${fmtMoney(p.amount)}</td>
          <td>${escapeHtml(p.notes || '—')}</td>
        </tr>`;
      }).join('');
      body = `<table>
        <thead><tr><th>#</th><th>التاريخ</th><th>الزبون</th><th>المبلغ</th><th>ملاحظات</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">لا توجد دفعات.</td></tr>`}
        <tr class="totals-row"><td colspan="3">إجمالي الدفعات</td><td colspan="2">${fmtMoney(totals)}</td></tr>
        </tbody>
      </table>`;
      break;
    }
  }
  const html = buildPrintTemplate(title, body);
  printArea(html);
}

function printCustomerReport() {
  const acc = getActiveAccount();
  const customerId = $('#report-customer').value;
  if (!acc || !customerId) {
    showToast('اختر زبونًا أولًا.', 'warn');
    return;
  }
  const cust = acc.customers.find(c => c.id === customerId);
  const totals = calculateCustomerTotals(customerId);
  const sales = acc.sales.filter(s => s.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const payments = acc.payments.filter(p => p.customerId === customerId)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  let body = `
    <div style="margin-bottom:10px">
      <strong>الزبون:</strong> ${escapeHtml(cust.name)}
      ${cust.phone ? ' | <strong>الهاتف:</strong> ' + escapeHtml(cust.phone) : ''}
      ${cust.address ? ' | <strong>العنوان:</strong> ' + escapeHtml(cust.address) : ''}
    </div>
    <table>
      <thead><tr><th>مدين (مبيعات)</th><th>دائن (دفعات)</th><th>المتبقي</th></tr></thead>
      <tbody><tr class="totals-row">
        <td>${fmtMoney(totals.debit)}</td>
        <td>${fmtMoney(totals.credit)}</td>
        <td>${fmtMoney(totals.balance)}</td>
      </tr></tbody>
    </table>
    <h4 style="margin-top:14px">الحركات</h4>
    <table>
      <thead><tr><th>التاريخ</th><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
      <tbody>
        ${sales.map(s => `<tr>
          <td>${escapeHtml(s.date)}</td>
          <td>${escapeHtml(s.productName)}</td>
          <td>${s.qty}</td>
          <td>${fmtMoney(s.price)}</td>
          <td>${fmtMoney(saleTotal(s))}</td>
        </tr>`).join('') || `<tr><td colspan="5">لا توجد حركات.</td></tr>`}
      </tbody>
    </table>
    <h4 style="margin-top:14px">الدفعات</h4>
    <table>
      <thead><tr><th>التاريخ</th><th>المبلغ</th><th>ملاحظات</th></tr></thead>
      <tbody>
        ${payments.map(p => `<tr>
          <td>${escapeHtml(p.date)}</td>
          <td>${fmtMoney(p.amount)}</td>
          <td>${escapeHtml(p.notes || '—')}</td>
        </tr>`).join('') || `<tr><td colspan="3">لا توجد دفعات.</td></tr>`}
      </tbody>
    </table>
  `;
  const html = buildPrintTemplate('كشف حساب الزبون', body);
  printArea(html);
}

window.addEventListener('afterprint', cleanupPrintMode);

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

  /* تسجيل الدخول */
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    loginAccount($('#login-email').value, $('#login-password').value);
  });

  /* إنشاء حساب */
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

  /* أزرار "عودة" في شاشة الاستعادة */
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

  /* تسجيل الخروج */
  $('#logout-btn').addEventListener('click', logoutAccount);

  /* القائمة الجانبية */
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

  /* المستودع */
  $('#product-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#product-name').value.trim();
    if (!name) { showToast('أدخل اسم المنتج.', 'warn'); return; }
    updateActiveAccount(a => {
      a.inventory.push({
        id: uid('prod'),
        name,
        type: $('#product-type').value.trim(),
        unit: $('#product-unit').value.trim(),
        price: Number($('#product-price').value) || 0,
        qty: Number($('#product-qty').value) || 0,
        alertLevel: Number($('#product-alert').value) || 0
      });
    });
    e.target.reset();
    $('#product-alert').value = 5;
    showToast('تم حفظ المنتج.', 'success');
    renderInventory();
  });

  /* الحركات */
  const saleProduct = $('#sale-product');
  saleProduct.addEventListener('change', () => {
    const acc = getActiveAccount();
    if (!acc) return;
    const p = acc.inventory.find(x => x.id === saleProduct.value);
    if (!p) {
      $('#sale-product-name').value = '';
      $('#sale-product-type').value = '';
      $('#sale-price').value = '';
      return;
    }
    $('#sale-product-name').value = p.name;
    $('#sale-product-type').value = p.type || '';
    $('#sale-price').value = p.price;
    recalcSaleTotal();
  });
  function recalcSaleTotal() {
    const total = (Number($('#sale-price').value) || 0) * (Number($('#sale-qty').value) || 0);
    $('#sale-total').value = fmtMoney(total);
  }
  $('#sale-price').addEventListener('input', recalcSaleTotal);
  $('#sale-qty').addEventListener('input', recalcSaleTotal);

  $('#sale-form').addEventListener('submit', e => {
    e.preventDefault();
    const acc = getActiveAccount();
    if (!acc) return;
    const customerId = $('#sale-customer').value;
    const productId = $('#sale-product').value;
    if (!customerId) { showToast('اختر زبونًا أولًا.', 'warn'); return; }
    if (!productId) { showToast('اختر منتجًا أو اكتب اسم المنتج.', 'warn'); return; }
    const product = acc.inventory.find(p => p.id === productId);
    if (!product) { showToast('المنتج غير موجود.', 'error'); return; }
    const qty = Number($('#sale-qty').value) || 0;
    const price = Number($('#sale-price').value) || 0;
    if (qty <= 0) { showToast('أدخل كمية صحيحة.', 'warn'); return; }

    const available = calculateProductAvailableQty(product);
    if (qty > available) {
      if (!confirm(`الكمية المتوفرة من "${product.name}" هي ${available} فقط. هل تريد المتابعة؟`)) return;
    }

    updateActiveAccount(a => {
      a.sales.push({
        id: uid('sale'),
        customerId,
        productId,
        productName: product.name,
        productType: product.type || '',
        price,
        qty,
        date: $('#sale-date').value || todayStr(),
        notes: $('#sale-notes').value.trim()
      });
    });
    e.target.reset();
    $('#sale-date').value = todayStr();
    $('#sale-total').value = '';
    showToast('تم حفظ الحركة.', 'success');
    renderSales();
  });

  /* الدفعات */
  $('#payment-form').addEventListener('submit', e => {
    e.preventDefault();
    const customerId = $('#payment-customer').value;
    if (!customerId) { showToast('اختر زبونًا أولًا.', 'warn'); return; }
    const amount = Number($('#payment-amount').value) || 0;
    if (amount <= 0) { showToast('أدخل مبلغًا صحيحًا.', 'warn'); return; }
    updateActiveAccount(a => {
      a.payments.push({
        id: uid('pay'),
        customerId,
        amount,
        date: $('#payment-date').value || todayStr(),
        notes: $('#payment-notes').value.trim()
      });
    });
    e.target.reset();
    $('#payment-date').value = todayStr();
    showToast('تم حفظ الدفعة.', 'success');
    renderPayments();
  });

  /* الحذف من الجداول (event delegation) */
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-del-customer]');
    if (c) {
      const id = c.dataset.delCustomer;
      if (!confirm('سيتم حذف الزبون وجميع حركاته ودفعاته. هل أنت متأكد؟')) return;
      updateActiveAccount(a => {
        a.customers = a.customers.filter(x => x.id !== id);
        a.sales = a.sales.filter(x => x.customerId !== id);
        a.payments = a.payments.filter(x => x.customerId !== id);
      });
      showToast('تم حذف العنصر.', 'success');
      renderCustomers();
      return;
    }
    const p = e.target.closest('[data-del-product]');
    if (p) {
      const id = p.dataset.delProduct;
      if (!confirm('سيتم حذف المنتج وحركاته. هل أنت متأكد؟')) return;
      updateActiveAccount(a => {
        a.inventory = a.inventory.filter(x => x.id !== id);
        a.sales = a.sales.filter(x => x.productId !== id);
      });
      showToast('تم حذف العنصر.', 'success');
      renderInventory();
      return;
    }
    const s = e.target.closest('[data-del-sale]');
    if (s) {
      const id = s.dataset.delSale;
      if (!confirm('حذف الحركة؟')) return;
      updateActiveAccount(a => { a.sales = a.sales.filter(x => x.id !== id); });
      showToast('تم حذف العنصر.', 'success');
      renderSales();
      return;
    }
    const pay = e.target.closest('[data-del-payment]');
    if (pay) {
      const id = pay.dataset.delPayment;
      if (!confirm('حذف الدفعة؟')) return;
      updateActiveAccount(a => { a.payments = a.payments.filter(x => x.id !== id); });
      showToast('تم حذف العنصر.', 'success');
      renderPayments();
      return;
    }
  });

  /* أزرار الطباعة في الأقسام */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-print]');
    if (!btn) return;
    printSection(btn.dataset.print);
  });

  /* التقارير */
  $('#report-customer').addEventListener('change', e => renderReportContent(e.target.value));
  $('#print-report-btn').addEventListener('click', printCustomerReport);

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
    const oldP = $('#old-password').value;
    const newP = $('#new-password').value;
    if (acc.password !== oldP) {
      showToast('كلمة المرور الحالية غير صحيحة.', 'error');
      return;
    }
    updateActiveAccount(a => { a.password = newP; });
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
  if (acc) {
    enterApp();
  } else {
    showScreen('auth-screen');
    switchAuthTab('login');
  }
}

document.addEventListener('DOMContentLoaded', init);
