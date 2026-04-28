---
title: "Словарь XOOPS"
description: "Полный справочник терминов и концепций XOOPS CMS с определениями на русском языке"
---

# Словарь XOOPS

> Комплексный справочник терминов, концепций и аббревиатур, используемых в экосистеме XOOPS CMS.
> Термины расположены в алфавитном порядке по английскому написанию.

---

## A

### Admin Framework
Стандартизированная инфраструктура административного интерфейса, введённая в XOOPS 2.3. Обеспечивает единообразный вид и поведение страниц администрирования во всех модулях.

### ADR (Architecture Decision Record)
Документ, фиксирующий значимое архитектурное решение: описание контекста, рассмотренных вариантов и обоснования принятого выбора. Хранится в директории `docs/adrs/`.

### Anonymous User
Незарегистрированный посетитель сайта. В XOOPS представлен группой «Анонимные пользователи» (Anonymous Users). Идентификатор группы — `XOOPS_GROUP_ANONYMOUS`.

### Autoloading
Автоматическая загрузка PHP-классов по требованию без явного `require`. Современный XOOPS использует стандарт PSR-4:
```
XoopsModules\MyModule\MyClass  →  modules/mymodule/class/MyClass.php
```

---

## B

### Block (Блок)
Самостоятельная единица контента, размещаемая в регионах темы (сайдбар, шапка, подвал и т. д.). Блоки могут отображать динамический контент модуля, статический HTML или системные данные.

```php
// Регистрация блока в xoops_version.php
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'Мой блок',
    'show_func' => 'mymodule_block_show',
    'edit_func' => 'mymodule_block_edit',
];
```

### Bootstrap (Инициализация)
Процесс запуска ядра XOOPS перед выполнением кода модуля. Включает подключение `mainfile.php`, инициализацию базы данных, сессии и объекта `$xoops`.

---

## C

### Cache (Кэш)
Механизм временного хранения скомпилированных шаблонов Smarty и других данных для ускорения работы сайта. Директории кэша: `xoops_data/caches/smarty_cache/` и `xoops_data/caches/smarty_compile/`.

### Captcha
Механизм защиты от автоматических ботов при регистрации и отправке форм. Настраивается в `xoops_data/configs/captcha/`.

### Criteria
Класс для построения условий SQL-запросов объектно-ориентированным способом без написания сырого SQL.

```php
use Criteria;
use CriteriaCompo;

$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('uid', $xoopsUser->uid()));
$criteria->setSort('date');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
```

### CriteriaCompo
Составной объект `Criteria`, позволяющий объединять несколько условий через `AND` или `OR`.

```php
$c1 = new Criteria('status', 1);
$c2 = new Criteria('visible', 1);
$criteria = new CriteriaCompo($c1, 'AND');
$criteria->add($c2);
```

### CSRF (Cross-Site Request Forgery)
Атака, при которой вредоносный сайт заставляет браузер пользователя выполнить нежелательное действие на доверенном сайте. XOOPS защищает формы с помощью `XoopsFormHiddenToken`.

```php
$form->addElement(new XoopsFormHiddenToken());
// При обработке:
if (!$xoopsSecurity->check()) {
    // Недействительный токен — отклонить
}
```

### CRUD
Базовые операции с данными: **C**reate (создание), **R**ead (чтение), **U**pdate (обновление), **D**elete (удаление). Реализуются через `XoopsObjectHandler`.

---

## D

### Database Abstraction Layer (DAL)
Уровень абстракции базы данных в XOOPS, реализованный классом `XoopsDatabase`. Изолирует код от конкретной СУБД и обеспечивает защиту от SQL-инъекций.

### Dirname (Имя директории модуля)
Уникальный идентификатор модуля — имя его директории в папке `modules/`. Используется во всей системе для ссылок на модуль. Например: `publisher`, `news`, `mymodule`.

### Domain Model (Доменная модель)
Архитектурный паттерн, в котором бизнес-логика инкапсулируется в объектах предметной области, а не в контроллерах или процедурных скриптах.

