-- =====================================================
-- Supabase Database Setup for Takatuf Campaign
-- تكاتف: حملة خيرية لدعم مرضى السرطان
-- =====================================================

-- Step 1: Create Tables
-- =====================================================

-- جدول المتبرعين بالدولار
CREATE TABLE donors_usd (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- جدول المتبرعين بالليرة التركية
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

-- =====================================================
-- Step 2: Insert Default Data
-- =====================================================

-- إدراج رسالة ticker الافتراضية
INSERT INTO settings (key, value) 
VALUES ('tickerMessage', 'كل ما تقدمه اليوم يبقى أثره غدًا 💙');

-- =====================================================
-- Step 3: Enable Row Level Security (RLS)
-- =====================================================

ALTER TABLE donors_usd ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors_try ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Step 4: Create Policies for Public Read Access
-- =====================================================

CREATE POLICY "Allow public read access on donors_usd" 
ON donors_usd 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on donors_try" 
ON donors_try 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on payment_methods" 
ON payment_methods 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access on settings" 
ON settings 
FOR SELECT 
USING (true);

-- =====================================================
-- Step 5: Create Policies for Public Write Access
-- ملاحظة: يمكن تقييد هذه لاحقاً بإضافة Authentication
-- =====================================================

-- Insert Policies
CREATE POLICY "Allow public insert on donors_usd" 
ON donors_usd 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert on donors_try" 
ON donors_try 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert on payment_methods" 
ON payment_methods 
FOR INSERT 
WITH CHECK (true);

-- Update Policies
CREATE POLICY "Allow public update on donors_usd" 
ON donors_usd 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public update on donors_try" 
ON donors_try 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public update on payment_methods" 
ON payment_methods 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public update on settings" 
ON settings 
FOR UPDATE 
USING (true);

-- Delete Policies
CREATE POLICY "Allow public delete on donors_usd" 
ON donors_usd 
FOR DELETE 
USING (true);

CREATE POLICY "Allow public delete on donors_try" 
ON donors_try 
FOR DELETE 
USING (true);

CREATE POLICY "Allow public delete on payment_methods" 
ON payment_methods 
FOR DELETE 
USING (true);

-- =====================================================
-- Step 6: Create Indexes for Better Performance (Optional)
-- =====================================================

CREATE INDEX idx_donors_usd_timestamp ON donors_usd(timestamp DESC);
CREATE INDEX idx_donors_try_timestamp ON donors_try(timestamp DESC);
CREATE INDEX idx_donors_usd_amount ON donors_usd(amount DESC);
CREATE INDEX idx_donors_try_amount ON donors_try(amount DESC);

-- =====================================================
-- ✅ Setup Complete!
-- الآن يمكنك استخدام قاعدة البيانات
-- =====================================================

-- للتحقق من أن الجداول تم إنشاؤها بنجاح، شغّل:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public';
