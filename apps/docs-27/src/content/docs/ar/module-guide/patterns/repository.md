---
title: "نمط المستودع في XOOPS"
description: "تنفيذ طبقة التجريد للوصول للبيانات"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[غير متأكد إذا كان هذا هو النمط الصحيح؟]
انظر [اختيار نمط الوصول للبيانات](../Choosing-Data-Access-Pattern.md) لمقارنة المعالجات والمستودعات والخدمات و CQRS.
:::

:::tip[يعمل اليوم وغداً]
نمط المستودع **يعمل في XOOPS 2.5.x و XOOPS 4.0.x**. في 2.5.x، لف معالج `XoopsPersistableObjectHandler` الموجود في فئة المستودع للحصول على فوائد التجريد:

| النهج | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| الوصول المباشر للمعالج | `xoops_getModuleHandler()` | عبر DI container |
| غلاف المستودع | ✅ موصى به | ✅ النمط الأصلي |
| الاختبار مع الأشياء الوهمية | ✅ مع DI يدوي | ✅ Container autowiring |

**ابدأ بنمط المستودع اليوم** للتحضير لهجرة وحدات XOOPS 4.0.
:::

نمط المستودع هو نمط وصول البيانات الذي يجرد عمليات قاعدة البيانات، مما يوفر واجهة نظيفة للوصول للبيانات. يعمل كوسيط بين طبقة منطق الأعمال وطبقة رسم خريطة البيانات.

## مفهوم المستودع

نمط المستودع يوفر:
- تجريد تفاصيل تنفيذ قاعدة البيانات
- محاكاة سهلة لاختبار الوحدة
- منطق وصول البيانات المركزي
- المرونة في تغيير قاعدة البيانات دون التأثير على منطق الأعمال
- إعادة استخدام منطق الوصول للبيانات في جميع أنحاء التطبيق

## متى يتم استخدام المستودعات

**استخدم المستودعات عندما:**
- نقل البيانات بين طبقات التطبيق
- الحاجة لتغيير تنفيذ قاعدة البيانات
- كتابة كود قابل للاختبار مع أشياء وهمية
- تجريد أنماط الوصول للبيانات

## نمط التنفيذ

```php
<?php
// تحديد واجهة المستودع
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// تنفيذ المستودع
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // التنفيذ
    }
    
    public function save($entity)
    {
        // التنفيذ
    }
}
?>
```

## الاستخدام في الخدمات

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
        // التحقق من وجود المستخدم
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // إنشاء مستخدم
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## أفضل الممارسات

- استخدم الواجهات لتحديد عقود المستودع
- كل مستودع يتعامل مع نوع واحد من الكيانات
- احتفظ بمنطق الأعمال في الخدمات وليس في المستودعات
- استخدم كائنات الكيان لرسم خريطة البيانات
- ارم استثناءات مناسبة للعمليات غير الصحيحة

## الوثائق ذات الصلة

انظر أيضاً:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) للتكامل مع المتحكم
- [Service-Layer](../Patterns/Service-Layer.md) لتنفيذ الخدمة
- [DTO-Pattern](DTO-Pattern.md) لكائنات نقل البيانات
- [Testing](../Best-Practices/Testing.md) لاختبار المستودع

---

الوسوم: #repository-pattern #data-access #design-patterns #module-development
