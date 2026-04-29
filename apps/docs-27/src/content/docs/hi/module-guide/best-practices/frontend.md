---
title: "फ़्रंटएंड एकीकरण सर्वोत्तम अभ्यास"
description: "बूटस्ट्रैप 5, टेलविंड CSS, JavaScript, और AJAX पैटर्न"
---
# XOOPS में फ्रंटएंड इंटीग्रेशन सर्वोत्तम अभ्यास

आधुनिक XOOPS मॉड्यूल को प्रतिक्रियाशील डिज़ाइन, उचित JavaScript पैटर्न और AJAX कार्यक्षमता के साथ स्वच्छ फ्रंटएंड एकीकरण की आवश्यकता होती है।

## बूटस्ट्रैप 5 एकीकरण

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

### बूटस्ट्रैप फॉर्म उदाहरण

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

### बूटस्ट्रैप तालिका उदाहरण

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

## JavaScript सर्वोत्तम अभ्यास

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

## AJAX कार्यान्वयन

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

## AJAX API नियंत्रक

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

## सर्वोत्तम प्रथाएँ

- लगातार प्रतिक्रियाशील डिज़ाइन के लिए बूटस्ट्रैप का उपयोग करें
- आधुनिक JavaScript (ES6+) का उपयोग करें, jQuery का नहीं
- XMLHttpRequest के बजाय Fetch API का उपयोग करें
- हमेशा सर्वर-साइड को मान्य करें
- AJAX अनुरोधों में लोडिंग स्थिति दिखाएं
- स्पष्ट त्रुटि संदेश प्रदान करें
- सिमेंटिक HTML का प्रयोग करें
- छवियों और परिसंपत्तियों का अनुकूलन करें
- सभी अनुरोधों के लिए HTTPS का उपयोग करें

## संबंधित दस्तावेज़ीकरण

यह भी देखें:
- परिसंपत्ति संगठन के लिए कोड-संगठन
- त्रुटि प्रदर्शन के लिए त्रुटि-हैंडलिंग
- नियंत्रक एकीकरण के लिए ../पैटर्न/एमवीसी-पैटर्न

---

टैग: #सर्वोत्तम अभ्यास #फ्रंटएंड #बूटस्ट्रैप #JavaScript #ajax #मॉड्यूल-विकास