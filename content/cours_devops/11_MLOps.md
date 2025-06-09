---
title: "MLOps"
description: "Maîtriser l’ensemble du cycle de vie des projets de machine learning, de la gestion des données au déploiement en production, en appliquant des pratiques robustes inspirées du DevOps."
category: "cours-devops"
---

# MLOps

# Chapitre 1 — Introduction au MLOps

## Qu'est-ce que le MLOps ?

Le MLOps, pour **Machine Learning Operations**, est un ensemble de pratiques visant à automatiser, fiabiliser et industrialiser le cycle de vie des modèles de machine learning. Inspiré du DevOps, il s’adapte aux spécificités des projets ML, qui sont plus sensibles à la variabilité des données, au risque de dérive des performances dans le temps, et à la non-déterminisme des résultats.

Le MLOps ne concerne pas seulement le déploiement des modèles, mais englobe toute la chaîne : ingestion des données, expérimentation, entraînement, validation, packaging, mise en production, surveillance, et mise à jour continue.

Il vise à répondre à des enjeux concrets :
- Reproductibilité des expériences
- Collaboration fluide entre data scientists, ingénieurs ML, DevOps
- Déploiement rapide, fiable, traçable
- Suivi des performances en production

---

## Différences entre DevOps et MLOps

Bien que le MLOps s’inspire du DevOps, il s’en distingue sur plusieurs points fondamentaux :

| Élément                     | DevOps                         | MLOps                                              |
|----------------------------|--------------------------------|-----------------------------------------------------|
| Entrée principale          | Code source                    | Code + données + hyperparamètres                   |
| Résultat attendu           | Application déterministe       | Modèle entraîné avec performance statistique       |
| Tests                      | Fonctionnels/unitaires         | Statistiques, validité, robustesse du modèle       |
| CI/CD                      | Build et déploiement logiciel  | Entraînement, packaging, déploiement de modèle     |
| Monitoring                 | Logs, erreurs, uptime          | Précision, dérive, métriques métier                |
| Reproductibilité           | Compilation identique          | Dépend aussi de la qualité et version des données  |

Le MLOps impose donc des outils et workflows spécifiques pour :
- versionner les données et les modèles ;
- suivre les expériences d’entraînement ;
- déclencher des retrainings ;
- monitorer les métriques métier en production.

---

## Cycle de vie d’un projet ML

Le MLOps structure un cycle de vie complet du machine learning, souvent itératif :

1. **Collecte des données**  
   - Accès aux sources de données (bases SQL, fichiers, APIs, etc.)
   - Extraction, nettoyage, et prétraitement

2. **Exploration & analyse des données**  
   - Visualisations, corrélations, détection d’anomalies
   - Compréhension du contexte métier

3. **Expérimentation & entraînement**  
   - Sélection de modèles, tuning d’hyperparamètres
   - Entraînement local, sur serveur ou en cloud

4. **Validation**  
   - Évaluation sur jeux de tests
   - Analyse des métriques : accuracy, F1-score, ROC AUC, etc.

5. **Packaging du modèle**  
   - Sérialisation (Pickle, ONNX, SavedModel)
   - Conteneurisation (Docker)

6. **Déploiement**  
   - En tant qu’API (FastAPI, Flask)
   - Dans un orchestrateur (Kubernetes, SageMaker)

7. **Monitoring & maintenance**  
   - Suivi de performance dans le temps
   - Détection de dérive
   - Déclenchement de retrainings automatiques si nécessaire

Ce cycle de vie est au cœur du MLOps : il doit être reproductible, automatisé et traçable.

---

## Rôles impliqués

Le MLOps repose sur la collaboration entre plusieurs profils aux compétences complémentaires :

- **Data Scientist**  
  Conçoit les modèles, les expérimente, les valide sur des jeux de tests.

- **ML Engineer**  
  Implémente les modèles de façon performante et scalable ; optimise les ressources.

- **MLOps Engineer**  
  Met en place les pipelines d’entraînement, de test, de déploiement, de monitoring. Automatise l’ensemble du cycle de vie.

- **Data Engineer**  
  Met à disposition les données nécessaires, construit les pipelines d’ingestion et de transformation.

- **Software Engineer**  
  Intègre les modèles dans les applications et plateformes produits.

- **Product Owner / Métier**  
  Définit les objectifs métiers, valide la pertinence des modèles, suit les KPIs en production.

---

## Outils et plateformes populaires

Les outils du MLOps couvrent différents domaines du cycle de vie :

### Versionnage
- **Git** (code source)
- **DVC**, **LakeFS** (données et artefacts)

### Suivi d’expérimentations
- **MLflow**
- **Weights & Biases**
- **Neptune.ai**

### Orchestration de pipelines
- **Airflow**
- **Kubeflow Pipelines**
- **SageMaker Pipelines**

### Packaging et serving
- **Docker**
- **TensorFlow Serving**
- **TorchServe**
- **MLServer**

### CI/CD
- **GitHub Actions**
- **GitLab CI**
- **Argo Workflows**

### Monitoring en production
- **Evidently**
- **Prometheus + Grafana**
- **Seldon Core**

### Feature Stores
- **Feast**
- **Tecton**

Ces outils peuvent être combinés dans des **stacks MLOps** cohérentes, selon les besoins et les ressources de l’équipe.

## Structure typique d’un repo MLOps

```
project_name/
├── data/                  # Données brutes, transformées (via DVC ou symlink)
├── notebooks/             # Explorations, prototypage
├── src/                   # Code source : preprocessing, entraînement, évaluation
│   ├── data/              # Scripts d'ingestion et de preprocessing
│   ├── features/          # Feature engineering
│   ├── models/            # Définition, entraînement et sauvegarde des modèles
│   └── utils/             # Fonctions utilitaires
├── pipelines/             # Pipelines MLflow, Prefect, Airflow, etc.
├── tests/                 # Tests unitaires et fonctionnels
├── dvc.yaml               # Définition des pipelines de données (si DVC utilisé)
├── requirements.txt       # Dépendances du projet
├── Dockerfile             # Containerisation du projet
└── README.md              # Description et instructions
```

---

## Exemple de pipeline CI/CD avec GitHub Actions + DVC + MLflow

```yaml
name: mlops-pipeline

on:
  push:
    branches: [ main ]

jobs:
  train-and-track:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install dvc[gs] mlflow

    - name: Pull data with DVC
      run: dvc pull -r myremote

    - name: Train and log model
      run: python src/models/train.py

    - name: Push model to registry
      run: mlflow register-model -m ./mlruns -n my-model-name
```

---

## Matrice de choix des outils MLOps selon le contexte

| Besoin                        | Open-source              | Cloud provider                      |
| ----------------------------- | ------------------------ | ----------------------------------- |
| Versionnage données + modèles | DVC + Git                | SageMaker + S3, Vertex AI + GCS     |
| Orchestration de pipelines    | Airflow, Prefect, Flyte  | SageMaker Pipelines, Azure ML       |
| Suivi des expérimentations    | MLflow, W\&B, Neptune.ai | SageMaker Experiments, Vertex       |
| Déploiement API modèle        | FastAPI + Docker + K8s   | SageMaker Endpoint, Azure Endpoint  |
| Monitoring post-déploiement   | Evidently, Prometheus    | Vertex AI Monitoring, Azure Monitor |

---

## Pièges fréquents et solutions

### 🔸 Problème : Résultats non reproductibles

**Cause** : versions de données ou code non figées, pipelines manuels
**Solution** : DVC pour les données, MLflow pour l’expérimentation, scripts versionnés

