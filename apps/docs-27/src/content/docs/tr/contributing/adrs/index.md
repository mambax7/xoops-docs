---
title: "ADR Dizin"
description: "XOOPS CMS için tüm Mimari Karar Kayıtlarının Dizini"
---
# 📋 Mimarlık Karar Kayıtları İndeksi

> XOOPS CMS'yi şekillendiren mimari kararların kapsamlı dizini.

---

## ADR'ler nedir?

Mimari Karar Kayıtları (ADR'ler), XOOPS'nin geliştirilmesi sırasında alınan önemli mimari kararları belgelemektedir. Her bir seçimin bağlamını, kararını ve sonuçlarını yakalayarak, koruyucular ve katkıda bulunanlar için değerli tarihsel bağlam sağlarlar.

---

## ADR Durum Açıklaması

| Durum | Anlamı |
|----------|------------|
| **Önerilen** | Tartışılıyor, henüz kabul edilmedi |
| **Kabul edildi** | Karar kabul edildi |
| **Kullanımdan kaldırıldı** | Artık tavsiye edilmiyor |
| **geçersiz kılınmıştır** | Başka bir ADR ile değiştirildi |

---

## Mevcut ADR'ler

### Temel Kararlar

| ADR | Başlık | Durum | Etki |
|-----|-------|-----------|--------|
| ADR-001 | Modüler Mimari | Kabul edildi | Core |
| ADR-002 | Nesneye Yönelik database Erişimi | Kabul edildi | Core |
| ADR-003 | Smarty template Motoru | Kabul edildi | Core |

### Planlanan ADR'ler (XOOPS 4.0)

| ADR | Başlık | Durum | Etki |
|-----|-------|-----------|--------|
| ADR-004 | Güvenlik Sistemi Tasarımı | Önerilen | Güvenlik |
| ADR-005 | PSR-15 Ara yazılım | Önerilen | Mimarlık |
| ADR-006 | Bağımlılık Enjeksiyon Kabı | Önerilen | Mimarlık |
| ADR-007 | Etkinlik Sisteminin Yeniden Tasarımı | Önerilen | Mimarlık |

---

## ADR İlişkiler
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

## Zaman Çizelgesi
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

## Yeni ADR'ler Oluşturma

Yeni bir mimari karar önerirken:

1. ADR Şablonunu kopyalayın
2. Tüm bölümleri doldurun
3. Çekme İsteği Olarak Gönderin
4. GitHub Sorunlarını Tartışın
5. Karardan sonra durumu güncelleyin

### ADR template Yapısı
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

## 🔗 İlgili Belgeler

- Temel Kavramlar
- Katkıda Bulunma Kuralları
- XOOPS 4.0 Yol Haritası

---

#xoops #adr #mimarlık #index #kararlar