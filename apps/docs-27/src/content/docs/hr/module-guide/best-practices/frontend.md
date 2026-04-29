---
title: "Najbolji primjeri iz prakse frontend integracije"
description: "Bootstrap 5, Tailwind CSS, JavaScript i AJAX uzorci"
---
# Najbolje prakse integracije sučelja u XOOPS

Moderni XOOPS modules zahtijeva čistu integraciju sučelja s responzivnim dizajnom, ispravnim uzorcima JavaScript i funkcionalnošću AJAX.

## Bootstrap 5 integracija

```smarty
{* Include Bootstrap CSS *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* Your content *}
<div class="container mt-4">
    <h1>My Module</h1>
</div>

{* Include Bootstrap JS *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Primjer Bootstrap obrasca

```smarty
<div class="card">
    <div class="card-body">
        <form method="POST" class="needs-validation">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
```

### Primjer Bootstrap tablice

```smarty
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$users item=user}
                <tr>
                    <td>{$user.id|escape}</td>
                    <td>{$user.username|escape}</td>
                    <td>{$user.email|escape}</td>
                    <td>
                        <a href="?op=edit&id={$user.id}" class="btn btn-sm btn-warning">Edit</a>
                        <a href="?op=delete&id={$user.id}" class="btn btn-sm btn-danger">Delete</a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
```

## JavaScript Najbolji postupci

```javascript
// Module pattern
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // Initialize Bootstrap tooltips
    },
    
    initEventListeners: function() {
        // Attach event handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                return confirm('Delete this item?');
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

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## AJAX Implementacija

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
        .catch(error => console.error('Error:', error));
    },
    
    get: function(url) {
        return this.request(url, { method: 'GET' });
    },
    
    post: function(url, data) {
        return this.request(url, { method: 'POST', body: data });
    }
};

// Usage
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('Loaded successfully', 'success');
        }
    });
```

## AJAX API kontroler

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

## Najbolji primjeri iz prakse

- Koristite Bootstrap za dosljedan responzivni dizajn
- Koristite moderni JavaScript (ES6+), a ne jQuery
- Koristite Fetch API umjesto XMLHttpRequest
- Uvijek potvrdite na strani poslužitelja
- Prikaži stanja učitavanja u AJAX zahtjevima
- Navedite jasne poruke o pogrešci
- Koristite semantički HTML
- Optimizirajte slike i assets
- Koristite HTTPS za sve zahtjeve

## Povezana dokumentacija

Vidi također:
- Code-Organization za organizaciju imovine
- Error-Handling za prikaz pogreške
- ../Patterns/MVC-Uzorak za integraciju kontrolera

---

Oznake: #najbolje prakse #frontend #bootstrap #javascript #ajax #module-development
