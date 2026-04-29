---
title: "JavaScript कोडिंग मानक"
description: "XOOPS JavaScript कोडिंग मानक और सर्वोत्तम प्रथाएँ"
---
# JavaScript मानक

> XOOPS पठनीयता और रखरखाव पर जोर देने के साथ आधुनिक JavaScript मानकों (ES6+) का पालन करता है।

---

## अवलोकन

XOOPS JavaScript मानक इस पर आधारित हैं:

- **ECMAScript 2015+** (ES6 और आधुनिक सुविधाएँ)
- **Airbnb JavaScript स्टाइल गाइड** (अनुकूलित)
- **XOOPS सम्मेलन** निरंतरता के लिए
- **पहुंच-योग्यता मानक** (WCAG)

---

## फ़ाइल संरचना

### फ़ाइल संगठन

```javascript
// 1. File header comment
/**
 * XOOPS Module - Feature Name
 * @file Handles user interactions on the dashboard
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 */

// 2. Imports
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Constants
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Module setup
const Dashboard = {};

// 5. Private functions
function initializeUI() {
  // ...
}

// 6. Public methods
Dashboard.init = function () {
  // ...
};

// 7. Exports
export default Dashboard;
```

### फ़ाइल नामकरण

```javascript
// Use lowercase with hyphens
dashboard.js
user-profile.js
form-validator.js
api-client.js

// React components (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## चर और स्थिरांक

### परिवर्तनीय घोषणा

```javascript
// Use const by default
const maxRetries = 3;
const userName = 'John';

// Use let for variables that change
let currentIndex = 0;

// Avoid var (legacy)
// ❌ var oldStyle = true;

// Const objects and arrays can have contents modified
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Error

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Error
```

### परिवर्तनीय नामकरण

```javascript
// Use descriptive names
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Boolean variables should indicate state
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Unclear

// Arrays should use plural names
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### स्थिरांक

```javascript
// UPPER_SNAKE_CASE for module-level constants
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase for object properties (even constants)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## कार्य

### फ़ंक्शन घोषणा

```javascript
// Named functions (preferred for reusability)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Arrow functions (preferred for callbacks)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Short arrow functions
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Avoid anonymous function expressions
// ❌ const fn = function() {};
```

### फ़ंक्शन नामकरण

```javascript
// Use descriptive verb-based names
function getUserById(id) { }       // ✅ Describes what it gets
function validateUserInput(data) { } // ✅ Describes action
function formatDate(date) { }      // ✅ Describes transformation

// Avoid single letters except in obvious cases (loops)
function f(x) { }    // ❌
function fetch() { } // ❌ Conflicts with global
```

### फ़ंक्शन पैरामीटर

```javascript
// Use clear parameter names
function addUser(name, email, role = 'user') {
  // ...
}

// Use destructuring for objects
function createPost({ title, content, author, published = false }) {
  // ...
}

