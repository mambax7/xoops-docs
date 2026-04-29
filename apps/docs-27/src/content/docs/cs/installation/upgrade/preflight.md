---
title: "Předletová kontrola"
---

XOOPS 2.7.0 upgradoval svůj šablonovací engine z Smarty 3 na Smarty 4. Smarty 4 je přísnější, pokud jde o syntaxi šablon než ZXQPH000041, než ZXQPH000041 bude třeba upravit šablonu a některé šablony budou potřebovat, aby fungovaly na míru3. správně na XOOPS 2.7.0.

Abychom pomohli identifikovat a opravit tyto problémy _před_ spuštěním hlavního upgradu, XOOPS 2.7.0 se dodává s **preflight scannerem** v adresáři `upgrade/`. Než vám hlavní pracovní postup upgradu umožní pokračovat, musíte skener kontroly před výstupem spustit alespoň jednou.

## Co dělá skener

Skener před výstupem prochází vaše stávající témata a šablony modulů a hledá známé nekompatibility Smarty 4. Může:

* **Naskenujte** své adresáře `themes/` a `modules/` pro soubory šablon `.tpl` a `.html`, které mohou vyžadovat změny
* **Nahlašte** problémy seskupené podle souboru a typu problému
* **Automaticky opravte** mnoho běžných problémů, když o to požádáte

Ne každý problém lze opravit automaticky. Některé šablony budou vyžadovat ruční úpravy, zejména pokud používají starší idiomy Smarty 3, které nemají přímý ekvivalent v Smarty 4.

## Spuštění skeneru

1. Zkopírujte distribuční adresář `upgrade/` do kořenového adresáře webu (pokud jste tak již neučinili v rámci kroku [Přípravy na upgrade](ustep-01.md)).
2. Nasměrujte svůj prohlížeč na preflight URL:

   
```text
   http://example.com/upgrade/preflight.php
   
```

3. Po zobrazení výzvy se přihlaste pomocí účtu správce.
4. Skener zobrazí formulář se třemi ovládacími prvky:
   * **Adresář šablon** – ponechte prázdné, chcete-li skenovat `themes/` i `modules/`. Zadejte cestu jako `/themes/mytheme/` pro zúžení skenování na jeden adresář.
   * **Přípona šablony** – ponechte prázdné, chcete-li skenovat soubory `.tpl` i `.html`. Chcete-li zúžit kontrolu, zadejte jednu příponu.
   * **Pokusit se o automatickou opravu** – zaškrtněte toto políčko, pokud chcete, aby skener opravil problémy, které ví, jak opravit. Chcete-li skenovat pouze pro čtení, ponechte jej nezaškrtnuté.
5. Stiskněte tlačítko **Spustit**. Skener prochází vybrané adresáře a hlásí každý problém, který najde.

## Interpretace výsledků

Zpráva o skenování obsahuje seznam všech zkoumaných souborů a všech nalezených problémů. Každý záznam problému vám říká:

* Který soubor obsahuje problém
* Jaké pravidlo Smarty 4 porušuje
* Zda jej může skener automaticky opravit

Pokud jste spustili kontrolu se zapnutou možností _Pokus o automatickou opravu_, zpráva také potvrdí, které soubory byly přepsány.

## Manuální řešení problémů

V případě problémů, které skener nedokáže opravit automaticky, otevřete soubor šablony s příznakem v editoru a proveďte požadované změny. Mezi běžné nekompatibility Smarty 4 patří:

* Bloky `{php} ... {/php}` (již nejsou podporovány v Smarty 4)
* Zastaralé modifikátory a volání funkcí
* Použití oddělovače citlivého na mezery
* Předpoklady pluginu v době registrace, které se změnily v Smarty 4

Pokud nejste spokojeni s úpravou šablon, nejbezpečnějším přístupem je přejít na dodané téma (`xbootstrap5`, `default`, `xswatch5` atd.) a po dokončení upgradu se s vlastním tématem zabývat samostatně.

## Znovu běží do vyčištění

Po provedení oprav – ať už automatických nebo ručních – znovu spusťte předletový skener. Opakujte, dokud skenování nehlásí žádné zbývající problémy.

Jakmile je skenování čisté, můžete ukončit relaci před výstupem stisknutím tlačítka **Ukončit skener** v uživatelském rozhraní skeneru. To označí předletovou přípravu za dokončenou a umožní hlavnímu upgradu na `/upgrade/` pokračovat.

## Pokračuje se v upgradu

Po dokončení přípravy před výstupem můžete spustit hlavní upgrade na:

```text
http://example.com/upgrade/
```

Další kroky naleznete v části [Spuštění upgradu](ustep-02.md).

## Pokud přeskočíte kontrolu před výstupem

Důrazně se nedoporučuje přeskakování kontroly před výstupem, ale pokud jste provedli upgrade bez spuštění a nyní se vám zobrazují chyby šablony, podívejte se do části Chyby šablony Smarty v části [Odstraňování problémů](ustep-03.md). Můžete spustit kontrolu před výstupem a vymazat `xoops_data/caches/smarty_compile/` pro obnovení.