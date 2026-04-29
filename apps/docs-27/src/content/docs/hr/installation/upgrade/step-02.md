---
title: "Nadogradnja u tijeku"
---
Prije pokretanja glavnog programa za nadogradnju, provjerite jeste li dovršili [Provjeru prije leta](preflight.md). Korisničko sučelje za nadogradnju zahtijeva barem jednom pokretanje predispitivanja i uputit će vas tamo ako niste.

Pokrenite nadogradnju usmjeravanjem preglednika na direktorij _upgrade_ vaše web stranice:

```text
http://example.com/upgrade/
```

Ovo bi trebalo prikazati stranicu poput ove:

![XOOPS Pokretanje nadogradnje](/xoops-docs/2.7/img/installation/upgrade-01.png)

Za nastavak odaberite gumb "Nastavi".

Svaki "Nastavi" napreduje kroz drugu zakrpu. Nastavite dok se ne primijene sve zakrpe i dok se ne pojavi stranica za ažuriranje modula sustava.

![XOOPS Primijenjena zakrpa nadogradnje](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Na što se odnosi nadogradnja 2.5.11 → 2.7.0

Prilikom nadogradnje sa XOOPS 2.5.11 na 2.7.0, program za nadogradnju primjenjuje sljedeće zakrpe. Svaki je predstavljen kao zaseban korak u čarobnjaku tako da možete potvrditi što se mijenja:

1. **Uklonite zastarjeli PHPMailer u paketu.** Kopija PHPMailera u paketu unutar modula Protector se briše. PHPMailer se sada isporučuje kroz Composer u `xoops_lib/vendor/`.
2. **Uklonite zastarjelu mapu HTMLPurifier.** Slično, briše se stara mapa HTMLPurifier unutar modula Protector. HTMLPurifier se sada isporučuje kroz Composer.
3. **Kreirajte tablicu `tokens`.** Dodana je nova tablica `tokens` za generičku pohranu tokena s opsegom. Tablica ima stupce za ID tokena, ID korisnika, opseg, hash i vremenske oznake izdano/isteklo/korišteno, a koriste je značajke temeljene na tokenu u XOOPS 2.7.0.
4. **Proširite `bannerclient.passwd`.** Stupac `bannerclient.passwd` proširen je na `VARCHAR(255)` tako da može pohraniti moderne hashove zaporki (bcrypt, argon2) umjesto naslijeđenog uskog stupca.
5. **Dodajte postavke kolačića sesije.** Umetnute su dvije nove postavke: `session_cookie_samesite` (za atribut kolačića SameSite) i `session_cookie_secure` (za prisilno postavljanje kolačića samo za HTTPS). Pogledajte [Nakon nadogradnje](ustep-04.md) kako biste ih pregledali nakon završetka nadogradnje.

Nijedan od ovih koraka ne dotiče vaše podatke o sadržaju. Vaši korisnici, postovi, slike i podaci modula ostaju netaknuti.

## Odabir jezika

Glavna distribucija XOOPS dolazi s podrškom za engleski jezik. Podršku za dodatne lokalne postavke pruža [XOOPS lokalna mjesta za podršku](https://xoops.org/modules/xoopspartners/). Ova podrška može doći u obliku prilagođene distribucije ili dodatnih datoteka za dodavanje u glavnu distribuciju.

XOOPS prijevodi se održavaju na [transifex](https://www.transifex.com/xoops/public/)

Ako vaš XOOPS Upgrader ima dodatnu podršku za language, možete promijeniti language odabirom ikone language u gornjim izbornicima i odabirom drugog language.

![XOOPS Jezik nadogradnje](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
