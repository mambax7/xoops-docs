---
title: "Zarządzanie użytkownikami"
description: "Kompleksowy przewodnik administracji użytkownikami w XOOPS obejmujący tworzenie użytkowników, grupy użytkowników, uprawnienia i role użytkowników"
---

# Zarządzanie użytkownikami w XOOPS

Dowiedz się, jak tworzyć konta użytkowników, organizować użytkowników w grupy i zarządzać uprawnieniami w XOOPS.

## Przegląd zarządzania użytkownikami

XOOPS zapewnia kompleksowe zarządzanie użytkownikami dzięki:

```
Users > Accounts
├── Individual users
├── User profiles
├── Registration requests
└── Online users

Users > Groups
├── User groups/roles
├── Group permissions
└── Group membership

System > Permissions
├── Module access
├── Content access
├── Function permissions
└── Group capabilities
```

## Dostęp do zarządzania użytkownikami

### Nawigacja panelu administracyjnego

1. Zaloguj się do administracji: `http://your-domain.com/xoops/admin/`
2. Kliknij **Użytkownicy** na lewym pasku bocznym
3. Wybierz z opcji:
   - **Użytkownicy:** Zarządzaj poszczególnymi kontami
   - **Grupy:** Zarządzaj grupami użytkowników
   - **Użytkownicy online:** Zobaczaj aktualnie aktywnych użytkowników
   - **Żądania użytkownika:** Przetwarzaj żądania rejestracji

## Zrozumienie ról użytkownika

XOOPS zawiera predefiniowane role użytkownika:

| Grupa | Rola | Możliwości | Przypadek użytku |
|---|---|---|---|
| **Webmaster** | Administrator | Pełna kontrola witryny | Główni adminowie |
| **Administratorzy** | Administrator | Ograniczony dostęp administracyjny | Zaufani użytkownicy |
| **Moderatorzy** | Kontrola zawartości | Zatwierdź zawartość | Menedżerowie społeczności |
| **Edytorzy** | Tworzenie zawartości | Utwórz/edytuj zawartość | Pracownicy zawartości |
| **Zarejestrowani** | Członek | Post, komentarz, profil | Zwykli użytkownicy |
| **Anonimowy** | Odwiedzający | Tylko do odczytu | Niezalogowani użytkownicy |

## Tworzenie kont użytkownika

### Metoda 1: Admin tworzy użytkownika

**Krok 1: Dostęp do tworzenia użytkownika**

1. Przejdź do **Users > Users**
2. Kliknij **"Dodaj nowego użytkownika"** lub **"Utwórz użytkownika"**

**Krok 2: Wpisz informacje o użytkowniku**

Wypełnij szczegóły użytkownika:

```
Username: [4+ characters, letters/numbers/underscore only]
Example: john_smith

Email Address: [Valid email address]
Example: john@example.com

Password: [Strong password]
Example: MyStr0ng!Pass2025

Confirm Password: [Repeat password]
Example: MyStr0ng!Pass2025

Real Name: [User's full name]
Example: John Smith

URL: [Optional user website]
Example: https://johnsmith.com

Signature: [Optional forum signature]
Example: "Happy XOOPS user!"
```

**Krok 3: Skonfiguruj ustawienia użytkownika**

```
User Status: ☑ Active
             ☐ Inactive
             ☐ Pending Approval

User Groups:
☑ Registered Users
☐ Webmasters
☐ Admins
☐ Moderators
```

**Krok 4: Opcje dodatkowe**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Krok 5: Utwórz konto**

Kliknij **"Dodaj użytkownika"** lub **"Utwórz"**

Potwierdzenie:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Metoda 2: Samorejestracja użytkownika

Pozwól użytkownikom rejestrować się sami:

**Admin Panel > System > Preferences > User Settings**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Następnie:
1. Użytkownicy odwiedzają stronę rejestracji
2. Wpisz podstawowe informacje
3. Zweryfikuj e-mail lub czekaj na zatwierdzenie
4. Konto aktywowane

## Zarządzanie kontami użytkownika

### Wyświetl wszystkich użytkowników

**Lokalizacja:** Users > Users

Pokazuje listę użytkowników z:
- Nazwa użytkownika
- Adres e-mail
- Data rejestracji
- Ostatnie logowanie
- Status użytkownika (Aktywny/Nieaktywny)
- Członkostwo w grupie

### Edytuj konto użytkownika

1. Na liście użytkowników kliknij nazwę użytkownika
2. Modyfikuj dowolne pole:
   - Adres e-mail
   - Hasło
   - Imię i nazwisko
   - Grupy użytkowników
   - Status

