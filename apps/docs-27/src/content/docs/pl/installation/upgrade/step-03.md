---
title: "Rozwiązywanie problemów"
---

## Błędy szablonów Smarty 4

Najczęściej pojawiającą się klasą problemów przy aktualizacji z XOOPS 2.5.x na 2.7.0 jest niezgodność szablonów Smarty 4. Jeśli pominąłeś lub nie ukończyłeś [Sprawdzenia preflightu](preflight.md), możesz zobaczyć błędy szablonów na front-endzie lub w obszarze administracyjnym po aktualizacji.

Aby się odwołać:

1. **Ponownie uruchom skaner preflight** na `/upgrade/preflight.php`. Zastosuj wszelkie naprawy automatyczne, które oferuje, lub ręcznie napraw flagowane szablony.
2. **Wyczyść skompilowaną pamięć podręczną szablonów.** Usuń wszystko oprócz `index.html` z `xoops_data/caches/smarty_compile/`. Skompilowane szablony Smarty 3 nie są kompatybilne z Smarty 4 i stare pliki mogą powodować mylące błędy.
3. **Tymczasowo przełącz się na dostarczony motyw.** Z obszaru administracyjnego wybierz `xbootstrap5` lub `default` jako aktywny motyw. To potwierdzą, czy problem jest ograniczony do niestandardowego motywu, czy jest w całej witrynie.
4. **Sprawdź poprawność wszelkich niestandardowych motywów i szablonów modułów** przed przełączeniem ruchu produkcji z powrotem. Zwróć szczególną uwagę na szablony, które używają bloków `{php}`, przestarzałych modyfikatorów lub niestandardowej składni ogranicznika — to są najczęstsze pęknięcia Smarty 4.

Zapoznaj się również z sekcją Smarty 4 w [Tematach specjalnych](../../installation/specialtopics.md).

## Problemy uprawnień

Aktualizacja XOOPS może wymagać zapisu do plików, które wcześniej zostały ustawione jako tylko do odczytu. Jeśli tak jest, zobaczysz komunikat podobny do:

![XOOPS Upgrade Make Writable Error](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Rozwiązaniem jest zmiana uprawnień. Uprawnienia możesz zmienić za pośrednictwem FTP, jeśli nie masz bardziej bezpośredniego dostępu. Oto przykład przy użyciu FileZilla:

![FileZilla Change Permission](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Dane wyjściowe debugowania

Możesz włączyć dodatkowe dane wyjściowe debugowania w dzienniku, dodając parametr debugowania do adresu URL używanego do uruchomienia aktualizacji:

```text
http://example.com/upgrade/?debug=1
```

