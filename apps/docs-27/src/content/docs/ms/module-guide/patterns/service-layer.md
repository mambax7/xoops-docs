---
title: "Corak Lapisan Perkhidmatan dalam XOOPS"
description: "Abstraksi logik perniagaan dan suntikan pergantungan"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::nota[Tidak pasti sama ada ini corak yang betul?]
Lihat [Memilih Corak Akses Data](../Choosing-Data-Access-Pattern.md) untuk mendapatkan pepohon keputusan yang membandingkan pengendali, repositori, perkhidmatan dan CQRS.
:::

:::tip[Bekerja Hari Ini & Esok]
Corak Lapisan Perkhidmatan **berfungsi dalam kedua-dua XOOPS 2.5.x dan XOOPS 4.0.x**. Konsepnya adalah universal—hanya sintaks yang berbeza:

| Ciri | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP Versi | 7.4+ | 8.2+ |
| Suntikan Pembina | ✅ Pendawaian manual | ✅ Pendawaian automatik kontena |
| Ciri Ditaip | `@var` docblocks | Pengisytiharan jenis asli |
| Harta Baca Sahaja | ❌ Tidak tersedia | ✅ `readonly` kata kunci |

Contoh kod di bawah menggunakan sintaks PHP 8.2+. Untuk 2.5.x, tinggalkan `readonly` dan gunakan pengisytiharan harta tradisional.
:::

Corak Lapisan Perkhidmatan merangkumi logik perniagaan dalam kelas perkhidmatan khusus, memberikan pemisahan yang jelas antara pengawal dan lapisan akses data. Corak ini menggalakkan kebolehgunaan semula kod, kebolehujian dan kebolehselenggaraan.

## Konsep Lapisan Perkhidmatan

### Tujuan
Lapisan Perkhidmatan:
- Mengandungi logik perniagaan domain
- Menyelaras berbilang repositori
- Mengendalikan operasi yang kompleks
- Menguruskan urus niaga
- Melakukan pengesahan dan kebenaran
- Menyediakan operasi peringkat tinggi kepada pengawal### Faedah
- Logik perniagaan boleh guna semula merentas berbilang pengawal
- Mudah diuji secara berasingan
- Pelaksanaan peraturan perniagaan berpusat
- Pemisahan kebimbangan yang jelas
- Kod pengawal ringkas

## Suntikan Ketergantungan
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
## Bekas Perkhidmatan
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
## Penggunaan dalam Pengawal
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
## Amalan Terbaik

- Setiap perkhidmatan mengendalikan satu kebimbangan domain
- Perkhidmatan bergantung pada antara muka, bukan pelaksanaan
- Gunakan suntikan pembina untuk kebergantungan
- Perkhidmatan hendaklah boleh diuji secara berasingan
- Buang pengecualian khusus domain
- Perkhidmatan tidak boleh bergantung pada butiran permintaan HTTP
- Pastikan perkhidmatan fokus dan padu

## Dokumentasi Berkaitan

Lihat juga:
- [MVC-Corak](../Patterns/MVC-Pattern.md) untuk penyepaduan pengawal
- [Repositori-Corak](../Patterns/Repository-Pattern.md) untuk akses data
- [DTO-Corak](DTO-Pattern.md) untuk objek pemindahan data
- [Ujian](../Best-Practices/Testing.md) untuk ujian perkhidmatan

---

Tag: #lapisan perkhidmatan #logik-perniagaan #suntikan-pergantungan #corak-reka bentuk