3. Kliknij **"Zapisz"** lub **"Aktualizuj"**

### Zmień hasło użytkownika

1. Kliknij użytkownika na liście
2. Przewiń do sekcji "Zmień hasło"
3. Wpisz nowe hasło
4. Potwierdź hasło
5. Kliknij **"Zmień hasło"**

Użytkownik będzie używać nowego hasła przy następnym logowaniu.

### Dezaktywuj/Wstrzymaj użytkownika

Tymczasowo wyłącz konto bez usunięcia:

1. Kliknij użytkownika na liście
2. Ustaw **User Status** na "Nieaktywny"
3. Kliknij **"Zapisz"**

Użytkownik nie może się zalogować, gdy jest nieaktywny.

### Reaktywuj użytkownika

1. Kliknij użytkownika na liście
2. Ustaw **User Status** na "Aktywny"
3. Kliknij **"Zapisz"**

Użytkownik może się zalogować ponownie.

### Usuń konto użytkownika

Usuń użytkownika na stałe:

1. Kliknij użytkownika na liście
2. Przewiń do dołu
3. Kliknij **"Usuń użytkownika"**
4. Potwierdź: "Usunąć użytkownika i wszystkie dane?"
5. Kliknij **"Tak"**

**Ostrzeżenie:** Usunięcie jest trwałe!

### Wyświetl profil użytkownika

Zobacz szczegóły profilu użytkownika:

1. Kliknij nazwę użytkownika na liście użytkowników
2. Przejrzyj informacje profilowe:
   - Imię i nazwisko
   - Email
   - Strona internetowa
   - Data dołączenia
   - Ostatnie logowanie
   - Bio użytkownika
   - Awatar
   - Posty/wkłady

## Zrozumienie grup użytkowników

### Domyślne grupy użytkowników

XOOPS zawiera grupy domyślne:

| Grupa | Cel | Specjalny | Edytuj |
|---|---|---|---|
| **Anonimowy** | Niezalogowani użytkownicy | Stały | Nie |
| **Zarejestrowani użytkownicy** | Zwykli członkowie | Domyślnie | Tak |
| **Webmaster** | Administratorzy witryny | Admin | Tak |
| **Administratorzy** | Ograniczeni administratorzy | Admin | Tak |
| **Moderatorzy** | Moderatorzy zawartości | Niestandardowy | Tak |

### Utwórz grupę niestandardową

Utwórz grupę dla określonej roli:

**Lokalizacja:** Users > Groups

1. Kliknij **"Dodaj nową grupę"**
2. Wpisz szczegóły grupy:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Kliknij **"Utwórz grupę"**

### Zarządzaj członkostwem grupy

Przypisz użytkowników do grup:

**Opcja A: Z listy użytkowników**

1. Przejdź do **Users > Users**
2. Kliknij użytkownika
3. Zaznacz/odznacz grupy w sekcji "User Groups"
4. Kliknij **"Zapisz"**

**Opcja B: Z grup**

1. Przejdź do **Users > Groups**
2. Kliknij nazwę grupy
3. Wyświetl/edytuj listę członków
4. Dodaj lub usuń użytkowników
5. Kliknij **"Zapisz"**

### Edytuj właściwości grupy

Dostosuj ustawienia grupy:

1. Przejdź do **Users > Groups**
2. Kliknij nazwę grupy
3. Zmodyfikuj:
   - Nazwa grupy
   - Opis grupy
   - Wyświetl grupę (pokaż/ukryj)
   - Typ grupy
4. Kliknij **"Zapisz"**

## Uprawnienia użytkownika

### Zrozumienie uprawnień

Trzy poziomy uprawnień:

| Poziom | Zakres | Przykład |
|---|---|---|
| **Dostęp do modułu** | Może widzieć/używać moduł | Może uzyskać dostęp do modułu Forum |
| **Uprawnienia zawartości** | Może wyświetlić określoną zawartość | Może przeczytać opublikowane wiadomości |
| **Uprawnienia funkcji** | Może wykonać akcje | Może publikować komentarze |

### Konfiguruj dostęp do modułu

**Lokalizacja:** System > Permissions

Ogranicz, które grupy mogą uzyskać dostęp do każdego modułu:

```
Module: News

Admin Access:
☑ Webmasters
☑ Admins
☐ Moderators
☐ Registered Users
☐ Anonymous

User Access:
☐ Webmasters
☐ Admins
☑ Moderators
☑ Registered Users
☑ Anonymous
```

Kliknij **"Zapisz"** aby zastosować.

