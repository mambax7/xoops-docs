---
title: "أدوات المهنة"
dir: rtl
lang: ar
---

هناك العديد من الأشياء المطلوبة لتخصيص وصيانة موقع XOOPS ويب الذي يجب أن تحدث خارج XOOPS، أو يسهل القيام بها هناك.

هذه قائمة بأنواع الأدوات التي قد تريد أن تكون متاحة، جنباً إلى جنب مع بعض الاقتراحات للأدوات المحددة التي وجدها مسؤولو ويب XOOPS مفيدة.

## المحررون

المحررون اختيار شخصي جداً، والناس يمكن أن تصبح مشغوفة جداً بمفضلهم. سنقدم فقط القليل من الإمكانيات الكثيرة.

لاستخدام XOOPS، ستحتاج إلى محرر لتعديل بعض خيارات التكوين وكذلك تخصيص موضوع لموقعك. لهذه الاستخدامات، يمكن أن يكون من المفيد جداً أن يكون لديك محرر يمكن أن يعمل مع ملفات متعددة في نفس الوقت، ويكون قادراً على البحث والاستبدال عبر ملفات عديدة، وتوفير تسليط الضوء على بناء الجملة. يمكنك استخدام محرر بسيط جداً بدون أجراس، لكنك ستعمل بجد أكثر لإنجاز بعض المهام.

**PhpStorm** من _JetBrains_ هو بيئة تطوير متكاملة (IDE) صممت خصيصاً لتطوير ويب PHP. كانت _JetBrains_ مفيدة جداً في رعاية XOOPS، ومنتجاتها مفضلة لدى العديد من المطورين. إنه منتج تجاري، وقد يكون مرتفع التكلفة لبعض مسؤولي الويب الجدد، لكن الوقت الذي يمكن أن يوفره يجعله جاذباً للمطورين ذوي الخبرة.

**Visual Studio Code** محرر كود مفتوح المصدر متعدد الأنظمة الأساسية من Microsoft. لديه دعم، إما مدمج أو من خلال ملحقات، للتقنيات الويب الأساسية مثل HTML و JavaScript و PHP، مما يجعله مناسباً لاستخدام XOOPS.

**Notepad++** منافس موثوق ومجاني في هذه الفئة لنظام Windows، مع مستخدمين مخلصين.

**Meld** ليس محرراً، لكنه يقارن ملفات النص يعرض الفروقات، ويسمح بدمج التغييرات انتقائياً، وإجراء تعديلات صغيرة. إنه مفيد جداً عند مقارنة ملفات التكوين وقوالب الموضوع وبالطبع كود PHP.

| الاسم | الرابط | الترخيص | المنصة |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | تجاري | أي |
| Visual Studio Code | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | أي |
| Notepad++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Win |
| Meld | [https://meldmerge.org/](https://meldmerge.org/) | GPL | أي |

## عميل FTP

بروتوكول نقل الملفات (FTP،) أو اختلاف، يتم استخدامه لنقل الملفات من جهاز كمبيوتر إلى آخر. سيحتاج معظم تثبيتات XOOPS إلى عميل FTP لنقل الملفات التي تأتي من توزيع XOOPS إلى نظام مضيف حيث سيتم نشر الموقع.

**FileZilla** عميل FTP قوي ومجاني متاح لمعظم الأنظمة الأساسية. جعلت التناسق متعدد الأنظمة الأساسية اختياراً لأمثلة FTP في هذا الكتاب.

**PuTTY** عميل SSH مجاني مفيد للوصول إلى الأصداف إلى خادم، فضلاً عن توفير قدرات نقل الملفات مع SCP

**WinSCP** عميل FTP/SFTP/SCP لأنظمة Windows.

| الاسم | الرابط | الترخيص | المنصة |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | أي |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Win/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

تحتوي قاعدة البيانات على جميع محتويات موقعك وتكوينات التخصيص لموقعك ومعلومات عن مستخدمي موقعك والمزيد. قد يكون حماية وصيانة هذه المعلومات أسهل مع بعض الأدوات الإضافية التي تتعامل بشكل خاص مع قاعدة البيانات.

**phpMyAdmin** هي الأداة الأكثر شهرة المستندة على الويب للعمل مع قواعد بيانات MySQL، بما في ذلك إجراء نسخ احتياطية لمرة واحدة.

**BigDump** نعمة لحسابات الاستضافة المحدودة، حيث تساعد في استعادة عمليات نسخ احتياطي كبيرة لقاعدة البيانات مع تجنب انتهاء المهلة الزمنية وقيود الحجم.

**srdb** و Search Replace DB لـ XOOPS هو تكيف XOOPS لـ [Search and Replace DB](https://github.com/interconnectit/Search-Replace-DB) من interconnect/it. إنه مفيد بشكل خاص لتغيير عناوين URL والمراجع نظام الملفات في بيانات MySQL عندما تنقل موقعاً.

| الاسم | الرابط | الترخيص | المنصة |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | أي |
| BigDump | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | أي |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | أي |

## مكدسات المطور

بعض الأنظمة الأساسية، مثل Ubuntu، لديها المكدس الكامل المطلوب لتشغيل XOOPS مدمج، بينما تحتاج الآخرون إلى بعض الإضافات.

**WAMP** و **Uniform Server Zero** كلها مكدسات شاملة لنظام Windows.

**XAMPP** و مكدس شامل من Apache Friends متاح لأنظمة أساسية متعددة.

**bitnami** يقدم مجموعة واسعة من مكدسات التطبيقات المدمجة مسبقاً بما في ذلك صور الآلة الافتراضية والحاويات. قد تكون عروضهم مورداً قيماً لتجربة التطبيقات بسرعة (بما في ذلك XOOPS) أو تقنيات ويب مختلفة. يمكنهم أن يكونوا مناسبين للإنتاج وكذلك تطوير الاستخدام.

**Docker** هو منصة حاوية التطبيقات المستخدمة لإنشاء وتشغيل الحاويات لتنفيذ بيئات مخصصة.

**Devilbox** هو مكدس تطوير مستند إلى Docker سهل الإعداد. يوفر مجموعة واسعة من الإصدارات لجميع مكونات المكدس، ويسمح للمطورين بالاختبار في بيئة قابلة للتكرار والقابلة للمشاركة.

| الاسم | الرابط | الترخيص | المنصة |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | متعدد | Win |
| Uniform Server Zero | [http://www.uniformserver.com/](http://www.uniformserver.com/) | متعدد | Win |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | متعدد | أي |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | متعدد | أي |
| Docker | [https://www.docker.com/](https://www.docker.com/) | متعدد | أي |
| Devilbox | [http://devilbox.org/](http://devilbox.org/) | MIT | أي |
