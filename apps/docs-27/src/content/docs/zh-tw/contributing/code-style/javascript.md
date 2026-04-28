---
title: "JavaScript 編碼標準"
description: "XOOPS JavaScript 編碼標準和最佳實踐"
---

# JavaScript 標準

> XOOPS 遵循現代 JavaScript 標準 (ES6+)，強調可讀性和可維護性。

---

## 概述

XOOPS JavaScript 標準基於：

- **ECMAScript 2015+** (ES6 和現代功能)
- **Airbnb JavaScript 風格指南** (改編)
- **XOOPS 慣例** 用於一致性
- **可訪問性標準** (WCAG)

---

## 文件結構

### 文件組織

```javascript
// 1. 文件頭部註釋
/**
 * XOOPS 模塊 - 功能名稱
 * @file 處理儀表板上的用戶交互
 * @author 您的名稱 <email@example.com>
 * @copyright 2026 XOOPS 項目
 * @license GPL-2.0-or-later
 */

// 2. 導入
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. 常量
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. 模塊設置
const Dashboard = {};

// 5. 私有函數
function initializeUI() {
  // ...
}

// 6. 公開方法
Dashboard.init = function () {
  // ...
};

// 7. 導出
export default Dashboard;
```

### 文件命名

```javascript
// 使用小寫和連字符
dashboard.js
user-profile.js
form-validator.js
api-client.js

// React 組件 (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## 變量和常量

### 變量聲明

```javascript
// 默認使用 const
const maxRetries = 3;
const userName = 'John';

// 對於改變的變量使用 let
let currentIndex = 0;

// 避免 var（遺留）
// ❌ var oldStyle = true;

// Const 對象和數組可以修改內容
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ 錯誤

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ 錯誤
```

### 變量命名

```javascript
// 使用描述性名稱
const userName = 'John'; // ✅
const un = 'John'; // ❌

// 布爾變量應指示狀態
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ 不清楚

// 數組應使用複數名稱
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### 常量

```javascript
// 模塊級常量使用 UPPER_SNAKE_CASE
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// 對象屬性使用 camelCase（即使是常量）
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## 函數

### 函數聲明

```javascript
// 命名函數（優先用於可重用）
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 箭頭函數（優先用於回調）
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 短箭頭函數
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// 避免匿名函數表達式
// ❌ const fn = function() {};
```

### 函數命名

```javascript
// 使用描述性動詞名稱
function getUserById(id) { }       // ✅ 描述獲取的內容
function validateUserInput(data) { } // ✅ 描述操作
function formatDate(date) { }      // ✅ 描述轉換

// 避免單字母除了明顯的情況（循環）
function f(x) { }    // ❌
function fetch() { } // ❌ 與全局衝突
```

### 函數參數

```javascript
// 使用清晰的參數名稱
function addUser(name, email, role = 'user') {
  // ...
}

// 對對象使用解構
function createPost({ title, content, author, published = false }) {
  // ...
}

// 記錄複雜函數
/**
 * 從 API 獲取用戶數據
 * @param {number} userId - 要獲取的用戶 ID
 * @param {Object} options - 可選設置
 * @param {boolean} options.includeProfile - 包含配置文件數據
 * @returns {Promise<Object>} 用戶數據對象
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## 類和對象

### 類定義

```javascript
/**
 * 代表系統中的用戶
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * 獲取用戶的顯示名稱
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * 驗證用戶電子郵件
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// 用法
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### 對象文字

```javascript
// 使用對象速記
const name = 'John';
const age = 30;

// 速記屬性 (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// 無速記（避免）
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## 格式化

### 間距和縮進

```javascript
// 縮進使用 2 個空格（或 4 個，保持一致）
function example() {
  if (true) {
    console.log('縮進');
  }
}

// 運算符周圍的空格
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// 括號內沒有空格
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// 函數大括號前有空格
function test() { }      // ✅
function test(){ }       // ❌
```

### 行長度

```javascript
// 每行最多 100 個字符（或 120）
// 邏輯分割長行

// 長字符串
const message = 'This is a very long message that ' +
  'continues on the next line';

// 長函數調用
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// 長條件
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### 分號

```javascript
// 使用分號
const x = 5; // ✅
const y = 10;

// 不使用分號 (ASI - 自動分號插入)
const x = 5  // ❌ 避免依賴這個
```

---

## 字符串

### 字符串文字

```javascript
// 一致性使用單引號
const name = 'John'; // ✅

// 或雙引號 - 只需保持一致
const name = "John";

// 對於模板文字使用反引號（插值）
const greeting = `Hello, ${name}!`; // ✅

// 避免連接
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// 多行字符串
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## 數組

### 數組方法

```javascript
// 優先使用現代數組方法
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2); // ✅

// Filter
const evens = numbers.filter(n => n % 2 === 0); // ✅

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0); // ✅

// Find
const first = numbers.find(n => n > 3); // ✅
```

---

## 異步編程

### Promises

```javascript
// 基本 Promise
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Promise 方法
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

### Async/Await

```javascript
// 優先用於可讀性
async function fetchUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// 用法
const user = await fetchUser(123);
```

---

## 最佳實踐總結

### 做

- 默認使用 const
- 使用描述性名稱
- 對回調使用箭頭函數
- 使用 async/await 用於 Promise
- 記錄複雜函數
- 緩存 DOM 元素
- 使用事件委託
- 編寫純函數
- 保持函數專注

### 不做

- 不使用 var（遺留）
- 不使用全局變量
- 不創建長函數（超過 50 行）
- 不深度嵌套代碼
- 不使用 eval()
- 不使用內聯事件處理器
- 不在生產中留下 console.log()
- 不創建內存洩漏
- 不變異函數參數

---

## 相關文檔

- CSS 指南
- 行為準則
- 貢獻工作流程
- PHP 標準

---

#xoops #javascript #es6 #coding-standards #best-practices
