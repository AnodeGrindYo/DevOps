---

title: "Maîtriser AWS IAM"
description: "Un guide complet pour comprendre, configurer et sécuriser les identités, les permissions et les accès dans AWS grâce à IAM, avec une approche progressive, des cas complexes et les meilleures pratiques."
category: "securite"

---


## 1. Introduction à AWS IAM

### Présentation générale du service IAM

AWS Identity and Access Management (IAM) est le service d'AWS permettant de gérer de manière fine qui peut accéder à quelles ressources dans un environnement cloud. IAM est un service centralisé et global, ce qui signifie qu'il ne dépend pas d'une région spécifique. Il permet aux administrateurs de contrôler de manière granulaire les permissions accordées aux utilisateurs, services et applications.

Avec IAM, vous pouvez :

* Créer et gérer des identités numériques (utilisateurs et rôles)
* Regrouper ces identités en entités logiques (groupes)
* Définir des politiques de sécurité basées sur des permissions JSON
* Autoriser ou refuser l'accès à des ressources AWS spécifiques

IAM est un pilier fondamental de la sécurité dans AWS. Il permet de mettre en place des politiques de moindre privilège, de cloisonner les responsabilités, et de garantir que chaque entité ne dispose que des accès nécessaires à son fonctionnement.

### Concepts fondamentaux : utilisateurs, groupes, rôles, politiques

#### Utilisateurs IAM

Un utilisateur IAM représente une entité humaine ou une application nécessitant un accès direct à AWS (via la console ou les API). Chaque utilisateur peut se voir attribuer des identifiants (nom d'utilisateur/mot de passe, clés d'accès API) et un ensemble de permissions.

#### Groupes IAM

Un groupe IAM est une collection d'utilisateurs partageant les mêmes permissions. Il permet de gérer efficacement les autorisations pour plusieurs utilisateurs en appliquant une politique unique au groupe. Exemple : un groupe "Développeurs" avec accès à CodeCommit et Lambda.

#### Rôles IAM

Les rôles IAM sont des identités sans identifiants permanents, conçues pour être assumées temporairement. Ils sont utilisés par des services AWS, des utilisateurs d'autres comptes ou des applications externes pour effectuer des actions autorisées. Un rôle dispose de deux politiques :

* **Trust policy** (définit qui peut assumer le rôle)
* **Permission policy** (définit ce que le rôle peut faire)

Exemples :

* Un rôle assumé par une instance EC2 pour accéder à S3
* Un rôle délégué à un autre compte AWS via STS (Security Token Service)

#### Politiques IAM

Les politiques sont des documents JSON qui définissent les permissions. Elles peuvent être :

* **Attachées à des utilisateurs, groupes ou rôles** (politiques basées sur les identités)
* **Attachées à des ressources** (politiques basées sur les ressources)

Chaque politique précise :

* L'effet : `Allow` ou `Deny`
* Les actions : API spécifiques (`s3:PutObject`, `ec2:StartInstances`, etc.)
* Les ressources ciblées : ARNs (Amazon Resource Names)
* (Optionnel) Les conditions d'application : selon l'heure, l’adresse IP, le tag de la ressource, etc.

### Cas d'utilisation typiques d'IAM dans une architecture cloud

1. **Contrôle d'accès pour les développeurs et administrateurs**

   * Attribution de rôles distincts : administrateur, développeur, opérateur
   * Séparation des permissions en environnement dev/test/prod

2. **Permissions aux services AWS**

   * Donner à une fonction Lambda le droit de lire des messages dans un topic SNS
   * Accorder à une instance EC2 l'accès à un bucket S3 pour stocker des logs

3. **Délégation d'accès entre comptes AWS**

   * Un compte principal crée un rôle assumable par un compte secondaire pour effectuer des tâches bien définies
   * Contrôle des permissions via STS et politique de confiance

4. **Accès temporaire à des ressources sensibles**

   * Utilisation de rôles assumables pour des audits, des consultants ou des utilisateurs externes
   * Intégration avec AWS SSO et fournisseurs d'identité (Google, Azure AD, etc.) via SAML ou OIDC

5. **Mise en œuvre de la politique de moindre privilège**

   * Analyse continue des permissions non utilisées
   * Réduction des droits au minimum nécessaire pour limiter les risques

6. **Audits et conformité**

   * Traces des actions IAM via AWS CloudTrail
   * Vérification des permissions effectives avec IAM Access Analyzer

IAM est omniprésent dans toute stratégie de sécurité AWS : chaque service, chaque architecture microservices ou chaque environnement multi-comptes repose sur une configuration rigoureuse et adaptée des identités et permissions via IAM.

---

## 2. Gestion des identités et des accès

### Création et gestion des utilisateurs IAM

Un utilisateur IAM est une entité représentant une personne ou une application qui interagit directement avec AWS. La création d’un utilisateur permet de lui attribuer un identifiant unique et de configurer ses moyens d’authentification :

* **Console AWS** : accès via un mot de passe
* **API/CLI/SDK** : accès via une paire de clés d’accès (Access Key ID / Secret Access Key)

#### Étapes de création d’un utilisateur IAM :

1. Définir le nom d’utilisateur unique
2. Choisir les types d’accès : console, programme ou les deux
3. Définir les permissions initiales :

   * Attacher des politiques directement
   * Ajouter à un ou plusieurs groupes
   * Définir des permissions personnalisées
4. Activer ou non le mot de passe temporaire et l'obligation de le changer à la première connexion
5. Activer des métadonnées comme les tags pour une meilleure traçabilité

Les utilisateurs peuvent être ensuite modifiés à tout moment : réinitialisation du mot de passe, ajout de clés, révocation d'autorisations, etc. Il est recommandé de ne jamais utiliser l’utilisateur root sauf en cas d’absolue nécessité.

### Groupes IAM : organisation et héritage des permissions

Les groupes IAM sont un mécanisme logique permettant d’associer des permissions à plusieurs utilisateurs simultanément. Chaque groupe peut avoir une ou plusieurs politiques d’autorisation. Les utilisateurs membres héritent automatiquement des permissions associées au groupe.

#### Exemples d’usage :

* Groupe `Developpeurs`: accès à AWS Lambda, S3, CloudWatch Logs
* Groupe `DevOps`: accès étendu à EC2, IAM (en lecture seule), CloudFormation
* Groupe `Audit`: lecture seule sur toutes les ressources

L'utilisation des groupes permet :

* Une gestion centralisée des permissions
* Une meilleure lisibilité de la politique d'accès
* Une réduction des erreurs de configuration manuelle

IAM ne permet pas de créer des sous-groupes (hiérarchie). Cependant, on peut combiner des groupes ou ajouter plusieurs politiques pour moduler les droits.

