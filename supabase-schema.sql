-- ============================================
-- منصة المراجعات النهائية - Supabase Schema
-- نفّذ هذا الملف في SQL Editor لمشروع Supabase الجديد
-- ============================================

-- حذف الجدول إذا كان موجوداً (لإعادة الإنشاء من الصفر فقط - احذف هذا السطر في الإنتاج)
-- DROP TABLE IF EXISTS uploaded_materials CASCADE;

-- ============================================
-- 1. إنشاء جدول المواد المرفوعة
-- ============================================
CREATE TABLE IF NOT EXISTS public.uploaded_materials (
    id BIGSERIAL PRIMARY KEY,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 6),
    subject_name TEXT NOT NULL,
    review_type TEXT NOT NULL CHECK (review_type IN ('schedule', 'solved', 'unsolved')),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size >= 0),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. التعليق على الجدول والأعمدة
-- ============================================
COMMENT ON TABLE public.uploaded_materials IS 'المواد الدراسية المرفوعة (مراجعات، جداول اختبارات)';
COMMENT ON COLUMN public.uploaded_materials.grade IS 'رقم الصف من 1 إلى 6';
COMMENT ON COLUMN public.uploaded_materials.subject_name IS 'اسم المادة (مثال: رياضيات، جدول الاختبارات)';
COMMENT ON COLUMN public.uploaded_materials.review_type IS 'نوع المراجعة: schedule=جدول، solved=محلولة، unsolved=غير محلولة';
COMMENT ON COLUMN public.uploaded_materials.file_url IS 'رابط الملف على Hostinger';
COMMENT ON COLUMN public.uploaded_materials.uploaded_at IS 'تاريخ ووقت الرفع';

-- ============================================
-- 3. إنشاء فهارس لتسريع الاستعلامات
-- ============================================
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_grade ON public.uploaded_materials(grade);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_review_type ON public.uploaded_materials(review_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_grade_type ON public.uploaded_materials(grade, review_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_materials_uploaded_at ON public.uploaded_materials(uploaded_at DESC);

-- ============================================
-- 4. تفعيل Row Level Security (RLS)
-- ============================================
ALTER TABLE public.uploaded_materials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. سياسات الوصول (للاستخدام العام دون مصادقة)
-- ============================================

-- حذف السياسات إن وجدت (لإعادة التشغيل)
DROP POLICY IF EXISTS "السماح بالقراءة للجميع" ON public.uploaded_materials;
DROP POLICY IF EXISTS "السماح بالإضافة للجميع" ON public.uploaded_materials;
DROP POLICY IF EXISTS "السماح بالتحديث للجميع" ON public.uploaded_materials;
DROP POLICY IF EXISTS "السماح بالحذف للجميع" ON public.uploaded_materials;

-- السماح للجميع بقراءة جميع السجلات
CREATE POLICY "السماح بالقراءة للجميع"
    ON public.uploaded_materials
    FOR SELECT
    USING (true);

-- السماح للجميع بإضافة سجلات جديدة
CREATE POLICY "السماح بالإضافة للجميع"
    ON public.uploaded_materials
    FOR INSERT
    WITH CHECK (true);

-- السماح للجميع بتحديث السجلات
CREATE POLICY "السماح بالتحديث للجميع"
    ON public.uploaded_materials
    FOR UPDATE
    USING (true);

-- السماح للجميع بحذف السجلات
CREATE POLICY "السماح بالحذف للجميع"
    ON public.uploaded_materials
    FOR DELETE
    USING (true);

-- ============================================
-- 6. تفعيل Realtime للتحديثات الفورية
-- (التطبيق يستمع للتغييرات في SubjectSelection)
-- ملاحظة: إذا ظهر خطأ "already member" تجاهله
-- أو فعّل من: Database > Replication > uploaded_materials
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.uploaded_materials;

-- ============================================
-- 7. منح الصلاحيات
-- ============================================
GRANT ALL ON public.uploaded_materials TO anon;
GRANT ALL ON public.uploaded_materials TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.uploaded_materials_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.uploaded_materials_id_seq TO authenticated;

-- ============================================
-- انتهى - تم إنشاء قاعدة البيانات بنجاح
-- ============================================
