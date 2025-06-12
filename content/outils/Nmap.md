---
title: "Nmap"
description: "Nmap (Network Mapper) est un outil open-source puissant utilisé pour l'exploration réseau et les audits de sécurité. Il permet de détecter les hôtes, les ports ouverts, les services actifs, les systèmes d'exploitation, et même les vulnérabilités. Ce tutoriel complet vous guide pas à pas dans son utilisation dans des contextes DevOps, MLOps, SecOps et DevSecOps modernes."
category: "outils"
---

---

# Introduction

## Qu'est-ce que Nmap ?

Nmap, ou **Network Mapper**, est un outil open source conçu pour l'exploration réseau et les audits de sécurité. Développé initialement par Gordon Lyon (alias Fyodor), Nmap est aujourd'hui un pilier incontournable dans les environnements DevOps, SecOps et plus largement dans la cybersécurité.

Il permet de :

* Scanner des hôtes sur un réseau
* Découvrir des services et systèmes d'exploitation
* Identifier des vulnérabilités potentielles
* Cartographier dynamiquement une infrastructure réseau

Nmap est extrêmement modulable : il peut être utilisé de manière très simple en ligne de commande pour détecter rapidement si un hôte est actif, ou de manière plus avancée avec des scripts personnalisés capables de simuler des attaques spécifiques.

## Pourquoi apprendre Nmap dans une approche DevOps/SecOps/MLOps ?

Traditionnellement utilisé par les pentesters et analystes sécurité, Nmap s'est imposé comme un outil essentiel pour d'autres domaines techniques, notamment :

### Pour les DevOps

* Visualiser en temps réel la structure réseau de l'infrastructure déployée
* Vérifier que seuls les ports nécessaires sont exposés après un déploiement
* S'assurer de la bonne configuration des règles de firewall ou de sécurité des groupes

### Pour les SecOps

* Identifier rapidement les services non autorisés ou les ports oubliés
* Automatiser les audits de sécurité en continu sur les réseaux internes
* Détecter les changements suspects dans l’exposition des services

### Pour les DevSecOps

* Intégrer des scans de ports et services dans les pipelines CI/CD
* Bloquer ou notifier en cas de découverte d’un port critique exposé
* Maintenir une « surface d’attaque » minimale au fil des itérations produit

### Pour les MLOps

* Sécuriser les environnements de déploiement de modèles (API, dashboards, etc.)
* Identifier les points d’exposition involontaires dans des clusters ou des notebooks partagés
* Prévenir l’ouverture non maîtrisée de ports (par exemple via Jupyter, MLflow ou TensorBoard)

## Cas d’usage typiques

* **Cartographie automatisée d’un parc réseau** : utile pour l’inventaire continu des ressources
* **Vérification de conformité** : s’assurer que la configuration réseau respecte les normes internes ou externes
* **Surveillance en temps réel** : détection de nouvelles machines, ports ou services dans un réseau sensible
* **Test avant déploiement** : scanner une VM ou un conteneur dans un pipeline avant mise en production
* **Analyse post-mortem** : comprendre l’exposition réseau d’une machine compromise ou d’un service vulnérable

---

Apprendre à maîtriser Nmap, ce n’est pas seulement savoir taper quelques commandes. C’est acquérir une capacité d’analyse critique de l’exposition réseau de son système. C’est intégrer une approche **préventive et proactive** de la sécurité, essentielle dans les environnements modernes.

Le reste du cours vous apprendra à utiliser Nmap non pas comme un gadget ponctuel, mais comme un **outil quotidien et intégré** à votre cycle de développement, de déploiement et de supervision.


---

# Partie 1 — Fondamentaux de Nmap

## 1. Installation et prise en main

### 1.1 Installation de Nmap

#### Sur Linux (Debian, Ubuntu, Kali, etc.)

Ouvrez un terminal et tapez :

```bash
sudo apt update
sudo apt install nmap -y
```

Cela installera la dernière version disponible dans les dépôts officiels.

#### Sur Fedora / Red Hat / CentOS

```bash
sudo dnf install nmap -y
```

#### Sur Arch Linux / Manjaro

```bash
sudo pacman -S nmap
```

#### Sur macOS

