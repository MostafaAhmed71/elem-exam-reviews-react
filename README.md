# elem-exam-reviews-react

منصة **المراجعات النهائية لابتدائية نخبة الشمال الأهلية** — نظام مراجعات نهائي مبسط لطلاب الابتدائية: اختيار الصف + نوع المراجعة + المادة، مع رفع المواد من الأدمن.

> الاسم المقترح: **`elem-exam-reviews-react`**
> المجلد الحالي: `E:\elem exam`
> آخر تعديل: **2026-02-21**

---

## 🎯 الهدف من المشروع

منصة مراجعات للابتدائية — **النسخة المبسطة من `exam-reviews-platform-react`** (اللي هو للمتوسطة/الثانوية). الفرق: مفيش اختبارات إلكترونية، فيديوهات، أو بث مباشر — بس رفع وعرض مواد.

### صفحات الطلاب
1. **WelcomeScreen** — ترحيب + قبول الشروط.
2. **TermsScreen** — شروط الاستخدام.
3. **GradeSelection** — اختيار الصف (1-6).
4. **ReviewTypeSelection** — نوع المراجعة (فيديو / مواد / اختبارات).
5. **SubjectSelection** — اختيار المادة.

### صفحات الأدمن (عبر `#admin` أو `#admin-panel`)
1. **AdminUpload** — رفع مواد جديدة.
2. **MaterialsManagement** — إدارة كل المواد المرفوعة.

---

## 🛠️ التقنيات المستخدمة

### Core
- **React 19.2** + **TypeScript 5.9**
- **Vite 7.2** (build tool)
- **Nanostores 1.1** + **@nanostores/react 1.0** (state management)
- **React Router DOM 7.10** (للـ admin routes)

### UI
- **Tailwind CSS** (عبر index.css)
- **Framer Motion 12** (animations)
- **Supabase JS 2.87** (Backend)

### State Management
- **state-driven navigation** مش router-based — الـ `currentScreen` nanostore بيحدد الـ view الحالي.

---

## 📦 هيكل المشروع

```
elem exam/
├── src/
│   ├── App.tsx                      # Root — state-driven router
│   ├── main.tsx
│   ├── lib/
│   │   └── navigation.ts            # nanostores + admin access check
│   ├── pages/
│   │   ├── WelcomeScreen.tsx
│   │   ├── TermsScreen.tsx
│   │   ├── GradeSelection.tsx
│   │   ├── ReviewTypeSelection.tsx
│   │   ├── SubjectSelection.tsx
│   │   ├── AdminUpload.tsx
│   │   └── MaterialsManagement.tsx
│   ├── components/
│   ├── services/                    # Supabase queries
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── index.css
├── public/
├── dist/                            # Build output
├── dist.zip                         # Archived build
├── dummy/                           # بيانات تجريبية
├── database/                        # SQL dumps
├── hostinger/                       # Static build للـ Hostinger
├── SubjectSelection.css
├── SubjectSelection.tsx
├── supabase-schema.sql
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Admin Access
```tsx
// App.tsx — admin via URL hash
useEffect(() => {
  const checkAdminAccess = () => {
    if (window.location.hash === '#admin' || window.location.hash === '#admin-panel') {
      navigateToAdmin();
    }
  };
  ...
}, []);
```

---

## 🚀 طريقة التشغيل

### 1) المتطلبات
- Node.js 20+
- حساب Supabase

### 2) إعداد Supabase
1. أنشئ مشروع على [supabase.com](https://supabase.com).
2. شغّل `supabase-schema.sql` على SQL Editor.
3. (اختياري) ضيف بيانات تجريبية من `dummy/`.

### 3) متغيرات البيئة
أنشئ `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4) Development
```bash
cd "E:\elem exam"
npm install
npm run dev      # http://localhost:5173
```

### 5) Production Build
```bash
npm run build       # → dist/
npm run preview     # معاينة محلية
```

### 6) Deploy
- **Hostinger**: ارفع محتويات `dist/` على `public_html/`.
- **Netlify**: اربط الـ repo — build settings افتراضية.

---

## 📝 أوامر مفيدة

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | TypeScript + Vite build |
| `npm run preview` | معاينة build |
| `npm run lint` | ESLint check |

### Admin URLs
- `https://yourdomain.com/#admin`
- `https://yourdomain.com/#admin-panel`

---

## 📅 آخر تعديل

**2026-02-21**

---

## ⚠️ ملاحظات مهمة

- **العنوان**: "منصة المراجعات النهائية - ابتدائية نخبة الشمال الأهلية".
- **state-driven navigation** — الـ URL مش بيتغير مع كل شاشة. ده أبسط لكن مش SEO-friendly.
- **`dist.zip` متضمن** في الريبو (build قديم). ممكن يتشال من Git.
- **`SubjectSelection.tsx` و `SubjectSelection.css`** في الـ root — غريب، المفروض يكونوا في `src/`.
- **مفيش اختبارات إلكترونية** (مش زي `mohamad exam`) — ده نسخة مبسطة للابتدائية.
- **مفيش auth قوي** — الأدمن بيدخل بـ hash بس (`#admin`). للـ production محتاج ProperAuth.
- **`ADMIN_SETUP.md` و `ADMIN_ACCESS.md`** متضمنة في الـ root (تفاصيل صلاحيات الأدمن).
- **`BROCHURE_PROMPT.md`** فيه prompt لتوليد brochure.
- **`DESIGN_SYSTEM.md`** فيه design tokens.
- **Vite 7 + React 19** — أحدث الإصدارات (المشروع محدّث).
- **`dummy/`** فيه بيانات اختبارية — مفيد للـ testing.
- **`hostinger/`** فيه build جاهز للـ deployment.