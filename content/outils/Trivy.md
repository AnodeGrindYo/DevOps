# Cours Complet sur Trivy

## Introduction à Trivy
Trivy est un scanner de vulnérabilités open-source développé par Aqua Security. Il permet d’analyser les images Docker, les fichiers de configuration, les dépôts de code et les infrastructures en tant que code (IaC) pour détecter les vulnérabilités et les mauvaises configurations.

## Fonctionnalités Principales de Trivy
- **Analyse des images Docker et conteneurs**
- **Analyse des fichiers de configuration** (YAML, JSON, HCL, etc.)
- **Analyse des paquets et dépendances** (Node.js, Python, Go, etc.)
- **Analyse des dépôts Git** pour détecter des secrets exposés
- **Intégration avec Kubernetes** pour scanner les workloads en production
- **Support des principaux systèmes d’exploitation** (Debian, Ubuntu, CentOS, Alpine, etc.)

## Installation de Trivy

### 1. **Installation sur Linux**
```bash
sudo apt install wget
wget https://github.com/aquasecurity/trivy/releases/latest/download/trivy_Linux-64bit.tar.gz
sudo tar zxvf trivy_Linux-64bit.tar.gz -C /usr/local/bin trivy
```

### 2. **Installation sur macOS**
```bash
brew install aquasecurity/trivy/trivy
```

### 3. **Installation sur Windows**
Téléchargez l’exécutable depuis [GitHub](https://github.com/aquasecurity/trivy/releases) et ajoutez-le à votre PATH.

### 4. **Installation avec Docker**
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasecurity/trivy image python:3.9
```

## Utilisation de Trivy

### 1. **Scanner une Image Docker**
```bash
trivy image nginx:latest
```
Sortie attendue :
```
nginx:latest (debian 11)
=======================
Total: 10 (HIGH: 2, MEDIUM: 4, LOW: 4)
```

### 2. **Scanner un Répertoire (Dépôt Git, Fichiers locaux)**
```bash
trivy fs ./mon-projet
```

### 3. **Scanner un Déploiement Kubernetes**
```bash
trivy k8s cluster
```

### 4. **Scanner un Fichier de Configuration**
```bash
trivy config --format json ./config.yml
```

### 5. **Scanner les Dépendances d’un Projet**
Trivy supporte les langages suivants :
- Node.js (package-lock.json, yarn.lock)
- Python (requirements.txt, Pipfile.lock)
- Go (go.sum)

Exemple :
```bash
trivy repo https://github.com/utilisateur/projet
```

## Intégration avec CI/CD
Trivy peut être intégré aux pipelines CI/CD pour automatiser la détection des vulnérabilités.

### 1. **GitHub Actions**
Ajoutez un workflow GitHub Actions :
```yaml
name: Trivy Scan
on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'nginx:latest'
          format: 'table'
```

### 2. **GitLab CI/CD**
Ajoutez un job dans `.gitlab-ci.yml` :
```yaml
security_scan:
  image: aquasecurity/trivy
  script:
    - trivy image my-app:latest
```

## Personnalisation des Scans

### 1. **Filtrer par Niveau de Sévérité**
```bash
trivy image --severity HIGH,CRITICAL nginx:latest
```

### 2. **Ignorer certaines vulnérabilités**
Ajoutez un fichier `.trivyignore` :
```
CVE-2021-12345
CVE-2021-67890
```
Exécutez ensuite :
```bash
trivy image --ignorefile .trivyignore nginx:latest
```

### 3. **Exporter les Résultats au Format JSON**
```bash
trivy image --format json -o resultats.json nginx:latest
```

## Meilleures Pratiques
- **Intégrer Trivy dans le CI/CD** pour détecter les vulnérabilités tôt
- **Scanner régulièrement les images et conteneurs en production**
- **Utiliser des images officielles et mises à jour** pour réduire les failles
- **Mettre en place des règles strictes sur les secrets exposés dans le code**
- **Configurer Trivy avec Kubernetes pour surveiller les workloads en continu**

## Conclusion
Trivy est un outil efficace et facile à utiliser pour la détection des vulnérabilités et l’analyse des configurations. Son intégration dans les workflows DevSecOps renforce la sécurité des applications et des infrastructures en identifiant les menaces dès les premières étapes du développement.

