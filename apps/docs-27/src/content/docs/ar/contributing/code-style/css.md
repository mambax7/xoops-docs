---
title: "إرشادات CSS و SCSS"
description: "معايير ترميز CSS/SCSS في XOOPS وأفضل الممارسات"
dir: rtl
lang: ar
---

> يتبع XOOPS معايير CSS الحديثة مع معالجة SCSS مع التركيز على قابلية الصيانة والأداء.

---

## نظرة عامة

معايير CSS في XOOPS تؤكد على:

- **معالجة SCSS** للتنظيم
- **منهجية BEM** للتسمية
- **التصميم المستجيب أولاً للأجهزة المحمولة**
- **سهولة الوصول ووضوح HTML**
- **تحسين الأداء**

---

## بنية الملفات

### تنظيم SCSS

```
styles/
├── abstracts/           # المتغيرات والدوال والمخاليط
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/                # إعادة تعيين والطباعة والافتراضيات
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── components/          # مكونات قابلة لإعادة الاستخدام
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   └── _navigation.scss
├── layout/              # تخطيط الصفحة
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _container.scss
├── pages/               # أنماط خاصة بالصفحة
│   ├── _home.scss
│   ├── _dashboard.scss
│   └── _admin.scss
└── main.scss            # استيراد جميع الملفات
```

### تسمية الملفات

```scss
// استخدم الأحرف الصغيرة مع الواصلات
_button.scss        // مكون
_modal-dialog.scss  // مكون متعدد الكلمات
_colors.scss        // متغيرات
```

---

## اتفاقيات التسمية

### منهجية BEM

BEM = Block Element Modifier

```scss
// Block: مكون قائم بذاته
.button { }

// Block__Element: طفل الكتلة
.button__text { }
.button__icon { }

// Block--Modifier: تباين الكتلة
.button--primary { }
.button--disabled { }
.button--small { }

// مثال معقد
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--highlighted { }
.card--loading { }
```

### أفضل ممارسات التسمية

```scss
// ✅ تسمية BEM وصفية
.form-field { }
.form-field__label { }
.form-field__input { }
.form-field--disabled { }
.form-field--error { }

// ❌ تجنب
.form-f { }                 // مختصر جداً
.form_field { }             // استخدم الواصلات وليس الشرطة السفلية
.formField { }              // لا تستخدم camelCase
.form-field-2 { }           // لا تستخدم أرقام للمتغيرات
.form-field.active { }      // استخدم المعدلات وليس الفئات
```

---

## التنسيق

### البنية الأساسية

```scss
.component {
  // 1. الموضع والتخطيط
  display: flex;
  position: relative;
  top: 0;
  left: 0;

  // 2. نموذج الصندوق
  width: 100%;
  height: auto;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid;

  // 3. الطباعة
  font-size: 1rem;
  line-height: 1.5;
  color: #333;

  // 4. التأثيرات البصرية
  background: #fff;
  border-radius: 4px;
  box-shadow: none;

  // 5. الرسوم المتحركة
  transition: all 0.3s ease;
}
```

### المسافات والمحاذاة

```scss
// استخدم 2 مسافات للمحاذاة
.component {
  padding: 1rem;

  &__child {
    margin: 0.5rem;
  }
}

// الخصائص على أسطر منفصلة
.component {
  display: flex;        // ✅
  color: red;
  font-size: 1rem;
}

// ❌ لا تجعلها مدمجة
.component { display: flex; color: red; }
```

---

## المتغيرات

### تسمية المتغيرات

```scss
// استخدم أسماء وصفية
$color-primary: #0066cc;
$color-secondary: #666666;
$color-danger: #dc3545;

$font-base: 16px;
$font-size-small: 0.875rem;
$font-size-large: 1.25rem;

$spacing-unit: 0.5rem;
$spacing-small: 0.5rem;
$spacing-medium: 1rem;
$spacing-large: 2rem;

$border-radius-small: 2px;
$border-radius-medium: 4px;
$border-radius-large: 8px;

$transition-duration: 0.3s;
$transition-timing: ease-in-out;
```

---

## الألوان

### نظام الألوان

```scss
// لوحة الألوان الأساسية
$color-primary: #0066cc;
$color-primary-dark: #004499;
$color-primary-light: #3399ff;

// لوحة الألوان الثانوية
$color-secondary: #666666;
$color-secondary-dark: #333333;
$color-secondary-light: #999999;

// الألوان الدلالية
$color-success: #28a745;
$color-warning: #ffc107;
$color-danger: #dc3545;
$color-info: #17a2b8;

// الألوان المحايدة
$color-white: #ffffff;
$color-black: #000000;
$color-gray-100: #f8f9fa;
$color-gray-900: #212529;

// الاستخدام
.button {
  background-color: $color-primary;
  color: $color-white;

  &:hover {
    background-color: $color-primary-dark;
  }

  &--danger {
    background-color: $color-danger;
  }
}
```

---

## أفضل الممارسات

### افعل

- استخدم متغيرات SCSS للألوان والمسافات والخطوط
- اتبع اتفاقية تسمية BEM
- تصميم مستجيب أولاً للأجهزة المحمولة
- نظم الملفات حسب الغرض
- اكتب خلطات قابلة لإعادة الاستخدام
- ابق المحددات بسيطة (أقصى 3 مستويات عمق)
- استخدم HTML دلالي
- قلل التخصص
- اترك تعليقات للأقسام المعقدة

### لا تفعل

- لا تستخدم أنماط مضمنة
- لا تستخدم !important (تقريباً أبداً)
- لا تنشئ محددات محددة جداً
- لا تستخدم محددات ID للأنماط
- لا تتداخل بعمق (أقصى 3-4 مستويات)
- لا تستخدم px لأحجام الخطوط (استخدم rem)
- لا تنشئ أرقام سحرية (استخدم متغيرات)
- لا تترك CSS غير مستخدم
- لا تنسَ سهولة الوصول

---

## سهولة الوصول

### تباين اللون

```scss
// ضمان تباين كافي
// المستوى AA: 4.5:1 للنص العادي
// المستوى AAA: 7:1 للنص العادي

.button--primary {
  background-color: $color-primary; // #0066cc
  color: $color-white;               // #ffffff
  // نسبة التباين: 8.6:1 ✅
}

.button--secondary {
  background-color: $color-gray-300; // #dee2e6
  color: $color-black;               // #000000
  // نسبة التباين: 9.3:1 ✅
}
```

### حالات التركيز

```scss
// قدم دائماً أنماط التركيز
.button:focus,
.form-field__input:focus {
  outline: 3px solid $color-primary;
  outline-offset: 2px;
}
```

---

## الأداء

### تحسين المحددات

```scss
// ✅ فعال
.button {
  // ...
}

.button--primary {
  // ...
}

// ❌ غير فعال (محدد جداً وتداخل عميق)
div.container section.content article .button {
  // ...
}
```

---

## الأدوات

### تكوين Stylelint

```json
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "color-hex-length": "short",
    "selector-pseudo-class-no-unknown": null,
    "scss/dollar-variable-pattern": "^[a-z]"
  }
}
```

---

## التوثيق ذات الصلة

- معايير JavaScript
- قواعد السلوك
- سير العمل المساهم
- معايير PHP

---

#xoops #css #scss #styling #coding-standards #best-practices
