---
title: "Gestion de code source et workflows"
description: "Comprendre les fondamentaux de Git pour gérer efficacement le code source et travailler en équipe."
category: "cours-devops"
---


### Module 2 : Gestion de code source et workflows

---

#### **2.1. Git et ses bases**

**Objectif :**
Comprendre les fondamentaux de Git pour gérer efficacement le code source et travailler en équipe.

---

#### **Cours : Commandes Git essentielles**

##### **Initialiser et cloner un dépôt :**
- **Initialiser un dépôt local :**
  ```bash
  git init
  ```
- **Cloner un dépôt distant :**
  ```bash
  git clone URL_DU_DEPOT
  ```

##### **Effectuer des modifications :**
- **Ajouter des fichiers au suivi :**
  ```bash
  git add chemin_du_fichier
  ```
- **Vérifier l’état des modifications :**
  ```bash
  git status
  ```
- **Créer un commit :**
  ```bash
  git commit -m "Message du commit"
  ```

##### **Travailler avec des branches :**
- **Lister les branches :**
  ```bash
  git branch
  ```
- **Créer une nouvelle branche :**
  ```bash
  git branch nom_branche
  ```
- **Changer de branche :**
  ```bash
  git checkout nom_branche
  ```
- **Fusionner une branche :**
  ```bash
  git merge nom_branche
  ```

##### **Résoudre des conflits :**
- Lorsque des conflits surviennent, Git indique les fichiers en conflit. Modifiez-les pour résoudre les problèmes, puis :
  ```bash
  git add fichier_modifié
  git commit
  ```

##### **Collaborer avec un dépôt distant :**
- **Vérifier les changements :**
  ```bash
  git fetch
  ```
- **Récupérer et fusionner les modifications :**
  ```bash
  git pull
  ```
- **Envoyer des modifications :**
  ```bash
  git push
  ```

---

#### **Exercice pratique 1 : Cloner et organiser le dépôt TaskManagerPro**

1. **Cloner le dépôt :**
   - Clonez le dépôt TaskManagerPro :
     ```bash
     git clone https://github.com/TechNovaCorp/TaskManagerPro.git
     ```

2. **Vérifier les branches existantes :**
   - Allez dans le répertoire cloné :
     ```bash
     cd TaskManagerPro
     ```
   - Listez les branches :
     ```bash
     git branch -a
     ```

3. **Créer une branche de développement :**
   - Créez et basculez sur une nouvelle branche nommée `develop` :
     ```bash
     git checkout -b develop
     ```

4. **Soumettre des modifications :**
   - Modifiez un fichier (par exemple, ajoutez un commentaire dans le README).
   - Ajoutez les modifications et créez un commit :
     ```bash
     git add README.md
     git commit -m "Ajout d'un commentaire au README"
     ```
   - Poussez la branche `develop` vers le dépôt distant :
     ```bash
     git push origin develop
     ```

---

#### **2.2. Workflows collaboratifs**

##### **GitFlow :**
Un workflow Git populaire pour structurer les branches :
- **Branches principales :**
  - `main` : contient le code en production.
  - `develop` : contient le code en cours de développement.
- **Branches secondaires :**
  - `feature/*` : pour le développement de nouvelles fonctionnalités.
  - `hotfix/*` : pour corriger des bugs critiques en production.

##### **Trunk-Based Development :**
Approche minimaliste :
- Les développeurs travaillent directement sur la branche principale (exemple : `main`) et poussent des modifications en continu.

---

#### **Exercice pratique 2 : Mettre en place un workflow GitFlow**

1. **Configurer les branches principales :**
   - Créez une branche `main` et `develop` si elles n’existent pas :
     ```bash
     git checkout -b main
     git push origin main
     git checkout -b develop
     git push origin develop
     ```

2. **Développer une nouvelle fonctionnalité :**
   - Créez une branche `feature/ma_nouvelle_fonctionnalite` à partir de `develop` :
     ```bash
     git checkout -b feature/ma_nouvelle_fonctionnalite develop
     ```
   - Apportez des modifications, puis créez un commit :
     ```bash
     git add fichier
     git commit -m "Ajout de ma nouvelle fonctionnalité"
     ```
   - Fusionnez la branche `feature` dans `develop` :
     ```bash
     git checkout develop
     git merge feature/ma_nouvelle_fonctionnalite
     ```
   - Poussez les modifications :
     ```bash
     git push origin develop
     ```

3. **Corriger un bug critique :**
   - Créez une branche `hotfix/correction_bug` à partir de `main` :
     ```bash
     git checkout -b hotfix/correction_bug main
     ```
   - Apportez une correction, puis créez un commit :
     ```bash
     git add fichier
     git commit -m "Correction du bug critique"
     ```
   - Fusionnez la branche `hotfix` dans `main` et `develop` :
     ```bash
     git checkout main
     git merge hotfix/correction_bug
     git push origin main

     git checkout develop
     git merge hotfix/correction_bug
     git push origin develop
     ```

---
