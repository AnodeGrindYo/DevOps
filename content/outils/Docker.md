---
title: "Docker"
description: "Docker est une plateforme de conteneurisation permettant de créer, déployer et exécuter des applications de manière isolée et portable."
category: "outils"
---

# Cours Complet sur Docker

## Introduction à Docker
Docker est une plateforme permettant de créer, déployer et exécuter des applications dans des conteneurs. Il facilite le développement, l’isolation et le déploiement des applications en supprimant les problèmes liés aux différences d'environnement.

## Concepts Clés

### 1. **Conteneurisation**
Un conteneur est une unité légère et portable qui exécute une application avec toutes ses dépendances.

### 2. **Images Docker**
Une image Docker est un modèle en lecture seule utilisé pour créer un conteneur. Elle contient tout ce dont une application a besoin pour s’exécuter.

### 3. **Dockerfile**
Un fichier `Dockerfile` est un script contenant une série d'instructions pour créer une image Docker.

### 4. **Registres d’Images**
Les images Docker sont stockées dans des registres comme Docker Hub ou des registres privés.

### 5. **Docker Engine**
Le moteur Docker est le service qui gère les conteneurs.

## Installation de Docker

### 1. **Installation sur Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. **Installation sur Windows et macOS**
Téléchargez et installez **Docker Desktop** depuis [docker.com](https://www.docker.com/).

## Commandes de Base

### 1. **Vérification de l’installation**
```bash
docker --version
docker info
```

### 2. **Gestion des Conteneurs**
```bash
docker run hello-world  # Lancer un conteneur test
docker ps  # Voir les conteneurs en cours d'exécution
docker ps -a  # Voir tous les conteneurs
```

### 3. **Gestion des Images**
```bash
docker images  # Lister les images locales
docker pull ubuntu  # Télécharger une image depuis Docker Hub
docker rmi ubuntu  # Supprimer une image
```

### 4. **Arrêter et Supprimer des Conteneurs**
```bash
docker stop <ID_du_conteneur>
docker rm <ID_du_conteneur>
```

## Création d’une Image Docker

### 1. **Exemple de `Dockerfile`**
```dockerfile
# Utiliser une image de base
FROM python:3.9

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY . /app

# Installer les dépendances
RUN pip install -r requirements.txt

# Exposer le port 5000
EXPOSE 5000

# Définir la commande par défaut
CMD ["python", "app.py"]
```

### 2. **Construction de l’image**
```bash
docker build -t mon_application .
```

### 3. **Exécution du Conteneur**
```bash
docker run -d -p 5000:5000 mon_application
```

## Docker Compose
Docker Compose permet de gérer plusieurs conteneurs à l’aide d’un fichier YAML.

### 1. **Exemple de `docker-compose.yml`**
```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
```

### 2. **Lancer l’Application avec Docker Compose**
```bash
docker-compose up -d
```

## Gestion des Volumes et Réseaux

### 1. **Utilisation des Volumes**
Les volumes permettent de persister les données des conteneurs.
```bash
docker volume create mon_volume
docker run -v mon_volume:/data ubuntu
```

### 2. **Utilisation des Réseaux**
Docker permet de créer des réseaux isolés.
```bash
docker network create mon_reseau
docker run --network=mon_reseau nginx
```

## Sécurité et Optimisation

### 1. **Meilleures Pratiques**
- Utiliser des images officielles et vérifiées.
- Minimiser la taille des images en utilisant des images de base légères (`alpine`).
- Gérer les permissions et éviter d'exécuter des conteneurs en mode root.

### 2. **Scan de Sécurité**
```bash
docker scan mon_application
```
