---
title: "DTO XOOPS'deki desen"
description: "Temiz veri işleme için Veri Aktarım Nesneleri"
---
# DTO XOOPS'deki Desen (Veri Aktarım Nesneleri)

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::ipucu[Her İki Versiyonda da Çalışır]
DTOs, çerçeve bağımlılığı olmayan düz PHP nesneleridir. XOOPS 2.5.x ve XOOPS 4.0.x'te aynı şekilde çalışırlar. PHP 8.2+ için, daha temiz bir sözdizimi için yapıcı özellik tanıtımını ve salt okunur sınıfları kullanın.
:::

Veri Aktarım Nesneleri (DTOs), bir uygulamanın farklı katmanları arasında veri aktarmak için kullanılan basit nesnelerdir. DTOs katmanlar arasında net sınırların korunmasına ve varlık nesnelerine olan bağımlılığın azaltılmasına yardımcı olur.

## DTO Konsept

### DTO nedir?
Bir DTO şudur:
- Özellikleri olan basit bir değer nesnesi
- Oluşturulduktan sonra değiştirilemez veya salt okunur
- İş mantığı veya yöntemi yok
- Veri aktarımı için optimize edildi
- Kalıcılık mekanizmalarından bağımsız

### Ne Zaman Kullanılmalı DTOs

**Şu durumlarda DTOs kullanın:**
- Katmanlar arasında veri aktarımı
- APIs aracılığıyla verileri açığa çıkarma
- Birden fazla varlıktan veri toplama
- Dahili uygulama ayrıntılarını gizleme
- Farklı tüketiciler için veri yapısının değiştirilmesi

## Temel DTO Uygulama
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
## Hizmetlerde Kullanım
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
## API Kontrol Cihazlarında Kullanım
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
## En İyi Uygulamalar

- DTOs'i odaklanmış ve spesifik tutun
- DTOs'yi değişmez veya salt okunur yapın
- DTOs'ye iş mantığını dahil etmeyin
- Giriş ve çıkış için ayrı DTOs kullanın
- DTO özelliklerini açıkça belgeleyin
- DTOs'yi basit tutun - yalnızca veri kapları

## İlgili Belgeler

Ayrıca bakınız:
- Hizmet entegrasyonu için [Hizmet Katmanı](../Patterns/Service-Layer.md)
- Veri erişimi için [Depo Deseni](../Patterns/Repository-Pattern.md)
- [MVC-Pattern](../Patterns/MVC-Pattern.md) denetleyici kullanımı için
- DTO testi için [Test ediliyor](../Best-Practices/Testing.md)

---

Etiketler: #dto #veri-aktarımı-nesneleri #tasarım-desenleri #module-geliştirme