### Bonnes pratiques de gestion des identités

#### 1. Activer l’authentification multifacteur (MFA)

L’ajout d’un second facteur (généralement un token TOTP) est essentiel pour sécuriser les comptes sensibles, en particulier :

* L’utilisateur root (obligatoire)
* Les comptes administrateurs
* Les utilisateurs avec accès à IAM ou aux données critiques

AWS propose l’utilisation d’applications comme Google Authenticator, Duo, ou encore des dispositifs matériels (YubiKey).

#### 2. Éviter l'utilisation de l'utilisateur root

L'utilisateur root dispose de tous les droits, sans aucune restriction. Il ne doit être utilisé que pour les actions indispensables comme :

* Modifier les paramètres de facturation
* Supprimer un compte AWS
* Activer certains services spécifiques (ex. AWS Support plan)

Dans tous les autres cas, il est préférable de créer un utilisateur IAM avec des droits d’administrateur.

#### 3. Rotation des clés d’accès

Les clés d'accès statiques exposent un risque important si elles sont compromises. AWS recommande :

* De ne pas utiliser de clés d’accès statiques si possible (préférer les rôles et sessions temporaires)
* De configurer des rotations régulières
* D’automatiser la révocation et la régénération (via Lambda ou EventBridge)

#### 4. Suivi des permissions inutilisées

AWS fournit des outils (IAM Access Analyzer, Last Accessed) permettant d’identifier :

* Les permissions jamais utilisées par un utilisateur ou un rôle
* Les services AWS non utilisés dans un contexte donné

Cela permet d’ajuster les politiques au plus proche du besoin réel (principe du moindre privilège).

#### 5. Attribution de tags aux identités IAM

Il est recommandé d’utiliser les balises (tags) pour :

* Suivre l’usage par équipe ou projet
* Appliquer des stratégies automatisées selon les balises
* Faciliter l’audit et la gouvernance

Exemples de tags : `team=analytics`, `environment=prod`, `owner=jdoe`

#### 6. Utilisation d’AWS SSO ou d’un fournisseur d’identité externe

Pour des organisations de grande taille, il est préférable d’éviter de gérer des centaines d’utilisateurs IAM manuellement. On peut utiliser :

* AWS IAM Identity Center (anciennement AWS SSO)
* Intégration SAML avec Azure AD, Okta, Google Workspace

Cela permet de :

* Centraliser la gestion des identités
* Appliquer des politiques de sécurité homogènes
* Fournir un accès temporaire avec audit centralisé

---

La gestion fine des identités et des accès via IAM constitue un levier essentiel de sécurité, de conformité et d’automatisation dans AWS. La combinaison rigoureuse d’utilisateurs, de groupes, de rôles et de politiques bien structurées garantit une gouvernance optimale des environnements cloud.

---

## 3. Politiques IAM en profondeur

### Structure d'une politique IAM JSON