### DTO (Data Transfer Object)
Объект для передачи данных между слоями приложения без бизнес-логики. Используется для передачи данных из репозитория в слой представления.

```php
class ArticleDto
{
    public function __construct(
        public readonly int    $id,
        public readonly string $title,
        public readonly string $body,
    ) {}
}
```

### DTYPE (Data Type Constants)
Константы, определяющие тип хранения и способ очистки переменных `XoopsObject`:

| Константа | Описание |
|-----------|----------|
| `XOBJ_DTYPE_INT` | Целое число |
| `XOBJ_DTYPE_FLOAT` | Число с плавающей точкой |
| `XOBJ_DTYPE_TXTBOX` | Текст одной строки |
| `XOBJ_DTYPE_TXTAREA` | Многострочный текст |
| `XOBJ_DTYPE_EMAIL` | Адрес электронной почты |
| `XOBJ_DTYPE_URL` | URL-адрес |
| `XOBJ_DTYPE_ARRAY` | Массив |
| `XOBJ_DTYPE_SOURCE` | HTML-исходник (не очищается) |

---

## E

### Event (Событие)
Уведомление о произошедшем действии в жизненном цикле XOOPS. Обработчики событий регистрируются через Preload-классы (2.5.x) или PSR-14 EventDispatcher (4.0+).

### Event System (Система событий)
Механизм слабой связности компонентов: модуль публикует событие, а любой другой модуль может подписаться на него и выполнить собственную логику.

---

## F

### Form Element (Элемент формы)
Компонент системы форм XOOPS (`XoopsForm`), представляющий отдельное поле HTML-формы: текстовое поле, флажок, список, загрузчик файлов и т. д.

```php
$form = new XoopsThemeForm('Редактировать статью', 'editform', 'edit.php');
$form->addElement(new XoopsFormText('Заголовок', 'title', 50, 255, $obj->getVar('title')));
$form->addElement(new XoopsFormEditor('Текст', 'body', [], $obj->getVar('body')));
```

### FTP (File Transfer Protocol)
Протокол передачи файлов, используемый для загрузки файлов XOOPS на веб-сервер при установке или обновлении.

---

## G

### Group (Группа)
Набор пользователей с общим набором прав доступа. Встроенные группы:

| Константа | ID | Назначение |
|-----------|----|------------|
| `XOOPS_GROUP_ADMIN` | 1 | Веб-мастера (полный доступ) |
| `XOOPS_GROUP_USERS` | 2 | Зарегистрированные пользователи |
| `XOOPS_GROUP_ANONYMOUS` | 3 | Анонимные посетители |

---

## H

### Handler (Обработчик объектов)
Класс, управляющий CRUD-операциями для конкретного типа `XoopsObject`. Предоставляет методы `get()`, `getAll()`, `insert()`, `delete()`, `getCount()`.

```php
$handler = xoops_getModuleHandler('article', 'publisher');
$article = $handler->get($id);
$articles = $handler->getAll($criteria);
$handler->insert($article, true); // true = форс-очистка
$handler->delete($article);
```

### Header (Заголовок страницы)
Вызов `include XOOPS_ROOT_PATH . '/header.php'` — инициализирует тему, Smarty и отображает верхнюю часть страницы.

### Helper
Синглтон-класс, обеспечивающий централизованный доступ к обработчикам модуля, конфигурации и сервисам.

```php
// Получение экземпляра
$helper = \XoopsModules\Publisher\Helper::getInstance();

// Использование
$config  = $helper->getConfig('items_per_page');
$handler = $helper->getHandler('article');
```

### Hook (Хук)
Точка расширения в коде XOOPS, позволяющая модулям вставлять собственный код в предопределённые моменты выполнения.

---

## I

### initVar()
Метод `XoopsObject` для объявления переменных объекта с типом, параметрами очистки и значением по умолчанию.

```php
public function __construct()
{
    $this->initVar('id',     XOBJ_DTYPE_INT,    null, false);
    $this->initVar('title',  XOBJ_DTYPE_TXTBOX, null, true,  255);
    $this->initVar('body',   XOBJ_DTYPE_TXTAREA);
    $this->initVar('status', XOBJ_DTYPE_INT,    1);
}
```