### Ustaw uprawnienia zawartości

Kontroluj dostęp do określonej zawartości:

Przykład - Artykuł wiadomości:
```
View Permission:
☑ All groups can read

Post Permission:
☑ Registered Users
☑ Content Editors
☐ Anonymous

Moderate Comments:
☑ Moderators required
```

### Najlepsze praktyki uprawnień

```
Public Content (News, Pages):
├── View: All groups
├── Post: Registered Users + Editors
└── Moderate: Admins + Moderators

Community (Forum, Comments):
├── View: All groups
├── Post: Registered Users
└── Moderate: Moderators + Admins

Admin Tools:
├── View: Webmasters + Admins only
├── Configure: Webmasters only
└── Delete: Webmasters only
```

## Zarządzanie rejestracją użytkownika

### Obsługuj żądania rejestracji

Jeśli "Zatwierdzanie administracyjne" jest włączone:

1. Przejdź do **Users > User Requests**
2. Wyświetl oczekujące rejestracje:
   - Nazwa użytkownika
   - Email
   - Data rejestracji
   - Status żądania

3. Dla każdego żądania:
   - Kliknij, aby przejrzeć
   - Kliknij **"Zatwierdź"**, aby aktywować
   - Kliknij **"Odrzuć"**, aby odmówić

### Wyślij e-mail rejestracyjny

Wyślij ponownie e-mail powitalny/weryfikacyjny:

1. Przejdź do **Users > Users**
2. Kliknij użytkownika
3. Kliknij **"Wyślij e-mail"** lub **"Wyślij ponownie weryfikację"**
4. E-mail wysłany do użytkownika

## Monitorowanie użytkowników online

### Wyświetl aktualnie zalogowanych użytkowników

Śledź aktywnych odwiedzających witrynę:

**Lokalizacja:** Users > Online Users

Pokazuje:
- Aktualnie zalogowani użytkownicy
- Liczba gości
- Czas ostatniej aktywności
- Adres IP
- Lokalizacja przeglądania

### Monitoruj aktywność użytkownika

Zrozumiej zachowanie użytkownika:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Dostosowywanie profilu użytkownika

### Włącz profile użytkownika

Konfiguruj opcje profilu użytkownika:

**Admin > System > Preferences > User Settings**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Pola profilu

Skonfiguruj, co użytkownicy mogą dodać do profili:

Przykładowe pola profilu:
- Imię i nazwisko
- URL strony internetowej
- Biografia
- Lokalizacja
- Awatar (zdjęcie)
- Podpis
- Zainteresowania
- Linki mediów społecznościowych

Dostosuj w ustawieniach modułu.

## Uwierzytelnianie użytkownika

### Włącz uwierzytelnianie dwuskładnikowe

Ulepszona opcja bezpieczeństwa (jeśli dostępna):

**Admin > Users > Settings**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Użytkownicy muszą zweryfikować drugą metodę.

### Zasady haseł

Wymuś silne hasła:

**Admin > System > Preferences > User Settings**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Próby logowania

Zapobiegaj atakom brute force:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Zarządzanie e-mailem użytkownika

### Wyślij zbiorcze e-maile do grupy

Wiadomość wielu użytkowników:

1. Przejdź do **Users > Users**
2. Wybierz wielu użytkowników (pola wyboru)
3. Kliknij **"Wyślij e-mail"**
4. Skomponuj wiadomość:
   - Temat
   - Treść wiadomości
   - Dołącz podpis
5. Kliknij **"Wyślij"**

### Ustawienia powiadomień e-mail

Skonfiguruj, jakie e-maile otrzymują użytkownicy:

**Admin > System > Preferences > Email Settings**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Statystyka użytkownika

### Wyświetl raporty użytkownika

Monitoruj metryki użytkownika:

**Admin > System > Dashboard**

```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```

### Śledzenie wzrostu użytkownika

Monitoruj trendy rejestracji:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Typowe zadania zarządzania użytkownikami

### Utwórz użytkownika administracyjnego

1. Utwórz nowego użytkownika (kroki powyżej)
2. Przypisz do grupy **Webmasters** lub **Admins**
3. Przyznaj uprawnienia w System > Permissions
4. Zweryfikuj, czy dostęp administracyjny działa

### Utwórz moderatora

1. Utwórz nowego użytkownika
2. Przypisz do grupy **Moderators**
3. Skonfiguruj uprawnienia do moderowania określonych modułów
4. Użytkownik może zatwierdzać zawartość, zarządzać komentarzami

### Konfiguruj edytorów zawartości

