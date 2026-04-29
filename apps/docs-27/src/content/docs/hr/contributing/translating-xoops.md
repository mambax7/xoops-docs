---
title: "Dodatak 3: Prijevod XOOPS na lokalni jezik"
---
XOOPS 2.7.0 isporučuje se samo s engleskim language datotekama. Prijevode na druge languages održava zajednica i distribuira putem GitHuba i raznih lokalnih stranica za podršku XOOPS.

## Gdje pronaći postojeće prijevode

- **GitHub** — prijevodi zajednice sve se više objavljuju kao zasebna spremišta pod [organizacijom XOOPS](https://github.com/XOOPS) i na računima pojedinačnih suradnika. Potražite `xoops-language-<your-language>` na GitHubu ili pregledajte XOOPS organizaciju za trenutne pakete.
- **Lokalne stranice za podršku XOOPS** — mnoge regionalne zajednice XOOPS objavljuju prijevode na svojim stranicama. Posjetite [https://xoops.org](https://xoops.org) i slijedite poveznice do lokalnih zajednica.
- **Prijevodi modula** — prijevodi za pojedinačnu zajednicu modules obično žive pored samog modula u `XoopsModules25x` GitHub organizaciji (`25x` u nazivu je povijesni; modules tamo se održavaju za oba XOOPS 2.5.x i 2.7.x).

Ako prijevod za vaš language već postoji, ispustite direktorije language u svoju instalaciju XOOPS (pogledajte "Kako instalirati prijevod" u nastavku).

## Što treba prevesti

XOOPS 2.7.0 čuva language datoteke pored koda koji ih koristi. Kompletan prijevod pokriva sve ove lokacije:

- **Core** — `htdocs/language/english/` — konstante na cijelom web-mjestu koje koristi svaka stranica (prijava, uobičajene pogreške, datumi, pošta templates, itd.).
- **Instalater** — `htdocs/install/language/english/` — nizovi koje prikazuje čarobnjak za instalaciju. Prevedite ovo *prije* pokretanja programa za instalaciju ako želite lokalizirano iskustvo instalacije.
- **modul sustava** — `htdocs/modules/system/language/english/` — daleko najveći set; pokriva cijelu upravljačku ploču admin.
- **U paketu modules** — svaki od `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` i `htdocs/modules/debugbar/language/english/`.
- **teme** — nekolicina themes šalje svoje vlastite language datoteke; provjerite `htdocs/themes/<theme>/language/` ako postoji.

Prijevod "samo jezgra" minimalna je korisna jedinica i odgovara prva dva nabrajanja iznad.

## Kako prevesti

1. Kopirajte direktorij `english/` pored njega i preimenujte kopiju u svoj language. Naziv imenika treba biti engleski naziv language (`spanish`, `german`, `french`, `japanese`, `arabic`, itd.).

   
   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Otvorite svaku `.php` datoteku u novom direktoriju i prevedite **string vrijednosti** unutar `define()` poziva. **Nemojte** mijenjati nazive konstanti — na njih upućuje PHP kod u cijeloj jezgri.

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

4. Ažurirajte language i metapodatke skupa znakova na vrhu svake datoteke kako bi odgovarali vašem language:

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` trebao bi biti [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) kôd za vaš language. `_CHARSET` uvijek je `UTF-8` u XOOPS 2.7.0 — više ne postoji varijanta ISO-8859-1.

5. Ponovite za instalacijski program, sistemski modul i bilo koji isporučeni modules koji vam je potreban.

## Kako instalirati prijevod

Ako ste dobili gotov prijevod kao stablo imenika:

1. Kopirajte svaki `<language>/` direktorij u odgovarajući nadređeni `language/english/` u vašoj XOOPS instalaciji. Na primjer, kopirajte `language/spanish/` u `htdocs/language/`, `install/language/spanish/` u `htdocs/install/language/`, i tako dalje.
2. Provjerite jesu li vlasništvo nad datotekom i dopuštenja čitljivi web poslužitelju.
3. Ili odaberite novi language tijekom instalacije (čarobnjak skenira `htdocs/language/` radi dostupnog languages) ili, na postojećem mjestu, promijenite language u **Administrator → Sustav → Postavke → Opće postavke**.

## Dijeljenje vašeg prijevoda

Doprinesite svoj prijevod zajednici.

1. Napravite GitHub repozitorij (ili račvajte postojeći language repozitorij ako postoji za vaš language).
2. Koristite jasan naziv kao što je `xoops-language-<language-code>` (npr. `xoops-language-es`, `xoops-language-pt-br`).
3. Zrcalite strukturu direktorija XOOPS unutar vašeg repozitorija tako da datoteke budu u skladu s mjestom na koje se kopiraju:

   
   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Uključite dokumentaciju `README.md`:
   - Naziv jezika i ISO kod
   - Kompatibilnost verzije XOOPS (npr. `XOOPS 2.7.0+`)
   - Prevoditelj i zasluge
   - Bilo da je prijevod samo za jezgru ili pokriva paket modules
5. Otvorite zahtjev za povlačenjem relevantnog repozitorija modula/jezgre na GitHubu ili objavite najavu na [https://xoops.org](https://xoops.org) kako bi ga zajednica mogla pronaći.

> **Napomena**
>
> Ako vaš language zahtijeva promjene u jezgri za formatiranje datuma ili kalendara, include te promjene također u paketu. Jezici s pismima zdesna nalijevo (arapski, hebrejski, perzijski, urdu) rade odmah u XOOPS 2.7.0 — RTL podrška je dodana u ovom izdanju i pojedinačni themes je preuzima automatski.
