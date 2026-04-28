---
title: "Konfiguracja poczty e-mail"
---

![XOOPS Email Configuration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS polega na poczcie e-mail dla wielu krytycznych interakcji użytkownika, takich jak walidacja rejestracji lub resetowanie hasła. Dlatego ważne jest, aby został skonfigurowany prawidłowo.

Konfiguracja poczty e-mail witryny może być bardzo łatwa w niektórych przypadkach i frustrująco trudna w innych.

Oto kilka porad, które pomogą Ci osiągnąć sukces w konfiguracji.

## Metoda dostarczania poczty e-mail

Ta sekcja konfiguracji ma 4 możliwe wartości

* **PHP Mail()** - najłatwiejszy sposób, jeśli jest dostępny. Zależy od programu systemowego _sendmail_.
* **sendmail** - Opcja o sile przemysłowej, ale często celowana do SPAMU poprzez wykorzystywanie słabości w innym oprogramowaniu.
* **SMTP** - Simple Mail Transfer Protocol zwykle nie jest dostępny na nowych rachunkach hostingowych ze względu na obawy bezpieczeństwa i potencjał nadużycia. Został w dużej mierze zastąpiony przez SMTP Auth.
* **SMTP Auth** - SMTP z autoryzacją jest zwykle preferowany zamiast zwykłego SMTP. W tym przypadku XOOPS łączy się bezpośrednio z serwerem poczty w bardziej bezpieczny sposób.

## Hosty SMTP

Jeśli chcesz użyć SMTP, z lub bez "Auth", będziesz musiał określić tutaj nazwę serwera. Ta nazwa może być prostą nazwą hosta lub adresem IP, lub może zawierać dodatkowe informacje o porcie i protokole. Najprostszym przypadkiem byłoby `localhost` dla serwera SMTP (bez uwierzytelniania) działającego na tej samej maszynie co serwer WWW.

Nazwa użytkownika SMTP i hasło SMTP są zawsze wymagane w przypadku korzystania z SMTP Auth. W polu konfiguracji XOOPS SMTP Hosts możliwe jest określenie TLS lub SSL, a także portu.

Można to użyć do połączenia się z SMTP Gmaila: `tls://smtp.gmail.com:587`

Inny przykład używający SSL: `ssl://mail.example.com:465`

## Porady dotyczące rozwiązywania problemów

Czasami rzeczy nie przebiegają tak gładko, jak byśmy chcieli. Oto kilka sugestii i zasobów, które mogą Ci pomóc.

### Przejrzyj dokumentację dostawcy hostingu

Kiedy nawiążesz usługę hostingu z dostawcą, powinien on dostarczyć informacje o tym, jak uzyskać dostęp do serwerów poczty e-mail. Chcesz mieć to dostępne, kiedy konfigurujesz pocztę e-mail dla systemu XOOPS.

### XOOPS używa PHPMailera

XOOPS używa biblioteki [PHPMailer](https://github.com/PHPMailer/PHPMailer) do wysyłania e-maili. Sekcja [rozwiązywania problemów](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) w wiki oferuje kilka wglądów.
