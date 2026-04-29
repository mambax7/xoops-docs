---
title: "یادداشت هایی برای توسعه دهندگان"
---
در حالی که نصب واقعی XOOPS برای استفاده توسعه شبیه به نصب معمولی است که قبلاً توضیح داده شده است، تفاوت‌های کلیدی هنگام ساخت یک سیستم آماده توسعه‌دهنده وجود دارد.

یک تفاوت بزرگ در نصب برنامه نویس این است که به جای تمرکز روی محتویات دایرکتوری _htdocs_، نصب توسعه دهنده همه فایل ها را نگه می دارد و آنها را تحت کنترل کد منبع با استفاده از git نگه می دارد.

تفاوت دیگر این است که دایرکتوری های _xoops_data_ و _xoops_lib_ معمولاً می توانند بدون تغییر نام در جای خود باقی بمانند، تا زمانی که سیستم توسعه شما مستقیماً در اینترنت باز (به عنوان مثال در یک شبکه خصوصی، مانند پشت یک روتر) در دسترس نباشد.

اکثر توسعه دهندگان بر روی یک سیستم _localhost_ کار می کنند که دارای کد منبع، پشته وب سرور و هر ابزار مورد نیاز برای کار با کد و پایگاه داده است.

می توانید اطلاعات بیشتری را در فصل [ابزار تجارت](../tools/tools.md) بیابید.

## گیت و هاست مجازی

بیشتر توسعه‌دهندگان می‌خواهند بتوانند با منابع فعلی به‌روز بمانند و تغییرات را در بالادست [مخزن XOOPS/XoopsCore27 در GitHub](https://github.com/XOOPS/XoopsCore27) انجام دهند. این بدان معناست که به جای دانلود بایگانی انتشار، می‌خواهید یک کپی از XOOPS را [fork](https://help.github.com/articles/fork-a-repo/) و از **git** برای [کلون کردن](https://help.github.com/categories/bootcamp/) آن مخزن را در جعبه برنامه‌نویس خود استفاده کنید.

از آنجایی که مخزن دارای ساختار خاصی است، به جای _کپی کردن_ فایل ها از پوشه _htdocs_ به سرور وب خود، بهتر است وب سرور خود را به پوشه htdocs داخل مخزن کلون شده محلی خود هدایت کنید. برای انجام این کار، ما معمولاً یک _Virtual Host_ یا _vhost_ جدید ایجاد می کنیم که به محیط git controlled source code.

In a [WAMP](http://www.wampserver.com/) ما اشاره می کند، صفحه پیش فرض [localhost](http://localhost/) که یک بخش Hort_rt در قسمت _Tool_ را دارد. به اینجا منجر می شود:

![WAMP افزودن میزبان مجازی](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

با استفاده از این می توانید یک ورودی VirtualHost راه اندازی کنید که مستقیماً در ورودی git controlled repository.

Here is an example (هنوز) شما در `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf` قرار می گیرد.

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

همچنین ممکن است لازم باشد یک ورودی در `Windows/System32/drivers/etc/hosts` اضافه کنید:

```text
127.0.0.1    xoops.localhost
```

اکنون، می توانید برای آزمایش روی `http://xoops.localhost/` نصب کنید، در حالی که مخزن خود را دست نخورده نگه دارید، و وب سرور را با یک URL ساده در دایرکتوری htdocs نگه دارید. به علاوه، می‌توانید نسخه محلی XOOPS خود را در هر زمانی بدون نیاز به نصب مجدد یا کپی فایل‌ها به آخرین نسخه اصلی به‌روزرسانی کنید. و، می‌توانید برای کمک به XOOPS از طریق GitHub، بهبودها و اصلاحاتی در کد ایجاد کنید.

## وابستگی های آهنگساز

XOOPS 2.7.0 از [Composer](https://getcomposer.org/) برای مدیریت وابستگی های PHP خود استفاده می کند. درخت وابستگی در `htdocs/xoops_lib/` داخل مخزن منبع زندگی می کند:

* `composer.dist.json` فهرست اصلی وابستگی‌هایی است که همراه با انتشار ارسال می‌شوند.
* `composer.json` کپی محلی است که در صورت نیاز می توانید آن را برای محیط توسعه خود سفارشی کنید.
* `composer.lock` نسخه های دقیق را پین می کند تا نصب ها تکرار شوند.
* `vendor/` شامل کتابخانه های نصب شده است (Smarty 4، PHPMailer، HTMLPurifier، firebase/php-jwt، monolog، symfony/var-dumper، xoops/xmf، ZXQ3KEEPQ0، و دیگران).

برای یک git clone of XOOPS 2.7.0, starting from ریشه مخزن جدید، اجرا کنید:

```text
cd htdocs/xoops_lib
composer install
```

توجه داشته باشید که `composer.json` در ریشه مخزن وجود ندارد - پروژه تحت `htdocs/xoops_lib/` زندگی می کند، بنابراین قبل از اجرای Composer باید `cd` را در آن دایرکتوری وارد کنید.

تاربال‌های عرضه‌شده با `vendor/` از پیش پر شده ارسال می‌شوند، اما git clones may not. Keep `vendor/` intact در نصب‌های توسعه‌دهنده - XOOPS وابستگی‌های خود را از آنجا در زمان اجرا بارگذاری می‌کند.

کتابخانه [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) به عنوان یک وابستگی Composer در نسخه 2.7.0 ارسال می شود، بنابراین می توانید از `XMF\Request`، `XMF\Database\TableLoad` و کلاس های مرتبط بدون کد نصب اضافی استفاده کنید.

## ماژول DebugBarXOOPS 2.7.0 یک ماژول **DebugBar** را بر اساس Symfony VarDumper ارائه می دهد. یک نوار ابزار اشکال زدایی به صفحات رندر شده اضافه می کند که اطلاعات درخواست، پایگاه داده و الگو را نشان می دهد. آن را از قسمت مدیریت ماژول ها در سایت های توسعه و مرحله نصب کنید. آن را روی یک سایت تولیدی که در معرض دید عموم قرار دارد نصب نکنید، مگر اینکه بدانید که می خواهید.