---
title: "Sprawdzenie preflightu"
---

XOOPS 2.7.0 uaktualnił silnik szablonów z Smarty 3 do Smarty 4. Smarty 4 jest bardziej rygorystyczny w kwestii składni szablonów niż Smarty 3, a niektóre niestandardowe motywy i szablony modułów mogą wymagać dostosowania, zanim będą działać prawidłowo w XOOPS 2.7.0.

Aby pomóc w identyfikacji i naprawie tych problemów _przed_ uruchomieniem głównego aktualizatora, XOOPS 2.7.0 jest dostarczany ze **skanerem preflight** w katalogu `upgrade/`. Musisz uruchomić skaner preflight co najmniej raz, zanim przepływ pracy aktualizacji pozwoli Ci kontynuować.

## Co robi skaner

Skaner preflight przechodzi przez istniejące motywy i szablony modułów w poszukiwaniu znanych niezgodności Smarty 4. Może on:

* **Skanować** katalogi `themes/` i `modules/` dla plików szablonów `.tpl` i `.html`, które mogą wymagać zmian
* **Raportować** problemy pogrupowane według pliku i typu problemu
* **Automatycznie naprawić** wiele typowych problemów, gdy o to poprosisz

Nie każdy problem można naprawić automatycznie. Niektóre szablony będą wymagać edycji ręcznej, zwłaszcza jeśli używają starszych idiomów Smarty 3, które nie mają bezpośredniego odpowiednika w Smarty 4.

## Uruchomienie skanera

1. Skopiuj katalog `upgrade/` dystrybucji do katalogu głównego serwera WWW witryny (jeśli nie zrobiłeś tego już jako część kroku [Przygotowania do aktualizacji](ustep-01.md)).
2. Wskaż przeglądarkę na adres URL preflightu:

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Zaloguj się przy użyciu konta administratora po wyświetleniu monitu.
4. Skaner wyświetla formularz z trzema kontrolkami:
   * **Katalog szablonów** — zostaw pusty, aby skanować zarówno `themes/` jak i `modules/`. Wpisz ścieżkę taką jak `/themes/mytheme/`, aby zawęzić skan do jednego katalogu.
   * **Rozszerzenie szablonu** — zostaw puste, aby skanować zarówno pliki `.tpl` jak i `.html`. Wpisz jedno rozszerzenie, aby zawęzić skan.
   * **Spróbuj automatycznie naprawić** — zaznacz to pole, jeśli chcesz, aby skaner naprawił problemy, które wie jak naprawić. Pozostaw niezaznaczone, aby skanu tylko do odczytu.
5. Naciśnij przycisk **Uruchom**. Skaner przechodzi przez wybrane katalogi i raportuje każdy znaleziony problem.

## Interpretowanie wyników

Raport skanowania wyświetla każdy badany plik i każdy znaleziony problem. Każdy wpis problemu informuje Cię:

* Który plik zawiera problem
* Jaką regułę Smarty 4 narusza
* Czy skaner mógł go naprawić automatycznie

Jeśli uruchomiłeś skan z włączoną _Spróbuj automatycznie naprawić_, raport będzie również potwierdzać, które pliki zostały przepisane.

## Ręczne naprawianie problemów

Dla problemów, których skaner nie może naprawić automatycznie, otwórz flagowany plik szablonu w edytorze i dokonaj wymaganych zmian. Typowe niezgodności Smarty 4 obejmują:

* `{php} ... {/php}` bloki (nie są już obsługiwane w Smarty 4)
* Przestarzałe modyfikatory i wywołania funkcji
* Użycie ogranicznika wrażliwego na białe znaki
* Założenia wtyczki czasu rejestracji, które zmieniły się w Smarty 4

Jeśli nie czujesz się komfortowo edytując szablony, najbezpieczniejszym podejściem jest przełączenie na dostarczony motyw (`xbootstrap5`, `default`, `xswatch5`, itp.) i zajęcie się niestandardowym motywem oddzielnie po zakończeniu aktualizacji.

## Ponowne uruchamianie aż do czyszczenia

Po dokonaniu poprawek — czy to automatycznych czy ręcznych — ponownie uruchom skaner preflight. Powtarzaj, aż skan raportuje, że nie ma pozostałych problemów.

Gdy skan jest czysty, możesz zakończyć sesję preflightu naciskając przycisk **Wyjdź ze skanera** w interfejsie skanera. To oznacza preflight jako ukończony i pozwala głównemu aktualizatorowi w `/upgrade/` na kontynuację.

## Kontynuowanie do aktualizacji

Po ukończeniu preflightu możesz uruchomić główny aktualizator w:

```text
http://example.com/upgrade/
```

Zapoznaj się z [Uruchomieniem aktualizacji](ustep-02.md) dla następnych kroków.

## Jeśli pominiesz preflight

Pominięcie preflightu jest zdecydowanie odradzane, ale jeśli uaktualniłeś bez jego uruchomienia i teraz widzisz błędy szablonów, zapoznaj się z sekcją Błędy szablonów Smarty 4 [Rozwiązywania problemów](ustep-03.md). Możesz uruchomić preflight po fakcie i wyczyścić `xoops_data/caches/smarty_compile/`, aby się odwołać.