---

## K

### Kernel (Ядро)
Набор основных классов XOOPS, обеспечивающих фундаментальную функциональность: `XoopsDatabase`, `XoopsUser`, `XoopsSecurity`, `XoopsModule` и др.

---

## L

### Language File (Языковой файл)
PHP-файл с константами интернационализации, расположенный в `language/[код_языка]/`. Например: `language/russian/main.php`.

```php
// language/russian/main.php
define('_MI_MYMODULE_NAME', 'Мой модуль');
define('_MI_MYMODULE_DESC', 'Описание моего модуля');
```

---

## M

### mainfile.php
Основной файл конфигурации XOOPS: содержит учётные данные базы данных, определения путей и ключи безопасности. Расположен в корне сайта. **Не должен быть доступен из браузера.**

### Migration (Миграция базы данных)
Управляемое изменение схемы базы данных при обновлении модуля. Реализуется через файлы SQL или скрипты обновления в директории `sql/`.

### Module (Модуль)
Самостоятельный пакет функциональности, расширяющий XOOPS. Устанавливается в `modules/[dirname]/`. Каждый модуль имеет файл манифеста `xoops_version.php`.

### MVC (Model-View-Controller)
Архитектурный паттерн, разделяющий приложение на три компонента:
- **Model** — данные и бизнес-логика (`XoopsObject` + `XoopsObjectHandler`)
- **View** — представление (шаблоны Smarty `.tpl`)
- **Controller** — обработка запросов (`admin/`, `index.php`)

---

## N

### Namespace (Пространство имён)
Механизм PHP для организации классов и предотвращения конфликтов имён. Конвенция XOOPS:

```php
namespace XoopsModules\Dirname;
// Пример: XoopsModules\Publisher\Article
```

### Notification (Уведомление)
Встроенная система XOOPS для оповещения пользователей о событиях (новые комментарии, публикации и т. п.) через электронную почту или личные сообщения.

---

## P

### Permission (Разрешение)
Право доступа, назначаемое группе для выполнения определённых действий в модуле. Управляется через `XoopsGroupPermHandler`.

```php
$gperm = xoops_getHandler('groupperm');
if ($gperm->checkRight('module_read', $moduleId, $groups)) {
    // Доступ разрешён
}
```

### Preload
Класс, автоматически загружаемый XOOPS из директории `preloads/` модуля. Позволяет подписываться на системные события без изменения ядра.

```php
// preloads/mymodule.php
class MymodulePreload extends XoopsPreloadItem
{
    public static function eventCoreHeaderFinish($args): void
    {
        // Выполняется при формировании шапки страницы
    }
}
```

### PSR (PHP Standards Recommendation)
Стандарты PHP-FIG (Framework Interop Group), принятые в современном XOOPS:
- **PSR-1/2/12** — стиль кодирования
- **PSR-3** — интерфейс логгера
- **PSR-4** — автозагрузка
- **PSR-7** — HTTP-сообщения
- **PSR-11** — контейнер зависимостей
- **PSR-14** — диспетчер событий
- **PSR-15** — HTTP-обработчики

---

## Q

### QueryBuilder (Построитель запросов)
Объектно-ориентированный интерфейс для построения SQL-запросов без написания строк SQL вручную.

```php
$qb = $xoopsDB->createQueryBuilder();
$qb->select('*')
   ->from('articles', 'a')
   ->where('a.status = :status')
   ->setParameter('status', 1)
   ->orderBy('a.date', 'DESC');
```

---

## R

### Renderer (Рендерер)
Класс, отвечающий за HTML-вывод элементов форм или других UI-компонентов в определённом стиле (Bootstrap, Foundation и т. д.).

### Repository (Репозиторий)
Паттерн проектирования: объект, инкапсулирующий всю логику доступа к данным для сущности. Разграничивает бизнес-логику и слой хранения.

```php
class ArticleRepository
{
    public function findPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo(new Criteria('status', 1));
        $criteria->setLimit($limit);
        return $this->handler->getAll($criteria);
    }
}
```

