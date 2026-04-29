---
title: "ADR ดัชนี"
description: "ดัชนีบันทึกการตัดสินใจด้านสถาปัตยกรรมทั้งหมดสำหรับ XOOPS CMS"
---
# 📋 ดัชนีบันทึกการตัดสินใจทางสถาปัตยกรรม

> ดัชนีที่ครอบคลุมของการตัดสินใจทางสถาปัตยกรรมที่หล่อหลอม XOOPS CMS

---

## ADR คืออะไร

บันทึกการตัดสินใจด้านสถาปัตยกรรม (ADR) บันทึกการตัดสินใจทางสถาปัตยกรรมที่สำคัญระหว่างการพัฒนา XOOPS โดยจะจับบริบท การตัดสินใจ และผลที่ตามมาของแต่ละตัวเลือก โดยให้บริบททางประวัติศาสตร์ที่มีคุณค่าสำหรับผู้ดูแลและผู้มีส่วนร่วม

---

## ADR คำอธิบายสถานะ

| สถานะ | ความหมาย |
|--------|---------|
| **เสนอ** | อยู่ระหว่างการสนทนา ยังไม่ได้รับการยอมรับ |
| **ยอมรับแล้ว** | ได้มีการตัดสินใจแล้ว |
| **เลิกใช้แล้ว** | ไม่แนะนำอีกต่อไป |
| **ถูกแทนที่** | แทนที่ด้วย ADR | อีกอัน

---

## ADR ปัจจุบัน

### การตัดสินใจขั้นพื้นฐาน

| ADR | ชื่อเรื่อง | สถานะ | ผลกระทบ |
|-----|-------|--------|--------|
| ADR-001 | สถาปัตยกรรมแบบแยกส่วน | ยอมรับแล้ว | แกน |
| ADR-002 | การเข้าถึงฐานข้อมูลเชิงวัตถุ | ยอมรับแล้ว | แกน |
| ADR-003 | เครื่องมือเทมเพลต Smarty | ยอมรับแล้ว | แกน |

### ADR ที่วางแผนไว้ (XOOPS 4.0)

| ADR | ชื่อเรื่อง | สถานะ | ผลกระทบ |
|-----|-------|--------|--------|
| ADR-004 | การออกแบบระบบรักษาความปลอดภัย | เสนอ | ความปลอดภัย |
| ADR-005 | PSR-15 มิดเดิลแวร์ | เสนอ | สถาปัตยกรรม |
| ADR-006 | คอนเทนเนอร์ฉีดพึ่งพา | เสนอ | สถาปัตยกรรม |
| ADR-007 | การออกแบบระบบกิจกรรมใหม่ | เสนอ | สถาปัตยกรรม |

---

## ADR ความสัมพันธ์
```
mermaid
graph TB
    subgraph "Core Architecture"
        A[ADR-001<br>Modular Architecture]
        B[ADR-002<br>Database Abstraction]
        C[ADR-003<br>Template Engine]
    end

    subgraph "Security"
        D[ADR-004<br>Security System]
    end

    subgraph "XOOPS 4.0"
        E[ADR-005<br>Middleware]
        F[ADR-006<br>DI Container]
        G[ADR-007<br>Events]
    end

    A --> B
    A --> C
    A --> D
    B --> F
    C --> E
    D --> E
    F --> G

    style A fill:#9f9,stroke:#333
    style B fill:#9f9,stroke:#333
    style C fill:#9f9,stroke:#333
    style D fill:#ff9,stroke:#333
    style E fill:#ff9,stroke:#333
    style F fill:#ff9,stroke:#333
    style G fill:#ff9,stroke:#333
```
---

## ไทม์ไลน์
```
mermaid
timeline
    title ADR Timeline
    2001-2003 : ADR-001 Modular Architecture
              : ADR-002 Database Abstraction
              : ADR-003 Template Engine
    2007 : ADR-004 Security System
    2026 : ADR-005 Middleware
         : ADR-006 DI Container
         : ADR-007 Events
```
---

## การสร้าง ADR ใหม่

เมื่อเสนอการตัดสินใจทางสถาปัตยกรรมใหม่:

1. คัดลอกเทมเพลต ADR
2. กรอกข้อมูลให้ครบทุกส่วน
3. ส่งเป็นคำขอดึง
4. พูดคุยในประเด็น GitHub
5. อัพเดตสถานะหลังการตัดสินใจ

### ADR โครงสร้างเทมเพลต
```
markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue motivating this decision?

## Decision
What is the change that we're proposing?

## Consequences
What becomes easier or harder as a result?

## Alternatives Considered
What other options were evaluated?
```
---

## 🔗 เอกสารที่เกี่ยวข้อง

- แนวคิดหลัก
- แนวทางการมีส่วนร่วม
- XOOPS แผนงาน 4.0

---

#xoops #adr #สถาปัตยกรรม #ดัชนี #การตัดสินใจ