---
title: "02 Provisionnement de l’infrastructure avec Terraform"
description: ""
category: "tp"
---

# 2. Provisionnement de l’infrastructure avec Terraform

## 2.1 Objectif
Le but de cette étape est de provisionner automatiquement une infrastructure cloud robuste et scalable à l'aide de **Terraform**, un outil d'Infrastructure as Code (IaC). Cette infrastructure sera utilisée pour déployer une application web sur un cluster Kubernetes.

## 2.2 Choix de la plateforme
L'infrastructure peut être provisionnée sur **AWS, GCP ou Azure**. Pour un environnement local, **Vagrant** peut être utilisé avec **K3s**.

### 2.2.1 AWS
Si AWS est choisi, l'infrastructure inclura :
- Un **VPC** (Virtual Private Cloud) avec des sous-réseaux publics et privés.
- Un **cluster Kubernetes (EKS)** pour exécuter les conteneurs.
- Des **groupes de sécurité** pour contrôler l'accès au cluster.
- Un **Elastic Load Balancer (ELB)** pour distribuer le trafic.
- Une **base de données RDS** (si l'application en a besoin).

### 2.2.2 GCP
Si GCP est choisi, l'infrastructure inclura :
- Un **VPC** avec des sous-réseaux et des règles de firewall.
- Un **cluster Kubernetes (GKE)** pour l'exécution des workloads.
- Un **Cloud Load Balancer** pour gérer le trafic.
- Une **Cloud SQL instance** pour la base de données.

### 2.2.3 Azure
Si Azure est choisi, l'infrastructure inclura :
- Un **Azure Virtual Network**.
- Un **cluster Kubernetes (AKS)** pour la gestion des conteneurs.
- Un **Azure Load Balancer**.
- Un **Azure SQL Database** pour le stockage.

### 2.2.4 Environnement local avec Vagrant
Si l'environnement local est préféré, les composants suivants seront provisionnés :
- Une machine virtuelle avec **Vagrant** et **VirtualBox**.
- Installation et configuration de **K3s** pour un cluster Kubernetes léger.
- Exposition de l'application via **Traefik** comme Ingress Controller.

## 2.3 Définition des fichiers Terraform
L'infrastructure sera décrite dans plusieurs fichiers Terraform.

### 2.3.1 `main.tf` - Définition principale
```hcl
provider "aws" {
  region = "us-east-1"
}

module "network" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.19.0"
  name    = "my-vpc"
  cidr    = "10.0.0.0/16"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "my-cluster"
  cluster_version = "1.21"
  vpc_id          = module.network.vpc_id
}
```

### 2.3.2 `variables.tf` - Définition des variables
```hcl
variable "region" {
  default = "us-east-1"
}

variable "cluster_name" {
  default = "my-cluster"
}
```

### 2.3.3 `outputs.tf` - Exportation des valeurs utiles
```hcl
output "cluster_id" {
  value = module.eks.cluster_id
}
```

## 2.4 Exécution de Terraform
Les commandes suivantes sont utilisées pour déployer l'infrastructure :
```bash
terraform init   # Initialisation du projet Terraform
terraform plan   # Aperçu des modifications
terraform apply  # Provisionnement effectif
```

## 2.5 Gestion de l'état et rollback
Terraform stocke l'état de l'infrastructure dans un fichier `terraform.tfstate`. Pour réinitialiser l'infrastructure :
```bash
terraform destroy  # Supprime toutes les ressources créées
```

## 2.6 Conclusion
L'utilisation de Terraform permet de déployer une infrastructure reproductible et scalable en quelques minutes. Cette base solide sert de fondation pour la suite du projet, notamment la configuration des serveurs et le déploiement des conteneurs sur Kubernetes.