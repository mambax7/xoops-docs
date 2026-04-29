---
title: "Dodatek 3: Prevajanje XOOPS v lokalni jezik"
---
XOOPS 2.7.0 je priložen samo datotekam v angleškem jeziku. Prevode v druge jezike vzdržuje skupnost in jih distribuira prek GitHuba in različnih lokalnih XOOPS podpornih mest.

## Kje najti obstoječe prevode

- **GitHub** — prevodi skupnosti so vse pogosteje objavljeni kot ločeni repozitoriji v okviru [XOOPS organizacije](https://github.com/XOOPS) in na računih posameznih avtorjev. Poiščite GitHub za `XOOPS-language-<your-language>` ali pobrskajte po organizaciji XOOPS za trenutne pakete.
- **Lokalna XOOPS spletna mesta za podporo** — številne regionalne XOOPS skupnosti objavljajo prevode na svojih spletnih mestih. Obiščite [https://XOOPS.org](https://XOOPS.org) in sledite povezavam do lokalnih skupnosti.
- **Prevodi modulov** — prevodi za posamezne module skupnosti običajno živijo poleg samega modula v organizaciji `XoopsModules25x` GitHub (`25x` v imenu je zgodovinsko; tamkajšnji moduli se vzdržujejo za XOOPS 2.5.x in 2.7.x).

Če prevod za vaš jezik že obstaja, spustite jezikovne imenike v svojo namestitev XOOPS (glejte »Kako namestiti prevod« spodaj).

## Kaj je treba prevesti

XOOPS 2.7.0 hrani jezikovne datoteke poleg kode, ki jih uporablja. Celoten prevod zajema vse te lokacije:- **Core** — `htdocs/language/english/` — konstante na celotnem spletnem mestu, ki jih uporablja vsaka stran (prijava, pogoste napake, datumi, poštne predloge itd.).
- **Namestitveni program** — `htdocs/install/language/english/` — nizi, ki jih prikaže čarovnik za namestitev. Prevedite te *preden* zaženete namestitveni program, če želite lokalizirano izkušnjo namestitve.
- **Sistemski modul** — `htdocs/modules/system/language/english/` — daleč največji nabor; pokriva celotno skrbniško nadzorno ploščo.
- **Združeni moduli** — vsak od `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` in `htdocs/modules/debugbar/language/english/`.
- **Teme** — peščica tem pošilja lastne jezikovne datoteke; preverite `htdocs/themes/<theme>/language/`, če obstaja.

Prevod »samo jedro« je najmanjša uporabna enota in ustreza prvima dvema točkama zgoraj.

## Kako prevesti

1. Kopirajte imenik `english/` poleg njega in preimenujte kopijo v svoj jezik. Ime imenika naj bo angleško ime jezika z malimi črkami (`spanish`, `german`, `french`, `japanese`, `arabic` itd.).   
```
   htdocs/language/english/    →    htdocs/language/spanish/
   
```
2. Odprite vsako datoteko `.php` v novem imeniku in prevedite **vrednosti nizov** znotraj klicev `define()`. **Ne** spreminjajte imen konstant – nanje se sklicuje koda PHP v celotnem jedru.   
```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```
3. **Shranite vsako datoteko kot UTF-8 *brez* BOM.** XOOPS 2.7.0 uporablja `utf8mb4` od konca do konca (baza podatkov, seje, izhod) in zavrača datoteke z oznako vrstnega reda bajtov. V Notepad++ je to možnost **"UTF-8"**, *ne* "UTF-8-BOM". V kodi VS je privzeto; samo potrdite kodiranje v statusni vrstici.

4. Posodobite metapodatke o jeziku in naboru znakov na vrhu vsake datoteke, da se ujemajo z vašim jezikom:   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   
```
`_LANGCODE` bi morala biti koda [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) za vaš jezik. `_CHARSET` je vedno `UTF-8` v XOOPS 2.7.0 — ni več različice ISO-8859-1.

5. Ponovite za namestitveni program, sistemski modul in vse povezane module, ki jih potrebujete.

## Kako namestiti prevod

Če ste dobili dokončan prevod kot drevo imenikov:

1. Kopirajte vsak imenik `<language>/` v ujemajoči se nadrejeni imenik `language/english/` v vaši namestitvi XOOPS. Na primer, kopirajte `language/spanish/` v `htdocs/language/`, `install/language/spanish/` v `htdocs/install/language/` itd.
2. Prepričajte se, da lahko spletni strežnik prebere lastništvo datoteke in dovoljenja.
3. Bodisi izberite nov jezik ob namestitvi (čarovnik pregleda `htdocs/language/` za razpoložljive jezike) ali pa na obstoječem mestu spremenite jezik v **Skrbnik → Sistem → Nastavitve → Splošne nastavitve**.

## Delite svoj prevod nazaj

Prosimo, prispevajte svoj prevod nazaj skupnosti.

1. Ustvarite repozitorij GitHub (ali razcepite obstoječe jezikovno repozitorij, če obstaja za vaš jezik).
2. Uporabite jasno ime, kot je `XOOPS-language-<language-code>` (npr. `XOOPS-language-es`, `XOOPS-language-pt-br`).
3. Zrcaljenje imeniške strukture XOOPS znotraj vašega skladišča, tako da se datoteke ujemajo s tem, kje so kopirane:   
```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
```
4. Vključite `README.md` dokumentiranje:
   - Ime jezika in koda ISO
   - Združljivost različice XOOPS (npr. `XOOPS 2.7.0+`)
   - Prevajalec in avtorji
   - Ali je prevod samo jedro ali zajema module v svežnju
5. Odprite zahtevo za vleko za ustrezno repozitorij module/core na GitHubu ali objavite obvestilo na [https://XOOPS.org](https://XOOPS.org), da jo lahko skupnost najde.

> **Opomba**
>
> Če vaš jezik zahteva spremembe v jedru za oblikovanje datuma ali koledarja, vključite tudi te spremembe v paket. Jeziki s pisavami od desne proti levi (arabščina, hebrejščina, perzijščina, urdu) delujejo takoj po namestitvi v XOOPS 2.7.0 — v tej izdaji je bila dodana podpora za RTL in posamezne teme jo samodejno prevzamejo.