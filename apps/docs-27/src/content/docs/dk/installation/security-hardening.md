---
title: "Bilag 5: Forøg sikkerheden af din XOOPS installation"
---

Efter installation af XOOPS 2.7.0 skal du tage følgende trin for at hærde webstedet. Hvert trin er valgfrit individuelt, men tilsammen øger de basissikkerheden for installationen betydeligt.

## 1. Installer og konfigurer Protector-modulet

Det medfølgende `protector`-modul er XOOPS-firewallen. Hvis du ikke installerede det under den indledende guide, skal du installere det fra skærmen Admin → Moduler nu.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Åbn Protectors adminpanel og gennemse de advarsler, det viser. Ældre PHP-direktiver såsom `register_globals` eksisterer ikke længere (PHP 8.2+ har fjernet dem), så du vil ikke se disse advarsler længere. Aktuelle advarsler relaterer normalt til bibliotekstilladelser, sessionsindstillinger og konfiguration af tillidssti.

## 2. Lås `mainfile.php` og `secure.php` ned

Når installationsprogrammet er færdigt, forsøger det at markere begge filer som skrivebeskyttet, men nogle værter vender tilbage til tilladelserne. Bekræft og ansøg igen, hvis det er nødvendigt:

- `mainfile.php` → `0444` (ejer, gruppe, andet skrivebeskyttet)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` definerer stikonstanterne (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, qzxph000028qx0s, 0zxph000028qx00s, 0zx produktion og produktion. `secure.php` har databaselegitimationsoplysningerne:

- I 2.5.x levede databaselegitimationsoplysningerne tidligere i `mainfile.php`. De er nu gemt i `xoops_data/data/secure.php`, som indlæses af `mainfile.php` under kørsel. At holde `secure.php` inde i `xoops_data/` - en mappe, du opfordres til at flytte uden for dokumentroden - gør det meget sværere for en angriber at nå legitimationsoplysningerne over HTTP.

## 3. Flyt `xoops_lib/` og `xoops_data/` uden for dokumentroden

Hvis du ikke allerede har gjort det, skal du flytte disse to mapper et niveau over din webrod og omdøbe dem. Opdater derefter de tilsvarende konstanter i `mainfile.php`:

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Placering af disse mapper uden for dokumentroden forhindrer direkte adgang til Composers `vendor/`-træ, cachelagrede skabeloner, sessionsfiler, uploadede data og database-legitimationsoplysningerne i `secure.php`.

## 4. Cookie-domænekonfiguration

XOOPS 2.7.0 introducerer to cookie-domænekonstanter i `mainfile.php`:

```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```

Retningslinjer:

- Lad `XOOPS_COOKIE_DOMAIN` stå tomt, hvis du tjener XOOPS fra et enkelt værtsnavn eller fra en IP.
- Brug hele værten (f.eks. `www.example.com`) til kun at omfatte cookies til det værtsnavn.
- Brug det registrerbare domæne (f.eks. `example.com`), når du vil have cookies delt på tværs af `www.example.com`, `blog.example.com` osv.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` lader XOOPS opdele sammensatte TLD'er korrekt (`co.uk`, `com.au`, …) i stedet for ved et uheld at sætte en cookie på den effektive TLD.

## 5. Produktionsflag i `mainfile.php`

`mainfile.dist.php` sendes med disse to flag indstillet til `false` til produktion:

```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```

Lad dem være i produktion. Aktiver dem midlertidigt i et udviklings- eller iscenesættelsesmiljø, når du vil:

- jage langvarige legacy databasekald (`XOOPS_DB_LEGACY_LOG = true`);
- overflade `E_USER_DEPRECATED` meddelelser og andre fejlretningsoutput (`XOOPS_DEBUG = true`).

## 6. Slet installationsprogrammet

Efter installationen er fuldført:

1. Slet enhver omdøbt `install_remove_*`-mappe fra webroden.
2. Slet ethvert `install_cleanup_*.php`-script, som guiden oprettede under oprydning.
3. Bekræft, at biblioteket `install/` ikke længere er tilgængeligt via HTTP.

At forlade en deaktiveret, men tilstedeværende installatørmappe er en lav alvorlig, men undgåelig risiko.

## 7. Hold XOOPS og moduler opdateret

XOOPS følger en almindelig patch-kadence. Abonner på XoopsCore27 GitHub-lageret for udgivelsesmeddelelser, og opdater dit websted og eventuelle tredjepartsmoduler, når en ny udgivelse sendes. Sikkerhedsopdateringerne til 2.7.x udgives via lagerets udgivelsesside.
