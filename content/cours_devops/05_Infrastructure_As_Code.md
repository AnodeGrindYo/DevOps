---
title: "Infrastructure as Code (IaC)"
description: "Automatiser le déploiement de l’infrastructure pour TaskManagerPro avec Terraform."
category: "cours-devops"
---

### Module 5 : Infrastructure as Code (IaC)

---

#### **5.1. Introduction à Terraform**

**Objectif :** Automatiser le déploiement de l’infrastructure pour TaskManagerPro avec Terraform.

---

#### **Cours : Notions fondamentales de Terraform**

##### **1. Qu'est-ce que Terraform ?**
- Terraform est un outil d’Infrastructure as Code (IaC) permettant de définir et gérer des infrastructures via des fichiers de configuration.
- Il utilise un langage déclaratif appelé HCL (HashiCorp Configuration Language).
- Terraform fonctionne avec plusieurs fournisseurs cloud : AWS, GCP, Azure, etc.

##### **2. Installation de Terraform**
1. **Télécharger et installer Terraform**
   ```bash
   curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
   sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
   sudo apt update && sudo apt install terraform
   ```
2. **Vérifier l’installation**
   ```bash
   terraform version
   ```

##### **3. Concepts clés de Terraform**
- **Providers** : Définissent les services cloud à utiliser (ex. AWS, GCP, Azure).
- **Resources** : Représentent les objets à déployer (ex. une instance EC2, un bucket S3).
- **Variables** : Permettent de paramétrer la configuration.
- **State** : Fichier stockant l’état actuel de l’infrastructure.
- **Modules** : Groupes réutilisables de configurations Terraform.

##### **4. Exemple de fichier Terraform pour AWS**
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "taskmanager_server" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"
  tags = {
    Name = "TaskManagerPro-Server"
  }
}
```

##### **5. Commandes essentielles**
```bash
terraform init      # Initialise Terraform
terraform plan      # Prévisualise les modifications
terraform apply     # Applique la configuration
terraform destroy   # Supprime l’infrastructure
```

##### **Exercice pratique : Déploiement d’un serveur EC2 AWS**
1. **Créer un fichier `main.tf` avec la configuration AWS.**
2. **Initialiser Terraform et appliquer la configuration.**
   ```bash
   terraform init
   terraform apply -auto-approve
   ```
3. **Vérifier que l’instance est bien créée sur AWS.**

---

#### **5.2. Gestion de la configuration avec Ansible**

**Objectif :** Automatiser la configuration des serveurs avec Ansible.

##### **1. Qu'est-ce qu’Ansible ?**
- Outil d'automatisation sans agent utilisant SSH.
- Utilise des playbooks (fichiers YAML) pour déployer des configurations.
- Facilite la gestion des mises à jour et des installations logicielles.

##### **2. Installation d’Ansible**
```bash
sudo apt update && sudo apt install ansible -y
```

##### **3. Exemple de playbook Ansible pour TaskManagerPro**
```yaml
- name: Configuration du serveur TaskManagerPro
  hosts: all
  become: yes
  tasks:
    - name: Installer Node.js et Git
      apt:
        name:
          - nodejs
          - git
        state: present
    - name: Cloner le dépôt
      git:
        repo: 'https://github.com/TechNovaCorp/TaskManagerPro.git'
        dest: /var/www/TaskManagerPro
```

##### **4. Exécuter un playbook**
```bash
ansible-playbook -i inventory.ini playbook.yml
```

##### **Exercice pratique : Configuration automatique du serveur**
1. **Créer un fichier `inventory.ini` avec l’IP du serveur.**
2. **Écrire un playbook Ansible pour installer Node.js et cloner TaskManagerPro.**
3. **Exécuter le playbook pour configurer automatiquement le serveur.**

---

Grâce à Terraform et Ansible, nous avons automatisé le déploiement et la configuration de l’infrastructure de TaskManagerPro. Vous êtes désormais prêts à gérer des infrastructures cloud efficacement !

