---
title: "شاخص ADR"
description: "فهرست تمام سوابق تصمیم گیری معماری برای XOOPS CMS"
---
# 📋 فهرست سوابق تصمیم گیری معماری

> فهرست جامع تصمیمات معماری که XOOPS CMS را شکل داد.

---

## ADR ها چیست؟

سوابق تصمیم گیری معماری (ADRs) تصمیمات معماری مهمی را که در طول توسعه XOOPS گرفته شده است را مستند می کند. آنها زمینه، تصمیم و پیامدهای هر انتخاب را در بر می گیرند و زمینه تاریخی ارزشمندی را برای نگهبانان و مشارکت کنندگان فراهم می کنند.

---

## افسانه وضعیت ADR

| وضعیت | معنی |
|--------|---------|
| **پیشنهاد** | در حال بحث، هنوز پذیرفته نشده |
| **پذیرفته** | تصمیم گرفته شد |
| **منسوخ شده** | دیگر توصیه نمی شود |
| **جانشین شد** | جایگزین ADR دیگر |

---

## ADR های فعلی

### تصمیمات اساسی

| ADR | عنوان | وضعیت | تاثیر |
|-----|-------|--------|--------|
| ADR-001 | معماری مدولار | پذیرفته شده | هسته |
| ADR-002 | دسترسی به پایگاه داده شی گرا | پذیرفته شده | هسته |
| ADR-003 | موتور قالب هوشمند | پذیرفته شده | هسته |

### ADR های برنامه ریزی شده (XOOPS 4.0)

| ADR | عنوان | وضعیت | تاثیر |
|-----|-------|--------|--------|
| ADR-004 | طراحی سیستم امنیتی | پیشنهادی | امنیت |
| ADR-005 | PSR-15 Middleware | پیشنهادی | معماری |
| ADR-006 | ظرف تزریق وابستگی | پیشنهادی | معماری |
| ADR-007 | طراحی مجدد سیستم رویداد | پیشنهادی | معماری |

---

## روابط ADR

```mermaid
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

## جدول زمانی

```mermaid
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

## ایجاد ADR های جدید

هنگام پیشنهاد یک تصمیم جدید معماری:

1. الگوی ADR را کپی کنید
2. تمام بخش ها را پر کنید
3. به عنوان درخواست کشش ارسال کنید
4. در مسائل GitHub بحث کنید
5. به روز رسانی وضعیت پس از تصمیم گیری

### ساختار الگوی ADR

```markdown
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

## 🔗 مستندات مرتبط

- مفاهیم اصلی
- رهنمودهای کمکی
- نقشه راه XOOPS 4.0

---

#xoops #adr #معماری #شاخص #تصمیمات