---
title: "DTO minta XOOPS-ban"
description: "Adatátviteli objektumok a tiszta adatkezeléshez"
---
# DTO minta (adatátviteli objektumok) a XOOPS-ban

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tipp [Mindkét verzióban működik]
A DTO-k sima PHP objektumok, keretrendszer-függőségek nélkül. A XOOPS 2.5.x és a XOOPS 4.0.x verziókban azonosan működnek. A PHP 8.2+ esetén használja a konstruktor tulajdonság promócióját és a csak olvasható osztályokat a tisztább szintaxis érdekében.
:::

Az adatátviteli objektumok (DTO) egyszerű objektumok, amelyeket az alkalmazás különböző rétegei közötti adatátvitelre használnak. A DTO-k segítenek megőrizni a fóliák közötti egyértelmű határokat, és csökkentik az entitásobjektumoktól való függőséget.

## DTO koncepció

### Mi az a DTO?
A DTO a következő:
- Egy egyszerű értékobjektum tulajdonságokkal
- Létrehozás után megváltoztathatatlan vagy csak olvasható
- Nincs üzleti logika vagy módszerek
- Adatátvitelre optimalizálva
- Független a kitartási mechanizmusoktól

### Mikor kell használni a DTO-kat

**Használjon DTO-t, ha:**
- Adatátvitel a rétegek között
- Adatok közzététele API-kon keresztül
- Több entitás adatainak összesítése
- A belső megvalósítás részleteinek elrejtése
- Változó adatstruktúra a különböző fogyasztók számára

## Alapvető DTO megvalósítás

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

## Használat a szolgáltatásokban

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

## Használat API vezérlőkben

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

## Bevált gyakorlatok

- Tartsa a DTO-kat fókuszáltan és specifikusan
- Tegye a DTO-kat megváltoztathatatlanná vagy csak olvashatóvá
- Ne foglaljon üzleti logikát a DTO-kba
- Használjon külön DTO-kat a bemenethez és a kimenethez
- A DTO tulajdonságait egyértelműen dokumentálja
- Legyen egyszerű a DTO-k – csak adattárolók

## Kapcsolódó dokumentáció

Lásd még:
- [Service-Layer](../Patterns/Service-Layer.md) a szolgáltatásintegrációhoz
- [Repository-Pattern](../Patterns/Repository-Pattern.md) az adathozzáféréshez
- [MVC-Pattern](../Patterns/MVC-Pattern.md) a vezérlő használatához
- [Tesztelés](../Best-Practices/Testing.md) a DTO teszteléshez

---

Címkék: #dto #adatátviteli objektumok #tervezési minták #modul-fejlesztés
