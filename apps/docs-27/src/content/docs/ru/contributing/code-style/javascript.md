---
title: "Стандарты кодирования JavaScript"
description: "Стандарты кодирования JavaScript XOOPS и лучшие практики"
---

# Стандарты JavaScript

> XOOPS следует современным стандартам JavaScript (ES6+) с акцентом на читаемость и поддерживаемость.

---

## Обзор

Стандарты JavaScript XOOPS основаны на:

- **ECMAScript 2015+** (ES6 и современные функции)
- **Руководство по стилю JavaScript Airbnb** (адаптировано)
- **Соглашения XOOPS** для согласованности
- **Стандарты доступности** (WCAG)

---

## Структура файлов

### Организация файлов

```javascript
// 1. Заголовочный комментарий файла
/**
 * XOOPS Module - Feature Name
 * @file Handles user interactions on the dashboard
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 */

// 2. Импорты
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Константы
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Настройка модуля
const Dashboard = {};

// 5. Приватные функции
function initializeUI() {
  // ...
}

// 6. Публичные методы
Dashboard.init = function () {
  // ...
};

// 7. Экспорты
export default Dashboard;
```

### Наименование файлов

```javascript
// Используйте нижний регистр с дефисами
dashboard.js
user-profile.js
form-validator.js
api-client.js

// React компоненты (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## Переменные и константы

### Объявление переменных

```javascript
// Используйте const по умолчанию
const maxRetries = 3;
const userName = 'John';

// Используйте let для переменных, которые изменяются
let currentIndex = 0;

// Избегайте var (устаревший)
// ❌ var oldStyle = true;

// Объекты и массивы const могут иметь изменяемое содержимое
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Error

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Error
```

### Именование переменных

```javascript
// Используйте описательные имена
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Булевы переменные должны указывать состояние
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Неясно

// Массивы должны использовать множественные имена
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### Константы

```javascript
// UPPER_SNAKE_CASE для констант уровня модуля
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase для свойств объектов (даже констант)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## Функции

### Объявление функций

```javascript
// Именованные функции (предпочтительно для переиспользования)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Стрелочные функции (предпочтительно для обратных вызовов)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Короткие стрелочные функции
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Избегайте анонимных выражений функций
// ❌ const fn = function() {};
```

### Именование функций

```javascript
// Используйте описательные имена на основе глаголов
function getUserById(id) { }       // ✅ Описывает то, что она получает
function validateUserInput(data) { } // ✅ Описывает действие
function formatDate(date) { }      // ✅ Описывает преобразование

// Избегайте одиночных букв, кроме очевидных случаев (циклы)
function f(x) { }    // ❌
function fetch() { } // ❌ Конфликтует с глобальной
```

### Параметры функций

```javascript
// Используйте четкие имена параметров
function addUser(name, email, role = 'user') {
  // ...
}

// Используйте деструктуризацию для объектов
function createPost({ title, content, author, published = false }) {
  // ...
}

