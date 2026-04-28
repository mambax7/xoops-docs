---
title: "前端整合最佳實踐"
description: "Bootstrap 5、Tailwind CSS、JavaScript 和 AJAX 模式"
---

# XOOPS 中的前端整合最佳實踐

現代 XOOPS 模組需要使用回應式設計、適當的 JavaScript 模式和 AJAX 功能進行清潔前端整合。

## Bootstrap 5 整合

```smarty
{* 包含 Bootstrap CSS *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* 你的內容 *}
<div class="container mt-4">
    <h1>My Module</h1>
</div>

{* 包含 Bootstrap JS *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Bootstrap 表單範例

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

### Bootstrap 表格範例

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

## JavaScript 最佳實踐

```javascript
// 模組模式
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // 初始化 Bootstrap 工具提示
    },
    
    initEventListeners: function() {
        // 附加事件處理器
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

// DOM 就緒時初始化
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## AJAX 實施

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

// 用法
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('Loaded successfully', 'success');
        }
    });
```

## AJAX API 控制器

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

## 最佳實踐

- 使用 Bootstrap 實現一致的回應式設計
- 使用現代 JavaScript (ES6+)，而非 jQuery
- 使用 Fetch API 而非 XMLHttpRequest
- 始終進行伺服器端驗證
- 在 AJAX 請求中顯示載入狀態
- 提供清晰的錯誤訊息
- 使用語義 HTML
- 最佳化圖片和資產
- 對所有請求使用 HTTPS

## 相關文件

另外參閱：
- Code-Organization 以進行資產組織
- Error-Handling 以進行錯誤顯示
- ../Patterns/MVC-Pattern 以進行控制器整合

---

標籤: #best-practices #frontend #bootstrap #javascript #ajax #module-development