// Document complex functions
/**
 * Fetch user data from the API
 * @param {number} userId - The user ID to fetch
 * @param {Object} options - Optional settings
 * @param {boolean} options.includeProfile - Include profile data
 * @returns {Promise<Object>} User data object
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## कक्षाएं और वस्तुएं

### वर्ग परिभाषा

```javascript
/**
 * Represents a user in the system
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * Get user's display name
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * Validate user email
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// Usage
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### वस्तु शाब्दिक

```javascript
// Use object shorthand
const name = 'John';
const age = 30;

// Shorthand properties (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// Without shorthand (avoid)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## फ़ॉर्मेटिंग

### रिक्ति और इंडेंटेशन

```javascript
// Use 2 spaces for indentation (or 4, be consistent)
function example() {
  if (true) {
    console.log('Indented');
  }
}

// Spaces around operators
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// No space inside parentheses
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Space before function braces
function test() { }      // ✅
function test(){ }       // ❌
```

### लाइन की लंबाई

```javascript
// Maximum 100 characters per line (or 120)
// Break long lines logically

// Long strings
const message = 'This is a very long message that ' +
  'continues on the next line';

// Long function calls
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Long conditionals
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### अर्धविराम

```javascript
// Use semicolons
const x = 5; // ✅
const y = 10;

// Not using semicolons (ASI - Automatic Semicolon Insertion)
const x = 5  // ❌ Avoid relying on this
```

---

## तार

### स्ट्रिंग शाब्दिक

```javascript
// Use single quotes for consistency
const name = 'John'; // ✅

// Or double quotes - just be consistent
const name = "John";

// Use backticks for template literals (interpolation)
const greeting = `Hello, ${name}!`; // ✅

// Avoid concatenation
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// Multi-line strings
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## सारणियाँ

### सारणी विधियाँ

```javascript
// Prefer modern array methods
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

### सारणी का विध्वंस

```javascript
// Extract array elements
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [,, third] = [1, 2, 3];
// third = 3

// Use in function parameters
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## वस्तुएँ

### वस्तु का विनाश

```javascript
// Extract object properties
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Rename properties
const { name: userName, email: userEmail } = user;

// Default values
const { role = 'user' } = user;

// Nested destructuring
const { user: { name, email } } = response;

// Function parameters
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### स्प्रेड ऑपरेटर

```javascript
// Copy arrays
const original = [1, 2, 3];
const copy = [...original];

// Merge arrays
const merged = [...arr1, ...arr2];

// Copy objects
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Merge objects
const merged = { ...defaults, ...options };

// Update properties
const updated = { ...user, email: 'newemail@example.com' };
```

---

## एसिंक प्रोग्रामिंग

### वादे

```javascript
// Basic promise
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Promise methods
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### एसिंक/प्रतीक्षा करें

```javascript
// Preferred for readability
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

// Usage
const user = await fetchUser(123);

// Multiple operations
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## टिप्पणियाँ और दस्तावेज़ीकरण

### इनलाइन टिप्पणियाँ

```javascript
// Explain WHY, not WHAT
const result = calculateTotal(items, taxRate); // ✅ Why

// ❌ Don't explain obvious code
const x = 5; // Set x to 5
const sum = a + b; // Add a and b
```

### JSDoc टिप्पणियाँ

```javascript
/**
 * Calculate the total price of items including tax
 *
 * @param {Array<Object>} items - Array of items with price property
 * @param {number} taxRate - Tax rate as decimal (0.1 = 10%)
 * @returns {number} Total price including tax
 * @throws {Error} If items is not an array
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

## त्रुटि प्रबंधन

### प्रयास करें/पकड़ें

```javascript
// Always handle errors
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// Be specific with errors
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

### कस्टम त्रुटियाँ

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## डोम हेरफेर

### तत्वों का चयन करना

```javascript
// Modern methods (preferred)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// Avoid older methods
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// Cache elements
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### इवेंट हैंडलिंग

```javascript
// Use addEventListener
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// Remove listeners
element.removeEventListener('click', handler);

// Event delegation
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### डोम अपडेट

```javascript
// Use textContent (safer than innerHTML)
element.textContent = 'Safe text'; // ✅

// Use innerHTML only for trusted content
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// Class manipulation
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// Attribute manipulation
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## मॉड्यूल पैटर्न

### ES6 मॉड्यूल

```javascript
// Export
export const helper = () => { };
export default Dashboard;

// Import
import Dashboard from './dashboard.js';
import { helper } from './helper.js';
import * as utils from './utils.js';
```

---

## सर्वोत्तम प्रथाओं का सारांश

### करो

- डिफ़ॉल्ट रूप से const का उपयोग करें
- वर्णनात्मक नामों का प्रयोग करें
- कॉलबैक के लिए एरो फ़ंक्शन का उपयोग करें
- वादों के लिए एसिंक/प्रतीक्षा का उपयोग करें
- दस्तावेज़ जटिल कार्य
- कैश DOM तत्व
- इवेंट डेलिगेशन का उपयोग करें
- शुद्ध कार्य लिखें
- कार्यों को केंद्रित रखें

### मत करो

- var का उपयोग करें (विरासत)
- वैश्विक चर का प्रयोग करें
- लंबे फ़ंक्शन बनाएं (50 से अधिक लाइनें)
- गहराई से घोंसला कोड
- eval() का प्रयोग करें
- इनलाइन इवेंट हैंडलर का उपयोग करें
- कंसोल.log() को उत्पादन में छोड़ दें
- मेमोरी लीक बनाएं
- फ़ंक्शन मापदंडों को बदलें

---

## उपकरण और लिंटिंग

### ईएसलिंट कॉन्फ़िगरेशन

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

### सुंदर विन्यास

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

## संबंधित दस्तावेज़ीकरण

- CSS दिशानिर्देश
-आचार संहिता
- योगदान कार्यप्रवाह
- PHP मानक

---

#xoops #javascript #es6 #कोडिंग-मानक #सर्वोत्तम अभ्यास