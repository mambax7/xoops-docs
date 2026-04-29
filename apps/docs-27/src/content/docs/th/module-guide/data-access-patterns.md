---
title: "การเลือกรูปแบบการเข้าถึงข้อมูล"
description: "แผนผังการตัดสินใจในการเลือกรูปแบบการเข้าถึงข้อมูลที่เหมาะสมสำหรับโมดูล XOOPS ของคุณ"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

> **ฉันควรใช้รูปแบบใด** โครงสร้างการตัดสินใจนี้ช่วยให้คุณเลือกระหว่างตัวจัดการโดยตรง รูปแบบพื้นที่เก็บข้อมูล ชั้นบริการ และ CQRS

---

## ต้นไม้การตัดสินใจด่วน
```
mermaid
flowchart TD
    START([Start Here]) --> Q1{How complex is<br/>your module?}

    Q1 -->|Simple CRUD<br/>1-3 entities| Q2{Need testing<br/>or mocking?}
    Q1 -->|Moderate<br/>4-10 entities| Q3{Multiple data<br/>sources?}
    Q1 -->|Complex<br/>10+ entities| Q4{High traffic or<br/>read/write asymmetry?}

    Q2 -->|No| HANDLER[✅ Direct Handler]
    Q2 -->|Yes| REPO[✅ Repository Pattern]

    Q3 -->|No, just DB| REPO
    Q3 -->|Yes, APIs/cache| SERVICE[✅ Service Layer]

    Q4 -->|No| SERVICE
    Q4 -->|Yes, need<br/>separate scaling| CQRS[✅ CQRS Pattern]

    HANDLER --> DONE([Choose Pattern])
    REPO --> DONE
    SERVICE --> DONE
    CQRS --> DONE

    style HANDLER fill:#c8e6c9,stroke:#2e7d32
    style REPO fill:#bbdefb,stroke:#1565c0
    style SERVICE fill:#fff9c4,stroke:#f9a825
    style CQRS fill:#ffcdd2,stroke:#c62828
```
---

## การเปรียบเทียบรูปแบบ

| เกณฑ์ | ตัวจัดการโดยตรง | พื้นที่เก็บข้อมูล | ชั้นบริการ | CQRS |
|----------|---------------|------------|---------------|------|
| **ความซับซ้อน** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **การทดสอบ** | ❌ ฮาร์ด | ✅ดี | ✅ เยี่ยมมาก | ✅ เยี่ยมมาก |
| **ความยืดหยุ่น** | ❌ต่ำ | ✅ ปานกลาง | ✅ สูง | ✅สูงมาก |
| **XOOPS 2.5.x** | ✅ พื้นเมือง | ✅ใช้งานได้ | ✅ใช้งานได้ | ⚠️ ซับซ้อน |
| **XOOPS 4.0** | ⚠️ เลิกใช้งานแล้ว | ✅ แนะนำ | ✅ แนะนำ | ✅ สำหรับขนาด |
| **ขนาดทีม** | 1 เดฟ | 1-3 ผู้พัฒนา | 2-5 ผู้พัฒนา | 5+ ผู้พัฒนา |
| **การบำรุงรักษา** | ❌สูงกว่า | ✅ปานกลาง | ✅ ล่าง | ⚠️ต้องอาศัยความชำนาญ |

---

## เมื่อใดควรใช้แต่ละรูปแบบ

### ✅ ตัวจัดการโดยตรง (`XoopsPersistableObjectHandler`)

**ดีที่สุดสำหรับ:** โมดูลที่เรียบง่าย การสร้างต้นแบบอย่างรวดเร็ว การเรียนรู้ XOOPS
```php
// Simple and direct - good for small modules
$handler = xoops_getModuleHandler('article', 'news');
$articles = $handler->getObjects(new Criteria('status', 1));
```
**เลือกสิ่งนี้เมื่อ:**
- การสร้างโมดูลอย่างง่ายด้วยตารางฐานข้อมูล 1-3 ตาราง
- การสร้างต้นแบบอย่างรวดเร็ว
- คุณเป็นนักพัฒนาซอฟต์แวร์เพียงคนเดียวและไม่จำเป็นต้องทดสอบ
- โมดูลจะไม่เติบโตมากนัก

