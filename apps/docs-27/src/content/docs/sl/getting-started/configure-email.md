---
title: "Konfigurirajte e-pošto"
---
![XOOPS E-poštna konfiguracija](/XOOPS-docs/2.7/img/installation/XOOPS-04-email-setup.png)

XOOPS se zanaša na e-pošto za številne kritične uporabniške interakcije, kot je potrjevanje registracije ali ponastavitev gesla. Zato je pomembno, da je pravilno nastavljen.

Konfiguriranje e-pošte spletnega mesta je lahko v nekaterih primerih zelo enostavno, v drugih pa zelo težko.

Tukaj je nekaj nasvetov za uspešno namestitev.

## Način dostave e-pošte

Ta del konfiguracije ima 4 možne vrednosti

* **PHP Mail()** - najlažji način, če je na voljo. Odvisno od sistemskega programa _sendmail_.
* **sendmail** – industrijska možnost, ki je pogosto namenjena SPAM z izkoriščanjem slabosti v drugi programski opremi.
* **SMTP** - Simple Mail Transfer Protocol običajno ni na voljo v novih računih gostovanja zaradi varnostnih težav in možnosti zlorabe. V veliki meri je bil nadomeščen z SMTP Auth.
* **SMTP Auth** - SMTP z avtorizacijo ima običajno prednost pred navadnim SMTP. V tem primeru se XOOPS poveže neposredno s poštnim strežnikom na bolj varen način.

## SMTP Gostitelji

Če morate uporabiti SMTP, z ali brez "Auth," boste morali tukaj podati ime strežnika. To ime je lahko preprosto ime gostitelja ali naslov IP ali pa lahko vključuje dodatne informacije o vratih in protokolu. Najenostavnejši primer bi bil `localhost` za strežnik SMTP (brez avtorizacije), ki deluje na istem računalniku kot spletni strežnik.SMTP uporabniško ime in SMTP geslo sta vedno potrebna pri uporabi SMTP Auth. V konfiguracijskem polju XOOPS SMTP Hosts je mogoče določiti TLS ali SSL ter vrata.

To bi lahko uporabili za povezavo z Gmailovim SMTP: `tls://smtp.gmail.com:587`

Drug primer uporabe SSL: `ssl://mail.example.com:465`

## Nasveti za odpravljanje težav

Včasih stvari ne gredo tako gladko, kot bi upali. Tukaj je nekaj predlogov in virov, ki bi vam lahko pomagali.

### Preverite dokumentacijo svojega ponudnika gostovanja

Ko vzpostavite storitev gostovanja pri ponudniku, mora zagotoviti informacije o dostopu do e-poštnih strežnikov. To želite imeti na voljo, ko konfigurirate e-pošto za svoj sistem XOOPS.

### XOOPS Uporablja PHPMailer

XOOPS za pošiljanje e-pošte uporablja knjižnico [PHPMailer](https://github.com/PHPMailer/PHPMailer). Razdelek [odpravljanje težav](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) v wikiju ponuja nekaj vpogledov.