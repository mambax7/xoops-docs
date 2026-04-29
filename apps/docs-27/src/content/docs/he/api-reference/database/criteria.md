---
title: "קריטריונים וקריטריונים כיתות קומפו"
description: "בניית שאילתות וסינון מתקדם באמצעות מחלקות קריטריונים"
---
המחלקות `Criteria` ו`CriteriaCompo` מספקות ממשק שוטף ומונחה עצמים לבניית שאילתות מסד נתונים מורכבות. מחלקות אלה מופשטות סעיפי SQL WHERE, המאפשרים למפתחים לבנות שאילתות דינמיות בצורה בטוחה וקריאה.

## סקירת כיתה

### כיתת קריטריונים

המחלקה `Criteria` מייצגת תנאי יחיד בסעיף WHERE:
```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```
## שימוש בסיסי

### קריטריונים פשוטים
```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### מפעילים שונים
```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```
## בניית שאילתות מורכבות

### AND לוגיקה (ברירת מחדל)
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### או לוגיקה
```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## אינטגרציה עם דפוס מאגר

### דוגמה למאגר
```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```
## בטיחות ואבטחה

### בריחה אוטומטית

המחלקה `Criteria` בורחת אוטומטית לערכים כדי למנוע הזרקת SQL:
```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## API הפניה

### קריטריונים שיטות

| שיטה | תיאור | חזור |
|--------|-------------|--------|
| `__construct()` | אתחול תנאי קריטריונים | בטל |
| `render($prefix = '')` | עיבוד לקטע סעיף SQL WHERE | מחרוזת |
| `getColumn()` | קבל את שם העמודה | מחרוזת |
| `getValue()` | קבל את ערך ההשוואה | מעורב |
| `getOperator()` | קבל את אופרטור ההשוואה | מחרוזת |

### CriteriaCompo Methods

| שיטה | תיאור | חזור |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | אתחול קריטריונים מורכבים | בטל |
| `add($criteria, $logic = null)` | הוסף קריטריונים או רכיב מקונן | בטל |
| `render($prefix = '')` | עיבוד להשלמת WHERE סעיף | מחרוזת |
| `count()` | קבל מספר קריטריונים | int |
| `clear()` | הסר את כל הקריטריונים | בטל |

## תיעוד קשור

- XoopsDatabase - הפניה למחלקות מסד נתונים
- ../../03-Module-Development/Patterns/Repository-Pattern - תבנית מאגר ב-XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - תבנית שכבת שירות

## מידע גרסה

- **הצגה:** XOOPS 2.5.0
- **עדכון אחרון:** XOOPS 4.0
- **תאימות:** PHP 7.4+