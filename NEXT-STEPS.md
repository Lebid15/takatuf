# 🎯 التعليمات الآن - افعل هذا بالترتيب!

## ✅ تم بنجاح:
- [x] إنشاء مشروع Supabase
- [x] تحديث ملف config.js بمعلومات المشروع

---

## 📋 الخطوة التالية: إنشاء الجداول

### 1. افتح SQL Editor في Supabase
- في لوحة Supabase الموجودة في المتصفح
- من القائمة اليسرى، اضغط على **"SQL Editor"**

### 2. افتح ملف supabase-setup.sql في VS Code
- الملف موجود في مجلد مشروعك

### 3. انسخ كل محتوى الملف
```
Ctrl + A  (لتحديد الكل)
Ctrl + C  (للنسخ)
```

### 4. ارجع لـ SQL Editor في Supabase والصق الكود
```
Ctrl + V  (للصق)
```

### 5. شغّل الكود
- اضغط زر **"Run"** (أعلى يمين المحرر)
- أو اضغط **Ctrl + Enter**

### 6. تحقق من النجاح
- اذهب إلى **"Table Editor"** من القائمة اليسرى
- يجب أن ترى 4 جداول:
  - ✅ donors_usd
  - ✅ donors_try
  - ✅ payment_methods
  - ✅ settings

---

## 🧪 بعد ذلك: اختبار التطبيق

### 1. افتح ملف index.html
- انقر عليه بالزر الأيمن
- اختر **"Open with Live Server"** (إذا مثبت)
- أو افتحه مباشرة في المتصفح

### 2. افتح Developer Console
- اضغط **F12**
- انتقل إلى تبويب **Console**

### 3. تحقق من عدم وجود أخطاء
- يجب أن ترى: `Supabase initialized successfully!`
- **لا يجب** أن ترى أخطاء بالأحمر

### 4. جرّب إضافة متبرع
- افتح **admin.html** في المتصفح
- كلمة المرور: `takatuf2025`
- أضف متبرع جديد
- تحقق من ظهوره في الصفحة الرئيسية

---

## 🚀 إذا كل شيء يعمل: ارفع إلى GitHub

```bash
git add .
git commit -m "Migrate to Supabase"
git push origin main
```

---

## ❌ إذا ظهرت أخطاء:

### خطأ: "Invalid API Key"
- تأكد أن ملف config.js محفوظ
- تأكد من نسخ API Key بالكامل

### خطأ: "Table does not exist"
- لم تشغّل كود SQL بعد
- ارجع للخطوة 2 أعلاه

### خطأ: "Network Error"
- تحقق من اتصال الإنترنت
- تحقق من Project URL صحيح

---

## 📞 تحتاج مساعدة؟
- افتح Developer Console (F12) وانسخ الخطأ
- تحقق من Supabase Dashboard > Logs

---

**🎉 الخطوة الحالية: شغّل كود SQL في Supabase!**
