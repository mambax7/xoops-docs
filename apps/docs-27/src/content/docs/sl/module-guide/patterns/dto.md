---
title: "DTO Vzorec v XOOPS"
description: "Objekti prenosa podatkov za čisto obdelavo podatkov"
---
# DTO Vzorec (predmeti prenosa podatkov) v XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Deluje v obeh različicah]
DTO so navadni PHP objekti brez odvisnosti od ogrodja. Enako delujeta v XOOPS 2.5.x in XOOPS 4.0.x. Za PHP 8.2+ uporabite napredovanje lastnosti konstruktorja in razrede samo za branje za čistejšo sintakso.
:::

Objekti za prenos podatkov (DTO) so preprosti objekti, ki se uporabljajo za prenos podatkov med različnimi plastmi aplikacije. DTO-ji pomagajo ohranjati jasne meje med plastmi in zmanjšujejo odvisnosti od objektov entitet.

## DTO Koncept

### Kaj je DTO?
DTO je:
- Preprost objekt vrednosti z lastnostmi
- Nespremenljiv ali samo za branje po ustvarjanju
- Brez poslovne logike ali metod
- Optimiziran za prenos podatkov
- Neodvisen od vztrajnih mehanizmov

### Kdaj uporabljati DTO

**Uporabite DTO, kadar:**
- Prenos podatkov med plastmi
- Izpostavljanje podatkov prek API-jev
- Združevanje podatkov iz več subjektov
- Skrivanje notranjih podrobnosti izvedbe
- Spreminjanje strukture podatkov za različne porabnike

## Osnovna DTO Implementacija
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
## Uporaba v storitvah
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
## Uporaba v API krmilnikih
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
## Najboljše prakse

- Naj bodo DTO osredotočeni in specifični
- Naredi DTO nespremenljive ali samo za branje
- Ne vključujte poslovne logike v DTO
- Uporabite ločene DTO za vhod in izhod
- Lastnosti DTO jasno dokumentirajte
- Naj bodo DTO preprosti - samo vsebniki podatkov

## Povezana dokumentacija

Glej tudi:
- [Service-Layer](../Patterns/Service-Layer.md) za integracijo storitve
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za dostop do podatkov
- [MVC-Vzorec](../Patterns/MVC-Pattern.md) za uporabo krmilnika
- [Testiranje](../Best-Practices/Testing.md) za DTO testiranje

---

Oznake: #dto #predmeti-prenosa-podatkov #vzorci-načrtovanja #razvoj-modula