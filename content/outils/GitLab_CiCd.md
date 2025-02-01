# Cours Complet sur GitLab CI/CD

## Introduction à GitLab CI/CD

GitLab CI/CD est un outil d'intégration continue (CI) et de déploiement continu (CD) intégré à GitLab. Il permet d'automatiser les processus de test, de build et de déploiement des applications à l'aide de pipelines définis dans un fichier `.gitlab-ci.yml`.

## Concepts Clés

### 1. **Pipeline**
Un pipeline est un ensemble de tâches automatisées qui s'exécutent suite à un événement (push, merge request, etc.). Un pipeline peut contenir plusieurs **stages**.

### 2. **Stages**
Les stages sont des étapes du pipeline, exécutées séquentiellement. Par exemple :
- **build** : Compilation du code source
- **test** : Exécution des tests unitaires et d'intégration
- **deploy** : Déploiement de l'application

### 3. **Jobs**
Les jobs sont des tâches exécutées dans un stage donné. Par exemple :
- Un job `test` dans le stage `test` exécute `pytest`.
- Un job `deploy` dans le stage `deploy` pousse l'application sur un serveur.

### 4. **Runners**
Les runners sont des agents exécutant les jobs. Il existe plusieurs types de runners :
- **Shared runners** : hébergés par GitLab
- **Group runners** : spécifiques à un groupe de projets
- **Project runners** : spécifiques à un seul projet

## Configuration du pipeline avec `.gitlab-ci.yml`
Le fichier `.gitlab-ci.yml` définit la configuration du pipeline.

### 1. **Structure de base**
```yaml
stages:
  - build
  - test
  - deploy

job_build:
  stage: build
  script:
    - echo "Building the application"

job_test:
  stage: test
  script:
    - echo "Running tests"

job_deploy:
  stage: deploy
  script:
    - echo "Deploying the application"
```

### 2. **Définition des Environnements**
On peut configurer différents environnements (staging, production) :
```yaml
stages:
  - test
  - deploy

test:
  stage: test
  script:
    - echo "Running tests"

deploy_production:
  stage: deploy
  environment: production
  script:
    - echo "Deploying to production"
```

### 3. **Utilisation des variables d'environnement**
GitLab permet l'utilisation de variables d'environnement définies dans les settings du projet.
```yaml
variables:
  APP_ENV: production

deploy:
  stage: deploy
  script:
    - echo "Deploying in $APP_ENV mode"
```

### 4. **Utilisation d'images Docker**
On peut exécuter des jobs dans des containers Docker spécifiques.
```yaml
image: python:3.9

stages:
  - test

test:
  stage: test
  script:
    - python --version
    - pip install -r requirements.txt
    - pytest
```

### 5. **Conditions et règles d'exécution**
On peut définir des règles pour exécuter les jobs uniquement dans certaines conditions.
```yaml
deploy:
  stage: deploy
  script:
    - echo "Deploying..."
  only:
    - main
```

### 6. **Déploiement via SSH**
Pour déployer sur un serveur distant via SSH :
```yaml
stages:
  - deploy

deploy:
  stage: deploy
  script:
    - ssh user@server "cd /app && git pull"
  only:
    - main
```

## Exécution et Suivi des Pipelines

1. **Visualiser les pipelines**
   - Accédez à **CI/CD > Pipelines** dans GitLab pour voir l'état des pipelines.

2. **Logs des jobs**
   - Cliquez sur un job pour afficher les logs d'exécution.

3. **Re-lancer un pipeline**
   - Possibilité de relancer un pipeline en cas d'échec.

## En résumé
GitLab CI/CD permet d'automatiser l'intégration et le déploiement des applications de manière efficace et reproductible. Avec `.gitlab-ci.yml`, on peut définir des pipelines adaptés aux besoins de chaque projet.

