---
title: "Pola Lapisan Layanan di XOOPS"
description: "Abstraksi logika bisnis dan injeksi ketergantungan"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Tidak yakin apakah ini pola yang benar?]
Lihat [Memilih Pola Akses Data](../Choosing-Data-Access-Pattern.md) untuk pohon keputusan yang membandingkan handler, repositori, layanan, dan CQRS.
:::

:::tip[Bekerja Hari Ini & Besok]
Pola Lapisan Layanan **berfungsi di XOOPS 2.5.x dan XOOPS 4.0.x**. Konsepnya bersifat universal—hanya sintaksisnya yang berbeda:

| Fitur | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| Versi PHP | 7.4+ | 8.2+ |
| Injeksi Konstruktor | ✅ Pengkabelan manual | ✅ Pengkabelan otomatis kontainer |
| Properti yang Diketik | block dokumen `@var` | Deklarasi tipe asli |
| Properti Hanya Baca | ❌ Tidak tersedia | ✅ Kata kunci `readonly` |

Contoh kode di bawah ini menggunakan sintaks PHP 8.2+. Untuk 2.5.x, hilangkan `readonly` dan gunakan deklarasi properti tradisional.
:::

Pola Lapisan Layanan merangkum logika bisnis dalam kelas layanan khusus, memberikan pemisahan yang jelas antara pengontrol dan lapisan akses data. Pola ini mendorong penggunaan kembali kode, kemampuan pengujian, dan pemeliharaan.

## Konsep Lapisan Layanan

### Tujuan
Lapisan Layanan:
- Berisi logika bisnis domain
- Mengkoordinasikan beberapa repositori
- Menangani operasi yang rumit
- Mengelola transaksi
- Melakukan validasi dan otorisasi
- Menyediakan operasi tingkat tinggi untuk pengontrol

### Manfaat
- Logika bisnis yang dapat digunakan kembali di beberapa pengontrol
- Mudah diuji secara terpisah
- Penerapan aturan bisnis terpusat
- Pemisahan kekhawatiran yang jelas
- Kode pengontrol yang disederhanakan

## Injeksi Ketergantungan

```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```

## Kontainer Layanan

```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```

## Penggunaan di Pengontrol

```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```

## Praktik Terbaik

- Setiap layanan menangani satu masalah domain
- Layanan bergantung pada antarmuka, bukan implementasi
- Gunakan injeksi konstruktor untuk dependensi
- Layanan harus dapat diuji secara terpisah
- Lemparkan pengecualian khusus domain
- Layanan tidak boleh bergantung pada detail permintaan HTTP
- Jaga agar layanan tetap fokus dan kohesif

## Dokumentasi Terkait

Lihat juga:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) untuk integrasi pengontrol
- [Pola-Repositori](../Patterns/Repository-Pattern.md) untuk akses data
- [DTO-Pattern](DTO-Pattern.md) untuk objek transfer data
- [Pengujian](../Best-Practices/Testing.md) untuk pengujian layanan

---

Tag: #lapisan layanan #logika-bisnis #injeksi-ketergantungan #pola-desain
