---
title: "Sécurité avancée et SecOps"
description: "Déployer des stratégies de sécurité robustes dans un environnement DevOps, maîtriser l’IAM, les scans de vulnérabilités, les pentests, et assurer la conformité réglementaire."
category: "cours-devops"
---

# Cours : Sécurité avancée et SecOps

## Objectifs du cours

À l'issue de ce cours, vous saurez :

* Gérer les identités et les accès (IAM) de manière fine et automatisée
* Détecter et corriger les vulnérabilités (scans, CVE, remédiation)
* Mettre en place des tests de pénétration automatisés ou manuels
* Intégrer les exigences de sécurité dans un pipeline CI/CD
* Assurer la conformité avec des normes réglementaires (HDS, RGPD)

---

## 1. Introduction à SecOps

### Qu'est-ce que SecOps ?

SecOps (Security Operations) désigne la pratique consistant à intégrer les équipes de sécurité (Sec) et d'opérations (Ops) pour renforcer la posture de sécurité globale d'une organisation. Cette collaboration permet de détecter plus rapidement les menaces, d'y répondre efficacement et de renforcer en continu les défenses systémiques.

Contrairement à une approche cloisonnée où la sécurité intervient uniquement en fin de cycle, SecOps fait de la sécurité une activité continue, itérative et pleinement intégrée dans les opérations quotidiennes.

---

### DevSecOps vs SecOps : nuances et articulation

**SecOps** est souvent confondu avec **DevSecOps**, mais les deux approches ciblent des périmètres différents :

* **DevSecOps** cherche à intégrer la sécurité dès la phase de développement, dans les workflows des développeurs et les pipelines CI/CD.
* **SecOps** se concentre sur la réaction aux incidents, la surveillance active, la résilience et la gestion opérationnelle de la sécurité post-déploiement.

Ces deux dimensions sont **complémentaires**. Une stratégie efficace combine les pratiques DevSecOps pour "sécuriser par conception" et SecOps pour réagir, adapter et protéger l'infrastructure en fonctionnement.

---

### Enjeux de la sécurité continue dans les pipelines modernes

Dans les architectures modernes (cloud, microservices, CI/CD rapide), les surfaces d'attaque sont dynamiques et mouvantes. Quelques enjeux clés :

* **Détection précoce** de vulnérabilités dans le code, les dépendances, les images conteneurisées ou l'infrastructure as code.
* **Surveillance continue** des comportements suspects (indicateurs de compromission, scans réseau, etc.).
* **Réaction rapide** aux alertes, en automatisant autant que possible les réponses.
* **Adaptation** constante aux nouvelles menaces : chaque build ou déploiement peut introduire une faille.

---

### Pourquoi la sécurité doit être "by design" dans DevOps ?

Historiquement, la sécurité était gérée à part, souvent en bout de chaîne. Cela entraîne :

* des retards de déploiement,
* des corrections coûteuses car tardives,
* des oublis de contrôles de base.

En adoptant une approche "by design", on intègre :

* la **détection anticipée** des risques,
* la **standardisation des politiques de sécurité**,
* la **responsabilisation des développeurs et ops**,
* l'automatisation des bonnes pratiques (scan, secrets, compliance).

Cela permet de protéger les systèmes sans sacrifier l'agilité, en faisant de la sécurité une **valeur partagée et opérationnelle**.


## 2. Gestion des identités et accès (IAM)

La gestion des identités et des accès (IAM, Identity and Access Management) est au cœur de toute stratégie de sécurité efficace dans un environnement DevOps. Une bonne implémentation d’IAM permet de contrôler qui peut faire quoi, où, et comment, tout en automatisant la gouvernance des droits d’accès.

---

### Principes fondamentaux

#### Principe du moindre privilège (Least Privilege)

Chaque entité (utilisateur, service, machine) ne doit disposer que des permissions strictement nécessaires à son fonctionnement. Cela limite la surface d’attaque potentielle en cas de compromission.

#### ZSP (Zero Standing Privilege)

Aller plus loin que le moindre privilège en supprimant tout accès permanent : les privilèges sont délivrés temporairement à la demande et automatiquement révoqués après usage. Cette approche est particulièrement pertinente pour les environnements critiques ou sensibles.

#### RBAC (Role-Based Access Control)

Les permissions sont attribuées via des rôles définis. Un utilisateur appartient à un ou plusieurs rôles, chaque rôle définissant un ensemble de permissions. Ce modèle est simple et bien adapté à des organisations hiérarchiques.

#### ABAC (Attribute-Based Access Control)

Les permissions sont accordées dynamiquement selon des attributs liés à l’utilisateur, à la ressource ou au contexte (ex. : heure, adresse IP, type d’appareil). ABAC offre une flexibilité accrue mais complexifie la gestion.

---

### Comparaison des IAM dans les principaux cloud providers

| Critère             | AWS IAM                              | Azure AD                         | GCP IAM                        |
| ------------------- | ------------------------------------ | -------------------------------- | ------------------------------ |
| Modèle principal    | RBAC + politiques JSON               | RBAC + Conditions                | RBAC + Policies                |
| Intégration avec AD | Active Directory, Okta, etc.         | Native Azure AD                  | Possible via Cloud Identity    |
| IAM granulaire      | Très granulaire (service, ressource) | Moins granulaire mais cohérent   | Granularité sur les ressources |
| Support ABAC        | Oui (avec tags et conditions)        | Oui (avec conditions dynamiques) | Oui (conditions IAM)           |
| Gestion via IaC     | Terraform, CloudFormation            | Terraform, ARM templates         | Terraform, Deployment Manager  |

Chaque fournisseur propose des mécaniques similaires mais avec des spécificités syntaxiques et fonctionnelles. Il est essentiel de bien comprendre les différences pour sécuriser des infrastructures multi-cloud.

---

### IAM avec Terraform

Terraform permet de gérer l’IAM de manière déclarative et reproductible. Quelques bonnes pratiques :

* Regrouper les rôles et politiques dans des modules réutilisables
* Utiliser des fichiers séparés pour les politiques sensibles (hors du VCS si possible)
* Appliquer des contrôles pré-commit sur les fichiers `.tf` pour éviter les fuites

Exemple pour AWS IAM :

```hcl
resource "aws_iam_policy" "read_only" {
  name   = "ReadOnlyPolicy"
  policy = file("policies/read_only.json")
}

resource "aws_iam_role" "readonly_user" {
  name = "ReadOnlyUser"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "attach" {
  role       = aws_iam_role.readonly_user.name
  policy_arn = aws_iam_policy.read_only.arn
}
```

---

### Audit et rotation automatique des clés d'accès

Les bonnes pratiques incluent :

* **Audit régulier** des accès via les journaux (AWS CloudTrail, GCP Audit Logs, Azure Monitor)
* **Alerting en temps réel** sur les changements d’autorisations critiques
* **Rotation automatique** des clés via des outils comme AWS Secrets Manager ou Vault
* **Expiration et révocation automatique** des tokens inutilisés
* **Suppression immédiate** des accès obsolètes (départ d’un employé, service déprécié)

---

### Outils IAM à connaître

#### AWS IAM

