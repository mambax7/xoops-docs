---
title: "Après la mise à niveau"
---

## Mettre à jour le module système

Après que tous les correctifs nécessaires aient été appliqués, sélectionnez _Continuer_ pour tout configurer afin de mettre à jour le module **système**. C'est une étape très importante et elle est nécessaire pour terminer correctement la mise à niveau.

![Mise à jour du système de module XOOPS](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Sélectionnez _Mettre à jour_ pour effectuer la mise à jour du module Système.

## Mettre à jour d'autres modules livrés par XOOPS

XOOPS est livré avec trois modules optionnels - pm (messagerie privée,) profil (profil utilisateur) et protecteur (Protector). Vous devez faire une mise à jour sur chacun de ces modules qui sont installés.

![Mise à jour d'autres modules XOOPS](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Mettre à jour d'autres modules

Il est probable qu'il y ait des mises à jour d'autres modules qui pourraient permettre aux modules de fonctionner mieux sous votre XOOPS maintenant mis à jour. Vous devez enquêter et appliquer les mises à jour de module appropriées.

## Vérifier les nouvelles préférences de renforcement des cookies

La mise à niveau XOOPS 2.7.0 ajoute deux nouvelles préférences qui contrôlent la façon dont les cookies de session sont émis :

* **`session_cookie_samesite`** — contrôle l'attribut SameSite du cookie. `Lax` est une valeur par défaut sûre pour la plupart des sites. Utilisez `Strict` pour une protection maximale si votre site ne dépend pas de la navigation inter-origines. `None` n'est approprié que si vous savez que vous en avez besoin.
* **`session_cookie_secure`** — quand activé, le cookie de session n'est envoyé que via les connexions HTTPS. Activez ceci si votre site s'exécute sur HTTPS.

Vous pouvez vérifier ces paramètres sous Options système → Préférences → Paramètres généraux.

## Valider les thèmes personnalisés

Si votre site utilise un thème personnalisé, parcourez le frontend et la zone d'administration pour confirmer que les pages se rendent correctement. La mise à niveau vers Smarty 4 peut affecter les modèles personnalisés même si l'analyse de pré-vol est passée. Si vous voyez des problèmes de rendu, revisitez [Dépannage](ustep-03.md).

## Nettoyer les fichiers d'installation et de mise à niveau

Pour des raisons de sécurité, supprimez ces répertoires de votre racine web une fois la mise à niveau confirmée fonctionnelle :

* `upgrade/` — le répertoire du flux de mise à niveau
* `install/` — s'il y a, comme `install/` ou comme un répertoire renommé `installremove*`

Laisser ceux-ci en place expose les scripts de mise à niveau et d'installation à quiconque peut atteindre votre site.

## Ouvrir votre site

Si vous avez suivi le conseil de _Éteindre votre site_, vous devez le remettre une fois que vous avez déterminé qu'il fonctionne correctement.