---

## S

### Sanitizer / TextSanitizer
Класс `MyTextSanitizer` для очистки и форматирования пользовательского HTML: удаление опасных тегов, преобразование BB-кодов. Настройки в `xoops_data/configs/textsanitizer/`.

### Service (Сервис)
Класс, инкапсулирующий переиспользуемую бизнес-логику. Как правило, доступен через `Helper` модуля.

```php
class ArticleService
{
    public function publish(Article $article): bool
    {
        $article->setVar('status', 1);
        $article->setVar('published', time());
        return $this->repository->save($article);
    }
}
```

### Smarty
Механизм шаблонов PHP, используемый XOOPS для разделения логики и представления. Переменные выводятся через `<{$var}>`, функции — через `<{func}>`.

```smarty
<{foreach item=article from=$articles}>
    <h2><{$article.title|htmlspecialchars}></h2>
    <p><{$article.body}></p>
<{/foreach}>
```

### SQL Injection (SQL-инъекция)
Атака безопасности: внедрение вредоносного SQL-кода в запрос через пользовательский ввод. Предотвращается с помощью подготовленных запросов и метода `$xoopsDB->quote()`.

### SSL / TLS
Протоколы шифрования HTTPS-соединения. Для XOOPS рекомендуется `XOOPS_PROT = 'https://'` и установка защищённых cookie.

---

## T

### Template (Шаблон)
Файл Smarty (`.tpl` или `.html`), определяющий слой представления модуля или темы. Хранится в `templates/` модуля или `templates/` темы.

### Theme (Тема)
Набор шаблонов, CSS и активов, определяющих визуальное оформление сайта. Хранится в `themes/[название_темы]/`.

### Token (Токен)
Случайное значение, встраиваемое в форму для защиты от CSRF. Генерируется `XoopsSecurity::createToken()`, проверяется `XoopsSecurity::check()`.

---

## U

### uid (User ID)
Уникальный числовой идентификатор пользователя в системе. Значение `0` соответствует анонимному пользователю.

### Unit of Work (Единица работы)
Паттерн, отслеживающий изменения объектов в рамках транзакции и сохраняющий их за один проход, минимизируя число обращений к БД.

### Upgrade Script (Скрипт обновления)
PHP-скрипт в директории `sql/` или `upgrade/` модуля, выполняющий миграцию базы данных при обновлении модуля на новую версию.

---

## V

### var / initVar()
Механизм объявления полей объекта в `XoopsObject`. Каждое поле имеет тип (`DTYPE`), флаг обязательности и максимальную длину.

---

## W

### Webmaster
Пользователь, входящий в группу `XOOPS_GROUP_ADMIN` (ID = 1). Имеет полный административный доступ ко всем функциям сайта.

### Widget
Небольшой самостоятельный компонент пользовательского интерфейса, аналогичный блоку, но предназначенный для встраивания внутрь страниц.

---

## X

### XMF (XOOPS Module Framework)
Библиотека утилит и паттернов для современной разработки модулей XOOPS. Включает: `Helper`, `Request`, `Metagen`, `JWT`, `Database`, `PermissionHelper` и др.

```php
use Xmf\Module\Helper;
use Xmf\Request;

$helper = Helper::getHelper('mymodule');
$id     = Request::getInt('id', 0, 'GET');
```

### XOBJ_DTYPE
Семейство констант, определяющих тип данных переменных `XoopsObject`. Подробнее — см. **DTYPE**.

### XOOPS
**eX**tensible **O**bject-**O**riented **P**ortal **S**ystem — система управления содержимым с открытым исходным кодом на PHP, ориентированная на модульную архитектуру и сообщество разработчиков.

### xoops_data/
Директория вне webroot для хранения конфигурационных файлов, кэша и временных данных XOOPS. Не должна быть доступна из браузера.

### XoopsDatabase
Класс абстракции базы данных. Предоставляет методы выполнения запросов, экранирования строк и управления соединением с MySQL/MariaDB.

