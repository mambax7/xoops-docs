---
title: "Uruchomienie aktualizacji"
---

Przed uruchomieniem głównego aktualizatora upewnij się, że ukończyłeś [Sprawdzenie preflightu](preflight.md). Interfejs aktualizacji wymaga uruchomienia preflightu co najmniej raz i skieruje Cię tam, jeśli nie.

Uruchom aktualizację, wskazując przeglądarkę na katalog _upgrade_ witryny:

```text
http://example.com/upgrade/
```

Powinno to wyświetlić stronę taką jak ta:

![XOOPS Upgrade Startup](/xoops-docs/2.7/img/installation/upgrade-01.png)

Wybierz przycisk "Kontynuuj", aby kontynuować.

Każdy "Kontynuuj" przechodzi do innej poprawki. Kontynuuj aż wszystkie poprawki są zastosowane, a strona aktualizacji modułu systemowego jest wyświetlana.

![XOOPS Upgrade Applied Patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Co stosuje aktualizacja 2.5.11 → 2.7.0

Podczas uaktualniania z XOOPS 2.5.11 na 2.7.0, aktualizator stosuje następujące poprawki. Każdy jest reprezentowany jako oddzielny krok w kreatorze, abyś mógł potwierdzić, co się zmienia:

1. **Usuń przestarzały dołączony PHPMailer.** Dołączona kopia PHPMailer wewnątrz modułu Protector jest usuwana. PHPMailer jest teraz dostarczany przez Composer w `xoops_lib/vendor/`.
2. **Usuń przestarzały folder HTMLPurifier.** Podobnie, stary folder HTMLPurifier wewnątrz modułu Protector jest usuwany. HTMLPurifier jest teraz dostarczany przez Composer.
3. **Utwórz tabelę `tokens`.** Nowa tabela `tokens` jest dodawana do ogólnego magazynu tokenów o określonym zakresie. Tabela zawiera kolumny dla identyfikatora tokena, identyfikatora użytkownika, zakresu, skrótu i sygnatur czasowych wydania/wygaśnięcia/użytego, i jest używana przez funkcje oparte na tokenach w XOOPS 2.7.0.
4. **Poszerzaj `bannerclient.passwd`.** Kolumna `bannerclient.passwd` jest rozszerzona do `VARCHAR(255)`, aby mogła przechowywać nowoczesne hashy haseł (bcrypt, argon2) zamiast starej wąskiej kolumny.
5. **Dodaj preferencje ciasteczek sesji.** Dwie nowe preferencje są wstawiane: `session_cookie_samesite` (dla atrybutu ciasteczka SameSite) i `session_cookie_secure` (aby wymusić ciasteczka tylko HTTPS). Zapoznaj się z [Po aktualizacji](ustep-04.md), aby dowiedzieć się, jak je przejrzeć po zakończeniu aktualizacji.

Żaden z tych kroków nie dotyka danych zawartości. Twoi użytkownicy, posty, obrazy i dane modułu pozostają niezmienione.

## Wybieranie języka

Główna dystrybucja XOOPS jest dostarczana z obsługą angielskiego. Obsługa dodatkowych ustawień lokalnych jest dostarczana przez [witryny wsparcia lokalnego XOOPS](https://xoops.org/modules/xoopspartners/). Ta obsługa może mieć formę dostosowanej dystrybucji lub dodatkowych plików do dodania do głównej dystrybucji.

Tłumaczenia XOOPS są utrzymywane na [transifex](https://www.transifex.com/xoops/public/)

Jeśli Twój aktualizator XOOPS ma dodatkową obsługę języka, możesz zmienić język, wybierając ikonę języka w górnych menu i wybierając inny język.

![XOOPS Upgrade Language](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)

