---
title: "Jenkins"
description: "Jenkins est un outil d'intégration continue et de livraison continue (CI/CD) open-source permettant d'automatiser le développement, les tests et le déploiement des applications. Il offre une interface web et de nombreuses fonctionnalités via des plugins."
category: "outils"
---

# Jenkins

## Introduction à Jenkins

Jenkins est un outil d'intégration continue et de livraison continue (CI/CD) open-source permettant d'automatiser le développement, les tests et le déploiement des applications. Il offre une interface web et de nombreuses fonctionnalités via des plugins.

## Installation de Jenkins

### 1. **Installation sur Linux**
```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
echo "deb http://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt update
sudo apt install jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### 2. **Installation sur Windows**
- Télécharger Jenkins depuis [le site officiel](https://www.jenkins.io/)
- Installer en suivant les instructions
- Démarrer Jenkins en tant que service Windows

### 3. **Accès à l'interface Web**
Jenkins est accessible via `http://localhost:8080`. Le mot de passe initial se trouve dans `/var/lib/jenkins/secrets/initialAdminPassword`.

## Concepts Clés

### 1. **Jobs et Pipelines**
Un **job** est une tâche à exécuter dans Jenkins. Un **pipeline** est une série d'étapes automatisées définies en tant que code avec le fichier `Jenkinsfile`.

### 2. **Noeuds et Agents**
- **Master** : Serveur principal qui orchestre l'exécution des tâches.
- **Agents** : Machines qui exécutent les tâches Jenkins.

### 3. **Plugins**
Jenkins repose sur une architecture modulaire avec plus de 1800 plugins disponibles.

## Création d’un Pipeline Jenkins

### 1. **Pipeline Déclaratif**
```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application'
            }
        }
    }
}
```

### 2. **Pipeline Scripté**
```groovy
node {
    stage('Build') {
        echo 'Building...'
    }
    stage('Test') {
        echo 'Testing...'
    }
    stage('Deploy') {
        echo 'Deploying...'
    }
}
```

## Gestion des Credentials

Jenkins permet de stocker des **credentials** pour sécuriser les accès :
1. Aller dans **Manage Jenkins > Manage Credentials**
2. Ajouter des credentials (mot de passe, clé SSH, token API, etc.)
3. Utiliser dans un pipeline :
```groovy
withCredentials([usernamePassword(credentialsId: 'my-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
    sh 'curl -u $USER:$PASS https://example.com'
}
```

## Déclencheurs de Pipeline

1. **Déclenchement manuel** : Exécuter un job via l'interface.
2. **Déclenchement automatique par commit** :
```groovy
triggers {
    scm('H/5 * * * *') // Exécution toutes les 5 minutes
}
```
3. **Webhook GitHub** : Configurer un webhook pour déclencher le pipeline après chaque commit.

## Intégration et Déploiement Continu

### 1. **Exécution de tests automatisés**
```groovy
stage('Test') {
    steps {
        sh 'pytest tests/'
    }
}
```

### 2. **Déploiement sur un serveur distant**
```groovy
stage('Deploy') {
    steps {
        sh 'scp app.jar user@server:/opt/app/'
        sh 'ssh user@server "systemctl restart app"'
    }
}
```

## Supervision et Logs

- **Visualisation des logs** : `Build > Console Output`
- **Historique des builds** : `Dashboard > Build History`
- **Jenkinsfile versionné** : Suivi dans Git pour plus de traçabilité

## Sécurisation de Jenkins

1. Activer l'authentification : **Manage Jenkins > Configure Global Security**
2. Restreindre l'accès aux builds : **Matrix Authorization Strategy**
3. Exécuter Jenkins derrière un proxy sécurisé

## En résumé
Jenkins est un outil puissant pour automatiser l'intégration et le déploiement des applications. Avec une bonne configuration de pipelines et une gestion efficace des agents et des plugins, il permet d'améliorer la qualité et la rapidité des livraisons logicielles.