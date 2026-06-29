# دليل التصميم والمؤثرات الشامل

## جدول المحتويات
1. [الألوان والثيمات](#الألوان-والثيمات)
2. [الخطوط والطباعة](#الخطوط-والطباعة)
3. [المسافات والحدود](#المسافات-والحدود)
4. [الظلال والتأثيرات](#الظلال-والتأثيرات)
5. [الأنيميشن والتأثيرات الحركية](#الأنيميشن-والتأثيرات-الحركية)
6. [المكونات الأساسية](#المكونات-الأساسية)
7. [التأثيرات الخاصة](#التأثيرات-الخاصة)
8. [الخلفيات والأنماط](#الخلفيات-والأنماط)
9. [التصميم المتجاوب](#التصميم-المتجاوب)

---

## الألوان والثيمات

### الألوان الأساسية

```css
/* الألوان الأساسية */
--primary-color: #3b82f6;        /* أزرق أساسي */
--accent-color: #fbbf24;         /* ذهبي/أصفر */
--text-primary: #ffffff;          /* نص أساسي */
--text-secondary: rgba(255, 255, 255, 0.7); /* نص ثانوي */
--bg-surface: rgba(25, 48, 100, 0.8); /* خلفية السطوح */
--color-light-gray: rgba(255, 255, 255, 0.1);
```

### الألوان المستخدمة في التصميم

```css
/* ألوان ذهبية/صفراء */
#fbbf24    /* ذهبي فاتح - للعناوين والأزرار المهمة */
#f59e0b    /* ذهبي متوسط */
rgba(251, 191, 36, 0.2)  /* ذهبي شفاف */
rgba(245, 158, 11, 0.2)  /* ذهبي شفاف متوسط */

/* ألوان زرقاء */
#3b82f6    /* أزرق أساسي */
#60a5fa    /* أزرق فاتح */
rgba(59, 130, 246, 0.2)  /* أزرق شفاف */
rgba(59, 130, 246, 0.3)  /* أزرق شفاف متوسط */

/* ألوان نجاح/خطأ */
#10b981    /* أخضر للنجاح */
#ef4444    /* أحمر للخطأ */
rgba(16, 185, 129, 0.2)  /* أخضر شفاف */
rgba(239, 68, 68, 0.2)   /* أحمر شفاف */

/* ألوان رمادية */
#6b7280    /* رمادي */
rgba(107, 114, 128, 0.2)  /* رمادي شفاف */
```

---

## الخطوط والطباعة

### أحجام الخطوط

```css
/* العناوين */
font-size: 2.5rem;    /* عنوان رئيسي كبير */
font-size: 2rem;      /* عنوان رئيسي */
font-size: 1.8rem;    /* عنوان كبير */
font-size: 1.5rem;    /* عنوان متوسط */
font-size: 1.3rem;    /* عنوان صغير */
font-size: 1.2rem;    /* عنوان صغير جداً */

/* النصوص */
font-size: 1.1rem;    /* نص كبير */
font-size: 1rem;      /* نص عادي */
font-size: 0.95rem;   /* نص صغير */
font-size: 0.9rem;    /* نص صغير جداً */
font-size: 0.85rem;   /* نص صغير للغاية */
```

### أوزان الخطوط

```css
font-weight: 800;     /* ثقيل جداً - للعناوين الرئيسية */
font-weight: 700;     /* ثقيل - للعناوين */
font-weight: 600;     /* متوسط ثقيل - للنصوص المهمة */
font-weight: 500;     /* متوسط - للنصوص العادية */
```

---

## المسافات والحدود

### المسافات (Padding & Margin)

```css
/* Padding */
padding: 0.5rem;      /* صغير */
padding: 1rem;        /* عادي */
padding: 1.5rem;      /* متوسط */
padding: 2rem;        /* كبير */
padding: 2.5rem;      /* كبير جداً */
padding: 3rem;        /* كبير للغاية */

/* Margin */
margin-bottom: 0.5rem;
margin-bottom: 1rem;
margin-bottom: 1.5rem;
margin-bottom: 2rem;
margin-bottom: 3rem;
```

### الحدود (Border Radius)

```css
--radius-sm: 0.375rem;    /* صغير */
--radius-md: 0.5rem;      /* متوسط */
--radius-lg: 0.75rem;     /* كبير */
--radius-xl: 1rem;        /* كبير جداً */
border-radius: 50%;       /* دائري كامل */
```

### الحدود (Borders)

```css
/* حدود عادية */
border: 1px solid rgba(255, 255, 255, 0.08);
border: 2px solid rgba(255, 255, 255, 0.1);

/* حدود ملونة */
border: 2px solid rgba(251, 191, 36, 0.3);
border: 2px solid rgba(59, 130, 246, 0.3);

/* حدود زجاجية */
--glass-border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## الظلال والتأثيرات

### الظلال الأساسية

```css
/* ظلال خفيفة */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

/* ظلال متوسطة */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);

/* ظلال قوية */
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### ظلال ملونة

```css
/* ظلال ذهبية */
box-shadow: 
    0 0 20px rgba(251, 191, 36, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.3);

/* ظلال زرقاء */
box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.4),
    0 0 20px rgba(59, 130, 246, 0.2);

/* ظلال متعددة الطبقات */
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(251, 191, 36, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### تأثيرات النص (Text Shadows)

```css
/* توهج ذهبي */
text-shadow: 
    0 0 20px rgba(251, 191, 36, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.3);

/* توهج قوي */
text-shadow: 
    0 0 30px rgba(251, 191, 36, 0.8),
    0 2px 15px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(251, 191, 36, 0.3);
```

---

## الأنيميشن والتأثيرات الحركية

### الأنيميشن الأساسية

#### 1. الدوران (Spin)

```css
@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-spinner {
    animation: spin 1s linear infinite;
}
```

#### 2. الانزلاق من الأعلى (Slide In Down)

```css
@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.element {
    animation: slideInDown 0.6s ease-out;
}
```

#### 3. الانزلاق من الأسفل (Slide In Up)

```css
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.element {
    animation: slideInUp 0.6s ease-out;
}
```

#### 4. الانزلاق من الجانب (Slide In)

```css
@keyframes questionSlideIn {
    from {
        opacity: 0;
        transform: translateX(50px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

.question-item {
    animation: questionSlideIn 0.5s ease-out;
}
```

### أنيميشن التأثيرات البصرية

#### 5. التوهج (Glow)

```css
@keyframes titleGlow {
    from {
        text-shadow: 
            0 0 20px rgba(251, 191, 36, 0.5),
            0 2px 10px rgba(0, 0, 0, 0.3);
    }
    to {
        text-shadow: 
            0 0 30px rgba(251, 191, 36, 0.8),
            0 2px 15px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(251, 191, 36, 0.3);
    }
}

.title {
    animation: titleGlow 2s ease-in-out infinite alternate;
}
```

#### 6. اللمعان (Shine)

```css
@keyframes shine {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

.element::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(251, 191, 36, 0.1),
        transparent
    );
    animation: shine 3s infinite;
}
```

#### 7. التدفق (Flow)

```css
@keyframes borderFlow {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

.element {
    background: linear-gradient(
        90deg,
        #3b82f6,
        #60a5fa,
        #fbbf24,
        #f59e0b
    );
    background-size: 200% 100%;
    animation: borderFlow 3s infinite;
}
```

#### 8. القفز (Bounce)

```css
@keyframes questionIconBounce {
    0%, 100% {
        transform: translateY(-50%) rotate(0deg);
    }
    25% {
        transform: translateY(-50%) rotate(-10deg);
    }
    75% {
        transform: translateY(-50%) rotate(10deg);
    }
}

.icon {
    animation: questionIconBounce 2s infinite;
}
```

#### 9. تدفق شريط التقدم (Progress Flow)

```css
@keyframes progressShine {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

@keyframes progressFlow {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

.progress-bar-fill {
    background: linear-gradient(
        90deg,
        #3b82f6,
        #60a5fa,
        #fbbf24,
        #f59e0b
    );
    background-size: 200% 100%;
    animation: progressShine 2s infinite;
}

.progress-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: progressFlow 2s infinite;
}
```

#### 10. تحريك الخلفية (Background Shift)

```css
@keyframes backgroundShift {
    0%, 100% {
        opacity: 0.5;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.1);
    }
}

.background {
    animation: backgroundShift 20s ease-in-out infinite;
}
```

---

## المكونات الأساسية

### 1. الأزرار (Buttons)

#### زر أساسي (Primary)

```css
.button-primary {
    background: linear-gradient(135deg, #3b82f6, #fbbf24);
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-lg);
    font-weight: 700;
    box-shadow: 
        0 8px 25px rgba(251, 191, 36, 0.4),
        0 0 40px rgba(59, 130, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-primary:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
        0 12px 35px rgba(251, 191, 36, 0.5),
        0 0 50px rgba(59, 130, 246, 0.4);
}

.button-primary:active {
    transform: translateY(-1px) scale(1.02);
}
```

#### زر ثانوي (Secondary)

```css
.button-secondary {
    background: rgba(59, 130, 246, 0.2);
    border: 2px solid rgba(59, 130, 246, 0.3);
    color: #60a5fa;
    padding: 1rem 2rem;
    border-radius: var(--radius-lg);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-secondary:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(251, 191, 36, 0.6);
    color: #fbbf24;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
        0 8px 25px rgba(251, 191, 36, 0.3),
        0 0 30px rgba(59, 130, 246, 0.2);
}
```

#### تأثير Ripple

```css
.button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.button:hover::before {
    width: 400px;
    height: 400px;
}
```

### 2. البطاقات (Cards)

#### بطاقة عادية

```css
.card {
    background: var(--bg-surface);
    backdrop-filter: var(--glass-blur);
    border: var(--glass-border);
    border-radius: var(--radius-xl);
    padding: 2rem;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(251, 191, 36, 0.2);
}
```

#### بطاقة محسنة (Enhanced)

```css
.card-enhanced {
    background: var(--bg-surface);
    backdrop-filter: var(--glass-blur);
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: var(--radius-xl);
    padding: 2rem;
    box-shadow: 
        var(--shadow-lg),
        0 0 30px rgba(251, 191, 36, 0.2),
        0 0 60px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.card-enhanced::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
        90deg,
        #3b82f6,
        #60a5fa,
        #fbbf24,
        #f59e0b
    );
    background-size: 200% 100%;
    animation: borderFlow 3s infinite;
}
```

### 3. حقول الإدخال (Input Fields)

#### حقل نصي عادي

```css
.input-field {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-field:focus {
    outline: none;
    border-color: rgba(251, 191, 36, 0.6);
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 
        0 0 0 4px rgba(251, 191, 36, 0.2),
        0 0 20px rgba(251, 191, 36, 0.1),
        inset 0 0 20px rgba(251, 191, 36, 0.05);
    transform: scale(1.01);
}
```

#### Textarea

```css
.textarea {
    width: 100%;
    padding: 1.25rem 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    font-size: 1rem;
    resize: vertical;
    min-height: 150px;
    transition: all 0.3s ease;
}

.textarea:focus {
    border-color: rgba(251, 191, 36, 0.6);
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 
        0 0 0 4px rgba(251, 191, 36, 0.2),
        0 0 20px rgba(251, 191, 36, 0.1);
    transform: scale(1.01);
}
```

### 4. خيارات الاختيار (Radio Options)

```css
.radio-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.radio-option::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(251, 191, 36, 0.1),
        transparent
    );
    transition: left 0.5s ease;
}

.radio-option:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(251, 191, 36, 0.4);
    transform: translateX(5px) scale(1.02);
    box-shadow: 
        0 4px 15px rgba(251, 191, 36, 0.2),
        0 0 20px rgba(59, 130, 246, 0.1);
}

.radio-option:hover::before {
    left: 100%;
}

.radio-option:has(input[type="radio"]:checked) {
    background: rgba(251, 191, 36, 0.15);
    border-color: rgba(251, 191, 36, 0.6);
    box-shadow: 
        0 0 20px rgba(251, 191, 36, 0.3),
        inset 0 0 20px rgba(251, 191, 36, 0.1);
}
```

### 5. شريط التقدم (Progress Bar)

```css
.progress-bar-container {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(
        90deg,
        #3b82f6,
        #60a5fa,
        #fbbf24,
        #f59e0b
    );
    background-size: 200% 100%;
    border-radius: 10px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
        0 0 15px rgba(251, 191, 36, 0.6),
        0 0 30px rgba(59, 130, 246, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    animation: progressShine 2s infinite;
}

.progress-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: progressFlow 2s infinite;
}
```

---

## التأثيرات الخاصة

### 1. تأثير الزجاج (Glassmorphism)

```css
.glass-effect {
    background: rgba(25, 48, 100, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 2. تأثير الحدود المتوهجة (Glowing Border)

```css
.border-glow {
    border: 2px solid rgba(251, 191, 36, 0.3);
    box-shadow: 
        0 0 20px rgba(251, 191, 36, 0.3),
        inset 0 0 20px rgba(251, 191, 36, 0.1);
}
```

### 3. تأثير الرفع عند Hover (Hover Lift)

```css
.hover-lift {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(251, 191, 36, 0.2);
}
```

### 4. تأثير الظل المحسن (Enhanced Shadow)

```css
.shadow-enhanced {
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(251, 191, 36, 0.2),
        0 0 60px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 5. تأثير النص المحسن (Enhanced Text)

```css
.text-enhanced {
    text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 0 10px rgba(251, 191, 36, 0.2);
}
```

### 6. تأثير العنوان (Heading Shadow)

```css
.heading-shadow {
    text-shadow: 
        0 0 20px rgba(251, 191, 36, 0.6),
        0 2px 8px rgba(0, 0, 0, 0.4);
}
```

---

## الخلفيات والأنماط

### 1. خلفية متحركة (Animated Background)

```css
.animated-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
    animation: backgroundShift 20s ease-in-out infinite;
}
```

### 2. نمط هندسي بالنقاط (Geometric Pattern Dots)

```css
.geometric-pattern-dots {
    background-image: 
        radial-gradient(circle, rgba(251, 191, 36, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: 0 0, 15px 15px;
    opacity: 0.3;
}
```

### 3. خلفية زجاجية (Glass Background)

```css
.glass-background {
    background: rgba(25, 48, 100, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## التصميم المتجاوب

### نقاط التوقف (Breakpoints)

```css
/* شاشات صغيرة (موبايل) */
@media (max-width: 768px) {
    /* التعديلات */
    padding: 1rem;
    font-size: 1rem;
}

/* شاشات متوسطة (تابلت) */
@media (min-width: 769px) and (max-width: 1024px) {
    /* التعديلات */
}

/* شاشات كبيرة (ديسكتوب) */
@media (min-width: 1025px) {
    /* التعديلات */
}
```

### أمثلة على التصميم المتجاوب

```css
/* Grid متجاوب */
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .responsive-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

/* Navigation متجاوب */
.navigation {
    display: flex;
    gap: 1rem;
}

@media (max-width: 768px) {
    .navigation {
        flex-direction: column;
        gap: 0.75rem;
    }
}
```

---

## فئات CSS المساعدة (Utility Classes)

### فئات التصميم المحسن

```css
/* بطاقة محسنة */
.card-enhanced

/* حدود متوهجة */
.border-glow

/* ظل محسن */
.shadow-enhanced

/* نص محسن */
.text-enhanced

/* عنوان بظل */
.heading-shadow

/* تأثير رفع عند hover */
.hover-lift

/* تأثير ripple */
.ripple-effect

/* تأثير زجاجي */
.glass-effect
```

### فئات الألوان

```css
/* نجاح */
.success { color: #10b981; }
.bg-success { background: rgba(16, 185, 129, 0.2); }

/* خطأ */
.error { color: #ef4444; }
.bg-error { background: rgba(239, 68, 68, 0.2); }

/* تحذير */
.warning { color: #fbbf24; }
.bg-warning { background: rgba(251, 191, 36, 0.2); }

/* معلومات */
.info { color: #3b82f6; }
.bg-info { background: rgba(59, 130, 246, 0.2); }
```

---

## أمثلة على الاستخدام

### مثال 1: بطاقة محسنة مع تأثيرات

```html
<div class="card card-enhanced border-glow hover-lift">
    <h2 class="heading-shadow">عنوان البطاقة</h2>
    <p class="text-enhanced">محتوى البطاقة</p>
    <button class="button-primary ripple-effect">زر</button>
</div>
```

### مثال 2: شريط تقدم متحرك

```html
<div class="progress-bar-container">
    <div class="progress-bar-fill" style="width: 60%"></div>
</div>
```

### مثال 3: خيارات اختيار تفاعلية

```html
<div class="answer-options">
    <label class="radio-option">
        <input type="radio" name="answer" value="1">
        <span>الخيار الأول</span>
    </label>
    <label class="radio-option">
        <input type="radio" name="answer" value="2">
        <span>الخيار الثاني</span>
    </label>
</div>
```

### مثال 4: زر مع تأثيرات

```html
<button class="button-primary ripple-effect">
    اضغط هنا
</button>
```

---

## ملاحظات مهمة

### الأداء
- استخدم `transform` و `opacity` للأنيميشن بدلاً من `width` و `height`
- استخدم `will-change` للعناصر المتحركة بكثافة
- قلل من عدد الأنيميشن المتزامنة

### التوافق
- استخدم `-webkit-` للدعم في Safari
- اختبر على متصفحات مختلفة
- استخدم `@supports` للتحقق من دعم الميزات

### إمكانية الوصول
- تأكد من أن الأنيميشن لا تسبب دوار
- استخدم `prefers-reduced-motion` لإيقاف الأنيميشن للمستخدمين الذين يفضلون تقليل الحركة
- تأكد من التباين الكافي للألوان

---

## نصائح التصميم

1. **استخدم الألوان بذكاء**: الألوان الذهبية والزرقاء للعناصر المهمة
2. **الظلال متعددة الطبقات**: تعطي عمقاً للتصميم
3. **الأنيميشن السلسة**: استخدم `cubic-bezier` للانتقالات الطبيعية
4. **التدرجات**: استخدم التدرجات اللونية للعمق
5. **الشفافية**: استخدم `rgba` للشفافية بدلاً من `opacity` عند الحاجة

---

## المراجع

- [CSS Variables Documentation](./index.css)
- [Enhanced Design Styles](./src/styles/enhanced-design.css)
- [Component Styles](./src/components/)

---

**آخر تحديث**: 2024

