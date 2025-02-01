# Cours complet sur Kubernetes

## Introduction à Kubernetes

Kubernetes (ou K8s) est un système open-source conçu pour automatiser le déploiement, la mise à l'échelle et la gestion des applications conteneurisées. Il a été initialement développé par Google et est maintenant maintenu par la Cloud Native Computing Foundation (CNCF).

### Pourquoi utiliser Kubernetes ?
- **Automatisation du déploiement et de la gestion** : Kubernetes permet d'automatiser le déploiement et la mise à jour des applications.
- **Mise à l'échelle facile** : Il permet de faire évoluer dynamiquement les applications en fonction de la charge.
- **Tolérance aux pannes** : Kubernetes redémarre automatiquement les conteneurs qui tombent en panne.
- **Portabilité et flexibilité** : Kubernetes fonctionne sur divers environnements (on-premise, cloud, hybride).

## Architecture de Kubernetes

### Composants principaux

#### 1. **Le cluster Kubernetes**
Un cluster Kubernetes est composé de plusieurs machines (nœuds) qui exécutent les conteneurs. Il se divise en deux parties :
- **Le plan de contrôle (Control Plane)** : Gère l’ensemble du cluster.
- **Les nœuds (Nodes)** : Exécutent les applications conteneurisées.

#### 2. **Le Control Plane**
- **API Server** : Interface RESTful permettant aux utilisateurs et aux composants d'interagir avec Kubernetes.
- **Etcd** : Base de données distribuée stockant l’état du cluster.
- **Scheduler** : Planifie l’exécution des Pods sur les nœuds.
- **Controller Manager** : Gère les différents contrôleurs du cluster (ReplicaSet, Node Controller, etc.).
- **Cloud Controller Manager** : Interagit avec les fournisseurs cloud (si applicable).

#### 3. **Les nœuds (Nodes)**
Chaque nœud contient :
- **Kubelet** : Agent assurant l’exécution correcte des conteneurs sur un nœud.
- **Container Runtime** : Moteur d’exécution des conteneurs (Docker, containerd, CRI-O).
- **Kube Proxy** : Assure la communication réseau entre les Pods et les services.

## Concepts fondamentaux

### 1. **Pod**
Un Pod est l’unité de base de Kubernetes. Il peut contenir un ou plusieurs conteneurs partageant le même réseau et stockage.

### 2. **Service**
Un Service expose un groupe de Pods à travers un endpoint stable, permettant la communication interne et externe.

### 3. **Deployment**
Un Deployment gère le déploiement et la mise à jour des Pods, garantissant la haute disponibilité et la résilience des applications.

### 4. **ReplicaSet**
Un ReplicaSet garantit qu'un nombre défini de copies identiques d'un Pod sont toujours en cours d'exécution.

### 5. **ConfigMap et Secret**
- **ConfigMap** : Stocke des configurations sous forme de paires clé-valeur.
- **Secret** : Similaire à ConfigMap, mais utilisé pour stocker des données sensibles (mots de passe, clés API, etc.).

### 6. **Ingress**
Un Ingress permet d’exposer des applications HTTP et HTTPS avec un contrôle avancé du routage.

### 7. **Namespace**
Les Namespaces permettent d’isoler des groupes de ressources au sein d’un même cluster.

## Déploiement d’une application sur Kubernetes

### Étape 1 : Créer un fichier YAML pour un Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-pod
spec:
  containers:
  - name: mon-container
    image: nginx
    ports:
    - containerPort: 80
```
Déployer avec :
```bash
kubectl apply -f mon-pod.yaml
```

### Étape 2 : Déployer un Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
      - name: mon-container
        image: nginx
        ports:
        - containerPort: 80
```
Déployer avec :
```bash
kubectl apply -f mon-deployment.yaml
```

### Étape 3 : Exposer avec un Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mon-service
spec:
  selector:
    app: mon-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```
Déployer avec :
```bash
kubectl apply -f mon-service.yaml
```

## Gestion et surveillance du cluster

### Vérifier les ressources
```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

### Afficher les logs d’un Pod
```bash
kubectl logs mon-pod
```

### Accéder à un conteneur en mode interactif
```bash
kubectl exec -it mon-pod -- /bin/bash
```

## Mise à l'échelle et mises à jour

### Mise à l’échelle automatique
```bash
kubectl scale deployment mon-deployment --replicas=5
```

### Mise à jour d’une application
```yaml
spec:
  template:
    spec:
      containers:
      - name: mon-container
        image: nginx:1.21
```
Appliquer avec :
```bash
kubectl apply -f mon-deployment.yaml
```

## En résumé
Kubernetes est un outil puissant pour gérer les applications conteneurisées de manière automatisée, scalable et résiliente. Il permet de simplifier le déploiement, la mise à l’échelle et la gestion des applications en production.