```php
global $xoopsDB;
$sql    = 'SELECT * FROM ' . $xoopsDB->prefix('articles') . ' WHERE status = 1';
$result = $xoopsDB->query($sql);
while ($row = $xoopsDB->fetchArray($result)) {
    // Обработка строки
}
```

### XoopsForm
Система программной генерации HTML-форм. Обеспечивает валидацию, защиту от CSRF и совместимость с темами оформления.

### XoopsModule
Класс, представляющий установленный модуль. Содержит мета-данные и конфигурацию модуля, прочитанные из `xoops_version.php`.

### XoopsObject
Базовый класс для всех сущностей данных в XOOPS. Предоставляет управление переменными через `initVar()`, автоматическую очистку и методы `getVar()` / `setVar()`.

```php
class Article extends XoopsObject
{
    public function __construct()
    {
        $this->initVar('id',    XOBJ_DTYPE_INT,    null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, null, true, 255);
        $this->initVar('body',  XOBJ_DTYPE_TXTAREA);
    }
}
```

### XoopsObjectHandler
Базовый класс обработчика объектов. Потомки реализуют CRUD-операции для конкретного `XoopsObject`.

```php
class ArticleHandler extends XoopsObjectHandler
{
    public function create(bool $isNew = true): Article
    {
        return new Article();
    }
    // get(), insert(), delete(), getAll(), getCount() — наследуются
}
```

### XoopsSecurity
Класс для защиты от CSRF, XSS и других атак. Предоставляет генерацию и проверку токенов, а также вспомогательные методы безопасности.

### XoopsUser
Класс, представляющий зарегистрированного пользователя. Доступен глобально через `$xoopsUser`.

```php
if ($xoopsUser) {
    $uid    = $xoopsUser->uid();
    $uname  = $xoopsUser->uname();
    $groups = $xoopsUser->getGroups();
    $isAdmin = $xoopsUser->isAdmin($moduleId);
}
```

### xoops_version.php
Файл манифеста модуля. Определяет название, версию, таблицы БД, блоки, шаблоны, пункты меню и параметры конфигурации модуля через массив `$modversion`.

### XSS (Cross-Site Scripting)
Атака: внедрение вредоносного JavaScript в страницы сайта через пользовательский ввод. Предотвращается экранированием вывода (`htmlspecialchars()`, `|htmlspecialchars` в Smarty).

---

## Таблица аббревиатур

| Аббревиатура | Расшифровка | Русское название |
|-------------|-------------|-----------------|
| XOOPS | eXtensible Object-Oriented Portal System | Расширяемая объектно-ориентированная портальная система |
| XMF | XOOPS Module Framework | Фреймворк модулей XOOPS |
| CMS | Content Management System | Система управления содержимым |
| CRUD | Create, Read, Update, Delete | Создание, чтение, обновление, удаление |
| CSRF | Cross-Site Request Forgery | Межсайтовая подделка запроса |
| DAL | Database Abstraction Layer | Уровень абстракции базы данных |
| DI | Dependency Injection | Внедрение зависимостей |
| DTO | Data Transfer Object | Объект передачи данных |
| FTP | File Transfer Protocol | Протокол передачи файлов |
| MVC | Model-View-Controller | Модель-Представление-Контроллер |
| ORM | Object-Relational Mapping | Объектно-реляционное отображение |
| PHP-FIG | PHP Framework Interop Group | Группа совместимости PHP-фреймворков |
| PSR | PHP Standards Recommendation | Рекомендация стандартов PHP |
| SQL | Structured Query Language | Язык структурированных запросов |
| SSL/TLS | Secure Sockets Layer / Transport Layer Security | Протокол безопасного соединения |
| XSS | Cross-Site Scripting | Межсайтовый скриптинг |
| ADR | Architecture Decision Record | Запись архитектурного решения |
| JWT | JSON Web Token | JSON веб-токен |

---

## Связанная документация

- [Основные концепции](../core-concepts/architecture.md)
- [Справочник API](../api-reference/index.md)
- [Руководство по модулям](../module-guide/introduction.md)
- [Паттерны проектирования](../core-concepts/design-patterns.md)
