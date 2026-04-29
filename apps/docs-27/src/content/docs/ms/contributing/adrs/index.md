---
title: "Indeks ADR"
description: "Indeks semua Rekod Keputusan Seni Bina untuk XOOPS CMS"
---
# 📋 Indeks Rekod Keputusan Seni Bina> Indeks komprehensif keputusan seni bina yang membentuk XOOPS CMS.---

## Apakah itu ADR?Rekod Keputusan Seni Bina (ADR) mendokumenkan keputusan seni bina penting yang dibuat semasa pembangunan XOOPS. Mereka menangkap konteks, keputusan dan akibat setiap pilihan, menyediakan konteks sejarah yang berharga untuk penyelenggara dan penyumbang.---

## Lagenda Status ADR| Status | Maksudnya |
|--------|---------|
| **Dicadangkan** | Dalam perbincangan, belum diterima |
| **Diterima** | Keputusan telah diterima pakai |
| **Ditamatkan** | Tidak disyorkan lagi |
| **Digantikan** | Digantikan oleh ADR lain |---

## ADR semasa### Keputusan Asas| ADR | Tajuk | Status | Kesan |
|-----|-------|--------|--------|
| ADR-001 | Seni Bina Modular | Diterima | Teras |
| ADR-002 | Akses Pangkalan Data Berorientasikan Objek | Diterima | Teras |
| ADR-003 | Enjin Templat Smarty | Diterima | Teras |### ADR Terancang (XOOPS 4.0)| ADR | Tajuk | Status | Kesan |
|-----|-------|--------|--------|
| ADR-004 | Reka Bentuk Sistem Keselamatan | Dicadangkan | Keselamatan |
| ADR-005 | PSR-15 Middleware | Dicadangkan | Seni Bina |
| ADR-006 | Bekas Suntikan Ketergantungan | Dicadangkan | Seni Bina |
| ADR-007 | Reka Bentuk Semula Sistem Acara | Dicadangkan | Seni Bina |---

## Perhubungan ADR
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

## Garis masa
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

## Mencipta ADR BaharuApabila mencadangkan keputusan seni bina baharu:1. Salin Templat ADR
2. Isi semua bahagian
3. Hantar sebagai Permintaan Tarik
4. Bincangkan dalam Isu GitHub
5. Kemas kini status selepas keputusan### Struktur Templat ADR
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

## 🔗 Dokumentasi Berkaitan- Konsep Teras
- Garis Panduan Menyumbang
- Pelan Jalan XOOPS 4.0---

#XOOPS #adr #architecture #index #decisions