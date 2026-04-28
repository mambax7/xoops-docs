---
title: "Configurer le courrier électronique"
---

![Configuration du courrier électronique XOOPS](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS dépend du courrier électronique pour de nombreuses interactions utilisateur critiques, comme la validation d'un enregistrement ou la réinitialisation d'un mot de passe. Il est donc important qu'il soit configuré correctement.

La configuration de la messagerie du site peut être très simple dans certains cas et frustrante dans d'autres.

Voici quelques conseils pour assurer le succès de votre configuration.

## Méthode de livraison du courrier électronique

Cette section de la configuration a 4 valeurs possibles

* **Mail() PHP** - le moyen le plus simple, s'il est disponible. Dépend du programme _sendmail_ du système.
* **sendmail** - Une option de premier ordre, mais souvent visée par le SPAM en exploitant les faiblesses d'autres logiciels.
* **SMTP** - Le protocole SMTP (Simple Mail Transfer Protocol) n'est généralement pas disponible dans les nouveaux comptes d'hébergement en raison des préoccupations de sécurité et du potentiel d'abus. Il a été largement remplacé par SMTP Auth.
* **SMTP Auth** - SMTP avec autorisation est généralement préféré au SMTP simple. Dans ce cas, XOOPS se connecte directement au serveur de messagerie de manière plus sécurisée.

## Hôtes SMTP

Si vous devez utiliser SMTP, avec ou sans "Auth", vous devrez spécifier un nom de serveur ici. Ce nom peut être un simple nom d'hôte ou une adresse IP, ou il peut inclure des informations supplémentaires de port et de protocole. Le cas le plus simple serait `localhost` pour un serveur SMTP (sans auth) exécuté sur la même machine que le serveur Web.

Le nom d'utilisateur SMTP et le mot de passe SMTP sont toujours requis lors de l'utilisation de SMTP Auth. Il est possible de spécifier TLS ou SSL, ainsi qu'un port dans le champ de configuration XOOPS des hôtes SMTP.

Ceci pourrait être utilisé pour se connecter à Gmail SMTP : `tls://smtp.gmail.com:587`

Un autre exemple utilisant SSL : `ssl://mail.example.com:465`

## Conseils pour le dépannage

Parfois, les choses ne se passent pas aussi bien que nous l'espérions. Voici quelques suggestions et ressources qui pourraient vous aider.

### Vérifiez la documentation de votre fournisseur d'hébergement

Lorsque vous établissez un service d'hébergement avec un fournisseur, celui-ci doit fournir des informations sur la façon d'accéder aux serveurs de messagerie. Vous voudrez avoir cela disponible lorsque vous configurez le courrier électronique pour votre système XOOPS.

### XOOPS utilise PHPMailer

XOOPS utilise la bibliothèque [PHPMailer](https://github.com/PHPMailer/PHPMailer) pour envoyer du courrier électronique. La section [dépannage](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) du wiki offre quelques aperçus.
