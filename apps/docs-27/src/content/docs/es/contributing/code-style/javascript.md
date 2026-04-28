---
title: "Estándares de Codificación JavaScript"
description: "Estándares de codificación JavaScript de XOOPS y mejores prácticas"
---

# Estándares JavaScript

> XOOPS sigue estándares JavaScript modernos (ES6+) con énfasis en legibilidad y mantenibilidad.

---

## Resumen

Los estándares JavaScript de XOOPS se basan en:

- **ECMAScript 2015+** (ES6 y características modernas)
- **Guía de Estilo JavaScript de Airbnb** (adaptada)
- **Convenciones XOOPS** para consistencia
- **Estándares de accesibilidad** (WCAG)

---

## Estructura de Archivos

### Organización de Archivos

```javascript
// 1. Comentario de encabezado del archivo
/**
 * XOOPS Module - Feature Name
 * @file Handles user interactions on the dashboard
 * @author Your Name <email@example.com>
 * @copyright 2026 XOOPS Project
 * @license GPL-2.0-or-later
 */

// 2. Importaciones
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Constantes
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Configuración de módulo
const Dashboard = {};

// 5. Funciones privadas
function initializeUI() {
  // ...
}

// 6. Métodos públicos
Dashboard.init = function () {
  // ...
};

// 7. Exportaciones
export default Dashboard;
```

### Nomenclatura de Archivos

```javascript
// Usar minúsculas con guiones
dashboard.js
user-profile.js
form-validator.js
api-client.js

// Componentes React (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## Variables y Constantes

### Declaración de Variables

```javascript
// Usar const por defecto
const maxRetries = 3;
const userName = 'John';

// Usar let para variables que cambian
let currentIndex = 0;

// Evitar var (legado)
// ❌ var oldStyle = true;

// Los objetos const y arrays pueden tener contenidos modificados
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Error

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Error
```

### Nombres de Variables

```javascript
// Usar nombres descriptivos
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Las variables booleanas deben indicar estado
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Poco claro

// Los arrays deben usar nombres plurales
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### Constantes

```javascript
// UPPER_SNAKE_CASE para constantes a nivel de módulo
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase para propiedades de objeto (incluso constantes)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## Funciones

### Declaración de Funciones

```javascript
// Funciones nombradas (preferidas para reutilización)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Funciones flecha (preferidas para callbacks)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Funciones flecha cortas
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Evitar expresiones de función anónimas
// ❌ const fn = function() {};
```

### Nombres de Funciones

```javascript
// Usar nombres descriptivos basados en verbos
function getUserById(id) { }       // ✅ Describe qué obtiene
function validateUserInput(data) { } // ✅ Describe la acción
function formatDate(date) { }      // ✅ Describe la transformación

// Evitar letras individuales excepto en casos obvios (bucles)
function f(x) { }    // ❌
function fetch() { } // ❌ Conflicto con global
```

### Parámetros de Función

```javascript
// Usar nombres de parámetros claros
function addUser(name, email, role = 'user') {
  // ...
}

// Usar desestructuración para objetos
function createPost({ title, content, author, published = false }) {
  // ...
}

// Documentar funciones complejas
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

## Clases y Objetos

### Definición de Clases

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

// Uso
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### Literales de Objeto

```javascript
// Usar forma abreviada de objeto
const name = 'John';
const age = 30;

// Propiedades abreviadas (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// Sin forma abreviada (evitar)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## Formato

### Espaciado e Indentación

```javascript
// Usar 2 espacios para indentación (o 4, ser consistente)
function example() {
  if (true) {
    console.log('Indented');
  }
}

// Espacios alrededor de operadores
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// Sin espacio dentro de paréntesis
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Espacio antes de llaves de función
function test() { }      // ✅
function test(){ }       // ❌
```

### Longitud de Línea

```javascript
// Máximo 100 caracteres por línea (o 120)
// Romper líneas largas lógicamente

// Cadenas largas
const message = 'This is a very long message that ' +
  'continues on the next line';