Gestion native des rôles, utilisateurs, groupes et politiques via JSON. Intégration poussée avec tous les services AWS. Compatible avec les approches ZSP et RBAC.

#### Azure Active Directory (Azure AD)

Permet la gestion centralisée des identités pour Azure mais aussi pour des SaaS (Office365, etc.). Fortement couplé avec RBAC Azure et Conditional Access.

#### Okta

Fournisseur IAM SaaS très répandu dans les grandes organisations. Compatible avec SAML, OAuth2, OIDC. Offre une bonne gestion des cycles de vie utilisateurs.

#### Keycloak

Outil IAM open-source orienté microservices. Idéal pour les applications nécessitant une fédération d’identité, du SSO et une personnalisation fine des politiques d’accès.

---

Une gestion IAM robuste est une condition incontournable pour sécuriser un environnement DevOps, en particulier à grande échelle ou en multi-cloud. Le couplage avec l’IaC permet d’en faire une brique reproductible, auditable, et évolutive.


## 3. Scan de vulnérabilités

### Types de vulnérabilités à surveiller

Dans un environnement DevOps, les vulnérabilités peuvent apparaître à différents niveaux. Pour assurer une couverture complète, il est indispensable de connaître les catégories principales :

* **Système d'exploitation (OS)** : failles dans le noyau, bibliothèques système, composants utilisateurs.
* **Conteneurs** : images Docker contenant des versions vulnérables de logiciels ou de bibliothèques.
* **Dépendances logicielles** : failles dans les bibliothèques importées (npm, pip, Maven, etc.).
* **Infrastructure as Code (IaC)** : erreurs de configuration Terraform, Kubernetes YAML, Ansible, etc.

Chacune de ces couches peut être exploitée si elle n’est pas correctement auditée.

---

### Outils de scan utilisés

Une sélection d’outils permet de couvrir différents besoins en détection de vulnérabilités :

* **Trivy** : scanner rapide et polyvalent (conteneurs, dépendances, IaC).
* **Nessus** : scanner réseau commercial avec interface graphique et rapports détaillés.
* **OpenVAS** : alternative open-source à Nessus pour les scans réseaux et OS.
* **Snyk** : spécialisé dans la sécurité des dépendances et des conteneurs.
* **Grype** : scanner open-source focalisé sur les images Docker.

Le choix de l’outil dépend du contexte (CI/CD, analyse ponctuelle, audit réseau) et des contraintes (open-source, performances, intégration).

---

### Intégration dans la CI/CD

L’objectif est d’intégrer le scan de vulnérabilités dans les pipelines pour automatiser la détection et agir rapidement. Voici des exemples d’intégration :

* **GitLab CI** : utilisation de `trivy` ou `snyk` comme étape dans `.gitlab-ci.yml`, avec publication de rapports HTML/JSON.
* **Jenkins** : plugins ou jobs dédiés pour lancer les scans et récupérer les résultats.
* **GitHub Actions** : intégration de `trivy-action` ou `snyk/actions` dans les workflows.

Ces intégrations permettent une vérification systématique à chaque push, merge ou release.

---

### Analyse des résultats et priorisation

Une fois les résultats collectés, il faut savoir les lire et les prioriser :

* Identifier les **CVE** (Common Vulnerabilities and Exposures) les plus critiques.
* Évaluer le **score CVSS** (Common Vulnerability Scoring System).
* Distinguer les **faux positifs** des menaces réelles.
* Prioriser selon la **surface d’attaque** (externe > interne, exposition publique > usage interne).

Des outils comme **DefectDojo** ou **VulnWhisperer** permettent de centraliser et trier les résultats.

---

### Remédiation

Deux approches complémentaires permettent de réduire rapidement les risques :

* **Remédiation automatique** : mise à jour automatique des dépendances (renovate, dependabot), rebuilding d’images avec versions patchées.
* **Remédiation manuelle** : validation humaine avant mise à jour, test des correctifs, ajustement des configurations.

Il est essentiel d’inclure un cycle de validation (test fonctionnel, non-régression) avant déploiement. La correction n’est pas qu’une action technique, c’est un processus à formaliser dans le cycle DevSecOps.


## 4. Tests de pénétration (Pentest)

Les tests de pénétration, ou pentests, permettent d'évaluer la sécurité d'un système en simulant des attaques réelles. Intégrés dans une démarche DevSecOps, ils fournissent un retour direct sur les failles exploitables dans un environnement donné. Ce chapitre détaille les types de tests, les outils à maîtriser, les stratégies d'automatisation, ainsi que les bonnes pratiques d'interprétation des rapports.

### Types de pentest : boîte noire, blanche, grise

* **Boîte noire** : l'attaquant ne dispose d'aucune information préalable. Ce test simule un attaquant externe n'ayant aucun accès privilégié. Il évalue la surface d'exposition publique.
* **Boîte blanche** : le testeur a un accès complet au code source, à l'infrastructure, aux identifiants, etc. Cela permet une revue exhaustive de la sécurité.
* **Boîte grise** : compromis entre les deux, l'attaquant dispose d'informations partielles, comme un accès utilisateur ou certaines documentations. Très représentatif d'un attaquant interne ou d'un utilisateur malveillant.

### Outils classiques : Metasploit, Burp Suite, Nmap, Nikto

* **Metasploit Framework** : plateforme d’exploitation et d’automatisation d’attaques. Idéal pour les tests d'intrusion à grande échelle.
* **Burp Suite** : outil incontournable pour l'audit de sécurité des applications web. Permet l’analyse des requêtes HTTP/HTTPS, l’injection de payloads, et la détection de vulnérabilités.
* **Nmap** : scanner réseau permettant d’identifier les ports ouverts, les services actifs et les configurations anormales.
* **Nikto** : scanner de vulnérabilités web open source capable de détecter des configurations dangereuses, des fichiers sensibles, ou des failles connues.

### Simulation d'attaques internes/externes

* **Attaques internes** : test de ce qu’un utilisateur malveillant pourrait faire avec des droits d’accès limités. Cela inclut l’escalade de privilèges, l’accès aux secrets, et le mouvement latéral dans le réseau.
* **Attaques externes** : simulations de hackers sans accès initial, focalisés sur les failles réseau, web ou API exposées. Cela inclut le fingerprinting, la recherche de sous-domaines, l’exploitation de failles CVE publiques.

### Automatisation des tests avec des outils open source

* Intégration de Metasploit dans des scripts via son API.
* Utilisation de Burp Suite Community avec des scripts de crawl et de fuzzing automatisés.
* Chaining avec Jenkins/GitLab CI pour déclencher des pentests à chaque mise en production.
* Scripting avec Python ou Bash pour enchaîner des scans Nmap, Nikto, et des exploits conditionnels.

### Évaluation et rapport : comment les lire, interpréter et agir

* **Priorisation** : toutes les vulnérabilités n’ont pas le même impact. Utiliser les scores CVSS et les critères métier pour classer les failles.
* **Rapport de pentest** : doit contenir une synthèse exécutive, une description technique des failles, une preuve d’exploitation, une gravité, et des recommandations concrètes.
* **Actions** : corriger les vulnérabilités critiques immédiatement, planifier les autres en backlog sécurisé. Réévaluer après chaque patch.
* **Capitalisation** : archiver les rapports, améliorer les politiques de sécurité et intégrer les leçons dans la documentation technique.

---

Maîtriser les tests de pénétration permet non seulement de réagir aux menaces actuelles, mais aussi d'anticiper celles à venir. Leur intégration dans les workflows DevOps contribue à une posture de sécurité proactive et continue.


## 5. Intégration dans le pipeline CI/CD

L'intégration de la sécurité dans les pipelines CI/CD garantit que chaque modification du code est testée pour ses impacts fonctionnels **et** pour sa robustesse face aux attaques. Ce chapitre détaille la construction d'un pipeline de sécurité cohérent, les outils à mobiliser, et les mécanismes d'alerting.

### Pipeline de sécurité idéal : ordonnancement des tests

Un pipeline de sécurité doit comporter des étapes ordonnées pour garantir l'efficacité des détections :

1. **Secret scanning** (dès les pre-commit hooks)
2. **Linting sécuritaire / SAST** (Static Application Security Testing)
3. **Scan de vulnérabilités des dépendances**
4. **Scan des conteneurs / images Docker**
5. **Scan de l'IaC (Terraform, etc.)**
6. **Tests de pentest automatisés** (en pré-prod)
7. **Tests end-to-end + fuzzing** (optionnel)

Chaque étape renvoie ses résultats au moteur de CI pour déclencher ou bloquer la suite du pipeline.

### Git hooks, pre-commit et secret scanning

* **Git hooks** permettent de déclencher des actions avant un commit ou un push.
* L'étape **pre-commit** peut inclure des outils comme `detect-secrets`, `gitleaks` ou `truffleHog` pour empêcher l'ajout de secrets dans le code.
* Ces outils peuvent être chaînés dans des workflows CI pour scanner l'ensemble de l'historique ou les diff du code.

### Politiques de build bloquantes

* Toute alerte critique (CVE, secret, faille SAST) peut être configurée pour **faire échouer le build**.
* Cela garantit que **rien n'est déployé** tant que les failles ne sont pas résolues.
* Pour les vulnérabilités de niveau moyen ou faible, une politique de tolérance peut être mise en place, avec alertes mais sans blocage.

### Exemple de pipeline GitLab CI intégrant scan + pentest

```yaml
stages:
  - lint
  - security
  - test
  - deploy

lint:
  script:
    - eslint .

secret_scan:
  stage: security
  script:
    - trufflehog filesystem .

sast:
  stage: security
  script:
    - snyk test

docker_scan:
  stage: security
  script:
    - trivy image monimage:latest

iac_scan:
  stage: security
  script:
    - checkov -d infrastructure/

pentest:
  stage: security
  script:
    - python scripts/run_pentest.py

deploy:
  script:
    - ./deploy.sh
```

Ce pipeline enchaîne les différentes étapes de scan et bloque le déploiement en cas de vulnérabilité critique.

### Alerting et reporting automatisé

* Chaque outil de sécurité doit **générer un rapport** en JSON, SARIF ou tout autre format parseable.
* Ces rapports peuvent être :

  * Intégrés dans une interface de suivi (SonarQube, GitLab Security Dashboard, etc.)
  * Envoyés par mail, Slack ou webhook selon la gravité
  * Persistés dans un bucket pour audit ou régression

---

L'intégration systématique de la sécurité dans la CI/CD permet une détection anticipée des risques et une réaction rapide. Elle assure une traçabilité complète des vulnérabilités et renforce la qualité globale du produit dès la phase de développement.


## 6. Conformité et audit

Assurer la conformité et la traçabilité des actions est indispensable pour répondre aux exigences réglementaires et garantir une posture de sécurité solide. Ce chapitre explore les normes les plus courantes, la mise en place de contrôles automatiques et les outils pour la collecte et l'analyse des journaux.

### Qu'est-ce que la conformité dans un contexte cloud ?

Dans un environnement cloud, la conformité vise à s'assurer que les systèmes, données et pratiques opérationnelles respectent des règles internes et des obligations légales ou industrielles. Cela inclut :

* La protection des données personnelles et sensibles
* Le suivi des accès et actions
* L'application de politiques de sécurité documentées
* La préparation à des audits réguliers

Le cloud ajoute de la complexité à ces enjeux : partages de responsabilité, multiplicité des fournisseurs, scalabilité dynamique, réglementations transfrontalières.

### HDS, RGPD, ISO 27001, PCI-DSS : exigences et spécificités

* **HDS (Hébergement de Données de Santé)** : obligation pour les prestataires stockant ou traitant des données de santé. Axé sur la souveraineté, la traçabilité, le cloisonnement logique et physique.
* **RGPD** : cadre européen pour la protection des données personnelles. Implique la minimisation des données, la transparence, la traçabilité, et le droit à l'oubli.
* **ISO 27001** : standard international pour les systèmes de management de la sécurité de l'information (SMSI). Requiert une analyse des risques, des contrôles techniques et organisationnels, et des audits internes.
* **PCI-DSS** : norme de sécurité pour les données de paiement. Implique chiffrement, ségrégation des rôles, tests réguliers, et surveillance continue.

### Mise en place de contrôles automatiques (OPA, Conftest)

* **OPA (Open Policy Agent)** : moteur de politiques permettant de définir des règles de conformité en langage Rego. Exemple : empêcher tout déploiement de pod Kubernetes sans réseau chiffré.
* **Conftest** : outil de test de configuration. Permet de valider fichiers Terraform, Kubernetes YAML, etc., contre des règles Rego. Idéal pour les contrôles préventifs dans la CI.

Intégrer ces outils dans le pipeline CI/CD garantit que les configurations déployées sont conformes aux politiques internes et aux réglementations.

### Systèmes de preuve et journaux d'audit (SIEM, ELK, Wazuh)

* **SIEM (Security Information and Event Management)** : collecte, corrélation et analyse en temps réel des événements de sécurité. Exemples : Splunk, IBM QRadar, Wazuh (open source).
* **ELK Stack (Elasticsearch, Logstash, Kibana)** : solution d'analyse de logs très populaire. Permet d'aggréger, visualiser et filtrer les journaux.
* **Wazuh** : plateforme open source combinant analyse des logs, détection d'intrusions (HIDS), et outils de conformité.

Une bonne stratégie d'audit inclut :

* L'activation du logging sur toutes les ressources critiques
* La centralisation des journaux
* L'automatisation des alertes et des rétentions
* Des dashboards de visualisation clairs pour la détection et les audits réglementaires

---

Intégrer la conformité et l'audit dans une approche DevSecOps permet de détecter les déviations, réagir rapidement, et prouver à tout moment la maîtrise de ses systèmes.


## 7. TP pratiques

## 7. TP pratiques — TP1 : Mise en place de politiques IAM avec Terraform (AWS)

Ce TP vous guide dans la création et l'application de politiques IAM personnalisées sur AWS, à l'aide de Terraform. Vous partirez de zéro et aboutirez à une infrastructure sécurisée et entièrement codée dans des fichiers `.tf`, avec des permissions strictement minimales pour un utilisateur donné.

---

### Objectifs

* Créer une politique IAM restreinte avec Terraform
* Déployer un utilisateur IAM avec cette politique
* Vérifier et tester les permissions assignées
* Appliquer les bonnes pratiques de séparation des rôles

---

### Prérequis

#### Outils nécessaires

* Un compte **AWS** actif avec droits d'administration
* **Terraform** installé sur votre machine (version >= 1.0)

  ```bash
  sudo apt update && sudo apt install terraform -y
  ```
* AWS CLI configuré avec des credentials valides

  ```bash
  aws configure
  ```
* Un éditeur de texte comme VS Code (recommandé)

#### Configuration AWS CLI

Entrez vos identifiants IAM Admin existants :

```bash
aws configure
```

Répondez aux questions :

```
AWS Access Key ID: XXXXXXXXXXXXXXXXXX
AWS Secret Access Key: XXXXXXXXXXXXXXXXXXXXXXXXX
Default region name: eu-west-3
Default output format: json
```

---

### Étape 1 : Initialiser le projet Terraform

#### a. Créez un dossier projet

```bash
mkdir terraform_iam_policy && cd terraform_iam_policy
```

#### b. Fichier `main.tf`

Créez le fichier `main.tf` avec le contenu suivant :

```hcl
provider "aws" {
  region = "eu-west-3"
}
```

#### c. Initialisation de Terraform

```bash
terraform init
```

---

### Étape 2 : Définir une politique IAM personnalisée

#### a. Créez un fichier `iam_policy.tf`

```bash
touch iam_policy.tf
```

#### b. Contenu de `iam_policy.tf`

```hcl
resource "aws_iam_policy" "readonly_s3" {
  name        = "ReadonlyS3"
  description = "Accès en lecture seule à S3"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::*"
        ]
      }
    ]
  })
}
```

---

### Étape 3 : Créer un utilisateur IAM

#### a. Fichier `iam_user.tf`

```bash
touch iam_user.tf
```

#### b. Contenu de `iam_user.tf`

```hcl
resource "aws_iam_user" "user_readonly" {
  name = "readonly_user"
}

resource "aws_iam_user_policy_attachment" "attach_readonly" {
  user       = aws_iam_user.user_readonly.name
  policy_arn = aws_iam_policy.readonly_s3.arn
}

resource "aws_iam_access_key" "readonly_user_key" {
  user = aws_iam_user.user_readonly.name
}
```

---

### Étape 4 : Appliquer les changements

#### a. Valider la configuration

```bash
terraform validate
```

#### b. Afficher le plan d'exécution

```bash
terraform plan
```

#### c. Appliquer

```bash
terraform apply -auto-approve
```

Une fois la commande terminée, notez bien les identifiants générés :

* AWS\_ACCESS\_KEY\_ID
* AWS\_SECRET\_ACCESS\_KEY

---

### Étape 5 : Vérifier les permissions

Créez un nouveau profil avec les identifiants :

```bash
aws configure --profile readonly_user
```

Testez une commande autorisée :

```bash
aws s3 ls --profile readonly_user
```

Testez une commande interdite :

```bash
aws s3 rm s3://votre-bucket/fichier.txt --profile readonly_user
```

Vous devriez obtenir une erreur d'autorisation.

---

### Étape 6 : Séparation des rôles et bonnes pratiques

Ajoutez un rôle distinct au lieu d’utiliser un utilisateur statique :

```hcl
resource "aws_iam_role" "read_role" {
  name = "ReadOnlyRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_readonly" {
  role       = aws_iam_role.read_role.name
  policy_arn = aws_iam_policy.readonly_s3.arn
}
```

---

### Étape 7 : Nettoyage

Quand vous avez terminé le test :

```bash
terraform destroy -auto-approve
```

---




## 7. TP pratiques — TP2 : Intégration de Trivy et Nessus dans GitLab CI

Ce TP vous guide dans l'intégration complète de deux scanners de vulnérabilités dans un pipeline CI/CD GitLab : **Trivy** (open-source, rapide) et **Nessus** (complet et très détaillé). L'objectif est de créer un pipeline sécurisé capable de bloquer les builds en cas de failles critiques.

---

### Objectifs

* Ajouter une phase de scan de vulnérabilités dans un pipeline GitLab
* Utiliser **Trivy** pour scanner des images Docker
* Utiliser **Nessus** pour scanner une instance déployée
* Automatiser les alertes en cas de vulnérabilité
* Empêcher le déploiement si des failles critiques sont détectées

---

### Prérequis

#### Accès / outils :

* Un projet GitLab avec pipeline CI/CD activé
* Docker installé (localement ou runner GitLab Docker-enabled)
* Un runner GitLab (hosté ou auto-hébergé)
* Une image Docker à scanner (ou à construire dans le pipeline)
* Une instance Nessus installée (sur VM locale ou EC2)

---

### Etape 1 : Intégration de Trivy dans GitLab CI

#### a. Ajouter le scanner Trivy

Créez un fichier `.gitlab-ci.yml` ou modifiez l’existant :

```yaml
tst_trivy_scan:
  image: aquasec/trivy:latest
  stage: test
  variables:
    TRIVY_EXIT_CODE: 1
  script:
    - trivy image --exit-code $TRIVY_EXIT_CODE --severity CRITICAL,HIGH yourregistry/yourimage:latest
  allow_failure: false
  only:
    - merge_requests
    - main
```

Explication :

* `image` : utilise l'image officielle de Trivy
* `--exit-code 1` : échoue le job si des failles sévères sont présentes
* `allow_failure: false` : empêche le build de continuer si échec

#### b. Personnalisation des seuils

Vous pouvez aussi scanner les dépendances applicatives (si le projet contient un `package.json`, `go.mod`, etc.) :

```bash
trivy fs --exit-code 1 --severity CRITICAL,HIGH .
```

Ajoutez cette commande en plus si vous voulez scanner tout le répertoire projet.

#### c. Ajout de reporting

Ajoutez un rapport exporté :

```bash
trivy image -f json -o trivy_report.json yourimage:latest
```

Puis :

```yaml
artifacts:
  paths:
    - trivy_report.json
  when: always
```

---

### Etape 2 : Configuration de Nessus pour scan distant

#### a. Installer Nessus (si ce n’est pas déjà fait)

