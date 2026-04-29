---
title: "Amalan Terbaik Integrasi Frontend"
description: "Bootstrap 5, Tailwind CSS, JavaScript dan corak AJAX"
---
# Amalan Terbaik Integrasi Frontend dalam XOOPSModul XOOPS moden memerlukan integrasi bahagian hadapan yang bersih dengan reka bentuk responsif, corak JavaScript yang betul dan kefungsian AJAX.## Penyepaduan Bootstrap 5
```
Smarty
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
### Contoh Borang Bootstrap
```
Smarty
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
### Contoh Jadual Bootstrap
```
Smarty
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
## Amalan Terbaik JavaScript
```
javascript
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
## AJAX Pelaksanaan
```
javascript
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
## Pengawal API AJAX
```
php
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
## Amalan Terbaik- Gunakan Bootstrap untuk reka bentuk responsif yang konsisten
- Gunakan JavaScript moden (ES6+), bukan jQuery
- Gunakan API Ambil dan bukannya XMLHttpRequest
- Sentiasa sahkan bahagian pelayan
- Tunjukkan keadaan pemuatan dalam permintaan AJAX
- Sediakan mesej ralat yang jelas
- Gunakan semantik HTML
- Optimumkan imej dan aset
- Gunakan HTTPS untuk semua permintaan## Dokumentasi BerkaitanLihat juga:
- Organisasi Kod untuk organisasi aset
- Pengendalian Ralat untuk paparan ralat
- ../Patterns/MVC-Pattern untuk penyepaduan pengawal---

Tag: #amalan terbaik #frontend #bootstrap #javascript #ajax #module-development