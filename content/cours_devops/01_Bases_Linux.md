---
title: "Les bases indispensables"
description: "Comprendre les bases de l’administration Linux et configurer un serveur pour l’application TaskManagerPro"
category: "cours-devops"
---

### Module 1 : Les bases indispensables

---

#### **1.1. Systèmes d'exploitation : Linux**

**Objectif :**
Comprendre les bases de l’administration Linux et configurer un serveur pour l’application TaskManagerPro.

---

#### **Cours : Commandes Linux essentielles**

##### **Gestion des fichiers et répertoires :**
- **Lister des fichiers :** `ls`, `ls -l`, `ls -a`
- **Changer de répertoire :** `cd /chemin`
- **Copier des fichiers :** `cp source destination`
- **Déplacer des fichiers :** `mv source destination`
- **Supprimer des fichiers :** `rm fichier`, `rm -r repertoire`
- **Créer des fichiers et dossiers :** `touch fichier`, `mkdir repertoire`
- **Lire des fichiers :** `cat fichier`, `less fichier`

##### **Gestion des permissions :**
- **Changer les permissions :** `chmod` (Exemple : `chmod 755 fichier`)
- **Changer le propriétaire :** `chown` (Exemple : `chown user:group fichier`)

##### **Gestion des processus :**
- **Lister les processus :** `ps aux`, `top`
- **Arrêter un processus :** `kill PID`
- **Arrêter un processus par nom :** `pkill nom`

##### **Services et systemd :**
- **Démarrer un service :** `sudo systemctl start nom_service`
- **Arrêter un service :** `sudo systemctl stop nom_service`
- **Activer un service au démarrage :** `sudo systemctl enable nom_service`
- **Désactiver un service :** `sudo systemctl disable nom_service`

---

#### **Exercice pratique 1 : Installer et configurer le serveur Linux**

**Scénario :** Vous allez préparer un serveur Linux pour accueillir TaskManagerPro. Voici les étapes à suivre :

1. **Connexion au serveur :**
   - Connectez-vous à un serveur Linux via SSH :
     ```bash
     ssh user@adresse_ip
     ```

2. **Mise à jour du système :**
   - Assurez-vous que le système est à jour :
     ```bash
     sudo apt update && sudo apt upgrade -y
     ```

3. **Installer Node.js et npm :**
   - Ajoutez le dépôt Node.js officiel :
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     ```
   - Installez Node.js :
     ```bash
     sudo apt install -y nodejs
     ```
   - Vérifiez l’installation :
     ```bash
     node -v
     npm -v
     ```

4. **Installer Git :**
   - Installez l’outil Git :
     ```bash
     sudo apt install -y git
     ```
   - Vérifiez l’installation :
     ```bash
     git --version
     ```

5. **Cloner le dépôt TaskManagerPro :**
   - Rendez-vous dans le répertoire `/var/www` :
     ```bash
     cd /var/www
     ```
   - Clonez le dépôt :
     ```bash
     sudo git clone https://github.com/TechNovaCorp/TaskManagerPro.git
     ```

6. **Installer les dépendances Node.js :**
   - Accédez au répertoire backend du projet :
     ```bash
     cd TaskManagerPro/backend
     ```
   - Installez les dépendances :
     ```bash
     npm install
     ```

7. **Configurer et lancer l’application :**
   - Créez un fichier `.env` à partir de l’exemple fourni :
     ```bash
     cp .env.example .env
     ```
   - Modifiez les paramètres dans le fichier `.env` si nécessaire.
   - Lancez l’application :
     ```bash
     npm start
     ```
   - Vérifiez que l’application fonctionne en accédant à l’adresse IP du serveur dans un navigateur.

---

#### **1.2. Notions de réseaux**

##### **Bases des protocoles :**
- **TCP/IP :** Protocole de communication pour établir des connexions sur le réseau.
- **DNS :** Traduit les noms de domaine (ex. www.google.com) en adresses IP.
- **SSH :** Protocole pour accéder à distance à un serveur.

##### **Configurer une connexion SSH sécurisée :**
1. **Générer une clé SSH sur votre machine locale :**
   ```bash
   ssh-keygen -t rsa -b 4096
   ```
2. **Ajouter votre clé publique au serveur :**
   - Copiez la clé publique sur le serveur :
     ```bash
     ssh-copy-id user@adresse_ip
     ```
3. **Vérifier la connexion sans mot de passe :**
   ```bash
   ssh user@adresse_ip
   ```

---

#### **Exercice pratique 2 : Configurer un accès SFTP**

**Scénario :** Vous devez transférer les fichiers de configuration de votre application TaskManagerPro.

1. **Installer un serveur SFTP :**
   - Assurez-vous que le service SSH est actif (OpenSSH gère aussi SFTP).
     ```bash
     sudo systemctl status ssh
     ```

2. **Transférer des fichiers avec SFTP :**
   - Connectez-vous en SFTP :
     ```bash
     sftp user@adresse_ip
     ```
   - Transférez un fichier depuis votre machine locale :
     ```bash
     put chemin_du_fichier
     ```
   - Quittez la session SFTP :
     ```bash
     bye
     ```

---