1. Utwórz grupę **Content Editors**
2. Utwórz użytkowników, przypisz do grupy
3. Przyznaj uprawnienia do:
   - Tworzenia/edycji stron
   - Tworzenia/edycji postów
   - Moderowania komentarzy
4. Ogranicz dostęp do panelu administracyjnego

### Zresetuj zapomniane hasło

Użytkownik zapomniał hasła:

1. Przejdź do **Users > Users**
2. Znajdź użytkownika
3. Kliknij na nazwę użytkownika
4. Kliknij **"Zresetuj hasło"** lub edytuj pole hasła
5. Ustaw tymczasowe hasło
6. Powiadom użytkownika (wyślij e-mail)
7. Użytkownik się loguje, zmienia hasło

### Import użytkowników zbiorczych

Importuj listę użytkowników (zaawansowane):

Wiele paneli hostingowych zapewnia narzędzia do:
1. Przygotowania pliku CSV z danymi użytkownika
2. Przesyłanie za pośrednictwem panelu administracyjnego
3. Tworzenie zbiorczych kont

Lub użyj skryptu niestandardowego/wtyczki do importu.

## Prywatność użytkownika

### Szanuj prywatność użytkownika

Najlepsze praktyki prywatności:

```
Do:
✓ Hide emails by default
✓ Let users choose visibility
✓ Protect against spam

Don't:
✗ Share private data
✗ Display without permission
✗ Use for marketing without consent
```

### Zgodność RODO

Jeśli obsługujesz użytkowników z UE:

1. Uzyskaj zgodę na zbieranie danych
2. Pozwól użytkownikom pobierać swoje dane
3. Zapewnij opcję usunięcia konta
4. Utrzymuj politykę prywatności
5. Zaloguj działania przetwarzania danych

## Rozwiązywanie problemów użytkownika

### Użytkownik nie może się zalogować

**Problem:** Użytkownik zapomniał hasła lub nie może uzyskać dostępu do konta

**Rozwiązanie:**
1. Zweryfikuj konto użytkownika to "Aktywne"
2. Zresetuj hasło:
   - Admin > Users > Znajdź użytkownika
   - Ustaw nowe tymczasowe hasło
   - Wyślij użytkownikowi za pośrednictwem e-mail
3. Wyczyść pliki cookie/pamięć podręczną użytkownika
4. Sprawdź, czy konto nie jest zablokowane

### Rejestracja użytkownika utknęła

**Problem:** Użytkownik nie może zakończyć rejestracji

**Rozwiązanie:**
1. Sprawdzaj, czy rejestracja jest dozwolona:
   - Admin > System > Preferences > User Settings
   - Włącz rejestrację
2. Sprawdzaj, czy ustawienia poczty e-mail działają
3. Jeśli wymagana weryfikacja e-mail:
   - Wyślij ponownie e-mail weryfikacyjny
   - Sprawdzaj folder spam
4. Obniż wymagania dotyczące hasła, jeśli są zbyt surowe

### Zduplikowane konta

**Problem:** Użytkownik ma wiele kont

**Rozwiązanie:**
1. Zidentyfikuj zduplikowane konta na liście użytkowników
2. Zachowaj główne konto
3. Scal dane jeśli możliwe
4. Usuń zduplikowane konta
5. Włącz "Zapobiegaj zduplikowanemu e-mailowi" w ustawieniach

## Lista kontrolna zarządzania użytkownikami

Do wstępnej konfiguracji:

- [ ] Ustaw typ rejestracji użytkownika (natychmiast/email/admin)
- [ ] Utwórz wymagane grupy użytkowników
- [ ] Skonfiguruj uprawnienia grupy
- [ ] Ustaw zasady haseł
- [ ] Włącz profile użytkownika
- [ ] Skonfiguruj powiadomienia e-mail
- [ ] Ustaw opcje avatara użytkownika
- [ ] Przetestuj proces rejestracji
- [ ] Utwórz konta testowe
- [ ] Zweryfikuj pracujące uprawnienia
- [ ] Udokumentuj strukturę grupy
- [ ] Zaplanuj onboarding użytkownika

## Następne kroki

Po skonfigurowaniu użytkowników:

1. Instaluj moduły, których potrzebują użytkownicy
2. Utwórz zawartość dla użytkowników
3. Zabezpiecz konta użytkowników
4. Poznaj więcej funkcji administracyjnych
5. Skonfiguruj ustawienia ogólnosystemowe

---

**Tags:** #users #groups #permissions #administration #access-control

**Artykuły pokrewne:**
- Admin-Panel-Overview
- Installing-Modules
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings
