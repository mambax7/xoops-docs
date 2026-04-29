---
title: "Konfiguracija baze podatkov"
---
Na tej strani so zbrani podatki o bazi podatkov, ki jo bo uporabljal XOOPS.

Ko vnesete zahtevane informacije in odpravite morebitne težave, za nadaljevanje izberite gumb »Nadaljuj«.

![XOOPS Konfiguracija zbirke podatkov namestitvenega programa](/XOOPS-docs/2.7/img/installation/installer-06.png)

## Podatki, zbrani v tem koraku

### Baza podatkov

#### Ime baze podatkov

Ime baze podatkov na gostitelju, ki naj bi jo uporabljal XOOPS. Uporabnik baze podatkov, vnesen v prejšnjem koraku, bi moral imeti vse privilegije v tej bazi podatkov. Namestitveni program bo poskušal ustvariti to bazo podatkov, če ta ne obstaja.

#### Predpona tabele

Ta predpona bo dodana imenom vseh novih tabel, ki jih ustvari XOOPS. S tem se izognete konfliktom imen, če je zbirka podatkov v skupni rabi z drugimi aplikacijami. Zaradi edinstvene predpone je težje uganiti imena tabel, kar ima varnostne prednosti. Če niste prepričani, samo obdržite privzeto

#### Nabor znakov baze podatkov

Namestitveni program je privzeto nastavljen na `utf8mb4`, ki podpira celoten obseg Unicode, vključno z emodžiji in dodatnimi znaki. Tu lahko izberete drug nabor znakov, vendar je `utf8mb4` priporočljiv za skoraj vse jezike in lokale in ga je treba pustiti, kot je, razen če imate poseben razlog, da ga spremenite.#### Primerjava baze podatkov

Polje za primerjanje je privzeto prazno. Ko je prazno, MySQL uporabi privzeto primerjanje za kateri koli nabor znakov, ki je bil izbran zgoraj (za `utf8mb4` je to običajno `utf8mb4_general_ci` ali `utf8mb4_0900_ai_ci`, odvisno od različice MySQL). Če potrebujete posebno primerjavo — na primer za ujemanje z obstoječo bazo podatkov — jo izberite tukaj. V nasprotnem primeru je priporočljivo, da polje pustite prazno.