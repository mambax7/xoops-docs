---
title: "Annexe 3: Traduire XOOPS dans une Langue Locale"
---

XOOPS 2.7.0 ne contient que des fichiers de langue anglaise. Les traductions dans d'autres langues sont maintenues par la communauté et distribuées via GitHub et les différents sites locaux de support XOOPS.

## Où trouver les traductions existantes

- **GitHub** — les traductions communautaires sont de plus en plus publiées en tant que référentiels séparés sous [l'organisation XOOPS](https://github.com/XOOPS) et sur les comptes des contributeurs individuels. Recherchez sur GitHub `xoops-language-<your-language>` ou parcourez l'organisation XOOPS pour les packages actuels.
- **Sites de support XOOPS locaux** — de nombreuses communautés XOOPS régionales publient des traductions sur leurs propres sites. Visitez [https://xoops.org](https://xoops.org) et suivez les liens vers les communautés locales.
- **Traductions de modules** — les traductions pour les modules communautaires individuels résident généralement à côté du module lui-même dans l'organisation GitHub `XoopsModules25x` (le `25x` dans le nom est historique ; les modules là-bas sont maintenus pour XOOPS 2.5.x et 2.7.x).

Si une traduction pour votre langue existe déjà, déposez les répertoires de langue dans votre installation XOOPS (voir "Comment installer une traduction" ci-dessous).

## Ce qui doit être traduit

XOOPS 2.7.0 conserve les fichiers de langue à côté du code qui les consomme. Une traduction complète couvre tous ces emplacements :

- **Cœur** — `htdocs/language/english/` — constantes à l'échelle du site utilisées par chaque page (connexion, erreurs courantes, dates, modèles de courrier, etc.).
- **Installateur** — `htdocs/install/language/english/` — chaînes affichées par l'assistant d'installation. Traduisez-les *avant* d'exécuter l'installateur si vous souhaitez une expérience d'installation localisée.
- **Module système** — `htdocs/modules/system/language/english/` — de loin le plus grand ensemble ; couvre l'ensemble du Panneau de Contrôle admin.
- **Modules fournis** — chacun de `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` et `htdocs/modules/debugbar/language/english/`.
- **Thèmes** — une poignée de thèmes contiennent leurs propres fichiers de langue ; vérifiez `htdocs/themes/<theme>/language/` s'il existe.

Une traduction "core only" est l'unité utile minimale et correspond aux deux premiers points ci-dessus.

## Comment traduire

1. Copiez le répertoire `english/` à côté de lui et renommez la copie dans votre langue. Le nom du répertoire doit être le nom anglais minuscule de la langue (`spanish`, `german`, `french`, `japanese`, `arabic`, etc.).

   ```
   htdocs/language/english/    →    htdocs/language/spanish/
   ```

2. Ouvrez chaque fichier `.php` dans le nouveau répertoire et traduisez les **valeurs de chaîne** à l'intérieur des appels `define()`. Ne modifiez **pas** les noms de constantes — ils sont référencés depuis le code PHP dans le cœur.

   ```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   ```

3. **Enregistrez chaque fichier en UTF-8 *sans* BOM.** XOOPS 2.7.0 utilise `utf8mb4` de bout en bout (base de données, sessions, sortie) et rejette les fichiers avec une marque d'ordre des octets. Dans Notepad++, c'est l'option **"UTF-8"**, *pas* "UTF-8-BOM". Dans VS Code, c'est le paramètre par défaut ; confirmez simplement l'encodage dans la barre d'état.

4. Mettez à jour les métadonnées de langue et d'ensemble de caractères en haut de chaque fichier pour qu'elles correspondent à votre langue :

   ```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   ```

   `_LANGCODE` doit être le code [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) de votre langue. `_CHARSET` est toujours `UTF-8` dans XOOPS 2.7.0 — il n'y a plus de variante ISO-8859-1.

5. Répétez pour l'installateur, le module Système et tous les modules fournis dont vous avez besoin.

## Comment installer une traduction

Si vous avez obtenu une traduction terminée sous la forme d'une arborescence de répertoires :

1. Copiez chaque répertoire `<language>/` dans le parent `language/english/` correspondant dans votre installation XOOPS. Par exemple, copiez `language/spanish/` dans `htdocs/language/`, `install/language/spanish/` dans `htdocs/install/language/`, et ainsi de suite.
2. Assurez-vous que la propriété du fichier et les permissions sont lisibles par le serveur web.
3. Soit sélectionnez la nouvelle langue au moment de l'installation (l'assistant analyse `htdocs/language/` pour les langues disponibles), soit, sur un site existant, modifiez la langue dans **Admin → Système → Préférences → Paramètres Généraux**.

## Partager votre traduction en retour

Veuillez contribuer votre traduction à la communauté.

1. Créez un référentiel GitHub (ou forkez un référentiel de langue existant s'il en existe un pour votre langue).
2. Utilisez un nom clair tel que `xoops-language-<language-code>` (par exemple `xoops-language-es`, `xoops-language-pt-br`).
3. Reflétez la structure du répertoire XOOPS à l'intérieur de votre référentiel afin que les fichiers s'alignent avec l'endroit où ils sont copiés :

   ```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   ```

4. Incluez un `README.md` documentant :
   - Nom de la langue et code ISO
   - Compatibilité avec la version XOOPS (par exemple `XOOPS 2.7.0+`)
   - Traducteur et crédits
   - Si la traduction couvre uniquement le cœur ou les modules fournis
5. Ouvrez une demande de tirage contre le référentiel de module/cœur approprié sur GitHub ou publiez une annonce sur [https://xoops.org](https://xoops.org) afin que la communauté puisse la trouver.

> **Remarque**
>
> Si votre langue nécessite des modifications du cœur pour la date ou le formatage du calendrier, incluez également ces modifications dans le package. Les langues avec des scripts de droite à gauche (Arabe, Hébreu, Persan, Ourdou) fonctionnent prêtes à l'emploi dans XOOPS 2.7.0 — le support RTL a été ajouté dans cette version et les thèmes individuels le reprennent automatiquement.
