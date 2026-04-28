---
title: "معايير ترميز JavaScript"
description: "معايير ترميز JavaScript في XOOPS وأفضل الممارسات"
dir: rtl
lang: ar
---

# معايير JavaScript

> يتبع XOOPS معايير JavaScript الحديثة (ES6+) مع التركيز على قابلية القراءة والصيانة.

---

## نظرة عامة

معايير JavaScript في XOOPS تعتمد على:

- **ECMAScript 2015+** (ES6 والميزات الحديثة)
- **دليل نمط Airbnb JavaScript** (مع التعديل)
- **اتفاقيات XOOPS** للاتساق
- **معايير سهولة الوصول** (WCAG)

---

## بنية الملفات

### تنظيم الملفات

```javascript
// 1. تعليق رأس الملف
/**
 * وحدة XOOPS - اسم الميزة
 * @file يتعامل مع التفاعلات على لوحة المعلومات
 * @author اسمك <email@example.com>
 * @copyright 2026 مشروع XOOPS
 * @license GPL-2.0-or-later
 */

// 2. الاستيرادات
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. الثوابت
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. إعداد الوحدة
const Dashboard = {};

// 5. الدوال الخاصة
function initializeUI() {
  // ...
}

// 6. الطرق العامة
Dashboard.init = function () {
  // ...
};

// 7. الصادرات
export default Dashboard;
```

### تسمية الملفات

```javascript
// استخدم الأحرف الصغيرة مع الواصلات
dashboard.js
user-profile.js
form-validator.js
api-client.js

// مكونات React (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## المتغيرات والثوابت

### إعلان المتغيرات

```javascript
// استخدم const بشكل افتراضي
const maxRetries = 3;
const userName = 'محمد';

// استخدم let للمتغيرات التي تتغير
let currentIndex = 0;

// تجنب var (قديم)
// ❌ var oldStyle = true;

// يمكن تعديل محتويات الكائنات والمصفوفات const
const user = { name: 'محمد' };
user.name = 'فاطمة'; // ✅ موافق
user = {}; // ❌ خطأ

const numbers = [1, 2, 3];
numbers.push(4); // ✅ موافق
numbers = []; // ❌ خطأ
```

### تسمية المتغيرات

```javascript
// استخدم أسماء وصفية
const userName = 'محمد'; // ✅
const un = 'محمد'; // ❌

// يجب أن تشير متغيرات المنطق إلى الحالة
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ غير واضح

// يجب أن تكون المصفوفات بصيغة الجمع
const users = ['محمد', 'فاطمة'];
const userList = ['محمد', 'فاطمة'];
const items = [];
```

---

## الوظائف

### إعلان الوظيفة

```javascript
// الدوال المسماة (مفضلة لإعادة الاستخدام)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// دوال الأسهم (مفضلة للاستدعاءات)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// دوال أسهم قصيرة
const isPositive = (num) => num > 0;
const double = (x) => x * 2;
```

### تسمية الوظيفة

```javascript
// استخدم أسماء قائمة على الفعل وصفية
function getUserById(id) { }       // ✅ يصف ما تحصل عليه
function validateUserInput(data) { } // ✅ يصف الإجراء
function formatDate(date) { }      // ✅ يصف التحويل

