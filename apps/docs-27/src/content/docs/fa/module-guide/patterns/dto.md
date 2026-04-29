---
title: "الگوی DTO در XOOPS"
description: "اشیاء انتقال داده برای مدیریت پاک داده ها"
---
# الگوی DTO (اشیاء انتقال داده) در XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip [در هر دو نسخه کار می کند]
DTO ها اشیاء PHP ساده و بدون وابستگی به چارچوب هستند. آنها به طور یکسان در XOOPS 2.5.x و XOOPS 4.0.x کار می کنند. برای PHP 8.2+، از ارتقای ویژگی سازنده و کلاس‌های فقط خواندنی برای نحو پاک‌تر استفاده کنید.
:::

اشیاء انتقال داده (DTOs) اشیاء ساده ای هستند که برای انتقال داده ها بین لایه های مختلف یک برنامه استفاده می شوند. DTOها به حفظ مرزهای واضح بین لایه ها و کاهش وابستگی به اشیاء موجودیت کمک می کنند.

## مفهوم DTO

### DTO چیست؟
DTO عبارت است از:
- یک شی با ارزش ساده با خواص
- تغییرناپذیر یا فقط خواندنی پس از ایجاد
- بدون منطق تجاری یا روش
- بهینه شده برای انتقال داده
- مستقل از مکانیسم های ماندگاری

### چه زمانی از DTO استفاده کنیم

**از DTO زمانی استفاده کنید که:**
- انتقال داده ها بین لایه ها
- افشای داده ها از طریق API ها
- جمع آوری داده ها از چندین نهاد
- پنهان کردن جزئیات پیاده سازی داخلی
- تغییر ساختار داده برای مصرف کنندگان مختلف

## پیاده سازی DTO پایه

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
    
    // Read-only accessors
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

## Request/Input DTO

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

## استفاده در خدمات

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

## استفاده در کنترلرهای API

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

## بهترین شیوه ها

- DTO ها را متمرکز و خاص نگه دارید
- DTO ها را غیرقابل تغییر یا فقط خواندنی کنید
- منطق تجاری را در DTO ها لحاظ نکنید
- از DTO های جداگانه برای ورودی و خروجی استفاده کنید
- ویژگی های DTO را به وضوح مستند کنید
- DTO ها را ساده نگه دارید - فقط ظروف داده

## مستندات مرتبط

همچنین ببینید:
- [Service-Layer](../Patterns/Service-Layer.md) برای یکپارچه سازی خدمات
- [Repository-Pattern](../Patterns/Repository-Pattern.md) برای دسترسی به داده ها
- [MVC-Pattern](../Patterns/MVC-Pattern.md) برای استفاده از کنترلر
- [تست](../Best-Practices/Testing.md) برای آزمایش DTO

---

برچسب‌ها: #dto #اشیاء_انتقال_داده #الگوهای_طراحی #توسعه_ماژول