// Llamadas de función largas
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Condicionales largos
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### Punto y Coma

```javascript
// Usar punto y coma
const x = 5; // ✅
const y = 10;

// No usar punto y coma (ASI - Automatic Semicolon Insertion)
const x = 5  // ❌ Evitar confiar en esto
```

---

## Cadenas

### Literales de Cadena

```javascript
// Usar comillas simples para consistencia
const name = 'John'; // ✅

// O comillas dobles - solo ser consistente
const name = "John";

// Usar comillas invertidas para plantillas literales (interpolación)
const greeting = `Hello, ${name}!`; // ✅

// Evitar concatenación
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// Cadenas multilínea
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## Arrays

### Métodos de Array

```javascript
// Preferir métodos de array modernos
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

### Desestructuración de Array

```javascript
// Extraer elementos de array
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Omitir elementos
const [,, third] = [1, 2, 3];
// third = 3

// Usar en parámetros de función
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## Objetos

### Desestructuración de Objeto

```javascript
// Extraer propiedades de objeto
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Renombrar propiedades
const { name: userName, email: userEmail } = user;

// Valores por defecto
const { role = 'user' } = user;

// Desestructuración anidada
const { user: { name, email } } = response;

// Parámetros de función
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### Operador Spread

```javascript
// Copiar arrays
const original = [1, 2, 3];
const copy = [...original];

// Fusionar arrays
const merged = [...arr1, ...arr2];

// Copiar objetos
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Fusionar objetos
const merged = { ...defaults, ...options };

// Actualizar propiedades
const updated = { ...user, email: 'newemail@example.com' };
```

---

## Programación Asincrónica

### Promises

```javascript
// Promise básico
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Métodos de Promise
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### Async/Await

```javascript
// Preferido para legibilidad
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

// Uso
const user = await fetchUser(123);

// Operaciones múltiples
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## Comentarios y Documentación

### Comentarios Inline

```javascript
// Explicar POR QUÉ, no QUÉ
const result = calculateTotal(items, taxRate); // ✅ Por qué

// ❌ No explicar código obvio
const x = 5; // Set x to 5
const sum = a + b; // Add a and b
```

### Comentarios JSDoc

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

## Manejo de Errores

### Try/Catch

```javascript
// Siempre manejar errores
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// Ser específico con errores
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

### Errores Personalizados

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Uso
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## Manipulación del DOM

### Seleccionar Elementos

```javascript
// Métodos modernos (preferidos)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// Evitar métodos antiguos
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// Cachear elementos
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### Manejo de Eventos

```javascript
// Usar addEventListener
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// Remover listeners
element.removeEventListener('click', handler);

// Delegación de eventos
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### Actualizaciones del DOM

```javascript
// Usar textContent (más seguro que innerHTML)
element.textContent = 'Safe text'; // ✅

// Usar innerHTML solo para contenido confiable
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// Manipulación de clases
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// Manipulación de atributos
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## Patrón de Módulo

### Módulos ES6

```javascript
// Exportar
export const helper = () => { };
export default Dashboard;

// Importar
import Dashboard from './dashboard.js';
import { helper } from './helper.js';
import * as utils from './utils.js';
```

---

## Resumen de Mejores Prácticas

### Si

- Usar const por defecto
- Usar nombres descriptivos
- Usar funciones flecha para callbacks
- Usar async/await para promises
- Documentar funciones complejas
- Cachear elementos del DOM
- Usar delegación de eventos
- Escribir funciones puras
- Mantener funciones enfocadas

### No

- No usar var (legado)
- No usar variables globales
- No crear funciones largas (más de 50 líneas)
- No anidar código profundamente
- No usar eval()
- No usar manejadores de eventos en línea
- No dejar console.log() en producción
- No crear fugas de memoria
- No mutar parámetros de función

---

## Herramientas y Linting

### Configuración ESLint

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

### Configuración Prettier

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

## Documentación Relacionada

- Directrices CSS
- Código de Conducta
- Flujo de Contribución
- Estándares PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
