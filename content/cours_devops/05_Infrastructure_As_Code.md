### Module 4 : Conteneurs et orchestration

---

#### **4.1. Docker : Comprendre et utiliser les conteneurs**

**Objectif :** Apprendre à créer et gérer des conteneurs Docker pour déployer des applications.

---

#### **Cours : Concepts fondamentaux de Docker**

##### **1. Qu'est-ce que Docker ?**
- **Définition :** Docker est un outil permettant de créer, d’exécuter et de gérer des conteneurs, des environnements isolés pour exécuter des applications.
- **Avantages :**
  - Portabilité : Fonctionne sur toutes les plateformes supportant Docker.
  - Isolation : Chaque conteneur a son propre environnement.
  - Scalabilité : Facilite la mise à l’échelle horizontale.

##### **2. Composants clés :**
- **Image :** Modèle statique pour créer des conteneurs.
- **Conteneur :** Instance exécutable d'une image.
- **Dockerfile :** Fichier de configuration pour créer des images Docker.
- **Registry :** Dépôt pour stocker et partager des images Docker (ex. Docker Hub).

##### **3. Commandes Docker essentielles :**
- **Images :**
  - Construire une image :
    ```bash
    docker build -t nom_image .
    ```
  - Lister les images disponibles :
    ```bash
    docker images
    ```
  - Supprimer une image :
    ```bash
    docker rmi nom_image
    ```

- **Conteneurs :**
  - Créer et démarrer un conteneur :
    ```bash
    docker run -d -p 8080:3000 nom_image
    ```
  - Lister les conteneurs en cours d’exécution :
    ```bash
    docker ps
    ```
  - Arrêter un conteneur :
    ```bash
    docker stop id_conteneur
    ```
  - Supprimer un conteneur :
    ```bash
    docker rm id_conteneur
    ```

---

#### **Exercice pratique 1 : Conteneuriser TaskManagerPro**

1. **Créer un Dockerfile pour le backend :**
   - Dans le répertoire `TaskManagerPro/backend`, créez un fichier nommé `Dockerfile` :
     ```dockerfile
     FROM node:18

     # Créer un répertoire de travail
     WORKDIR /app

     # Copier les fichiers package.json et package-lock.json
     COPY package*.json ./

     # Installer les dépendances
     RUN npm install

     # Copier le reste du code
     COPY . .

     # Exposer le port de l'application
     EXPOSE 3000

     # Commande par défaut
     CMD ["npm", "start"]
     ```

2. **Construire l’image Docker :**
   - Depuis le répertoire `TaskManagerPro/backend`, exécutez :
     ```bash
     docker build -t taskmanagerpro-backend .
     ```

3. **Démarrer un conteneur :**
   - Lancez un conteneur basé sur l’image construite :
     ```bash
     docker run -d -p 3000:3000 taskmanagerpro-backend
     ```
   - Accédez à l’application via `http://localhost:3000`.

---

#### **4.2. Kubernetes : Orchestration de conteneurs**

**Objectif :** Utiliser Kubernetes pour déployer et gérer des applications conteneurisées de manière scalable.

---

#### **Cours : Concepts clés de Kubernetes**

##### **1. Qu'est-ce que Kubernetes ?**
- **Définition :** Kubernetes (K8s) est une plateforme d'orchestration pour déployer, gérer et mettre à l’échelle des conteneurs.
- **Fonctionnalités :**
  - Gestion des pods (groupes de conteneurs).
  - Mise à l’échelle automatique.
  - Équilibrage de charge.
  - Reprise automatique après panne.

##### **2. Composants principaux :**
- **Pod :** L’unité de base de déploiement, regroupant un ou plusieurs conteneurs.
- **Service :** Point d’accès réseau pour un ensemble de pods.
- **Ingress :** Gère l’accès HTTP/HTTPS externe.
- **Deployment :** Contrôle les mises à jour des pods.
- **Namespace :** Permet de regrouper des ressources isolées.

---

#### **Exercice pratique 2 : Déployer TaskManagerPro sur un cluster Kubernetes**

1. **Installer Minikube :**
   - Installez Minikube pour créer un cluster Kubernetes local :
     ```bash
     sudo apt update && sudo apt install -y minikube
     ```
   - Lancez Minikube :
     ```bash
     minikube start
     ```

2. **Créer un fichier de déploiement :**
   - Dans le répertoire `TaskManagerPro`, créez un fichier `deployment.yml` :
     ```yaml
     apiVersion: apps/v1
     kind: Deployment
     metadata:
       name: taskmanagerpro-backend
     spec:
       replicas: 2
       selector:
         matchLabels:
           app: taskmanagerpro-backend
       template:
         metadata:
           labels:
             app: taskmanagerpro-backend
         spec:
           containers:
           - name: backend
             image: taskmanagerpro-backend
             ports:
             - containerPort: 3000
     ```

3. **Appliquer le déploiement :**
   - Déployez l’application sur Kubernetes :
     ```bash
     kubectl apply -f deployment.yml
     ```

4. **Exposer l’application :**
   - Créez un service pour rendre l’application accessible :
     ```yaml
     apiVersion: v1
     kind: Service
     metadata:
       name: backend-service
     spec:
       selector:
         app: taskmanagerpro-backend
       ports:
       - protocol: TCP
         port: 3000
         targetPort: 3000
       type: LoadBalancer
     ```
   - Appliquez le service :
     ```bash
     kubectl apply -f service.yml
     ```

5. **Tester l’application :**
   - Récupérez l’URL publique :
     ```bash
     minikube service backend-service --url
     ```
   - Accédez à l’application via l’URL affichée.

---