### 🔸 Problème : Environnement local ≠ production

**Cause** : dépendances floues, configurations spécifiques non portables
**Solution** : Dockerisation stricte, gestion centralisée des secrets

### 🔸 Problème : Dérive silencieuse des données ou du modèle

**Cause** : manque de monitoring métier
**Solution** : Evidently + Prometheus avec alertes sur les métriques clés

### 🔸 Problème : Frictions entre équipes Data / Ops

**Cause** : rôles mal définis, manque d'automatisation
**Solution** : pipelines automatisés, documentation partagée, GitOps appliqué au ML



---

# Chapitre 2 — Gestion des données

## Collecte et ingestion de données

La première étape d’un pipeline MLOps est l’acquisition des données. Celles-ci peuvent provenir de sources variées :

* Bases de données relationnelles (PostgreSQL, MySQL)
* Fichiers plats (CSV, JSON, Parquet)
* APIs externes (REST, GraphQL)
* Flux temps réel (Kafka, MQTT)
* Données cloud (S3, GCS, Azure Blob)

La collecte peut être automatisée via des outils comme **Airflow**, **Prefect**, ou des scripts dédiés intégrés dans un pipeline DVC ou MLflow.

### Bonnes pratiques :

* Centraliser les accès via une couche d’abstraction
* Documenter chaque source (structure, fréquence, format)
* Séparer la phase d’extraction de la phase de transformation

### Exemple d'implémentation avec Airflow (ingestion automatique d'un dataset public)

```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

dag = DAG(
    'ingest_csv_kaggle',
    default_args={'owner': 'mlops'},
    start_date=days_ago(1),
    schedule_interval='@daily'
)

ingest = BashOperator(
    task_id='download_data',
    bash_command='curl -o /data/raw.csv https://url-vers-dataset.csv',
    dag=dag
)
```

---

## Validation des données

Avant toute utilisation, les données doivent être validées pour éviter les erreurs silencieuses en aval. Les erreurs peuvent inclure :

* Types incohérents
* Données manquantes ou aberrantes
* Distributions inattendues

### Outils de validation :

* **Great Expectations** : framework déclaratif de tests de données
* **Pandera** : validation de DataFrames Pandas avec des schémas typés
* **Deepchecks** : tests orientés machine learning (biais, drift, etc.)

### Exemple avancé avec Great Expectations

```python
from great_expectations.dataset import PandasDataset
import pandas as pd

class MyValidatedDataset(PandasDataset):
    _expectations_config = {
        "expect_column_values_to_not_be_null": {"column": "age"},
        "expect_column_values_to_be_between": {"column": "age", "min_value": 0, "max_value": 120}
    }

df = pd.read_csv("/data/clean.csv")
validated_df = MyValidatedDataset(df)
validated_df.validate()
```

### Intégration dans CI/CD

* Ajouter un job `validate_data` dans GitHub Actions avec un rapport JSON
* Failer le pipeline si un seuil de conformité est franchi

---

## Versionnage de données

Contrairement au code, les données changent souvent et doivent être versionnées pour garantir la reproductibilité des expériences ML.

### Outils :

* **DVC** (Data Version Control) : s’intègre à Git pour tracker les fichiers volumineux
* **LakeFS** : transforme un data lake en système de fichiers versionné
* **Delta Lake** : versionning transactionnel sur Apache Spark

### Exemple : DVC avec Google Cloud

```bash
dvc init
dvc remote add -d gcsremote gcs://bucket/dataset
dvc add data/clean.csv
git add data/clean.csv.dvc .gitignore
git commit -m "Ajout dataset versionné"
dvc push
```

### Bonne pratique : créer un tag Git associé à chaque version de dataset

```bash
git tag -a "v_dataset_202406" -m "Version stable du dataset de juin 2024"
git push origin v_dataset_202406
```

---

## Data Warehouses vs Data Lakes

### Data Warehouses (Entrepôts de données)

* Stockage structuré, optimisé pour les requêtes SQL
* Données propres, modélisées (ex : BigQuery, Snowflake, Redshift)
* Idéal pour les rapports, BI, agrégations

### Data Lakes

* Stockage brut, souvent en fichiers (ex : S3, GCS, HDFS)
* Supporte données structurées / semi-structurées / non structurées
* Adapté à la Data Science, traitement batch ou streaming

### Évolution :

* **Lakehouse** = combinaison des deux (ex : Databricks Delta Lake)

### Choix en contexte industriel :

| Critère              | Warehouse              | Lake               | Lakehouse (hybride)     |
| -------------------- | ---------------------- | ------------------ | ----------------------- |
| Coût                 | Élevé                  | Faible à modéré    | Modéré                  |
| Performance requêtes | Optimisée (indexation) | Moyenne            | Bonne avec Delta Engine |
| Volume & variété     | Limité                 | Massif, tous types | Massif + structuration  |
| Use case typique     | BI, dashboards         | IA, Big Data, logs | MLOps, BI + ML          |

---

## Données sensibles : anonymisation, RGPD, etc.

Le traitement de données personnelles (noms, e-mails, logs, données médicales, etc.) est soumis à des régulations strictes comme le **RGPD**.

### Principes fondamentaux :

* Minimisation des données : ne collecter que ce qui est utile
* Droit à l’oubli : suppression à la demande
* Consentement explicite de l’utilisateur

### Techniques d’anonymisation :

* **Masquage** : remplacement des données sensibles
* **Pseudonymisation** : transformation réversible avec clé
* **Différential Privacy** : ajout de bruit contrôlé aux données/statistiques

### Implémentation : pseudonymisation simple

```python
import hashlib

def pseudonymize_email(email: str) -> str:
    return hashlib.sha256(email.encode()).hexdigest()
```

### Bonnes pratiques MLOps :

* Logger les accès aux données sensibles
* Séparer données sensibles des features utilisées
* Documenter les politiques de rétention et d'accès
* Intégrer les vérifications RGPD dans les checklists de mise en production

---

# Chapitre 3 — Environnements de développement

## Environnements reproductibles

### Pourquoi ?

Dans le cycle de vie MLOps, il est crucial de garantir que les résultats obtenus dans un environnement (ex. notebook local) soient reproductibles ailleurs (en CI/CD, sur serveur ou en production).

### Outils majeurs :

* **Conda** : gestion d’environnements et de dépendances isolés
* **virtualenv / venv** : standard Python plus léger
* **Docker** : conteneurisation complète de l’environnement OS + dépendances

### Exemple : Dockerfile pour un environnement ML typique

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
CMD ["python", "src/train.py"]
```

### Recommandations :

* Figer les versions de chaque dépendance (pas de `scikit-learn>=1.0`)
* Documenter la procédure de setup local, cloud, CI/CD
* Versionner l’environnement (ex. `environment.lock.yaml`, `Dockerfile`) au même titre que le code

---

## Gestion des dépendances

Une mauvaise gestion des dépendances est la cause fréquente de bugs non reproductibles ou d’échecs en production.

### Outils :

* **pip + requirements.txt** : simple et standard, mais peu strict
* **Poetry** : gestion moderne avec résolution et lockfile
* **pipenv** : alternative avec fichiers `Pipfile` et `Pipfile.lock`

### Exemple avancé avec Poetry

```bash
poetry init
poetry add pandas scikit-learn mlflow
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

### Bonnes pratiques :

* Utiliser un lockfile (`poetry.lock`, `Pipfile.lock`, etc.) dans tous les environnements
* Automatiser les installations dans vos workflows CI/CD
* Utiliser `pip freeze > requirements.txt` uniquement pour archiver un état figé

