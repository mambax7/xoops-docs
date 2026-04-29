---
title: "DTO Corak dalam XOOPS"
description: "Objek Pemindahan Data untuk pengendalian data yang bersih"
---
# DTO Corak (Objek Pemindahan Data) dalam XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Berfungsi dalam Kedua-dua Versi]
DTO ialah objek PHP biasa tanpa kebergantungan rangka kerja. Mereka bekerja secara sama dalam XOOPS 2.5.x dan XOOPS 4.0.x. Untuk PHP 8.2+, gunakan promosi sifat pembina dan kelas baca sahaja untuk sintaks yang lebih bersih.
:::

Objek Pemindahan Data (DTO) ialah objek mudah yang digunakan untuk memindahkan data antara lapisan aplikasi yang berbeza. DTO membantu mengekalkan sempadan yang jelas antara lapisan dan mengurangkan kebergantungan pada objek entiti.

## DTO Konsep

### Apakah itu DTO?
A DTO ialah:
- Objek nilai mudah dengan sifat
- Tidak boleh ubah atau baca sahaja selepas penciptaan
- Tiada logik atau kaedah perniagaan
- Dioptimumkan untuk pemindahan data
- Bebas daripada mekanisme kegigihan

### Bila Menggunakan DTO

**Gunakan DTO apabila:**
- Memindahkan data antara lapisan
- Mendedahkan data melalui API
- Mengagregatkan data daripada berbilang entiti
- Menyembunyikan butiran pelaksanaan dalaman
- Mengubah struktur data untuk pengguna yang berbeza

## Asas DTO Pelaksanaan
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
## Penggunaan dalam Perkhidmatan
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
## Penggunaan dalam API Pengawal
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
## Amalan Terbaik

- Pastikan DTO fokus dan khusus
- Jadikan DTO tidak boleh diubah atau baca sahaja
- Jangan masukkan logik perniagaan dalam DTO
- Gunakan DTO yang berasingan untuk input dan output
- Dokumen DTO sifat dengan jelas
- Pastikan DTO mudah - hanya bekas data

## Dokumentasi Berkaitan

Lihat juga:
- [Lapisan Perkhidmatan](../Patterns/Service-Layer.md) untuk penyepaduan perkhidmatan
- [Repositori-Corak](../Patterns/Repository-Pattern.md) untuk akses data
- [MVC-Corak](../Patterns/MVC-Pattern.md) untuk kegunaan pengawal
- [Ujian](../Best-Practices/Testing.md) untuk ujian DTO

---

Tag: #dto #pemindahan-data-objek #reka-corak #pembangunan-modul