Utilisez [Homebrew](https://brew.sh/) :

```bash
brew install nmap
```

Assurez-vous que `brew` est installé avant (voir [https://brew.sh/](https://brew.sh/)).

#### Sur Windows

1. Rendez-vous sur la page officielle : [https://nmap.org/download.html](https://nmap.org/download.html)
2. Téléchargez l’installateur Windows (inclut Zenmap et Npcap)
3. Lancez l’installateur et acceptez les options par défaut (ne décochez **Npcap**)
4. Une fois installé, ouvrez `cmd.exe` et tapez :

```cmd
nmap -v
```

Vous devriez voir s’afficher la version installée.

### 1.2 Interface CLI vs Zenmap (GUI)

#### Interface CLI (Command Line Interface)

C’est l’interface par défaut de Nmap. Elle permet :

* Une exécution rapide et automatisable
* L’intégration dans des scripts ou pipelines
* Un contrôle total sur les options

Exemple de commande simple :

```bash
nmap 192.168.1.1
```

#### Interface graphique Zenmap

Zenmap est une interface GUI qui facilite l’usage de Nmap pour les débutants. Elle permet de :

* Sauvegarder des profils de scan
* Visualiser les résultats sous forme de tableaux
* Voir la commande Nmap équivalente générée par l’interface

**Astuce :** même si vous débutez avec Zenmap, entraînez-vous à lire et modifier la commande affichée.

---

## 2. Principes de base des scans réseau

Un scan Nmap se décompose en plusieurs étapes :

1. Découverte d’hôtes (hôtes actifs)
2. Scan de ports
3. Identification des services (bannière)
4. Détection de l’OS

Nous abordons ici les bases :

### 2.1 Scan de ports TCP

#### Scan TCP SYN (semi-ouvert)

```bash
nmap -sS 192.168.1.1
```

Ce type de scan :

* N’envoie qu’un paquet SYN (pas d’ACK)
* Est plus rapide
* Moins détectable (ne termine pas la connexion)

**Note :** Nécessite les privilèges root/administrateur sur la plupart des OS.

#### Scan TCP connect (standard)

```bash
nmap -sT 192.168.1.1
```

* Utilise l'appel système `connect()` du système d’exploitation
* Plus détectable car la connexion est complète (SYN, SYN/ACK, ACK)
* Ne nécessite pas de privilèges root

### 2.2 Scan UDP

```bash
nmap -sU 192.168.1.1
```

* Plus lent que TCP (pas de handshake, donc pas d’ACKs clairs)
* Souvent utilisé pour découvrir des services comme DNS, SNMP, TFTP

**Conseil :** combiner avec TCP pour un scan complet :

```bash
sudo nmap -sS -sU 192.168.1.1
```

### 2.3 Détection d’hôtes (ping sweep)

```bash
nmap -sn 192.168.1.0/24
```

* Envoie un ping ICMP à chaque adresse du sous-réseau
* N’affiche que les machines actives (pas les ports)

**Utilité :** cartographier les machines d’un réseau local ou cloud

---

### 2.4 Options de base à connaître

#### `-sS` : scan TCP SYN (rapide, discret, nécessite root)

```bash
sudo nmap -sS 192.168.1.1
```

#### `-sU` : scan UDP

```bash
sudo nmap -sU 192.168.1.1
```

#### `-Pn` : ne fait pas de ping préalable (utile sur les machines qui ne répondent pas à l’ICMP)

```bash
nmap -Pn 192.168.1.1
```

#### `-p` : sélectionner les ports à scanner

```bash
nmap -p 22,80,443 192.168.1.1
```

* Vous pouvez aussi faire : `-p-` pour scanner tous les ports (1 à 65535)

#### `-T` : définir l’agressivité du scan (de `T0` à `T5`)

```bash
nmap -T4 192.168.1.1
```

* `T0` : très lent (furtif)
* `T3` : équilibré (par défaut)
* `T5` : très rapide (bruyant)

**Recommandé pour CI/CD ou scan rapide :**

```bash
nmap -T4 -F 192.168.1.1
```

(`-F` = fast scan sur les ports les plus communs)

---

## Résumé visuel des commandes utiles

| Objectif            | Commande                        |
| ------------------- | ------------------------------- |
| Scan rapide         | `nmap -T4 -F 192.168.1.1`       |
| Scan tous ports TCP | `sudo nmap -sS -p- 192.168.1.1` |
| Scan UDP            | `sudo nmap -sU 192.168.1.1`     |
| Ping sweep          | `nmap -sn 192.168.1.0/24`       |
| Sans ping ICMP      | `nmap -Pn 192.168.1.1`          |
| Ports spécifiques   | `nmap -p 22,80,443 192.168.1.1` |
| Scan lent/discret   | `nmap -T1 -sS 192.168.1.1`      |

---

À ce stade, vous êtes capable de :

* Installer et lancer Nmap
* Comprendre les principaux types de scans
* Identifier les options essentielles pour adapter vos scans à la situation

Dans la prochaine partie, nous apprendrons à identifier les systèmes, services et applications exposés, et à exporter les résultats pour les intégrer à un processus de supervision ou d’analyse de vulnérabilité.

---

# Partie 2 — Exploration du réseau et cartographie

## 3. Détection d'OS et de services

L’un des grands points forts de Nmap est sa capacité à identifier les systèmes d’exploitation, les services actifs et les applications en réseau. Cela permet de comprendre exactement ce qui tourne sur une machine, pour anticiper les risques ou faire de l’inventaire automatisé.

### 3.1 Détection d’OS (`-O`)

```bash
sudo nmap -O 192.168.1.1
```

Cette option déclenche une tentative de détection du système d’exploitation distant. Elle s’appuie sur :

* L’analyse des paquets de réponse (TTL, TCP Window, etc.)
* Des signatures connues dans la base de données interne de Nmap

**Conditions nécessaires :**

* Nécessite des privilèges administrateur (root)
* Fonctionne mieux si plusieurs ports sont ouverts
* Peut être imprécise si la machine cible utilise un pare-feu ou un proxy

**Conseil :** combinez avec `-sS` et `-v` pour plus de détails :

```bash
sudo nmap -sS -O -v 192.168.1.1
```

### 3.2 Détection de version des services (`-sV`)

```bash
nmap -sV 192.168.1.1
```

Cette option permet d’identifier :

* Le nom du service (ex : SSH, HTTP, FTP...)
* Sa version exacte (ex : OpenSSH 8.2p1, Apache 2.4.41...)

**Utilité :**

* Évaluer la vétusté des services
* Identifier des failles spécifiques à une version
* Mieux cibler les audits de vulnérabilité

**Conseil :** combinez avec `-p` pour ne scanner que certains ports :

```bash
nmap -sV -p 22,80,443 192.168.1.1
```

### 3.3 Bannière et fingerprinting

Certaines bannières de services (retours de type "220 OpenSSH 8.2p1 Ubuntu") sont suffisantes pour déduire des informations sensibles.

Pour les afficher manuellement :

```bash
nmap -sV --version-all 192.168.1.1
```

Cela lance tous les tests de version disponibles, ce qui peut être plus long mais plus précis.

---

## 4. Découverte réseau automatisée

### 4.1 Scan de sous-réseaux

```bash
nmap -sn 192.168.1.0/24
```

* Identifie tous les hôtes actifs sur un sous-réseau donné
* N’affiche pas les ports, uniquement les adresses IP actives

**Conseil :** combinez avec `-oG` pour un résultat facilement analysable :

```bash
nmap -sn 192.168.1.0/24 -oG subnet_scan.txt
```

### 4.2 Filtrage par type de machine / système

Une fois un scan complet effectué, vous pouvez filtrer les résultats pour ne garder que certains OS ou services.

Exemple avec `grep` sur les OS Linux :

```bash
grep -i linux subnet_scan.txt
```

Ou sur les services HTTP :

```bash
grep -i http subnet_scan.txt
```

Pour une approche plus structurée, utilisez le format XML ou JSON (voir section suivante).

### 4.3 Exportation des résultats

Nmap permet d’exporter les résultats dans plusieurs formats.

#### Format Grepable (rapide à analyser)

```bash
nmap -oG resultats.txt 192.168.1.0/24
```

#### Format XML (structuré, idéal pour parsing automatique)

```bash
nmap -oX resultats.xml 192.168.1.0/24
```

#### Format JSON (avec `nmap2json`, un outil externe)

Nmap ne supporte pas le JSON nativement, mais vous pouvez convertir :

```bash
pip install nmaptocsv
nmap -oX resultats.xml 192.168.1.0/24
nmaptocsv -i resultats.xml -o resultats.csv --fields ip-address,ports
```

Ou utiliser `xml2json` sur le XML produit.

---

## 5. Visualisation

### 5.1 Utilisation de `ndiff` (comparaison de scans)

`ndiff` permet de comparer deux fichiers de scan Nmap :

```bash
nmap -oX scan1.xml 192.168.1.0/24
# quelques jours plus tard
nmap -oX scan2.xml 192.168.1.0/24
ndiff scan1.xml scan2.xml
```

Cela affiche :

* Les hôtes ou services nouvellement apparus
* Ceux qui ont disparu
* Les changements de versions ou d’état

### 5.2 Conversion en HTML avec `xsltproc`

Pour transformer le XML en page HTML :

```bash
xsltproc /usr/share/nmap/nmap.xsl resultats.xml -o rapport.html
```

Puis ouvrez `rapport.html` dans un navigateur.

### 5.3 Visualisation web : `webxml`

`webxml` est une interface web qui permet de naviguer facilement dans un fichier XML généré par Nmap. Elle peut être auto-hébergée ou utilisée localement.

Installation :

```bash
git clone https://github.com/mrschyte/webxml
cd webxml
# Placez vos .xml dans le dossier prévu, ouvrez index.html
```

### 5.4 Intégration avec d'autres outils

#### Graphviz

Vous pouvez générer un graphe des relations réseau à partir des données Nmap (avec traitement préalable du XML ou `nmap -oG`).

Exemple de pipeline :

```bash
nmap -oG res.txt 192.168.1.0/24
# Utiliser un script Python pour transformer en .dot
# Puis générer l’image
neato -Tpng fichier.dot -o reseau.png
```

#### ELK (Elasticsearch + Logstash + Kibana)

1. Convertissez les résultats en JSON
2. Utilisez Logstash pour ingérer les données dans Elasticsearch
3. Créez un tableau de bord sur Kibana

Cela permet :

* Une cartographie dynamique du réseau
* Une détection visuelle d’anomalies
* Une historisation des scans (combiné avec `ndiff`)

---

## Récapitulatif

| Objectif                   | Commande ou outil                        |
| -------------------------- | ---------------------------------------- |
| Détecter l’OS              | `sudo nmap -O IP`                        |
| Détecter versions services | `nmap -sV IP`                            |
| Export XML                 | `nmap -oX fichier.xml IP`                |
| Comparer deux scans        | `ndiff scan1.xml scan2.xml`              |
| HTML à partir XML          | `xsltproc nmap.xsl fichier.xml -o .html` |
| Visualisation Web          | `webxml`                                 |
| Analyse structurée         | JSON + ELK / CSV                         |

---

À ce stade, vous êtes capable de :

* Identifier les OS et versions de services sur n’importe quel hôte
* Scanner tout un réseau pour en extraire une cartographie exploitable
* Exporter et visualiser les résultats pour une analyse ou un reporting facile

La prochaine étape consistera à passer à la **détection de vulnérabilités**, un aspect central du travail SecOps/DevSecOps.


---

# Partie 3 — Nmap pour la sécurité

## 6. Détection de vulnérabilités

### 6.1 Nmap Scripting Engine (NSE)

Le **Nmap Scripting Engine (NSE)** permet d'exécuter des scripts Lua embarqués dans Nmap, conçus pour :

* Détecter des vulnérabilités connues
* Réaliser du brute-force
* Identifier des failles de configuration

Ces scripts sont classés en catégories :

* `auth` : authentification, brute force
* `default` : scripts activés par défaut
* `discovery` : exploration réseau
* `exploit` : exploitation de vulnérabilités
* `vuln` : détection de vulnérabilités connues

Pour voir tous les scripts disponibles :

```bash
ls /usr/share/nmap/scripts/
```

Ou directement dans Nmap :

```bash
nmap --script-help=all
```

### 6.2 Scripts populaires

#### Script `vuln`

C’est un script « méta » qui regroupe plusieurs tests de vulnérabilités :

```bash
nmap --script vuln 192.168.1.1
```

Il peut détecter :

* SMBv1 (EternalBlue)
* OpenSSL Heartbleed
* Serveurs web obsolètes
* Faille MS08-067, etc.

#### Script `http-enum`

Liste les répertoires et services d’un serveur web.

```bash
nmap -p 80 --script http-enum 192.168.1.1
```

#### Script `ftp-anon`

Teste si l’accès FTP anonyme est activé.

```bash
nmap -p 21 --script ftp-anon 192.168.1.1
```

#### Autres utiles :

```bash
--script sshv1            # Détection de SSHv1
--script smb-os-discovery # Découverte système via SMB
--script dns-zone-transfer # Test de transfert DNS
```

### 6.3 Lancer un scan de vulnérabilités ciblé

Pour scanner un hôte et rechercher des vulnérabilités sur certains ports :

```bash
sudo nmap -sV --script vuln -p 21,22,80,443 192.168.1.1
```

Ou pour des catégories spécifiques :

```bash
sudo nmap -sV --script "default or vuln" 192.168.1.1
```

---

## 7. Éviter les détections / IDS

Les IDS (Intrusion Detection Systems) détectent souvent les scans Nmap. Heureusement, Nmap fournit plusieurs options pour rester discret.

### 7.1 Options d’évasion

#### `--data-length <taille>`

Ajoute des données aléatoires dans les paquets pour brouiller les signatures.

```bash
nmap --data-length 50 192.168.1.1
```

#### `--randomize-hosts`

Mélange l’ordre des IP scannées (utile dans une plage IP).

```bash
nmap --randomize-hosts -iL liste_ips.txt
```

#### `--spoof-mac <valeur>`

Change l’adresse MAC source pour chaque scan.

```bash
nmap --spoof-mac Apple 192.168.1.1
```

Ou valeur aléatoire :

```bash
nmap --spoof-mac 0 192.168.1.1
```

### 7.2 Timing et fragmentation

#### `-T` (Timing template)

Utilisez des scans plus lents pour passer sous les radars :

```bash
nmap -T1 192.168.1.1
```

#### `-f` (fragmentation)

Envoie des paquets fragmentés pour éviter la détection :

```bash
sudo nmap -f 192.168.1.1
```

#### `--scan-delay <temps>`

Ajoute un délai entre chaque paquet :

```bash
nmap --scan-delay 5s 192.168.1.1
```

**Combinaison furtive recommandée :**

```bash
sudo nmap -sS -T1 -f --data-length 50 --spoof-mac 0 192.168.1.1
```

---

## 8. Utilisation dans un pipeline SecOps / DevSecOps

### 8.1 Intégration dans un pipeline CI/CD

Vous pouvez intégrer Nmap dans un pipeline GitLab, GitHub Actions ou Jenkins pour automatiser les scans à chaque build ou déploiement.

#### Exemple dans `.gitlab-ci.yml`

```yaml
stages:
  - scan

nmap_scan:
  stage: scan
  image: instrumentisto/nmap
  script:
    - nmap -sV --script vuln -oX report.xml 192.168.1.1
  artifacts:
    paths:
      - report.xml
```

#### Exemple GitHub Actions

```yaml
name: Scan réseau
on: [push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Installer Nmap
        run: sudo apt-get install nmap -y
      - name: Lancer le scan
        run: nmap -sV --script vuln -oX report.xml 192.168.1.1
      - name: Enregistrer le rapport
        uses: actions/upload-artifact@v2
        with:
          name: rapport-nmap
          path: report.xml
```

### 8.2 Génération de rapports automatisés

Ajoutez une étape dans le pipeline pour :

* Transformer le XML avec `xsltproc`
* Convertir en HTML ou PDF
* Envoyer par e-mail ou sur un dashboard

#### Exemple :

```bash
xsltproc /usr/share/nmap/nmap.xsl report.xml -o rapport.html
wkhtmltopdf rapport.html rapport.pdf
```

### 8.3 Alerting sur résultats critiques

Utilisez un script Python pour parser le fichier XML et envoyer des alertes si :

* Un service vulnérable est détecté
* Un nouveau port critique est apparu

#### Exemple simple :

```python
import xml.etree.ElementTree as ET

arbre = ET.parse("report.xml")
racine = arbre.getroot()

for hote in racine.findall("host"):
    for port in hote.findall("ports/port"):
        state = port.find("state").get("state")
        if state == "open":
            service = port.find("service")
            if service is not None and "vuln" in str(service.attrib):
                print("Alerte :", port.attrib, service.attrib)
```

---

## Résumé

| Objectif                      | Commande ou outil                  |
| ----------------------------- | ---------------------------------- |
| Scan de vulnérabilité complet | `nmap --script vuln -sV IP`        |
| Scan web                      | `nmap -p 80 --script http-enum IP` |
| Scan discret                  | `nmap -sS -f -T1 --spoof-mac 0 IP` |
| Export XML                    | `-oX rapport.xml`                  |
| Intégration GitLab / GitHub   | `.gitlab-ci.yml`, `GitHub Actions` |
| Génération HTML               | `xsltproc`                         |
| Parsing automatisé + alerting | `Python + xml.etree.ElementTree`   |

---

À présent, vous êtes capable d’utiliser Nmap pour :

* Scanner des services vulnérables
* Éviter les systèmes de détection
* Intégrer ces analyses dans un pipeline automatisé de sécurité

Nous passerons ensuite à des cas d’usage spécifiques DevOps/MLOps, avec des scans adaptés aux environnements en production, cloud ou conteneurisés.


---

# Partie 4 — Cas d’usage spécifiques

## 9. Nmap pour DevOps

L’usage de Nmap dans une logique DevOps vise à **visualiser l’infrastructure réseau**, **vérifier la disponibilité des services** et **sécuriser les déploiements** à toutes les étapes du cycle de vie applicatif.

### 9.1 Cartographie dynamique de l’infrastructure

#### Objectif :

Obtenir une vue d’ensemble actualisée des services exposés dans un réseau DevOps (serveurs d'applications, bases de données, outils CI/CD, etc.).

#### Étapes :

1. Créez une plage IP à scanner :

```bash
nmap -sn 10.0.0.0/24 -oG hosts.txt
```

2. Filtrez les hôtes actifs :

```bash
grep Up hosts.txt | cut -d ' ' -f 2 > active_ips.txt
```

3. Scannez les services pour chaque hôte :

```bash
nmap -sV -iL active_ips.txt -oX infra.xml
```

4. (Optionnel) Convertissez en HTML :

```bash
xsltproc /usr/share/nmap/nmap.xsl infra.xml -o infra.html
```

### 9.2 Vérification de la disponibilité des services (health check avancé)

Nmap permet de vérifier si un service est **présent ET fonctionnel** (pas juste ouvert).

#### Exemple : Vérifier qu’un serveur PostgreSQL écoute bien sur le port 5432

```bash
nmap -p 5432 --script pgsql-brute 10.0.0.15
```

#### Exemple : Vérifier qu’un service web ne plante pas après déploiement

```bash
nmap -p 80 --script http-title 10.0.0.42
```

### 9.3 Audit réseau avant / pendant / après déploiement

Intégrez les scans dans les étapes clés de votre pipeline :

* Avant : vérifier que seuls les ports nécessaires sont ouverts
* Pendant : s'assurer que les règles de pare-feu sont en place
* Après : vérifier l’impact d’un rollback ou d’un patch

#### Exemple d’audit post-déploiement :

```bash
nmap -sS -p- 10.0.0.0/24 -oG audit_post_deploy.txt
```

Puis comparer avec l’audit précédent via `ndiff`.

---

## 10. Nmap pour MLOps

Les environnements MLOps contiennent souvent des éléments exposés : API de modèles, Jupyter, TensorBoard, services REST… Il est **crucial de détecter les ports et services ouverts** sur ces machines.

### 10.1 Sécuriser les endpoints exposés par des modèles ML

#### Cas typique : API Flask exposée sur le port 5000

```bash
nmap -p 5000 --script http-title 10.0.0.33
```

* Permet de vérifier si une API est exposée
* On peut ajouter `-sV` pour identifier les frameworks

#### API non sécurisée ? Ajoutez :

```bash
nmap --script http-methods -p 5000 10.0.0.33
```

### 10.2 Scanner les containers / microservices dans des clusters

Si vous utilisez Docker ou Kubernetes, vous pouvez scanner les conteneurs **depuis l’extérieur du cluster** (réseau host) ou **depuis un conteneur/pod**.

#### Scanner tous les services exposés dans un bridge Docker

```bash
nmap -sS 172.17.0.0/16
```

#### Scanner depuis un conteneur Docker

1. Créez un conteneur avec Nmap :

```bash
docker run -it --network host instrumentisto/nmap /bin/sh
```

2. Lancez vos scans depuis l’intérieur.

#### Scanner dans Kubernetes (voir partie suivante pour les limites)

### 10.3 Détection de ports ouverts dans des environnements Jupyter, Airflow, etc.

#### Exemples typiques :

```bash
# Jupyter Notebook
nmap -p 8888 --script http-auth 10.0.0.20

# Airflow Web UI
nmap -p 8080 --script http-title 10.0.0.21

# MLflow
nmap -p 5000-5001 10.0.0.22
```

**Conseil :** créez une liste de ports connus de vos outils ML et scannez-la régulièrement :

```bash
nmap -p 8888,5000,5001,8080 -sV 10.0.0.0/24
```

---

## 11. Nmap en environnement cloud / Kubernetes

### 11.1 Nmap depuis un pod (limites et solutions)

Dans Kubernetes, vous pouvez scanner le réseau interne **depuis un pod Nmap** :

```bash
kubectl run nmap --rm -it --image=instrumentisto/nmap -- bash
```

Puis, depuis ce pod :

```bash
nmap -sS 10.244.0.0/16
```

**Limites :**

* Certaines communications inter-pods sont isolées
* Vous n’aurez pas accès aux nodes ou à Internet

**Solution :** déployer Nmap sur un node avec plus de droits, ou utiliser `hostNetwork: true` dans votre pod.

### 11.2 Cas GCP / AWS : scan inter-région, VPC peering

#### GCP :

* Par défaut, les VPC sont cloisonnés entre projets ou régions.
* Utilisez une VM dédiée avec une IP publique ou scannez par VPC peering.

#### AWS :

* Activez le peering entre VPCs si vous devez scanner plusieurs zones.
* Vérifiez les règles de sécurité (Security Groups et NACLs).

Exemple de scan entre 2 VPC peered :

```bash
nmap -Pn -sS -p- 172.31.0.0/16
```

### 11.3 Cloisonnement réseau et surface d’attaque dans les clusters

#### Objectif : identifier les services inter-pod ou exposés par erreur

Exemple :

```bash
nmap -p- -sV 10.244.0.0/16
```

Puis chercher :

* Services inattendus
* Ports exposés à d’autres namespaces

**Conseils :**

* Automatisez ces scans dans des pods CronJob
* Comparez les résultats avec la config YAML attendue

---

## Résumé

| Cas d’usage                      | Commande clé / stratégie             |
| -------------------------------- | ------------------------------------ |
| Cartographie infra DevOps        | `nmap -sn`, `-sV`, `xsltproc`        |
| Vérification service post-deploy | `nmap -sV -p <port>`                 |
| API ML non sécurisées            | `--script http-methods`, `http-auth` |
| Scan dans un conteneur           | `docker run --network host`          |
| Scan entre pods K8s              | `kubectl run nmap ...`               |
| Inter-région cloud               | `nmap -Pn` + config peering          |
| Audit surface d’attaque cluster  | `nmap -p- -sV <range interne>`       |

---

Avec ces cas pratiques, vous êtes maintenant capable d’adapter Nmap à votre contexte spécifique — qu’il s’agisse d’un cluster Kubernetes, d’un pipeline DevOps, d’un environnement MLOps sensible ou d’une infrastructure cloud distribuée. La partie suivante vous apprendra à créer vos **propres scripts personnalisés** avec le moteur NSE pour aller encore plus loin.

---

# Partie 5 — Aller plus loin avec Nmap

## 12. Écrire ses propres scripts NSE

Le Nmap Scripting Engine (NSE) permet de créer des scripts personnalisés en Lua pour étendre les fonctionnalités de Nmap : détection spécifique, exploitation, tests de configuration, etc.

### 12.1 Syntaxe de base d’un script NSE

Un script NSE est un fichier `.nse` écrit en Lua. Il doit suivre une structure précise.

#### Exemple minimal : `mon_script.nse`

```lua
local nmap = require "nmap"
local shortport = require "shortport"
local stdnse = require "stdnse"

portrule = shortport.http

action = function(host, port)
  return "Mon script personnalisé fonctionne sur " .. host.ip
end
```

#### Étapes clés :

* `require` : importer les bibliothèques internes de Nmap
* `portrule` : fonction de test de port (ex : `shortport.http`, `port.number == 80`...)
* `action` : fonction exécutée sur chaque hôte/port correspondant à la règle

### 12.2 Utiliser les bibliothèques internes

#### HTTP

```lua
local http = require "http"
```

Permet d’envoyer des requêtes HTTP, analyser les réponses, headers, etc.

#### SSH

```lua
local ssh = require "ssh"
```

Permet de tester les versions ou de faire du brute-force.

#### brute

```lua
local brute = require "brute"
```

Librairie spécialisée dans les attaques par dictionnaire (login/password).

#### stdnse

Bibliothèque standard NSE (logging, timeout, format, etc.) :

```lua
stdnse.debug1("Message de debug")
```

### 12.3 Cas pratique : scanner une API interne

#### Objectif : détecter si une API REST interne répond sur `/status` avec un champ `"status": "OK"`

#### Étapes :

1. Créez un fichier `api_status.nse` dans `/usr/share/nmap/scripts/`

```lua
local http = require "http"
local json = require "json"
local shortport = require "shortport"

portrule = shortport.http

action = function(host, port)
  local path = "/status"
  local response = http.get(host, port, path)

  if not response then
    return nil
  end

  local body = response.body
  local decoded = json.parse(body)

  if decoded and decoded.status == "OK" then
    return "API interne opérationnelle (status OK)"
  else
    return "API détectée, mais pas de status OK"
  end
end
```

2. Lancez le script :

```bash
nmap -p 5000 --script api_status 10.0.0.42
```

3. Vous verrez en sortie :

```
PORT     STATE SERVICE
5000/tcp open  http
| api_status:
|   API interne opérationnelle (status OK)
```

---

## 13. Bonnes pratiques et limitations

### 13.1 Considérations légales et éthiques

**Important** : Nmap est un outil puissant, et son usage **sans autorisation explicite** peut être considéré comme une intrusion illégale.

#### Toujours respecter :

* Le cadre légal de votre pays
* Les politiques de sécurité internes
* Le consentement explicite du propriétaire de l’infrastructure

**Conseil** : Utilisez des environnements de test ou des machines virtuelles pour apprendre.

### 13.2 Éviter les faux positifs et bien interpréter les résultats

#### Faux positifs

* Un port « open » ne signifie pas que le service est actif ou vulnérable
* Certains IDS modifient les réponses pour tromper Nmap

#### Interprétation

* Toujours croiser les infos : version + comportement
* Vérifiez les résultats avec plusieurs options :

```bash
nmap -sV --script default,vuln -p 22,80 IP
```

### 13.3 Alternatives et compléments à Nmap

#### Masscan

* Extrêmement rapide (10M paquets/sec)
* Ne fait que le scan de ports (pas de détection de service)

```bash
masscan 192.168.1.0/24 -p0-65535 --rate=10000
```

#### RustScan

* Basé sur Nmap + Rust pour accélérer la découverte
* Détecte les ports ouverts puis lance Nmap

```bash
rustscan -a 192.168.1.1 -- -sV
```

#### Zmap

* Ultra-scalable pour du scan Internet large échelle

```bash
zmap -p 80 0.0.0.0/0
```

**Conseil :** utilisez Nmap pour la profondeur (détail), et Masscan/RustScan pour la largeur (vitesse).

---


---

# Annexes — Outils et ressources complémentaires

## Lexique des options courantes

| Option          | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `-sS`           | Scan TCP SYN (rapide, furtif, nécessite root)                          |
| `-sT`           | Scan TCP connect (standard, sans privilèges root)                      |
| `-sU`           | Scan UDP                                                               |
| `-sV`           | Détection de version des services                                      |
| `-O`            | Détection de système d’exploitation                                    |
| `-p`            | Spécifie les ports à scanner (ex : `-p 22,80` ou `-p-` pour tous)      |
| `-T0` à `-T5`   | Réglage de la vitesse/agressivité du scan                              |
| `-A`            | Scan avancé : OS + version + script + traceroute                       |
| `-Pn`           | Ne fait pas de ping avant le scan (utilisé sur des machines protégées) |
| `-sn`           | Ping sweep (détecte les hôtes actifs sans scanner les ports)           |
| `--script`      | Active un ou plusieurs scripts NSE                                     |
| `-oG`           | Export format grepable                                                 |
| `-oX`           | Export format XML                                                      |
| `--open`        | Affiche uniquement les ports ouverts                                   |
| `-iL`           | Liste d’IP à scanner (à partir d’un fichier texte)                     |
| `--spoof-mac`   | Change l’adresse MAC pour chaque scan                                  |
| `--data-length` | Ajoute des données dans les paquets pour évasion IDS                   |

---

## Cheatsheet Nmap

```bash
# Scan rapide (100 ports les + courants)
nmap -T4 -F 192.168.1.1

# Scan complet TCP (tous les ports)
sudo nmap -sS -p- 192.168.1.1

# Scan UDP
sudo nmap -sU 192.168.1.1

# Ping sweep (liste des machines actives)
nmap -sn 192.168.1.0/24

# Scan de version + OS
sudo nmap -sS -sV -O 192.168.1.1

# Scan avec détection de vulnérabilités
nmap -sV --script vuln 192.168.1.1

# Scan furtif
sudo nmap -sS -T1 --spoof-mac 0 --data-length 50 192.168.1.1

# Export XML pour traitement ou rapport
nmap -sS -oX rapport.xml 192.168.1.1

# Comparaison de deux scans
ndiff scan1.xml scan2.xml

# Script personnalisé (API interne)
nmap -p 5000 --script api_status 192.168.1.1
```

---

## Bibliographie et ressources complémentaires

### Livres

* **Nmap Network Scanning** — Gordon "Fyodor" Lyon (auteur de Nmap)
* **The Hacker Playbook** — Peter Kim (avec exemples d’utilisation de Nmap)
* **Practical Packet Analysis** — Chris Sanders (compréhension des protocoles scannés)

### Sites officiels

* [https://nmap.org](https://nmap.org) — Documentation officielle
* [https://nmap.org/book/](https://nmap.org/book/) — Livre en ligne sur Nmap
* [https://nmap.org/nsedoc/](https://nmap.org/nsedoc/) — Répertoire complet des scripts NSE

### Blogs et articles utiles

* Blog de Daniel Miessler : [https://danielmiessler.com/](https://danielmiessler.com/)
* HackTricks : [https://book.hacktricks.xyz/](https://book.hacktricks.xyz/) — Section Network Reconnaissance
* SANS Internet Storm Center : [https://isc.sans.edu/](https://isc.sans.edu/)

### Vidéos et chaînes YouTube

* **IppSec** : [https://www.youtube.com/@IppSec](https://www.youtube.com/@IppSec) — Résolutions de box avec Nmap
* **NetworkChuck** : [https://www.youtube.com/@NetworkChuck](https://www.youtube.com/@NetworkChuck) — Vulgarisation sécurité et Nmap
* **Null Byte / WonderHowTo** : [https://www.youtube.com/@NullByteWHT](https://www.youtube.com/@NullByteWHT)

---

## Environnement de test

Travailler dans un environnement contrôlé est essentiel pour apprendre Nmap en toute sécurité. Voici plusieurs options :

### 1. Lab Dockerisé

Créez un réseau privé local avec plusieurs conteneurs :

```bash
docker network create testnet

# Lancement de 3 conteneurs avec services variés
for i in 1 2 3; do \
  docker run -d --name host$i --network testnet -p 80$i:80 nginx; \
done

# Scanner le réseau Docker (généralement 172.18.0.0/16)
nmap -sn 172.18.0.0/24
```

### 2. Utilisation de Vagrant + VirtualBox

Créer un environnement multi-VM (Debian, Ubuntu, Windows) sur votre machine locale.

#### Exemple de `Vagrantfile` :

```ruby
Vagrant.configure("2") do |config|
  config.vm.define "debian" do |debian|
    debian.vm.box = "debian/bullseye64"
    debian.vm.network "private_network", ip: "192.168.56.10"
  end
  config.vm.define "ubuntu" do |ubuntu|
    ubuntu.vm.box = "ubuntu/focal64"
    ubuntu.vm.network "private_network", ip: "192.168.56.11"
  end
end
```

Puis :

```bash
vagrant up
nmap -sS 192.168.56.0/24
```

### 3. Plateformes en ligne

* **TryHackMe** : [https://tryhackme.com](https://tryhackme.com)
* **Hack The Box** : [https://www.hackthebox.com](https://www.hackthebox.com)
* **RangeForce** : [https://www.rangeforce.com](https://www.rangeforce.com)

Ces plateformes offrent des machines virtuelles prêtes à être scannées.

### 4. Réseau local réel (avec autorisation)

Utilisez un vieux routeur ou switch, branchez plusieurs machines, configurez des IP fixes, puis scannez votre réseau local privé.

**Rappel :** ne jamais scanner un réseau que vous ne possédez pas ou pour lequel vous n'avez pas l'autorisation explicite.

---

Avec ces ressources, lexiques et environnements, vous avez tout en main pour progresser rapidement, en toute sécurité, et approfondir vos compétences Nmap dans des contextes réels ou simulés.


---

