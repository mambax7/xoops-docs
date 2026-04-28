---
title: "Лучшие практики интеграции фронтенда"
description: "Bootstrap 5, Tailwind CSS, JavaScript и паттерны AJAX"
---

# Лучшие практики интеграции фронтенда в XOOPS

Современные модули XOOPS требуют чистой интеграции фронтенда с адаптивным дизайном, правильными паттернами JavaScript и функциональностью AJAX.

## Интеграция Bootstrap 5

```smarty
{* Включите CSS Bootstrap *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* Ваше содержимое *}
<div class="container mt-4">
    <h1>Мой модуль</h1>
</div>

{* Включите JS Bootstrap *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Пример формы Bootstrap

```smarty
<div class="card">
    <div class="card-body">
        <form method="POST" class="needs-validation">
            <div class="mb-3">
                <label for="username" class="form-label">Имя пользователя</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            
            <button type="submit" class="btn btn-primary">Отправить</button>
        </form>
    </div>
</div>
```

### Пример таблицы Bootstrap

```smarty
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Email</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$users item=user}
                <tr>
                    <td>{$user.id|escape}</td>
                    <td>{$user.username|escape}</td>
                    <td>{$user.email|escape}</td>
                    <td>
                        <a href="?op=edit&id={$user.id}" class="btn btn-sm btn-warning">Редактировать</a>
                        <a href="?op=delete&id={$user.id}" class="btn btn-sm btn-danger">Удалить</a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
```

## Лучшие практики JavaScript

```javascript
// Паттерн модуля
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // Инициализируйте подсказки Bootstrap
    },
    
    initEventListeners: function() {
        // Прикрепите обработчики событий
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                return confirm('Удалить этот элемент?');
            }
        });
    },
    
    notify: function(message, type = 'info') {
        const alertClass = `alert-${type}`;
        const html = `
            <div class="alert ${alertClass} alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', html);
    }
};

// Инициализируйте, когда DOM готов
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## Реализация AJAX

```javascript
const AjaxHelper = {
    request: function(url, options = {}) {
        const defaults = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        
        const config = { ...defaults, ...options };
        
        return fetch(url, {
            method: config.method,
            headers: config.headers,
            body: config.body ? JSON.stringify(config.body) : null
        })
        .then(response => response.json())
        .catch(error => console.error('Ошибка:', error));
    },
    
    get: function(url) {
        return this.request(url, { method: 'GET' });
    },
    
    post: function(url, data) {
        return this.request(url, { method: 'POST', body: data });
    }
};

// Использование
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('Загружено успешно', 'success');
        }
    });
```

## Контроллер API AJAX

```php
<?php
class ApiController
{
    public function getUsersAction()
    {
        try {
            $users = $this->userService->getActiveUsers();
            
            return [
                'success' => true,
                'data' => array_map(fn($u) => $u->toArray(), $users),
            ];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    public function createUserAction()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $userDTO = $this->userService->register(
                $input['username'],
                $input['email'],
                $input['password']
            );
            
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(400);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## Лучшие практики

- Используйте Bootstrap для согласованного адаптивного дизайна
- Используйте современный JavaScript (ES6+), а не jQuery
- Используйте Fetch API вместо XMLHttpRequest
- Всегда проверяйте данные на сервере
- Показывайте состояния загрузки в запросах AJAX
- Предоставляйте четкие сообщения об ошибках
- Используйте семантический HTML
- Оптимизируйте изображения и ресурсы
- Используйте HTTPS для всех запросов

## Связанная документация

Смотрите также:
- Code-Organization для организации активов
- Error-Handling для отображения ошибок
- ../Patterns/MVC-Pattern для интеграции контроллера

---

Tags: #best-practices #frontend #bootstrap #javascript #ajax #module-development
