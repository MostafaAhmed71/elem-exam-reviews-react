# دليل إعداد شاشة المدير

## نظرة عامة

تم إنشاء شاشة منفصلة للمدير لرفع المواد الدراسية. الملفات تُرفع إلى Hostinger والروابط تُحفظ في Supabase.

## خطوات الإعداد

### 1. إعداد قاعدة البيانات (Supabase)

قم بتنفيذ ملف SQL التالي في Supabase:

```bash
database/uploaded_materials.sql
```

هذا سينشئ جدول `uploaded_materials` مع جميع الفهارس والسياسات المطلوبة.

### 2. رفع ملف PHP إلى Hostinger

1. قم برفع ملف `hostinger/upload.php` إلى سيرفر Hostinger
2. **مهم جداً**: قم بتحديث الرابط في السطر 27:
   ```php
   define('BASE_URL', 'https://your-domain.com/uploads/materials/');
   ```
   استبدل `your-domain.com` بدومين موقعك الفعلي

3. تأكد من أن المجلد `uploads/materials/` له صلاحيات الكتابة (755)

### 3. تحديث رابط API في التطبيق

افتح ملف `src/services/uploadService.ts` وقم بتحديث السطر 6:

```typescript
const UPLOAD_API_URL = 'https://your-domain.com/upload.php';
```

استبدل `your-domain.com` برابط ملف upload.php على Hostinger

## الوصول إلى شاشة المدير

### الطريقة 1: عبر Console المتصفح

1. افتح التطبيق في المتصفح
2. افتح Developer Console (F12)
3. اكتب الأمر التالي:
   ```javascript
   import('./src/lib/navigation.js').then(m => m.navigateToAdmin())
   ```

### الطريقة 2: إضافة زر في الواجهة

يمكنك إضافة زر مخفي في أي شاشة للانتقال لشاشة المدير:

```tsx
import { navigateToAdmin } from '../lib/navigation';

// في أي component
<button onClick={navigateToAdmin}>Admin</button>
```

### الطريقة 3: URL مباشر (يتطلب تعديل)

يمكنك إضافة route مباشر عبر تعديل `App.tsx` لدعم URL parameters.

## استخدام شاشة المدير

### رفع ملف جديد

1. اختر الصف (1-6)
2. أدخل اسم المادة (مثال: الرياضيات)
3. اسحب الملف أو انقر لاختياره
4. انقر "رفع الملف"

### أنواع الملفات المدعومة

- PDF (.pdf)
- Word (.doc, .docx)
- PowerPoint (.ppt, .pptx)

### الحد الأقصى لحجم الملف

50 ميجابايت

## عرض الملفات في واجهة ولي الأمر

الملفات المرفوعة ستظهر تلقائياً في واجهة ولي الأمر عند:

1. اختيار الصف المناسب
2. اختيار نوع المراجعة
3. اختيار المادة

سيتم جلب الملفات من جدول `uploaded_materials` في Supabase بناءً على الصف واسم المادة.

## استكشاف الأخطاء

### خطأ: "Supabase غير متصل"

- تأكد من إعداد متغيرات البيئة في `.env`:
  ```
  VITE_SUPABASE_URL=your-supabase-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

### خطأ: "فشل الاتصال بالسيرفر"

- تأكد من رابط `UPLOAD_API_URL` صحيح
- تأكد من رفع `upload.php` على Hostinger
- تأكد من تفعيل CORS في ملف PHP

### خطأ: "فشل حفظ الملف"

- تأكد من صلاحيات المجلد على Hostinger (755)
- تأكد من وجود مساحة كافية على السيرفر

### الملف يُرفع لكن لا يظهر في واجهة ولي الأمر

- تأكد من تنفيذ ملف SQL في Supabase
- تأكد من أن اسم المادة مطابق في الرفع والعرض
- تحقق من جدول `uploaded_materials` في Supabase

## الأمان

### توصيات مهمة:

1. **إضافة مصادقة**: حالياً الشاشة بدون حماية، يُنصح بإضافة:
   - كلمة مرور
   - أو Supabase Authentication
   - أو IP whitelist

2. **تحديث CORS**: في `upload.php`، قم بتحديد الدومين المسموح:
   ```php
   header('Access-Control-Allow-Origin: https://your-app-domain.com');
   ```

3. **تفعيل HTTPS**: تأكد من استخدام HTTPS لكل من التطبيق وملف PHP

## الصيانة

### عرض سجل الرفوعات

يتم حفظ سجل بسيط في `upload_log.txt` على Hostinger

### حذف ملفات قديمة

يمكنك إنشاء script PHP لحذف الملفات القديمة:

```php
// cleanup.php
$daysOld = 365; // حذف الملفات الأقدم من سنة
// ... implementation
```

## الدعم الفني

للمساعدة أو الاستفسارات، راجع:
- [Supabase Documentation](https://supabase.com/docs)
- [PHP File Upload Guide](https://www.php.net/manual/en/features.file-upload.php)
