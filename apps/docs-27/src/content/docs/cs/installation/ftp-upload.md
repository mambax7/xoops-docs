---
title: "Dodatek 2: Nahrání XOOPS přes FTP"
---

Tento dodatek vás provede nasazením XOOPS 2.7.0 na vzdáleném hostiteli pomocí FTP nebo SFTP. Jakýkoli ovládací panel (cPanel, Plesk, DirectAdmin atd.) zobrazí stejné základní kroky.

## 1. Připravte databázi

Prostřednictvím ovládacího panelu vašeho hostitele:

1. Vytvořte novou databázi MySQL pro XOOPS.
2. Vytvořte uživatele databáze se silným heslem.
3. Udělte uživateli plná oprávnění k nově vytvořené databázi.
4. Poznamenejte si název databáze, uživatelské jméno, heslo a hostitele – zadáte je do instalačního programu XOOPS.

> **Tip**
>
> Moderní ovládací panely generují silná hesla za vás. Vzhledem k tomu, že aplikace ukládá heslo do `xoops_data/data/secure.php`, nemusíte ho zadávat často – dejte přednost dlouhé, náhodně generované hodnotě.

## 2. Vytvořte poštovní schránku správce

Vytvořte e-mailovou schránku, která bude přijímat upozornění pro správu webu. Instalační program XOOPS požádá o tuto adresu během nastavování účtu webmastera a ověří ji pomocí `FILTER_VALIDATE_EMAIL`.

## 3. Nahrajte soubory

XOOPS 2.7.0 se dodává s předinstalovanými závislostmi třetích stran v `xoops_lib/vendor/` (balíčky Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, ZXQ a další). Díky tomu je `xoops_lib/` výrazně větší než v 2.5.x – očekávejte desítky megabajtů.

**Selektivně nevynechávejte soubory uvnitř `xoops_lib/vendor/`.** Přeskakování souborů ve stromu dodavatele Composer přeruší automatické načítání a instalace se nezdaří.

Struktura nahrávání (za předpokladu, že `public_html` je kořen dokumentu):

1. Nahrajte `xoops_data/` a `xoops_lib/` **vedle** `public_html`, nikoli dovnitř. Jejich umístění mimo kořen webu je doporučeným bezpečnostním postojem pro verzi 2.7.0.

   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Nahrajte zbývající obsah distribučního adresáře `htdocs/` do `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Pokud váš hostitel nepovoluje adresáře mimo kořen dokumentu**
>
> Nahrajte `xoops_data/` a `xoops_lib/` **uvnitř** `public_html/` a **přejmenujte je na názvy, které nejsou zřejmé** (například `xdata_8f3k2/` a `xlib_7h2m1/`). Přejmenované cesty zadáte do instalačního programu, když vás požádá o cestu dat XOOPS a cestu knihovny XOOPS.

## 4. Vytvořte zapisovatelné adresáře

Prostřednictvím dialogu CHMOD klienta FTP (nebo SSH) udělejte do adresářů uvedených v kapitole 2 možnost zápisu webovým serverem. Na většině sdílených hostitelů stačí `0775` v adresářích a `0664` na `mainfile.php`. `0777` je během instalace přijatelné, pokud váš hostitel spouští PHP pod jiným uživatelem, než je uživatel FTP, ale po dokončení instalace utáhněte oprávnění.

## 5. Spusťte instalační program

Nasměrujte svůj prohlížeč na veřejný URL webu. Pokud jsou všechny soubory na svém místě, spustí se Průvodce instalací XOOPS a můžete postupovat podle zbytku této příručky od [Kapitola 2](chapter-2-introduction.md) dále.