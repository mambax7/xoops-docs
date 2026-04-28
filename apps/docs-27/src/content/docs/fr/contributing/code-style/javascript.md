---
title: "Normes de Codage JavaScript"
description: "Normes de codage JavaScript XOOPS et meilleures pratiques"
---

# Normes JavaScript

> XOOPS suit les normes JavaScript modernes (ES6+) en mettant l'accent sur la lisibilité et la maintenabilité.

---

## Aperçu

Les normes JavaScript de XOOPS sont basées sur:

- **ECMAScript 2015+** (ES6 et fonctionnalités modernes)
- **Guide de Style JavaScript d'Airbnb** (adapté)
- **Conventions XOOPS** pour la cohérence
- **Normes d'accessibilité** (WCAG)

---

## Structure des Fichiers

### Organisation des Fichiers

```javascript
// 1. Commentaire d'en-tête du fichier
/**
 * Module XOOPS - Nom de la Fonctionnalité
 * @file Gère les interactions utilisateur sur le tableau de bord
 * @author Votre Nom <email@example.com>
 * @copyright 2026 Projet XOOPS
 * @license GPL-2.0-or-later
 */

// 2. Imports
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Constantes
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Configuration du module
const Dashboard = {};

// 5. Fonctions privées
function initializeUI() {
  // ...
}

// 6. Méthodes publiques
Dashboard.init = function () {
  // ...
};

// 7. Exports
export default Dashboard;
```

### Nommage des Fichiers

```javascript
// Utilisez des minuscules avec des tirets
dashboard.js
user-profile.js
form-validator.js
api-client.js

// Composants React (PascalCase)
UserProfile.jsx
FormValidator.jsx
Dashboard.jsx
```

---

## Variables et Constantes

### Déclaration de Variables

```javascript
// Utilisez const par défaut
const maxRetries = 3;
const userName = 'John';

// Utilisez let pour les variables qui changent
let currentIndex = 0;

// Évitez var (legacy)
// ❌ var oldStyle = true;

// Les objets et tableaux const peuvent avoir leur contenu modifié
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Erreur

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Erreur
```

### Nommage des Variables

```javascript
// Utilisez des noms descriptifs
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Les variables booléennes doivent indiquer l'état
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Peu clair

// Les tableaux doivent utiliser des noms au pluriel
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### Constantes

```javascript
// UPPER_SNAKE_CASE pour les constantes de niveau module
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase pour les propriétés d'objet (même les constantes)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## Fonctions

### Déclaration de Fonction

```javascript
// Fonctions nommées (préférées pour la réutilisabilité)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Fonctions fléchées (préférées pour les callbacks)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Fonctions fléchées courtes
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Évitez les expressions de fonction anonyme
// ❌ const fn = function() {};
```

### Nommage des Fonctions

```javascript
// Utilisez des noms basés sur des verbes descriptifs
function getUserById(id) { }       // ✅ Décrit ce qu'il récupère
function validateUserInput(data) { } // ✅ Décrit l'action
function formatDate(date) { }      // ✅ Décrit la transformation

// Évitez les lettres uniques sauf dans les cas évidents (boucles)
function f(x) { }    // ❌
function fetch() { } // ❌ Conflit avec la globale
```

### Paramètres de Fonction

```javascript
// Utilisez des noms de paramètres clairs
function addUser(name, email, role = 'user') {
  // ...
}

// Utilisez la déstructuration pour les objets
function createPost({ title, content, author, published = false }) {
  // ...
}

// Documentez les fonctions complexes
/**
 * Récupère les données utilisateur de l'API
 * @param {number} userId - L'ID utilisateur à récupérer
 * @param {Object} options - Paramètres optionnels
 * @param {boolean} options.includeProfile - Inclure les données de profil
 * @returns {Promise<Object>} Objet de données utilisateur
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## Classes et Objets

### Définition de Classe

```javascript
/**
 * Représente un utilisateur dans le système
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * Obtenir le nom d'affichage de l'utilisateur
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * Valider l'email de l'utilisateur
   * @returns {boolean}
   */
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}

// Utilisation
const user = new User('John Doe', 'john@example.com');
console.log(user.getDisplayName());
```

### Littéraux d'Objet

```javascript
// Utilisez l'abréviation d'objet
const name = 'John';
const age = 30;

// Propriétés abrégées (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} is ${this.age} years old`;
  },
};

// Sans abréviation (à éviter)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## Formatage

### Espacement et Indentation

```javascript
// Utilisez 2 espaces pour l'indentation (ou 4, soyez cohérent)
function example() {
  if (true) {
    console.log('Indented');
  }
}

// Espaces autour des opérateurs
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// Pas d'espace à l'intérieur des parenthèses
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Espace avant les accolades de fonction
function test() { }      // ✅
function test(){ }       // ❌
```

### Longueur des Lignes

```javascript
// Maximum 100 caractères par ligne (ou 120)
// Casser les longues lignes logiquement

// Longues chaînes
const message = 'This is a very long message that ' +
  'continues on the next line';

// Appels de fonction longs
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Conditionnelles longues
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### Points-Virgules

```javascript
// Utilisez des points-virgules
const x = 5; // ✅
const y = 10;

