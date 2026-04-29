---
title: "DTO תבנית ב-XOOPS"
description: "אובייקטי העברת נתונים לטיפול בנתונים נקיים"
---
# DTO דפוס (אובייקטי העברת נתונים) ב-XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[עובד בשתי הגרסאות]
DTOs הם אובייקטים פשוטים של PHP ללא תלות מסגרת. הם עובדים באופן זהה ב-XOOPS 2.5.x וXOOPS 4.0.x. עבור PHP 8.2+, השתמש בקידום נכסי קונסטרוקטור ובמחלקות לקריאה בלבד עבור תחביר נקי יותר.
:::

אובייקטי העברת נתונים (DTOs) הם אובייקטים פשוטים המשמשים להעברת נתונים בין שכבות שונות של יישום. DTOs עוזרים לשמור על גבולות ברורים בין שכבות ולהפחית תלות באובייקטים של ישות.

## DTO קונספט

### מהו DTO?
DTO הוא:
- אובייקט ערך פשוט עם מאפיינים
- ניתן ללא שינוי או לקריאה בלבד לאחר היצירה
- אין היגיון עסקי או שיטות
- מותאם להעברת נתונים
- בלתי תלוי במנגנוני התמדה

### מתי להשתמש DTOs

**השתמש ב-DTOs כאשר:**
- העברת נתונים בין שכבות
- חשיפת נתונים דרך APIs
- צבירת נתונים ממספר ישויות
- הסתרת פרטי יישום פנימיים
- שינוי מבנה נתונים עבור צרכנים שונים

## בסיסי DTO יישום
```php
<?php
class UserDTO
{
    private $id;
    private $username;
    private $email;
    private $isActive;
    private $createdAt;
    
    public function __construct($entity = null)
    {
        if ($entity instanceof User) {
            $this->id = $entity->getId();
            $this->username = $entity->getUsername();
            $this->email = $entity->getEmail();
            $this->isActive = $entity->isActive();
            $this->createdAt = $entity->getCreatedAt();
        }
    }
    
    // Read-only accessors
    public function getId() { return $this->id; }
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function isActive() { return $this->isActive; }
    public function getCreatedAt() { return $this->createdAt; }
    
    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'isActive' => $this->isActive,
            'createdAt' => $this->createdAt,
        ];
    }
    
    public function toJson()
    {
        return json_encode($this->toArray());
    }
}
?>
```
## Request/Input DTO
```php
<?php
class CreateUserRequestDTO
{
    private $username;
    private $email;
    private $password;
    private $errors = [];
    
    public function __construct(array $data)
    {
        $this->username = $data['username'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        
        $this->validate();
    }
    
    private function validate()
    {
        if (empty($this->username) || strlen($this->username) < 3) {
            $this->errors['username'] = 'Username too short';
        }
        
        if (empty($this->email) || !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Invalid email';
        }
        
        if (empty($this->password) || strlen($this->password) < 6) {
            $this->errors['password'] = 'Password too short';
        }
    }
    
    public function isValid()
    {
        return empty($this->errors);
    }
    
    public function getErrors()
    {
        return $this->errors;
    }
    
    public function getUsername() { return $this->username; }
    public function getEmail() { return $this->email; }
    public function getPassword() { return $this->password; }
}
?>
```
## שימוש בשירותים
```php
<?php
class UserService
{
    public function createUserFromRequest(CreateUserRequestDTO $dto)
    {
        if (!$dto->isValid()) {
            throw new ValidationException('Invalid input', $dto->getErrors());
        }
        
        $user = new User();
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setPassword($dto->getPassword());
        
        $userId = $this->userRepository->save($user);
        
        return new UserDTO($user);
    }
}
?>
```
## שימוש בבקרים של API
```php
<?php
class ApiController
{
    public function createUserAction()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $dto = new CreateUserRequestDTO($input);
        
        if (!$dto->isValid()) {
            http_response_code(400);
            return ['success' => false, 'errors' => $dto->getErrors()];
        }
        
        try {
            $userDTO = $this->userService->createUserFromRequest($dto);
            http_response_code(201);
            return ['success' => true, 'data' => $userDTO->toArray()];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
```
## שיטות עבודה מומלצות

- שמור על DTOs ממוקד וספציפי
- הפוך את DTOs לבלתי משתנה או לקריאה בלבד
- אל תכלול היגיון עסקי ב-DTOs
- השתמש ב- DTOs נפרד עבור קלט ופלט
- מסמך DTO מאפיינים ברורים
- שמור על DTOs פשוט - רק מיכלי נתונים

## תיעוד קשור

ראה גם:
- [שכבת שירות](../Patterns/Service-Layer.md) לשילוב שירותים
- [Repository-Pattern](../Patterns/Repository-Pattern.md) לגישה לנתונים
- [MVC-Pattern](../Patterns/MVC-Pattern.md) לשימוש בבקר
- [בדיקה](../Best-Practices/Testing.md) לבדיקת DTO

---

תגיות: #dto #data-transfer-objects #design-patterns #module-development