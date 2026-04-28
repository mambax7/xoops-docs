---
title: "Tematy specjalne"
---

Niektóre określone kombinacje oprogramowania systemowego mogą wymagać pewnych dodatkowych konfiguracji do pracy z XOOPS. Oto kilka szczegółów znanych problemów i wytyczne dotyczące postępowania z nimi.

## Środowiska SELinux

Niektóre pliki i katalogi muszą być zapisywalne podczas instalacji, aktualizacji i normalnej pracy XOOPS. W tradycyjnym środowisku Linux, osiąga się to poprzez zapewnienie, że użytkownik systemowy, na którym działa serwer WWW, ma uprawnienia do katalogów XOOPS, zwykle poprzez ustawienie odpowiedniej grupy dla tych katalogów.

Systemy z włączonym SELinux (takie jak CentOS i RHEL) mają dodatkowy kontekst bezpieczeństwa, który może ograniczyć zdolność procesów do zmiany systemu plików. Systemy te mogą wymagać zmian w kontekście bezpieczeństwa XOOPS do poprawnego działania.

XOOPS oczekuje możliwości swobodnego pisania do niektórych katalogów podczas normalnej operacji. Dodatkowo, podczas instalacji i aktualizacji XOOPS, niektóre pliki muszą być również zapisywalne.
 
Podczas normalnej operacji, XOOPS oczekuje możliwości pisania plików i tworzenia podkatalogów w tych katalogach:

- `uploads` w głównym katalogu głównym serwera WWW XOOPS
- `xoops_data` gdziekolwiek jest przeniesiony podczas instalacji

Podczas procesu instalacji lub aktualizacji XOOPS będzie musiał pisać do tego pliku:

- `mainfile.php` w głównym katalogu głównym serwera WWW XOOPS

Dla typowego systemu opartego na CentOS Apache, zmiany kontekstu bezpieczeństwa mogą być realizowane za pomocą tych poleceń:

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Możesz uczynić mainfile.php zapisywalnym za pomocą:

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Uwaga: Podczas instalacji możesz skopiować pusty mainfile.php z katalogu *extras*.

Powinieneś również zezwolić httpd na wysyłanie poczty:

```
setsebool -P httpd_can_sendmail=1
```

Inne ustawienia, których możesz potrzebować, obejmują:

Zezwól httpd na nawiązywanie połączeń sieciowych, tzn. pobieranie kanałów informacyjnych RSS lub wykonywanie wywołań API:

```
setsebool -P httpd_can_network_connect 1
```

Włącz połączenie sieciowe z bazą danych za pomocą:

```
setsebool -P httpd_can_network_connect_db=1
```

Aby uzyskać więcej informacji, zapoznaj się z dokumentacją systemu i/lub administratorem systemu.

## Smarty 4 i niestandardowe motywy

XOOPS 2.7.0 uaktualnił silnik szablonów z Smarty 3 do **Smarty 4**. Smarty 4 jest bardziej rygorystyczny w kwestii składni szablonów niż Smarty 3, a kilka wzorów, które były tolerowane w starszych szablonach, teraz spowoduje błędy. Jeśli instalujesz świeżą kopię XOOPS 2.7.0, używając tylko motywów i modułów dostarczanych z wydaniem, nie ma się czym martwić — każdy dostarczony szablon został zaktualizowany dla zgodności Smarty 4.

Problem dotyczy sytuacji, gdy:

- uaktualnisz istniejącą witrynę XOOPS 2.5.x, która ma niestandardowe motywy, lub
- zainstalujesz niestandardowe motywy lub starsze moduły stron trzecich w XOOPS 2.7.0.

Przed przełączeniem ruchu na żywo na uaktualnioną witrynę, uruchom skaner preflight, który jest dostarczany w katalogu `/upgrade/`. Skanuje `/themes/` i `/modules/` w poszukiwaniu niezgodności Smarty 4 i może automatycznie naprawić wiele z nich. Zapoznaj się ze stroną [Sprawdzenie preflightu](../upgrading/upgrade/preflight.md) dla szczegółów.

Jeśli napotkasz błędy szablonów po instalacji lub aktualizacji:

1. Ponownie uruchom `/upgrade/preflight.php` i rozwiąż wszelkie zgłoszone problemy.
2. Wyczyść skompilowaną pamięć podręczną szablonów, usuwając wszystko oprócz `index.html` z `xoops_data/caches/smarty_compile/`.
3. Tymczasowo przełącz się na dostarczony motyw, taki jak `xbootstrap5` lub `default`, aby potwierdzić, że problem jest specyficzny dla motywu, a nie dla całej witryny.
4. Sprawdź poprawność wszelkich niestandardowych zmian szablonów motywu lub modułu przed zwróceniem witryny do produkcji.
