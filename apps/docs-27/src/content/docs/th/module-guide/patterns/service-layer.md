---
title: "รูปแบบเลเยอร์บริการใน XOOPS"
description: "นามธรรมเชิงตรรกะทางธุรกิจและการฉีดการพึ่งพา"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[ไม่แน่ใจว่านี่เป็นรูปแบบที่ถูกต้องหรือไม่]
ดู [การเลือกรูปแบบการเข้าถึงข้อมูล](../Choosing-Data-Access-Pattern.md) สำหรับแผนผังการตัดสินใจที่เปรียบเทียบตัวจัดการ พื้นที่เก็บข้อมูล บริการ และ CQRS
::::::

:::tip[ทำงานวันนี้และพรุ่งนี้]
รูปแบบเลเยอร์บริการ **ใช้งานได้ทั้ง XOOPS 2.5.x และ XOOPS 4.0.x** แนวคิดนี้เป็นสากล—มีเพียงไวยากรณ์เท่านั้นที่แตกต่างกัน:

| คุณสมบัติ | XOOPS 2.5.x | XOOPS 4.0 |
|---------|-------------|------------|
| PHP เวอร์ชัน | 7.4+ | 8.2+ |
| การฉีดคอนสตรัคเตอร์ | ✅ เดินสายแบบแมนนวล | ✅ การเดินสายอัตโนมัติของคอนเทนเนอร์ |
| คุณสมบัติที่พิมพ์ | `@var` docblocks | การประกาศประเภทเนทิฟ |
| คุณสมบัติแบบอ่านอย่างเดียว | ❌ ไม่มี | ✅ `readonly` คำหลัก |

ตัวอย่างโค้ดด้านล่างใช้ไวยากรณ์ PHP 8.2+ สำหรับ 2.5.x ให้ละเว้น `readonly` และใช้การประกาศทรัพย์สินแบบดั้งเดิม
::::::

รูปแบบชั้นบริการสรุปตรรกะทางธุรกิจไว้ในคลาสบริการเฉพาะ โดยให้การแยกที่ชัดเจนระหว่างตัวควบคุมและชั้นการเข้าถึงข้อมูล รูปแบบนี้ส่งเสริมการนำโค้ดกลับมาใช้ใหม่ ความสามารถในการทดสอบ และการบำรุงรักษา

## แนวคิดชั้นบริการ

### วัตถุประสงค์
ชั้นบริการ:
- มีตรรกะทางธุรกิจโดเมน
- ประสานที่เก็บข้อมูลหลายแห่ง
- จัดการกับการดำเนินงานที่ซับซ้อน
- จัดการธุรกรรม
- ดำเนินการตรวจสอบและการอนุญาต
- ให้การดำเนินการระดับสูงแก่ผู้ควบคุม

### ผลประโยชน์
- ตรรกะทางธุรกิจที่สามารถนำกลับมาใช้ใหม่ได้ในคอนโทรลเลอร์หลายตัว
- ง่ายต่อการทดสอบแบบแยกส่วน
- การใช้กฎเกณฑ์ทางธุรกิจแบบรวมศูนย์
- แยกประเด็นข้อกังวลให้ชัดเจน
- รหัสคอนโทรลเลอร์แบบง่าย

## การฉีดพึ่งพา
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
## ตู้บริการ
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
## การใช้งานในคอนโทรลเลอร์
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
## แนวทางปฏิบัติที่ดีที่สุด

- แต่ละบริการจัดการข้อกังวลด้านโดเมนเดียว
- บริการขึ้นอยู่กับอินเทอร์เฟซ ไม่ใช่การใช้งาน
- ใช้การฉีดคอนสตรัคเตอร์สำหรับการขึ้นต่อกัน
- บริการควรทดสอบแยกกันได้
- โยนข้อยกเว้นเฉพาะโดเมน
- บริการไม่ควรขึ้นอยู่กับรายละเอียดคำขอ HTTP
- รักษาบริการที่มุ่งเน้นและเหนียวแน่น

## เอกสารที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) สำหรับการบูรณาการคอนโทรลเลอร์
- [รูปแบบพื้นที่เก็บข้อมูล](../Patterns/Repository-Pattern.md) สำหรับการเข้าถึงข้อมูล
- [DTO-Pattern](DTO-Pattern.md) สำหรับออบเจ็กต์การถ่ายโอนข้อมูล
- [การทดสอบ](../Best-Practices/Testing.md) สำหรับการทดสอบบริการ

---

Tags: #ชั้นบริการ #ตรรกะทางธุรกิจ #การฉีดพึ่งพา #รูปแบบการออกแบบ