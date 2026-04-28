---
title: "Załącznik 5: Zwiększ bezpieczeństwo instalacji XOOPS"
---

Po zainstalowaniu XOOPS 2.7.0, podjąć następujące kroki, aby wzmocnić witrynę. Każdy krok jest opcjonalny indywidualnie, ale razem znacznie podnoszą bazowe bezpieczeństwo instalacji.

## 1. Instalacja i konfiguracja modułu Protector

Dołączony moduł `protector` to zapora XOOPS. Jeśli nie zainstalowałeś go podczas początkowego kreatora, zainstaluj go z ekranu Admin → Moduły teraz.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Otwórz panel administracyjny Protectora i przejrzyj wyświetlane ostrzeżenia. Starsze dyrektywy PHP takie jak `register_globals` już nie istnieją (PHP 8.2+ je usunęło), więc nie będziesz już widział tych ostrzeżeń. Bieżące ostrzeżenia zwykle dotyczą uprawnień katalogów, ustawień sesji i konfiguracji ścieżki zaufania.

## 2. Zablokuj `mainfile.php` i `secure.php`

Gdy instalator się skończy, próbuje oznaczyć oba pliki jako tylko do odczytu, ale niektóre hosty przywracają uprawnienia. Weryfikuj i ponownie zastosuj jeśli będzie to potrzebne:

- `mainfile.php` → `0444` (właściciel, grupa, inne tylko do odczytu)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definiuje stałe ścieżki (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) i flagi produkcji. `secure.php` przechowuje poświadczenia bazy danych:

- W 2.5.x, poświadczenia bazy danych używane do życia w `mainfile.php`. Teraz są przechowywane w `xoops_data/data/secure.php`, które są ładowane przez `mainfile.php` w czasie wykonywania. Trzymanie `secure.php` wewnątrz `xoops_data/` — katalogu, który zachęcasz do przeniesienia poza katalog główny — bardzo utrudnia atakującemu dostęp do poświadczeń przez HTTP.

## 3. Przenieś `xoops_lib/` i `xoops_data/` poza katalog główny

Jeśli jeszcze tego nie zrobiłeś, przenieś te dwa katalogi o jeden poziom powyżej katalogu głównego serwera WWW i zmień ich nazwy. Następnie zaktualizuj odpowiadające stałe w `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/ty/www');
define('XOOPS_PATH',      '/home/ty/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/ty/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Umieszczenie tych katalogów poza katalogiem głównym zapobiega bezpośredniemu dostępowi do drzewa `vendor/` Composera, buforowanych szablonów, plików sesji, przesłanych danych i poświadczeń bazy danych w `secure.php`.

## 4. Konfiguracja domeny ciasteczka

XOOPS 2.7.0 wprowadza dwie stałe domeny ciasteczka w `mainfile.php`:

```php
// Użyj listy publicznych sufiksów (PSL), aby pobrać domenę rejestrawalną.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Jawna domena ciasteczka; może być pusta, pełny host, lub domena rejestralna.
define('XOOPS_COOKIE_DOMAIN', '');
```

Wytyczne:

- Zostaw `XOOPS_COOKIE_DOMAIN` pustą, jeśli serwujesz XOOPS z jednej nazwy hosta lub z IP.
- Użyj pełnego hosta (np. `www.example.com`) aby ograniczyć ciasteczka tylko do tej nazwy hosta.
- Użyj domeny rejestrawalnej (np. `example.com`) gdy chcesz, aby ciasteczka były udostępniane w `www.example.com`, `blog.example.com`, itp.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` pozwala XOOPS prawidłowo podzielić złożone TLD (`co.uk`, `com.au`, …) zamiast przypadkowo ustawiać ciasteczko na efektywnym TLD.

## 5. Flagi produkcji w `mainfile.php`

`mainfile.dist.php` jest dostarczany z tymi dwiema flagami ustawionymi na `false` dla produkcji:

```php
define('XOOPS_DB_LEGACY_LOG', false); // wyłącz rejestrowanie użycia starszego SQL
define('XOOPS_DEBUG',         false); // wyłącz powiadomienia debugowania
```

Pozostaw je wyłączone na produkcji. Włącz je tymczasowo w środowisku programistycznym lub testowym, gdy chcesz:

- wyszukaj zaginionymi starszymi wywołaniami bazy danych (`XOOPS_DB_LEGACY_LOG = true`);
- pojawią się powiadomienia `E_USER_DEPRECATED` i inne dane wyjściowe debugowania (`XOOPS_DEBUG = true`).

## 6. Usuń instalator

Po zakończeniu instalacji:

1. Usuń dowolny zmieniony katalog `install_remove_*` z katalogu głównego serwera WWW.
2. Usuń dowolny skrypt `install_cleanup_*.php`, który kreator utworzył podczas czyszczenia.
3. Potwierdź, że katalog `install/` nie jest już osiągalny przez HTTP.

Pozostawienie wyłączonego, ale obecnego katalogu instalatora to niskowagowe, ale uniknąć ryzyko.

## 7. Utrzymuj XOOPS i moduły na bieżąco

XOOPS podąża regularnym harmonogramem poprawek. Zasubskrybuj repozytorium XoopsCore27 GitHub, aby otrzymywać powiadomienia o wydaniach i aktualizuj witrynę oraz wszelkie moduły stron trzecich za każdym razem, gdy nowe wydanie zostanie wysłane. Aktualizacje bezpieczeństwa dla 2.7.x są publikowane za pośrednictwem strony Releases repozytorium.
