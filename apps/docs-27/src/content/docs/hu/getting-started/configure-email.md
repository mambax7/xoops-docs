---
title: "E-mail konfigurálása"
---
![XOOPS e-mail konfiguráció](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

A XOOPS az e-mailre támaszkodik számos kritikus felhasználói művelet során, mint például a regisztráció érvényesítése vagy a jelszó visszaállítása. Ezért fontos, hogy megfelelően legyen beállítva.

A webhely e-mailjei konfigurálása bizonyos esetekben nagyon egyszerű, más esetekben pedig bosszantóan nehéz lehet.

Íme néhány tipp, amelyek segítenek a beállítás sikerében.

## E-mail kézbesítési mód

A konfiguráció ezen szakasza 4 lehetséges értékkel rendelkezik

* **PHP Mail()** - a legegyszerűbb módja, ha elérhető. A rendszer _sendmail_ programjától függ.
* **sendmail** – Erős ipari lehetőség, de gyakran a SPAM számára célozzák meg más szoftverek gyengeségei kihasználásával.
* **SMTP** – A Simple Mail Transfer Protocol rendszerint nem érhető el az új tárhelyfiókokban a biztonsági megfontolások és a visszaélés lehetősége miatt. Nagyrészt lecserélték a SMTP Auth-ra.
* **SMTP Auth** - SMTP jogosultsággal általában előnyben részesítik az egyszerű SMTP-val szemben. Ebben az esetben a XOOPS biztonságosabb módon közvetlenül csatlakozik a levelezőszerverhez.

## SMTP Gazdagépek

Ha a SMTP-t "Auth"-al vagy anélkül kell használnia, itt meg kell adnia a kiszolgáló nevét. Ez a név lehet egy egyszerű hosztnév vagy IP-cím, vagy tartalmazhat további port- és protokollinformációkat. A legegyszerűbb eset a `localhost` egy SMTP (hitelesítés nélküli) szerverhez, amely ugyanazon a gépen fut a webszerverrel.

SMTP felhasználónév és SMTP jelszó mindig szükséges a SMTP Auth. A TLS vagy SSL, valamint egy port megadható a XOOPS konfigurációs mezőben SMTP Hosts.

Ezzel csatlakozhat a Gmail SMTP-jához: `tls://smtp.gmail.com:587`

Egy másik példa a SSL használatára: `ssl://mail.example.com:465`

## Tippek a hibaelhárításhoz

Néha a dolgok nem mennek olyan simán, mint reméljük. Íme néhány javaslat és forrás, amelyek segíthetnek.

### Ellenőrizze tárhelyszolgáltatója dokumentációját

Amikor tárhelyszolgáltatást hoz létre egy szolgáltatóval, tájékoztatást kell adnia az e-mail szerverek eléréséről. Ezt szeretné elérhetővé tenni, amikor konfigurálja az e-mailt a XOOPS rendszerhez.

### XOOPS PHPMailert használ

A XOOPS a [PHPMailer](https://github.com/PHPMailer/PHPMailer) könyvtárat használja az e-mailek küldésére. A wiki [hibaelhárítás](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) része néhány betekintést nyújt.