**ข้อจำกัด:**
- การทดสอบหน่วยยาก (การพึ่งพาทั่วโลก)
- การมีเพศสัมพันธ์อย่างแน่นหนากับเลเยอร์ฐานข้อมูล XOOPS
- ตรรกะทางธุรกิจมีแนวโน้มที่จะรั่วไหลเข้าสู่ตัวควบคุม

---

### ✅ รูปแบบพื้นที่เก็บข้อมูล

**ดีที่สุดสำหรับ:** โมดูลส่วนใหญ่ ทีมที่ต้องการความสามารถในการทดสอบ
```php
// Abstraction allows mocking for tests
interface ArticleRepositoryInterface {
    public function findPublished(): array;
    public function save(Article $article): void;
}

class XoopsArticleRepository implements ArticleRepositoryInterface {
    private $handler;

    public function __construct() {
        $this->handler = xoops_getModuleHandler('article', 'news');
    }

    public function findPublished(): array {
        return $this->handler->getObjects(new Criteria('status', 1));
    }
}
```
**เลือกสิ่งนี้เมื่อ:**
- คุณต้องการเขียนการทดสอบหน่วย
- คุณอาจเปลี่ยนแหล่งข้อมูลในภายหลัง (¤DB → API)
- ทำงานร่วมกับนักพัฒนา 2+ คน
- การสร้างโมดูลสำหรับการจัดจำหน่าย

**เส้นทางการอัปเกรด:** นี่คือรูปแบบที่แนะนำสำหรับการเตรียม XOOPS 4.0

---

### ✅ ชั้นบริการ

**ดีที่สุดสำหรับ:** โมดูลที่มีตรรกะทางธุรกิจที่ซับซ้อน
```php
// Service coordinates multiple repositories and contains business rules
class ArticlePublicationService {
    public function __construct(
        private ArticleRepositoryInterface $articles,
        private NotificationServiceInterface $notifications,
        private CacheInterface $cache
    ) {}

    public function publish(int $articleId): void {
        $article = $this->articles->find($articleId);
        $article->setStatus('published');
        $article->setPublishedAt(new DateTime());

        $this->articles->save($article);
        $this->notifications->notifySubscribers($article);
        $this->cache->invalidate("article:{$articleId}");
    }
}
```
**เลือกสิ่งนี้เมื่อ:**
- การดำเนินงานครอบคลุมแหล่งข้อมูลหลายแหล่ง
- กฎเกณฑ์ทางธุรกิจมีความซับซ้อน
- คุณต้องมีการจัดการธุรกรรม
- หลายส่วนของแอปทำสิ่งเดียวกัน

**เส้นทางอัปเกรด:** รวมกับพื้นที่เก็บข้อมูลเพื่อให้ได้สถาปัตยกรรมที่แข็งแกร่ง

---

### ⚠️ CQRS (การแยกความรับผิดชอบแบบสอบถามคำสั่ง)

**ดีที่สุดสำหรับ:** โมดูลระดับสูงที่มีความไม่สมดุลในการอ่าน/เขียน
```php
// Commands modify state
class PublishArticleCommand {
    public function __construct(
        public readonly int $articleId,
        public readonly int $publisherId
    ) {}
}

// Queries read state (can use denormalized read models)
class GetPublishedArticlesQuery {
    public function __construct(
        public readonly int $limit = 10
    ) {}
}
```
**เลือกสิ่งนี้เมื่อ:**
- อ่านจำนวนมากกว่าการเขียนอย่างมากมาย (100:1 หรือมากกว่า)
- คุณต้องมีสเกลที่แตกต่างกันสำหรับการอ่านและการเขียน
- ข้อกำหนดการรายงาน/การวิเคราะห์ที่ซับซ้อน
- การจัดหากิจกรรมจะเป็นประโยชน์ต่อโดเมนของคุณ

