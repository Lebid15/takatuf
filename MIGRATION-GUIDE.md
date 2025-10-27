# دليل الانتقال من Firebase إلى Supabase

## الخطوة 1: إعداد مشروع Supabase

1. **إنشاء حساب/تسجيل دخول**
   - اذهب إلى https://supabase.com
   - سجل دخول أو أنشئ حساب جديد

2. **إنشاء مشروع جديد**
   - اضغط "New Project"
   - اختر اسم المشروع: `takatuf`
   - اختر كلمة مرور قوية لقاعدة البيانات
   - اختر المنطقة الأقرب لك

3. **نسخ معلومات الاتصال**
   بعد إنشاء المشروع، اذهب إلى Settings > API:
   - انسخ **Project URL** (مثال: `https://xxxxx.supabase.co`)
   - انسخ **anon public key**

---

## الخطوة 2: إنشاء الجداول في قاعدة البيانات

1. افتح **SQL Editor** من القائمة الجانبية
2. انسخ والصق الكود التالي وشغّله:

```sql
-- جدول المتبرعين بالدولار
CREATE TABLE donors_usd (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المتبرعين بالليرة
CREATE TABLE donors_try (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- جدول وسائل الدفع
CREATE TABLE payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  entity_name TEXT,
  contact TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الإعدادات
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج رسالة ticker الافتراضية
INSERT INTO settings (key, value) VALUES ('tickerMessage', 'كل ما تقدمه اليوم يبقى أثره غدًا 💙');

-- تفعيل Row Level Security
ALTER TABLE donors_usd ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors_try ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة للجميع
CREATE POLICY "Allow public read access on donors_usd" ON donors_usd FOR SELECT USING (true);
CREATE POLICY "Allow public read access on donors_try" ON donors_try FOR SELECT USING (true);
CREATE POLICY "Allow public read access on payment_methods" ON payment_methods FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);

-- سياسات الكتابة للجميع
CREATE POLICY "Allow public insert on donors_usd" ON donors_usd FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on donors_try" ON donors_try FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on payment_methods" ON payment_methods FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on donors_usd" ON donors_usd FOR UPDATE USING (true);
CREATE POLICY "Allow public update on donors_try" ON donors_try FOR UPDATE USING (true);
CREATE POLICY "Allow public update on payment_methods" ON payment_methods FOR UPDATE USING (true);
CREATE POLICY "Allow public update on settings" ON settings FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on donors_usd" ON donors_usd FOR DELETE USING (true);
CREATE POLICY "Allow public delete on donors_try" ON donors_try FOR DELETE USING (true);
CREATE POLICY "Allow public delete on payment_methods" ON payment_methods FOR DELETE USING (true);
```

---

## الخطوة 3: تحديث ملف config.js

افتح ملف `config.js` واستبدل القيم التالية:

```javascript
export const SUPABASE_URL = 'https://xxxxx.supabase.co'; // ضع هنا Project URL الخاص بك
export const SUPABASE_ANON_KEY = 'your-anon-key-here'; // ضع هنا anon public key
```

---

## الخطوة 4: تحديث ملفات HTML

### تحديث index.html

**احذف** هذا السطر:
```html
<script type="module" src="script.js"></script>
```

**واستبدله بـ:**
```html
<script type="module" src="script-supabase.js"></script>
```

### تحديث admin.html

**احذف** هذا السطر:
```html
<script type="module" src="script.js"></script>
```

**واستبدله بـ:**
```html
<script type="module" src="script-supabase.js"></script>
```

### تحديث display.html

إذا كان لديك ملف `display.html`، نفس الشيء:
```html
<script type="module" src="script-supabase.js"></script>
```

---

## الخطوة 5: نقل البيانات من Firebase إلى Supabase (اختياري)

إذا كان لديك بيانات في Firebase وتريد نقلها:

### طريقة يدوية:
1. افتح صفحة الإدارة في موقعك الحالي (admin.html)
2. انسخ بيانات المتبرعين
3. بعد تفعيل Supabase، أدخلها من جديد

### طريقة تقنية:
يمكنك تصدير البيانات من Firebase Console بصيغة JSON، ثم استيرادها في Supabase.

---

## الخطوة 6: اختبار التطبيق محلياً

1. افتح `index.html` في متصفحك
2. تأكد من فتح **Developer Console** (F12)
3. تحقق من عدم وجود أخطاء
4. جرّب:
   - عرض المتبرعين
   - الدخول للوحة الإدارة (admin.html)
   - إضافة متبرع جديد
   - إضافة وسيلة دفع

---

## الخطوة 7: رفع التحديثات إلى GitHub Pages

```bash
git add .
git commit -m "Migrate from Firebase to Supabase"
git push origin main
```

---

## ملاحظات هامة

### ⚠️ الأمان
- **لا تضع** معلومات Supabase الحساسة في ملفات عامة
- ملف `config.js` يحتوي على **anon key** وهو آمن للاستخدام العام
- لكن **لا تستخدم** service_role key في الكود العام

### 🔐 تأمين لوحة الإدارة
حالياً كلمة مرور الإدارة موجودة في `admin.html`. في المستقبل يمكن:
- استخدام Supabase Authentication
- إضافة نظام تسجيل دخول حقيقي

### 📊 المميزات الإضافية في Supabase
- **Real-time Updates**: البيانات تتحدث تلقائياً بدون إعادة تحميل
- **Row Level Security**: أمان على مستوى الصفوف
- **SQL Editor**: سهولة التعامل مع البيانات
- **Free Tier**: 500 MB storage + 2 GB bandwidth شهرياً

---

## حل المشاكل الشائعة

### خطأ: CORS error
- تأكد أن Row Level Security مفعّل
- تأكد من Policies صحيحة

### خطأ: البيانات لا تظهر
- افتح Developer Console وتحقق من الأخطاء
- تأكد من صحة SUPABASE_URL و ANON_KEY

### خطأ: لا يمكن الإضافة/التعديل
- تحقق من policies الكتابة في الجداول
- تأكد من أن INSERT/UPDATE policies موجودة

---

## الدعم
إذا واجهت أي مشاكل:
1. تحقق من Developer Console (F12)
2. راجع Supabase Logs في Dashboard
3. تأكد من تنفيذ جميع خطوات SQL بنجاح

---

## الملفات المستخدمة

| الملف | الوصف |
|-------|-------|
| `config.js` | إعدادات الاتصال بـ Supabase |
| `script-supabase.js` | الكود الجديد المتوافق مع Supabase |
| `script.js` | الكود القديم (Firebase) - يمكن حذفه لاحقاً |

---

✅ **بعد إكمال جميع الخطوات، سيعمل موقعك على Supabase بشكل كامل!**