// Документируйте сложные функции
/**
 * Получить данные пользователя из API
 * @param {number} userId - ID пользователя для получения
 * @param {Object} options - Дополнительные настройки
 * @param {boolean} options.includeProfile - Включить данные профиля
 * @returns {Promise<Object>} Объект данных пользователя
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## Классы и объекты

### Определение класса

```javascript
/**
 * Представляет пользователя в системе
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * Получить отображаемое имя пользователя
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * Проверить адрес электронной почты пользователя
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// Использование
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### Объектные литералы

```javascript
// Используйте сокращение объектов
const name = 'John';
const age = 30;

// Сокращенные свойства (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// Без сокращения (избегайте)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## Форматирование

### Интервал и отступы

```javascript
// Используйте 2 пробела для отступа (или 4, будьте согласованны)
function example() {
  if (true) {
    console.log('Indented');
  }
}

// Пробелы вокруг операторов
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// Без пробелов внутри скобок
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Пространство перед скобками функции
function test() { }      // ✅
function test(){ }       // ❌
```

### Длина строки

```javascript
// Максимум 100 символов на строку (или 120)
// Разбивайте длинные строки логически

// Длинные строки
const message = 'This is a very long message that ' +
  'continues on the next line';

// Долгие вызовы функций
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Долгие условия
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### Точки с запятой

```javascript
// Используйте точки с запятой
const x = 5; // ✅
const y = 10;

// Не использовать точки с запятой (ASI - Automatic Semicolon Insertion)
const x = 5  // ❌ Избегайте полагаться на это
```

---

## Строки

### Строковые литералы

```javascript
// Используйте одиночные кавычки для согласованности
const name = 'John'; // ✅

// Или двойные кавычки - просто будьте согласованны
const name = "John";

// Используйте обратные кавычки для шаблонных литералов (интерполяция)
const greeting = `Hello, ${name}!`; // ✅

// Избегайте конкатенации
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// Многострочные строки
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## Массивы

### Методы массивов

```javascript
// Предпочитайте современные методы массивов
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

### Деструктуризация массивов

```javascript
// Извлеките элементы массива
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Пропустите элементы
const [,, third] = [1, 2, 3];
// third = 3

// Используйте в параметрах функции
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## Объекты

### Деструктуризация объектов

```javascript
// Извлеките свойства объекта
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Переименуйте свойства
const { name: userName, email: userEmail } = user;

// Значения по умолчанию
const { role = 'user' } = user;

// Вложенная деструктуризация
const { user: { name, email } } = response;

// Параметры функции
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### Оператор разворота

```javascript
// Копировать массивы
const original = [1, 2, 3];
const copy = [...original];

// Объединить массивы
const merged = [...arr1, ...arr2];

// Копировать объекты
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Объединить объекты
const merged = { ...defaults, ...options };

// Обновить свойства
const updated = { ...user, email: 'newemail@example.com' };
```

---

## Асинхронное программирование

### Обещания

```javascript
// Базовое обещание
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Методы обещания
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### Async/Await

```javascript
// Предпочтительно для читаемости
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

// Использование
const user = await fetchUser(123);

// Несколько операций
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## Комментарии и документация

### Встроенные комментарии

```javascript
// Объясните ПОЧЕМУ, а не ЧТО
const result = calculateTotal(items, taxRate); // ✅ Почему

// ❌ Не объясняйте очевидный код
const x = 5; // Set x to 5
const sum = a + b; // Add a and b
```

### Комментарии JSDoc

```javascript
/**
 * Рассчитайте общую цену предметов с включением налога
 *
 * @param {Array<Object>} items - Массив элементов со свойством цены
 * @param {number} taxRate - Налоговая ставка в десятичном формате (0.1 = 10%)
 * @returns {number} Общая цена с включением налога
 * @throws {Error} Если items не массив
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

## Обработка ошибок

### Try/Catch

```javascript
// Всегда обрабатывайте ошибки
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// Будьте конкретны в отношении ошибок
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

### Пользовательские ошибки

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Использование
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## Манипуляция DOM

### Выбор элементов

```javascript
// Современные методы (предпочтительно)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// Избегайте старых методов
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// Кэшируйте элементы
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### Обработка событий

```javascript
// Используйте addEventListener
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// Удалите слушателей
element.removeEventListener('click', handler);

// Делегирование событий
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### Обновления DOM

```javascript
// Используйте textContent (безопаснее, чем innerHTML)
element.textContent = 'Safe text'; // ✅

// Используйте innerHTML только для доверенного контента
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// Манипуляция классами
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// Манипуляция атрибутами
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## Паттерн модулей

### ES6 модули

```javascript
// Экспорт
export const helper = () => { };
export default Dashboard;

// Импорт
import Dashboard from './dashboard.js';
import { helper } from './helper.js';
import * as utils from './utils.js';
```

---

## Сводка лучших практик

### Делайте

- Используйте const по умолчанию
- Используйте описательные имена
- Используйте стрелочные функции для обратных вызовов
- Используйте async/await для обещаний
- Документируйте сложные функции
- Кэшируйте элементы DOM
- Используйте делегирование событий
- Пишите чистые функции
- Держите функции сосредоточенными

### Не делайте

- Не используйте var (устаревший)
- Не используйте глобальные переменные
- Не создавайте длинные функции (более 50 строк)
- Не вложите глубоко код
- Не используйте eval()
- Не используйте встроенные обработчики событий
- Не оставляйте console.log() в продакшене
- Не создавайте утечки памяти
- Не мутируйте параметры функции

---

## Инструменты и линтинг

### Конфигурация ESLint

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

### Конфигурация Prettier

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

## Связанная документация

- Рекомендации CSS
- Кодекс поведения
- Рабочий процесс участия
- Стандарты PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
