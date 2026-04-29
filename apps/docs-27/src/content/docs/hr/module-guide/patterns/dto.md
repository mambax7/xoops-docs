---
title: "DTO uzorak u XOOPS"
description: "Objekti prijenosa podataka za čisto rukovanje podacima"
---
# DTO Uzorak (objekti prijenosa podataka) u XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Radi u obje verzije]
DTO-ovi su obični objekti PHP bez ovisnosti o okviru. Identično rade u XOOPS 2.5.x i XOOPS 4.0.x. Za PHP 8.2+ koristite promociju svojstava konstruktora i classes samo za čitanje za čistiju sintaksu.
:::

Objekti prijenosa podataka (DTO) jednostavni su objekti koji se koriste za prijenos podataka između različitih slojeva aplikacije. DTO-ovi pomažu u održavanju jasnih granica između slojeva i smanjuju ovisnosti o objektima entiteta.

## DTO Koncept

### Što je DTO?
DTO je:
- Jednostavan objekt vrijednosti sa svojstvima
- Nepromjenjivo ili samo za čitanje nakon stvaranja
- Bez poslovne logike i metoda
- Optimizirano za prijenos podataka
- Neovisno o mehanizmima postojanosti

### Kada koristiti DTO

**Koristite DTO kada:**
- Prijenos podataka između slojeva
- Izlaganje podataka putem API-ja
- Agregiranje podataka iz više entiteta
- Skrivanje internih detalja implementacije
- Promjena strukture podataka za različite potrošače

## Osnovna implementacija DTO

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

## Zahtjev/unos DTO

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

## Upotreba u uslugama

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

## Upotreba u API kontrolerima

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

## Najbolji primjeri iz prakse

- Držite DTO-ove usredotočene i specifične
- Neka DTO-ovi budu nepromjenjivi ili samo za čitanje
- Nemojte include poslovnu logiku u DTO-ovima
- Koristite zasebne DTO-ove za ulaz i izlaz
- Jasno dokumentirajte svojstva DTO
- Neka DTO-ovi budu jednostavni - samo spremnici podataka

## Povezana dokumentacija

Vidi također:
- [Service-Layer](../Patterns/Service-Layer.md) za integraciju usluge
- [Repository-Pattern](../Patterns/Repository-Pattern.md) za pristup podacima
- [MVC-uzorak](../Patterns/MVC-Pattern.md) za upotrebu kontrolera
- [Testiranje](../Best-Practices/Testing.md) za testiranje DTO

---

Oznake: #dto #objekti-prijenosa-podataka #uzorci-dizajna #razvoj-modula
