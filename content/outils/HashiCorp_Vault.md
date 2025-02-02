---
title: "HashiCorp Vault"
description: "HashiCorp Vault est un outil permettant la gestion sécurisée des secrets, des tokens d'authentification et du chiffrement des données sensibles."
category: "outils"
---

# Cours Complet sur HashiCorp Vault

## Introduction à HashiCorp Vault
HashiCorp Vault est un outil open-source de gestion des secrets et de protection des données sensibles. Il permet de stocker, gérer et contrôler l'accès aux identifiants, clés API, certificats et autres secrets critiques.

## Concepts Clés de Vault

### 1. **Secret Engine**
Vault utilise des moteurs de secrets pour stocker et générer dynamiquement des secrets.

### 2. **Authentification et Politiques**
Vault utilise des méthodes d'authentification (Token, LDAP, AWS, GitHub) et des politiques pour contrôler l'accès aux secrets.

### 3. **Chiffrement**
Vault fournit un service de chiffrement pour protéger les données sensibles sans les stocker.

### 4. **Dynamic Secrets**
Vault peut générer des secrets temporaires pour les bases de données, AWS, etc.

### 5. **Audit Logging**
Toutes les interactions avec Vault sont enregistrées pour assurer la traçabilité.

## Installation de HashiCorp Vault

### 1. **Installation sur Linux**
```bash
wget https://releases.hashicorp.com/vault/1.12.0/vault_1.12.0_linux_amd64.zip
unzip vault_1.12.0_linux_amd64.zip
sudo mv vault /usr/local/bin/
```

### 2. **Installation avec Docker**
```bash
docker run -d --name=vault -e 'VAULT_DEV_ROOT_TOKEN_ID=root' -p 8200:8200 vault
```

## Configuration de Vault

### 1. **Initialisation du Serveur Vault**
```bash
vault operator init
```
Cette commande génère des clés de récupération et un token root.

### 2. **Déverrouillage de Vault**
```bash
vault operator unseal
```
Il faut fournir au moins trois clés de récupération pour déverrouiller Vault.

### 3. **Connexion à Vault**
```bash
export VAULT_ADDR='http://127.0.0.1:8200'
vault login root
```

## Stockage et Gestion des Secrets

### 1. **Stocker un Secret**
```bash
vault kv put secret/api key=1234567890abcdef
```

### 2. **Récupérer un Secret**
```bash
vault kv get secret/api
```

### 3. **Supprimer un Secret**
```bash
vault kv delete secret/api
```

## Gestion des Utilisateurs et des Politiques

### 1. **Créer une Politique**
```hcl
path "secret/*" {
  capabilities = ["read", "list"]
}
```
Ajoutez cette politique avec :
```bash
vault policy write read-secrets read-secrets.hcl
```

### 2. **Créer un Utilisateur avec Authentification Token**
```bash
vault token create -policy=read-secrets
```

## Utilisation des Dynamic Secrets

### 1. **Activer le Secret Engine pour MySQL**
```bash
vault secrets enable database
vault write database/config/mydb \
    plugin_name=mysql-database-plugin \
    connection_url="{{username}}:{{password}}@tcp(127.0.0.1:3306)/" \
    allowed_roles="readonly"
```

### 2. **Générer un Identifiant Temporaire**
```bash
vault read database/creds/readonly
```

## Chiffrement des Données Sensibles

### 1. **Activer le Secret Engine de Chiffrement**
```bash
vault secrets enable transit
```

### 2. **Créer une Clé de Chiffrement**
```bash
vault write -f transit/keys/my-key
```

### 3. **Chiffrer un Texte**
```bash
vault write transit/encrypt/my-key plaintext=$(echo -n "secret data" | base64)
```

### 4. **Déchiffrer un Texte**
```bash
vault write transit/decrypt/my-key ciphertext=<texte_chiffré>
```

## Configuration de Vault en Production

### 1. **Configurer un Backend de Stockage Consul**
```hcl
storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}
```

### 2. **Démarrer Vault en Mode Serveur**
```bash
vault server -config=/etc/vault/config.hcl
```

## Intégration avec Kubernetes
Vault peut être utilisé pour injecter des secrets dans les pods Kubernetes.

### 1. **Installer le Vault Injector**
```bash
helm install vault hashicorp/vault
```

### 2. **Configurer un Secret dans Kubernetes**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: vault-secret
type: Opaque
data:
  password: c2VjcmV0
```

## Sécurisation de Vault

- **Configurer l’authentification avec LDAP ou AWS IAM**
- **Utiliser TLS pour chiffrer les communications**
- **Activer l’audit logging pour suivre les accès**

## En résumé
Vault est un outil puissant pour gérer les secrets et sécuriser les données sensibles. Son intégration avec des outils comme Kubernetes, Consul et AWS en fait un choix idéal pour la gestion centralisée des secrets en entreprise.

