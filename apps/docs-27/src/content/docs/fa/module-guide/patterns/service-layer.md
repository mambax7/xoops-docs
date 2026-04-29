---
title: "الگوی لایه سرویس در XOOPS"
description: "انتزاع منطق کسب و کار و تزریق وابستگی"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[مطمئن نیستم این الگوی درستی است؟]
[انتخاب الگوی دسترسی به داده](../Choosing-Data-Access-Pattern.md) را برای درخت تصمیمی که هندلرها، مخازن، سرویس‌ها و CQRS را مقایسه می‌کند، ببینید.
:::

:::tip [امروز و فردا کار می کند]
الگوی لایه سرویس **در XOOPS 2.5.x و XOOPS 4.0.x** کار می کند. مفاهیم جهانی هستند - فقط نحو متفاوت است:

| ویژگی | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| نسخه PHP | 7.4+ | 8.2+ |
| تزریق سازنده | ✅ سیم کشی دستی | ✅ سیم کشی خودکار کانتینر |
| خصوصیات تایپ شده | `@var` docblocks | اعلانات نوع بومی |
| Properties فقط خواندنی | ❌ موجود نیست | ✅ کلمه کلیدی `readonly` |

نمونه‌های کد زیر از دستور زبان PHP 8.2+ استفاده می‌کنند. برای 2.5.x، `readonly` را حذف کنید و از اعلان‌های دارایی سنتی استفاده کنید.
:::

الگوی لایه سرویس منطق کسب و کار را در کلاس های خدمات اختصاصی کپسوله می کند و جدایی واضح بین کنترل کننده ها و لایه های دسترسی به داده را فراهم می کند. این الگو قابلیت استفاده مجدد، آزمایش پذیری و قابلیت نگهداری کد را ارتقا می دهد.

## مفهوم لایه سرویس

### هدف
لایه سرویس:
- حاوی منطق کسب و کار دامنه است
- مخازن متعدد را هماهنگ می کند
- عملیات پیچیده را انجام می دهد
- معاملات را مدیریت می کند
- اعتبار سنجی و مجوز را انجام می دهد
- عملیات سطح بالا را برای کنترلرها فراهم می کند

### مزایا
- منطق تجاری قابل استفاده مجدد در چندین کنترلر
- آسان برای تست در انزوا
- اجرای متمرکز قوانین کسب و کار
- تفکیک واضح نگرانی ها
- کد کنترلر ساده شده

## تزریق وابستگی

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## کانتینر سرویس

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## استفاده در کنترلرها

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## بهترین شیوه ها

- هر سرویس یک نگرانی دامنه را مدیریت می کند
- خدمات به رابط ها بستگی دارد، نه پیاده سازی
- از تزریق سازنده برای وابستگی ها استفاده کنید
- خدمات باید به صورت مجزا قابل آزمایش باشند
- استثناهای خاص دامنه را پرتاب کنید
- خدمات نباید به جزئیات درخواست HTTP بستگی داشته باشند
- خدمات را متمرکز و منسجم نگه دارید

## مستندات مرتبط

همچنین ببینید:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) برای ادغام کنترلر
- [Repository-Pattern](../Patterns/Repository-Pattern.md) برای دسترسی به داده ها
- [DTO-Pattern](DTO-Pattern.md) برای اشیاء انتقال داده
- [تست](../Best-Practices/Testing.md) برای آزمایش خدمات

---

برچسب‌ها: #لایه_خدماتی #منطق_تجاری #وابستگی_تزریق #طراحی_الگوها