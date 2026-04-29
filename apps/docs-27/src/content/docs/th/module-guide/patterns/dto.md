---
title: "DTO รูปแบบใน XOOPS"
description: "Data Transfer Objects สำหรับการจัดการข้อมูลที่สะอาด"
---
# DTO รูปแบบ (วัตถุการถ่ายโอนข้อมูล) ใน XOOPS

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[ใช้งานได้ทั้งสองเวอร์ชัน]
DTO เป็นอ็อบเจ็กต์ PHP ธรรมดาที่ไม่มีการพึ่งพาเฟรมเวิร์ก ทำงานเหมือนกันใน XOOPS 2.5.x และ XOOPS 4.0.x สำหรับ PHP 8.2+ ให้ใช้การเลื่อนระดับคุณสมบัติตัวสร้างและคลาสแบบอ่านอย่างเดียวสำหรับไวยากรณ์ที่สะอาดยิ่งขึ้น
::::::

Data Transfer Objects (DTO) เป็นออบเจ็กต์ธรรมดาที่ใช้ในการถ่ายโอนข้อมูลระหว่างเลเยอร์ต่างๆ ของแอปพลิเคชัน DTO ช่วยรักษาขอบเขตที่ชัดเจนระหว่างเลเยอร์และลดการพึ่งพาออบเจ็กต์เอนทิตี

## DTO แนวคิด

### DTO คืออะไร
DTO คือ:
- วัตถุค่าอย่างง่ายที่มีคุณสมบัติ
- ไม่เปลี่ยนรูปหรืออ่านอย่างเดียวหลังจากการสร้าง
- ไม่มีตรรกะหรือวิธีการทางธุรกิจ
- ปรับให้เหมาะสมสำหรับการถ่ายโอนข้อมูล
- เป็นอิสระจากกลไกการคงอยู่

### เมื่อใดจึงควรใช้ DTO

**ใช้ DTO เมื่อ:**
- การถ่ายโอนข้อมูลระหว่างชั้น
- การเปิดเผยข้อมูลผ่าน API
- การรวมข้อมูลจากหลายหน่วยงาน
- ซ่อนรายละเอียดการดำเนินการภายใน
- การเปลี่ยนแปลงโครงสร้างข้อมูลสำหรับผู้บริโภคที่แตกต่างกัน

## การใช้งาน DTO ขั้นพื้นฐาน
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
## คำขอ/อินพุต DTO
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
## การใช้งานในบริการ
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
## การใช้งานใน API Controllers
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
## แนวทางปฏิบัติที่ดีที่สุด

- ให้ DTO มุ่งเน้นและเฉพาะเจาะจง
- ทำให้ DTO ไม่เปลี่ยนรูปหรืออ่านอย่างเดียว
- อย่ารวมตรรกะทางธุรกิจไว้ใน DTO
- ใช้ DTO แยกกันสำหรับอินพุตและเอาต์พุต
- เอกสารคุณสมบัติ DTO อย่างชัดเจน
- ทำให้ DTO เรียบง่าย - เพียงแค่คอนเทนเนอร์ข้อมูล

## เอกสารที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- [ชั้นบริการ](../Patterns/Service-Layer.md) สำหรับการบูรณาการบริการ
- [รูปแบบพื้นที่เก็บข้อมูล](../Patterns/Repository-Pattern.md) สำหรับการเข้าถึงข้อมูล
- [MVC-Pattern](../Patterns/MVC-Pattern.md) สำหรับการใช้งานคอนโทรลเลอร์
- [การทดสอบ](../Best-Practices/Testing.md) สำหรับการทดสอบ DTO

---

Tags: #dto #การถ่ายโอนข้อมูลวัตถุ #รูปแบบการออกแบบ #การพัฒนาโมดูล