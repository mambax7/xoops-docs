---
title: "نمط طبقة الخدمة في XOOPS"
description: "تجريد منطق الأعمال والحقن بالاعتماديات"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[غير متأكد إذا كان هذا هو النمط الصحيح؟]
انظر [اختيار نمط الوصول للبيانات](../Choosing-Data-Access-Pattern.md) للحصول على شجرة القرار لمقارنة المعالجات والمستودعات والخدمات و CQRS.
:::

:::tip[يعمل اليوم وغداً]
نمط طبقة الخدمة **يعمل في XOOPS 2.5.x و XOOPS 4.0.x**. المفاهيم عامة - فقط بناء الجملة يختلف:

| الميزة | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| إصدار PHP | 7.4+ | 8.2+ |
| حقن المنشئ | ✅ توصيل يدوي | ✅ توصيل آلي للحاوية |
| الخصائص المكتوبة | `@var` docblocks | تصريحات النوع الأصلية |
| الخصائص للقراءة فقط | ❌ غير متاح | ✅ كلمة `readonly` |

أمثلة الكود أدناه تستخدم بناء جملة PHP 8.2+. بالنسبة لـ 2.5.x، احذف `readonly` واستخدم تصريحات الخصائص التقليدية.
:::

نمط طبقة الخدمة يغلف منطق الأعمال في فئات خدمة مخصصة، مما يوفر فصلاً واضحاً بين المتحكمات وطبقات الوصول للبيانات. يعزز هذا النمط إعادة استخدام الكود وسهولة الاختبار والقابلية للصيانة.

## مفهوم طبقة الخدمة

### الغرض
طبقة الخدمة:
- تحتوي على منطق الأعمال في المجال
- تحسق بين عدة مستودعات
- تتعامل مع العمليات المعقدة
- تدير المعاملات
- تجري التحقق والتفويض
- توفر عمليات عالية المستوى للمتحكمات

### الفوائد
- منطق أعمال قابل لإعادة الاستخدام في جميع المتحكمات
- سهولة الاختبار بشكل منفصل
- تنفيذ مركزي لقواعد الأعمال
- فصل واضح للمخاوف
- كود متحكم مبسط

## حقن الاعتماديات

```php
<?php
// خدمة مع اعتماديات مُحقونة
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
        // التحقق
        $this->validate($username, $email, $password);
        
        // إنشاء مستخدم
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // حفظ
        $userId = $this->userRepository->save($user);
        
        // إرسال بريد ترحيب
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

## حاوية الخدمة

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // تسجيل المستودعات
        $this->services['userRepository'] = new UserRepository($db);
        
        // تسجيل الخدمات
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

## الاستخدام في المتحكمات

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

## أفضل الممارسات

- كل خدمة تتعامل مع مخاوف مجال واحدة
- الخدمات تعتمد على الواجهات وليس على التنفيذات
- استخدم حقن المنشئ للاعتماديات
- يجب أن تكون الخدمات قابلة للاختبار بشكل منفصل
- ارمِ استثناءات خاصة بالمجال
- يجب ألا تعتمد الخدمات على تفاصيل طلب HTTP
- احفظ الخدمات مركزة ومتماسكة

## الوثائق ذات الصلة

انظر أيضاً:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) للتكامل مع المتحكم
- [Repository-Pattern](../Patterns/Repository-Pattern.md) للوصول للبيانات
- [DTO-Pattern](DTO-Pattern.md) لكائنات نقل البيانات
- [Testing](../Best-Practices/Testing.md) لاختبار الخدمة

---

الوسوم: #service-layer #business-logic #dependency-injection #design-patterns
