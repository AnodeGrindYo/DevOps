---
title: "05 Déploiement sur Kubernetes"
description: ""
category: "tp"
---

# 5. Déploiement sur Kubernetes

## 5.1 Objectif
L’objectif de cette étape est de déployer l’application conteneurisée sur un cluster Kubernetes afin d’assurer une gestion efficace des conteneurs, incluant **l’orchestration, la mise à l’échelle automatique et la résilience**.

## 5.2 Présentation de Kubernetes
**Kubernetes (K8s)** est un système d’orchestration de conteneurs open-source permettant d’automatiser le déploiement, la mise à l’échelle et la gestion des applications conteneurisées. Il est composé de plusieurs ressources essentielles :

- **Pods** : Unité de déploiement de base regroupant un ou plusieurs conteneurs.
- **Deployments** : Gèrent le déploiement et la mise à jour des pods.
- **Services** : Exposent les applications en interne ou en externe.
- **Ingress** : Gère le routage du trafic HTTP/HTTPS vers les services.
- **ConfigMaps & Secrets** : Gèrent la configuration et les variables sensibles.

## 5.3 Préparation du cluster Kubernetes
Avant de déployer l’application, nous devons avoir un cluster Kubernetes opérationnel. Cela peut être :
- **Un cluster managé** (EKS sur AWS, GKE sur GCP, AKS sur Azure).
- **Un cluster auto-hébergé** avec **K3s**, **Minikube** ou **Kubeadm**.

### 5.3.1 Vérification de l'installation de Kubernetes
```bash
kubectl version --client
kubectl get nodes
```

## 5.4 Création des manifests Kubernetes
Un **manifest Kubernetes** est un fichier YAML définissant les ressources à créer.

### 5.4.1 Déploiement de l’application (Deployment)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myrepo/myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

### 5.4.2 Création du service Kubernetes
Un service expose l’application en interne (ClusterIP) ou externe (LoadBalancer, NodePort).

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### 5.4.3 Création d’un Ingress Controller
L’Ingress permet de gérer les requêtes HTTP via un nom de domaine.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
```

## 5.5 Application des manifests
Les fichiers YAML doivent être appliqués au cluster :
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## 5.6 Vérification du déploiement
### 5.6.1 Vérifier les pods
```bash
kubectl get pods
```
### 5.6.2 Vérifier les services
```bash
kubectl get services
```
### 5.6.3 Vérifier l'Ingress
```bash
kubectl get ingress
```

## 5.7 Mise à l’échelle automatique (Horizontal Pod Autoscaler - HPA)
Kubernetes permet de mettre à l’échelle automatiquement en fonction de la charge CPU.

### 5.7.1 Création du HPA
```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 5.7.2 Application du HPA
```bash
kubectl apply -f hpa.yaml
```

### 5.7.3 Vérification du HPA
```bash
kubectl get hpa
```

## 5.8 Gestion des configurations avec ConfigMaps et Secrets
Les **ConfigMaps** et **Secrets** permettent de stocker des variables d’environnement et des données sensibles.

### 5.8.1 Création d’un ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  labels:
    app: myapp
data:
  DATABASE_URL: "postgres://user:password@db:5432/mydatabase"
```

### 5.8.2 Création d’un Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secret
data:
  SECRET_KEY: c2VjcmV0X2tleQ==  # Base64 encoded
```

## 5.9 Surveillance et Logging
Kubernetes fournit des outils natifs et intégrés pour la surveillance :

### 5.9.1 Logs des pods
```bash
kubectl logs -f myapp-pod
```

### 5.9.2 Métadonnées des pods
```bash
kubectl describe pod myapp-pod
```

## 5.10 Conclusion
Le déploiement sur Kubernetes permet une **orchestration avancée, une scalabilité dynamique et une gestion centralisée des conteneurs**. Grâce aux différentes ressources Kubernetes, l’application est résiliente et facilement maintenable.

