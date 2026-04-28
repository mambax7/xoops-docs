---
title: "Boas Práticas de Integração de Frontend"
description: "Bootstrap 5, Tailwind CSS, JavaScript e padrões AJAX"
---

# Boas Práticas de Integração de Frontend em XOOPS

Módulos XOOPS modernos requerem integração de frontend limpa com design responsivo, padrões JavaScript adequados e funcionalidade AJAX.

## Integração do Bootstrap 5

```smarty
{* Incluir CSS do Bootstrap *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* Seu conteúdo *}
<div class="container mt-4">
    <h1>Meu Módulo</h1>
</div>

{* Incluir JS do Bootstrap *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Exemplo de Formulário Bootstrap

```smarty
<div class="card">
    <div class="card-body">
        <form method="POST" class="needs-validation">
            <div class="mb-3">
                <label for="username" class="form-label">Nome de Usuário</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</div>
```

### Exemplo de Tabela Bootstrap

```smarty
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nome de Usuário</th>
                <th>E-mail</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$users item=user}
                <tr>
                    <td>{$user.id|escape}</td>
                    <td>{$user.username|escape}</td>
                    <td>{$user.email|escape}</td>
                    <td>
                        <a href="?op=edit&id={$user.id}" class="btn btn-sm btn-warning">Editar</a>
                        <a href="?op=delete&id={$user.id}" class="btn btn-sm btn-danger">Deletar</a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
```

## Boas Práticas de JavaScript

```javascript
// Padrão de módulo
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // Inicializar tooltips Bootstrap
    },
    
    initEventListeners: function() {
        // Anexar manipuladores de evento
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                return confirm('Deletar este item?');
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

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## Implementação de AJAX

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
        .catch(error => console.error('Erro:', error));
    },
    
    get: function(url) {
        return this.request(url, { method: 'GET' });
    },
    
    post: function(url, data) {
        return this.request(url, { method: 'POST', body: data });
    }
};

// Uso
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('Carregado com sucesso', 'success');
        }
    });
```

## Controller de API AJAX

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

## Boas Práticas

- Usar Bootstrap para design responsivo consistente
- Usar JavaScript moderno (ES6+), não jQuery
- Usar API Fetch em vez de XMLHttpRequest
- Sempre validar no lado do servidor
- Mostrar estados de carregamento em requisições AJAX
- Fornecer mensagens de erro claras
- Usar HTML semântico
- Otimizar imagens e assets
- Usar HTTPS para todas as requisições

## Documentação Relacionada

Veja também:
- Organização-de-Código para organização de asset
- Tratamento-de-Erros para exibição de erro
- ../Padrões/Padrão-MVC para integração de controller

---

Tags: #boas-práticas #frontend #bootstrap #javascript #ajax #desenvolvimento-de-módulo
