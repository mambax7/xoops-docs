---
title: "ملاحظات للمطورين"
dir: rtl
lang: ar
---

في حين أن التثبيت الفعلي لـ XOOPS للاستخدام في التطوير مشابه للتثبيت الطبيعي الموصوف بالفعل، هناك اختلافات رئيسية عند بناء نظام جاهز للمطور.

أحد الاختلافات الكبيرة في تثبيت المطور هو أنه بدلاً من التركيز فقط على محتويات دليل _htdocs_، يحتفظ تثبيت المطور بجميع الملفات، ويحتفظ بها تحت السيطرة على الأكواد باستخدام git.

الفرق الآخر هو أن أدلة _xoops_data_ و _xoops_lib_ يمكن عادة أن تبقى في مكانها دون إعادة تسمية، طالما نظام التطوير الخاص بك لا يمكن الوصول إليه مباشرة على الإنترنت المفتوح (أي على شبكة خاصة، مثل خلف جهاز توجيه.)

يعمل معظم المطورين على نظام _localhost_، الذي يحتوي على أكواس المصدر وstack خادم ويب وأي أدوات مطلوبة للعمل مع الأكواس وقاعدة البيانات.

يمكنك العثور على مزيد من المعلومات في فصل [أدوات الحرفة](../tools/tools.md).

## Git والمضيفون الافتراضيون

يريد معظم المطورين أن يكونوا قادرين على البقاء محدثين مع المصادر الحالية والمساهمة بالتغييرات مرة أخرى إلى upstream [مستودع XOOPS/XoopsCore27 على GitHub](https://github.com/XOOPS/XoopsCore27). هذا يعني أنه بدلاً من تنزيل أرشيف إصدار، ستريد [نسخ](https://help.github.com/articles/fork-a-repo/) نسخة من XOOPS واستخدام **git** لـ [استنساخ](https://help.github.com/categories/bootcamp/) هذا المستودع إلى صندوق التطوير الخاص بك.

نظراً لأن المستودع له بنية محددة، بدلاً من _نسخ_ الملفات من دليل _htdocs_ إلى خادم الويب الخاص بك، من الأفضل الإشارة إلى مجلد htdocs داخل المستودع المستنسخ محلياً. لتحقيق ذلك، عادة ما ننشئ _Virtual Host_ جديد، أو _vhost_ يشير إلى أكوادنا المتحكم بها بواسطة git.

في بيئة [WAMP](http://www.wampserver.com/)، الصفحة الافتراضية [localhost](http://localhost/) بها رابط في قسم _Tools_ يسمى _Add a Virtual Host_:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

باستخدام هذا، يمكنك إعداد إدخال VirtualHost سينتقل مباشرة إلى المستودع المتحكم بـ git الخاص بك (لا يزال).

إليك مثال على إدخال في `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

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

قد تحتاج أيضاً إلى إضافة إدخال في `Windows/System32/drivers/etc/hosts`:

```text
127.0.0.1    xoops.localhost
```

الآن، يمكنك التثبيت على `http://xoops.localhost/` للاختبار، مع الحفاظ على المستودع الخاص بك سليماً، والحفاظ على خادم الويب داخل دليل htdocs برابط بسيط. بالإضافة إلى ذلك، يمكنك تحديث نسختك المحلية من XOOPS إلى أحدث master في أي وقت دون الحاجة إلى إعادة التثبيت أو نسخ الملفات. ويمكنك إجراء تحسينات وإصلاحات على الأكواس للمساهمة مرة أخرى إلى XOOPS عبر GitHub.

## اعتماديات Composer

يستخدم XOOPS 2.7.0 [Composer](https://getcomposer.org/) لإدارة اعتماديات PHP الخاصة به. شجرة الاعتماديات تعيش في `htdocs/xoops_lib/` داخل المستودع المصدري:

* `composer.dist.json` هي القائمة الرئيسية للاعتماديات المشحونة مع الإصدار.
* `composer.json` هي النسخة المحلية، والتي يمكنك تخصيصها لبيئة التطوير الخاصة بك إذا لزم الأمر.
* `composer.lock` يثبت الإصدارات الدقيقة بحيث تكون التثبيتات قابلة للتكرار.
* `vendor/` يحتوي على المكتبات المثبتة (Smarty 4، PHPMailer، HTMLPurifier، firebase/php-jwt، monolog، symfony/var-dumper، xoops/xmf، xoops/regdom، وآخرين).

لنسخة git جديدة من XOOPS 2.7.0، بدءاً من جذر الريبوزيتوري، قم بتشغيل:

```text
cd htdocs/xoops_lib
composer install
```

لاحظ أنه لا يوجد `composer.json` في جذر المستودع - المشروع يعيش تحت `htdocs/xoops_lib/`، لذلك يجب عليك `cd` في هذا الدليل قبل تشغيل Composer.

أرشيفات الإصدار تُشحن مع `vendor/` مكتملة مسبقاً، لكن نسخ git قد لا تكون. احتفظ بـ `vendor/` سليماً على تثبيتات التطوير - XOOPS سيحمل اعتماديات منها في وقت التشغيل.

مكتبة [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) تُشحن كاعتماديات Composer في 2.7.0، لذلك يمكنك استخدام `Xmf\Request`، `Xmf\Database\TableLoad`، والفئات ذات الصلة في كود الوحدة الخاصة بك دون أي تثبيت إضافي.

## وحدة DebugBar

يُشحن XOOPS 2.7.0 بوحدة **DebugBar** استناداً إلى Symfony VarDumper. يضيف شريط أدوات التصحيح إلى الصفحات المعروضة التي تكشف عن معلومات الطلب وقاعدة البيانات والقالب. ثبتها من منطقة إدارة الوحدات على مواقع التطوير والإرسال. لا تتركها مثبتة على موقع الإنتاج المواجه للجمهور إلا إذا كنت تعرف أنك تريد ذلك.