---

## Jupyter vs IDE vs Notebooks orchestrés

### Jupyter (Notebook local)

* Exploratoire, rapide à utiliser, mais peu reproductible
* Faible traçabilité (sauf avec nbconvert, papermill, etc.)

### IDE (VSCode, PyCharm, etc.)

* Développement structuré, bon pour projets complexes
* Compatible avec débogage, tests, linting

### Notebooks orchestrés

* Utilisent **Papermill**, **Dagster**, **Metaflow**, etc. pour exécuter des notebooks dans des pipelines reproductibles

### Exemple avec Papermill

```bash
papermill input.ipynb output.ipynb -p learning_rate 0.01 -p n_estimators 100
```

### Recommandations :

* Convertir les notebooks en scripts (`nbconvert`) avant CI/CD
* Journaliser tous les paramètres et outputs (MLflow, Weights & Biases)
* Ne pas mettre en production un `.ipynb` directement

---

## Bonnes pratiques de gestion de code

### Utilisation de Git

* Branches par fonctionnalité ou par expérimentation (`exp/`, `feat/`, `hotfix/`)
* Commits atomiques, messages clairs et normalisés (ex : Conventional Commits)

### Pre-commit hooks

* Vérifications automatiques : formatage, typage, tests, lint
* Outils : `pre-commit`, `black`, `flake8`, `mypy`

### Exemple : configuration `.pre-commit-config.yaml`

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pre-commit/mirrors-flake8
    rev: v6.0.0
    hooks:
      - id: flake8
```

### Bonnes pratiques :

* Intégrer les tests et hooks dans les workflows GitHub Actions
* Générer un changelog automatiquement à partir des commits (conventional changelog)
* Coupler gestion du code, des notebooks, des modèles et des artefacts dans une stratégie Git unifiée


### Intégrer les tests et hooks dans les workflows GitHub Actions

L’objectif est d’éviter toute régression ou code non conforme dès le push.

#### Exemple de workflow `.github/workflows/checks.yml`

```yaml
name: checks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install black flake8 mypy pytest

      - name: Lint
        run: |
          black --check .
          flake8 .
          mypy src/

      - name: Run tests
        run: pytest tests/
```

---

### Générer un changelog automatiquement à partir des commits

#### Pourquoi ?

Pour faciliter les releases, communiquer efficacement les changements, et maintenir la documentation à jour.

#### Méthodes :

* Convention de nommage de commits : **Conventional Commits**
* Outils :

  * `standard-version` (JS/npm)
  * `cz` / `commitizen` (Python-compatible)
  * `semantic-release` (automatique avec GitHub Actions)

#### Exemple avec `cz`

```bash
pip install commitizen
cz init  # Configure avec pyproject.toml
cz bump  # Incrémente version + changelog auto
cz changelog  # Génère ou met à jour CHANGELOG.md
```

---

### Stratégie unifiée : code, notebooks, modèles, artefacts

Une bonne approche consiste à versionner et structurer **l’ensemble du cycle de vie ML** dans un dépôt cohérent et automatisé.

#### Structure recommandée

```
repo/
├── notebooks/              # Explorations initiales (tracking MLflow ou Papermill)
├── src/                    # Code de production modulaire
├── models/                 # Fichiers de modèles exportés (liens DVC ou MLflow)
├── data/                   # Symboliques DVC ou répertoire ignoré
├── tests/                  # Tests unitaires, d’intégration, etc.
├── mlruns/                 # Logs MLflow (si local)
├── .github/workflows/      # Pipelines CI/CD
├── Dockerfile              # Environnement conteneurisé
├── dvc.yaml                # Pipelines de traitement data
└── pyproject.toml          # Config globale (formatage, version, changelog, etc.)
```

#### Automatisations

* CI/CD déclenchant : lint → test → train → log modèle → push artefact → déploiement
* Git tags déclenchant des versions + changelogs + publication
* Liaison avec MLflow pour chaque commit/tag

---

### Règles de relecture de code en équipe ML

* Toute pull request doit contenir :

  * description claire
  * justification métier/technique
  * preuves reproductibles (ex : run ID MLflow)
* Revue obligatoire à deux pairs pour les étapes critiques : ingestion, entraînement, scoring
* Tests automatisés requis avant merge, avec rapport dans le commentaire PR


---

# Chapitre 4 — Expérimentation et suivi

## Suivi des expériences

L'entraînement de modèles implique l'exploration d'une multitude de combinaisons : algorithmes, hyperparamètres, jeux de données, stratégies de preprocessing. Documenter et tracer ces expériences est essentiel pour garantir la reproductibilité et identifier les meilleurs résultats.

### Outils de tracking

* **MLflow Tracking** : open source, extensible, très utilisé
* **Weights & Biases (W\&B)** : complet, orienté collaboration
* **Neptune.ai** : interface puissante avec gestion d’équipes
* **Comet ML** : supporte métriques, graphiques, comparaison d’expériences

### Exemple : tracking avec MLflow

```python
import mlflow

mlflow.start_run()
mlflow.log_param("learning_rate", 0.01)
mlflow.log_metric("accuracy", 0.91)
mlflow.sklearn.log_model(model, "model")
mlflow.end_run()
```

### Bonnes pratiques

* Utiliser des tags et noms explicites (`exp_baseline_lr001`, `tuned_random_forest`)
* Lier les run IDs à des commits Git
* Stocker les artefacts de modèle dans un registre (MLflow Registry ou DVC)
* Versionner les données avec DVC et les référencer dans l’expérience
* Mettre en place un tableau de bord centralisé (ex. via `mlflow ui` ou `W&B Reports`)

---

## Gestion des hyperparamètres

Les hyperparamètres influencent fortement la performance d’un modèle. Leur recherche doit être systématisée et reproductible.

### Méthodes classiques

* Grid Search : exploration exhaustive
* Random Search : échantillonnage aléatoire

### Méthodes avancées

* **Bayesian Optimization** : ex. avec `optuna`
* **Hyperband** : algorithme adaptatif efficace
* **Population-Based Training** : stratégies évolutives (ex. Ray Tune)

### Exemple avec Optuna

```python
import optuna

def objective(trial):
    lr = trial.suggest_float("lr", 1e-4, 1e-1, log=True)
    clf = SomeModel(learning_rate=lr)
    accuracy = cross_val_score(clf, X, y).mean()
    return accuracy

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)
```

### Bonnes pratiques

* Définir des espaces de recherche réalistes
* Combiner Optuna avec MLflow pour tracker automatiquement les runs
* Limiter le coût par run via early stopping ou réduction de dataset
* Paralléliser les recherches (Ray, Optuna, SageMaker Tuning Jobs)

---

## Réplication des expériences

### Pourquoi c’est crucial ?

* Garantir que les résultats sont fiables, pas dus au hasard ou à des fuites
* Permettre à d'autres équipes ou à la CI/CD de relancer un entraînement identique

### Stratégies

* Fixer les seeds aléatoires (NumPy, Torch, TensorFlow)
* Versionner **tout** : code, data, config, modèle, environnement
* Centraliser la configuration via Hydra ou YAML/JSON

### Exemple : script totalement réplicable

```bash
python train.py --config config.yaml --seed 42
```

```yaml
# config.yaml
model:
  type: xgboost
  max_depth: 7
  learning_rate: 0.01

training:
  test_split: 0.2
  n_estimators: 500
