# Cours Complet sur Terraform

## Introduction à Terraform
Terraform est un outil d'infrastructure as code (IaC) développé par HashiCorp. Il permet de gérer et d'automatiser le déploiement d'infrastructures en utilisant une configuration déclarative. Il est compatible avec divers fournisseurs cloud tels qu'AWS, Azure, GCP, et d'autres services.

## Concepts Clés de Terraform

### 1. **Infrastructure as Code (IaC)**
Terraform permet de décrire l'infrastructure sous forme de code, facilitant la gestion, la répétabilité et la collaboration.

### 2. **Fichiers de Configuration**
Les fichiers Terraform utilisent l'extension `.tf` et décrivent l'infrastructure sous forme de code en utilisant le langage HCL (HashiCorp Configuration Language).

### 3. **Providers**
Les providers sont des modules permettant d'interagir avec différentes plateformes cloud (AWS, Azure, GCP, etc.). Exemple de provider AWS :
```hcl
provider "aws" {
  region = "us-east-1"
}
```

### 4. **Ressources**
Une ressource représente un composant d'infrastructure, comme une instance EC2, un bucket S3 ou une base de données.
```hcl
resource "aws_instance" "example" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
}
```

### 5. **Variables**
Les variables permettent de rendre la configuration flexible.
```hcl
variable "instance_type" {
  default = "t2.micro"
}
```

Utilisation :
```hcl
resource "aws_instance" "example" {
  ami           = "ami-12345678"
  instance_type = var.instance_type
}
```

### 6. **Outputs**
Les outputs permettent d'afficher des informations après l'exécution de Terraform.
```hcl
output "instance_ip" {
  value = aws_instance.example.public_ip
}
```

### 7. **State File**
Terraform maintient un fichier d'état (`terraform.tfstate`) pour suivre les ressources déployées et gérer les modifications.

## Installation de Terraform

### 1. **Sur Linux (Ubuntu/Debian)**
```bash
sudo apt update && sudo apt install -y wget unzip
wget https://releases.hashicorp.com/terraform/1.3.0/terraform_1.3.0_linux_amd64.zip
unzip terraform_1.3.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 2. **Sur macOS**
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

### 3. **Sur Windows**
Téléchargez Terraform depuis [https://www.terraform.io/downloads.html](https://www.terraform.io/downloads.html) et ajoutez-le au `PATH`.

## Commandes de Base Terraform

### 1. **Initialiser un Projet**
```bash
terraform init
```
Cette commande télécharge les plugins nécessaires au provider spécifié.

### 2. **Vérifier la Configuration**
```bash
terraform validate
```
Permet de vérifier si le fichier de configuration est valide.

### 3. **Afficher le Plan d’Exécution**
```bash
terraform plan
```
Montre les modifications qui seront appliquées à l’infrastructure.

### 4. **Appliquer la Configuration**
```bash
terraform apply
```
Applique les changements et crée/modifie l’infrastructure.

### 5. **Détruire l’Infrastructure**
```bash
terraform destroy
```
Supprime toutes les ressources gérées par Terraform.

## Gestion des Modules
Les modules permettent de réutiliser des configurations Terraform pour organiser et simplifier les déploiements.

### 1. **Création d'un Module**
Dans un dossier `modules/vm`, créez un fichier `main.tf` :
```hcl
resource "aws_instance" "example" {
  ami           = "ami-12345678"
  instance_type = var.instance_type
}
```

Ajoutez un fichier `variables.tf` :
```hcl
variable "instance_type" {}
```

### 2. **Utilisation du Module**
Dans votre projet principal, utilisez le module :
```hcl
module "vm" {
  source        = "./modules/vm"
  instance_type = "t2.micro"
}
```

## Gestion du State et du Backend
Terraform stocke son état localement par défaut, mais peut être configuré pour utiliser un backend distant comme S3 pour la collaboration.
```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Bonnes Pratiques
- **Utiliser des variables pour rendre la configuration flexible.**
- **Stocker l'état Terraform dans un backend distant (S3, Terraform Cloud) pour éviter les conflits.**
- **Utiliser des modules pour structurer les configurations.**
- **Éviter de stocker des informations sensibles en clair dans les fichiers `.tf`.**
- **Exécuter `terraform plan` avant `terraform apply` pour éviter des modifications non souhaitées.**

## En résumé
Terraform est un outil puissant pour gérer des infrastructures cloud de manière automatisée et déclarative. Il facilite la gestion des environnements cloud et permet d’assurer la reproductibilité des déploiements.

