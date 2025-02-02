---
title: "Podman"
description: "Podman est un moteur de conteneurs open-source conçu pour exécuter, gérer et déployer des conteneurs sans nécessiter de daemon en arrière-plan. Contrairement à Docker, Podman ne fonctionne pas en tant que service root unique et permet l'exécution de conteneurs sans privilèges root, améliorant ainsi la sécurité."
category: "outils"
---

# Podman

## Introduction à Podman
Podman est un moteur de conteneurs open-source conçu pour exécuter, gérer et déployer des conteneurs sans nécessiter de daemon en arrière-plan. Contrairement à Docker, Podman ne fonctionne pas en tant que service root unique et permet l'exécution de conteneurs sans privilèges root, améliorant ainsi la sécurité.

### Pourquoi utiliser Podman ?
- **Sans daemon** : Contrairement à Docker, Podman n'a pas besoin d'un démon en arrière-plan.
- **Mode rootless** : Il permet d'exécuter des conteneurs sans privilèges administratifs.
- **Compatibilité avec Docker** : Il utilise les mêmes images et commandes CLI que Docker.
- **Meilleure intégration avec systemd** : Il facilite le déploiement et la gestion des conteneurs avec systemd.
- **Sécurité accrue** : Moins de surface d'attaque due à l'absence de daemon.

## Installation de Podman

### Sur Linux
Podman est disponible dans les dépôts officiels de nombreuses distributions :

#### Ubuntu/Debian
```sh
sudo apt update
sudo apt install -y podman
```

#### Fedora
```sh
sudo dnf install -y podman
```

#### Arch Linux
```sh
sudo pacman -S podman
```

#### CentOS/RHEL
```sh
sudo yum install -y podman
```

### Sur macOS
Podman est disponible via Homebrew :
```sh
brew install podman
```

### Sur Windows
Podman peut être installé via Chocolatey ou un exécutable.
```sh
choco install podman
```

## Commandes de base

### Vérification de l'installation
```sh
podman --version
```

### Tirer une image
```sh
podman pull nginx
```

### Lister les images
```sh
podman images
```

### Exécuter un conteneur
```sh
podman run -d --name mon-nginx -p 8080:80 nginx
```

### Lister les conteneurs
```sh
podman ps
```

### Arrêter et supprimer un conteneur
```sh
podman stop mon-nginx
podman rm mon-nginx
```

### Supprimer une image
```sh
podman rmi nginx
```

## Gestion avancée

### Exécution rootless
Podman permet d’exécuter des conteneurs en mode rootless (sans droits administrateurs) :
```sh
podman run -it --rm alpine sh
```

### Création et gestion de pods
Podman permet de regrouper plusieurs conteneurs dans un pod, simulant ainsi Kubernetes :
```sh
podman pod create --name mon-pod -p 8080:80
podman run -dt --pod mon-pod nginx
```

### Volumes et persistance des données
Créer un volume nommé :
```sh
podman volume create mon-volume
```
Exécuter un conteneur en utilisant un volume :
```sh
podman run -d -v mon-volume:/data --name mon-conteneur nginx
```

### Utilisation avec systemd
Podman facilite l'intégration avec systemd pour exécuter des conteneurs en tant que services :
```sh
podman generate systemd --name mon-nginx > /etc/systemd/system/mon-nginx.service
systemctl enable --now mon-nginx
```

## Comparaison avec Docker
| Fonctionnalité       | Docker        | Podman       |
|---------------------|--------------|-------------|
| Daemon             | Oui          | Non         |
| Rootless           | Expérimental | Oui         |
| Commandes identiques | Oui          | Oui         |
| Compatibilité OCI   | Oui          | Oui         |
| Pods intégrés      | Non          | Oui         |

## En résumé
Podman est une alternative puissante et sécurisée à Docker, particulièrement adaptée aux environnements nécessitant une meilleure gestion des permissions et une intégration avec systemd. Grâce à sa compatibilité avec les commandes Docker, il offre une transition facile pour les utilisateurs souhaitant adopter une approche plus sécurisée et modulaire de la gestion des conteneurs.

