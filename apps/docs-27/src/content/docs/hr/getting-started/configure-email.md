---
title: "Konfiguriraj e-poštu"
---
![XOOPS Konfiguracija e-pošte](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS oslanja se na e-poštu za mnoge kritične korisničke interakcije, poput potvrđivanja valjanosti registracije ili ponovnog postavljanja lozinke. Stoga je važno da bude pravilno postavljen.

Konfiguriranje e-pošte stranice može biti vrlo jednostavno u nekim slučajevima, a frustrirajuće teško u drugima.

Evo nekoliko savjeta koji će vam pomoći da vaše postavljanje bude uspješno.

## Način dostave e-pošte

Ovaj odjeljak konfiguracije ima 4 moguće vrijednosti

* **PHP Mail()** - najlakši način, ako je dostupan. Ovisi o sustavu _sendmail_ programa.
* **sendmail** - Industrijska jaka opcija, ali često ciljana za SPAM iskorištavanjem slabosti u drugom softveru.
* **SMTP** - Simple Mail Transfer Protocol obično nije dostupan u novim hosting računima zbog sigurnosnih problema i mogućnosti zlouporabe. Većinom je zamijenjen SMTP Auth.
* **SMTP Auth** - SMTP s autorizacijom obično se preferira u odnosu na obični SMTP. U ovom slučaju XOOPS povezuje se izravno s poslužiteljem e-pošte na sigurniji način.

## SMTP hostovi

Ako trebate koristiti SMTP, sa ili bez "Auth", morat ćete ovdje navesti naziv poslužitelja. To ime može biti jednostavno ime glavnog računala ili IP adresa, ili može include dodatna informacija o portu i protokolu. Najjednostavniji slučaj bio bi `localhost` za SMTP (bez autentifikacije) poslužitelj koji radi na istom računalu s web poslužiteljem.

SMTP korisničko ime i SMTP lozinka uvijek su potrebni kada koristite SMTP Auth. Moguće je navesti TLS ili SSL, kao i port u konfiguracijskom polju XOOPS SMTP Hosts.

Ovo se može koristiti za povezivanje s Gmailovim SMTP-om: `tls://smtp.gmail.com:587`

Drugi primjer korištenja SSL-a: `ssl://mail.example.com:465`

## Savjeti za rješavanje problema

Ponekad stvari ne idu tako glatko kako bismo se nadali. Evo nekoliko prijedloga i izvora koji bi mogli pomoći.

### Provjerite dokumentaciju svog pružatelja usluga hostinga

Kada uspostavite uslugu hostinga s pružateljem usluga, on bi trebao pružiti informacije o tome kako pristupiti poslužiteljima e-pošte. Ovo želite imati dostupno kada konfigurirate e-poštu za svoj XOOPS sustav.

### XOOPS Koristi PHPMailer

XOOPS koristi biblioteku [PHPMailer](https://github.com/PHPMailer/PHPMailer) za slanje e-pošte. Odjeljak [Rješavanje problema](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) na wikiju nudi neke uvide.
