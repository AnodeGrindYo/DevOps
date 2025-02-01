---
title: "Surveillance et Logs"
description: "Mettre en place une solution de monitoring pour surveiller l’état de TaskManagerPro et collecter des métriques système et applicatives."
category: "cours-devops"
---

### Module 6 : Surveillance et Logs

---

#### **6.1. Monitoring avec Prometheus et Grafana**

##### **Objectif :**
- Mettre en place une solution de monitoring pour surveiller l’état de TaskManagerPro.
- Collecter des métriques système et applicatives.

##### **Introduction :**
Le monitoring est essentiel en DevOps pour anticiper les pannes et optimiser les performances. Prometheus est un outil de collecte de métriques, et Grafana permet de les visualiser sous forme de tableaux de bord interactifs.

##### **Installation de Prometheus :**
1. **Télécharger et installer Prometheus** :
   ```bash
   wget https://github.com/prometheus/prometheus/releases/latest/download/prometheus-linux-amd64.tar.gz
   tar xvf prometheus-linux-amd64.tar.gz
   cd prometheus-*
   ```
2. **Configurer Prometheus** :
   - Modifier le fichier `prometheus.yml` pour ajouter les endpoints à surveiller.
   ```yaml
   scrape_configs:
     - job_name: 'taskmanagerpro'
       static_configs:
         - targets: ['localhost:9090']
   ```
3. **Démarrer Prometheus** :
   ```bash
   ./prometheus --config.file=prometheus.yml
   ```

##### **Installation de Grafana :**
1. **Installer Grafana sur Linux** :
   ```bash
   sudo apt update
   sudo apt install -y grafana
   sudo systemctl enable --now grafana-server
   ```
2. **Accéder à Grafana** :
   - Rendez-vous sur `http://<adresse_ip>:3000`
   - Identifiants par défaut : `admin / admin`
3. **Ajouter Prometheus comme source de données** :
   - Accéder à **Configuration > Data Sources**
   - Ajouter **Prometheus** avec l’URL `http://localhost:9090`
   - Enregistrer et tester

##### **Créer un tableau de bord Grafana :**
- **Importer un dashboard prédéfini** depuis [Grafana.com](https://grafana.com/grafana/dashboards/)
- **Ajouter un panneau personnalisé** affichant les requêtes HTTP, l’utilisation CPU et mémoire

##### **Exercice pratique :**
Configurer un tableau de bord affichant les performances de TaskManagerPro, incluant :
- Temps de réponse des requêtes API
- Nombre d’utilisateurs actifs
- Utilisation CPU et mémoire

---

#### **6.2. Gestion des Logs avec ELK Stack**

##### **Objectif :**
- Collecter et centraliser les logs applicatifs et système.
- Faciliter l’analyse des erreurs grâce à Elasticsearch, Logstash et Kibana.

##### **Introduction :**
Le stack ELK est une solution open-source permettant de gérer et d’analyser des logs en temps réel. 
- **Elasticsearch** : stocke et indexe les logs.
- **Logstash** : collecte, transforme et envoie les logs.
- **Kibana** : visualise les logs dans des tableaux de bord interactifs.

##### **Installation de l’ELK Stack :**
1. **Installer Elasticsearch** :
   ```bash
   sudo apt install -y elasticsearch
   sudo systemctl enable --now elasticsearch
   ```
2. **Installer Logstash** :
   ```bash
   sudo apt install -y logstash
   ```
3. **Configurer Logstash pour récupérer les logs de TaskManagerPro** :
   - Modifier `/etc/logstash/conf.d/taskmanagerpro.conf` :
   ```
   input {
     file {
       path => "/var/log/taskmanagerpro.log"
       start_position => "beginning"
     }
   }
   filter {
     grok {
       match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
     }
   }
   output {
     elasticsearch {
       hosts => ["http://localhost:9200"]
       index => "taskmanagerpro-logs"
     }
   }
   ```
4. **Démarrer Logstash** :
   ```bash
   sudo systemctl start logstash
   ```

##### **Installation de Kibana** :
1. **Installer Kibana** :
   ```bash
   sudo apt install -y kibana
   sudo systemctl enable --now kibana
   ```
2. **Accéder à Kibana** :
   - Aller sur `http://<adresse_ip>:5601`
   - Ajouter l’index **taskmanagerpro-logs**
   - Créer un tableau de bord pour analyser les erreurs et logs applicatifs

##### **Exercice pratique :**
Configurer ELK pour :
- Collecter les logs applicatifs de TaskManagerPro
- Créer des alertes en cas d’erreur critique

---