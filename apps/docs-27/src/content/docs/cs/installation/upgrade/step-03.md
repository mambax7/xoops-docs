---
title: "Odstraňování problémů"
---

## Smarty 4 Chyby šablony

Nejčastější třídou problémů při upgradu ze XOOPS 2.5.x na 2.7.0 je nekompatibilita šablony Smarty 4. Pokud jste přeskočili nebo nedokončili [Preflight Check](preflight.md), můžete po upgradu vidět chyby šablony na frontendu nebo v oblasti pro správu.

Postup obnovení:

1. **Znovu spusťte předletový skener** na `/upgrade/preflight.php`. Použijte všechny automatické opravy, které nabízí, nebo opravte označené šablony ručně.
2. **Vymažte mezipaměť kompilované šablony.** Odeberte vše kromě `index.html` ze `xoops_data/caches/smarty_compile/`. Kompilované šablony Smarty 3 nejsou kompatibilní s Smarty 4 a zastaralé soubory mohou způsobit matoucí chyby.
3. **Dočasně přepněte na dodaný motiv.** V oblasti pro správu vyberte jako aktivní motiv `xbootstrap5` nebo `default`. Tím potvrdíte, zda je problém omezen na vlastní motiv nebo zda se týká celého webu.
4. **Před opětovným zapnutím produkčního provozu ověřte všechna vlastní témata a šablony modulů**. Věnujte zvláštní pozornost šablonám, které používají bloky `{php}`, zastaralé modifikátory nebo nestandardní syntaxi oddělovačů – to jsou nejčastější poruchy Smarty 4.

Viz také část Smarty 4 v [Speciální témata](../../installation/specialtopics.md).

## Problémy s oprávněním

Upgrade XOOPS může vyžadovat zápis do souborů, které byly dříve nastaveny pouze pro čtení. V takovém případě se zobrazí zpráva podobná této:

![Chyba při aktualizaci XOOPS pro zápis](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Řešením je změnit oprávnění. Pokud nemáte přímější přístup, můžete změnit oprávnění pomocí FTP. Zde je příklad použití FileZilla:

![FileZilla změnit oprávnění](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Výstup ladění

V loggeru můžete povolit další výstup ladění přidáním parametru ladění do URL používaného ke spuštění upgradu:

```text
http://example.com/upgrade/?debug=1
```
