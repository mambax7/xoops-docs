---
title: "Βέλτιστες πρακτικές ενοποίησης Frontend"
description: "Bootstrap 5, Tailwind CSS, JavaScript και AJAX μοτίβα"
---

# Βέλτιστες πρακτικές ενοποίησης Frontend στο XOOPS

Οι σύγχρονες ενότητες XOOPS απαιτούν καθαρή ενσωμάτωση διεπαφής με αποκριτικό σχεδιασμό, κατάλληλα μοτίβα JavaScript και λειτουργικότητα AJAX.

## Ενσωμάτωση Bootstrap 5

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

## # Παράδειγμα φόρμας εκκίνησης

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

## # Παράδειγμα πίνακα εκκίνησης

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

## Βέλτιστες πρακτικές JavaScript

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

## AJAX Υλοποίηση

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

## AJAX API Ελεγκτής

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

## Βέλτιστες πρακτικές

- Χρησιμοποιήστε το Bootstrap για σταθερή απόκριση σχεδίασης
- Χρησιμοποιήστε σύγχρονη JavaScript (ES6+), όχι jQuery
- Χρησιμοποιήστε το Fetch API αντί για το XMLHttpRequest
- Να επικυρώνετε πάντα από την πλευρά του διακομιστή
- Εμφάνιση καταστάσεων φόρτωσης σε αιτήματα AJAX
- Παρέχετε σαφή μηνύματα σφάλματος
- Χρησιμοποιήστε σημασιολογικό HTML
- Βελτιστοποιήστε εικόνες και στοιχεία
- Χρησιμοποιήστε το HTTPS για όλα τα αιτήματα

## Σχετική τεκμηρίωση

Δείτε επίσης:
- Κωδικός-Οργανισμός για την οργάνωση περιουσιακών στοιχείων
- Χειρισμός σφαλμάτων για εμφάνιση σφαλμάτων
- ../Patterns/MVC-Μοτίβο για ενσωμάτωση ελεγκτή

---

Ετικέτες: #best-practices #frontend #bootstrap #javascript #ajax #module-development
