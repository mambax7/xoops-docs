---
title: "أفضل ممارسات التكامل الأمامي"
description: "Bootstrap 5 و Tailwind CSS و JavaScript و أنماط AJAX"
dir: rtl
lang: ar
---

# أفضل ممارسات التكامل الأمامي في XOOPS

تتطلب وحدات XOOPS الحديثة تكامل أمامي نظيف مع تصميم سريع الاستجابة وأنماط JavaScript الصحيحة وعمل AJAX.

## تكامل Bootstrap 5

```smarty
{* تضمين CSS Bootstrap *}
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet">

{* محتواك *}
<div class="container mt-4">
    <h1>وحدتي</h1>
</div>

{* تضمين JS Bootstrap *}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### مثال نموذج Bootstrap

```smarty
<div class="card">
    <div class="card-body">
        <form method="POST" class="needs-validation">
            <div class="mb-3">
                <label for="username" class="form-label">اسم المستخدم</label>
                <input type="text" class="form-control" id="username" name="username">
            </div>
            
            <div class="mb-3">
                <label for="email" class="form-label">البريد الإلكتروني</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            
            <button type="submit" class="btn btn-primary">إرسال</button>
        </form>
    </div>
</div>
```

### مثال جدول Bootstrap

```smarty
<div class="table-responsive">
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>الهوية</th>
                <th>اسم المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الإجراءات</th>
            </tr>
        </thead>
        <tbody>
            {foreach from=$users item=user}
                <tr>
                    <td>{$user.id|escape}</td>
                    <td>{$user.username|escape}</td>
                    <td>{$user.email|escape}</td>
                    <td>
                        <a href="?op=edit&id={$user.id}" class="btn btn-sm btn-warning">تعديل</a>
                        <a href="?op=delete&id={$user.id}" class="btn btn-sm btn-danger">حذف</a>
                    </td>
                </tr>
            {/foreach}
        </tbody>
    </table>
</div>
```

## أفضل ممارسات JavaScript

```javascript
// نمط وحدة
const MyModule = {
    init: function() {
        this.initTooltips();
        this.initEventListeners();
    },
    
    initTooltips: function() {
        // تهيئة تلميحات Bootstrap
    },
    
    initEventListeners: function() {
        // إرفاق معالجات الأحداث
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                return confirm('حذف هذا العنصر؟');
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

// تهيئة عند جاهزية DOM
document.addEventListener('DOMContentLoaded', () => MyModule.init());
```

## تطبيق AJAX

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
        .catch(error => console.error('خطأ:', error));
    },
    
    get: function(url) {
        return this.request(url, { method: 'GET' });
    },
    
    post: function(url, data) {
        return this.request(url, { method: 'POST', body: data });
    }
};

// الاستخدام
AjaxHelper.get('/modules/mymodule/api/users')
    .then(response => {
        if (response.success) {
            MyModule.notify('تم التحميل بنجاح', 'success');
        }
    });
```

## متحكم API AJAX

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

## أفضل الممارسات

- استخدم Bootstrap للتصميم السريع الاستجابة المتسق
- استخدم JavaScript الحديث (ES6+) وليس jQuery
- استخدم Fetch API بدلاً من XMLHttpRequest
- تحقق دائماً من جانب الخادم
- أظهر حالات التحميل في طلبات AJAX
- قدم رسائل خطأ واضحة
- استخدم HTML دلالي
- حسّن الصور والأصول
- استخدم HTTPS لجميع الطلبات

## الوثائق ذات الصلة

انظر أيضاً:
- Code-Organization لتنظيم الأصول
- Error-Handling لعرض الخطأ
- ../Patterns/MVC-Pattern لتكامل المتحكم

---

Tags: #best-practices #frontend #bootstrap #javascript #ajax #module-development
