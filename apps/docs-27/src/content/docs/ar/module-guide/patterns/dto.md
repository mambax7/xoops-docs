---
title: "نمط DTO في XOOPS"
description: "كائنات نقل البيانات للتعامل النظيف مع البيانات"
dir: rtl
lang: ar
---

# نمط DTO (كائنات نقل البيانات) في XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[يعمل في كلا الإصدارين]
DTOs عبارة عن كائنات PHP عادية بدون تبعيات الإطار الأساسي. تعمل بنفس الطريقة في XOOPS 2.5.x و XOOPS 4.0.x. بالنسبة إلى PHP 8.2+، استخدم ترقية خصائص المنشئ والفئات readonly للحصول على بناء جملة أنظف.
:::

كائنات نقل البيانات (DTOs) هي كائنات بسيطة تُستخدم لنقل البيانات بين الطبقات المختلفة من التطبيق. تساعد DTOs في الحفاظ على حدود واضحة بين الطبقات وتقليل التبعيات على كائنات الكيان.

## مفهوم DTO

### ما هو DTO؟
DTO هو:
- كائن قيمة بسيط مع الخصائص
- ثابت أو للقراءة فقط بعد الإنشاء
- لا يوجد منطق عمل أو طرق
- محسّن لنقل البيانات
- مستقل عن آليات الثبات

### متى يتم استخدام DTOs

**استخدم DTOs عندما:**
- نقل البيانات بين الطبقات
- كشف البيانات من خلال APIs
- تجميع البيانات من عدة كيانات
- إخفاء تفاصيل التنفيذ الداخلية
- تغيير هيكل البيانات لمستهلكين مختلفين

## تنفيذ DTO الأساسي

```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // وصولات للقراءة فقط
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```

## طلب / إدخال DTO

```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```

## الاستخدام في الخدمات

```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```

## الاستخدام في متحكمات API

```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```

## أفضل الممارسات

- ابق DTOs مركزة وحددة
- اجعل DTOs ثابتة أو للقراءة فقط
- لا تشمل منطق الأعمال في DTOs
- استخدم DTOs منفصلة للإدخال والإخراج
- وثّق خصائص DTO بوضوح
- اجعل DTOs بسيطة - مجرد حاويات بيانات

## الوثائق ذات الصلة

انظر أيضاً:
- [Service-Layer](../Patterns/Service-Layer.md) للتكامل مع الخدمة
- [Repository-Pattern](../Patterns/Repository-Pattern.md) للوصول للبيانات
- [MVC-Pattern](../Patterns/MVC-Pattern.md) لاستخدام متحكمات
- [Testing](../Best-Practices/Testing.md) لاختبار DTO

---

الوسوم: #dto #data-transfer-objects #design-patterns #module-development
