---
title: "Sécurité"
description: "Apprendre à gérer les secrets (clés API, mots de passe, certificats) de manière sécurisée en utilisant HashiCorp Vault."
category: "cours-devops"
---


### Module 7 : Sécurité

---

#### **7.1. Gestion des secrets**

**Objectif :** Apprendre à gérer les secrets (clés API, mots de passe, certificats) de manière sécurisée en utilisant HashiCorp Vault.

---

#### **Cours : Introduction à la gestion des secrets**

##### **1. Pourquoi gérer les secrets ?**
Les applications ont besoin de mots de passe, de clés API et d'autres secrets pour fonctionner. Il est crucial de les protéger contre les fuites.

##### **2. HashiCorp Vault : Introduction**
- Solution open-source permettant de stocker et d'accéder de manière sécurisée aux secrets.
- Chiffrement des données en repos et en transit.
- Accès restreint basé sur des politiques.

##### **3. Installer et configurer Vault**

1. **Installation sur un serveur Linux**
   ```bash
   wget https://releases.hashicorp.com/vault/1.10.3/vault_1.10.3_linux_amd64.zip
   unzip vault_1.10.3_linux_amd64.zip
   sudo mv vault /usr/local/bin/
   ```

2. **Démarrer Vault en mode développement**
   ```bash
   vault server -dev
   ```

3. **Stocker et récupérer un secret**
   ```bash
   export VAULT_ADDR='http://127.0.0.1:8200'
   vault kv put secret/taskmanagerpro db_password=SuperSecret123
   vault kv get secret/taskmanagerpro
   ```

---

#### **Exercice pratique 1 : Intégration de Vault dans TaskManagerPro**
1. **Configurer l'application pour récupérer les secrets**
   - Modifier le fichier `.env` pour retirer les mots de passe en dur.
   - Utiliser Vault pour les injecter dynamiquement.

2. **Accéder à Vault depuis l'application**
   - Installer le client Vault :
     ```bash
     npm install node-vault
     ```
   - Ajouter un script pour récupérer les secrets au démarrage.

---

#### **7.2. Détection des vulnérabilités**

**Objectif :** Identifier et corriger les failles de sécurité dans les images Docker et les dépendances applicatives.

##### **1. Trivy : Analyse des images Docker**
- Trivy est un scanner de vulnérabilités open-source.
- Il détecte les failles dans les conteneurs, dépendances et systèmes d'exploitation.

##### **2. Installation de Trivy**
   ```bash
   sudo apt install trivy
   ```

##### **3. Scanner une image Docker**
   ```bash
   trivy image taskmanagerpro:latest
   ```

##### **4. Scanner les dépendances Node.js**
   ```bash
   trivy fs --scanners vuln .
   ```

---

#### **Exercice pratique 2 : Améliorer la sécurité de TaskManagerPro**

1. **Analyser l'image Docker et corriger les vulnérabilités**
   - Mettre à jour les dépendances obsolètes.
   - Appliquer les correctifs recommandés.

2. **Automatiser le scan de vulnérabilités dans CI/CD**
   - Ajouter une étape de scan dans le pipeline GitHub Actions :
     ```yaml
     - name: Security scan with Trivy
       run: trivy image taskmanagerpro:latest
     ```

---
