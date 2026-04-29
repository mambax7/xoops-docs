---
title: "الگوی MVC در XOOPS"
description: "پیاده سازی معماری Model-View-Controller در ماژول های XOOPS"
---
<span class="version-badge version-xmf">XMF مورد نیاز</span> <span class="version-badge version-40x">4.0.x بومی</span>

:::note[مطمئن نیستم این الگوی درستی است؟]
برای راهنمایی در مورد زمان استفاده از MVC در مقابل الگوهای ساده تر، [انتخاب الگوی دسترسی به داده](../Choosing-Data-Access-Pattern.md) را ببینید.
:::

:::احتیاط[توضیح: معماری XOOPS]
**Standard XOOPS 2.5.x** از الگوی **Page Controller** (که اسکریپت تراکنش نیز نامیده می شود) استفاده می کند، نه MVC. ماژول های قدیمی از `index.php` با شامل مستقیم، اشیاء سراسری (`$xoopsUser`، `$xoopsDB`) و دسترسی به داده مبتنی بر کنترلر استفاده می کنند.

**برای استفاده از MVC در XOOPS 2.5.x**، به **XMF Framework** نیاز دارید که از مسیریابی و کنترلر پشتیبانی می کند.

**XOOPS 4.0** به صورت بومی از MVC با میان افزار PSR-15 و مسیریابی مناسب پشتیبانی می کند.

همچنین ببینید: [معماری کنونی XOOPS](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

الگوی Model-View-Controller (MVC) یک الگوی معماری اساسی برای جداسازی نگرانی ها در ماژول های XOOPS است. این الگو یک برنامه کاربردی را به سه جزء به هم پیوسته تقسیم می کند.

## توضیح MVC

### مدل
**مدل** داده ها و منطق تجاری برنامه شما را نشان می دهد. آن:
- ماندگاری داده ها را مدیریت می کند
- قوانین تجاری را اجرا می کند
- داده ها را تایید می کند
- با پایگاه داده ارتباط برقرار می کند
- مستقل از UI است

### مشاهده کنید
**View** مسئول ارائه داده ها به کاربر است. آن:
- قالب های HTML را رندر می کند
- نمایش داده های مدل
- ارائه رابط کاربری را مدیریت می کند
- اقدامات کاربر را به کنترلر ارسال می کند
- باید حاوی حداقل منطق باشد

### کنترلر
**کنترل کننده** تعاملات و مختصات کاربر بین Model و View را کنترل می کند. آن:
- درخواست های کاربران را دریافت می کند
- داده های ورودی را پردازش می کند
- فراخوانی روش های مدل
- نماهای مناسب را انتخاب می کند
- جریان برنامه را مدیریت می کند

## پیاده سازی XOOPS

در XOOPS، الگوی MVC با استفاده از هندلرها و قالب ها با موتور Smarty که از قالب پشتیبانی می کند، پیاده سازی می شود.

### ساختار مدل پایه
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```

### پیاده سازی کنترلر
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

### مشاهده الگو
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```

## بهترین شیوه ها

- منطق کسب و کار را در مدل ها حفظ کنید
- ارائه را در Views نگه دارید  
- routing/coordination را در کنترلرها نگه دارید
- نگرانی ها را بین لایه ها مخلوط نکنید
- تمام ورودی ها را در سطح Controller اعتبار سنجی کنید

## مستندات مرتبط

همچنین ببینید:
- [Repository-Pattern](../Patterns/Repository-Pattern.md) برای دسترسی پیشرفته به داده ها
- [Service-Layer](../Patterns/Service-Layer.md) برای انتزاع منطق تجاری
- [Code-Organization](../Best-Practices/Code-Organization.md) برای ساختار پروژه
- [تست](../Best-Practices/Testing.md) برای استراتژی های تست MVC

---

برچسب ها: #mvc #الگوها #معماری #ماژول-توسعه #طراحی-الگوها