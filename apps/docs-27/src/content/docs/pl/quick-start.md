---
title: Szybki start
description: Uruchom XOOPS 2.7 w ciągu 5 minut.
---

## Wymagania

| Komponent  | Minimum                 | Rekomendowane |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Serwer WWW | Apache 2.4 / Nginx 1.20 | Najnowsza wersja stabilna |

## Pobieranie

Pobierz najnowsze wydanie z [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Lub klonuj bezpośrednio
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Kroki instalacji

1. **Przesyłanie plików** na główny katalog dokumentów serwera WWW (np. `public_html/`).
2. **Utwórz bazę danych MySQL** i użytkownika z pełnymi uprawnieniami do niej.
3. **Otwórz przeglądarkę** i przejdź do swojej domeny — instalator XOOPS uruchomi się automatycznie.
4. **Postępuj zgodnie z kreatorem 5-krokowym** — konfiguruje ścieżki, tworzy tabele i konfiguruje Twoje konto administratora.
5. **Usuń folder `install/`** po zaproponowaniu. Jest to obowiązkowe ze względów bezpieczeństwa.

## Weryfikacja instalacji

Po skonfigurowaniu odwiedź:

- **Strona główna:** `https://yourdomain.com/`
- **Panel administracyjny:** `https://yourdomain.com/xoops_data/` *(ścieżka, którą wybrałeś podczas instalacji)*

## Następne kroki

- [Pełny przewodnik instalacji](./installation/) — konfiguracja serwera, uprawnienia, rozwiązywanie problemów
- [Przewodnik modułu](./module-guide/introduction/) — utwórz swój pierwszy moduł
- [Przewodnik motywu](./theme-guide/introduction/) — utwórz lub dostosuj motyw
