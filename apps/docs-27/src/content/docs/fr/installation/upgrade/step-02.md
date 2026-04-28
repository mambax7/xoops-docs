---
title: "Exécution de la mise à niveau"
---

Avant d'exécuter le principal upgraded, assurez-vous d'avoir terminé la [Vérification de pré-vol](preflight.md). L'interface de mise à niveau nécessite que le pré-vol soit exécuté au moins une fois et vous y dirigera si vous ne l'avez pas.

Lancez la mise à niveau en pointant votre navigateur vers le répertoire _upgrade_ de votre site :

```text
http://example.com/upgrade/
```

Cela devrait afficher une page comme celle-ci :

![Démarrage de la mise à niveau XOOPS](/xoops-docs/2.7/img/installation/upgrade-01.png)

Sélectionnez le bouton "Continuer" pour continuer.

Chaque "Continuer" avance à travers un autre correctif. Continuez jusqu'à ce que tous les correctifs soient appliqués, et la page de mise à niveau du module système soit présentée.

![Correctif appliqué de mise à niveau XOOPS](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## Ce que la mise à niveau 2.5.11 → 2.7.0 applique

Lors de la mise à niveau de XOOPS 2.5.11 vers 2.7.0, le upgraded applique les correctifs suivants. Chacun est présenté comme une étape distincte dans l'assistant afin que vous puissiez confirmer ce qui est en cours de modification :

1. **Supprimer le PHPMailer groupé obsolète.** La copie groupée de PHPMailer à l'intérieur du module Protector est supprimée. PHPMailer est maintenant fourni via Composer dans `xoops_lib/vendor/`.
2. **Supprimer le dossier HTMLPurifier obsolète.** De même, l'ancien dossier HTMLPurifier à l'intérieur du module Protector est supprimé. HTMLPurifier est maintenant fourni via Composer.
3. **Créer la table `tokens`.** Une nouvelle table `tokens` est ajoutée pour le stockage générique de jetons scoped. La table a des colonnes pour l'id de jeton, l'id utilisateur, la portée, le hachage et les horodatages émis/expires/utilisés, et est utilisée par les fonctionnalités basées sur les jetons dans XOOPS 2.7.0.
4. **Élargir `bannerclient.passwd`.** La colonne `bannerclient.passwd` est élargie à `VARCHAR(255)` afin qu'elle puisse stocker les hachages de mot de passe modernes (bcrypt, argon2) au lieu de la colonne étroite héritée.
5. **Ajouter des préférences de cookie de session.** Deux nouvelles préférences sont insérées : `session_cookie_samesite` (pour l'attribut SameSite du cookie) et `session_cookie_secure` (pour forcer les cookies HTTPS uniquement). Consultez [Après la mise à niveau](ustep-04.md) pour savoir comment les vérifier après la fin de la mise à niveau.

Aucune de ces étapes ne touche à vos données de contenu. Vos utilisateurs, publications, images et données de module restent inchangés.

## Choisir une langue

La principale distribution XOOPS est livrée avec le support de l'anglais. Le support de paramètres régionaux supplémentaires est fourni par [les sites de support local XOOPS](https://xoops.org/modules/xoopspartners/). Ce support peut prendre la forme d'une distribution personnalisée ou de fichiers supplémentaires à ajouter à la distribution principale.

Les traductions XOOPS sont maintenues sur [transifex](https://www.transifex.com/xoops/public/)

Si votre upgraded XOOPS a un support de langue supplémentaire, vous pouvez changer la langue en sélectionnant l'icône de langue dans les menus supérieurs et en choisissant une langue différente.

![Langue de mise à niveau XOOPS](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)
