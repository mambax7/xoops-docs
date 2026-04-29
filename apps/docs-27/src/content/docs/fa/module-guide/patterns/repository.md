---
title: "الگوی مخزن در XOOPS"
description: "اجرای لایه انتزاعی دسترسی به داده"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[مطمئن نیستم این الگوی درستی است؟]
[انتخاب الگوی دسترسی به داده](../Choosing-Data-Access-Pattern.md) را برای مقایسه یک درخت تصمیم که کنترل کننده ها، مخازن، خدمات و CQRS را مقایسه می کند، ببینید.
:::

:::tip [امروز و فردا کار می کند]
الگوی Repository **در XOOPS 2.5.x و XOOPS 4.0.x** کار می کند. در 2.5.x، `XoopsPersistableObjectHandler` موجود خود را در یک کلاس Repository بپیچید تا از مزایای انتزاع بهره مند شوید:

| رویکرد | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| دسترسی مستقیم به کنترلر | `xoops_getModuleHandler()` | از طریق ظرف DI |
| بسته بندی مخزن | ✅ پیشنهادی | ✅ الگوی بومی |
| تست با تمسخر | ✅ با DI دستی | ✅ سیم کشی خودکار کانتینر |

**از امروز با الگوی Repository شروع کنید** تا ماژول های خود را برای مهاجرت XOOPS 4.0 آماده کنید.
:::

الگوی مخزن یک الگوی دسترسی به داده است که عملیات پایگاه داده را انتزاعی می کند و یک رابط تمیز برای دسترسی به داده ها فراهم می کند. این به عنوان یک واسطه بین منطق تجاری و لایه های نقشه برداری داده عمل می کند.

## مفهوم مخزن

الگوی مخزن ارائه می دهد:
- چکیده جزئیات پیاده سازی پایگاه داده
- تمسخر آسان برای تست واحد
- منطق دسترسی متمرکز به داده ها
- انعطاف پذیری برای تغییر پایگاه داده بدون تأثیر بر منطق تجاری
- منطق دسترسی مجدد به داده ها در سراسر برنامه

## چه زمانی از مخازن استفاده کنیم

**از مخازن زمانی استفاده کنید که:**
- انتقال داده ها بین لایه های برنامه
- نیاز به تغییر پیاده سازی پایگاه داده
- نوشتن کد قابل آزمایش با ماک
- چکیده الگوهای دسترسی به داده ها

## الگوی پیاده سازی

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## استفاده در خدمات

```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## بهترین شیوه ها

- از رابط ها برای تعریف قراردادهای مخزن استفاده کنید
- هر مخزن یک نوع موجودیت را کنترل می کند
- منطق کسب و کار را در خدمات حفظ کنید، نه مخازن
- از اشیاء موجودیت برای نگاشت داده ها استفاده کنید
- استثناهای مناسب را برای عملیات نامعتبر پرتاب کنید

## مستندات مرتبط

همچنین ببینید:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) برای ادغام کنترلر
- [Service-Layer](../Patterns/Service-Layer.md) برای اجرای سرویس
- [DTO-Pattern](DTO-Pattern.md) برای اشیاء انتقال داده
- [تست](../Best-Practices/Testing.md) برای آزمایش مخزن

---

برچسب ها: #مخزن-الگو #دسترسی به داده ها #الگوهای طراحی #توسعه ماژول