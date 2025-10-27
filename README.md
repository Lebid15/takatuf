# 🤲 تكاتف - حملة خيرية

## 📌 نظرة عامة

**تكاتف** هو موقع خيري احترافي لدعم مرضى السرطان، مصمم بتقنيات حديثة ومؤثرة:

- ✨ تصميم Glass Morphism مع تأثيرات نيون
- 💚 واجهة مؤثرة وحزينة تحفز التبرع
- 📱 متجاوب بالكامل مع الجوال
- 🔥 Firebase Realtime Database
- 🎯 3 صفحات: عامة، أدمن، شاشة بروجكتور

---

## 🚀 التثبيت والنشر على GitHub Pages

### الخطوة 1: إعداد Firebase

1. **إنشاء مشروع Firebase:**
   - اذهب إلى [Firebase Console](https://console.firebase.google.com/)
   - اضغط "إضافة مشروع" (Add Project)
   - اختر اسم المشروع: `takatuf-campaign`

2. **تفعيل Realtime Database:**
   - من القائمة الجانبية → Build → Realtime Database
   - اضغط "Create Database"
   - اختر المنطقة: `us-central1` (أو الأقرب لك)
   - اختر الوضع: **Test Mode** (للبداية)

3. **تفعيل Storage:**
   - من القائمة الجانبية → Build → Storage
   - اضغط "Get Started"
   - اختر **Test Mode**

4. **الحصول على Firebase Config:**
   - من إعدادات المشروع (⚙️) → أسفل الصفحة → "Your apps"
   - اضغط على أيقونة الويب `</>`
   - انسخ كائن `firebaseConfig`

5. **تحديث ملف `script.js`:**
   ```javascript
   const firebaseConfig = {
       apiKey: "AIza...",           // ضع API Key الخاص بك
       authDomain: "takatuf-...",
       databaseURL: "https://takatuf-...",
       projectId: "takatuf-campaign",
       storageBucket: "takatuf-...",
       messagingSenderId: "...",
       appId: "..."
   };
   ```

---

### الخطوة 2: رفع على GitHub

1. **إنشاء Repository جديد:**
   ```bash
   # في GitHub، اضغط "New Repository"
   # الاسم: takatuf
   # Public ✅
   ```

2. **رفع الملفات:**
   ```bash
   # في مجلد takatuf المحلي
   git init
   git add .
   git commit -m "Initial commit: Takatuf charity campaign"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/takatuf.git
   git push -u origin main
   ```

3. **تفعيل GitHub Pages:**
   - اذهب إلى Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - اضغط Save

4. **الموقع جاهز!**
   ```
   https://YOUR_USERNAME.github.io/takatuf/
   ```

---

### الخطوة 3: ربط دومين مخصص (اختياري)

1. **شراء دومين:**
   - من Namecheap، GoDaddy، أو أي مزود

2. **إعدادات DNS:**
   - أضف هذه السجلات في إعدادات DNS:
   ```
   Type: CNAME
   Host: www
   Value: YOUR_USERNAME.github.io
   
   Type: A
   Host: @
   Values:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. **في GitHub:**
   - Settings → Pages → Custom domain
   - أدخل: `takatuf.com`
   - انتظر التحقق (5-10 دقائق)
   - فعّل "Enforce HTTPS" ✅

---

## 📄 بنية المشروع

```
takatuf/
├── index.html          # الصفحة العامة (للزوار)
├── admin.html          # لوحة الإدارة
├── display.html        # شاشة البروجكتور (عرض حي)
├── styles.css          # التصميم الكامل
├── script.js           # Firebase + التفاعل
└── README.md           # هذا الملف
```

---

## 🎯 الصفحات

### 1️⃣ الصفحة العامة (`index.html`)
- عرض مجموع التبرعات (دولار + ليرة تركية)
- صور الحملة (3 صور)
- آيات قرآنية وأحاديث
- وسائل الدفع (بايبال، IBAN، واتساب)

**الرابط:**
```
https://YOUR_USERNAME.github.io/takatuf/index.html
```

---

### 2️⃣ لوحة الإدارة (`admin.html`)

**كلمة المرور الافتراضية:** `takatuf2025`

**المميزات:**
- إضافة/تعديل/حذف المتبرعين (دولار + ليرة)
- إدارة وسائل الدفع
- رفع الشعار (PNG/JPEG)
- رفع 3 صور للحملة
- تعديل رسالة الإعلان المتحرك

**الرابط:**
```
https://YOUR_USERNAME.github.io/takatuf/admin.html
```

**تغيير كلمة المرور:**
- افتح `admin.html`
- ابحث عن: `const ADMIN_PASSWORD = "takatuf2025";`
- غيّرها إلى أي كلمة مرور تريدها

---

### 3️⃣ شاشة البروجكتور (`display.html`)

**للعرض على الشاشات الكبيرة!**

**المميزات:**
- خلفية متحركة مع تأثيرات نيون
- أعلى 10 متبرعين (دولار + ليرة)
- الإجماليات الحية (تتحدث كل 5 ثواني)
- Ticker متحرك
- تصميم مؤثر للغاية

**الرابط:**
```
https://YOUR_USERNAME.github.io/takatuf/display.html
```

**استخدام:**
1. افتح الرابط على الحاسوب
2. اضغط F11 (Full Screen)
3. وصّل الحاسوب بالبروجكتور
4. البيانات تتحدث تلقائياً!

---

## 🔐 قواعد الأمان في Firebase

**مهم جداً!** بعد الانتهاء من الاختبار، غيّر قواعد Firebase:

### Realtime Database Rules:
```json
{
  "rules": {
    ".read": true,
    ".write": false,
    "donors": {
      ".write": "auth != null"
    },
    "paymentMethods": {
      ".write": "auth != null"
    },
    "settings": {
      ".write": "auth != null"
    }
  }
}
```

### Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allImages=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 💡 نصائح للاستخدام

### للأدمن:
1. سجّل الدخول أولاً
2. ارفع الشعار والصور من تاب "الإعدادات"
3. أضف وسائل الدفع
4. ابدأ بإضافة المتبرعين

### للعرض الحي:
1. افتح `display.html` على حاسوب منفصل
2. Full Screen (F11)
3. لا تغلق الصفحة - ستتحدث تلقائياً!

### للزوار:
1. شارك رابط `index.html` مع الجمهور
2. سيرون البيانات الحية
3. يمكنهم نسخ معلومات الدفع مباشرة

---

## 🎨 التخصيص

### تغيير الألوان:
افتح `styles.css` → `:root`:
```css
--neon-cyan: #00fff2;     /* اللون الرئيسي */
--neon-blue: #0099ff;     /* اللون الثانوي */
--warm-gold: #ffd700;     /* لون الآيات */
```

### تغيير الخطوط:
```css
body {
    font-family: 'Cairo', 'Segoe UI', sans-serif;
}
```

ثم أضف في `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&display=swap" rel="stylesheet">
```

---

## 🐛 حل المشاكل

### المشكلة: الصفحة لا تعرض البيانات
**الحل:**
1. تأكد من تحديث `firebaseConfig` في `script.js`
2. تأكد من تفعيل Realtime Database في Firebase Console
3. افتح Console في المتصفح (F12) وابحث عن الأخطاء

---

### المشكلة: لا أستطيع رفع الصور
**الحل:**
1. تأكد من تفعيل Storage في Firebase Console
2. تحقق من قواعد Storage (يجب أن تكون Test Mode للبداية)
3. حجم الصورة يجب أن يكون أقل من 5MB

---

### المشكلة: GitHub Pages لا يعرض الموقع
**الحل:**
1. تأكد من رفع جميع الملفات
2. انتظر 5-10 دقائق بعد التفعيل
3. الرابط يجب أن يكون: `username.github.io/takatuf/index.html`
4. تأكد من وجود ملف `index.html` في الجذر

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. **افحص Browser Console:**
   - اضغط F12 → Console
   - ابحث عن رسائل الخطأ

2. **افحص Firebase Console:**
   - تحقق من البيانات في Realtime Database
   - تحقق من الصور في Storage

3. **تأكد من الروابط:**
   - Firebase Config صحيح
   - GitHub Pages مفعّل

---

## ✅ قائمة التحقق قبل النشر

- [ ] تم تحديث Firebase Config في `script.js`
- [ ] تم تفعيل Realtime Database
- [ ] تم تفعيل Storage
- [ ] تم رفع الشعار والصور من الأدمن
- [ ] تم إضافة وسائل الدفع
- [ ] تم اختبار الصفحات الثلاث
- [ ] تم رفع الملفات على GitHub
- [ ] تم تفعيل GitHub Pages
- [ ] تم اختبار الموقع المنشور

---

## 🎉 جاهز!

موقعك الخيري الآن جاهز ومنشور!

**روابط مفيدة:**
- Firebase Console: https://console.firebase.google.com/
- GitHub Pages: https://pages.github.com/
- دليل Firebase: https://firebase.google.com/docs

**بالتوفيق في حملتك الخيرية! 🤲💚**

---

**آخر تحديث:** 26 أكتوبر 2025  
**النسخة:** 1.0