// Ne pas utiliser de points-virgules (ASI - Insertion Automatique de Points-Virgules)
const x = 5  // ❌ À éviter
```

---

## Chaînes de Caractères

### Littéraux de Chaîne

```javascript
// Utilisez des guillemets simples pour la cohérence
const name = 'John'; // ✅

// Ou des guillemets doubles - soyez juste cohérent
const name = "John";

// Utilisez les backticks pour les littéraux de modèle (interpolation)
const greeting = `Hello, ${name}!`; // ✅

// Évitez la concaténation
const message = 'Hello ' + name; // ❌
const message = `Hello ${name}`; // ✅

// Chaînes multi-lignes
const html = `
  <div>
    <h1>${title}</h1>
    <p>${content}</p>
  </div>
`;
```

---

## Tableaux

### Méthodes de Tableau

```javascript
// Préférez les méthodes de tableau modernes
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

### Déstructuration de Tableau

```javascript
// Extraire les éléments du tableau
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Ignorer les éléments
const [,, third] = [1, 2, 3];
// third = 3

// Utiliser dans les paramètres de fonction
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## Objets

### Déstructuration d'Objet

```javascript
// Extraire les propriétés d'objet
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Renommer les propriétés
const { name: userName, email: userEmail } = user;

// Valeurs par défaut
const { role = 'user' } = user;

// Déstructuration imbriquée
const { user: { name, email } } = response;

// Paramètres de fonction
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### Opérateur de Propagation

```javascript
// Copier des tableaux
const original = [1, 2, 3];
const copy = [...original];

// Fusionner des tableaux
const merged = [...arr1, ...arr2];

// Copier des objets
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Fusionner des objets
const merged = { ...defaults, ...options };

// Mettre à jour les propriétés
const updated = { ...user, email: 'newemail@example.com' };
```

---

## Programmation Asynchrone

### Promises

```javascript
// Promise basique
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Méthodes Promise
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

Promise.race([p1, p2])
  .then(result => console.log(result));
```

### Async/Await

```javascript
// Préféré pour la lisibilité
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

// Utilisation
const user = await fetchUser(123);

// Opérations multiples
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## Commentaires et Documentation

### Commentaires Intégrés

```javascript
// Expliquez POURQUOI, pas QUOI
const result = calculateTotal(items, taxRate); // ✅ Pourquoi

// ❌ N'expliquez pas le code évident
const x = 5; // Définir x à 5
const sum = a + b; // Ajouter a et b
```

### Commentaires JSDoc

```javascript
/**
 * Calcule le prix total des articles incluant la taxe
 *
 * @param {Array<Object>} items - Tableau d'articles avec propriété price
 * @param {number} taxRate - Taux de taxe comme décimal (0.1 = 10%)
 * @returns {number} Prix total incluant la taxe
 * @throws {Error} Si les articles ne forment pas un tableau
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

## Gestion des Erreurs

### Try/Catch

```javascript
// Gérez toujours les erreurs
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
} finally {
  cleanup();
}

// Soyez spécifique avec les erreurs
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

### Erreurs Personnalisées

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utilisation
if (!isValidEmail(email)) {
  throw new ValidationError(`Invalid email: ${email}`);
}
```

---

## Manipulation du DOM

### Sélection des Éléments

```javascript
// Méthodes modernes (préférées)
const element = document.querySelector('#my-id');
const elements = document.querySelectorAll('.my-class');

// Évitez les méthodes plus anciennes
// const el = document.getElementById('my-id'); // ❌
// const els = document.getElementsByClassName('my-class'); // ❌

// Mettez en cache les éléments
const button = document.querySelector('button');
button.addEventListener('click', handler);
```

### Gestion des Événements

```javascript
// Utilisez addEventListener
element.addEventListener('click', (event) => {
  event.preventDefault();
  handleClick();
});

// Supprimez les écouteurs
element.removeEventListener('click', handler);

// Délégation d'événement
container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleItemClick(event.target);
  }
});
```

### Mises à Jour du DOM

```javascript
// Utilisez textContent (plus sûr que innerHTML)
element.textContent = 'Safe text'; // ✅

// Utilisez innerHTML uniquement pour le contenu de confiance
element.innerHTML = `<b>${escapeHtml(text)}</b>`;

// Manipulation des classes
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('disabled');

// Manipulation des attributs
element.setAttribute('data-id', userId);
const id = element.getAttribute('data-id');
element.removeAttribute('disabled');
```

---

## Motif de Module

### Modules ES6

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

## Résumé des Meilleures Pratiques

### À Faire

- Utilisez const par défaut
- Utilisez des noms descriptifs
- Utilisez les fonctions fléchées pour les callbacks
- Utilisez async/await pour les promises
- Documentez les fonctions complexes
- Mettez en cache les éléments DOM
- Utilisez la délégation d'événement
- Écrivez des fonctions pures
- Gardez les fonctions concentrées

### À Éviter

- Utilisez var (legacy)
- Utilisez les variables globales
- Créez des fonctions longues (plus de 50 lignes)
- Imbriquez le code profondément
- Utilisez eval()
- Utilisez les gestionnaires d'événement intégrés
- Laissez console.log() en production
- Créez des fuites mémoire
- Mutez les paramètres de fonction

---

## Outils et Linting

### Configuration ESLint

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

### Configuration Prettier

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

## Documentation Connexe

- Directives CSS
- Code de Conduite
- Flux de Contribution
- Normes PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
