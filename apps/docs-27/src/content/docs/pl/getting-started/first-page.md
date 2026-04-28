---
title: "Tworzenie pierwszej strony"
description: "Przewodnik krok po kroku dotyczący tworzenia i publikowania zawartości w XOOPS, w tym formatowania, osadzania mediów i opcji publikowania"
---

# Tworzenie pierwszej strony w XOOPS

Dowiedz się, jak tworzyć, formatować i publikować pierwszy fragment zawartości w XOOPS.

## Zrozumienie zawartości XOOPS

### Co to jest strona/post?

W XOOPS zawartość jest zarządzana za pośrednictwem modułów. Najczęstsze typy zawartości to:

| Typ | Opis | Zastosowanie |
|---|---|---|
| **Strona** | Zawartość statyczna | O nas, Kontakt, Usługi |
| **Post/Artykuł** | Zawartość datowana | Wiadomości, Wpisy na blogu |
| **Kategoria** | Organizacja zawartości | Grupa powiązanej zawartości |
| **Komentarz** | Opinia użytkownika | Pozwala na interakcję z odwiedzającymi |

Ten przewodnik obejmuje tworzenie podstawowej strony/artykułu przy użyciu domyślnego modułu zawartości XOOPS.

## Dostęp do edytora zawartości

### Z panelu administracyjnego

1. Zaloguj się do panelu administracyjnego: `http://your-domain.com/xoops/admin/`
2. Przejdź do **Content > Pages** (lub modułu zawartości)
3. Kliknij "Dodaj nową stronę" lub "Nowy post"

### Frontend (jeśli włączony)

Jeśli XOOPS jest skonfigurowany do zezwolenia na tworzenie zawartości na frontendu:

1. Zaloguj się jako zarejestrowany użytkownik
2. Przejdź do swojego profilu
3. Szukaj opcji "Prześlij zawartość"
4. Postępuj zgodnie z poniższymi krami

## Interfejs edytora zawartości

Edytor zawartości zawiera:

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## Przewodnik krok po kroku: Tworzenie pierwszej strony

### Krok 1: Dostęp do edytora zawartości

1. W panelu administracyjnym kliknij **Content > Pages**
2. Kliknij **"Dodaj nową stronę"** lub **"Utwórz"**
3. Zobaczysz edytor zawartości

### Krok 2: Wpisz tytuł strony

W polu "Tytuł" wpisz nazwę strony:

```
Title: Welcome to Our Website
```

Najlepsze praktyki dotyczące tytułów:
- Jasny i opisowy
- Zawierać słowa kluczowe jeśli możliwe
- Idealnie 50-60 znaków
- Unikaj WSZYSTKICH WIELKICH LITER (trudne do czytania)
- Bądź konkretny (nie "Strona 1")

### Krok 3: Wybierz kategorię

Wybierz, gdzie zorganizować tę zawartość:

```
Category: [Dropdown ▼]
```

Opcje mogą zawierać:
- Ogólne
- Wiadomości
- Blog
- Ogłoszenia
- Usługi

Jeśli kategorie nie istnieją, poproś administratora o ich utworzenie.

### Krok 4: Napisz swoją zawartość

Kliknij w obszar edytora zawartości i wpisz tekst.

#### Podstawowe formatowanie tekstu

Użyj paska narzędzi edytora:

| Przycisk | Działanie | Rezultat |
|---|---|---|
| **B** | Pogrubienie | **Pogrubiony tekst** |
| *I* | Kursywa | *Tekst kursywny* |
| <u>U</u> | Podkreślenie | <u>Tekst podkreślony</u> |

#### Korzystanie z HTML

XOOPS pozwala na bezpieczne znaczniki HTML. Typowe przykłady:

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### Przykłady bezpiecznego HTML

**Rekomendowane znaczniki:**
- Paragrafy: `<p>`, `<br>`
- Nagłówki: `<h1>` do `<h6>`
- Tekst: `<strong>`, `<em>`, `<u>`
- Listy: `<ul>`, `<ol>`, `<li>`
- Linki: `<a href="">`
- Cytaty: `<blockquote>`
- Tabele: `<table>`, `<tr>`, `<td>`

**Unikaj tych znaczników** (mogą być wyłączone ze względów bezpieczeństwa):
- Skrypty: `<script>`
- Style: `<style>`
- Iframes: `<iframe>` (chyba że skonfigurowano)
- Formularze: `<form>`, `<input>`

### Krok 5: Dodaj obrazy

#### Opcja 1: Wstaw adres URL obrazu

Korzystając z edytora:

1. Kliknij przycisk **Insert Image** (ikona obrazu)
2. Wpisz adres URL obrazu: `https://example.com/image.jpg`
3. Wpisz tekst alternatywny: "Opis obrazu"
4. Kliknij "Wstaw"

Odpowiednik HTML:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Opcja 2: Przesyłanie obrazu

1. Przesyłaj obraz do XOOPS najpierw:
   - Przejdź do **Content > Media Manager**
   - Przesyłaj obraz
   - Skopiuj adres URL obrazu

2. W edytorze zawartości wstaw używając adresu URL (powyższe kraki)

#### Najlepsze praktyki dotyczące obrazów

- Użyj odpowiednich rozmiarów plików (optymalizuj obrazy)
- Użyj opisowych nazw plików
- Zawsze dodaj tekst alternatywny (dostępność)
- Obsługiwane formaty: JPG, PNG, GIF, WebP
- Zalecana szerokość: 600-800 pikseli dla zawartości

### Krok 6: Osadź media

#### Osadź wideo z YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Zastąp `VIDEO_ID` identyfikatorem wideo YouTube.

**Aby znaleźć identyfikator wideo YouTube:**
1. Otwórz wideo na YouTube
2. Adres URL to: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Skopiuj identyfikator (znaki po `v=`)

#### Osadź wideo z Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Krok 7: Dodaj opis meta

W polu "Opis" dodaj krótkie podsumowanie:

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**Najlepsze praktyki dla opisu meta:**
- 150-160 znaków
- Zawierać słowa kluczowe naturalnie
- Powinien dokładnie podsumowywać zawartość
- Używany w wynikach wyszukiwarek
- Uczyń to atrakcyjnym (użytkownicy to widzą)

### Krok 8: Skonfiguruj opcje publikowania

#### Status publikacji

Wybierz status publikacji:

```
Status: ☑ Published
```

Opcje:
- **Published:** Widoczne dla publiczności
- **Draft:** Widoczne tylko dla administratorów
- **Pending Review:** Oczekiwanie na zatwierdzenie
- **Archived:** Ukryte, ale zachowane

#### Widoczność

Ustaw, kto może widzieć tę zawartość:

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### Data publikacji

Ustaw, kiedy zawartość stanie się widoczna:

```
Publish Date: [Date Picker] [Time]
```

Pozostaw jako "Teraz", aby publikować natychmiast.

#### Zezwól na komentarze

Włączaj lub wyłączaj komentarze odwiedzających:

```
Allow Comments: ☑ Yes
```

Jeśli włączone, odwiedzający mogą dodawać opinię.

### Krok 9: Zapisz swoją zawartość

Wiele opcji zapisywania:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **Publish Now:** Uczyń widocznym natychmiast
- **Save as Draft:** Zachowaj prywatnie na teraz
- **Schedule:** Publikuj w przyszłości w określonej dacie/godzinie
- **Preview:** Sprawdź jak wygląda przed zapisaniem

Kliknij Twoją wybór:

```
Click [Publish Now]
```

### Krok 10: Weryfikuj swoją stronę

Po opublikowaniu, zweryfikuj swoją zawartość:

1. Przejdź na stronę główną witryny
2. Przejdź do obszaru zawartości
3. Poszukaj nowo utworzonej strony
4. Kliknij, aby ją wyświetlić
5. Sprawdź:
   - [ ] Zawartość wyświetla się prawidłowo
   - [ ] Obrazy pojawiają się
   - [ ] Formatowanie wygląda dobrze
   - [ ] Linki działają
   - [ ] Tytuł i opis są prawidłowe

## Przykład: Ukończona strona

### Tytuł
```
Getting Started with XOOPS
```

### Zawartość
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### Opis meta
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## Zaawansowane funkcje zawartości

### Korzystanie z edytora WYSIWYG

Jeśli zainstalowany jest edytor tekstu bogatego:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Kliknij przyciski, aby formatować tekst bez HTML.

### Wstawianie bloków kodu

Wyświetl przykłady kodu:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Tworzenie tabel

Organizuj dane w tabelach:

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### Cytaty wbudowane

Podświetl ważny tekst:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## Najlepsze praktyki SEO dla zawartości

Optymalizuj swoją zawartość dla wyszukiwarek:

### Tytuł
- Zawierać główne słowo kluczowe
- 50-60 znaków
- Unikatowy dla każdej strony

### Opis meta
- Zawierać słowo kluczowe naturalnie
- 150-160 znaków
- Ćwiczący i dokładny

### Zawartość
- Pisz naturalnie, unikaj zaśmiecania słowami kluczowymi
- Użyj nagłówków (h2, h3) odpowiednio
- Uwzględnij wewnętrzne linki do innych stron
- Użyj tekstu alternatywnego dla wszystkich obrazów
- Celuj w 300+ słów dla artykułów

