---
title: "フロントエンド統合のベストプラクティス"
description: "Bootstrap 5、Tailwind CSS、JavaScript、AJAXパターン"
---

# XOOPSのフロントエンド統合のベストプラクティス

最新のXOOPSモジュールはレスポンシブデザイン、適切なJavaScriptパターン、AJAX機能を備えた クリーンなフロントエンド統合が必要です。

## Bootstrap 5統合

```smarty
{* Bootstrap CSSを含める *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* コンテンツ *}
<div class="container mt-4">
    <h1>マイモジュール</h1>
</div>

{* Bootstrap JSを含める *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Bootstrapフォームの例

```smarty
<div class="card">
    <div class="card-body">
        <form method="POST" class="needs-validation">
            <div class="mb-3">
                <label for="username" class="form-label">ユーザー名</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">メール</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            
            <button type="submit" class="btn btn-primary">送信</button>
        </form>
    </div>
</div>
```

### Bootstrapテーブルの例

```smarty
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>ユーザー名</th>
                <th>メール</th>
                <th>アクション</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$users item=user}
                <tr>
                    <td>{$user.id|escape}</td>
                    <td>{$user.username|escape}</td>
                    <td>{$user.email|escape}</td>
                    <td>
                        <a href="?op=edit&id={$user.id}" class="btn btn-sm btn-warning">編集</a>
                        <a href="?op=delete&id={$user.id}" class="btn btn-sm btn-danger">削除</a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
```

## JavaScriptのベストプラクティス

```javascript
// モジュールパターン
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // Bootstrapツールチップを初期化
    },
    
    initEventListeners: function() {
        // イベントハンドラーをアタッチ
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                return confirm('このアイテムを削除しますか?');
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

// DOMが準備完了したら初期化
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## AJAX実装

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
        .catch(error => console.error('エラー:', error));
    },
    
    get: function(url) {
        return this.request(url, { method: 'GET' });
    },
    
    post: function(url, data) {
        return this.request(url, { method: 'POST', body: data });
    }
};

// 使用例
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('正常に読み込まれました', 'success');
        }
    });
```

## AJAX APIコントローラー

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

## ベストプラクティス

- レスポンシブデザインにBootstrapを使用
- jQueryではなく最新の JavaScript (ES6+) を使用
- XMLHttpRequest ではなく Fetch API を使用
- 常にサーバー側で検証
- AJAX リクエストでローディング状態を表示
- 明確なエラーメッセージを提供
- セマンティック HTML を使用
- 画像と資産を最適化
- すべてのリクエストに HTTPS を使用

## 関連ドキュメント

関連トピック:
- コード組織 - 資産の組織
- エラーハンドリング - エラー表示
- ../Patterns/MVC-Pattern - コントローラー統合

---

タグ: #best-practices #frontend #bootstrap #javascript #ajax #module-development