// تجنب الأحرف الفردية فقط باستثناء الحالات الواضحة (حلقات)
function f(x) { }    // ❌
function fetch() { } // ❌ يتعارض مع العامل الشامل
```

---

## الفئات والكائنات

### تعريف الفئة

```javascript
/**
 * يمثل مستخدماً في النظام
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * الحصول على اسم عرض المستخدم
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * التحقق من بريد المستخدم الإلكتروني
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// الاستخدام
const user = new User('محمد علي', 'john@example.com');
console.log(user.getDisplayName());
```

### كائنات حرفية

```javascript
// استخدم اختصار الكائن
const name = 'محمد';
const age = 30;

// اختصار الخصائص (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} يبلغ من العمر ${this.age} سنة`;
  },
};
```

---

## التنسيق

### المسافات والمحاذاة

```javascript
// استخدم 2 مسافات للمحاذاة (أو 4، كن متسقاً)
function example() {
  if (true) {
    console.log('تم المحاذاة');
  }
}

// مسافات حول المعاملات
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'نعم' : 'لا'; // ✅

// لا توجد مسافة داخل الأقواس
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// مسافة قبل أقواس الدالة
function test() { }      // ✅
function test(){ }       // ❌
```

---

## السلاسل

### حروف السلسلة

```javascript
// استخدم الاقتباسات الفردية للاتساق
const name = 'محمد'; // ✅

// أو الاقتباسات المزدوجة - فقط كن متسقاً
const name = "محمد";

// استخدم علامات الجنس للقوالب (الاستيفاء)
const greeting = `مرحباً، ${name}!`; // ✅

// تجنب الربط
const message = 'مرحباً ' + name; // ❌
const message = `مرحباً ${name}`; // ✅
```

---

## المصفوفات

### طرق المصفوفة

```javascript
// فضل طرق المصفوفة الحديثة
const numbers = [1, 2, 3, 4, 5];

// الخريطة
const doubled = numbers.map(n => n * 2); // ✅

// التصفية
const evens = numbers.filter(n => n % 2 === 0); // ✅

// تقليل
const sum = numbers.reduce((acc, n) => acc + n, 0); // ✅

// بحث
const first = numbers.find(n => n > 3); // ✅

// بعض/كل
const hasEven = numbers.some(n => n % 2 === 0); // ✅
const allPositive = numbers.every(n => n > 0); // ✅
```

---

## البرمجة غير المتزامنة

### الوعود

```javascript
// وعد أساسي
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// طرق الوعود
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

### Async/Await

```javascript
// مفضل للقراءة
async function fetchUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('لم يتم العثور على المستخدم');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('فشل جلب المستخدم:', error);
    throw error;
  }
}

// الاستخدام
const user = await fetchUser(123);
```

---

## التعليقات والتوثيق

### تعليقات التعليقات

```javascript
// اشرح لماذا وليس ماذا
const result = calculateTotal(items, taxRate); // ✅ لماذا

// ❌ لا شرح الكود الواضح
const x = 5; // اضبط x على 5
const sum = a + b; // أضف a و b
```

### تعليقات JSDoc

```javascript
/**
 * حساب السعر الإجمالي للعناصر بما في ذلك الضريبة
 *
 * @param {Array<Object>} items - مصفوفة من العناصر بخاصية السعر
 * @param {number} taxRate - معدل الضريبة كعشري (0.1 = 10%)
 * @returns {number} السعر الإجمالي بما في ذلك الضريبة
 * @throws {Error} إذا لم تكن العناصر مصفوفة
 * @example
 * const total = calculateTotal(
 *   [{ price: 100 }, { price: 50 }],
 *   0.1
 * );
 * console.log(total); // 165
 */
function calculateTotal(items, taxRate = 0) {
  if (!Array.isArray(items)) {
    throw new Error('يجب أن تكون العناصر مصفوفة');
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

---

## معالجة الأخطاء

### Try/Catch

```javascript
// تعامل دائماً مع الأخطاء
try {
  const result = riskyOperation();
} catch (error) {
  console.error('فشل التشغيل:', error);
} finally {
  cleanup();
}

// كن محدداً مع الأخطاء
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('JSON غير صحيح');
  } else {
    console.error('خطأ غير معروف');
  }
}
```

---

## أفضل الممارسات الملخصة

### افعل

- استخدم const بشكل افتراضي
- استخدم أسماء وصفية
- استخدم دوال الأسهم للاستدعاءات
- استخدم async/await للوعود
- وثائق الوظائف المعقدة
- ذاكرة تخزين مؤقت عناصر DOM
- استخدم تفويض الحدث
- اكتب وظائف نقية
- حافظ على الوظائف مركزة

### لا تفعل

- لا تستخدم var (قديم)
- لا تستخدم المتغيرات الشاملة
- لا تنشئ وظائف طويلة (أكثر من 50 سطر)
- لا تتداخل الأكوام بعمق
- لا تستخدم eval()
- لا تستخدم معالجات الحدث المضمنة
- لا تترك console.log() في الإنتاج
- لا تنشئ تسريبات الذاكرة
- لا تعدل معاملات الدالة

---

## أدوات والفحص

### تكوين ESLint

```javascript
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error"
  }
}
```

---

## التوثيق ذات الصلة

- إرشادات CSS
- قواعس السلوك
- سير العمل المساهم
- معايير PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