### Struktura adresu URL
- Zachowaj adresy URL krótkie i opisowe
- Użyj łączników do separowania słów
- Unikaj znaków specjalnych
- Przykład: `/about-our-company`

## Zarządzanie swoją zawartością

### Edytuj istniejącą stronę

1. Przejdź do **Content > Pages**
2. Znajdź swoją stronę na liście
3. Kliknij **Edytuj** lub tytuł strony
4. Dokonaj zmian
5. Kliknij **Aktualizuj**

### Usuń stronę

1. Przejdź do **Content > Pages**
2. Znajdź swoją stronę
3. Kliknij **Usuń**
4. Potwierdź usunięcie

### Zmień status publikacji

1. Przejdź do **Content > Pages**
2. Znajdź stronę, kliknij **Edytuj**
3. Zmień status w rozwijanym menu
4. Kliknij **Aktualizuj**

## Rozwiązywanie problemów z tworzeniem zawartości

### Zawartość nie pojawia się

**Objaw:** Opublikowana strona nie pojawia się na witrynie

**Rozwiązanie:**
1. Sprawdzić status publikacji: Powinno być "Opublikowane"
2. Sprawdzić datę publikacji: Powinna być obecna lub przeszła
3. Sprawdzić widoczność: Powinno być "Publiczne"
4. Wyczyść pamięć podręczną: Admin > Tools > Clear Cache
5. Sprawdzić uprawnienia: Grupa użytkowników musi mieć dostęp

### Formatowanie nie działa

**Objaw:** Znaczniki HTML lub formatowanie pojawiają się jako tekst

**Rozwiązanie:**
1. Zweryfikuj, czy HTML jest włączony w ustawieniach modułu
2. Użyj poprawnej składni HTML
3. Zamknij wszystkie znaczniki: `<p>Text</p>`
4. Używaj tylko dozwolonych znaczników
5. Użyj jednostek HTML: `&lt;` dla `<`, `&amp;` dla `&`

### Obrazy nie wyświetlają się

**Objaw:** Obrazy wyświetlają złamaną ikonę

**Rozwiązanie:**
1. Zweryfikuj, że adres URL obrazu jest prawidłowy
2. Sprawdzić, czy plik obrazu istnieje
3. Zweryfikuj prawidłowe uprawnienia na obrazie
4. Spróbuj zamiast tego przesłać obraz do XOOPS
5. Sprawdź blokowanie zewnętrzne (może wymagać CORS)

### Problemy z kodowaniem znaków

**Objaw:** Znaki specjalne pojawiają się jako bełkot

**Rozwiązanie:**
1. Zapisz plik jako kodowanie UTF-8
2. Upewnij się, że strona charset to UTF-8
3. Dodaj do głowy HTML: `<meta charset="UTF-8">`
4. Unikaj kopiowania i wklejania z Worda (użyj zwykłego tekstu)

## Najlepsze praktyki przepływu pracy zawartości

### Zalecany proces

1. **Napisz w edytorze najpierw:** Użyj edytora zawartości administracyjnej
2. **Podgląd przed publikowaniem:** Kliknij przycisk Podgląd
3. **Dodaj metadane:** Uzupełnij tytuł, opis, tagi
4. **Zapisz jako szkic najpierw:** Zapisz jako szkic, aby uniknąć utraty pracy
5. **Ostateczny przegląd:** Przeczytaj ponownie przed publikowaniem
6. **Publikuj:** Kliknij Publikuj, gdy jesteś gotowy
7. **Weryfikuj:** Sprawdzaj na żywej stronie
8. **Edytuj jeśli trzeba:** Dokonaj szybkich poprawek

### Kontrola wersji

Zawsze zachowuj kopie zapasowe:

1. **Przed głównymi zmianami:** Zapisz jako nową wersję lub kopię zapasową
2. **Archiwizuj starą zawartość:** Zachowaj nieopublikowane wersje
3. **Datuj swoje szkice:** Użyj jasnej nazwy: "Page-Draft-2025-01-28"

## Publikowanie wielu stron

Utwórz strategię zawartości:

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

Utwórz strony, aby postępować zgodnie z tą strukturą.

## Następne kroki

Po utworzeniu pierwszej strony:

1. Skonfiguruj konta użytkowników
2. Instaluj dodatkowe moduły
3. Poznaj funkcje administracyjne
4. Skonfiguruj ustawienia
5. Optymalizuj dzięki ustawieniom wydajności

---

**Tags:** #content-creation #pages #publishing #editor

**Artykuły pokrewne:**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
