---
title: "04 Conteneurisation de l’application avec Docker"
description: ""
category: "tp"
---

# 4. Conteneurisation de l’application avec Docker

## 4.1 Objectif
L'objectif de cette étape est de **conteneuriser l'application** afin de la rendre **portable, modulaire et facilement déployable** dans différents environnements. Docker permet d'encapsuler l'application et ses dépendances dans un conteneur léger, garantissant un fonctionnement identique quelle que soit la plateforme.

## 4.2 Présentation de Docker
**Docker** est une plateforme de conteneurisation permettant d'exécuter des applications de manière isolée à l'aide de conteneurs. Les principaux composants sont :
- **Dockerfile** : Décrit comment construire une image Docker.
- **Image Docker** : Instantané du système qui sert de base aux conteneurs.
- **Conteneur** : Instance en cours d'exécution d'une image Docker.
- **Docker Compose** : Outil permettant d'orchestrer plusieurs conteneurs.

## 4.3 Structure du projet Docker
Un projet Docker typique est organisé comme suit :
```
app/
│── Dockerfile      # Définition de l'image Docker
│── docker-compose.yml  # Orchestration multi-conteneurs
│── src/           # Code source de l'application
│── .dockerignore  # Exclusions lors de la création de l'image
```

## 4.4 Écriture du Dockerfile
Le **Dockerfile** définit comment l'image de l'application est construite.

### 4.4.1 Dockerfile pour une application Node.js
```dockerfile
# Étape 1 : Utilisation d'une image de base légère
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package*.json ./

# Installation des dépendances
RUN npm install --production

# Copie du code source
COPY . .

# Exposition du port d'écoute
EXPOSE 3000

# Commande de lancement de l'application
CMD ["node", "server.js"]
```

### 4.4.2 Dockerfile pour une application Python (Flask)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 4.5 Création et test de l’image Docker
### 4.5.1 Construction de l’image
On génère l’image Docker avec la commande suivante :
```bash
docker build -t myapp:latest .
```

### 4.5.2 Exécution du conteneur localement
Une fois l’image construite, on peut exécuter un conteneur basé sur cette image :
```bash
docker run -p 3000:3000 myapp:latest
```

### 4.5.3 Vérification des conteneurs en cours d’exécution
```bash
docker ps
```

## 4.6 Utilisation de Docker Compose pour orchestrer plusieurs services
Si l'application nécessite plusieurs services (ex. : base de données, backend, frontend), on utilise **Docker Compose**.

### 4.6.1 Exemple de `docker-compose.yml`
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### 4.6.2 Démarrage des services
```bash
docker-compose up -d
```

### 4.6.3 Vérification des logs des services
```bash
docker-compose logs -f app
```

## 4.7 Optimisation de l’image Docker
### 4.7.1 Utilisation d’un fichier `.dockerignore`
Un fichier `.dockerignore` permet d’exclure certains fichiers inutiles :
```
node_modules
logs
.env
```

### 4.7.2 Minimisation de la taille de l’image
- **Utiliser des images de base légères** (`alpine`, `slim`).
- **Multi-stage builds** pour éviter d'inclure des fichiers inutiles dans l’image finale.

### 4.7.3 Sécurisation de l’image
- **Exécuter l’application avec un utilisateur non root**
```dockerfile
RUN useradd -m appuser
USER appuser
```

## 4.8 Stockage et partage de l’image Docker
### 4.8.1 Connexion à un registre Docker (Docker Hub, AWS ECR, GitHub Container Registry)
```bash
docker login -u myusername -p mypassword
```

### 4.8.2 Pousser l’image vers un registre
```bash
docker tag myapp:latest myusername/myapp:latest
docker push myusername/myapp:latest
```

## 4.9 Conclusion
Grâce à Docker, l’application devient **portable, isolée et facilement déployable** sur n’importe quel environnement. Elle pourra ensuite être orchestrée avec **Kubernetes** pour gérer sa mise à l’échelle et sa haute disponibilité.