```

---

## Comparaison des modèles

Une fois plusieurs modèles entraînés, il est essentiel de comparer leurs performances de manière rigoureuse.

### Métriques courantes

* **Classification** : accuracy, precision, recall, F1-score, ROC AUC
* **Régression** : RMSE, MAE, R²
* **Survêtement ?** : courbes d’apprentissage, courbes de validation croisée

### Outils de visualisation

* **MLflow UI** : graphiques et tableaux d’expériences
* **W\&B Sweeps** : visualisation interactive
* **TensorBoard** : pour les frameworks deep learning

### Bonnes pratiques

* Comparer non seulement la performance, mais aussi :

  * la stabilité (écart-type sur k-folds)
  * le coût d’entraînement (temps, mémoire)
  * la taille du modèle (pour le déploiement)
* Documenter toutes les comparaisons dans un changelog expérimental versionné
* Garder un modèle « champion » par tâche dans un registre et archiver les anciens

---

# Chapitre 5 — Entraînement des modèles

## Local, cloud et hybride : stratégies d'entraînement

### Entraînement local

* Avantages : rapide à mettre en œuvre, pas de coût cloud
* Limites : ressources limitées (RAM, GPU), non scalable, reproductibilité manuelle

### Entraînement sur le cloud

* Services managés : AWS SageMaker, Google Vertex AI, Azure ML
* Infrastructure IaaS : Kubernetes + GPU (ex. GKE, AKS, EKS)

### Stratégie hybride

* Pré-traitement et prototypage en local
* Entraînement distribué et orchestration sur cloud
* Artefacts synchronisés via DVC, MLflow, ou stockage object (S3, GCS)

### Bonnes pratiques

* Automatiser les transferts de données et modèles
* Déclencher les entraînements depuis un pipeline CI/CD (GitHub Actions, Airflow)
* Sécuriser les accès cloud avec secrets manager ou vault

---

## Accélération avec GPU/TPU

### Frameworks compatibles

* TensorFlow, PyTorch, JAX, RAPIDS (cuDF, cuML)

### Bonnes pratiques :

* Activer le profiling GPU (`torch.cuda.Profiler`, `tf.profiler`)
* Libérer explicitement la mémoire GPU entre les runs
* Mesurer le **batch size maximal** par modèle pour optimiser l'utilisation

### Exemple (PyTorch)

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
```

### TPUs

* Disponibles via Google Cloud ou Colab
* Idéal pour modèles massifs ou entraînement distribué à grande échelle

---

## Orchestration d'entraînement

Un entraînement en production ne se lance jamais manuellement : il est orchestré.

### Outils open-source :

* **Airflow** : DAGs, scheduling, dépendances
* **Prefect** : workflow Pythonic, résilient
* **Kubeflow Pipelines** : pour K8s, avec support ML complet
* **Dagster** : typage fort, monitoring intégré

### Exemple : DAG Airflow simplifié

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def train_model():
    ... # logiques d'entraînement

dag = DAG(
    'train_model_pipeline',
    start_date=datetime(2023, 1, 1),
    schedule_interval='@daily'
)

train_task = PythonOperator(
    task_id='train_model',
    python_callable=train_model,
    dag=dag
)
```

### Bonnes pratiques

* Gérer les échecs avec des retries et des alertes
* Séparer les étapes : preprocessing → entraînement → évaluation → packaging
* Utiliser un DAG versionné avec `dvc.yaml` pour les pipelines data

---

## Gestion des ressources

### Scénarios fréquents

* Modèle trop lent ? → profiler et paralléliser (batching, num\_workers)
* Trop gourmand ? → simplifier (distillation, pruning, quantization)
* Entraînement interrompu ? → checkpoints fréquents, reprise automatique

### Optimisations clés

* **DataLoader** bien paramétré (shuffle, num\_workers, pin\_memory)
* **Mixed Precision Training** (ex: `torch.cuda.amp`) : accélère sans perte significative
* **Early stopping** : éviter d'épuiser inutilement les ressources

### Exemple : mixed precision training (PyTorch)

```python
from torch.cuda.amp import GradScaler, autocast

scaler = GradScaler()
for inputs, targets in dataloader:
    optimizer.zero_grad()
    with autocast():
        outputs = model(inputs)
        loss = criterion(outputs, targets)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

---

## Distribution de l'entraînement

### Approches :

* **Data Parallel** : même modèle sur plusieurs GPU (PyTorch DDP, Horovod)
* **Model Parallel** : modèle réparti sur plusieurs machines (gros LLM)
* **Parameter Server** : partage centralisé des poids

### Outils/frameworks

* **PyTorch Lightning + DDP**
* **Ray Train** : orchestration distribuée moderne
* **SageMaker Training Jobs** : distribué et managé
* **Accelerate (Hugging Face)** : wrappe DDP/TPU/CPU facilement

### Exemple : DDP avec PyTorch Lightning

```python
from pytorch_lightning import Trainer

trainer = Trainer(
    accelerator="gpu",
    devices=4,
    strategy="ddp"
)
trainer.fit(model, dataloader)
```

### Bonnes pratiques

* Monitorer les workers distribués (logs + Prometheus/Grafana)
* Synchroniser les artefacts entre nœuds
* Tester d’abord en local avec 1 worker simulé (`--num_processes=1`)

---

# Chapitre 6 — Tests & Validation des modèles

## Tests unitaires pour le code ML

Même dans un projet de data science, tout le code doit être testé :

* Fonctions de preprocessing
* Fonctions d’ingénierie de features
* Métriques personnalisées
* Chargement/sérialisation de modèle

### Outils recommandés :

* **pytest** : framework de test Python standard
* **hypothesis** : tests de propriété (valeurs aléatoires intelligentes)
* **tox** ou **nox** : tests sur plusieurs environnements

### Exemple : test unitaire d’une fonction de normalisation

```python
def normalize(x):
    return (x - x.mean()) / x.std()

def test_normalize():
    import numpy as np
    x = np.array([1, 2, 3, 4, 5])
    z = normalize(x)
    assert np.isclose(z.mean(), 0.0, atol=1e-6)
    assert np.isclose(z.std(), 1.0, atol=1e-6)
```

---

## Tests de performance et robustesse

Les modèles doivent être évalués au-delà des seules métriques standard.

### Types de tests :

* **Stress tests** : évaluer la stabilité avec des inputs bruités ou extrêmes
* **Tests de performance** : latence, RAM/VRAM, débit (inference/sec)
* **Tests métier** : sensibilité à des cas clés ou critiques

### Exemple : test de robustesse à des valeurs aberrantes

```python
def test_model_robustness():
    X_outlier = generate_abnormal_inputs()
    predictions = model.predict(X_outlier)
    assert not np.any(np.isnan(predictions))
```

### Bonnes pratiques :

* Suivre une **courbe précision/latence** pour arbitrage
* Intégrer ces tests dans les workflows de validation
* Exiger une robustesse documentée avant mise en production

---

## Détection de dérive (drift) et biais

Les modèles peuvent perdre en pertinence si la distribution des données change (dérive) ou s’ils amplifient des inégalités (biais).

### Types de dérives :

* **Data drift** : changement dans les features d’entrée
* **Concept drift** : changement dans la relation X → Y

### Outils de détection :

* **Evidently** (open-source, simple à intégrer)
* **Fiddler**, **WhyLabs**, **Amazon Clarify** (solutions SaaS)
* **Scikit-multiflow** pour les flux en ligne

