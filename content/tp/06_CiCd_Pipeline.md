---
title: "06 CI/CD Pipelines"
description: ""
category: "tp"
---

# 6. Mise en place d'un pipeline CI/CD

## 6.1 Objectif
L'objectif de cette section est de **mettre en place un pipeline CI/CD** permettant d'automatiser l'intégration, les tests, la construction de l'image Docker et le déploiement sur Kubernetes.

## 6.2 Technologies utilisées
- **GitHub Actions / GitLab CI / Jenkins / ArgoCD** : Pour l'automatisation des pipelines CI/CD.
- **Docker** : Conteneurisation de l'application.
- **Kubernetes** : Déploiement et orchestration.
- **Helm** : Gestion des déploiements Kubernetes.
- **Prometheus & Grafana** : Surveillance des performances après déploiement.

## 6.3 Étapes du pipeline CI/CD

### 6.3.1 Déclenchement du pipeline
Le pipeline est déclenché automatiquement lors de :
- Un **push** sur la branche principale (`main` ou `master`).
- Une **création de pull request**.
- Un **tagging** pour les versions.

### 6.3.2 Étape 1 : Tests unitaires et linting
Avant de construire l'image, il est essentiel de **vérifier la qualité du code**.

#### Exemple de script GitHub Actions pour exécuter les tests :
```yaml
name: CI Pipeline
on:
  push:
    branches:
      - main
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm test
```

### 6.3.3 Étape 2 : Construction et publication de l’image Docker
Si les tests passent, on construit et publie l’image Docker dans un **registre Docker**.

#### Dockerfile utilisé pour la construction
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Ajout de l’étape dans le pipeline CI/CD
```yaml
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Log in to Docker Hub
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
      
      - name: Build Docker image
        run: |
          docker build -t myrepo/myapp:${{ github.sha }} .
          docker tag myrepo/myapp:${{ github.sha }} myrepo/myapp:latest
      
      - name: Push Docker image
        run: |
          docker push myrepo/myapp:${{ github.sha }}
          docker push myrepo/myapp:latest
```

### 6.3.4 Étape 3 : Déploiement sur Kubernetes
Après la construction de l’image, elle est déployée sur un **cluster Kubernetes**.

#### Exemple de `deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myrepo/myapp:latest
        ports:
        - containerPort: 3000
```

#### Ajout de l’étape de déploiement dans le pipeline CI/CD
```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" > kubeconfig.yaml
          export KUBECONFIG=kubeconfig.yaml
      
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f deployment.yaml
          kubectl set image deployment/myapp-deployment myapp=myrepo/myapp:${{ github.sha }}
```

### 6.3.5 Étape 4 : Surveillance du déploiement
Une fois le déploiement terminé, nous utilisons **Prometheus et Grafana** pour surveiller les performances.

#### Vérification de l'état des pods et des services
```bash
kubectl get pods
kubectl get services
```

#### Affichage des logs de l’application
```bash
kubectl logs -f myapp-pod
```

## 6.4 Gestion des rollback et versioning
Si une nouvelle version introduit des bugs, il est possible de **revenir à une version précédente**.

### 6.4.1 Vérification de l’historique des déploiements
```bash
kubectl rollout history deployment myapp-deployment
```

### 6.4.2 Annulation d’un déploiement
```bash
kubectl rollout undo deployment myapp-deployment
```

## 6.5 Améliorations possibles
- Utilisation de **Helm** pour simplifier la gestion des déploiements.
- Mise en place d’**ArgoCD** pour une approche GitOps.
- Ajout de **tests de charge** avec K6 ou JMeter.
- Automatisation des alertes en cas de défaillance via **Prometheus Alertmanager**.

## 6.6 Conclusion
Grâce à ce pipeline CI/CD, chaque modification du code est automatiquement **testée, construite, publiée et déployée** en production sans intervention manuelle. Cela assure un déploiement rapide, fiable et sécurisé.