Téléchargement sur : [https://www.tenable.com/downloads/nessus](https://www.tenable.com/downloads/nessus)

Exemple pour Ubuntu 22.04 :

```bash
wget https://downloads.nessus.org/nessus3dl.php?file=Nessus-10.x.x-Ubuntu22.deb&licence_accept=yes&t=curl
sudo dpkg -i Nessus-10.x.x-Ubuntu22.deb
sudo systemctl start nessusd
```

Allez sur `https://localhost:8834` pour configurer un compte admin.

#### b. Activer l’API de Nessus

Une fois connecté à l'interface web :

1. Allez dans "Settings" > "My Account"
2. Générez un **API Key + Secret**
3. Notez-les : ils seront utilisés par le script CI

#### c. Créer une politique de scan

1. Dans Nessus : "Policies" > "New Scan Policy"
2. Choisissez un scan type (Basic Network Scan)
3. Enregistrez sous le nom `GitLabPolicy`

---

### Etape 3 : Automatiser le lancement de Nessus depuis GitLab CI

#### a. Créer un script bash `nessus_scan.sh`

```bash
#!/bin/bash
NESSUS_HOST="https://nessus-instance:8834"
ACCESS_KEY="$NESSUS_ACCESS_KEY"
SECRET_KEY="$NESSUS_SECRET_KEY"
TARGET_IP="$TARGET_IP"

# Auth
TOKEN=$(curl -s -k -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ACCESS_KEY\", \"password\":\"$SECRET_KEY\"}" \
  $NESSUS_HOST/session | jq -r .token)

# Lancer le scan
SCAN_ID=$(curl -s -k -X POST \
  -H "X-Cookie: token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"uuid\":\"basic_network_scan\", \"settings\":{\"name\":\"GitLabScan\",\"policy_id\":1,\"text_targets\":\"$TARGET_IP\"}}" \
  $NESSUS_HOST/scans | jq -r .scan.id)

# Lancer le scan
curl -s -k -X POST \
  -H "X-Cookie: token=$TOKEN" \
  $NESSUS_HOST/scans/$SCAN_ID/launch

# Attendre 2 minutes (ou ajuster selon le scope)
sleep 120

# Exporter le rapport
REPORT_ID=$(curl -s -k -X POST \
  -H "X-Cookie: token=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "pdf"}' \
  $NESSUS_HOST/scans/$SCAN_ID/export | jq -r .file)

# Téléchargement
curl -k -H "X-Cookie: token=$TOKEN" \
  $NESSUS_HOST/scans/$SCAN_ID/export/$REPORT_ID/download \
  -o nessus_report.pdf
```

#### b. Ajoutez ce script au repo GitLab

* Créez un fichier `nessus_scan.sh`
* Ajoutez les permissions :

```bash
chmod +x nessus_scan.sh
```

#### c. Ajoutez les variables dans GitLab CI/CD

GitLab > Settings > CI/CD > Variables

* `NESSUS_ACCESS_KEY`
* `NESSUS_SECRET_KEY`
* `TARGET_IP` : IP de l’instance cible (EC2, container exposé)

#### d. Ajoutez le job dans `.gitlab-ci.yml`

```yaml
nessus_scan:
  image: curlimages/curl:latest
  stage: test
  script:
    - apk add jq
    - ./nessus_scan.sh
  artifacts:
    paths:
      - nessus_report.pdf
  only:
    - main
```

---

### Etape 4 : Alerting et build bloquant

Ajoutez un parsing simple pour générer une alerte si des failles sont critiques (voir contenu JSON si export JSON au lieu de PDF).

Exemple :

```bash
if grep -q "Critical" trivy_report.json; then
  echo "[!] Vulnérabilités critiques trouvées"
  exit 1
fi
```

Ajoutez ce test à la fin du job `tst_trivy_scan` pour empêcher les déploiements non sécurisés.

---


## 7. TP pratiques — TP3 : Lancer et analyser un test de pénétration avec Burp Suite et Nmap

Ce TP vous guide pas à pas dans la réalisation d'un test de pénétration ciblé en combinant **Nmap** pour la reconnaissance réseau et **Burp Suite** pour l’analyse d’applications web. Chaque action est explicitée pour ne laisser aucune ambiguïté.

---

### Objectifs

* Scanner une machine cible avec Nmap pour identifier les services ouverts
* Analyser une application web vulnérable avec Burp Suite
* Tester manuellement les failles classiques (XSS, SQLi, directory traversal...)
* Documenter rigoureusement les résultats

---

### Prérequis

Matériel :

* Deux machines virtuelles dans le même réseau (NAT ou réseau privé)

  * Une machine **attaquante** (Kali Linux de préférence)
  * Une machine **cible** (ex: **DVWA** ou **Metasploitable2**)

Logiciels à installer :

* **Nmap** : souvent déjà installé sur Kali, sinon :

  ```bash
  sudo apt update && sudo apt install nmap
  ```
* **Burp Suite Community** (fourni avec Kali, sinon : [https://portswigger.net/burp](https://portswigger.net/burp))
* **Navigateur Firefox** (préférable pour la configuration proxy)

---

### Étape 1 : Identifier l'adresse IP de la cible

Sur la machine **cible** :

```bash
ip a
```

Repérez l'adresse IP associée à l'interface réseau (souvent `eth0` ou `ens33`).
Exemple : `192.168.56.102`

Conservez cette IP, elle vous servira tout au long du TP.

---

### Étape 2 : Scanner la machine cible avec Nmap

Sur la machine **Kali**, ouvrez un terminal.

**1. Scan de ports rapide** :

```bash
nmap -sS -T4 -Pn 192.168.56.102
```

Explications :

* `-sS` : scan SYN (rapide et furtif)
* `-T4` : vitesse de scan agressive
* `-Pn` : ne pas faire de ping préalable (utile si ICMP est bloqué)

**2. Scan complet avec détection de services :**

```bash
nmap -sV -O -A -p- 192.168.56.102
```

* `-sV` : détection des versions de services
* `-O` : détection du système d’exploitation
* `-A` : détection avancée (scripts NSE, traceroute...)
* `-p-` : scan **tous** les ports (1 à 65535)

**3. Interprétation des résultats** :
Notez les ports ouverts et les services associés. Recherchez en priorité les ports web : `80`, `443`, `8080`...

---

### Étape 3 : Configurer Burp Suite

#### a. Lancer Burp Suite

Sur Kali :

```bash
burpsuite &
```

Ou utilisez l’interface graphique :

* Menu → Applications → Web Application Analysis → Burp Suite

Créez un projet temporaire → Next → Start Burp.

#### b. Configurer Firefox pour intercepter le trafic

1. Ouvrez Firefox → Menu ≡ → Paramètres → Réseau → Paramètres...
2. Cochez "Configuration manuelle du proxy"

   * HTTP Proxy : `127.0.0.1`
   * Port : `8080`
   * Cochez "Utiliser ce proxy pour tous les protocoles"
3. Cliquez sur OK.

#### c. Importer le certificat Burp

1. Dans Firefox : tapez `http://burpsuite` → cliquez sur le lien "CA Certificate"
2. Téléchargez le fichier `.cer`
3. Allez dans : Paramètres → Vie privée et sécurité → Certificats → Voir les certificats → Importer
4. Cochez **"Identifier les sites web"** lors de l’import

---

### Étape 4 : Intercepter et analyser une application vulnérable

1. Dans Firefox, visitez l’adresse IP de la cible (ex. `http://192.168.56.102`)
2. Dans Burp Suite → onglet Proxy → Intercept : vérifiez que "Intercept is ON"
3. La requête HTTP s'affiche → cliquez sur "Forward" pour la laisser passer
4. Arrêtez l’interception si vous voulez naviguer normalement ("Intercept is OFF")

#### Analyser la requête dans Burp

* Allez dans l’onglet **HTTP history**
* Sélectionnez une requête → cliquez droit → "Send to Repeater"
* Onglet **Repeater** : modifiez les paramètres, observez les réponses

---

### Étape 5 : Tester manuellement des failles classiques

Dans les formulaires ou les URL de l'application vulnérable, testez les cas suivants :

**Injection SQL :**

```sql
admin' OR '1'='1
```

**XSS :**

```html
<script>alert('XSS')</script>
```

**Traversal de répertoire :**

```bash
../../../../etc/passwd
```

Notez :

* Comportement de la page
* Codes HTTP (500, 403, 200...)
* Messages d’erreur révélateurs

---

### Étape 6 : Rapport détaillé

Pour chaque faille détectée, écrivez dans un fichier texte ou un outil comme Dradis :

* **Nom de la vulnérabilité** (ex : XSS stockée)
* **Preuve** : capture d’écran, requête interceptée
* **Réponse serveur** ou résultat visuel
* **Gravité** : critique, élevé, moyen, faible
* **Correction proposée** : input sanitization, désactivation de services, patch

Structure du rapport :

1. Introduction
2. Méthodologie
3. Détails techniques des vulnérabilités
4. Recommandations

---

### Étape 7 : Bonus — premières mesures défensives

Si vous avez accès à la machine vulnérable :

* Désactivez les services inutiles
* Activez un firewall (ex: `ufw enable` sur Ubuntu)
* Mettez à jour les paquets :

```bash
sudo apt update && sudo apt upgrade
```

* Testez le déploiement d’un WAF comme ModSecurity



## 7. TP pratiques — TP4 : Mise en place de contrôles OPA dans un déploiement Kubernetes

Ce TP vous guide pas à pas pour ajouter des contrôles de politiques de sécurité personnalisés à un cluster Kubernetes à l’aide d’**OPA Gatekeeper**. Chaque commande est expliquée en détail, afin que vous puissiez suivre sans aucune connaissance préalable de l’outil.

---

### Objectifs

* Installer et configurer OPA Gatekeeper sur un cluster Kubernetes
* Appliquer des politiques de sécurité (interdiction d'images sans tag, restriction des namespaces...)
* Empêcher le déploiement de ressources non conformes
* Observer et comprendre les violations

---

### Prérequis

* Un cluster Kubernetes fonctionnel (minikube, k3d, kind ou un cluster distant)
* `kubectl` installé et configuré pour pointer vers votre cluster
* Accès à Internet

---

### Étape 1 : Déploiement d’OPA Gatekeeper

1. **Créez un namespace pour Gatekeeper :**

```bash
tkubectl create ns gatekeeper-system
```

2. **Déployez Gatekeeper avec le manifest officiel :**

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.15/deploy/gatekeeper.yaml
```

3. **Vérifiez que les pods sont bien déployés :**

```bash
kubectl get pods -n gatekeeper-system
```

Attendez que tous les pods soient en `Running`. Si besoin :

```bash
kubectl describe pod -n gatekeeper-system <nom_du_pod>
```

---

### Étape 2 : Créer une première politique (constraint template)

Cette politique interdit les pods qui utilisent une image sans tag (ex : `nginx` au lieu de `nginx:1.25.2`).

1. **Créez le fichier `k8srequiredimagetag_template.yaml` :**

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredimagetag
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredImageTag
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredimagetag

        violation[{
          "msg": msg,
          "details": {"container": container.name}
        }] {
          container := input.review.object.spec.containers[_]
          not endswith(container.image, ":latest")
          not contains(container.image, ":")
          msg := sprintf("Image '%v' does not have a tag", [container.image])
        }
```

2. **Appliquez ce template :**

```bash
kubectl apply -f k8srequiredimagetag_template.yaml
```

---

### Étape 3 : Appliquer la contrainte (constraint)

1. **Créez le fichier `require-imagetag.yaml` :**

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredImageTag
metadata:
  name: require-imagetag
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
```

2. **Appliquez la contrainte :**

```bash
kubectl apply -f require-imagetag.yaml
```

---

### Étape 4 : Tester la politique

1. **Créez un pod avec une image sans tag :**

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: pod-sans-tag
spec:
  containers:
  - name: nginx
    image: nginx
EOF
```

2. **Résultat attendu :**
   Le pod est rejeté par l'admission controller Gatekeeper.

Pour vérifier le message d'erreur :

```bash
kubectl describe k8srequiredimagetag.constraints.gatekeeper.sh require-imagetag
```

Ou simplement observer le message d’erreur retourné lors de l’application du pod.

---

### Étape 5 : Observer les violations

Gatekeeper crée des objets de type `ConstraintViolation` visibles avec la commande :

```bash
kubectl get constrainttemplates
kubectl get constraints
```

---

### Étape 6 : Autres politiques utiles

Voici quelques politiques à essayer de votre côté :

* **K8sPSPHostNetwork** : interdit les pods avec `hostNetwork: true`
* **K8sRequiredLabels** : impose la présence de labels (ex: `env=prod`)
* **K8sNoPrivilegedContainers** : empêche l’utilisation de conteneurs privilégiés

Toutes sont disponibles ici :
[https://github.com/open-policy-agent/gatekeeper-library](https://github.com/open-policy-agent/gatekeeper-library)

---

### Étape 7 : Nettoyage (optionnel)

Pour tout supprimer :

```bash
kubectl delete -f require-imagetag.yaml
kubectl delete -f k8srequiredimagetag_template.yaml
kubectl delete -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.15/deploy/gatekeeper.yaml
kubectl delete ns gatekeeper-system
```

---


## 7. TP pratiques — TP5 : Réalisation d'un audit RGPD avec journalisation et alerting

Ce TP propose une mise en situation opérationnelle pour réaliser un audit de conformité RGPD, avec mise en place de journaux d'audit et d'un système d'alerting. L'objectif est d'automatiser la détection d'activités non conformes au RGPD dans un système d'information.

---

### Objectifs

* Identifier les obligations RGPD techniques et organisationnelles
* Mettre en place la journalisation sur un système cible
* Déployer une stack d'analyse (Wazuh ou ELK)
* Créer des règles de détection et des alertes personnalisées

---

### Prérequis

Matériel :

* Une VM Ubuntu Server 22.04 (nommée **système cible**)
* Une VM Kali ou Debian pour l’administration

Logiciels à installer :

* **Wazuh** (ou stack ELK si préféré)
* **Auditd** (outil de journalisation Linux)
* **Filebeat** (si usage ELK)

---

### Étape 1 : Identifier les données à risque et les obligations RGPD

#### a. Données personnelles typiques :

* Nom, prénom, email, adresse IP
* Logs de connexion
* Fichiers contenant des identifiants, mots de passe, cookies, tokens

#### b. Obligations techniques RGPD

* Traçabilité des accès aux données sensibles
* Limitation des durées de conservation
* Journalisation et détection des comportements anormaux

Créez un fichier `rgpd_checklist.md` avec ces informations, à conserver comme guide d'audit.

---

### Étape 2 : Installer et configurer auditd sur la machine cible

```bash
sudo apt update && sudo apt install auditd audispd-plugins -y
```

Vérifiez que le service fonctionne :

```bash
sudo systemctl status auditd
```

Créez une règle d’audit sur un répertoire contenant des données sensibles :

```bash
echo "-w /home/user/donnees_rgpd/ -p rwxa -k acces_rgpd" | sudo tee -a /etc/audit/rules.d/rgpd.rules
```

Rechargez les règles :

```bash
sudo augenrules --load
```

Test : accédez ou modifiez un fichier dans ce répertoire puis exécutez :

```bash
sudo ausearch -k acces_rgpd
```

---

### Étape 3 : Installer Wazuh pour centraliser les journaux

#### a. Déploiement via script automatique :

```bash
curl -sO https://packages.wazuh.com/4.6/wazuh-install.sh
chmod +x wazuh-install.sh
sudo ./wazuh-install.sh -a
```

Ce script installe :

* Wazuh Manager
* Filebeat
* Elasticsearch
* Kibana avec le plugin Wazuh

#### b. Accéder à l’interface web

* URL : `https://<IP-VOTRE-VM>:5601`
* Identifiants par défaut : `admin / admin`

---

### Étape 4 : Connecter la machine cible comme agent Wazuh

Sur la machine cible :

```bash
curl -sO https://packages.wazuh.com/4.x/apt/wazuh-agent.deb
sudo dpkg -i wazuh-agent.deb
```

Configurez l’adresse IP du manager Wazuh dans `/var/ossec/etc/ossec.conf` :

```xml
<server>
  <address>IP_DU_MANAGER</address>
</server>
```

Démarrez l’agent :

```bash
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

Depuis l’interface Wazuh, vérifiez que l’agent apparaît comme "connected".

---

### Étape 5 : Créer des règles de détection et des alertes

Dans l’interface Wazuh :

1. Allez dans **Rules**
2. Créez une règle personnalisée pour les événements d'auditd avec le tag `acces_rgpd`
3. Exemple :

```xml
<rule id="100101" level="10">
  <if_sid>80700</if_sid>
  <match>acces_rgpd</match>
  <description>Accès à des données personnelles</description>
</rule>
```

4. Redémarrez le service Wazuh Manager pour appliquer la règle :

```bash
sudo systemctl restart wazuh-manager
```

5. Générez une alerte en accédant à un fichier sensible :

```bash
cat /home/user/donnees_rgpd/info.txt
```

Vérifiez dans l’interface que l’alerte a bien été déclenchée.

---

### Étape 6 : Exporter un rapport RGPD automatisé

#### a. Créer un tableau de bord Kibana dédié aux accès RGPD

1. Connectez-vous à l'interface Kibana : `https://<IP-VOTRE-VM>:5601`
2. Cliquez sur **Dashboard > Create dashboard**
3. Donnez-lui un nom comme `Audit RGPD`
4. Cliquez sur **Add from library** ou **Create new visualization**
5. Choisissez **Lens** pour créer une visualisation simple
6. Source de données : sélectionnez l'index `wazuh-alerts-*`
7. Dans l’éditeur de visualisation :

   * `Drag-and-drop` le champ `rule.description` dans la zone de filtre
   * Filtrez sur la valeur : `Accès à des données personnelles`
   * Ajoutez ensuite un champ `@timestamp` en axe X (Time histogram)
   * En axe Y, utilisez `Count` pour obtenir le nombre d'événements
8. Sauvegardez la visualisation et ajoutez-la au tableau de bord

#### b. Ajouter des filtres dynamiques (facultatif mais conseillé)

1. Cliquez sur **Add filter** > `agent.name` pour filtrer par machine
2. Ajoutez également `user.name` si vous voulez filtrer par utilisateur
3. Vous pouvez aussi ajouter `event.type`, `event.action` ou tout autre champ pertinent

#### c. Exporter manuellement un rapport PDF ou CSV

1. Cliquez sur l’icône en haut à droite du tableau de bord : `Share`
2. Choisissez `PDF Reports` ou `CSV Reports`
3. Si `PDF Reports` n’est pas activé, installez `Reporting` via le menu Stack Management > Kibana > Reporting
4. Cliquez sur `Generate report` > Téléchargez le fichier une fois prêt

#### d. Planifier un export périodique automatique (si activé dans Kibana)

1. Accédez à **Stack Management > Reporting**
2. Cliquez sur `Create a new job` > Sélectionnez votre dashboard
3. Choisissez `Interval` : quotidien, hebdomadaire, etc.
4. Configurez l’email destinataire
5. Sauvegardez : Kibana générera et enverra les rapports automatiquement

#### e. Vérification et conservation

1. Vérifiez que les données dans le rapport sont à jour
2. Stockez les rapports dans un répertoire `/var/audit_rgpd/reports/` sur une machine protégée
3. Automatisez la rotation des rapports avec un script cron si besoin

```bash
# Exemple de script de rotation (à placer dans /etc/cron.daily/rotate_rgpd.sh)
#!/bin/bash
find /var/audit_rgpd/reports/ -type f -mtime +30 -delete
```

Ce rapport constitue une preuve d'audit conforme aux obligations de documentation RGPD.

Wazuh permet d’exporter des rapports de journaux filtrés. Pour cela :

1. Créez un tableau de bord Kibana détaillé sur le tag `acces_rgpd` en suivant les étapes ci-dessous :

2. Accédez à l’interface Kibana à l’adresse `https://<IP-VOTRE-VM>:5601` avec votre navigateur.

3. Dans le menu latéral, cliquez sur **Dashboard** puis sur le bouton **Create dashboard** en haut à droite.

4. Nommez votre dashboard, par exemple `Audit RGPD - Accès Données Sensibles`, puis cliquez sur **Create new visualization**.

5. Choisissez **Lens** comme type de visualisation. Vous allez voir une interface de glisser-déposer.

6. Dans la source de données, sélectionnez l’index `wazuh-alerts-*`.

7. Dans la section de configuration :

   * Glissez le champ `rule.description` dans la section centrale.
   * Cliquez sur le filtre de `rule.description` et entrez : `Accès à des données personnelles`.
   * Ajoutez ensuite le champ `@timestamp` dans l’axe X (horizontal) sous forme d’**Histogramme temporel**.
   * Pour l’axe Y (vertical), sélectionnez **Count** afin de compter le nombre d’événements détectés.

8. Cliquez sur **Save and return** pour enregistrer votre visualisation.

9. De retour dans le dashboard, cliquez sur **Add from library** pour ajouter la visualisation que vous venez de créer.

10. Vous pouvez répéter l’opération pour créer d’autres visualisations pertinentes, comme :

    * Histogramme des accès par `user.name`
    * Graphique à secteurs des machines concernées via `agent.name`
    * Tableau des types d’événements (`event.type`)

11. Une fois toutes vos visualisations ajoutées, cliquez sur **Save** pour enregistrer définitivement le dashboard.

12. Pour valider la pertinence de votre dashboard, accédez à un fichier sensible sur la machine cible (comme `/home/user/donnees_rgpd/info.txt`), attendez quelques secondes, puis rafraîchissez le dashboard.

Vous devez observer une entrée correspondant à l’alerte `Accès à des données personnelles` dans la timeline de votre dashboard.

2\. Filtrez par date, type d’accès, utilisateur

3\. Exportez au format CSV ou PDF

Vous pouvez aussi planifier des rapports périodiques avec alertes email.

---

### Étape 7 : Checklist de vérification finale

Avant de considérer l'audit RGPD comme terminé, suivez minutieusement cette checklist point par point. Cochez chaque item une fois validé :

#### ✅ Vérifications sur la journalisation

* [ ] Le service `auditd` est installé et actif (`systemctl status auditd` vérifié)
* [ ] Les règles d'audit sont bien en place (`/etc/audit/rules.d/rgpd.rules` contient les règles pertinentes)
* [ ] Les événements d’accès aux fichiers sensibles sont correctement enregistrés dans `ausearch`

#### ✅ Vérifications sur l'intégration avec Wazuh

* [ ] L’agent Wazuh est installé sur la machine cible
* [ ] L’agent Wazuh est en ligne (visible comme "connected" dans l’interface web du manager)
* [ ] Le champ `rule.description` contient bien les libellés d'alerte RGPD comme prévu

#### ✅ Vérifications sur les règles d’alerte

* [ ] Une règle personnalisée Wazuh a été ajoutée avec `match: acces_rgpd`
* [ ] Cette règle est active (testé via accès à un fichier sensible, avec alerte visible dans Kibana)

#### ✅ Vérifications sur Kibana et les rapports

* [ ] Le dashboard `Audit RGPD` existe et contient au moins une visualisation pertinente
* [ ] Le champ `@timestamp` permet de filtrer les événements dans le temps
* [ ] Les filtres dynamiques (`agent.name`, `user.name`, etc.) sont fonctionnels
* [ ] Les exports manuels au format PDF ou CSV ont été testés avec succès
* [ ] Si nécessaire, une planification automatique d’export est en place dans Kibana Reporting

#### ✅ Vérifications de conservation et de rotation des preuves

* [ ] Les rapports sont sauvegardés dans un répertoire protégé (`/var/audit_rgpd/reports/` par exemple)
* [ ] Un script cron supprime les rapports de plus de 30 jours (rotation OK)

---

✅ **Si tous les points ci-dessus sont cochés, votre audit RGPD automatisé est considéré comme complet et conforme.**

*






## 8. Aller plus loin — Tutos pratiques et approfondissements

Ce chapitre va te permettre de renforcer ta posture de sécurité sur la durée. On va structurer les efforts autour de quatre leviers : gouvernance distribuée (Security Champions), analyse proactive (threat modeling), alignement économique (budgets), et vigilance continue (veille).

---

### 1. Mettre en place un programme de Security Champions

#### Objectif :

Distribuer la compétence sécurité dans chaque équipe produit ou technique, en identifiant un référent motivé (le Security Champion) et en l’équipant pour assurer un relai quotidien.

#### Étapes :

##### a. Identifier les candidats

1. Organise une réunion avec toutes les équipes tech, produit, QA, ops, etc.
2. Présente brièvement le rôle : il s’agit d’un point focal sécurité, qui remonte les risques, applique les bonnes pratiques et communique les alertes.
3. Laisse chaque équipe désigner un volontaire motivé et respecté.

##### b. Formaliser le rôle

Crée un fichier `security_champions.md` avec :

* Missions

  * Participer aux réunions sécurité mensuelles
  * Relayer les alertes et vulnérabilités
  * Animer des points sécurité dans l’équipe
  * S’assurer de l’intégration des bonnes pratiques (linters, SAST, MFA, etc.)

* Moyens

  * Accès aux outils de scan (Trivy, SonarQube, etc.)
  * Référentiel de pratiques (Wiki interne)
  * Canal Slack/Matrix de sécurité

##### c. Mettre en place une réunion mensuelle

Crée un événement récurrent avec :

* Présentation de nouveaux CVE
* Retours sur incidents
* Partage de best practices
* Suivi des actions sécurité en backlog produit

---

### 2. Créer une cartographie des risques et faire du threat modeling

#### Objectif :

Visualiser les menaces potentielles et anticiper les vecteurs d’attaque avant qu’ils ne se produisent.

#### Étapes :

##### a. Recenser les actifs numériques

Dans un tableau `assets.csv`, indique :

```
Nom;Type;Sensibilité;Exposition
Base client;Base de données;Élevée;Internet
Repo Git;Code source;Élevée;VPN
Console AWS;Interface;Critique;Internet
```

##### b. Pour chaque actif, identifier les menaces (STRIDE)

Crée un tableau `threats.csv` avec une ligne par combinaison :

```
Actif;Menace;Description;Impact;Probabilité
Base client;Tampering;Modification non-autorisée des données;Élevé;Moyen
Repo Git;Repudiation;Dev supprime des commits sensibles;Moyen;Faible
```

##### c. Visualiser avec Threat Dragon (ou draw\.io)

1. Installe Threat Dragon :

```bash
npm install -g owasp-threat-dragon
threatdragon
```

2. Crée un nouveau modèle pour chaque produit
3. Place les nœuds (serveurs, bases, utilisateurs)
4. Ajoute les flux, puis clique droit > "Edit Threats"

##### d. Plan d’atténuation

Crée un fichier `risques_plan.md` listant les mesures :

```
Menace : modification des logs d’accès
- Mesure : logs immuables en append-only sur serveur distant
- Échéance : T2 2025
- Responsable : @devops_lead
```

---

### 3. Construire un budget cybersécurité et faire du FinSecOps

#### Objectif :

Savoir combien coûte (et économise) la sécurité.

#### Étapes :

##### a. Estimer les coûts fixes

Crée un fichier `budget_sec.yaml` :

```yaml
licences:
  - wazuh: 0
  - gitlab_premium: 2400
formation:
  - elearning: 1500
outillage:
  - trivy: 0
  - burp_suite_pro: 399
```

##### b. Estimer les risques évités

Dans `risques_financiers.csv`, crée :

```
Scénario;Impact financier
Fuite RGPD (base clients);200000€
Ransomware chiffrant les backups;500000€
```

##### c. Automatiser le suivi

Dans GitLab ou Jira, crée un tag `#securité` et une "Epic Sécurité" contenant toutes les tâches. Export mensuel pour calculer temps passé.

##### d. Affichage dans un tableau de bord

Dans Grafana ou un tableur partagé :

* Colonne : mois
* Ligne : dépenses réelles / estimées / ROI évité par menaces bloquées

---

### 4. Mettre en place une veille de sécurité continue

#### Objectif :

Être au courant des vulnérabilités critiques le jour même de leur publication.

#### Étapes :

##### a. Agréger les sources fiables dans un flux RSS

1. Installe Fluent Reader ou RSS Guard
2. Abonne-toi aux flux :

   * [https://cve.mitre.org/data/downloads/allitems.xml](https://cve.mitre.org/data/downloads/allitems.xml)
   * [https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml](https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss-analyzed.xml)
   * [https://www.cert.ssi.gouv.fr/feed/](https://www.cert.ssi.gouv.fr/feed/)
   * [https://github.com/search?q=CVE\&type=repositories](https://github.com/search?q=CVE&type=repositories)

##### b. Créer un canal de diffusion

Dans Slack, Discord ou Matrix :

* Crée un canal `#vulnérabilités`
* Ajoute un bot (comme RSSBot ou Zapier RSS -> Webhook)

##### c. Relier avec les projets internes

Dans chaque ticket de dépendance (GitHub/GitLab), ajoute :

```
🛡️ Vérifier si CVE-2024-xxxx affecte notre version de X
```

##### d. Organiser une revue mensuelle

1. Lister les CVE critiques du mois
2. Vérifier exposition dans vos stacks (version, usage réel)
3. Prioriser les MAJ dans le backlog

---

---

