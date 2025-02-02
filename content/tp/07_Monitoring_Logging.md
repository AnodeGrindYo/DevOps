---
title: "07 Mise en place du Monitoring et Logging"
description: ""
category: "tp"
---

# 7. Mise en place du Monitoring et Logging

## 7.1 Objectif
L'objectif de cette section est de **mettre en place un système de monitoring et de logging** pour surveiller l’état des applications et de l’infrastructure Kubernetes. Cela permet de détecter rapidement les anomalies et d’assurer la performance et la disponibilité des services.

## 7.2 Technologies utilisées
- **Prometheus** : Collecte des métriques de l’infrastructure et des applications.
- **Grafana** : Visualisation des métriques sous forme de tableaux de bord interactifs.
- **Loki** : Centralisation des logs.
- **Fluentd / Fluent Bit** : Collecte et transfert des logs vers Loki.
- **Alertmanager** : Gestion des alertes basées sur les métriques Prometheus.

## 7.3 Déploiement de Prometheus
Prometheus est utilisé pour récupérer les métriques des pods, des services et des nœuds Kubernetes.

### 7.3.1 Installation avec Helm
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
```

### 7.3.2 Vérification du déploiement
```bash
kubectl get pods -n monitoring
kubectl get services -n monitoring
```

### 7.3.3 Accès à l’interface Prometheus
```bash
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090 -n monitoring
```
Accès via le navigateur : `http://localhost:9090`

### 7.3.4 Ajout de métriques personnalisées
Exemple d’instrumentation d’une application Node.js avec `prom-client` :
```javascript
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});
```

## 7.4 Visualisation avec Grafana
Grafana est utilisé pour afficher les métriques collectées par Prometheus.

### 7.4.1 Installation avec Helm
```bash
helm install grafana prometheus-community/grafana --namespace monitoring
```

### 7.4.2 Accès à Grafana
```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```
Connexion via `http://localhost:3000` (identifiants par défaut : `admin / prom-operator`).

### 7.4.3 Ajout de Prometheus comme source de données
- Aller dans **Configuration > Data Sources**
- Ajouter **Prometheus** avec l’URL : `http://prometheus-kube-prometheus-prometheus.monitoring.svc:9090`
- Importer des dashboards prédéfinis (ex : `315` pour Kubernetes)

## 7.5 Centralisation des logs avec Loki
Loki est une solution de gestion des logs qui fonctionne avec Prometheus et Grafana.

### 7.5.1 Installation de Loki avec Helm
```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install loki grafana/loki-stack --namespace logging --create-namespace
```

### 7.5.2 Configuration de Fluent Bit pour collecter les logs
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: logging
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush 5
        Log_Level info

    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        Tag kube.*

    [OUTPUT]
        Name loki
        Match *
        Url http://loki:3100/loki/api/v1/push
```

### 7.5.3 Déploiement de Fluent Bit
```bash
kubectl apply -f fluent-bit-config.yaml
```

### 7.5.4 Accès aux logs via Grafana
- Ajouter une nouvelle **Data Source Loki** dans Grafana
- URL : `http://loki.logging.svc:3100`
- Utiliser `LogQL` pour rechercher des logs :
```logql
{kubernetes_namespace_name="default"} |= "error"
```

## 7.6 Configuration des alertes avec Alertmanager
### 7.6.1 Création d'une règle d'alerte Prometheus
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: high-cpu-usage
  namespace: monitoring
spec:
  groups:
  - name: cpu-alerts
    rules:
    - alert: HighCPUUsage
      expr: instance:node_cpu_utilization:avg5m > 0.8
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Utilisation CPU élevée"
        description: "L'instance {{ $labels.instance }} dépasse 80% d'utilisation CPU."
```

### 7.6.2 Déploiement des alertes
```bash
kubectl apply -f prometheus-alerts.yaml
```

### 7.6.3 Configuration d'Alertmanager pour envoyer des notifications
Exemple de configuration pour envoyer des alertes sur Slack :
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    route:
      receiver: slack
    receivers:
      - name: slack
        slack_configs:
          - channel: '#alerts'
            api_url: 'https://hooks.slack.com/services/TOKEN'
```
```bash
kubectl apply -f alertmanager-config.yaml
```

## 7.7 Conclusion
La mise en place de **Prometheus, Grafana, Loki et Alertmanager** permet une surveillance avancée de l’infrastructure et des applications. Grâce à ces outils, il est possible de **détecter rapidement les incidents, optimiser les performances et recevoir des alertes en cas de problème critique**.

