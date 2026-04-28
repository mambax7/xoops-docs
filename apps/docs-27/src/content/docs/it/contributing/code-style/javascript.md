---
title: "Standard di Codifica JavaScript"
description: "Standard di codifica JavaScript di XOOPS e best practice"
---

# Standard JavaScript

> XOOPS segue standard JavaScript moderni (ES6+) con enfasi su leggibilità e manutenibilità.

---

## Panoramica

Gli standard JavaScript di XOOPS sono basati su:

- **ECMAScript 2015+** (ES6 e funzionalità moderne)
- **Airbnb JavaScript Style Guide** (adattata)
- **Convenzioni XOOPS** per coerenza
- **Standard accessibilità** (WCAG)

---

## Struttura File

### Organizzazione File

```javascript
// 1. Commento header file
/**
 * XOOPS Module - Feature Name
 * @file Gestisce interazioni utente sul dashboard
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 */

// 2. Import
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Costanti
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Setup modulo
const Dashboard = {};

// 5. Funzioni private
function initializeUI() {
  // ...
}

// 6. Metodi pubblici
Dashboard.init = function () {
  // ...
};

// 7. Export
export default Dashboard;
```

### Naming File

```javascript
// Usa lowercase con trattini
dashboard.js
user-profile.js
form-validator.js
api-client.js

// Componenti React (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## Variabili e Costanti

### Dichiarazione Variabili

```javascript
// Usa const per default
const maxRetries = 3;
const userName = 'John';

// Usa let per variabili che cambiano
let currentIndex = 0;

// Evita var (legacy)
// ❌ var oldStyle = true;

// Oggetti e array const possono avere contenuti modificati
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Errore

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Errore
```

### Naming Variabili

```javascript
// Usa nomi descrittivi
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Le variabili booleane devono indicare lo stato
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Poco chiaro

// Array devono usare nomi plurali
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### Costanti

```javascript
// UPPER_SNAKE_CASE per costanti a livello modulo
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase per proprietà oggetto (anche costanti)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## Funzioni

### Dichiarazione Funzione

```javascript
// Funzioni nominate (preferite per riusabilità)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Arrow function (preferite per callback)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Short arrow function
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Evita espressioni funzione anonime
// ❌ const fn = function() {};
```

### Naming Funzione

```javascript
// Usa nomi descrittivi basati su verbo
function getUserById(id) { }       // ✅ Descrive cosa prende
function validateUserInput(data) { } // ✅ Descrive azione
function formatDate(date) { }      // ✅ Descrive trasformazione

// Evita singole lettere eccetto in casi ovvi (loop)
function f(x) { }    // ❌
function fetch() { } // ❌ Conflitto con globale
```

### Parametri Funzione

```javascript
// Usa nomi parametri chiari
function addUser(name, email, role = 'user') {
  // ...
}

// Usa destructuring per oggetti
function createPost({ title, content, author, published = false }) {
  // ...
}

