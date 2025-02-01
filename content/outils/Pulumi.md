# Cours complet sur Pulumi

## Introduction à Pulumi
Pulumi est une plateforme open-source d'Infrastructure as Code (IaC) permettant de gérer des infrastructures cloud en utilisant des langages de programmation généralistes comme Python, TypeScript, Go, et C#. Contrairement à Terraform qui utilise un langage déclaratif (HCL), Pulumi permet une approche plus flexible grâce à une programmation impérative.

### Pourquoi utiliser Pulumi ?
- **Supporte plusieurs clouds** : AWS, Azure, GCP, Kubernetes, etc.
- **Programmation impérative** : Utilisation de langages comme Python ou TypeScript.
- **État stocké en local ou sur le cloud** : Gestion simplifiée des configurations.
- **Facilement intégrable avec CI/CD** : Automatisation et gestion des infrastructures via des pipelines.

## Installation de Pulumi

### Prérequis
Avant d’installer Pulumi, assurez-vous d’avoir :
- Un langage de programmation compatible installé (Python, Node.js, Go, ou .NET).
- Un compte Pulumi (optionnel mais recommandé).
- Un accès aux API des fournisseurs cloud (AWS, Azure, GCP, etc.).

### Installation
#### Linux/macOS
```sh
curl -fsSL https://get.pulumi.com | sh
```
Ajoutez Pulumi à votre `PATH` si nécessaire :
```sh
export PATH=$HOME/.pulumi/bin:$PATH
```

#### Windows
```powershell
choco install pulumi
```

### Vérification de l’installation
```sh
pulumi version
```

## Création d’un projet Pulumi

### Initialisation d’un projet
```sh
pulumi new aws-python
```
Les options possibles incluent `aws-typescript`, `azure-python`, `gcp-go`, etc.

### Déploiement d’une infrastructure
Un exemple simple de déploiement d’une machine virtuelle sur AWS en Python :
```python
import pulumi
import pulumi_aws as aws

instance = aws.ec2.Instance("web-server",
    instance_type="t2.micro",
    ami="ami-0c55b159cbfafe1f0")

pulumi.export("instance_id", instance.id)
```

Lancer le déploiement :
```sh
pulumi up
```

### Aperçu et rollback
- **Voir les changements avant de les appliquer** :
```sh
pulumi preview
```
- **Supprimer les ressources créées** :
```sh
pulumi destroy
```

## Gestion de l’état
Pulumi conserve l’état des ressources pour éviter les conflits.
- **État stocké localement** :
```sh
pulumi login --local
```
- **État stocké sur le cloud Pulumi** (par défaut) :
```sh
pulumi login
```
- **Utilisation d’un backend S3/GCS/Azure Blob** :
```sh
pulumi login s3://my-bucket
```

## Intégration avec CI/CD
Pulumi peut être intégré dans des pipelines CI/CD pour automatiser le déploiement.

### Exemple avec GitHub Actions
Créez un fichier `.github/workflows/pulumi.yml` :
```yaml
name: Pulumi Deploy

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Pulumi
        run: curl -fsSL https://get.pulumi.com | sh
      - name: Deploy infrastructure
        run: pulumi up --yes
```

## Comparaison avec Terraform

| Fonctionnalité       | Pulumi        | Terraform    |
|---------------------|--------------|-------------|
| Langage            | Python, TypeScript, Go, C# | HCL (déclaratif) |
| Gestion de l’état  | Cloud/local  | Cloud/local  |
| Approche           | Impérative   | Déclarative  |
| Intégration CI/CD  | Facile      | Facile      |
| Plugins           | Riches      | Riches      |

## En résumé
Pulumi est une solution moderne et flexible pour gérer des infrastructures cloud avec des langages de programmation connus. Il se distingue par son approche impérative et son intégration avec divers fournisseurs cloud et outils DevOps. Sa compatibilité avec plusieurs langages en fait un choix idéal pour les équipes ayant des développeurs déjà formés à ces technologies.