**คำเตือน:** CQRS เพิ่มความซับซ้อนอย่างมาก โมดูล XOOPS ส่วนใหญ่ไม่ต้องการมัน

---

## เส้นทางการอัพเกรดที่แนะนำ
```
mermaid
flowchart LR
    H0["Direct Handler<br/>(XOOPS 2.5.x today)"]
    R["Repository Pattern<br/>(Recommended next step)"]
    S["+ Service Layer<br/>(When complexity grows)"]
    C["+ CQRS<br/>(Only if scaling requires)"]

    H0 -->|"Step 1"| R
    R -->|"Step 2"| S
    S -->|"Step 3<br/>(rare)"| C

    style H0 fill:#ffcdd2
    style R fill:#c8e6c9
    style S fill:#bbdefb
    style C fill:#fff9c4
```
### ขั้นตอนที่ 1: Wrap Handlers ใน Repositories (2-4 ชั่วโมง)

1. สร้างอินเทอร์เฟซสำหรับความต้องการในการเข้าถึงข้อมูลของคุณ
2. ใช้งานโดยใช้ตัวจัดการที่มีอยู่
3. ฉีดพื้นที่เก็บข้อมูลแทนการเรียก `xoops_getModuleHandler()` โดยตรง

### ขั้นตอนที่ 2: เพิ่มชั้นบริการเมื่อจำเป็น (1-2 วัน)

1. เมื่อตรรกะทางธุรกิจปรากฏในตัวควบคุม ให้แยกไปยังบริการ
2. บริการใช้พื้นที่เก็บข้อมูล ไม่ใช่ตัวจัดการโดยตรง
3. คอนโทรลเลอร์บางลง (เส้นทาง → บริการ → การตอบสนอง)

### ขั้นตอนที่ 3: พิจารณา CQRS เฉพาะในกรณีที่ (หายาก)

1. คุณมีคนอ่านหลายล้านครั้งต่อวัน
2. โมเดลการอ่านและเขียนมีความแตกต่างกันอย่างมาก
3. คุณต้องมีการจัดหาเหตุการณ์สำหรับเส้นทางการตรวจสอบ
4. คุณมีทีมงานที่มีประสบการณ์กับ CQRS

---

## บัตรอ้างอิงด่วน

| คำถาม | ตอบ |
|---------||--------|
| **"ฉันแค่ต้องบันทึก/โหลดข้อมูล"** | ตัวจัดการโดยตรง |
| **"อยากเขียนข้อสอบ"** | รูปแบบพื้นที่เก็บข้อมูล |
| **"ฉันมีกฎเกณฑ์ทางธุรกิจที่ซับซ้อน"** | ชั้นบริการ |
| **"ฉันต้องปรับขนาดการอ่านแยกกัน"** | CQRS |
| **"ฉันกำลังเตรียมตัวสำหรับ XOOPS 4.0"** | พื้นที่เก็บข้อมูล + เลเยอร์บริการ |

---

## เอกสารที่เกี่ยวข้อง

- [คำแนะนำรูปแบบพื้นที่เก็บข้อมูล](Patterns/Repository-Pattern.md)
- [คำแนะนำรูปแบบเลเยอร์บริการ](Patterns/Service-Layer-Pattern.md)
- [CQRS คู่มือรูปแบบ](../07-XOOPS-4.0/Implementation-Guides/CQRS-Pattern-Guide.md) *(ขั้นสูง)*
- [สัญญาโหมดไฮบริด](../07-XOOPS-4.0/Specifications/Hybrid-Mode-Contract.md)

---

#รูปแบบ #การเข้าถึงข้อมูล #แผนผังการตัดสินใจ #แนวทางปฏิบัติที่ดีที่สุด #xoops