// Documenta funzioni complesse
/**
 * Recupera dati utente da API
 * @param {number} userId - L'ID utente da recuperare
 * @param {Object} options - Impostazioni opzionali
 * @param {boolean} options.includeProfile - Includi dati profilo
 * @returns {Promise<Object>} Oggetto dati utente
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## Classi e Oggetti

### Definizione Classe

```javascript
/**
 * Rappresenta un utente nel sistema
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * Ottiene nome display utente
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * Convalida email utente
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// Utilizzo
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### Object Literals

```javascript
// Usa shorthand oggetto
const name = 'John';
const age = 30;

// Proprietà shorthand (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} è ${this.age} anni`;
  },
};

// Senza shorthand (evita)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## Formattazione

### Spacing e Indentazione

```javascript
// Usa 2 spazi per indentazione (o 4, sii coerente)
function example() {
  if (true) {
    console.log('Indentato');
  }
}

// Spazi attorno operatori
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// Nessuno spazio dentro parentesi
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Spazio prima function braces
function test() { }      // ✅
function test(){ }       // ❌
```

### Lunghezza Linea

```javascript
// Massimo 100 caratteri per linea (o 120)
// Spezza lunghe linee logicamente

// Stringhe lunghe
const message = 'Questo è un messaggio molto lungo che ' +
  'continua sulla linea successiva';

// Lunghe chiamate funzione
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Lunghi condizionali
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### Semicoloni

```javascript
// Usa semicoloni
const x = 5; // ✅
const y = 10;

// Non usare semicoloni (ASI - Automatic Semicolon Insertion)
const x = 5  // ❌ Evita di affidarsi a questo
```

---

## Stringhe

### String Literals

```javascript
// Usa single quote per coerenza
const name = 'John'; // ✅

// O double quote - sii coerente
const name = "John";

// Usa backtick per template literal (interpolazione)
const greeting = `Hello, ${name}!`; // ✅

// Evita concatenazione
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// Stringhe multi-linea
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## Array

### Metodi Array

```javascript
// Preferisci metodi array moderni
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

### Array Destructuring

```javascript
// Estrai elementi array
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Salta elementi
const [,, third] = [1, 2, 3];
// third = 3

// Usa nei parametri funzione
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## Oggetti

### Object Destructuring

```javascript
// Estrai proprietà oggetto
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Rinomina proprietà
const { name: userName, email: userEmail } = user;

// Valori default
const { role = 'user' } = user;

// Destructuring annidato
const { user: { name, email } } = response;

// Parametri funzione
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### Spread Operator

```javascript
// Copia array
const original = [1, 2, 3];
const copy = [...original];

// Merge array
const merged = [...arr1, ...arr2];

// Copia oggetti
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Merge oggetti
const merged = { ...defaults, ...options };

// Aggiorna proprietà
const updated = { ...user, email: 'newemail@example.com' };
```

---

## Programmazione Asincrona

### Promise

```javascript
// Promise base
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Metodi Promise
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### Async/Await

```javascript
// Preferita per leggibilità
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

// Utilizzo
const user = await fetchUser(123);

// Operazioni multiple
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## Commenti e Documentazione

### Commenti Inline

```javascript
// Spiega PERCHÉ, non COSA
const result = calculateTotal(items, taxRate); // ✅ Perché

// ❌ Non spiegare codice ovvio
const x = 5; // Imposta x a 5
const sum = a + b; // Somma a e b
```

### Commenti JSDoc

```javascript
/**
 * Calcola il prezzo totale degli articoli incluse tasse
 *
 * @param {Array<Object>} items - Array di articoli con proprietà price
 * @param {number} taxRate - Aliquota tasse come decimale (0.1 = 10%)
 * @returns {number} Prezzo totale incluse tasse
 * @throws {Error} Se items non è un array
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

## Gestione Errori

### Try/Catch

```javascript
// Gestisci sempre gli errori
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// Sii specifico con gli errori
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

### Errori Personalizzati

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utilizzo
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## Manipolazione DOM

### Selezione Elementi

```javascript
// Metodi moderni (preferiti)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// Evita metodi precedenti
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// Cache elementi
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### Event Handling

```javascript
// Usa addEventListener
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// Rimuovi listener
element.removeEventListener('click', handler);

// Event delegation
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### Aggiornamenti DOM

```javascript
// Usa textContent (più sicuro di innerHTML)
element.textContent = 'Safe text'; // ✅

// Usa innerHTML solo per contenuto trusted
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// Manipolazione classi
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// Manipolazione attributi
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## Modello Modulo

### Moduli ES6

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

## Riassunto Best Practice

### Da Fare

- Usa const per default
- Usa nomi descrittivi
- Usa arrow function per callback
- Usa async/await per promise
- Documenta funzioni complesse
- Cache elementi DOM
- Usa event delegation
- Scrivi funzioni pure
- Mantieni funzioni focalizzate

### Da Non Fare

- Non usare var (legacy)
- Non usare variabili globali
- Non creare funzioni lunghe (oltre 50 linee)
- Non annidare codice profondamente
- Non usare eval()
- Non usare event handler inline
- Non lasciare console.log() in produzione
- Non creare memory leak
- Non mutare parametri funzione

---

## Strumenti e Linting

### Configurazione ESLint

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

### Configurazione Prettier

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

## Documentazione Correlata

- Linee Guida CSS
- Codice di Condotta
- Workflow Contribuzione
- Standard PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
