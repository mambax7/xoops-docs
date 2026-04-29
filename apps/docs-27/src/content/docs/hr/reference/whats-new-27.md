---
title: "Što je novo u XOOPS 2.7.0"
---
XOOPS 2.7.0 značajno je ažuriranje iz serije 2.5.x. Prije instalacije ili nadogradnje pregledajte promjene na ovoj stranici kako biste znali što možete očekivati. Popis u nastavku fokusiran je na stavke koje utječu na instalaciju i mjesto administration — za potpuni popis promjena pogledajte napomene o izdanju koje se isporučuju s distribucijom.

## PHP 8.2 novi je minimum

XOOPS 2.7.0 zahtijeva **PHP 8.2 ili noviji**. PHP 7.x i ranije više nisu podržane. Strogo se preporučuje PHP 8.4 ili noviji.

**Radnja:** Prije nego što počnete, potvrdite da vaš host nudi PHP 8.2+. Pogledajte [Zahtjevi](installation/requirements.md).

## MySQL 5.7 novi je minimum

Novi minimum je **MySQL 5.7** (ili kompatibilni MariaDB). Strogo se preporučuje MySQL 8.4 ili noviji. MySQL 9.0 je također podržan.

Stara upozorenja o problemima kompatibilnosti PHP/MySQL 8 više ne vrijede jer XOOPS više ne podržava zahvaćene verzije PHP.

## Smarty 4 zamjenjuje Smarty 3

Ovo je najveća pojedinačna promjena za postojeće stranice. XOOPS 2.7.0 koristi **Smarty 4** kao mehanizam za izradu predložaka. Smarty 4 je stroži u pogledu sintakse predloška od Smarty 3, a neki prilagođeni themes i modul templates možda će trebati prilagodbe prije nego što se ispravno renderiraju.

Kako bi vam pomogao u prepoznavanju i popravljanju ovih problema, XOOPS 2.7.0 isporučuje **preflight skener** u direktoriju `upgrade/` koji ispituje vaš postojeći templates radi poznate nekompatibilnosti Smarty 4 i može automatski popraviti mnoge od njih.

**Radnja:** Ako nadograđujete s 2.5.x i imate prilagođeni themes ili stariji modules, pokrenite [Preflight Check](upgrading/upgrade/preflight.md) _prije_ pokretanja glavnog programa za nadogradnju.

## Ovisnosti kojima upravlja skladatelj

XOOPS 2.7.0 koristi **Composer** za upravljanje svojim ovisnostima PHP. Ovi žive u `xoops_lib/vendor/`. Knjižnice trećih strana koje su prethodno bile uključene u jezgru ili u modules — PHPMailer, HTMLPurifier, Smarty i druge — sada se isporučuju kroz Composer.

**Radnja:** Većina operatera web mjesta ne treba ništa učiniti — otpustite tarballs isporuku s već popunjenim `vendor/`. Ako premještate ili nadograđujete web mjesto, kopirajte cijelo stablo `xoops_lib/`, uključujući `vendor/`. Programeri kloniraju git repository should run `composer install` inside `htdocs/xoops_lib/`. See [Notes for Developers](notes-for-developers/developers.md).

## Nove ojačane postavke kolačića sesije

Tijekom nadogradnje dodaju se dvije nove postavke:

* **`session_cookie_samesite`** — kontrolira atribut SameSite na kolačićima sesije (`Lax`, `Strict` ili `None`).
* **`session_cookie_secure`** — kada je omogućeno, kolačići sesije šalju se samo preko HTTPS-a.

**Akcija:** Nakon nadogradnje, pregledajte ih pod System Options → Preferences → General Settings. Pogledajte [Nakon nadogradnje](upgrading/upgrade/ustep-04.md).

## Novi stol `tokens`

XOOPS 2.7.0 dodaje `tokens` tablicu baze podataka za generičku pohranu tokena s opsegom. Program za nadogradnju automatski stvara ovu tablicu kao dio nadogradnje 2.5.11 → 2.7.0.

## Modernizirana pohrana lozinkiStupac `bannerclient.passwd` proširen je na `VARCHAR(255)` tako da može sadržavati moderne hashove zaporki (bcrypt, argon2). Program za nadogradnju automatski širi stupac.

## Ažurirana tema i raspored modula

XOOPS 2.7.0 isporučuje se s ažuriranim prednjim dijelom themes:

* `default`, `xbootstrap` (nasljeđe), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Nova **Moderna** admin tema je included uz postojeću temu Prijelaza.

Novi modul **DebugBar** temeljen na Symfony VarDumperu isporučuje se kao jedan od opcijskih modules koji se mogu instalirati. Koristan je za razvoj i postavljanje, ali se obično ne instalira na mjestima javne produkcije.

Pogledajte [Odaberite temu](installation/installation/step-12.md) i [Instalacija modula](installation/installation/step-13.md).

## Kopiranje u novo izdanje više ne prepisuje konfiguraciju

Prethodno je kopiranje nove XOOPS distribucije na postojeće mjesto zahtijevalo oprez kako bi se izbjeglo prepisivanje `mainfile.php` i drugih konfiguracijskih datoteka. U verziji 2.7.0, proces kopiranja ostavlja postojeće konfiguracijske datoteke netaknutima, što nadogradnje čini osjetno sigurnijima.

Ipak biste trebali napraviti potpunu sigurnosnu kopiju prije bilo kakve nadogradnje.

## Mogućnost preopterećenja predloška u sustavu admin themes

Administrator themes u XOOPS 2.7.0 sada može nadjačati pojedinačni sustav admin templates, što olakšava prilagodbu korisničkog sučelja administration bez račvanja cijeli modul sustava.

## Što se nije promijenilo

Sigurnosti radi, ovi dijelovi XOOPS rade na isti način u 2.7.0 kao u 2.5.x:

* Redoslijed stranice programa za instalaciju i ukupni tijek
* Podjela konfiguracije `mainfile.php` plus `xoops_data/data/secure.php`
* Preporučena praksa premještanja `xoops_data` i `xoops_lib` izvan web korijena
* Model instalacije modula i format manifesta `xoops_version.php`
* Tijek rada premještanja web-mjesta (sigurnosna kopija, uređivanje `mainfile.php`/`secure.php`, korištenje SRDB-a ili slično)

## Kamo dalje

* Počinjete iznova? Nastavite na [Zahtjevi](installation/requirements.md).
* Nadogradnja s 2.5.x? Započnite s [Nadogradnjom](upgrading/upgrade/README.md), a zatim pokrenite [Provjeru prije leta](upgrading/upgrade/preflight.md).
