---
title: "Ansible"
description: "Ansible est un outil open-source d'automatisation permettant la gestion de la configuration, le déploiement d’applications et l'orchestration d'infrastructure. Il est conçu pour être simple à utiliser, efficace et sans agent."
category: "outils"
---

# Ansible

## Introduction à Ansible

Ansible est un outil open-source d'automatisation permettant la gestion de la configuration, le déploiement d’applications et l'orchestration d'infrastructure. Il est conçu pour être simple à utiliser, efficace et sans agent.

### Pourquoi utiliser Ansible ?
- **Simplicité** : Basé sur YAML et ne nécessite aucun agent sur les machines gérées.
- **Idempotence** : Permet d'assurer qu'une tâche ne soit exécutée que si nécessaire.
- **Extensibilité** : Supporte un grand nombre de modules pour différents usages.
- **Sécurisé** : Utilise SSH sans nécessiter d'agents supplémentaires.
- **Compatible** : Fonctionne sur de nombreux systèmes (Linux, macOS, Windows via WSL).

---

## Installation de Ansible

### Sur Linux (Debian/Ubuntu)
```bash
sudo apt update && sudo apt install ansible -y
```

### Sur macOS
```bash
brew install ansible
```

### Sur Windows (via WSL ou Python)
```bash
pip install ansible
```

### Vérifier l’installation
```bash
ansible --version
```

---

## Concepts fondamentaux

### 1. **Inventaire**
Un fichier qui définit les hôtes gérés par Ansible.

**Exemple d’inventaire (`hosts.ini`) :**
```ini
[webservers]
192.168.1.10
192.168.1.11

[dbservers]
db.example.com
```

### 2. **Modules**
Les modules sont des scripts réutilisables exécutés sur les hôtes pour effectuer diverses actions.

**Exemple : Utiliser le module `ping`**
```bash
ansible all -i hosts.ini -m ping
```

### 3. **Playbooks**
Un playbook est un fichier YAML qui décrit une série de tâches à exécuter sur des hôtes.

**Exemple de playbook (`install_nginx.yml`) :**
```yaml
- name: Installer et démarrer Nginx
  hosts: webservers
  become: yes
  tasks:
    - name: Installer Nginx
      apt:
        name: nginx
        state: present

    - name: Démarrer Nginx
      service:
        name: nginx
        state: started
```

**Exécuter le playbook :**
```bash
ansible-playbook -i hosts.ini install_nginx.yml
```

### 4. **Handlers**
Un handler est une tâche qui s’exécute uniquement lorsqu’elle est notifiée par une autre tâche.

**Exemple avec un handler :**
```yaml
- name: Installer et configurer Apache
  hosts: webservers
  become: yes
  tasks:
    - name: Installer Apache
      apt:
        name: apache2
        state: present

    - name: Modifier la configuration
      template:
        src: apache.conf.j2
        dest: /etc/apache2/apache2.conf
      notify: Redémarrer Apache

  handlers:
    - name: Redémarrer Apache
      service:
        name: apache2
        state: restarted
```

### 5. **Variables et Templates**
Les variables permettent de rendre les playbooks plus dynamiques.

**Exemple de variables dans `vars.yml` :**
```yaml
app_port: 8080
```

**Exemple d’utilisation dans un playbook :**
```yaml
- name: Déployer une application
  hosts: webservers
  become: yes
  vars_files:
    - vars.yml
  tasks:
    - name: Copier la configuration
      template:
        src: app.conf.j2
        dest: /etc/app/config.conf
```

**Exemple de template (`app.conf.j2`) :**
```conf
server {
  listen {{ app_port }};
}
```

### 6. **Rôles Ansible**
Les rôles permettent d’organiser les playbooks en structures modulaires réutilisables.

**Créer un rôle :**
```bash
ansible-galaxy init mon_role
```

Structure d’un rôle :
```
mon_role/
 ├── tasks/main.yml      # Définition des tâches
 ├── handlers/main.yml   # Handlers associés
 ├── templates/          # Fichiers templates
 ├── vars/main.yml       # Variables spécifiques
 ├── defaults/main.yml   # Valeurs par défaut
 ├── meta/main.yml       # Métadonnées du rôle
```

**Utiliser un rôle dans un playbook :**
```yaml
- name: Déployer une application
  hosts: webservers
  roles:
    - mon_role
```

---

## Gestion avancée avec Ansible

### 1. **Gestion des secrets avec Ansible Vault**
Permet de chiffrer des fichiers sensibles (mots de passe, clés API, etc.).

**Créer un fichier chiffré :**
```bash
ansible-vault encrypt secrets.yml
```

**Déchiffrer un fichier :**
```bash
ansible-vault decrypt secrets.yml
```

**Utiliser un fichier chiffré dans un playbook :**
```yaml
vars_files:
  - secrets.yml
```

### 2. **Exécution parallèle et stratégies d'exécution**
Par défaut, Ansible exécute les tâches en parallèle sur plusieurs hôtes.

**Limiter l’exécution à un hôte à la fois :**
```bash
ansible-playbook -i hosts.ini deploy.yml --forks=1
```

### 3. **Ansible et CI/CD**
Ansible peut être intégré dans des pipelines CI/CD avec GitHub Actions, GitLab CI/CD ou Jenkins.

**Exemple de pipeline avec GitHub Actions :**
```yaml
name: Deploy with Ansible
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Install Ansible
        run: sudo apt update && sudo apt install ansible -y
      - name: Run Ansible playbook
        run: ansible-playbook -i hosts.ini deploy.yml
```

---

## En résumé
Ansible est un outil puissant et flexible pour automatiser la gestion d’infrastructure. Grâce à son approche déclarative et sa simplicité d’utilisation, il est devenu un standard dans le monde de l’administration système et du DevOps. Que ce soit pour le déploiement d’applications, la gestion de configurations ou l’orchestration d’infrastructures, Ansible offre une solution robuste et évolutive.

