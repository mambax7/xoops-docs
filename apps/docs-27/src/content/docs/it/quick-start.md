---
title: Avvio Rapido
description: Metti XOOPS 2.7 in esecuzione in meno di 5 minuti.
---

## Requisiti

| Componente  | Minimo                  | Consigliato   |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Server web | Apache 2.4 / Nginx 1.20 | Ultimo stabile |

## Download

Scarica l'ultima versione da [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Oppure clona direttamente
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Passaggi di Installazione

1. **Carica i file** nella root dei documenti del tuo server web (ad es. `public_html/`).
2. **Crea un database MySQL** e un utente con privilegi completi su di esso.
3. **Apri il tuo browser** e accedi al tuo dominio — l'installer XOOPS si avvia automaticamente.
4. **Segui la procedura guidata in 5 step** — configura i percorsi, crea le tabelle e imposta il tuo account admin.
5. **Elimina la cartella `install/`** quando richiesto. Questo è obbligatorio per la sicurezza.

## Verifica l'Installazione

Dopo l'installazione, visita:

- **Home page:** `https://yourdomain.com/`
- **Pannello admin:** `https://yourdomain.com/xoops_data/` *(percorso che hai scelto durante l'installazione)*

## Prossimi Passi

- [Guida Installazione Completa](./installation/) — configurazione del server, permessi, risoluzione problemi
- [Guida Moduli](./module-guide/introduction/) — crea il tuo primo modulo
- [Guida Temi](./theme-guide/introduction/) — crea o personalizza un tema
