---
title: "Glosariusz XOOPS"
description: "Definicje terminów i pojęć specyficznych dla XOOPS"
---

> Kompleksowy glosariusz terminologii specyficznej dla XOOPS i pojęć.

---

## A

### Ramy administracyjne
Standaryzowana rama interfejsu administracyjnego wprowadzona w XOOPS 2.3, zapewniająca spójne strony administracyjne na wszystkich modułach.

### Automatyczne ładowanie
Automatyczne ładowanie klas PHP, gdy są potrzebne, przy użyciu standardu PSR-4 w nowoczesnym XOOPS.

---

## B

### Blok
Samodzielna jednostka zawartości, która może być pozycjonowana w regionach motywu. Bloki mogą wyświetlać zawartość modułu, niestandardowy HTML lub dane dynamiczne.

```php
// Definicja bloku
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'Mój blok',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Proces inicjowania rdzenia XOOPS przed wykonaniem kodu modułu, zwykle poprzez `mainfile.php` i `header.php`.

---

## C

### Kryteria / CriteriaCompo
Klasy do budowania warunków zapytań bazy danych w sposób zorientowany obiektowo.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Atak bezpieczeństwa zapobiegany w XOOPS przy użyciu tokenów bezpieczeństwa poprzez `XoopsFormHiddenToken`.

---

## D

### DI (Wstrzykiwanie zależności)
Wzorzec projektowy planowany dla XOOPS 4.0, gdzie zależności są wstrzykiwane zamiast tworzone wewnętrznie.

### Dirname
Nazwa katalogu modułu, używana jako unikalny identyfikator w całym systemie.

### DTYPE (Typ danych)
Stałe definiujące sposób przechowywania i dezynfekcji zmiennych XoopsObject:
- `XOBJ_DTYPE_INT` - Liczba całkowita
- `XOBJ_DTYPE_TXTBOX` - Tekst (pojedyncza linia)
- `XOBJ_DTYPE_TXTAREA` - Tekst (wiele linii)
- `XOBJ_DTYPE_EMAIL` - Adres e-mail

---

## E

### Zdarzenie
Wystąpienie w cyklu życia XOOPS, które może wyzwolić niestandardowy kod poprzez preloady lub haki.

---

## F

### Ramy pracy
Patrz XMF (XOOPS Module Framework).

### Element formularza
Składnik systemu formularzy XOOPS reprezentujący pole formularza HTML.

---

## G

### Grupa
Zbiór użytkowników z udostępnionymi uprawnieniami. Główne grupy to: Webmasterowie, Zarejestrowani użytkownicy, Anonimowy.

---

## H

### Handler
Klasa zarządzająca operacjami CRUD na instancjach XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Klasa użyteczności zapewniająca łatwy dostęp do obsługi modułów, konfiguracji i usług.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Główne klasy XOOPS zapewniające podstawową funkcjonalność: dostęp do bazy danych, zarządzanie użytkownikami, bezpieczeństwo itp.

---

## L

### Plik języka
Pliki PHP zawierające stałe do internacjonalizacji, przechowywane w katalogach `language/[code]/`.

---

## M

### mainfile.php
Podstawowy plik konfiguracyjny XOOPS zawierający poświadczenia bazy danych i definicje ścieżek.

### MCP (Model-Controller-Presenter)
Wzorzec architektoniczny podobny do MVC, często używany w tworzeniu modułów XOOPS.

### Middleware
Oprogramowanie położone między żądaniem a odpowiedzią, planowane dla XOOPS 4.0 przy użyciu PSR-15.

### Moduł
Samodzielny pakiet rozszerzający funkcjonalność XOOPS, instalowany w katalogu `modules/`.

### MOC (Mapa zawartości)
Koncepcja Obsidian dla notatek przeglądu, które łączą się z powiązaną zawartością.

---

## N

### Namespace
Funkcja PHP do organizacji klas, używana w XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Powiadomienie
System XOOPS do alertowania użytkowników o zdarzeniach za pośrednictwem poczty e-mail lub PM.

---

## O

### Obiekt
Patrz XoopsObject.

---

## P

### Uprawnienie
Kontrola dostępu zarządzana poprzez grupy i procedury obsługi uprawnień.

### Preload
Klasa, która dołącza się do zdarzeń XOOPS, ładowana automatycznie z katalogu `preloads/`.

### PSR (Rekomendacja standardu PHP)
Standardy z PHP-FIG, które XOOPS 4.0 w pełni wdroży.

---

## R

### Renderer
Klasa, która wyświetla elementy formularza lub inne komponenty UI w określonych formatach (Bootstrap itp.).

---

## S

### Smarty
Silnik szablonów używany przez XOOPS do oddzielenia prezentacji od logiki.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Usługa
Klasa zapewniająca logikę biznesową do ponownego użytku, zazwyczaj dostępna za pośrednictwem Helper.

---

## T

### Szablon
Plik Smarty (`.tpl` lub `.html`) definiujący warstwę prezentacji dla modułów.

### Motyw
Zbiór szablonów i zasobów definiujących wygląd wizualny witryny.

### Token
Mechanizm bezpieczeństwa (ochrona CSRF) zapewniający, że przesyłanie formularzy pochodzi z legit emych źródeł.

---

## U

### uid
ID użytkownika - unikalny identyfikator każdego użytkownika w systemie.

---

## V

### Zmienna (Var)
Pole zdefiniowane na XoopsObject przy użyciu `initVar()`.

---

## W

### Widget
Mały, samodzielny komponent interfejsu użytkownika, podobny do bloków.

---

## X

### XMF (XOOPS Module Framework)
Zbiór narzędzi i klas do nowoczesnego tworzenia modułów XOOPS.

### XOBJ_DTYPE
Stałe do definiowania typów danych zmiennych w XoopsObject.

### XoopsDatabase
Warstwa abstrakcji bazy danych zapewniająca wykonywanie zapytań i wychodzenie.

### XoopsForm
System generowania formularzy do tworzenia formularzy HTML programowo.

### XoopsObject
Klasa bazowa dla wszystkich obiektów danych w XOOPS, zapewniająca zarządzanie zmiennymi i dezynfekcję.

### xoops_version.php
Plik manifestu modułu definiujący właściwości modułu, tabele, bloki, szablony i konfigurację.

---

## Wspólne akronimy

| Akronim | Znaczenie |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## Powiązana dokumentacja

- Główne koncepcje
- Dokumentacja API
- Zasoby zewnętrzne

---

#xoops #glosariusz #dokumentacja #terminologia #definicje
