# 3. Configuration des serveurs avec Ansible

## 3.1 Objectif
L'objectif de cette étape est d'automatiser la configuration des serveurs de l'infrastructure à l'aide d'**Ansible**. Cela inclut l'installation des dépendances, la mise en place des services nécessaires, et la configuration des outils pour l'exécution des tâches DevOps.

## 3.2 Présentation d'Ansible
**Ansible** est un outil d'automatisation de configuration qui permet de gérer les serveurs sans nécessiter d'agent sur ces derniers. Il fonctionne via SSH et utilise des **playbooks** (fichiers YAML) pour exécuter des commandes de manière déclarative.

## 3.3 Structure du projet Ansible
Un projet Ansible typique est organisé comme suit :
```
ansible/
│── inventory.ini  # Liste des serveurs à configurer
│── ansible.cfg    # Configuration globale d'Ansible
│── playbooks/
│   │── setup.yml  # Playbook principal
│   │── docker.yml # Installation de Docker
│   │── k8s.yml    # Installation de Kubernetes
│── roles/
│   │── common/    # Rôles pour la configuration de base
│   │── monitoring/ # Rôles pour Prometheus, Grafana
```

## 3.4 Définition de l'inventaire des serveurs
L'inventaire **inventory.ini** définit les serveurs et leurs rôles :
```ini
[all]
master ansible_host=192.168.1.100
worker1 ansible_host=192.168.1.101
worker2 ansible_host=192.168.1.102

[masters]
master

[workers]
worker1
worker2
```

## 3.5 Configuration globale d'Ansible
Le fichier **ansible.cfg** permet d'optimiser Ansible :
```ini
[defaults]
inventory = inventory.ini
remote_user = ubuntu
host_key_checking = False
```

## 3.6 Playbooks Ansible

### 3.6.1 Playbook d'installation de Docker
Le fichier **playbooks/docker.yml** installe Docker sur les serveurs :
```yaml
- name: Installer Docker
  hosts: all
  become: true
  tasks:
    - name: Installer les paquets requis
      apt:
        name: ["apt-transport-https", "ca-certificates", "curl", "gnupg", "lsb-release"]
        state: present

    - name: Ajouter la clé GPG de Docker
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Ajouter le dépôt Docker
      apt_repository:
        repo: deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable
        state: present

    - name: Installer Docker
      apt:
        name: docker-ce
        state: present

    - name: Démarrer et activer Docker
      service:
        name: docker
        state: started
        enabled: true
```

### 3.6.2 Playbook d'installation de Kubernetes
Le fichier **playbooks/k8s.yml** installe Kubernetes sur le cluster :
```yaml
- name: Installer Kubernetes
  hosts: all
  become: true
  tasks:
    - name: Ajouter la clé GPG de Kubernetes
      apt_key:
        url: https://packages.cloud.google.com/apt/doc/apt-key.gpg
        state: present

    - name: Ajouter le dépôt Kubernetes
      apt_repository:
        repo: deb http://apt.kubernetes.io/ kubernetes-xenial main
        state: present

    - name: Installer kubeadm, kubelet et kubectl
      apt:
        name:
          - kubeadm
          - kubelet
          - kubectl
        state: present

    - name: Démarrer kubelet
      service:
        name: kubelet
        state: started
        enabled: true
```

### 3.6.3 Playbook de configuration de Prometheus et Grafana
Le fichier **playbooks/monitoring.yml** installe et configure les outils de monitoring :
```yaml
- name: Installer Prometheus et Grafana
  hosts: master
  become: true
  tasks:
    - name: Installer Prometheus
      apt:
        name: prometheus
        state: present

    - name: Installer Grafana
      apt:
        name: grafana
        state: present

    - name: Démarrer et activer les services
      service:
        name: "{{ item }}"
        state: started
        enabled: true
      loop:
        - prometheus
        - grafana
```

## 3.7 Exécution des playbooks
Les playbooks peuvent être exécutés avec la commande suivante :
```bash
ansible-playbook playbooks/docker.yml
ansible-playbook playbooks/k8s.yml
ansible-playbook playbooks/monitoring.yml
```

## 3.8 Vérification de l'installation
Une fois l'installation terminée, nous pouvons vérifier l'état des services :
```bash
systemctl status docker
systemctl status kubelet
systemctl status prometheus
systemctl status grafana
```

## 3.9 Sécurisation et optimisation
- Restreindre les accès SSH avec fail2ban.
- Mettre en place un pare-feu avec UFW.
- Optimiser les performances des nœuds Kubernetes.

## 3.10 Conclusion
L'utilisation d'Ansible permet de standardiser et d'automatiser l'installation et la configuration des serveurs, garantissant ainsi un déploiement reproductible et efficace de l'infrastructure.

