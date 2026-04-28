---
title: "Konfiguracja bazy danych"
---

Ta strona zbiera informacje o bazie danych, którą będzie używać XOOPS.

Po wpisaniu żądanych informacji i poprawieniu wszelkich problemów kliknij przycisk "Kontynuuj", aby przejść dalej.

![XOOPS Installer Database Configuration](/xoops-docs/2.7/img/installation/installer-06.png)

## Dane zebrane w tym kroku

### Baza danych

#### Nazwa bazy danych

Nazwa bazy danych na hoście, którą powinno używać XOOPS. Użytkownik bazy danych wprowadzony w poprzednim kroku powinien mieć wszystkie uprawnienia do tej bazy danych. Instalator spróbuje utworzyć tę bazę danych, jeśli nie istnieje.

#### Prefiks tabeli

Ten prefiks zostanie dodany do nazw wszystkich nowych tabel tworzonych przez XOOPS. Pomaga to uniknąć konfliktów nazw, jeśli baza danych jest współdzielona z innymi aplikacjami. Unikalny prefiks sprawia również, że trudniej jest zgadnąć nazwy tabel, co ma korzyści dla bezpieczeństwa. Jeśli nie jesteś pewny, po prostu zachowaj domyślne.

#### Zestaw znaków bazy danych

Instalator domyślnie ustawia `utf8mb4`, które obsługuje pełny zakres Unicode, w tym emoji i znaki uzupełniające. Możesz wybrać inny zestaw znaków, ale `utf8mb4` jest zalecany dla praktycznie wszystkich języków i lokalizacji i powinien pozostać niezmieniony, chyba że masz szczególny powód, aby go zmienić.

#### Kolacja bazy danych

Pole kolacji jest domyślnie pozostawiane puste. Gdy jest puste, MySQL stosuje domyślną kolację dla wybranego zestawu znaków (dla `utf8mb4` jest to zwykle `utf8mb4_general_ci` lub `utf8mb4_0900_ai_ci`, w zależności od wersji MySQL). Jeśli potrzebujesz określoną kolację — na przykład, aby dopasować istniejącą bazę danych — wybierz ją tutaj. W przeciwnym razie pozostawienie pola pustego jest zalecanym wyborem.

