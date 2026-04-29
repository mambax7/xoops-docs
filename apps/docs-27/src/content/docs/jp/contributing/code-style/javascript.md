---
title: "JavaScript コーディング標準"
description: "XOOPS JavaScript コーディング標準とベストプラクティス"
---

# JavaScript 標準

> XOOPS は現代的な JavaScript 標準 (ES6+) に従い、可読性と保守性を重視します。

---

## 概要

XOOPS JavaScript 標準は以下に基づいています:

- **ECMAScript 2015+** (ES6 以降の現代的機能)
- **Airbnb JavaScript スタイル ガイド** (適応)
- **XOOPS 規約** 一貫性のため
- **アクセシビリティ標準** (WCAG)

---

## ファイル構造

### ファイル構成

```javascript
// 1. ファイル ヘッダー コメント
/**
 * XOOPS モジュール - 機能名
 * @file ダッシュボードのユーザー インタラクションを処理
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 */

// 2. インポート
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. 定数
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. モジュール セットアップ
const Dashboard = {};

// 5. プライベート関数
function initializeUI() {
  // ...
}

// 6. パブリック メソッド
Dashboard.init = function () {
  // ...
};

// 7. エクスポート
export default Dashboard;
```

### ファイル命名

```javascript
// 小文字とハイフンを使用
dashboard.js
user-profile.js
form-validator.js
api-client.js

// React コンポーネント (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## 変数と定数

### 変数宣言

```javascript
// デフォルトは const を使用
const maxRetries = 3;
const userName = 'John';

// 変更される変数には let を使用
let currentIndex = 0;

// var を避ける (レガシー)
// ❌ var oldStyle = true;

// Const オブジェクトと配列は内容が変更可能
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ エラー

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ エラー
```

### 変数命名

```javascript
// 説明的な名前を使用
const userName = 'John'; // ✅
const un = 'John'; // ❌

// ブール変数は状態を示す必要
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ 不明確

// 配列は複数形の名前を使用
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### 定数

```javascript
// モジュール レベルの定数は UPPER_SNAKE_CASE
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// オブジェクト プロパティは camelCase (定数でも)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## 関数

### 関数宣言

```javascript
// 名前付き関数 (再利用性に優先)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// アロー関数 (コールバックに優先)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 短いアロー関数
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// 無名関数式を避ける
// ❌ const fn = function() {};
```

### 関数命名

```javascript
// 説明的な動詞ベースの名前を使用
function getUserById(id) { }       // ✅ 何を取得するかを説明
function validateUserInput(data) { } // ✅ アクションを説明
function formatDate(date) { }      // ✅ 変換を説明

// 単一文字を避ける (ループで明らかな場合を除き)
function f(x) { }    // ❌
function fetch() { } // ❌ グローバルと競合
```

### 関数パラメーター

```javascript
// 明確なパラメーター名を使用
function addUser(name, email, role = 'user') {
  // ...
}

// オブジェクトには分割割り当てを使用
function createPost({ title, content, author, published = false }) {
  // ...
}

