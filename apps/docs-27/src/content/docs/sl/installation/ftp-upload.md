---
title: "Dodatek 2: Nalaganje XOOPS prek FTP"
---
Ta dodatek vodi skozi uvajanje XOOPS 2.7.0 na oddaljenega gostitelja z uporabo FTP ali SFTP. Katera koli nadzorna plošča (cPanel, Plesk, DirectAdmin itd.) bo izpostavila iste osnovne korake.

## 1. Pripravite bazo podatkov

Prek nadzorne plošče vašega gostitelja:

1. Ustvarite novo bazo podatkov MySQL za XOOPS.
2. Ustvarite uporabnika baze podatkov z močnim geslom.
3. Uporabniku dodelite polne privilegije za novo ustvarjeno bazo podatkov.
4. Zabeležite ime baze podatkov, uporabniško ime, geslo in gostitelja — vnesli jih boste v namestitveni program XOOPS.

> **Nasvet**
>
> Sodobne nadzorne plošče ustvarijo močna gesla za vas. Ker aplikacija shrani geslo v `xoops_data/data/secure.php`, vam ga ni treba pogosto vnašati — raje uporabite dolgo, naključno generirano vrednost.

## 2. Ustvari skrbniški nabiralnik

Ustvarite e-poštni predal, ki bo prejemal obvestila administracije mesta. Namestitveni program XOOPS zahteva ta naslov med nastavitvijo računa spletnega skrbnika in ga potrdi z `FILTER_VALIDATE_EMAIL`.

## 3. Naložite datoteke

XOOPS 2.7.0 je dobavljen s prednameščenimi odvisnostmi tretjih oseb v `xoops_lib/vendor/` (paketi Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF in drugi). Zaradi tega je `xoops_lib/` znatno večji kot v 2.5.x – pričakujte več deset megabajtov.**Ne preskočite selektivno datotek znotraj `xoops_lib/vendor/`.** Preskok datotek v drevesu prodajalca Composer bo prekinil samodejno nalaganje in namestitev ne bo uspela.

Struktura nalaganja (ob predpostavki, da je `public_html` koren dokumenta):

1. Naložite `xoops_data/` in `xoops_lib/` **zraven** `public_html`, ne znotraj njega. Postavitev izven spletnega korena je priporočena varnostna drža za 2.7.0.   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
```
![](/XOOPS-docs/2.7/img/installation/img_66.jpg)
   ![](/XOOPS-docs/2.7/img/installation/img_67.jpg)

2. Naložite preostalo vsebino distribucijskega imenika `htdocs/` v `public_html/`.

   ![](/XOOPS-docs/2.7/img/installation/img_68.jpg)

> **Če vaš gostitelj ne dovoljuje imenikov zunaj korena dokumenta**
>
> Naložite `xoops_data/` in `xoops_lib/` **noter** `public_html/` in **ju preimenujte v neočitna imena** (na primer `xdata_8f3k2/` in `xlib_7h2m1/`). Preimenovane poti boste vnesli v namestitveni program, ko bo zahteval XOOPS pot podatkov in XOOPS pot knjižnice.

## 4. Omogočite zapisljive imenike

Prek pogovornega okna CHMOD odjemalca FTP (ali SSH) omogočite zapisovanje spletnemu strežniku v imenike, navedene v 2. poglavju. Na večini gostiteljev v skupni rabi zadostujeta `0775` na imenikih in `0664` na `mainfile.php`. `0777` je med namestitvijo sprejemljiv, če vaš gostitelj izvaja PHP pod uporabnikom, ki ni uporabnik FTP, vendar poostrite dovoljenja po končani namestitvi.

## 5. Zaženite namestitveni program

Usmerite svoj brskalnik na javno URL strani. Če so vse datoteke na svojem mestu, se zažene čarovnik za namestitev XOOPS in lahko sledite preostanku tega vodnika od [2. poglavja] (chapter-2-introduction.md) naprej.