Les politiques IAM sont des documents en JSON décrivant les permissions. Chaque politique suit une structure bien définie, composée de blocs appelés "statements" (déclarations). Voici un exemple de base :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::mon-bucket/*"
    }
  ]
}
```

#### Champs principaux :

* `Version` : version du langage des politiques (toujours "2012-10-17")
* `Statement` : tableau de blocs de permission (il peut y en avoir plusieurs)
* Chaque bloc contient :

  * `Effect` : `Allow` ou `Deny`
  * `Action` : une ou plusieurs actions AWS (ex : `ec2:StartInstances`, `s3:GetObject`)
  * `Resource` : une ou plusieurs ressources AWS identifiées par leur ARN
  * `Condition` (facultatif) : contraintes conditionnelles

### Effets, actions, ressources et conditions

#### `Effect`

Détermine si la déclaration autorise (`Allow`) ou refuse (`Deny`) l’accès. Par défaut, tout est refusé si non explicitement autorisé.

* Une déclaration `Deny` explicite prime toujours sur une `Allow`

#### `Action`

Spécifie les opérations AWS ciblées. Il peut s’agir :

* D’actions individuelles : `s3:PutObject`
* De jokers : `s3:*` pour toutes les actions S3

#### `Resource`

Identifie les ressources AWS auxquelles s’applique la permission. On utilise des ARN (Amazon Resource Name), comme :

* `arn:aws:s3:::mon-bucket` (bucket S3)
* `arn:aws:lambda:us-east-1:123456789012:function:MaFonction`

On peut aussi utiliser `*` pour toutes les ressources, mais cela est à éviter sauf si justifié.

#### `Condition`

Permet de restreindre ou de spécifier les conditions sous lesquelles la politique s’applique. Syntaxe :

```json
"Condition": {
  "IpAddress": {"aws:SourceIp": "203.0.113.0/24"},
  "StringEquals": {"s3:x-amz-acl": "public-read"}
}
```

Principaux opérateurs :

* `StringEquals`, `StringLike`, `IpAddress`, `DateGreaterThan`, etc.
* Clés de contexte : `aws:username`, `aws:MultiFactorAuthPresent`, `aws:PrincipalTag`, etc.

### Variables et substitutions dans les politiques

IAM permet l’utilisation de variables dynamiques, avec la syntaxe `${}`. Cela permet d’écrire des politiques plus générales, adaptées dynamiquement à l’identité de l’utilisateur, du rôle, ou des tags associés.

Exemples :

```json
"Resource": "arn:aws:s3:::logs-${aws:username}/*"
```

Cette ressource pointera vers un dossier personnalisé pour chaque utilisateur.

Autres exemples utiles :

* `${aws:PrincipalTag/Department}`
* `${aws:RequestTag/Project}`

Ces variables permettent de combiner IAM avec les balises (tags) pour créer des politiques contextuelles puissantes.

### Différence entre politiques gérées et politiques en ligne

#### Politiques gérées (managed policies)

* **Politiques AWS gérées** : maintenues par AWS (ex : `AmazonS3ReadOnlyAccess`)
* **Politiques gérées par le client** : créées et réutilisables au sein du compte

Avantages :

* Réutilisables et versionnées
* Faciles à auditer et à maintenir
* Peuvent être attachées à plusieurs identités

#### Politiques en ligne (inline policies)

* Directement intégrées dans un utilisateur, groupe ou rôle spécifique
* Non réutilisables, supprimées en même temps que l'identité

Utilisées pour des cas très spécifiques et limités dans le temps. Leur usage est à limiter sauf nécessité (contrôle fin ou temporaire).

### Stratégies de contrôle d'accès par type de service AWS

IAM permet de sécuriser l’accès à tous les services AWS, mais chaque service peut avoir ses particularités. Quelques exemples de stratégies adaptées :

#### S3

* Politique basée sur l’identité : permettre à un utilisateur d’accéder à un bucket spécifique
* Politique basée sur la ressource : restreindre les accès à un bucket aux utilisateurs d’un compte spécifique

```json
"Condition": {
  "StringEquals": {
    "aws:PrincipalOrgID": "o-xxxxxxxxxx"
  }
}
```

#### EC2

* Permissions pour démarrer/arrêter des instances
* Attachement de rôles aux instances EC2 via profils d’instance

#### Lambda

* Permission `lambda:InvokeFunction` pour autoriser un autre service à invoquer une fonction
* Gestion des rôles d’exécution (execution role) pour accès à d’autres services

#### DynamoDB

* Permissions `dynamodb:GetItem`, `PutItem`, etc.
* Contrôle basé sur des tags ou sur des clés primaires spécifiques

#### CloudWatch Logs

* Permissions d'écriture (`logs:PutLogEvents`) pour les services produisant des logs
* Lecture contrôlée pour les équipes de support ou d’audit

Chaque service possède sa propre sémantique, ses actions et ses contraintes spécifiques. Une maîtrise approfondie de ces différences est essentielle pour définir des politiques robustes et cohérentes à l’échelle de l’infrastructure AWS.

---

Les politiques IAM sont l’outil le plus puissant (et potentiellement dangereux) de l’arsenal de sécurité AWS. Leur bonne compréhension et leur utilisation rigoureuse permettent de construire des environnements cloud sûrs, auditables et évolutifs.

---


## 4. Rôles IAM et délégation d'accès

### Création et gestion des rôles

Un **rôle IAM** est une entité IAM que l'on peut assumer temporairement pour effectuer des actions sur AWS. Contrairement aux utilisateurs, les rôles **n'ont pas de login ni de clés d'accès permanentes**. Les rôles sont essentiels pour :

* Donner des permissions à des services AWS (EC2, Lambda, ECS, etc.)
* Permettre l’accès temporaire à des utilisateurs internes ou externes
* Mettre en place des scénarios de délégation inter-comptes

#### Composants d’un rôle IAM :

* **Trust policy** (politique de confiance) : définit **qui peut assumer** le rôle
* **Permission policy** : définit **ce que le rôle peut faire**
* **Session duration** : durée maximale d’une session (jusqu’à 12h pour la plupart des cas)

#### Étapes de création :

1. Définir un nom clair et descriptif
2. Choisir le type d’entité autorisée à assumer le rôle (AWS service, utilisateur IAM, compte externe)
3. Définir la trust policy
4. Attacher une ou plusieurs permission policies
5. (Optionnel) Associer des tags et des permissions boundaries

### Trust policies vs. permission policies

#### Trust policy

La **trust policy** contrôle **qui a le droit d'assumer le rôle**. Elle s’applique à l’entité appelante (principal) :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Ici, le rôle peut être assumé par une instance EC2. Le champ `Principal` peut aussi spécifier un ARN utilisateur ou un ID de compte AWS.

#### Permission policy

Les **permission policies** attachées au rôle définissent **les actions autorisées** par ce rôle. Ce sont les mêmes politiques que celles utilisées pour les utilisateurs ou groupes IAM.

Ces deux politiques sont complémentaires :

* La trust policy permet d’assumer le rôle
* La permission policy permet d’exécuter des actions une fois le rôle assumé

### AssumeRole et délégation inter-comptes

Le mécanisme d’**assume role** repose sur AWS STS (Security Token Service). Lorsqu’un utilisateur ou un service assume un rôle, AWS génère des **identifiants temporaires** (AccessKeyId, SecretAccessKey, SessionToken).

Exemple d'appel API avec AWS CLI :

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/RoleAudit \
  --role-session-name audit-session
```

#### Délégation inter-comptes

Pour permettre à un utilisateur ou un rôle d’un **compte A** d’assumer un rôle dans un **compte B**, il faut :

1. Créer un rôle dans le compte B avec une trust policy autorisant `arn:aws:iam::[ID_compte_A]:user/NomUtilisateur`
2. Donner à l'utilisateur du compte A la permission d'appeler `sts:AssumeRole` sur ce rôle

Ce schéma est couramment utilisé pour :

* Les accès temporaires entre filiales
* Les architectures multi-comptes centralisées (audit, sécurité, CI/CD)
* L’externalisation de certaines tâches à des prestataires de confiance

### Rôles pour services AWS (EC2, Lambda, ECS, etc.)

#### EC2

Les **instance profiles** permettent d’attacher un rôle IAM à une instance EC2. Ce rôle est automatiquement utilisé par les applications s'exécutant sur l’instance, sans besoin de stocker des clés.

Exemple : un rôle EC2 avec permission `s3:PutObject` permet à un script de sauvegarde de déposer des fichiers dans un bucket S3.

#### Lambda

Chaque fonction Lambda doit avoir un **rôle d’exécution** (execution role) qui lui permet d’accéder aux services nécessaires :

* Lire depuis S3 ou DynamoDB
* Écrire dans CloudWatch Logs

Exemple de rôle Lambda :

```json
{
  "Effect": "Allow",
  "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
  "Resource": "*"
}
```

#### ECS

Les tâches ECS peuvent être associées à des **IAM Task Roles**, permettant à chaque tâche d’avoir des permissions propres. Cela évite de partager des identifiants sensibles entre conteneurs.

Cas typique : une tâche ECS qui publie des événements sur un topic SNS ou qui écrit dans DynamoDB.

#### Autres services

* **CodeBuild** utilise un rôle pour exécuter des builds avec accès à CodeCommit, S3, etc.
* **Step Functions** ont besoin d’un rôle pour invoquer d’autres services
* **Athena**, **Glue**, **Redshift Spectrum**, etc. utilisent des rôles pour accéder aux données sources

### Bonnes pratiques

* **Créer un rôle par usage spécifique** pour éviter les permissions excessives
* **Utiliser la politique de moindre privilège**, analyser les permissions utilisées
* **Surveiller l’usage des rôles avec CloudTrail et Access Analyzer**
* **Limiter les rôles inter-comptes** à des cas très encadrés et auditables
* **Automatiser la rotation des permissions temporaires** avec STS ou des workflows Lambda

---

Les rôles IAM sont un outil indispensable pour sécuriser, compartimenter et automatiser les accès dans AWS. Leur usage rigoureux permet de remplacer les identifiants statiques par des accès temporaires, auditables et spécifiques aux besoins réels.

---

## 5. Gestion des permissions complexes

### Conflits entre politiques autorisantes et restrictives

Dans AWS IAM, plusieurs politiques peuvent s’appliquer à une même entité (utilisateur, groupe, rôle). Lorsque ces politiques contiennent des instructions contradictoires (par exemple, une autorisation dans une politique et un refus explicite dans une autre), AWS applique les règles suivantes :

* **Tout est interdit par défaut** : aucune action n’est permise sauf si explicitement autorisée.
* **Les politiques autorisantes (Allow)** permettent l’accès uniquement si aucune politique ne le refuse.
* **Les refus explicites (Deny)** ont priorité sur toutes les autorisations, quel que soit leur emplacement.

#### Exemple de conflit :

Un utilisateur est membre d’un groupe avec une politique `Allow` sur S3, mais a une politique personnelle `Deny` sur le même service. Résultat : l'accès est **refusé**.

Cela permet d’utiliser des politiques restrictives comme garde-fous supplémentaires, en cas d’erreur de configuration dans les politiques autorisantes.

### Permissions boundaries et contrôle des privilèges

Les **permissions boundaries** sont un mécanisme avancé permettant de limiter ce qu’un rôle ou utilisateur **peut potentiellement faire**, même si ses politiques l’autorisent.

* C’est une politique IAM attachée à une entité qui définit les **limites maximales** de ses permissions.
* Les actions non incluses dans cette boundary sont **refusées**, même si une autre politique les autorise.

#### Exemple :

Un utilisateur a une politique `Allow: "ec2:*"`, mais une permission boundary qui ne permet que `"ec2:Describe*"`. L’utilisateur **ne pourra pas démarrer d’instances**, même si sa politique personnelle l’y autorise.

Utilisation typique :

* Contrôler les rôles auto-créés par des développeurs
* Appliquer une sécurité organisationnelle tout en laissant une certaine autonomie

Permissions boundaries sont très utiles dans les environnements décentralisés ou multi-comptes.

### Politiques basées sur les ressources vs. basées sur les identités

Il existe deux grands types de politiques IAM :

#### 1. **Politiques basées sur l'identité**

* Attachées à des entités IAM (utilisateurs, groupes, rôles)
* Définissent ce qu’une **identité peut faire** sur les ressources

Exemple : permettre à un utilisateur d'écrire dans un bucket S3.

#### 2. **Politiques basées sur la ressource**

* Attachées directement à une **ressource AWS** (S3, SQS, KMS, etc.)
* Définissent **qui peut accéder** à la ressource, et avec quelles permissions

Exemple : une politique sur un bucket S3 autorisant uniquement des utilisateurs d’un compte externe à lire les objets.

#### Comparaison :

| Caractéristique | Politique basée sur l'identité | Politique basée sur la ressource |
| --------------- | ------------------------------ | -------------------------------- |
| Supportée par   | Tous les services AWS          | Services spécifiques             |
| Contrôle        | Ce que l'identité peut faire   | Qui peut agir sur la ressource   |
| Scope           | Centré sur l’utilisateur       | Centré sur la ressource          |

#### Combinaisons puissantes :

* Utiliser les deux types pour renforcer le contrôle (double validation)
* Restreindre l’accès via des tags communs ou des conditions synchronisées

### Utilisation de Conditions pour des contrôles d'accès fins

Les **conditions IAM** permettent de définir des règles contextuelles très précises. Elles s’utilisent dans les blocs `Condition` des politiques IAM et peuvent s’appliquer à :

* Des attributs d’appelants (tags, MFA, heure, IP, etc.)
* Des attributs de la ressource
* Des métadonnées d’appel (nom de l’utilisateur, identité assumée, etc.)

#### Opérateurs de conditions :

* `StringEquals`, `StringLike`, `IpAddress`, `Bool`, `DateGreaterThan`, etc.

#### Clés de conditions fréquentes :

* `aws:SourceIp` : filtre sur l’adresse IP
* `aws:MultiFactorAuthPresent` : vérifie si MFA est activé
* `aws:TagKeys` ou `aws:PrincipalTag/Project` : logique basée sur des tags
* `s3:prefix`, `kms:ViaService`, `ec2:InstanceType` : spécifiques à un service

#### Exemples :

* Autoriser la suppression d’objets S3 **uniquement depuis un CIDR donné** :

```json
"Condition": {
  "IpAddress": {"aws:SourceIp": "192.168.1.0/24"}
}
```

* Exiger la **présence d’un tag spécifique** sur l’appelant :

```json
"Condition": {
  "StringEquals": {
    "aws:PrincipalTag/Project": "ML-Pipeline"
  }
}
```

* Refuser toutes les actions si l’utilisateur n’a **pas activé MFA** :

```json
"Condition": {
  "BoolIfExists": {
    "aws:MultiFactorAuthPresent": "false"
  }
}
```

Les conditions permettent de transposer des politiques de sécurité organisationnelles en contraintes techniques robustes, dynamiques et adaptables.

---

La gestion des permissions complexes dans IAM est un art qui exige rigueur, anticipation et compréhension profonde des mécanismes sous-jacents. C’est une compétence clé pour sécuriser des infrastructures AWS dynamiques, partagées et critiques, tout en évitant les pièges classiques liés aux permissions trop larges ou contradictoires.

---

## 6. Sécurité IAM et audit

### Surveillance avec CloudTrail et CloudWatch

La sécurité d’IAM ne repose pas uniquement sur la définition des permissions : elle nécessite également une **surveillance active des activités**. AWS fournit deux outils complémentaires pour ce besoin : **CloudTrail** et **CloudWatch**.

#### AWS CloudTrail

CloudTrail enregistre **chaque appel API** effectué dans votre compte AWS, qu’il provienne de la console, de l’interface CLI ou d’un SDK.

Pour IAM, cela permet de tracer :

* Les créations/suppressions de rôles, utilisateurs, groupes
* Les modifications de politiques
* Les tentatives d’assume-role
* L’activation ou la désactivation du MFA

Exemple d'événement CloudTrail :

```json
{
  "eventName": "CreateUser",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "admin"
  },
  "requestParameters": {
    "userName": "john.doe"
  }
}
```

Vous pouvez créer des **trails** multi-régions, stocker les logs dans S3, et configurer des **alertes automatiques** en cas d’activité suspecte.

#### Amazon CloudWatch

CloudWatch collecte des **métriques** et permet la création de **logs personnalisés**, notamment via CloudTrail ou AWS Config. Il peut être utilisé pour :

* Détecter des accès anormaux (fréquence élevée, heures inhabituelles)
* Déclencher des alertes sur des modifications IAM critiques
* Générer des dashboards de sécurité personnalisés

### Analyse des permissions effectives

Dans des environnements complexes, il devient difficile de comprendre **ce qu’un utilisateur ou rôle peut réellement faire**. IAM fournit plusieurs outils pour analyser ces permissions effectives.

#### 1. AWS IAM Policy Simulator

Permet de tester les politiques attachées à une entité IAM pour une action et une ressource données.

Utilisation typique :

* Simuler l’effet d’une politique modifiée
* Diagnostiquer un accès refusé

#### 2. Last Accessed Information

IAM fournit pour chaque entité une section "Last Accessed" montrant :

* Les services AWS utilisés
* La date du dernier accès par service

Cela permet de supprimer les permissions non utilisées.

#### 3. AWS Access Advisor

Intégré à l’interface IAM, il affiche les services auxquels une entité a accès et ceux qu’elle a réellement utilisés.

Ces outils aident à affiner les permissions pour se conformer au **principe du moindre privilège**.

### IAM Access Analyzer : fonctionnement et cas d’usage

IAM Access Analyzer est un outil avancé de détection d’accès **non intentionnels** ou **trop larges** à vos ressources AWS.

#### Fonctionnement

* Utilise la logique de raisonnement formel (Zelkova) pour analyser les politiques
* Crée un **analyzer** dans une région ou une organisation
* Génère des **findings** lorsqu'une politique permet un accès externe à une ressource

Exemples :

* Un bucket S3 accessible par le public
* Une clé KMS accessible à un autre compte AWS
* Une fonction Lambda assumable par une entité externe

#### Cas d’usage

* Audit de conformité et sécurité
* Détection de dérives de configuration
* Revue automatique des changements de politique
* Intégration dans les workflows CI/CD (validation de pull requests avec Access Analyzer)

Access Analyzer est essentiel dans les environnements partagés, multi-comptes ou orientés sécurité.

### Prévention des escalades de privilèges

Une mauvaise configuration IAM peut permettre à un utilisateur de **s’octroyer davantage de privilèges** qu’initialement prévu — c’est l’escalade de privilèges.

#### Vecteurs d’escalade typiques :

1. **Créer un rôle permissif** et l’assumer
2. **Modifier une politique existante** pour ajouter des actions critiques
3. **Accéder à des services non restreints** comme Lambda ou EC2 et exécuter du code malveillant
4. **Utiliser un rôle de service mal configuré** pour assumer des permissions élevées

#### Mécanismes de prévention :

* Utilisation de **permissions boundaries** pour limiter les droits maximums
* Activation de **MFA obligatoire** pour les actions sensibles (modifications IAM, facturation, etc.)
* Séparation stricte des rôles : administration, audit, exécution
* Audit régulier des politiques `iam:PassRole` (souvent utilisées pour détourner des rôles à privilèges)
* Utilisation d’AWS Config avec des règles personnalisées pour détecter des comportements interdits

---

La sécurité IAM ne repose pas uniquement sur les définitions de politique. Elle implique une **analyse constante, une supervision active**, et des mécanismes de défense en profondeur pour garantir que chaque permission est justifiée, contrôlée et traçable. Une architecture IAM bien surveillée est un pilier incontournable de toute stratégie cloud sécurisée.

---

## 7. Organisation et IAM dans un environnement multi-comptes

### AWS Organizations et SCP (Service Control Policies)

Dans des architectures complexes, il est courant d’utiliser plusieurs comptes AWS pour isoler les environnements, répartir les responsabilités ou respecter des exigences réglementaires. AWS Organizations permet de **regrouper, gérer et sécuriser** plusieurs comptes à partir d’un compte central appelé "compte maître" (ou compte de gestion).

#### Fonctionnalités principales d’AWS Organizations :

* Création d’une hiérarchie de comptes avec des **unités organisationnelles (OUs)**
* Gestion centralisée des **facturations** (Consolidated Billing)
* Application de **politiques de contrôle de service (SCP)**
* Provisionnement automatique de nouveaux comptes (via AWS Control Tower ou CLI)

#### Service Control Policies (SCP)

Les SCP permettent de **restreindre les permissions disponibles dans les comptes membres**, indépendamment des politiques IAM locales. Une SCP **ne donne jamais de permissions**, elle **limite le périmètre** de ce qu’IAM peut accorder dans un compte.

Exemple de SCP :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "*"
    }
  ]
}
```

Cette SCP interdit l’usage de S3 dans toute unité organisationnelle ciblée, même si une politique IAM essaie de l’autoriser.

Cas d’usage :

* Interdire `iam:CreateUser` dans des comptes non administratifs
* Limiter `ec2:*` uniquement aux régions autorisées
* Empêcher les utilisateurs d’accéder à certains services sensibles (KMS, CloudTrail, etc.)

### Gestion centralisée des permissions

La gestion d’IAM dans un environnement multi-comptes peut rapidement devenir difficile sans centralisation. Plusieurs approches permettent d’avoir un contrôle global et cohérent :

#### Modèle d’accès centralisé

* Créer des rôles d’accès dans les comptes secondaires
* Autoriser l’assumption de ces rôles par des utilisateurs du compte principal

Exemple : un utilisateur `admin@organisation-principale` peut assumer un rôle `ReadOnly` dans les comptes secondaires via `sts:AssumeRole`.

Avantages :

* Accès temporaire, auditable, et sécurisé
* Évite la duplication des utilisateurs IAM dans chaque compte
* Simplifie l’automatisation (CI/CD, audits, monitoring)

#### Outils et services utiles :

* **AWS IAM Identity Center (ex AWS SSO)** : fédération avec un fournisseur d'identité (Azure AD, Okta, etc.) pour gérer les accès utilisateurs à tous les comptes via des groupes
* **AWS Control Tower** : provisionnement de comptes avec landing zones sécurisées et politiques préconfigurées
* **AWS Config + CloudTrail multi-comptes** : suivi des ressources et des accès dans l’ensemble de l’organisation

#### Stratégies de tagging croisé

* Appliquer des conventions de noms et de tags pour identifier les ressources, les propriétaires et les projets
* Contrôler l'accès aux ressources selon leurs balises (ex : `Project=Fintech`, `Environment=Prod`)

### Mise en place d'une stratégie de séparation des responsabilités

Dans les environnements cloud professionnels, la séparation des rôles est essentielle pour :

* Réduire les risques d’erreur humaine ou de compromission
* Limiter les privilèges accordés à chaque acteur
* Se conformer aux exigences de sécurité et de conformité (ISO 27001, PCI-DSS, etc.)

#### Modèle de séparation classique :

* **Compte sécurité** : héberge les logs CloudTrail, les analyses GuardDuty, les rapports d’audit
* **Compte administration** : création des rôles, politiques et infrastructures IAM
* **Comptes applicatifs (prod/dev/test)** : exécution des charges de travail

Chaque compte a un rôle bien défini et des contrôles croisés empêchent qu’un seul compte puisse à la fois modifier les politiques et effacer les preuves d’activité.

#### Séparation au sein d’un compte unique :

Même dans un seul compte AWS, on peut séparer les rôles :

* **IAMAdministrator** : gère les permissions, mais ne peut pas lancer d’instances
* **InfrastructureEngineer** : déploie via CloudFormation, mais ne peut pas gérer IAM
* **Auditor** : lecture seule sur tous les services

#### Recommandations :

* Implémenter des **permissions boundaries** sur les rôles délégués
* Vérifier régulièrement les permissions effectives et les accès entre comptes
* Documenter et visualiser les flux d’accès dans une cartographie IAM

---

Une architecture IAM multi-comptes bien conçue renforce drastiquement la sécurité et la gouvernance cloud. Grâce à AWS Organizations, SCP, et à une politique stricte de séparation des responsabilités, il est possible de maintenir un environnement hautement sécurisé, modulable et conforme, même à grande échelle.

---

## 8. Automatisation et Infrastructure as Code

L’automatisation de la gestion des identités et des permissions est cruciale pour assurer la **cohérence, la reproductibilité et la sécurité** dans un environnement AWS à grande échelle. L’Infrastructure as Code (IaC) permet de définir les rôles, les utilisateurs, les politiques et les stratégies IAM via du code versionné et déployable automatiquement.

### Définir IAM avec CloudFormation

AWS CloudFormation permet de décrire toute l’infrastructure IAM en YAML ou JSON. Cela inclut :

* Les utilisateurs IAM (`AWS::IAM::User`)
* Les rôles (`AWS::IAM::Role`)
* Les politiques (`AWS::IAM::Policy`, `AWS::IAM::ManagedPolicy`)
* Les groupes (`AWS::IAM::Group`)

#### Exemple : création d’un rôle IAM avec politique inline

```yaml
Resources:
  MyLambdaRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: my-lambda-role
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: LambdaLogs
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                Resource: "*"
```

Avantages de CloudFormation pour IAM :

* Versionnement complet de la sécurité
* Validation des changements avant déploiement (ChangeSets)
* Intégration avec des workflows CI/CD (CodePipeline, GitHub Actions, etc.)

### IAM dans Terraform : modules, variables, séparation des responsabilités

Terraform est un outil IaC très utilisé dans les environnements multi-clouds. Il dispose de providers puissants pour gérer IAM dans AWS.

#### Exemple de définition de rôle IAM en HCL

```hcl
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}
```

#### Utilisation de modules

Pour industrialiser les déploiements IAM :

* Créer des modules réutilisables pour chaque type de rôle
* Paramétrer les actions, les ressources, et les conditions via des variables

```hcl
module "developer_role" {
  source         = "./modules/iam-role"
  role_name      = "dev-role"
  policy_actions = ["s3:ListBucket", "ec2:DescribeInstances"]
  resource_arns  = ["*"]
}
```

#### Séparation des responsabilités

* Utiliser plusieurs workspaces pour séparer les environnements (dev, staging, prod)
* Appliquer des permissions boundaries et conditions à travers le code
* Versionner et reviewer les changements IAM via des pull requests

Terraform facilite aussi :

* La destruction contrôlée des ressources IAM obsolètes
* La gestion des dépendances entre services et rôles
* L’audit des modifications IAM via des plans d’exécution (`terraform plan`)

### Automatiser la rotation des clés et des rôles avec AWS Lambda et EventBridge

La rotation régulière des **clés d’accès** et des **rôles temporaires** est essentielle pour limiter la durée d’exposition d’un secret compromis.

#### Objectif :

* Supprimer les clés vieilles de plus de X jours
* Créer une nouvelle paire
* Notifier l’utilisateur
* Stocker temporairement la nouvelle clé dans un coffre (ex. AWS Secrets Manager)

#### Architecture typique :

* **EventBridge** déclenche une règle quotidienne
* **Lambda** vérifie la date de création des clés avec `list-access-keys`
* Si une clé dépasse le seuil :

  * Crée une nouvelle clé (`create-access-key`)
  * Envoie une alerte (SNS, e-mail)
  * Supprime l’ancienne clé (`delete-access-key`)

#### Exemple de logique Python :

```python
import boto3
from datetime import datetime, timezone, timedelta

iam = boto3.client('iam')
response = iam.list_users()
for user in response['Users']:
    keys = iam.list_access_keys(UserName=user['UserName'])
    for key in keys['AccessKeyMetadata']:
        age = datetime.now(timezone.utc) - key['CreateDate']
        if age > timedelta(days=90):
            iam.delete_access_key(UserName=user['UserName'], AccessKeyId=key['AccessKeyId'])
```

#### Rotation de rôles avec STS et TTL courts

* Préférer les rôles IAM temporaires (via `sts:AssumeRole`) aux clés statiques
* Régler la durée des sessions sur des valeurs réduites (ex : 15 min à 1 h)
* Auditer les sessions ouvertes via CloudTrail et Config

---

L’automatisation de la gestion IAM via des outils IaC comme CloudFormation et Terraform, combinée à la rotation proactive des identifiants, est une démarche incontournable pour maintenir une posture de sécurité efficace, auditable et scalable dans le cloud AWS. Elle garantit une gouvernance robuste, tout en réduisant les risques liés aux erreurs humaines et aux mauvaises configurations.

---

## 9. Études de cas complexes

### Mise en place d’une architecture Zero Trust avec IAM

Le modèle **Zero Trust** repose sur le principe suivant : *ne jamais faire confiance par défaut, même à l’intérieur du périmètre réseau*. Dans AWS, IAM est un pilier central pour mettre en œuvre une architecture Zero Trust.

#### Principes appliqués à AWS :

1. **Vérification explicite** : chaque requête est authentifiée et autorisée dynamiquement.
2. **Accès au moindre privilège** : chaque identité ne reçoit que les permissions nécessaires à sa tâche.
3. **Audit continu** : toute activité est tracée, surveillée, et sujette à des alertes en cas de comportement suspect.

#### Mise en œuvre concrète avec IAM :

* **Pas de clés statiques** : tous les accès se font via STS avec des sessions temporaires et des durées réduites.
* **Conditions IAM restrictives** : chaque action est conditionnée par l’heure, l’adresse IP, la présence du MFA ou des balises spécifiques (`aws:TagKeys`, `aws:PrincipalTag`, etc.).
* **Segmentation stricte** : séparation des rôles administratifs, applicatifs et observateurs ; accès cloisonnés par environnement (dev/prod).
* **IAM Access Analyzer + GuardDuty** : détection en continu d’anomalies d’accès et de dérives de configuration.
* **AWS Resource Access Manager (RAM)** : pour partager des ressources entre comptes sans ouvrir d'accès global.

Cette architecture impose une discipline stricte dans la gestion des politiques et une automatisation continue de la supervision.

### Accès temporaire sécurisé entre plusieurs comptes via STS

AWS Security Token Service (STS) permet d’établir des **sessions temporaires** entre comptes. C’est une alternative sécurisée à l’utilisation de comptes IAM multiples, et un composant clé des architectures multi-comptes modernes.

#### Cas d’usage :

* Une équipe sécurité (compte principal) veut auditer tous les comptes clients sans créer un utilisateur IAM par compte.
* Une pipeline CI/CD doit déployer des artefacts dans plusieurs comptes AWS automatiquement.

#### Étapes techniques :

1. Dans chaque **compte cible**, créer un **rôle IAM avec une trust policy** autorisant le compte source à l’assumer.

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:root"
  },
  "Action": "sts:AssumeRole"
}
```

2. Depuis le **compte source**, appeler STS pour assumer le rôle et recevoir :

* Une clé d’accès temporaire
* Une clé secrète temporaire
* Un token de session

3. Utiliser ces identifiants pour agir dans le compte cible avec un TTL défini (15 minutes à 12 heures).

#### Bonnes pratiques :

* Restreindre les permissions du rôle aux actions strictement nécessaires
* Ajouter des conditions d’usage (`aws:SourceIp`, `aws:PrincipalTag`, etc.)
* Limiter la durée de vie des sessions
* Auditer les appels STS via CloudTrail

Cette approche élimine les accès permanents, renforce la traçabilité et réduit la surface d’attaque.

### Sécurisation des accès aux API privées et publiques

AWS propose plusieurs mécanismes pour contrôler les accès à des APIs déployées via **API Gateway**, **Lambda**, **Load Balancer**, etc. IAM permet d'intégrer des politiques d’accès granulaires dans ces architectures.

#### Pour une API **privée** (interne au VPC ou à l’organisation) :

* **IAM-based authorization** : l’appelant doit signer sa requête avec des identifiants AWS valides (via SigV4)
* **Contrôle d’accès avec politiques IAM** : l’API Gateway ou Lambda vérifie les permissions du rôle ou de l’utilisateur appelant
* **VPC endpoints + Resource policies** : restreindre l’accès à des réseaux spécifiques ou à un ensemble de comptes

#### Pour une API **publique** :

* **Custom Authorizer (Lambda authorizer)** : un code Lambda valide un token ou une signature avant de transmettre la requête
* **IAM roles assumés temporairement** par l’appelant pour accéder à une API sécurisée, avec restrictions via `Condition`
* **API keys + usage plans** : gestion de quotas, de rate limiting et de suivi d’usage

#### Exemples de sécurisation d’API avec IAM :

* Utilisation de politiques IAM conditionnelles pour n’autoriser l’accès qu’aux utilisateurs MFA et tagués `Environment=Prod`
* Intégration avec **Cognito** ou un fournisseur OIDC/SAML pour attribuer dynamiquement un rôle IAM au moment de l’authentification
* Application de **Resource policies** sur API Gateway pour filtrer par compte source ou adresse IP

---

Les cas complexes montrent la puissance et la flexibilité d’IAM, dès lors qu’on l’intègre pleinement dans la stratégie d’architecture, de gouvernance et de sécurité. Que ce soit dans un cadre Zero Trust, inter-comptes ou d’expositions d’API, IAM est l’élément de contrôle fondamental assurant l’isolation, la traçabilité et la conformité de toutes les interactions dans AWS.

---

## 10. Bonnes pratiques, pièges à éviter et checklist finale

### Résumé des erreurs courantes en IAM

Une mauvaise configuration IAM peut avoir des conséquences graves : exfiltration de données, compromission d’infrastructure, ou destruction accidentelle. Voici un condensé des erreurs fréquemment observées :

#### 1. **Utilisation excessive des jokers (`*`)**

* Exemple : `Action: "*"`, `Resource: "*"`
* Risque : escalade de privilèges, suppression massive de ressources

#### 2. **Clés d’accès statiques non rotées**

* Présentes dans du code source, des scripts partagés ou des dépôts publics
* Risque : vol de données, intrusion externe

#### 3. **Mauvais usage du rôle root**

* Le compte root devrait être inutilisé, sauf pour les opérations critiques ponctuelles
* Risque : compte maître compromis = perte totale de contrôle

#### 4. **Absence de MFA sur les comptes privilégiés**

* Rend les comptes vulnérables au vol d’identifiants
* MFA devrait être obligatoire pour tous les utilisateurs IAM

#### 5. **Permissions non utilisées laissées actives**

* Politiques trop larges, jamais révisées
* Surface d’attaque inutilement élargie

#### 6. **Politiques IAM copiées-collées sans personnalisation**

* Mauvaise adéquation au contexte
* Risque d’ouverture involontaire à d’autres services ou comptes

### Checklist sécurité pour les audits IAM

Une checklist de sécurité IAM permet d’anticiper les incidents et de s’assurer que la configuration reste conforme aux bonnes pratiques.

#### Identités et authentification

* [ ] MFA activé pour tous les utilisateurs privilégiés
* [ ] Aucune clé d’accès active non utilisée depuis 90 jours
* [ ] Aucune clé d’accès exposée publiquement (GitHub, S3 public)
* [ ] Utilisateurs IAM nominatifs uniquement (pas de comptes partagés)
* [ ] Utilisation d’AWS SSO ou de la fédération pour les grandes équipes

#### Permissions et rôles

* [ ] Application du principe du moindre privilège
* [ ] Revue régulière des politiques attachées aux rôles et utilisateurs
* [ ] Rotation des permissions via STS ou scripts automatisés
* [ ] Utilisation systématique des roles pour les services AWS (EC2, Lambda, etc.)
* [ ] Présence de permissions boundaries pour les rôles sensibles

#### Contrôles conditionnels

* [ ] Usage des conditions IAM (ex. IP, tags, MFA)
* [ ] Application de politiques restrictives (`Deny`) sur les ressources critiques

#### Supervision et audit

* [ ] CloudTrail activé dans toutes les régions
* [ ] IAM Access Analyzer actif pour chaque région et organisation
* [ ] Utilisation de CloudWatch Logs et alarmes sur les changements IAM
* [ ] Centralisation des logs dans un compte sécurité
* [ ] Contrôles automatisés via AWS Config ou des outils open-source (Prowler, ScoutSuite)

### Stratégies de durcissement des rôles et politiques

#### 1. **Utiliser des politiques en lecture seule lors des tests**

* Exemple : `AmazonS3ReadOnlyAccess`, `ViewOnlyAccess`
* Réduire le risque durant la phase de découverte des services

#### 2. **Limiter les permissions par environnement**

* Création de rôles ou de groupes distincts pour dev, staging et prod
* Éviter qu’un script de test affecte la production

#### 3. **Renforcer les rôles d’administration avec conditions**

* Ajouter : `"Bool": { "aws:MultiFactorAuthPresent": "true" }`
* Exiger un MFA ou une balise de projet pour toute action sensible

#### 4. **Contrôler les politiques `iam:PassRole`**

* Ces permissions permettent de déléguer un rôle potentiellement puissant
* Restreindre strictement les rôles passables via `Condition -> arnEquals`

#### 5. **Limiter les durées de session STS**

* Sessions courtes (ex. 15–30 minutes) pour les rôles très privilégiés
* Réduction du temps de compromission en cas d’abus

#### 6. **Appliquer une nomenclature stricte**

* Exemple : `role-appname-environment-purpose`
* Facilite la gestion, l’automatisation, et les audits

### Maintenance des politiques dans le temps

La maintenance des politiques IAM est un processus continu :

#### Surveillance et revue régulière

* Auditer tous les 30 à 90 jours les politiques effectives
* Vérifier la cohérence avec les activités réelles (via Access Advisor)

#### Intégration dans les pipelines DevSecOps

* Valider chaque changement IAM dans les pull requests avec l’IAM Policy Simulator
* Utiliser des tests unitaires d’IaC pour garantir la conformité

#### Documentation et partage de la connaissance

* Chaque politique importante doit être documentée (but, portée, propriétaire)
* Centraliser les templates et modules IAM dans un référentiel partagé

#### Automatisation du nettoyage

* Script Lambda ou cron Terraform pour :

  * Supprimer les rôles inutilisés
  * Révoquer les clés obsolètes
  * Réduire les permissions non exploitées

---

Une politique IAM bien pensée n’est pas figée. Elle évolue avec les besoins de l’organisation, les nouveaux services AWS, et les menaces de sécurité émergentes. Maintenir une culture d’audit, de rigueur, et d’automatisation autour d’IAM est l’assurance d’un socle sécurisé, durable et adaptable dans le temps.


## Annexes

### Liste des services compatibles IAM et comportements spécifiques

La majorité des services AWS sont intégrés à IAM, mais certains ont des particularités importantes à connaître :

#### Services 100% compatibles IAM (permissions par API/action)

* **Amazon S3** : IAM permet de gérer l’accès aux buckets et objets. Peut combiner IAM, ACLs et politiques de bucket.
* **Amazon EC2** : IAM permet de contrôler la création, la gestion et l’attachement de ressources (volumes, IPs, rôles).
* **AWS Lambda** : chaque fonction doit avoir un rôle d’exécution. IAM contrôle aussi l’invocation par d’autres services.
* **Amazon DynamoDB** : IAM contrôle les lectures/écritures. Peut utiliser des permissions basées sur des tags ou des clés spécifiques.
* **Amazon SNS/SQS** : IAM gère la publication et la lecture, combiné parfois à des politiques de ressource.

#### Services avec IAM + contrôle interne spécifique

* **AWS KMS** : combiner IAM avec les Key Policies, qui sont indépendantes mais prioritaires dans certains cas.
* **AWS CloudWatch Logs** : IAM permet de contrôler les logs group/stream et l'accès aux métriques.
* **AWS Organizations** : IAM ne contrôle que certaines actions (ex : création de compte), le reste est géré via SCP.
* **Amazon RDS** : IAM peut être utilisé pour certaines APIs (ex : `DescribeDBInstances`), mais pas pour les accès SQL (gérés par l’engine).
* **AWS Glue, Redshift, Athena** : utilisent des rôles IAM complexes, souvent imbriqués avec des trusts inter-services.

#### Services à comportements restreints IAM

* **Amazon WorkSpaces, Chime** : intégration IAM partielle
* **Marketplace** : IAM très limité à certaines actions (achat, gestion des abonnements)
* **CloudFront** : IAM contrôle les distributions mais l'accès final est géré côté origin et policies de ressource (ex. S3)

Documentation officielle IAM par service :

* [https://docs.aws.amazon.com/service-authorization/latest/reference/reference\_policies\_actions-resources-contextkeys.html](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html)

---

### Outils open source pour auditer et visualiser les permissions IAM

L’écosystème open source propose plusieurs outils de sécurité et d’audit IAM très complets :

#### 1. **Prowler**

* Analyse de sécurité AWS en ligne de commande
* Plus de 300 contrôles (CIS, GDPR, ISO, etc.)
* Audite les configurations IAM, les policies, MFA, clés, STS, etc.
* [https://github.com/prowler-cloud/prowler](https://github.com/prowler-cloud/prowler)

#### 2. **Cloudsplaining**

* Analyse des politiques IAM pour détecter les permissions dangereuses (ex : `iam:PassRole`, `sts:AssumeRole`, `ec2:*`)
* Rapports HTML interactifs
* [https://github.com/salesforce/cloudsplaining](https://github.com/salesforce/cloudsplaining)

#### 3. **Parliament**

* Linter pour les documents JSON IAM
* Détecte les erreurs, les mauvaises pratiques et les combinaisons dangereuses
* [https://github.com/duo-labs/parliament](https://github.com/duo-labs/parliament)

#### 4. **IAM Live**

* Observe les appels réels à l’API AWS pour générer automatiquement des politiques minimales (least privilege)
* Idéal pour générer des politiques à partir de logs CloudTrail
* [https://github.com/iann0036/iamlive](https://github.com/iann0036/iamlive)

#### 5. **Steampipe**

* Requêtes SQL sur vos ressources AWS (IAM compris)
* Permet des audits très fins et des dashboards personnalisés
* [https://steampipe.io/](https://steampipe.io/)

---

### Références officielles et documentation AWS pertinente

Les sources officielles AWS sont extrêmement détaillées et constituent la référence incontournable pour toute implémentation ou audit IAM.

* **Documentation IAM** : [https://docs.aws.amazon.com/iam/](https://docs.aws.amazon.com/iam/)
* **Guide IAM Best Practices** : [https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
* **Liste des actions/ressources/contextes IAM** : [https://docs.aws.amazon.com/service-authorization/latest/reference/](https://docs.aws.amazon.com/service-authorization/latest/reference/)
* **Policy Generator AWS** : [https://awspolicygen.s3.amazonaws.com/policygen.html](https://awspolicygen.s3.amazonaws.com/policygen.html)
* **IAM Policy Simulator** : [https://policysim.aws.amazon.com/](https://policysim.aws.amazon.com/)
* **AWS Security Blog (IAM section)** : [https://aws.amazon.com/blogs/security/tag/iam/](https://aws.amazon.com/blogs/security/tag/iam/)
* **Well-Architected Security Pillar** : [https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/)

Ces ressources permettent de rester à jour avec les évolutions du service, les bonnes pratiques et les scénarios avancés.

