---
title: "รูปแบบพื้นที่เก็บข้อมูลใน XOOPS"
description: "การใช้เลเยอร์นามธรรมในการเข้าถึงข้อมูล"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[ไม่แน่ใจว่านี่เป็นรูปแบบที่ถูกต้องหรือไม่]
ดู [การเลือกรูปแบบการเข้าถึงข้อมูล](../Choosing-Data-Access-Pattern.md) สำหรับแผนผังการตัดสินใจที่เปรียบเทียบตัวจัดการ พื้นที่เก็บข้อมูล บริการ และ CQRS
::::::

:::tip[ทำงานวันนี้และพรุ่งนี้]
รูปแบบพื้นที่เก็บข้อมูล **ใช้งานได้ทั้ง XOOPS 2.5.x และ XOOPS 4.0.x** ใน 2.5.x ให้รวม `XoopsPersistableObjectHandler` ที่มีอยู่ของคุณไว้ในคลาส Repository เพื่อรับประโยชน์จากนามธรรม:

| วิธีการ | XOOPS 2.5.x | XOOPS 4.0 |
|----------|-------------|------------|
| การเข้าถึงตัวจัดการโดยตรง | `xoops_getModuleHandler()` | ผ่าน DI คอนเทนเนอร์ |
| wrapper ที่เก็บข้อมูล | ✅ แนะนำ | ✅ลายพื้นเมือง |
| ทดสอบด้วยโปรแกรมจำลอง | ✅ พร้อมคู่มือ DI | ✅ การเดินสายอัตโนมัติของคอนเทนเนอร์ |

**เริ่มต้นด้วยรูปแบบพื้นที่เก็บข้อมูลวันนี้** เพื่อเตรียมโมดูลของคุณสำหรับการย้ายข้อมูล XOOPS 4.0
::::::

รูปแบบพื้นที่เก็บข้อมูลคือรูปแบบการเข้าถึงข้อมูลที่สรุปการดำเนินการของฐานข้อมูล โดยมีอินเทอร์เฟซที่สะอาดตาสำหรับการเข้าถึงข้อมูล โดยทำหน้าที่เป็นตัวกลางระหว่างตรรกะทางธุรกิจและเลเยอร์การแมปข้อมูล

## แนวคิดพื้นที่เก็บข้อมูล

รูปแบบพื้นที่เก็บข้อมูลให้:
- นามธรรมของรายละเอียดการดำเนินการฐานข้อมูล
- การเยาะเย้ยง่าย ๆ สำหรับการทดสอบหน่วย
- ตรรกะการเข้าถึงข้อมูลแบบรวมศูนย์
- ความยืดหยุ่นในการเปลี่ยนแปลงฐานข้อมูลโดยไม่กระทบต่อตรรกะทางธุรกิจ
- ตรรกะการเข้าถึงข้อมูลที่นำมาใช้ซ้ำได้ทั่วทั้งแอปพลิเคชัน

## เมื่อใดควรใช้พื้นที่เก็บข้อมูล

**ใช้พื้นที่เก็บข้อมูลเมื่อ:**
- การถ่ายโอนข้อมูลระหว่างชั้นแอปพลิเคชัน
- จำเป็นต้องเปลี่ยนแปลงการใช้งานฐานข้อมูล
- การเขียนโค้ดที่สามารถทดสอบได้ด้วยการเยาะเย้ย
- สรุปรูปแบบการเข้าถึงข้อมูล

## รูปแบบการดำเนินการ
```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```
## การใช้งานในบริการ
```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```
## แนวทางปฏิบัติที่ดีที่สุด

- ใช้อินเทอร์เฟซเพื่อกำหนดสัญญาพื้นที่เก็บข้อมูล
- แต่ละพื้นที่เก็บข้อมูลจะจัดการประเภทเอนทิตีหนึ่งประเภท
- เก็บตรรกะทางธุรกิจไว้ในบริการ ไม่ใช่ที่เก็บข้อมูล
- ใช้วัตถุเอนทิตีสำหรับการแมปข้อมูล
- โยนข้อยกเว้นที่เหมาะสมสำหรับการดำเนินการที่ไม่ถูกต้อง

## เอกสารที่เกี่ยวข้อง

ดูเพิ่มเติมที่:
- [MVC-Pattern](../Patterns/MVC-Pattern.md) สำหรับการบูรณาการคอนโทรลเลอร์
- [Service-Layer](../Patterns/Service-Layer.md) สำหรับการใช้บริการ
- [DTO-Pattern](DTO-Pattern.md) สำหรับออบเจ็กต์การถ่ายโอนข้อมูล
- [การทดสอบ](../Best-Practices/Testing.md) สำหรับการทดสอบพื้นที่เก็บข้อมูล

---

Tags: #รูปแบบพื้นที่เก็บข้อมูล #การเข้าถึงข้อมูล #รูปแบบการออกแบบ #การพัฒนาโมดูล