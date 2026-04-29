---
title: "Pola DTO di XOOPS"
description: "Objek Transfer Data untuk penanganan data yang bersih"
---

# Pola DTO (Objek Transfer Data) di XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Berfungsi di Kedua Versi]
DTO adalah objek PHP biasa tanpa ketergantungan kerangka kerja. Mereka bekerja secara identik di XOOPS 2.5.x dan XOOPS 4.0.x. Untuk PHP 8.2+, gunakan promosi properti konstruktor dan kelas hanya baca untuk sintaksis yang lebih bersih.
:::

Objek Transfer Data (DTO) adalah objek sederhana yang digunakan untuk mentransfer data antar lapisan aplikasi yang berbeda. DTO membantu menjaga batasan yang jelas antar lapisan dan mengurangi ketergantungan pada objek entitas.

## Konsep DTO

### Apa itu DTO?
DTO adalah:
- Objek nilai sederhana dengan properti
- Tidak dapat diubah atau hanya dapat dibaca setelah pembuatan
- Tidak ada logika atau metode bisnis
- Dioptimalkan untuk transfer data
- Independen dari mekanisme persistensi

### Kapan Menggunakan DTO

**Gunakan DTO ketika:**
- Mentransfer data antar lapisan
- Mengekspos data melalui API
- Mengumpulkan data dari beberapa entitas
- Menyembunyikan detail implementasi internal
- Mengubah struktur data untuk konsumen yang berbeda

## Implementasi Dasar DTO

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

## Penggunaan dalam Layanan

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

## Penggunaan di Pengontrol API

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

## Praktik Terbaik

- Jaga agar DTO tetap fokus dan spesifik
- Jadikan DTO tidak dapat diubah atau hanya dapat dibaca
- Jangan sertakan logika bisnis dalam DTO
- Gunakan DTO terpisah untuk input dan output
- Dokumentasikan properti DTO dengan jelas
- Buat DTO tetap sederhana - hanya wadah data

## Dokumentasi Terkait

Lihat juga:
- [Layer-Layer](../Patterns/Service-Layer.md) untuk integrasi layanan
- [Pola-Repositori](../Patterns/Repository-Pattern.md) untuk akses data
- [MVC-Pattern](../Patterns/MVC-Pattern.md) untuk penggunaan pengontrol
- [Pengujian](../Best-Practices/Testing.md) untuk pengujian DTO

---

Tag: #dto #objek-transfer-data #pola-desain #pengembangan-module
