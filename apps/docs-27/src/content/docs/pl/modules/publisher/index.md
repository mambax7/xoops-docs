---
title: "Moduł Publisher"
description: "Pełna dokumentacja modułu Publisher - narzędzia do tworzenia wiadomości i blogów dla XOOPS"
---

> Czołowy moduł publikowania wiadomości i blogów dla XOOPS CMS.

---

## Przegląd

Publisher to definitywny moduł zarządzania treścią dla XOOPS, ewoluujący z SmartSection, aby stać się najbogatszym w funkcje rozwiązaniem dla blogów i wiadomości. Zapewnia kompleksowe narzędzia do tworzenia, organizowania i publikowania treści z pełną obsługą obiegu redakcyjnego.

**Wymagania:**
- XOOPS 2.5.10+
- PHP 7.1+ (rekomendowany PHP 8.x)

---

## 🌟 Główne funkcje

### Zarządzanie treścią
- **Kategorie i podkategorie** - Hierarchiczna organizacja treści
- **Edytor tekstu sformatowanego** - Obsługa wielu edytorów WYSIWYG
- **Załączniki** - Dołączanie plików do artykułów
- **Zarządzanie obrazami** - Obrazy stron i kategorii
- **Zawijanie plików** - Zawijanie plików jako artykułów

### Przepływ publikacji
- **Zaplanowana publikacja** - Ustawienie przyszłych dat publikacji
- **Daty wygaśnięcia** - Automatyczne wygaśnięcie treści
- **Moderacja** - Przepływ zatwierdzenia redakcyjnego
- **Zarządzanie szkicami** - Zapisywanie pracy w toku

### Wyświetlanie i szablony
- **Cztery szablony bazowe** - Wiele układów wyświetlania
- **Szablony niestandardowe** - Tworzenie własnych projektów
- **Optymalizacja SEO** - Przyjazne dla wyszukiwarek adresy URL
- **Responsywny design** - Wyjście gotowe na urządzenia mobilne

### Interakcja użytkownika
- **Oceny** - System oceny artykułów
- **Komentarze** - Dyskusje czytelników
- **Udostępnianie w mediach społecznościowych** - Udostępnianie w sieciach społecznościowych

### Uprawnienia
- **Kontrola przesyłania** - Kto może przesyłać artykuły
- **Uprawnienia na poziomie pola** - Kontrola pól formularza w zależności od grupy
- **Uprawnienia kategorii** - Kontrola dostępu na kategorie
- **Prawa moderacji** - Globalne ustawienia moderacji

---

## 🗂️ Zawartość sekcji

### Przewodnik użytkownika
- Przewodnik instalacji
- Podstawowa konfiguracja
- Tworzenie artykułów
- Zarządzanie kategoriami
- Konfiguracja uprawnień

### Przewodnik programisty
- Rozszerzanie Publisher
- Tworzenie własnych szablonów
- Dokumentacja API
- Haki i zdarzenia

---

## 🚀 Szybki start

### 1. Instalacja

```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```

Następnie zainstaluj za pośrednictwem XOOPS Admin → Moduły → Zainstaluj.

### 2. Utwórz swoją pierwszą kategorię

1. Przejdź do **Admin → Publisher → Kategorie**
2. Kliknij **Dodaj kategorię**
3. Wypełnij:
   - **Nazwa**: Wiadomości
   - **Opis**: Najnowsze wiadomości i aktualizacje
   - **Obraz**: Prześlij obraz kategorii
4. Zapisz

### 3. Utwórz swój pierwszy artykuł

1. Przejdź do **Admin → Publisher → Artykuły**
2. Kliknij **Dodaj artykuł**
3. Wypełnij:
   - **Tytuł**: Witaj na naszej stronie
   - **Kategoria**: Wiadomości
   - **Treść**: Treść twojego artykułu
4. Ustaw **Status**: Opublikowany
5. Zapisz

---

## ⚙️ Opcje konfiguracji

### Ustawienia ogólne

| Ustawienie | Opis | Domyślnie |
|---------|-------------|---------|
| Edytor | Edytor WYSIWYG do użycia | XOOPS Default |
| Elementy na stronie | Artykuły wyświetlane na stronie | 10 |
| Pokaż ścieżkę nawigacji | Wyświetl ścieżkę nawigacji | Tak |
| Zezwól na oceny | Włącz oceny artykułów | Tak |
| Zezwól na komentarze | Włącz komentarze artykułów | Tak |

### Ustawienia SEO

| Ustawienie | Opis | Domyślnie |
|---------|-------------|---------|
| Adresy URL SEO | Włącz przyjazne adresy URL | Nie |
| Przepisywanie adresu URL | Apache mod_rewrite | Brak |
| Słowa kluczowe meta | Automatycznie generuj słowa kluczowe | Tak |

### Matryca uprawnień

| Uprawnienie | Anonimowy | Zalogowany | Edytor | Administrator |
|------------|-----------|------------|--------|-------|
| Wyświetl artykuły | ✓ | ✓ | ✓ | ✓ |
| Przesyłaj artykuły | ✗ | ✓ | ✓ | ✓ |
| Edytuj własne artykuły | ✗ | ✓ | ✓ | ✓ |
| Edytuj wszystkie artykuły | ✗ | ✗ | ✓ | ✓ |
| Zatwierdź artykuły | ✗ | ✗ | ✓ | ✓ |
| Zarządzaj kategoriami | ✗ | ✗ | ✗ | ✓ |

---

## 📦 Struktura modułu

```
modules/publisher/
├── admin/                  # Interfejs administratora
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # Klasy PHP
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Pliki include
│   ├── common.php
│   └── functions.php
├── templates/              # Szablony Smarty
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Tłumaczenia
│   └── english/
├── sql/                    # Schemat bazy danych
│   └── mysql.sql
├── xoops_version.php       # Informacje o module
└── index.php               # Wejście do modułu
```

---

## 🔄 Migracja

### Z SmartSection

Publisher zawiera wbudowane narzędzie migracji:

1. Przejdź do **Admin → Publisher → Import**
2. Wybierz **SmartSection** jako źródło
3. Wybierz opcje importu:
   - Kategorie
   - Artykuły
   - Komentarze
4. Kliknij **Import**

### Z modułu News

1. Przejdź do **Admin → Publisher → Import**
2. Wybierz **News** jako źródło
3. Mapuj kategorie
4. Kliknij **Import**

---

## 🔗 Powiązana dokumentacja

- Przewodnik rozwoju modułu
- Szablonowanie Smarty
- Framework XMF

---

## 📚 Zasoby

- [Repozytorium GitHub](https://github.com/XoopsModules25x/publisher)
- [Tracker problemów](https://github.com/XoopsModules25x/publisher/issues)
- [Oryginalny tutorial](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
