---
title: "Preverjanje pred letom"
---
XOOPS 2.7.0 je nadgradil svoj mehanizem za predloge s Smarty 3 na Smarty 4. Smarty 4 je strožji glede sintakse predloge kot Smarty 3 in nekatere teme po meri in predloge modulov bo morda treba prilagoditi, preden bodo pravilno delovale na XOOPS 2.7.0.

Za pomoč pri odkrivanju in odpravljanju teh težav _pred_ zagonom glavne nadgradnje je XOOPS 2.7.0 priložen **pregledovalniku** v imeniku `upgrade/`. Optični bralnik pred tiskom morate zagnati vsaj enkrat, preden vam glavni tok dela nadgradnje omogoči nadaljevanje.

## Kaj počne skener

Skener pred tiskom pregleda vaše obstoječe teme in predloge modulov ter išče znane nezdružljivosti Smarty 4. Lahko:

* **Skenirajte** svoja imenika `themes/` in `modules/` za datoteke predlog `.tpl` in `.html`, ki jih je morda treba spremeniti
* **Prijavi** težave, razvrščene po datotekah in po vrsti težave
* **Samodejno popravi** številne pogoste težave, ko to zahtevate

Vsake težave ni mogoče samodejno popraviti. Nekatere predloge boste morali ročno urediti, še posebej, če uporabljajo starejše idiome Smarty 3, ki nimajo neposrednega ekvivalenta v Smarty 4.

## Zagon optičnega bralnika

1. Kopirajte distribucijski imenik `upgrade/` v spletni koren vašega mesta (če tega še niste storili v okviru koraka [Priprave za nadgradnjo](ustep-01.md).
2. Usmerite svoj brskalnik na pred tiskom URL:   
```text
   http://example.com/upgrade/preflight.php
   
```
3. Ob pozivu se prijavite s skrbniškim računom.
4. Optični bralnik prikaže obrazec s tremi kontrolniki:
   * **Imenik predlog** — pustite prazno za skeniranje `themes/` in `modules/`. Vnesite pot, kot je `/themes/mytheme/`, da zožite skeniranje na en sam imenik.
   * **Razširitev predloge** — pustite prazno za skeniranje datotek `.tpl` in `.html`. Vnesite eno razširitev, da zožite skeniranje.
   * **Poskusi samodejnega popravka** — potrdite to polje, če želite, da optični bralnik odpravi težave, za katere ve, kako jih odpraviti. Pustite nepotrjeno za skeniranje samo za branje.
5. Pritisnite gumb **Zaženi**. Skener se sprehodi po izbranih imenikih in poroča o vsaki težavi, ki jo najde.

## Razlaga rezultatov

Poročilo o skeniranju navaja vse datoteke, ki jih je pregledal, in vsako težavo, ki jo je našel. Vsak vnos težave vam pove:

* Katera datoteka vsebuje težavo
* Katero pravilo Smarty 4 krši
* Ali ga je skener lahko samodejno popravil

Če ste zagnali skeniranje z omogočenim _Poskusom samodejnega popravka_, bo poročilo potrdilo tudi, katere datoteke so bile prepisane.

## Ročno odpravljanje težav

Za težave, ki jih optični bralnik ne more popraviti samodejno, odprite označeno datoteko predloge v urejevalniku in naredite zahtevane spremembe. Pogoste nezdružljivosti Smarty 4 vključujejo:* `{php} ... {/php}` blokov (ni več podprt v Smarty 4)
* Zastareli modifikatorji in klici funkcij
* Uporaba ločila, občutljivega na presledke
* Predpostavke vtičnika za čas registracije, ki so se spremenile v Smarty 4

Če ne znate urejati predlog, je najvarnejši pristop, da preklopite na poslano temo (`xbootstrap5`, `default`, `xswatch5` itd.) in po končani nadgradnji ločeno obravnavate temo po meri.

## Ponovno izvajanje do čistega

Ko opravite popravke – samodejne ali ročne – znova zaženite optični bralnik pred tiskom. Ponavljajte, dokler skeniranje ne sporoči nobenih preostalih težav.

Ko je skeniranje čisto, lahko končate sejo pred tiskom tako, da pritisnete gumb **Izhod iz optičnega bralnika** v uporabniškem vmesniku optičnega bralnika. To označi predtisk kot dokončan in omogoči glavnemu nadgraditelju na `/upgrade/` nadaljevanje.

## Nadaljevanje nadgradnje

Ko je predtisk končan, lahko zaženete glavno nadgradnjo na:
```text
http://example.com/upgrade/
```
Glejte [Izvajanje nadgradnje](ustep-02.md) za naslednje korake.

## Če preskočite pregled pred tiskom

Preskakovanje preverjanja pred tiskom močno odsvetujemo, vendar če ste nadgradili, ne da bi ga zagnali in zdaj vidite napake predloge, glejte razdelek Napake predloge Smarty 4 v [Odpravljanje težav](ustep-03.md). Pred tiskom lahko zaženete naknadno in počistite `xoops_data/caches/smarty_compile/` za obnovitev.