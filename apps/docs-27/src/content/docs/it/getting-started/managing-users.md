---
title: "Gestione Utenti"
description: "Guida completa all'amministrazione degli utenti in XOOPS inclusa la creazione di utenti, gruppi di utenti, permessi e ruoli utenti"
---

# Gestione degli Utenti in XOOPS

Impara come creare account utente, organizzare gli utenti in gruppi e gestire i permessi in XOOPS.

## Panoramica Gestione Utenti

XOOPS fornisce una gestione completa degli utenti con:

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

## Accesso alla Gestione Utenti

### Navigazione Pannello Admin

1. Accedi a admin: `http://your-domain.com/xoops/admin/`
2. Clicca **Users** nella barra laterale sinistra
3. Seleziona dalle opzioni:
   - **Users:** Gestisci account individuali
   - **Groups:** Gestisci gruppi di utenti
   - **Online Users:** Vedi gli utenti attualmente attivi
   - **User Requests:** Elabora richieste di registrazione

## Comprensione dei Ruoli Utenti

XOOPS viene con ruoli utenti predefiniti:

| Gruppo | Ruolo | Capacità | Caso d'Uso |
|---|---|---|---|
| **Webmasters** | Amministratore | Controllo completo sito | Admin principali |
| **Admins** | Amministratore | Accesso admin limitato | Utenti affidabili |
| **Moderators** | Controllo contenuto | Approva contenuto | Manager comunità |
| **Editors** | Creazione contenuto | Crea/modifica contenuto | Staff contenuto |
| **Registered** | Membro | Pubblica, commenta, profilo | Utenti regolari |
| **Anonymous** | Visitatore | Sola lettura | Utenti non connessi |

## Creazione di Account Utenti

### Metodo 1: Admin Crea Utente

**Passo 1: Accedi a Creazione Utente**

1. Vai a **Users > Users**
2. Clicca **"Add New User"** o **"Create User"**

**Passo 2: Inserisci Informazioni Utente**

Compila i dettagli dell'utente:

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

**Passo 3: Configura Impostazioni Utente**

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

**Passo 4: Opzioni Aggiuntive**

```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```

**Passo 5: Crea Account**

Clicca **"Add User"** o **"Create"**

