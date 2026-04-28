---
title: "Po aktualizacji"
---

## Aktualizacja modułu systemowego

Po zastosowaniu wszystkich potrzebnych poprawek, wybranie _Kontynuuj_ skonfiguruje wszystko do aktualizacji modułu **system**. Jest to bardzo ważny krok i jest wymagany do prawidłowego ukończenia aktualizacji.

![XOOPS Update System Module](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Wybierz _Aktualizuj_, aby wykonać aktualizację modułu System.

## Aktualizacja innych modułów dostarczanych przez XOOPS

XOOPS jest dostarczany z trzema opcjonalnymi modułami - pm (Wiadomości prywatne), profile (Profil użytkownika) i protector (Protector). Powinieneś dokonać aktualizacji na którymkolwiek z tych zainstalowanych modułów.

![XOOPS Update Other Modules](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Aktualizacja innych modułów

Jest prawdopodobne, że są aktualizacje do innych modułów, które mogą umożliwić modułom lepszą pracę w ramach Twojego teraz zaktualizowanego XOOPS. Powinieneś zbadać i zastosować wszelkie odpowiednie aktualizacje modułu.

## Przejrzyj nowe preferencje hartowania ciasteczka

Aktualizacja XOOPS 2.7.0 dodaje dwie nowe preferencje, które kontrolują sposób wydawania ciasteczek sesji:

* **`session_cookie_samesite`** — kontroluje atrybut ciasteczka SameSite. `Lax` jest bezpiecznym ustawieniem domyślnym dla większości witryn. Użyj `Strict` dla maksymalnej ochrony, jeśli Twoja witryna nie polega na nawigacji między źródłami. `None` jest odpowiednia tylko jeśli wiesz, że jej potrzebujesz.
* **`session_cookie_secure`** — gdy włączone, ciasteczko sesji jest wysyłane tylko przez połączenia HTTPS. Włącz to, jeśli Twoja witryna działa na HTTPS.

Te ustawienia możesz przejrzeć w System Options → Preferences → General Settings.

## Weryfikuj niestandardowe motywy

Jeśli Twoja witryna używa niestandardowego motywu, przejdź przez front-end i obszar administracyjny, aby potwierdzić, że strony renderują się prawidłowo. Uaktualnienie do Smarty 4 może wpłynąć na niestandardowe szablony, nawet jeśli skan preflightu przeszedł. Jeśli widzisz problemy z renderowaniem, przejrzyj [Rozwiązywanie problemów](ustep-03.md).

## Czyszczenie plików instalacji i aktualizacji

Ze względów bezpieczeństwa usuń te katalogi z katalogu głównego serwera WWW po potwierdzeniu, że aktualizacja działa:

* `upgrade/` — katalog przepływu pracy aktualizacji
* `install/` — jeśli istnieje, albo jako `install/`, albo jako zmieniony katalog `installremove*`

Pozostawienie ich na miejscu udostępnia skrypty aktualizacji i instalacji każdemu, kto może dostać się do Twojej witryny.

## Otwórz swoją witrynę

Jeśli postępujesz zgodnie z radą, aby _Wyłączyć witrynę_, powinieneś ją włączyć z powrotem po ustaleniu, że działa poprawnie.