### Exemple avec Evidently

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=df_ref, current_data=df_prod)
report.save_html("drift_report.html")
```

### Tests anti-biais :

* Problèmes : déséquilibre, traitement inéquitable, proxies indirects
* Métriques : Equal Opportunity, Demographic Parity, TPR/FPR gap
* Réparations : re-weighting, post-processing, fairness-aware learning

---

## Validation croisée automatique

La validation croisée (cross-validation) évalue la généralisation du modèle. Elle doit être systématisée dans les pipelines.

### Méthodes principales :

* K-Fold (stratifié ou non)
* Leave-One-Out
* Time Series Split (pour données temporelles)

### Implémentation avec `sklearn`

```python
from sklearn.model_selection import cross_validate

scores = cross_validate(model, X, y,
                        scoring=["accuracy", "f1"],
                        cv=5,
                        return_train_score=True)
print(scores)
```

### Bonnes pratiques :

* Toujours stratifier les splits en classification
* Séparer pipeline d’entraînement et validation (eviter les fuites de données)
* Logguer tous les splits, seeds, et scores dans MLflow
* Étendre la validation croisée aux pipelines complets (avec `Pipeline` sklearn, `Optuna`, `PyCaret`, etc.)


---

# Chapitre 7 — Déploiement des modèles

## Modèles servables : formats et compatibilité

Avant tout déploiement, un modèle doit être **exporté dans un format standardisé**.

### Formats de sérialisation

* **Pickle / Joblib** : spécifique à Python, non sécurisé (ne jamais charger depuis une source non fiable)
* **ONNX (Open Neural Network Exchange)** : format inter-framework, compatible avec C++, JavaScript, mobile, edge
* **TorchScript** : optimisé pour la production avec PyTorch
* **TensorFlow SavedModel** : standard de TensorFlow

### Bonnes pratiques

* Exporter avec version, signature d’entrée/sortie, métadonnées
* Valider les entrées avec des schémas (pydantic, marshmallow, OpenAPI)
* Tester les modèles après export avec des tests fonctionnels

---

## Déploiement avec Flask/FastAPI

### Usage : exposer le modèle en tant qu’API REST

### Exemple avec FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load("model.joblib")

class Input(BaseModel):
    feature1: float
    feature2: float

@app.post("/predict")
def predict(input: Input):
    data = [[input.feature1, input.feature2]]
    prediction = model.predict(data)
    return {"prediction": prediction.tolist()}
```

### Bonnes pratiques

* Ajouter Swagger (auto-généré)
* Ajouter validation stricte des entrées
* Journaliser les requêtes et latence (via middleware)
* Séparer service API / logique métier / modèle pour maintenabilité

---

## Docker + Kubernetes : production scalable

### Dockerisation

* Fournit un environnement isolé et reproductible
* Facilite la portabilité : local → CI → cloud

### Exemple : Dockerfile

```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Kubernetes

* Orchestration de containers : scaling, rolling updates, auto-recovery
* YAML de déploiement typique :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      containers:
      - name: api
        image: myorg/ml-api:latest
        ports:
        - containerPort: 8080
```

### Bonnes pratiques

* Utiliser des **probes** (liveness/readiness)
* Centraliser les logs avec Fluentd ou Loki
* Gérer les secrets avec K8s secrets ou Hashicorp Vault
* Surveiller avec Prometheus + Grafana

---

## Serveurs de modèles spécialisés

### Solutions

* **MLflow Models** : serveurs REST auto-générés (mlflow models serve)
* **TensorFlow Serving** : performant pour modèles TF
* **TorchServe** : optimisé pour modèles PyTorch
* **MLServer** : standard compatible avec BentoML, FastAPI, SKLearn

### Avantages

* Meilleures performances qu’un serveur API maison
* Intégration native avec des pipelines CI/CD
* Multiples modèles, versioning, autoscaling natif (ex : Seldon Core)

### Exemple : servir un modèle avec MLflow

```bash
mlflow models serve -m runs:/<run-id>/model --port 1234
```

---

## Services managés (SageMaker, Vertex AI, Azure ML)

### Quand les utiliser ?

* Équipes petites ou non expertes en infra
* Besoin de gestion simplifiée du cycle complet (train + deploy + monitor)

### Fonctionnalités typiques

* One-click deployment
* Auto-scaling & A/B testing
* Monitoring intégré
* Modèle registry et gestion des versions

### Inconvénients

* Coût élevé à l’échelle
* Verrouillage propriétaire (vendor lock-in)
* Personnalisation limitée

---

## CI/CD pour modèles ML

### Objectifs

* Automatiser : tests → packaging → validation → déploiement
* Versionner tous les artefacts (modèle, data, code, config)

### Pipelines typiques

1. Trigger : push/tag Git ou validation humaine
2. Test du modèle (fonctionnel + perf)
3. Packaging (Docker, ONNX, archive MLflow)
4. Publication (registry, S3, DVC remote)
5. Déploiement (API, Kubernetes, cloud)

### Exemple de pipeline GitHub Actions (déploiement MLflow)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install deps & MLflow
        run: pip install -r requirements.txt mlflow

      - name: Deploy model
        run: mlflow models serve -m runs:/latest/model --port 5000
```

### Bonnes pratiques

* Séparer les jobs train/test/deploy
* Restreindre les déploiements au main ou à certains tags (`v*.*.*`)
* Ajouter un environnement de staging
* Monitorer les latences post-déploiement automatiquement

---

# Chapitre 8 — Surveillance en production

## Monitoring des performances de modèles

Une fois déployé, un modèle doit être surveillé en continu pour garantir :

* Sa disponibilité (temps de réponse, uptime)
* Sa performance métier (précision, recall, etc.)
* L'absence de dérive statistique (features, labels)
* L’usage effectif de ses prédictions

### Outils utilisés

* **Prometheus** : collecte de métriques
* **Grafana** : visualisation
* **Evidently** : détection automatique de dérive
* **Seldon Core / Alibi Detect** : framework pour ML sur Kubernetes avec outils de monitoring intégrés

### Exemple : métriques Prometheus exposées depuis FastAPI

```python
from prometheus_client import Counter, Histogram, start_http_server

prediction_count = Counter('predictions_total', 'Total predictions made')
prediction_latency = Histogram('prediction_latency_seconds', 'Time for prediction')

@app.post("/predict")
@prediction_latency.time()
def predict(input: Input):
    prediction_count.inc()
    return {"prediction": model.predict(...)}
```

---

## Logging et traçabilité

Chaque appel au modèle doit être loggé :

* Entrées utilisateur (après validation/anonymisation)
* Timestamp, user ID ou session ID
* Temps de réponse, statut
* Résultat retourné (et éventuelle probabilité ou confiance)

### Bonnes pratiques

* Ajouter un middleware de journalisation
* Utiliser des outils comme **ELK Stack** (Elasticsearch + Logstash + Kibana), **Loki**, ou **Fluentd**
* Corréler logs applicatifs avec les métriques de modèle
* S'assurer de la conformité RGPD pour les logs de production

### Exemple : middleware FastAPI

```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    log.info(f"{request.method} {request.url} {duration:.3f}s")
    return response
```

---

## Alerte sur les métriques clés

Un modèle peut être silencieusement dégradé en production.

### Cas fréquents à détecter

* Augmentation brutale du taux d'erreur ou des requêtes nulles
* Chute soudaine de précision ou de score métier
* Changements dans la distribution des entrées (drift)

### Système d’alerte

* **Alertmanager** (couplé à Prometheus)
* Notifications : Slack, e-mail, webhook, dashboard visuel

### Exemple : règle d’alerte Prometheus

```yaml
groups:
- name: model_alerts
  rules:
  - alert: HighLatency
    expr: prediction_latency_seconds_bucket{le="1.0"} < 0.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Latence de prédiction élevée"
```

---

## Mise à jour continue des modèles

Même les meilleurs modèles doivent être mis à jour périodiquement. En production, cela peut être fait de manière :

* Manuelle (re-training périodique avec validation humaine)
* Automatisée (re-training déclenché par détection de dérive ou baisse de performance)

### Techniques et outils

* **Scheduled retraining** via Airflow ou Prefect
* **Continuous Training (CT)** avec détection automatique + déclenchement pipeline
* **Shadow deployment** : tester le nouveau modèle sans l’exposer (split du trafic)
* **Canary release** : déploiement progressif pour valider la nouvelle version

### Étapes d’un cycle complet

1. Surveillance et collecte continue (logs, métriques, dérive)
2. Déclenchement conditionnel ou périodique
3. Réentraînement (sur les nouvelles données collectées)
4. Validation
5. Publication ou rollback selon résultats

### Exemple de déclenchement Airflow

```python
def check_drift():
    drift = run_drift_detector()
    return "retrain" if drift else "skip"

branch = BranchPythonOperator(
    task_id='drift_check',
    python_callable=check_drift,
    dag=dag
)
```

---

## Synthèse

Surveiller un modèle en production ne se limite pas à vérifier sa disponibilité. Il faut également :

* Comprendre l’usage réel du modèle
* Maintenir une visibilité complète sur les entrées, sorties, erreurs
* Être en mesure de réagir rapidement à toute dérive
* Organiser les mises à jour sans perturber l’utilisateur final

Le monitoring d’un modèle doit être traité comme un **produit vivant**, évolutif, avec des responsabilités partagées entre data scientists, ingénieurs, et opérationnels.


---

# Chapitre 9 — Automatisation et orchestration

## Pipelines automatisés avec Airflow / Prefect

L'automatisation des workflows est cruciale pour garantir la reproductibilité, la fiabilité et la scalabilité des projets ML. Deux outils sont aujourd'hui largement utilisés : **Apache Airflow** et **Prefect**.

### Airflow

* Basé sur le concept de DAG (Directed Acyclic Graph).
* Chaque tâche est un opérateur Python ou Bash.
* Excellente extensibilité avec des plugins.

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def preprocess():
    # Code de preprocessing
    pass

def train_model():
    # Code d'entraînement
    pass

dag = DAG('ml_pipeline', start_date=datetime(2024, 1, 1), schedule_interval='@daily')

preprocess_task = PythonOperator(task_id='preprocess', python_callable=preprocess, dag=dag)
train_task = PythonOperator(task_id='train', python_callable=train_model, dag=dag)

preprocess_task >> train_task
```

### Prefect

* Plus moderne, plus orienté objet.
* S'intègre facilement à DVC, MLflow, et des services cloud.

```python
from prefect import flow, task

@task
def preprocess():
    pass

@task
def train():
    pass

@flow
def ml_flow():
    data = preprocess()
    train()

ml_flow()
```

---

## GitOps appliqué au MLOps

GitOps consiste à piloter l’ensemble des déploiements via Git comme source unique de vérité. Il est de plus en plus appliqué aux projets ML.

### Principes

* Déploiement déclenché par des commits Git (push/PR/tag).
* Repos séparés pour le code, les modèles, les données et la configuration.
* Intégration continue + livraison continue (CI/CD) via outils comme ArgoCD, FluxCD.

### Avantages

* Traçabilité complète des changements
* Rollback simplifiés
* Approche déclarative et auditable

### Exemple : déploiement via ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ml-deploy
spec:
  source:
    repoURL: https://github.com/myorg/ml-deploy
    targetRevision: HEAD
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  project: default
```

---

## Feature Stores (Feast, Tecton)

Les Feature Stores sont des systèmes spécialisés pour le stockage, la gestion et la réutilisation des variables explicatives.

### Objectifs

* Éviter les dérives entre entraînement et production
* Partager les features entre équipes et projets
* Suivre le versioning et les mises à jour

### Feast

* Open-source, très utilisé
* Connecteurs vers Redis, BigQuery, Snowflake…

```python
from feast import FeatureStore
store = FeatureStore(repo_path="my_feature_repo")
data = store.get_online_features(
    features=["user_profile:age", "user_profile:gender"],
    entity_rows=[{"user_id": 1234}]
).to_dict()
```

### Tecton

* Solution commerciale très complète
* Forte intégration avec Spark, Kafka, Snowflake…

---

## Entraînement et déploiement en continu (CT/CI/CD/CM)

Le ML a besoin de pipelines robustes qui intègrent :

* **CT (Continuous Training)** : réentraînement automatique à intervalle ou sur déclencheur
* **CI/CD (Intégration et livraison continues)** : vérification + packaging + déploiement
* **CM (Continuous Monitoring)** : supervision active du modèle

### Enchaînement typique

1. Nouveau lot de données → déclenche le pipeline Airflow
2. Réentraînement + évaluation avec MLflow
3. Validation automatisée des performances
4. Déploiement (si performances > seuil) via GitOps
5. Monitoring déclenché (Prometheus, Grafana, Evidently…)

### Exemple de pipeline CI/CD GitHub Actions

```yaml
name: ml-cicd
on:
  push:
    branches:
      - main
jobs:
  train-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install deps
        run: pip install -r requirements.txt
      - name: Train model
        run: python scripts/train.py
      - name: Deploy model
        run: bash deploy.sh
```

L’automatisation et l’orchestration des workflows ML réduisent les erreurs humaines, améliorent la reproductibilité, et accélèrent le time-to-market des modèles. Ce chapitre fournit les briques pour construire des pipelines robustes et scalables, du prototypage au déploiement.

---

---

# Chapitre 10 — Sécurité, éthique et conformité

## Sécurisation des modèles et des APIs

La sécurité des modèles de ML ne se limite pas à l’accès au modèle lui-même. Il faut aussi protéger l’ensemble du pipeline : code, données, artefacts, endpoints et infrastructure.

### Menaces courantes

* **Reverse engineering de modèles** : extraction du modèle via des appels API.
* **Attaques par injection de données** (data poisoning).
* **Attaques par évasion** (adversarial examples).
* **Fuites de données sensibles à travers les réponses du modèle.**

### Bonnes pratiques

* Chiffrement des modèles en transit et au repos.
* Authentification forte pour les APIs (OAuth2, JWT).
* Limitation du débit et analyse comportementale des appels API.
* Signature et vérification des modèles.
* Sandboxing ou conteneurisation de l’environnement d’inférence.

### Outils et techniques

* **ONNX Runtime avec chiffrement intégré.**
* **TF Encrypted / PySyft** pour les modèles sensibles.
* **API Gateway + WAF (Web Application Firewall)** devant chaque service de ML.

---

## Dérives algorithmiques, fairness & explainability

### Dérives algorithmiques

* Dépendance aux données de production : dérives de distribution.
* Concept drift (changement du sens des variables).
* Bias drift (changement dans l'équilibre des classes ou des groupes).

### Fairness (équité)

* Représentation biaisée : minorités mal représentées → prédictions injustes.
* Métriques : Demographic Parity, Equalized Odds, Disparate Impact.
* Stratégies : rebalancer les données, entraîner des modèles contraints ou appliquer un post-traitement.

### Explainability

* Critique dans les systèmes sensibles (santé, finance, justice).
* Méthodes :

  * **SHAP** : importance des features par instance.
  * **LIME** : approximation locale du modèle.
  * **Integrated Gradients**, **Captum** pour les réseaux de neurones.
* Intégration de l’explicabilité dans les dashboards ou les systèmes de décision (sous forme d’annotations ou d’analyses).

---

## Auditabilité des modèles

L’auditabilité vise à assurer une traçabilité complète des actions, transformations et décisions du pipeline ML.

### Composants clés

* **Suivi des versions de code, de données, de modèles et de paramètres.**
* **Journaux d'exécution et métadonnées d'entraînement.**
* **Enregistrement des inputs/outputs** lors de la prédiction.

### Outils

* **MLflow Tracking** avec artefacts versionnés.
* **DVC + Git** pour le versioning de datasets et modèles.
* **Neptune.ai / Weights & Biases** pour l'observabilité étendue.

### Objectifs

* Rétrospective sur les performances passées.
* Reproductibilité scientifique ou réglementaire.
* Contrôle qualité et analyse des incidents.

---

## Conformité réglementaire (RGPD, HIPAA)

### RGPD (Europe)

* Minimisation des données personnelles.
* Droit à l’explication (Art. 22).
* Consentement explicite et révocable.
* Anonymisation ou pseudonymisation obligatoire.
* Encadrement des transferts hors UE.

### HIPAA (États-Unis)

* Protection des données de santé (PHI).
* Audit logs obligatoires.
* Cryptage des transmissions et du stockage.

### Implications concrètes

* Choix d’un hébergement conforme.
* Journalisation des accès et des décisions.
* Fourniture d’un mécanisme de retrait ou de correction des données.
* Design du modèle orienté vers la transparence (modèles interprétables par design quand c’est possible).

---

La sécurité, l'éthique et la conformité sont des piliers trop souvent négligés dans le déploiement de modèles ML. Ce chapitre vous permet de comprendre les risques réels, de structurer les réponses techniques et organisationnelles, et de rendre vos systèmes auditables, équitables et légitimes face à la société et au droit.


---

---

# Chapitre 11 — Cas pratiques

## MLOps complet sur un cas réel : prédiction de churn

Ce cas pratique met en œuvre toutes les briques vues précédemment, à travers un projet complet de bout en bout. Nous allons prédire le risque de désabonnement d’un utilisateur dans un service en ligne, en temps quasi-réel.

### Objectif

Anticiper les utilisateurs susceptibles de se désabonner dans les 30 prochains jours afin d'agir proactivement (offre personnalisée, relance, etc.).

---

### Étape 1 : Ingestion de données

**Source** : événements d’usage collectés en continu (clics, connexions, achats, navigation).

**Technologies utilisées** :

* **Kafka** : ingestion temps réel.
* **Kafka Connect + S3 Sink** : enregistrement dans un lac de données brut (S3).

**Instructions détaillées** :

1. Crée un cluster Kafka local avec Docker Compose :

```yaml
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

2. Lance avec : `docker-compose up -d`
3. Configure Kafka Connect avec un connecteur S3 Sink (exemple en JSON à envoyer à l’API REST de Kafka Connect) :

```json
{
  "name": "s3-sink",
  "config": {
    "connector.class": "io.confluent.connect.s3.S3SinkConnector",
    "topics": "user-events",
    "s3.bucket.name": "mlops-churn",
    "s3.part.size": 5242880,
    "flush.size": 3,
    "storage.class": "io.confluent.connect.s3.storage.S3Storage",
    "format.class": "io.confluent.connect.s3.format.json.JsonFormat",
    "schema.compatibility": "NONE"
  }
}
```

4. Tester la chaîne complète en publiant des messages dans `user-events` et vérifier dans S3.

---

### Étape 2 : Nettoyage & prétraitement

**Objectif** : transformer les données brutes en un format exploitable pour l’entraînement.

**Technologies utilisées** :

* **Apache Spark** pour le traitement distribué.
* **DVC (Data Version Control)** pour versionner les jeux de données nettoyés.

**Instructions détaillées** :

1. Installe Spark localement ou via Docker :

```bash
pip install pyspark
```

2. Écris un script de transformation PySpark :

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date

spark = SparkSession.builder.appName("Preprocessing").getOrCreate()
df = spark.read.json("s3a://mlops-churn/raw-events/")

cleaned_df = df.filter(col("event_type").isNotNull()) \
              .withColumn("event_date", to_date(col("timestamp"))) \
              .dropna(subset=["user_id"])

cleaned_df.write.parquet("cleaned-data/")
```

3. Versionne les données avec DVC :

```bash
dvc init
dvc add cleaned-data/
git add cleaned-data.dvc .gitignore
git commit -m "Ajout données nettoyées"
```

4. Connecte DVC à un stockage distant (ex. : S3, SSH, GDrive).

---

### Étape 3 : Feature Engineering automatisé

**Objectif** : extraire des variables pertinentes, historisées, et cohérentes pour l’entraînement et l’inférence.

**Technologies utilisées** :

* **Apache Airflow** pour orchestrer le calcul des features.
* **Feast** comme Feature Store.

**Instructions détaillées** :

1. Installe Feast et configure le projet :

```bash
pip install feast
feast init churn_project
cd churn_project
```

2. Exemple d'entité et de features :

```python
# churn_project/feature_repo/entity.py
from feast import Entity
user = Entity(name="user_id", join_keys=["user_id"])

# churn_project/feature_repo/feature_view.py
from feast import FeatureView, Field
from feast.types import Float32
from datetime import timedelta

user_activity_view = FeatureView(
    name="user_activity",
    entities=["user_id"],
    ttl=timedelta(days=30),
    schema=[
        Field(name="avg_session_duration", dtype=Float32),
        Field(name="support_tickets_last_30d", dtype=Float32),
    ],
    online=True,
    source=... # Source définie dans data_source.py
)
```

3. Matérialise les features :

```bash
feast apply
feast materialize-incremental $(date +%F)
```

4. Utilise Airflow pour automatiser les jobs de calcul et de push vers Feast.

---

### Étape 4 : Entraînement et validation

**Objectif** : entraîner un modèle robuste sur les données et valider ses performances avant packaging.

**Technologies utilisées** :

* **scikit-learn** ou **XGBoost** pour les modèles tabulaires.
* **MLflow** pour le suivi des expériences.
* **DVC** pour versionner les datasets et modèles.

**Instructions détaillées** :

1. Crée un environnement Python dédié :

```bash
python -m venv env
source env/bin/activate
pip install pandas scikit-learn xgboost mlflow dvc
```

2. Prépare les données (depuis les features matérialisées) :

```python
import pandas as pd
from sklearn.model_selection import train_test_split

features = pd.read_parquet("cleaned-data/features.parquet")
X = features.drop("churned", axis=1)
y = features["churned"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
```

3. Entraîne un modèle XGBoost avec suivi MLflow :

```python
import mlflow
import xgboost as xgb
from sklearn.metrics import roc_auc_score

mlflow.start_run()
model = xgb.XGBClassifier(eval_metric="auc")
model.fit(X_train, y_train)

preds = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, preds)
mlflow.log_metric("roc_auc", auc)
mlflow.sklearn.log_model(model, "model")
mlflow.end_run()
```

4. Versionne le modèle avec DVC :

```bash
dvc add model.pkl
git add model.pkl.dvc
git commit -m "Ajout modèle XGBoost"
```

---

### Étape 5 : Packaging, déploiement et CI/CD

**Objectif** : transformer le modèle validé en une API déployable, intégrer dans une chaîne CI/CD, et orchestrer les mises à jour.

**Technologies utilisées** :

* **FastAPI** pour exposer l’API.
* **Docker** pour packager l’application.
* **GitHub Actions** ou **GitLab CI** pour automatiser les tests, le build et le déploiement.
* **Kubernetes** (avec Helm) pour le déploiement.

**Instructions détaillées** :

#### 1. Créer une API avec FastAPI

```python
# api/app.py
from fastapi import FastAPI, Request
import joblib
import pandas as pd

app = FastAPI()
model = joblib.load("model.pkl")

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    df = pd.DataFrame([data])
    prediction = model.predict_proba(df)[0][1]
    return {"churn_probability": prediction}
```

#### 2. Dockeriser l'application

```dockerfile
# Dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**requirements.txt** :

```
fastapi
uvicorn
pandas
scikit-learn
xgboost
joblib
```

#### 3. Construire et tester l’image

```bash
docker build -t churn-api .
docker run -p 8000:8000 churn-api
```

Test avec `curl` :

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"feature1": 0.12, "feature2": 3, ...}'
```

#### 4. CI/CD avec GitHub Actions (exemple de `.github/workflows/deploy.yml`)

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build Docker image
      run: docker build -t ghcr.io/your_user/churn-api:latest .
    - name: Push to GitHub Container Registry
      run: |
        echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u your_user --password-stdin
        docker push ghcr.io/your_user/churn-api:latest
```

#### 5. Déploiement Kubernetes avec Helm

```bash
helm create churn-api
```

Dans `values.yaml` :

```yaml
image:
  repository: ghcr.io/your_user/churn-api
  tag: latest
```

Puis :

```bash
helm install churn-api ./churn-api
```

---

### Étape 6 : Monitoring, drift, alerting

**Objectif** : surveiller les performances du modèle en production, détecter les dérives, et générer des alertes.

**Technologies utilisées** :

* **Prometheus + Grafana** pour les métriques.
* **Evidently** pour le suivi de la dérive de données.
* **Sentry** ou **ELK Stack** pour les logs et erreurs.

**Instructions détaillées** :

1. Intégrer des métriques Prometheus dans FastAPI

```python
from prometheus_client import start_http_server, Summary
start_http_server(8001)  # endpoint Prometheus
REQUEST_TIME = Summary("request_processing_seconds", "Time spent processing request")

@app.post("/predict")
@REQUEST_TIME.time()
async def predict(request: Request):
    ...
```

2. Lancer Prometheus avec configuration :

```yaml
scrape_configs:
  - job_name: 'churn-api'
    static_configs:
      - targets: ['localhost:8001']
```

3. Utiliser Evidently pour le suivi des dérives :

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

report = Report(metrics=[DataDriftPreset()])
report.run(reference_data=ref_df, current_data=prod_df)
report.save_html("drift_report.html")
```

Automatiser cette étape chaque semaine avec un DAG Airflow.

4. Alertes avec Grafana (alerting rule sur dérive de features clés) ou Sentry pour erreurs API critiques.

---

### Étape 7 : Bonnes pratiques et erreurs fréquentes

* Toujours versionner les datasets ET les modèles.
* Ne pas confondre AUC élevée avec bonne performance réelle : attention aux biais.
* Ne pas hardcoder des logiques métier dans l’API de prédiction.
* Mettre à jour les features et réentraîner régulièrement.
* Ne jamais exposer directement des données sensibles dans les logs.



---

---

# Chapitre 12 — Aller plus loin

Ce chapitre explore des sujets avancés du MLOps permettant d’aller au-delà du déploiement initial et d’industrialiser l’approche pour des systèmes ML robustes, scalables et dynamiques. On aborde ici des mécanismes d’apprentissage actif, de tests A/B, d’architecture multi-tenants et une analyse comparative des solutions open-source et cloud.

---

## 1. Monitoring avec retraining automatique (Active Learning)

### Objectif

Mettre en place un système capable de détecter les dérives et déclencher automatiquement le réentraînement du modèle avec les nouvelles données jugées informatives.

### Étapes détaillées

* **Suivi des performances du modèle en production** :

  * Collecte des prédictions et vérités terrain (quand disponibles).
  * Calcul de métriques temporelles (rolling accuracy, f1-score).

* **Détection de dérive** :

  * Utilisation d’Evidently, Alibi Detect ou River pour monitorer le data drift et concept drift.
  * Seuils critiques définis pour déclencher une alerte.

* **Sélection active des exemples** :

  * Échantillons à faible confiance du modèle (ex : marge faible dans SVM, entropie de softmax élevée).
  * Choix de la stratégie : incertitude, diversité, densité, hybridation.

* **Réentraînement automatique** :

  * Orchestration via Airflow / Prefect.
  * Stockage des exemples labellisés via feedback utilisateur ou annotation humaine.
  * Modèle entraîné, validé, versionné puis promu automatiquement si meilleur.

---

## 2. A/B testing sur modèles ML

### Objectif

Comparer deux versions d’un modèle en conditions réelles, en mesurant leur impact sur des métriques métiers et techniques.

### Implémentation

* **Stratégies de déploiement** :

  * **Canary release** : petit pourcentage de trafic vers la nouvelle version.
  * **Shadow deployment** : double prédiction silencieuse, sans retour utilisateur.

* **Suivi des performances comparées** :

  * Collecte des métriques métier (taux de conversion, satisfaction).
  * Suivi des erreurs, latence, robustesse.
  * Analyse statistique : test de Student, bootstrap, Bayes factor.

* **Infrastructure** :

  * Istio pour le routage du trafic.
  * MLflow pour le suivi des versions.

---

## 3. Multi-tenancy et scaling MLOps en entreprise

### Objectif

Concevoir une architecture capable de servir plusieurs équipes ou clients avec une infrastructure partagée, tout en garantissant l’isolation, la sécurité et la scalabilité.

### Approches

* **Séparation logique ou physique** :

  * Par namespace Kubernetes, projet GCP, ou cluster distinct.

* **Gestion des identités et droits** :

  * RBAC, OAuth, scopes personnalisés sur les APIs.

* **Déploiement de modèles multi-instances** :

  * Serveur de modèles (Seldon, KFServing, TorchServe) avec dynamique d’allocation.

* **Suivi individualisé** :

  * Dashboards par client ou équipe.
  * Logs et métriques isolés.

---

## 4. Comparaison de stacks MLOps (open-source vs cloud providers)

### Objectif

Aider au choix technologique en comparant les stacks open-source aux solutions cloud managées, selon les besoins du projet.

### Critères comparés

| Critère                | Open-source (ex : MLflow + DVC + Airflow) | Cloud (ex : Vertex AI, SageMaker, Azure ML) |
| ---------------------- | ----------------------------------------- | ------------------------------------------- |
| Coût                   | Faible à modéré, dépend de l’infra        | Élevé, coût à l’usage                       |
| Courbe d’apprentissage | Plus raide, nécessite DevOps              | Interface guidée, abstractions élevées      |
| Flexibilité            | Totale, personnalisable                   | Restreinte, dépend du provider              |
| Maintenance            | À charge de l’équipe                      | Gérée par le cloud                          |
| Intégration CI/CD      | À construire soi-même                     | Intégrée à l’écosystème                     |
| Gouvernance & sécurité | Personnalisable, effort manuel            | Standards cloud, IAM intégrés               |
| Scalabilité            | Exige expertise technique                 | Native, autoscaling intégré                 |

### Recommandations

* Favoriser l’open-source pour les startups tech, équipes R\&D ou cas spécifiques très personnalisés.
* Favoriser les cloud providers pour les projets à fort volume, équipes réduites ou besoin de time-to-market rapide.

---

