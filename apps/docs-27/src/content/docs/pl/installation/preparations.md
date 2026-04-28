---
title: "phpinfo"
---

Ten krok jest opcjonalny, ale może łatwo zaoszczędzić ci wiele godzin frustracji.

Jako test przed instalacją systemu hostingu, bardzo mały, ale użyteczny skrypt PHP jest tworzony lokalnie i przesyłany do systemu docelowego.

Skrypt PHP ma tylko jedną linię:

```php
<?php phpinfo();
```

Korzystając z edytora tekstu, utwórz plik o nazwie _info.php_ z tą jedną linią.

Następnie prześlij ten plik do katalogu głównego serwera WWW.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Uzyskaj dostęp do skryptu otwierając go w przeglądarce, tj. otwierając `http://example.com/info.php`. Jeśli wszystko działa prawidłowo, powinieneś zobaczyć stronę wyglądającą tak:

![phpinfo() Example](/xoops-docs/2.7/img/installation/php-info.png)

Uwaga: niektóre usługi hostingowe mogą wyłączyć funkcję _phpinfo()_ ze względów bezpieczeństwa. Zwykle otrzymasz wiadomość o tym, jeśli tak się stanie.

Wynik skryptu może być przydatny do rozwiązywania problemów, więc rozważ zapisanie kopii.

Jeśli test działa, powinieneś być gotów do instalacji. Powinieneś usunąć skrypt _info.php_ i przystąpić do instalacji.

Jeśli test się nie powiedzie, przeanalizuj dlaczego! Jakikolwiek problem uniemożliwiający działanie tego prostego testu **będzie** uniemożliwiał działanie rzeczywistej instalacji.

