---
title: "Meilleures pratiques d'intégration frontale"
description: "Bootstrap 5, Tailwind CSS, JavaScript et motifs AJAX"
---

# Meilleures pratiques d'intégration frontale dans XOOPS

Les modules XOOPS modernes nécessitent une intégration frontale propre avec une conception réactive, des motifs JavaScript appropriés et une fonctionnalité AJAX.

## Intégration Bootstrap 5

```smarty
{* Inclure Bootstrap CSS *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* Votre contenu *}
<div class="container mt-4">
    <h1>My Module</h1>
</div>

{* Inclure Bootstrap JS *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Exemple de formulaire Bootstrap

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

### Exemple de tableau Bootstrap

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

## Meilleures pratiques JavaScript

```javascript
// Motif de module
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // Initialiser les info-bulles Bootstrap
    },
    
    initEventListeners: function() {
        // Attacher les gestionnaires d'événements
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

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## Implémentation AJAX

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

// Utilisation
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('Loaded successfully', 'success');
        }
    });
```

## Contrôleur d'API AJAX

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

## Meilleures pratiques

- Utiliser Bootstrap pour une conception cohérente et réactive
- Utiliser le JavaScript moderne (ES6+), pas jQuery
- Utiliser l'API Fetch au lieu de XMLHttpRequest
- Toujours valider côté serveur
- Afficher les états de chargement dans les demandes AJAX
- Fournir des messages d'erreur clairs
- Utiliser du HTML sémantique
- Optimiser les images et les ressources
- Utiliser HTTPS pour toutes les demandes

## Documentation connexe

Voir aussi:
- Organisation du code pour l'organisation des ressources
- Gestion des erreurs pour l'affichage des erreurs
- ../Patterns/Motif-MVC pour l'intégration du contrôleur

---

Tags: #best-practices #frontend #bootstrap #javascript #ajax #module-development