// 複雑な関数をドキュメント化
/**
 * API からユーザー データを取得
 * @param {number} userId - 取得するユーザー ID
 * @param {Object} options - オプション設定
 * @param {boolean} options.includeProfile - プロファイル データを含める
 * @returns {Promise<Object>} ユーザー データ オブジェクト
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## クラスとオブジェクト

### クラス定義

```javascript
/**
 * システム内のユーザーを表現
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * ユーザーの表示名を取得
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * ユーザー メール アドレスを検証
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// 使用法
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### オブジェクト リテラル

```javascript
// オブジェクト短縮形を使用
const name = 'John';
const age = 30;

// 短縮形プロパティ (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// 短縮形なし (避ける)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## フォーマット

### スペーシングとインデント

```javascript
// インデントに 2 スペースを使用 (または 4、一貫性を保つ)
function example() {
  if (true) {
    console.log('インデント済み');
  }
}

// 演算子の周りにスペース
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// 括弧の内側にスペースなし
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// 関数括弧の前にスペース
function test() { }      // ✅
function test(){ }       // ❌
```

### 行の長さ

```javascript
// 1 行の最大 100 文字 (または 120)
// 長い行は論理的に分割

// 長い文字列
const message = 'This is a very long message that ' +
  'continues on the next line';

// 長い関数呼び出し
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// 長い条件
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### セミコロン

```javascript
// セミコロンを使用
const x = 5; // ✅
const y = 10;

// セミコロンを使用しない (ASI - 自動セミコロン挿入)
const x = 5  // ❌ これに頼るのを避ける
```

---

## 文字列

### 文字列リテラル

```javascript
// 一貫性のために単一引用符を使用
const name = 'John'; // ✅

// または二重引用符 - ただし一貫性を保つ
const name = "John";

// テンプレート リテラルを使用 (補間用)
const greeting = `Hello, ${name}!`; // ✅

// 連結を避ける
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// 複数行文字列
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## 配列

### 配列メソッド

```javascript
// 現代的な配列メソッドを優先
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2); // ✅
// for (let i = 0; i < numbers.length; i++) { } // ❌

// Filter
const evens = numbers.filter(n => n % 2 === 0); // ✅

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0); // ✅

// Find
const first = numbers.find(n => n > 3); // ✅

// Some/Every
const hasEven = numbers.some(n => n % 2 === 0); // ✅
const allPositive = numbers.every(n => n > 0); // ✅
```

### 配列の分割割り当て

```javascript
// 配列要素を抽出
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// 要素をスキップ
const [,, third] = [1, 2, 3];
// third = 3

// 関数パラメーターで使用
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## オブジェクト

### オブジェクトの分割割り当て

```javascript
// オブジェクト プロパティを抽出
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// プロパティを名前変更
const { name: userName, email: userEmail } = user;

// デフォルト値
const { role = 'user' } = user;

// ネストされた分割割り当て
const { user: { name, email } } = response;

// 関数パラメーター
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### スプレッド演算子

```javascript
// 配列をコピー
const original = [1, 2, 3];
const copy = [...original];

// 配列をマージ
const merged = [...arr1, ...arr2];

// オブジェクトをコピー
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// オブジェクトをマージ
const merged = { ...defaults, ...options };

// プロパティを更新
const updated = { ...user, email: 'newemail@example.com' };
```

---

## 非同期プログラミング

### Promise

```javascript
// 基本的な Promise
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Promise メソッド
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### Async/Await

```javascript
// 可読性に優先
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

// 使用法
const user = await fetchUser(123);

// 複数の操作
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## コメントとドキュメント

### インライン コメント

```javascript
// 何を説明するかではなく、なぜを説明
const result = calculateTotal(items, taxRate); // ✅ なぜ

// ❌ 明らかなコードを説明しない
const x = 5; // x を 5 に設定
const sum = a + b; // a と b を追加
```

### JSDoc コメント

```javascript
/**
 * 税金を含むアイテムの合計価格を計算
 *
 * @param {Array<Object>} items - price プロパティを持つアイテム配列
 * @param {number} taxRate - 税率を小数値で表示 (0.1 = 10%)
 * @returns {number} 税金を含む合計価格
 * @throws {Error} items が配列でない場合
 * @example
 * const total = calculateTotal(
 *   [{ price: 100 }, { price: 50 }],
 *   0.1
 * );
 * console.log(total); // 165
 */
function calculateTotal(items, taxRate = 0) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

---

## エラー処理

### Try/Catch

```javascript
// 常にエラーを処理
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// エラーについて具体的に
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Invalid JSON');
  } else {
    console.error('Unknown error');
  }
}
```

### カスタム エラー

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 使用法
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## DOM 操作

### 要素の選択

```javascript
// 現代的なメソッド (優先)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// 古いメソッドを避ける
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// 要素をキャッシュ
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### イベント処理

```javascript
// addEventListener を使用
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// リスナーを削除
element.removeEventListener('click', handler);

// イベント デリゲーション
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### DOM 更新

```javascript
// textContent を使用 (innerHTML より安全)
element.textContent = 'Safe text'; // ✅

// HTML は信頼できるコンテンツにのみ使用
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// クラス操作
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// 属性操作
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## モジュール パターン

### ES6 モジュール

```javascript
// エクスポート
export const helper = () => { };
export default Dashboard;

// インポート
import Dashboard from './dashboard.js';
import { helper } from './helper.js';
import * as utils from './utils.js';
```

---

## ベストプラクティス サマリー

### すべき こと

- デフォルトで const を使用
- 説明的な名前を使用
- コールバックにはアロー関数を使用
- Promise には async/await を使用
- 複雑な関数をドキュメント化
- DOM 要素をキャッシュ
- イベント デリゲーションを使用
- 純粋な関数を作成
- 関数をシンプルに保つ

### しないこと

- var を使用しない (レガシー)
- グローバル変数を使用しない
- 長い関数を作成しない (50 行超)
- コードをネストしすぎない
- eval() を使用しない
- インライン イベント ハンドラーを使用しない
- production に console.log() を残さない
- メモリ リークを作成しない
- 関数パラメーターを変更しない

---

## ツールと Linting

### ESLint 構成

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

### Prettier 構成

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## 関連ドキュメント

- CSS ガイドライン
- 行動規範
- 貢献ワークフロー
- PHP 標準

---

#xoops #javascript #es6 #coding-standards #best-practices