Conferma:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```

### Metodo 2: Auto-Registrazione Utente

Consenti agli utenti di auto-registrarsi:

**Admin Panel > System > Preferences > User Settings**

```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```

Quindi:
1. Gli utenti visitano la pagina di registrazione
2. Compilano le informazioni di base
3. Verificano l'email o aspettano l'approvazione
4. Account attivato

## Gestione degli Account Utenti

### Visualizza Tutti gli Utenti

**Posizione:** Users > Users

Mostra l'elenco degli utenti con:
- Username
- Indirizzo email
- Data di registrazione
- Ultimo login
- Stato utente (Attivo/Inattivo)
- Appartenenza al gruppo

### Modifica Account Utente

1. Nell'elenco degli utenti, clicca username
2. Modifica qualsiasi campo:
   - Indirizzo email
   - Password
   - Nome reale
   - Gruppi utenti
   - Stato

3. Clicca **"Save"** o **"Update"**

### Cambia Password Utente

1. Clicca l'utente nell'elenco
2. Scorri verso la sezione "Change Password"
3. Inserisci nuova password
4. Conferma password
5. Clicca **"Change Password"**

L'utente userà la nuova password al prossimo login.

### Disattiva/Sospendi Utente

Disabilita temporaneamente l'account senza eliminazione:

1. Clicca l'utente nell'elenco
2. Imposta **User Status** su "Inactive"
3. Clicca **"Save"**

L'utente non può accedere mentre inattivo.

### Riattiva Utente

1. Clicca l'utente nell'elenco
2. Imposta **User Status** su "Active"
3. Clicca **"Save"**

L'utente può accedere di nuovo.

### Elimina Account Utente

Rimuovi l'utente in modo permanente:

1. Clicca l'utente nell'elenco
2. Scorri verso il basso
3. Clicca **"Delete User"**
4. Conferma: "Delete user and all data?"
5. Clicca **"Yes"**

**Avviso:** L'eliminazione è permanente!

### Visualizza Profilo Utente

Vedi i dettagli del profilo utente:

1. Clicca username nell'elenco degli utenti
2. Rivedi le informazioni del profilo:
   - Nome reale
   - Email
   - Sito web
   - Data iscrizione
   - Ultimo login
   - Bio utente
   - Avatar
   - Post/contributi

## Comprensione dei Gruppi Utenti

### Gruppi Utenti Predefiniti

XOOPS include gruppi predefiniti:

| Gruppo | Scopo | Speciale | Modifica |
|---|---|---|---|
| **Anonymous** | Utenti non connessi | Fisso | No |
| **Registered Users** | Membri regolari | Predefinito | Sì |
| **Webmasters** | Amministratori sito | Admin | Sì |
| **Admins** | Admin limitati | Admin | Sì |
| **Moderators** | Moderatori contenuto | Personalizzato | Sì |

### Crea Gruppo Personalizzato

Crea un gruppo per un ruolo specifico:

**Posizione:** Users > Groups

1. Clicca **"Add New Group"**
2. Inserisci i dettagli del gruppo:

```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```

3. Clicca **"Create Group"**

### Gestisci Appartenenza al Gruppo

Assegna gli utenti ai gruppi:

**Opzione A: Dall'Elenco degli Utenti**

1. Vai a **Users > Users**
2. Clicca l'utente
3. Seleziona/deseleziona i gruppi nella sezione "User Groups"
4. Clicca **"Save"**

**Opzione B: Dai Gruppi**

1. Vai a **Users > Groups**
2. Clicca il nome del gruppo
3. Visualizza/modifica l'elenco dei membri
4. Aggiungi o rimuovi utenti
5. Clicca **"Save"**

### Modifica Proprietà Gruppo

Personalizza le impostazioni del gruppo:

1. Vai a **Users > Groups**
2. Clicca il nome del gruppo
3. Modifica:
   - Nome gruppo
   - Descrizione gruppo
   - Visualizza gruppo (mostra/nascondi)
   - Tipo gruppo
4. Clicca **"Save"**

## Permessi Utenti

### Comprensione dei Permessi

Tre livelli di permessi:

| Livello | Ambito | Esempio |
|---|---|---|
| **Module Access** | Può vedere/usare modulo | Può accedere al modulo Forum |
| **Content Permissions** | Può visualizzare contenuto specifico | Può leggere notizie pubblicate |
| **Function Permissions** | Può eseguire azioni | Può postare commenti |

### Configura Accesso Modulo

**Posizione:** System > Permissions

Limita quali gruppi possono accedere a ogni modulo:

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

Clicca **"Save"** per applicare.

### Imposta Permessi Contenuto

Controlla l'accesso a contenuti specifici:

Esempio - Articolo di notizie:
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

### Migliori Pratiche sui Permessi

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

## Gestione delle Richieste di Registrazione

### Gestisci Richieste di Registrazione

Se "Admin Approval" abilitato:

1. Vai a **Users > User Requests**
2. Visualizza registrazioni in sospeso:
   - Username
   - Email
   - Data di registrazione
   - Stato della richiesta

3. Per ogni richiesta:
   - Clicca per rivedere
   - Clicca **"Approve"** per attivare
   - Clicca **"Reject"** per negare

### Invia Email di Registrazione

Reinvia email di benvenuto/verifica:

1. Vai a **Users > Users**
2. Clicca l'utente
3. Clicca **"Send Email"** o **"Resend Verification"**
4. Email inviata all'utente

## Monitoraggio Utenti Online

### Visualizza Utenti Attualmente Online

Traccia i visitatori attivi del sito:

**Posizione:** Users > Online Users

Mostra:
- Utenti attualmente online
- Conteggio visitatori ospiti
- Ora dell'ultima attività
- Indirizzo IP
- Ubicazione di navigazione

### Monitora Attività Utenti

Comprendi il comportamento degli utenti:

```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```

## Personalizzazione Profilo Utente

### Abilita Profili Utenti

Configura le opzioni del profilo utente:

**Admin > System > Preferences > User Settings**

```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```

### Campi Profilo

Configura cosa gli utenti possono aggiungere ai profili:

Campi profilo di esempio:
- Nome reale
- URL sito web
- Biografia
- Ubicazione
- Avatar (immagine)
- Firma
- Interessi
- Link social media

Personalizza nelle impostazioni del modulo.

## Autenticazione Utenti

### Abilita Autenticazione a Due Fattori

Opzione di sicurezza migliorata (se disponibile):

**Admin > Users > Settings**

```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```

Gli utenti devono verificare con il metodo secondario.

### Politica Password

Applica password forti:

**Admin > System > Preferences > User Settings**

```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```

### Tentativi di Login

Previeni attacchi brute force:

```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```

## Gestione Email Utenti

### Invia Email di Massa al Gruppo

Messaggio per più utenti:

1. Vai a **Users > Users**
2. Seleziona più utenti (caselle di controllo)
3. Clicca **"Send Email"**
4. Componi il messaggio:
   - Oggetto
   - Corpo del messaggio
   - Includi firma
5. Clicca **"Send"**

### Impostazioni Notifiche Email

Configura quali email ricevono gli utenti:

**Admin > System > Preferences > Email Settings**

```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```

## Statistiche Utenti

### Visualizza Rapporti Utenti

Monitora le metriche degli utenti:

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

### Tracciamento della Crescita Utenti

Monitora i trend di registrazione:

```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```

## Compiti Comuni di Gestione Utenti

### Crea Utente Admin

1. Crea nuovo utente (passaggi precedenti)
2. Assegna al gruppo **Webmasters** o **Admins**
3. Concedi permessi in System > Permissions
4. Verifica che l'accesso admin funziona

### Crea Moderatore

1. Crea nuovo utente
2. Assegna al gruppo **Moderators**
3. Configura i permessi per moderare moduli specifici
4. L'utente può approvare contenuto, gestire commenti

### Configura Editor di Contenuto

1. Crea il gruppo **Content Editors**
2. Crea utenti, assegna al gruppo
3. Concedi permessi per:
   - Crea/modifica pagine
   - Crea/modifica post
   - Modera commenti
4. Limita l'accesso al pannello admin

### Reimposta Password Dimenticata

L'utente ha dimenticato la password:

1. Vai a **Users > Users**
2. Trova l'utente
3. Clicca username
4. Clicca **"Reset Password"** o modifica il campo password
5. Imposta password temporanea
6. Notifica l'utente (invia email)
7. L'utente accede, cambia password

### Importazione di Massa degli Utenti

Importa elenco di utenti (avanzato):

Molti pannelli di hosting forniscono strumenti per:
1. Preparare il file CSV con i dati degli utenti
2. Caricare tramite il pannello admin
3. Creare account in massa

O usa script/plugin personalizzato per i import.

## Privacy degli Utenti

### Rispetta la Privacy degli Utenti

Migliori pratiche sulla privacy:

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

### Conformità GDPR

Se servi utenti dell'UE:

1. Ottieni il consenso per la raccolta dati
2. Consenti agli utenti di scaricare i loro dati
3. Fornisci l'opzione di eliminare l'account
4. Mantieni l'informativa sulla privacy
5. Registra le attività di elaborazione dei dati

## Risoluzione Problemi Utenti

### Utente Non Può Accedere

**Problema:** L'utente ha dimenticato la password o non può accedere all'account

**Soluzione:**
1. Verifica che l'account dell'utente sia "Active"
2. Reimposta la password:
   - Admin > Users > Trova utente
   - Imposta nuova password temporanea
   - Invia all'utente via email
3. Svuota i cookie/cache dell'utente
4. Verifica che l'account non sia bloccato

### Registrazione Utente Bloccata

**Problema:** L'utente non può completare la registrazione

**Soluzione:**
1. Verifica che la registrazione sia consentita:
   - Admin > System > Preferences > User Settings
   - Abilita registrazione
2. Verifica che le impostazioni di email funzionino
3. Se è richiesta la verifica dell'email:
   - Rinvia l'email di verifica
   - Controlla la cartella di spam
4. Abbassa i requisiti della password se troppo rigorosi

### Account Duplicati

**Problema:** L'utente ha più account

**Soluzione:**
1. Identifica gli account duplicati nell'elenco degli utenti
2. Mantieni l'account primario
3. Merge i dati se possibile
4. Elimina gli account duplicati
5. Abilita "Prevent Duplicate Email" nelle impostazioni

## Lista di Controllo Gestione Utenti

Per la configurazione iniziale:

- [ ] Imposta il tipo di registrazione dell'utente (istantaneo/email/admin)
- [ ] Crea gruppi di utenti richiesti
- [ ] Configura i permessi del gruppo
- [ ] Imposta la politica della password
- [ ] Abilita i profili utenti
- [ ] Configura le notifiche via email
- [ ] Imposta le opzioni dell'avatar utente
- [ ] Test il processo di registrazione
- [ ] Crea account di test
- [ ] Verifica che i permessi funzionino
- [ ] Documenta la struttura del gruppo
- [ ] Pianifica l'onboarding degli utenti

## Prossimi Passi

Dopo la configurazione degli utenti:

1. Installa i moduli di cui gli utenti hanno bisogno
2. Crea contenuto per gli utenti
3. Proteggi gli account degli utenti
4. Esplora altre funzioni admin
5. Configura le impostazioni a livello di sistema

---

**Tag:** #users #groups #permissions #administration #access-control

**Articoli Correlati:**
- Admin-Panel-Overview
- Installing-Modules
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings
