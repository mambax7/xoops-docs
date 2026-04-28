---
title: "Padrões de Codificação JavaScript"
description: "Padrões de codificação JavaScript do XOOPS e melhores práticas"
---

# Padrões JavaScript

> XOOPS segue padrões JavaScript modernos (ES6+) com ênfase em legibilidade e manutenibilidade.

---

## Visão Geral

Padrões JavaScript do XOOPS baseiam-se em:

- **ECMAScript 2015+** (ES6 e recursos modernos)
- **Guia de Estilo JavaScript Airbnb** (adaptado)
- **Convenções XOOPS** para consistência
- **Padrões de acessibilidade** (WCAG)

---

## Estrutura de Arquivo

### Organização de Arquivo

```javascript
// 1. Comentário de cabeçalho de arquivo
/**
 * XOOPS Módulo - Nome de Recurso
 * @file Manipula interações de usuário no dashboard
 * @author Seu Nome <email@example.com>
 * @copyright 2026 Projeto XOOPS
 * @license GPL-2.0-or-later
 */

// 2. Imports
import { Helper } from './helpers.js';
import { API } from './api.js';

// 3. Constantes
const DEFAULT_TIMEOUT = 5000;
const API_ENDPOINT = '/api/v1';

// 4. Configuração de módulo
const Dashboard = {};

// 5. Funções privadas
function initializeUI() {
  // ...
}

// 6. Métodos públicos
Dashboard.init = function () {
  // ...
};

// 7. Exports
export default Dashboard;
```

### Nomenclatura de Arquivo

```javascript
// Use minúsculas com hífens
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

## Variáveis e Constantes

### Declaração de Variável

```javascript
// Use const por padrão
const maxRetries = 3;
const userName = 'John';

// Use let para variáveis que mudam
let currentIndex = 0;

// Evite var (legado)
// ❌ var oldStyle = true;

// Const objetos e arrays podem ter conteúdo modificado
const user = { name: 'John' };
user.name = 'Jane'; // ✅ OK
user = {}; // ❌ Erro

const numbers = [1, 2, 3];
numbers.push(4); // ✅ OK
numbers = []; // ❌ Erro
```

### Nomenclatura de Variável

```javascript
// Use nomes descritivos
const userName = 'John'; // ✅
const un = 'John'; // ❌

// Variáveis booleanas devem indicar estado
const isActive = true; // ✅
const hasPermission = false; // ✅
const canEdit = true; // ✅
const active = true; // ❌ Pouco claro

// Arrays devem usar nomes plurais
const users = ['John', 'Jane'];
const userList = ['John', 'Jane'];
const items = [];
```

### Constantes

```javascript
// UPPER_SNAKE_CASE para constantes de nível de módulo
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;
const DEFAULT_PAGE_SIZE = 10;

// camelCase para propriedades de objeto (até constantes)
const config = {
  apiTimeout: 5000,
  maxRetries: 3,
  defaultPageSize: 10,
};
```

---

## Funções

### Declaração de Função

```javascript
// Funções nomeadas (preferidas para reutilização)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Funções arrow (preferidas para callbacks)
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Funções arrow curtas
const isPositive = (num) => num > 0;
const double = (x) => x * 2;

// Evite expressões de função anônima
// ❌ const fn = function() {};
```

### Nomenclatura de Função

```javascript
// Use nomes descritivos baseados em verbo
function getUserById(id) { }       // ✅ Descreve o que pega
function validateUserInput(data) { } // ✅ Descreve ação
function formatDate(date) { }      // ✅ Descreve transformação

// Evite letras únicas exceto em casos óbvios (loops)
function f(x) { }    // ❌
function fetch() { } // ❌ Conflita com global
```

### Parâmetros de Função

```javascript
// Use nomes de parâmetro claros
function addUser(name, email, role = 'user') {
  // ...
}

// Use desestruturação para objetos
function createPost({ title, content, author, published = false }) {
  // ...
}

// Documente funções complexas
/**
 * Buscar dados de usuário da API
 * @param {number} userId - O ID de usuário para buscar
 * @param {Object} options - Configurações opcionais
 * @param {boolean} options.includeProfile - Incluir dados de perfil
 * @returns {Promise<Object>} Objeto de dados de usuário
 */
async function fetchUser(userId, options = {}) {
  const { includeProfile = false } = options;
  // ...
}
```

---

## Classes e Objetos

### Definição de Classe

```javascript
/**
 * Representa um usuário no sistema
 */
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = null;
  }

  /**
   * Obter nome de exibição do usuário
   * @returns {string}
   */
  getDisplayName() {
    return this.name.trim();
  }

  /**
   * Validar email do usuário
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

### Literais de Objeto

```javascript
// Use shorthand de objeto
const name = 'John';
const age = 30;

// Propriedades shorthand (ES6)
const person = {
  name,
  age,
  getInfo() {
    return `${this.name} tem ${this.age} anos`;
  },
};

// Sem shorthand (evitar)
// const person = {
//   name: name,
//   age: age,
//   getInfo: function() { }
// };
```

---

## Formatação

### Espaçamento e Indentação

```javascript
// Use 2 espaços para indentação (ou 4, seja consistente)
function example() {
  if (true) {
    console.log('Indentado');
  }
}

// Espaços ao redor de operadores
const x = 5 + 3;        // ✅
const y = 5+3;          // ❌
const z = isDone ? 'yes' : 'no'; // ✅

// Sem espaço dentro de parênteses
if (condition) { }       // ✅
if ( condition ) { }     // ❌

// Espaço antes de braces de função
function test() { }      // ✅
function test(){ }       // ❌
```

### Comprimento de Linha

```javascript
// Máximo 100 caracteres por linha (ou 120)
// Quebre linhas logicamente

// Strings longas
const message = 'Esta é uma mensagem muito longa que ' +
  'continua na próxima linha';

// Chamadas de função longas
const result = myFunction(
  parameter1,
  parameter2,
  parameter3
);

// Condicionais longas
if (condition1 &&
    condition2 &&
    condition3) {
  // ...
}
```

### Pontos e Vírgulas

```javascript
// Use pontos e vírgulas
const x = 5; // ✅
const y = 10;

// Não confie em inserção automática de ponto e vírgula
const x = 5  // ❌ Evite confiar nisso
```

---

## Strings

### Literais de String

```javascript
// Use aspas simples para consistência
const name = 'John'; // ✅

// Ou aspas duplas - apenas seja consistente
const name = "John";

// Use template literals para interpolação
const greeting = `Olá, ${name}!`; // ✅

// Evite concatenação
const message = 'Olá ' + name; // ❌
const message = `Olá ${name}`; // ✅

// Strings multi-linha
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
// Prefira métodos de array modernos
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

### Desestruturação de Array

```javascript
// Extrair elementos de array
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Pular elementos
const [,, third] = [1, 2, 3];
// third = 3

// Usar em parâmetros de função
function processItems([first, second]) {
  console.log(first, second);
}
```

---

## Objetos

### Desestruturação de Objeto

```javascript
// Extrair propriedades de objeto
const user = { name: 'John', email: 'john@example.com' };
const { name, email } = user;

// Renomear propriedades
const { name: userName, email: userEmail } = user;

// Valores padrão
const { role = 'user' } = user;

// Desestruturação aninhada
const { user: { name, email } } = response;

// Parâmetros de função
function displayUser({ name, email, role = 'user' }) {
  console.log(`${name} (${role})`);
}
```

### Operador Spread

```javascript
// Copiar arrays
const original = [1, 2, 3];
const copy = [...original];

// Mesclar arrays
const merged = [...arr1, ...arr2];

// Copiar objetos
const user = { name: 'John', email: 'john@example.com' };
const userCopy = { ...user };

// Mesclar objetos
const merged = { ...defaults, ...options };

// Atualizar propriedades
const updated = { ...user, email: 'newemail@example.com' };
```

---

## Programação Assíncrona

### Promises

```javascript
// Promise básica
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
// Preferido para legibilidade
async function fetchUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Usuário não encontrado');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar usuário:', error);
    throw error;
  }
}

// Uso
const user = await fetchUser(123);

// Múltiplas operações
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();

  return { users, posts, comments };
}
```

---

## Comentários e Documentação

### Comentários Inline

```javascript
// Explique POR QUE, não O QUE
const result = calculateTotal(items, taxRate); // ✅ Por quê

// ❌ Não explique código óbvio
const x = 5; // Definir x para 5
const sum = a + b; // Adicionar a e b
```

### Comentários JSDoc

```javascript
/**
 * Calcular o preço total de itens incluindo imposto
 *
 * @param {Array<Object>} items - Array de itens com propriedade price
 * @param {number} taxRate - Taxa de imposto como decimal (0.1 = 10%)
 * @returns {number} Preço total incluindo imposto
 * @throws {Error} Se items não for um array
 * @example
 * const total = calculateTotal(
 *   [{ price: 100 }, { price: 50 }],
 *   0.1
 * );
 * console.log(total); // 165
 */
function calculateTotal(items, taxRate = 0) {
  if (!Array.isArray(items)) {
    throw new Error('Items deve ser um array');
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

---

## Manipulação de Erros

### Try/Catch

```javascript
// Sempre manipule erros
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Operação falhou:', error);
} finally {
  cleanup();
}

// Seja específico com erros
try {
  const data = JSON.parse(jsonString);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('JSON inválido');
  } else {
    console.error('Erro desconhecido');
  }
}
```

### Erros Customizados

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Uso
if (!isValidEmail(email)) {
  throw new ValidationError(`Email inválido: ${email}`);
}
```

---

## Melhores Práticas Resumidas

### Faça

- Use const por padrão
- Use nomes descritivos
- Use funções arrow para callbacks
- Use async/await para promises
- Documente funções complexas
- Cache elementos DOM
- Use delegação de evento
- Escreva funções puras
- Mantenha funções focadas

### Não Faça

- Use var (legado)
- Use variáveis globais
- Crie funções longas (mais de 50 linhas)
- Aninha código profundamente
- Use eval()
- Use manipuladores de evento inline
- Deixe console.log() em produção
- Crie vazamentos de memória
- Mute parâmetros de função

---

## Ferramentas e Linting

### Configuração ESLint

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

### Configuração Prettier

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

## Documentação Relacionada

- Diretrizes CSS
- Código de Conduta
- Fluxo de Contribuição
- Padrões PHP

---

#xoops #javascript #es6 #coding-standards #best-practices
