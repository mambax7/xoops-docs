---
title: "الملحق 3: ترجمة XOOPS إلى لغة محلية"
dir: rtl
lang: ar
---

يُشحن XOOPS 2.7.0 مع ملفات اللغة الإنجليزية فقط. يتم الحفاظ على الترجمات إلى لغات أخرى من قبل المجتمع وتوزيعها عبر GitHub ومواقع دعم XOOPS المحلية المختلفة.

## أين يمكنك العثور على الترجمات الموجودة

- **GitHub** — يتم نشر ترجمات المجتمع بشكل متزايد كمستودعات منفصلة تحت [منظمة XOOPS](https://github.com/XOOPS) وفي حسابات المساهمين الأفراد. ابحث على GitHub عن `xoops-language-<your-language>` أو تصفح منظمة XOOPS للحصول على الحزم الحالية.
- **مواقع دعم XOOPS المحلية** — تنشر العديد من المجتمعات الإقليمية لـ XOOPS ترجمات على مواقعها الخاصة. قم بزيارة [https://xoops.org](https://xoops.org) واتبع الروابط إلى المجتمعات المحلية.
- **ترجمات الوحدات** — عادة ما تعيش ترجمات الوحدات المجتمعية الفردية بجانب الوحدة نفسها في منظمة `XoopsModules25x` على GitHub (`25x` في الاسم هو تاريخي؛ يتم الحفاظ على الوحدات هناك لكل من XOOPS 2.5.x و 2.7.x).

إذا كانت ترجمة للغتك موجودة بالفعل، قم بإسقاط دلائل اللغة في تثبيت XOOPS الخاص بك (انظر "كيفية تثبيت ترجمة" أدناه).

## ما الذي يحتاج إلى ترجمة

يحتفظ XOOPS 2.7.0 بملفات اللغة بجانب الأكواس التي تستهلكها. تغطي ترجمة كاملة جميع هذه المواقع:

- **Core** — `htdocs/language/english/` — ثوابت عامة في الموقع تستخدمها كل صفحة (تسجيل الدخول والأخطاء الشائعة والتواريخ وقوالب البريد وما إلى ذلك).
- **المثبت** — `htdocs/install/language/english/` — سلاسل يعرضها معالج التثبيت. ترجم هذه *قبل* تشغيل المثبت إذا كنت تريد تجربة تثبيت محلية.
- **وحدة النظام** — `htdocs/modules/system/language/english/` — بكل تأكيد أكبر مجموعة؛ تغطي لوحة التحكم الإدارية بالكامل.
- **الوحدات المدمجة** — كل من `htdocs/modules/pm/language/english/`، `htdocs/modules/profile/language/english/`، `htdocs/modules/protector/language/english/`، و `htdocs/modules/debugbar/language/english/`.
- **المواضيع** — حفنة من المواضيع تشحن ملفات اللغة الخاصة بها؛ تحقق من `htdocs/themes/<theme>/language/` إذا كان موجوداً.

ترجمة "core فقط" هي أقل وحدة مفيدة وتقابل النقطتين الأولى والثانية أعلاه.

## كيفية الترجمة

1. انسخ دليل `english/` بجانبه وأعد تسمية النسخة للغتك. يجب أن يكون اسم الدليل هو الاسم الإنجليزي بأحرف صغيرة للغة (`spanish`، `german`، `french`، `japanese`، `arabic`، إلخ).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. افتح كل ملف `.php` في الدليل الجديد وترجم **قيم السلاسل** داخل استدعاءات `define()`. لا تغيّر أسماء الثوابت — فهي مُشار إليها من أكواس PHP في جميع أنحاء النواة.

   ```php
   // قبل:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // بعد (الإسبانية):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **احفظ كل ملف بصيغة UTF-8 *بدون* BOM.** يستخدم XOOPS 2.7.0 `utf8mb4` من طرف إلى طرف (قاعدة البيانات والجلسات والإخراج) ويرفض الملفات التي تحتوي على علامة ترتيب البايت. في Notepad++ هذا هو الخيار **"UTF-8"**، *وليس* "UTF-8-BOM". في VS Code إنه الافتراضي؛ فقط تأكد من الترميز في شريط الحالة.

4. حدّث البيانات الوصفية للغة والمجموعة في أعلى كل ملف لتطابق لغتك:

   ```php
   // _LANGCODE: ar
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   يجب أن يكون `_LANGCODE` هو كود [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) للغتك. `_CHARSET` هو دائماً `UTF-8` في XOOPS 2.7.0 — لا توجد نسخة ISO-8859-1 أخرى.

5. كرر هذا للمثبت ووحدة النظام وأي وحدات مدمجة تحتاجها.

## كيفية تثبيت ترجمة

إذا حصلت على ترجمة منتهية كشجرة دليل:

1. انسخ كل دليل `<language>/` إلى `language/english/` الأبوي المطابق في تثبيت XOOPS الخاص بك. على سبيل المثال، انسخ `language/spanish/` إلى `htdocs/language/`، `install/language/spanish/` إلى `htdocs/install/language/`، وهكذا.
2. تأكد من أن ملكية الملف والأذونات قابلة للقراءة من قبل خادم الويب.
3. إما أن تحدد اللغة الجديدة في وقت التثبيت (يقوم المعالج بمسح `htdocs/language/` للغات المتاحة) أو على موقع موجود، غيّر اللغة في **Admin → System → Preferences → General Settings**.

## مشاركة ترجمتك

يرجى المساهمة بترجمتك مرة أخرى للمجتمع.

1. أنشئ مستودع GitHub (أو انسخ مستودع لغة موجود إذا كان موجوداً للغتك).
2. استخدم اسماً واضحاً مثل `xoops-language-<language-code>` (على سبيل المثال `xoops-language-ar`، `xoops-language-pt-br`).
3. عكس بنية دليل XOOPS داخل المستودع الخاص بك بحيث تتطابق الملفات مع حيث يتم نسخها:

   ```
   xoops-language-ar/
   ├── language/arabic/(files).php
   ├── install/language/arabic/(files).php
   └── modules/system/language/arabic/(files).php
   ```

4. أدرج `README.md` يوثق:
   - اسم اللغة وكود ISO
   - توافق إصدار XOOPS (على سبيل المثال `XOOPS 2.7.0+`)
   - المترجم والاستحقاقات
   - ما إذا كانت الترجمة core-only أم تغطي الوحدات المدمجة
5. افتح طلب pull ضد المستودع ذي الصلة للوحدة/النواة على GitHub أو انشر إعلاناً على [https://xoops.org](https://xoops.org) حتى يتمكن المجتمع من العثور عليه.

> **ملاحظة**
>
> إذا كانت لغتك تتطلب تغييرات في النواة لتنسيق التاريخ أو التقويم، فأدرج هذه التغييرات في الحزمة أيضاً. تعمل اللغات التي تحتوي على نصوص من اليمين إلى اليسار (العربية والعبرية والفارسية والأردية) بشكل مباشر في XOOPS 2.7.0 — تمت إضافة دعم RTL في هذا الإصدار والمواضيع الفردية تختاره تلقائياً.
