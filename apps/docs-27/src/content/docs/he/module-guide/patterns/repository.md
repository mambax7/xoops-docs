---
title: "דפוס מאגר ב-XOOPS"
description: "יישום שכבת הפשטה של ​​גישה לנתונים"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::הערה[לא בטוח אם זה התבנית הנכונה?]
ראה [בחירת דפוס גישה לנתונים](../Choosing-Data-Access-Pattern.md) לעץ החלטות המשווה בין מטפלים, מאגרים, שירותים ו-CQRS.
:::

:::טיפ[עובד היום ומחר]
דפוס המאגר **עובד גם ב-XOOPS 2.5.x וגם ב-XOOPS 4.0.x**. ב-2.5.x, עטפו את ה-`XoopsPersistableObjectHandler` הקיים שלכם במחלקת Repository כדי לקבל את יתרונות ההפשטה:

| גישה | XOOPS 2.5.x | XOOPS 4.0 |
|--------|-------------|--------|
| גישה ישירה למטפל | `xoops_getModuleHandler()` | דרך מיכל DI |
| עטיפת מאגר | ✅ מומלץ | ✅ דפוס מקומי |
| בדיקה עם לעג | ✅ עם DI ידני | ✅ חיווט אוטומטי של מיכל |

**התחל עם דפוס Repository עוד היום** כדי להכין את המודולים שלך להעברת XOOPS 4.0.
:::

The Repository Pattern הוא דפוס גישה לנתונים שמפשט פעולות של מסד נתונים, ומספק ממשק נקי לגישה לנתונים. הוא פועל כמתווך בין שכבות ההיגיון העסקי ומיפוי הנתונים.

## קונספט מאגר

דפוס המאגר מספק:
- הפשטה של פרטי הטמעת מסד נתונים
- קל לעג לבדיקת יחידות
- לוגיקת גישה לנתונים מרכזית
- גמישות לשינוי מסד נתונים מבלי להשפיע על ההיגיון העסקי
- הגיון גישה לנתונים לשימוש חוזר בכל האפליקציה

## מתי להשתמש במאגרים

**השתמש במאגרים כאשר:**
- העברת נתונים בין שכבות אפליקציה
- צורך בשינוי הטמעת מסד נתונים
- כתיבת קוד בר בדיקה עם דוגמניות
- הפשטת דפוסי גישה לנתונים

## דפוס יישום

```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```

## שימוש בשירותים

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
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```

## שיטות עבודה מומלצות

- השתמש בממשקים להגדרת חוזי מאגר
- כל מאגר מטפל בסוג ישות אחד
- שמור על היגיון עסקי בשירותים, לא במאגרים
- השתמש באובייקטי ישות למיפוי נתונים
- זרוק חריגים מתאימים עבור פעולות לא חוקיות

## תיעוד קשור

ראה גם:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) לשילוב בקר
- [שכבת שירות](../Patterns/Service-Layer.md) להטמעת שירות
- [DTO-Pattern](DTO-Pattern.md) עבור אובייקטי העברת נתונים
- [בדיקה](../Best-Practices/Testing.md) לבדיקת מאגר

---

תגיות: #repository-pattern #data-access #design-patterns #module-development
