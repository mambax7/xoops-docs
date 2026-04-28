---
title: "Załącznik 3: Tłumaczenie XOOPS na język lokalny"
---

XOOPS 2.7.0 zawiera tylko pliki w języku angielskim. Tłumaczenia na inne języki są utrzymywane przez społeczność i rozpowszechniane za pośrednictwem GitHub i różnych lokalnych witryn wsparcia XOOPS.

## Gdzie znaleźć istniejące tłumaczenia

- **GitHub** — tłumaczenia społeczności są coraz częściej publikowane jako osobne repozytoria w [organizacji XOOPS](https://github.com/XOOPS) i na kontach poszczególnych współtwórców. Wyszukaj GitHub dla `xoops-language-<twój-język>` lub przeglądaj organizację XOOPS w poszukiwaniu aktualnych pakietów.
- **Lokalne witryny wsparcia XOOPS** — wiele regionalnych społeczności XOOPS publikuje tłumaczenia na własnych witrynach. Odwiedź [https://xoops.org](https://xoops.org) i postępuj zgodnie z linkami do lokalnych społeczności.
- **Tłumaczenia modułów** — tłumaczenia poszczególnych modułów społeczności zwykle znajdują się obok samego modułu w organizacji `XoopsModules25x` GitHub (`25x` w nazwie jest historyczne; moduły tam są utrzymywane zarówno dla XOOPS 2.5.x i 2.7.x).

Jeśli tłumaczenie na twój język już istnieje, upuść katalogi języków do instalacji XOOPS (patrz "Jak zainstalować tłumaczenie" poniżej).

## Co musi być przetłumaczone

XOOPS 2.7.0 przechowuje pliki języka obok kodu, który ich używa. Kompletne tłumaczenie obejmuje wszystkie te lokalizacje:

- **Rdzeń** — `htdocs/language/english/` — stałe obejmujące cały serwis używane przez każdą stronę (login, typowe błędy, daty, szablony poczty itp.).
- **Instalator** — `htdocs/install/language/english/` — ciągi wyświetlane przez kreatora instalacji. Przetłumacz je *przed* uruchomieniem instalatora, jeśli chcesz zlokalizowanego doświadczenia instalacyjnego.
- **Moduł systemowy** — `htdocs/modules/system/language/english/` — zdecydowanie największy zestaw; obejmuje cały panel kontrolny administratora.
- **Dołączone moduły** — każdy z `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` i `htdocs/modules/debugbar/language/english/`.
- **Tematy** — kilka tematów zawiera własne pliki językowe; sprawdź `htdocs/themes/<theme>/language/` jeśli istnieje.

Tłumaczenie "tylko rdzenia" to minimalna przydatna jednostka i odpowiada dwóm pierwszym punktom powyżej.

## Jak tłumaczyć

1. Skopiuj katalog `english/` obok niego i zmień nazwę kopii na twój język. Nazwa katalogu powinna być małą angielską nazwą języka (`spanish`, `german`, `french`, `japanese`, `arabic` itp.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Otwórz każdy plik `.php` w nowym katalogu i przetłumacz **wartości ciągu** wewnątrz wywołań `define()`. **Nie** zmieniaj nazw stałych — są one przywoływane z kodu PHP w całym rdzeniu.

   ```php
   // Przed:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // Po (Español):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Zapisz każdy plik jako UTF-8 *bez* BOM.** XOOPS 2.7.0 używa `utf8mb4` end-to-end (baza danych, sesje, dane wyjściowe) i odrzuca pliki ze znakiem porządku bajtów. W Notepad++ jest to opcja **"UTF-8"**, *nie* "UTF-8-BOM". W VS Code jest to domyślnie; po prostu potwierdź kodowanie na pasku stanu.

4. Zaktualizuj metadane języka i zestawu znaków na górze każdego pliku, aby pasowały do twojego języka:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` powinien być kodem [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) dla twojego języka. `_CHARSET` jest zawsze `UTF-8` w XOOPS 2.7.0 — nie ma już wariantu ISO-8859-1.

5. Powtórz dla instalatora, modułu Systemowego i wszelkich dołączonych modułów, których potrzebujesz.

## Jak zainstalować tłumaczenie

Jeśli otrzymałeś gotowe tłumaczenie jako drzewo katalogów:

1. Skopiuj każdy katalog `<language>/` do pasującego katalogu `language/english/` w instalacji XOOPS. Na przykład skopiuj `language/spanish/` do `htdocs/language/`, `install/language/spanish/` do `htdocs/install/language/` i tak dalej.
2. Upewnij się, że właściciel pliku i uprawnienia są czytelne dla serwera WWW.
3. Albo wybierz nowy język podczas instalacji (kreator skanuje `htdocs/language/` dostępne języki), albo w istniejącej witrynie zmień język w **Admin → System → Preferences → General Settings**.

## Udostępnianie tłumaczenia z powrotem

Prosimy o wkład tłumaczenia z powrotem do społeczności.

1. Utwórz repozytorium GitHub (lub fork istniejącego repozytorium języka, jeśli istnieje dla twojego języka).
2. Użyj jasnej nazwy, takiej jak `xoops-language-<language-code>` (np. `xoops-language-es`, `xoops-language-pt-br`).
3. Odzwierciedlaj strukturę katalogów XOOPS wewnątrz swojego repozytorium, aby pliki wyrównały się z miejscem, w którym zostaną skopiowane:

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Dołącz `README.md` dokumentujący:
   - Nazwa języka i kod ISO
   - Kompatybilność wersji XOOPS (np. `XOOPS 2.7.0+`)
   - Tłumacz i uznania
   - Czy tłumaczenie obejmuje tylko rdzeń lub dołączone moduły
5. Otwórz pull request dla odpowiedniego repozytorium modułu/rdzenia na GitHub lub opublikuj ogłoszenie na [https://xoops.org](https://xoops.org), aby społeczność mogła go znaleźć.

> **Uwaga**
>
> Jeśli twój język wymaga zmian w rdzeniu dla formatowania daty lub kalendarza, dołącz również te zmiany do pakietu. Języki z pismami od prawej do lewej (arabski, hebrajski, perski, urdu) działają gotowo w XOOPS 2.7.0 — obsługa RTL została dodana w tej wersji i poszczególne tematy automatycznie się to podnoszą.
