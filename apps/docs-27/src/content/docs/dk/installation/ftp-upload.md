---
title: "Bilag 2: Uploader XOOPS via FTP"
---

Dette appendiks gennemgår implementeringen af XOOPS 2.7.0 til en fjernvært ved hjælp af FTP eller SFTP. Ethvert kontrolpanel (cPanel, Plesk, DirectAdmin osv.) vil afsløre de samme underliggende trin.

## 1. Forbered databasen

Gennem din værts kontrolpanel:

1. Opret en ny MySQL-database for XOOPS.
2. Opret en databasebruger med en stærk adgangskode.
3. Giv brugeren fulde rettigheder på den nyoprettede database.
4. Registrer databasenavnet, brugernavnet, adgangskoden og værten - du skal indtaste dem i XOOPS installationsprogrammet.

> **Tip**
>
> Moderne kontrolpaneler genererer stærke adgangskoder til dig. Da applikationen gemmer adgangskoden i `xoops_data/data/secure.php`, behøver du ikke at skrive den ofte - foretrækker en lang, tilfældigt genereret værdi.

## 2. Opret en administratorpostkasse

Opret en e-mail-postkasse, der vil modtage meddelelser om webstedsadministration. XOOPS-installationsprogrammet beder om denne adresse under opsætningen af ​​webmasterkontoen og validerer den med `FILTER_VALIDATE_EMAIL`.

## 3. Upload filerne

XOOPS 2.7.0 leveres med dets tredjepartsafhængigheder forudinstalleret i `xoops_lib/vendor/` (Composer-pakker, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF og mere). Dette gør `xoops_lib/` betydeligt større end i 2.5.x — forvent titusinder af megabyte.

**Spring ikke filer selektivt over i `xoops_lib/vendor/`.** Hvis du springer filer over i Composer-leverandørtræet, afbrydes automatisk indlæsning, og installationen mislykkes.

Uploadstruktur (forudsat at `public_html` er dokumentroden):

1. Upload `xoops_data/` og `xoops_lib/` **ved siden af** `public_html`, ikke inde i den. At placere dem uden for webroden er den anbefalede sikkerhedsposition for 2.7.0.

   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/ ← upload her
   └── xoops_lib/ ← upload her
   
```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Upload det resterende indhold af distributionsbiblioteket `htdocs/` til `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Hvis din vært ikke tillader mapper uden for dokumentroden**
>
> Upload `xoops_data/` og `xoops_lib/` **indvendigt** `public_html/` og **omdøb dem til ikke-indlysende navne** (f.eks. `xdata_8f3k2/` og `xlib_7h2m1/`). Du vil indtaste de omdøbte stier i installationsprogrammet, når det beder om XOOPS Data Path og XOOPS Library Path.

## 4. Gør skrivbare mapper skrivbare

Gennem FTP-klientens CHMOD-dialog (eller SSH), gør de mapper, der er angivet i kapitel 2, skrivbare af webserveren. På de fleste delte værter er `0775` på mapper og `0664` på `mainfile.php` tilstrækkelige. `0777` er acceptabelt under installationen, hvis din vært kører PHP under en anden bruger end FTP-brugeren, men stram tilladelserne efter installationen er fuldført.

## 5. Start installationsprogrammet

Peg med din browser på webstedets offentlige URL. Hvis alle filer er på plads, starter XOOPS installationsguiden, og du kan følge resten af ​​denne vejledning fra [Kapitel 2](chapter-2-introduction.md) og fremefter.
