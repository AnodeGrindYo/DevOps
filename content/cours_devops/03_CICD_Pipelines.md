---
title: "Intégration et déploiement continus (CI/CD)"
description: "Comprendre les principes de l’intégration continue (CI) et du déploiement continu (CD), ainsi que les outils permettant de les automatiser."
category: "cours-devops"
---

### Module 3 : Intégration et déploiement continus (CI/CD)

---

#### **3.1. Les bases de CI/CD**

**Objectif :**
Comprendre les principes de l’intégration continue (CI) et du déploiement continu (CD), ainsi que les outils permettant de les automatiser.

---

#### **Cours : Concepts fondamentaux de CI/CD**

##### **1. Intégration continue (CI) :**
- **Définition :**
  L’intégration continue consiste à automatiser l’intégration du code des développeurs dans une branche commune (souvent `main` ou `develop`). Chaque modification est testée pour vérifier qu’elle fonctionne correctement.
- **Objectifs :**
  - Identifier rapidement les bugs.
  - Maintenir un code toujours fonctionnel.
- **Processus typique :**
  - Déclenchement par un push sur le dépôt.
  - Compilation et tests automatisés.

##### **2. Déploiement continu (CD) :**
- **Définition :**
  Le déploiement continu garantit que chaque version testée est automatiquement déployée sur un environnement (staging, production).
- **Objectifs :**
  - Réduire le temps entre le développement et la mise en production.
  - Automatiser les processus de déploiement pour éviter les erreurs humaines.
- **Pipeline typique :**
  - Tests d’intégration.
  - Construction d’artefacts (exemple : images Docker).
  - Déploiement automatisé.

##### **3. Outils populaires :**
- **GitHub Actions :** Automatisation des workflows depuis GitHub.
- **GitLab CI/CD :** Pipelines intégrés à GitLab.
- **Jenkins :** Plateforme CI/CD très personnalisable.
- **CircleCI et TravisCI :** Outils dédiés à la CI/CD dans le cloud.

---

#### **Exercice pratique 1 : Configurer un pipeline CI/CD basique avec GitHub Actions**

**Scénario :** Vous allez mettre en place un pipeline CI/CD pour TaskManagerPro qui :
- Exécute des tests unitaires.
- Construit une image Docker.
- Déploie automatiquement sur un environnement staging.

##### **Étape 1 : Créer un fichier de workflow GitHub Actions**
1. Dans le dépôt TaskManagerPro, créez le répertoire `.github/workflows/` :
   ```bash
   mkdir -p .github/workflows
   ```
2. Créez un fichier `ci-cd.yml` dans ce répertoire :
   ```bash
   nano .github/workflows/ci-cd.yml
   ```
3. Ajoutez le contenu suivant pour définir le pipeline :
   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - develop

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm install

         - name: Run tests
           run: npm test

     docker:
       runs-on: ubuntu-latest
       needs: build

       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Build Docker image
           run: |
             docker build -t taskmanagerpro .

         - name: Push Docker image
           run: |
             echo "Docker image pushed!"
             # Ajouter des commandes pour pousser sur un registre si besoin.

     deploy:
       runs-on: ubuntu-latest
       needs: docker

       steps:
         - name: Deploy to Staging
           run: |
             echo "Déploiement en cours..."
             # Ajouter les commandes de déploiement ici.
   ```

##### **Étape 2 : Tester le pipeline**
- Poussez vos modifications sur la branche `develop` :
  ```bash
  git add .github/workflows/ci-cd.yml
  git commit -m "Ajout du pipeline CI/CD"
  git push origin develop
  ```
- Vérifiez dans l’onglet **Actions** sur GitHub que le pipeline s’exécute correctement.

---

#### **3.2. Amélioration et déploiement automatisé**

##### **1. Ajouter des artefacts Docker :**
- Modifiez le workflow pour pousser l’image Docker dans un registre (par exemple, Docker Hub ou Amazon ECR).
- Exemple de modification dans l’étape `Push Docker image` :
  ```yaml
  - name: Log in to Docker Hub
    run: echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

  - name: Push Docker image
    run: |
      docker tag taskmanagerpro $DOCKER_USERNAME/taskmanagerpro:latest
      docker push $DOCKER_USERNAME/taskmanagerpro:latest
  ```

##### **2. Automatiser le déploiement sur un serveur :**
- Installez un outil comme **Ansible** ou utilisez des commandes SSH pour déployer automatiquement l’application.
- Exemple d’étape dans le workflow :
  ```yaml
  - name: Deploy to server
    run: |
      ssh user@server_ip "docker pull $DOCKER_USERNAME/taskmanagerpro:latest && docker run -d -p 80:3000 $DOCKER_USERNAME/taskmanagerpro:latest"
  ```

---

#### **Exercice pratique 2 : Pipeline complet pour TaskManagerPro**

1. **Ajoutez un déploiement sur staging :**
   - Configurez l’accès au serveur de staging.
   - Assurez-vous que Docker est installé et configuré sur le serveur.

2. **Automatisez les tests :**
   - Ajoutez des tests end-to-end à votre pipeline pour garantir la stabilité de l’application.

3. **Optimisez les notifications :**
   - Intégrez des notifications (par exemple, Slack ou e-mail) pour informer l’équipe des résultats du pipeline.

---

