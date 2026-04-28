---
title: "نمط MVC في XOOPS"
description: "تنفيذ معمارية Model-View-Controller في وحدات XOOPS"
dir: rtl
lang: ar
---

<span class="version-badge version-xmf">XMF مطلوب</span> <span class="version-badge version-40x">4.0.x أصلي</span>

:::note[غير متأكد إذا كان هذا هو النمط الصحيح؟]
انظر [اختيار نمط الوصول للبيانات](../Choosing-Data-Access-Pattern.md) للحصول على إرشادات حول متى يتم استخدام MVC مقابل الأنماط الأبسط.
:::

:::caution[توضيح: معمارية XOOPS]
**XOOPS 2.5.x القياسية** تستخدم نمط **Page Controller** (يسمى أيضاً Transaction Script)، وليس MVC. الوحدات القديمة تستخدم `index.php` مع التضمين المباشر، كائنات عامة (`$xoopsUser`, `$xoopsDB`)، والوصول للبيانات القائم على المعالج.

**لاستخدام MVC في XOOPS 2.5.x**، تحتاج إلى **XMF Framework** الذي يوفر التوجيه ودعم المتحكم.

**XOOPS 4.0** سيدعم MVC بشكل أصلي مع PSR-15 middleware والتوجيه الصحيح.

انظر أيضاً: [معمارية XOOPS الحالية](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

نمط Model-View-Controller (MVC) هو نمط معماري أساسي لفصل الاهتمامات في وحدات XOOPS. يقسم هذا النمط التطبيق إلى ثلاث مكونات مترابطة.

## شرح MVC

### النموذج
**النموذج** يمثل البيانات والمنطق التجاري لتطبيقك. يقوم بـ:
- إدارة ثبات البيانات
- تنفيذ قواعد الأعمال
- التحقق من البيانات
- التواصل مع قاعدة البيانات
- مستقل عن واجهة المستخدم

### العرض
**العرض** مسؤول عن عرض البيانات للمستخدم. يقوم بـ:
- عرض قوالس HTML
- عرض بيانات النموذج
- معالجة عرض واجهة المستخدم
- إرسال تصرفات المستخدم إلى المتحكم
- يجب أن يحتوي على منطق بسيط جداً

### المتحكم
**المتحكم** يتعامل مع تفاعلات المستخدم ويحسق بين النموذج والعرض. يقوم بـ:
- استقبال طلبات المستخدم
- معالجة بيانات الإدخال
- استدعاء طرق النموذج
- اختيار الآراء المناسبة
- إدارة تدفق التطبيق

## تنفيذ XOOPS

في XOOPS، يتم تنفيذ نمط MVC باستخدام المعالجات والقوالس مع محرك Smarty للقوالس.

### هيكل النموذج الأساسي
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // تنفيذ استعلام قاعدة البيانات
    }
    
    public function createUser($data)
    {
        // تنفيذ إنشاء المستخدم
    }
}
?>
```

### تنفيذ المتحكم
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```

### قالب العرض
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## أفضل الممارسات

- احتفظ بمنطق الأعمال في النماذج
- احتفظ بالعرض في الآراء  
- احتفظ بالتوجيه والتنسيق في المتحكمات
- لا تخلط الاهتمامات بين الطبقات
- تحقق من جميع المدخلات على مستوى المتحكم

## الوثائق ذات الصلة

انظر أيضاً:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) للوصول المتقدم للبيانات
- [Service-Layer](../Patterns/Service-Layer.md) لتجريد منطق الأعمال
- [Code-Organization](../Best-Practices/Code-Organization.md) لهيكل المشروع
- [Testing](../Best-Practices/Testing.md) لاستراتيجيات اختبار MVC

---

الوسوم: #mvc #patterns #architecture #module-development #design-patterns
