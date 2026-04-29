---
title: "Memilih Corak Capaian Data"
description: "Pepohon keputusan untuk memilih corak akses data yang betul untuk modul XOOPS anda"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>> **Corak manakah yang harus saya gunakan?** Pohon keputusan ini membantu anda memilih antara pengendali langsung, Corak Repositori, Lapisan Perkhidmatan dan CQRS.---

## Pokok Keputusan Pantas
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

## Perbandingan Corak| Kriteria | Pengendali Langsung | Repositori | Lapisan Perkhidmatan | CQRS |
|----------|----------------|------------|--------------|------|
| **Kerumitan** | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kebolehujian** | ❌ Keras | ✅ Baik | ✅ Hebat | ✅ Hebat |
| **Fleksibiliti** | ❌ Rendah | ✅ Sederhana | ✅ Tinggi | ✅ Sangat Tinggi |
| **XOOPS 2.5.x** | ✅ Asli | ✅ Berfungsi | ✅ Berfungsi | ⚠️ Kompleks |
| **XOOPS 4.0** | ⚠️ Ditamatkan | ✅ Disyorkan | ✅ Disyorkan | ✅ Untuk skala |
| **Saiz Pasukan** | 1 pembangun | 1-3 pembangun | 2-5 pembangun | 5+ pembangun |
| **Penyelenggaraan** | ❌ Lebih tinggi | ✅ Sederhana | ✅ Rendah | ⚠️ Memerlukan kepakaran |---

## Bila Menggunakan Setiap Corak### ✅ Pengendali Langsung (`XoopsPersistableObjectHandler`)**Terbaik untuk:** Modul ringkas, prototaip pantas, pembelajaran XOOPS
```
php
// Simple and direct - good for small modules
$handler = xoops_getModuleHandler('article', 'news');
$articles = $handler->getObjects(new Criteria('status', 1));
```
**Pilih ini apabila:**
- Membina modul ringkas dengan 1-3 jadual pangkalan data
- Mencipta prototaip pantas
- Anda satu-satunya pembangun dan tidak memerlukan ujian
- Modul tidak akan berkembang dengan ketara**Had:**
- Ujian unit sukar (pergantungan global)
- Gandingan ketat pada lapisan pangkalan data XOOPS
- Logik perniagaan cenderung bocor ke dalam pengawal---

### ✅ Corak Repositori**Terbaik untuk:** Kebanyakan modul, pasukan yang mahukan kebolehujian
```
php
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
**Pilih ini apabila:**
- Anda mahu menulis ujian unit
- Anda mungkin menukar sumber data kemudian (DB → API)
- Bekerja dengan 2+ pembangun
- Membina modul untuk pengedaran**Laluan naik taraf:** Ini ialah corak yang disyorkan untuk penyediaan XOOPS 4.0.---

### ✅ Lapisan Perkhidmatan**Terbaik untuk:** Modul dengan logik perniagaan yang kompleks
```
php
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
**Pilih ini apabila:**
- Operasi merangkumi pelbagai sumber data
- Peraturan perniagaan adalah kompleks
- Anda memerlukan pengurusan transaksi
- Berbilang bahagian apl melakukan perkara yang sama**Laluan naik taraf:** Gabungkan dengan Repositori untuk seni bina yang mantap.---

### ⚠️ CQRS (Pengasingan Tanggungjawab Pertanyaan Perintah)**Terbaik untuk:** Modul berskala tinggi dengan read/write asimetri
```
php
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
**Pilih ini apabila:**
- Membaca jauh melebihi jumlah penulisan (100:1 atau lebih)
- Anda memerlukan penskalaan yang berbeza untuk membaca vs menulis
- Keperluan reporting/analytics yang kompleks
- Penyumberan acara akan memberi manfaat kepada domain anda**Amaran:** CQRS menambahkan kerumitan yang ketara. Kebanyakan modul XOOPS tidak memerlukannya.---

## Laluan Naik Taraf Disyorkan
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
### Langkah 1: Balut Pengendali dalam Repositori (2-4 jam)1. Buat antara muka untuk keperluan akses data anda
2. Laksanakan menggunakan pengendali sedia ada
3. Suntikan repositori dan bukannya memanggil `xoops_getModuleHandler()` secara terus### Langkah 2: Tambah Lapisan Perkhidmatan Apabila Diperlukan (1-2 hari)1. Apabila logik perniagaan muncul dalam pengawal, ekstrak ke Perkhidmatan
2. Perkhidmatan menggunakan repositori, bukan pengendali secara langsung
3. Pengawal menjadi nipis (laluan → perkhidmatan → tindak balas)### Langkah 3: Pertimbangkan CQRS Sahaja Jika (jarang berlaku)1. Anda mempunyai berjuta-juta bacaan setiap hari
2. Model baca dan tulis adalah berbeza dengan ketara
3. Anda memerlukan sumber acara untuk jejak audit
4. Anda mempunyai pasukan yang berpengalaman dengan CQRS---

## Kad Rujukan Pantas| Soalan | Jawapan |
|----------|--------|
| **"Saya hanya perlu save/load data"** | Pengendali Langsung |
| **"Saya mahu menulis ujian"** | Corak Repositori |
| **"Saya mempunyai peraturan perniagaan yang rumit"** | Lapisan Perkhidmatan |
| **"Saya perlu skala bacaan secara berasingan"** | CQRS |
| **"Saya sedang bersiap untuk XOOPS 4.0"** | Repositori + Lapisan Perkhidmatan |---

## Dokumentasi Berkaitan- [Panduan Corak Repositori](Patterns/Repository-Pattern.md)
- [Panduan Corak Lapisan Perkhidmatan](Patterns/Service-Layer-Pattern.md)
- [Panduan Corak CQRS](../07-XOOPS-4.0/Implementation-Guides/CQRS-Pattern-Guide.md) *(lanjutan)*
- [Kontrak Mod Hibrid](../07-XOOPS-4.0/Specifications/Hybrid-Mode-Contract.md)---

#patterns #data-access #decision-tree #best-practices #XOOPS