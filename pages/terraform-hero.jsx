// pages/terraform-hero.jsx
import matter from 'gray-matter';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/terraform-hero.module.css';
import Navbar from "../components/Navbar";



// Crée un composant basique sans SSR
function TerraformHeroPage( courses ) {
  const [activeSection, setActiveSection] = useState(null);
  
  useEffect(() => {
    // 1) On ajoute les classes au <body> quand la page est montée
    document.body.classList.add(
      'bg-dracula-background',
      'text-dracula-foreground',
      'overflow-hidden'
    );
    
    // 2) On enlève ces classes quand on QUITTE la page (cleanup)
    return () => {
      document.body.classList.remove(
        'bg-dracula-background',
        'text-dracula-foreground',
        'overflow-hidden'
      );
    };
  }, []);
  
  useEffect(() => {
    const ace = require('ace-builds/src-noconflict/ace');
    require('ace-builds/src-noconflict/ext-language_tools');
    require('ace-builds/src-noconflict/theme-dracula');
    require('ace-builds/src-noconflict/mode-ruby');
    
    require('ace-builds/src-noconflict/snippets/ruby');
    
    
    // 2. Initialiser l'éditeur sur l'élément #editor
    const editor = ace.edit('editor');
    editor.setTheme('ace/theme/dracula');
    editor.session.setMode('ace/mode/ruby'); // ou un autre mode, à voir
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      fontSize: '14px',
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false,
      wrap: true,
    });
    
    
    
    let lessons = [
      {
        title: "Introduction à Terraform",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Bienvenue dans votre formation Terraform! Terraform est un outil d'Infrastructure as Code (IaC) qui vous permet de créer, modifier et versionner votre infrastructure de manière sécurisée et efficace.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Dans cette première leçon, nous allons créer un simple fichier de configuration Terraform avec un provider AWS.</p></div><p class='mb-4'>Un provider est responsable de la création et de la gestion des ressources. Voici un exemple de ce que vous devez écrire:</p><pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>provider \"aws\" {\n  region = \"us-west-2\"\n}</code></pre><p class='mb-4'>À vous de jouer! Écrivez la configuration du provider AWS dans l'éditeur.</p></div>",
        initialCode:
        '# Définissez le provider AWS ici\n# Exemple:\n# provider "aws" {\n#   region = "REGION"\n# }',
        solution: 'provider "aws" {\n  region = "us-west-2"\n}',
        hint:
        "N'oubliez pas de spécifier la région 'us-west-2' dans votre configuration du provider AWS.",
        validation: "provider_aws_region"
      },
      {
        title: "Variables et Types de Données",
        content: "<div class='prose prose-invert'>\n    <p class='mb-4'>Les variables permettent de rendre votre code Terraform plus flexible et réutilisable. Elles évitent la duplication et permettent d’adapter facilement une configuration.</p>\n    <div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n      <strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n      <p>Définir des variables de différents types et les utiliser dans une ressource.</p>\n    </div>\n    <p>Voici les variables à créer :</p>\n    <ul class='list-disc pl-6 mb-4'>\n      <li><strong>instance_type</strong> (type : string, valeur par défaut : \"t2.micro\")</li>\n      <li><strong>instance_count</strong> (type : number, valeur par défaut : 1)</li>\n      <li><strong>tags</strong> (type : map, contenant au moins 2 valeurs)</li>\n    </ul>\n    <p><strong>Exemple d'utilisation des variables :</strong></p>\n    <pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>\n    variable \"instance_type\" {\n      type    = string\n      default = \"t2.micro\"\n    }\n    </code></pre>\n    <p class='mb-4'>À vous de jouer ! Déclarez ces variables dans l'éditeur.</p>\n  </div>",
        initialCode: "# Définissez vos variables ici\n",
        solution: "variable \"instance_type\" {\n  type = string\n  default = \"t2.micro\"\n}\n\nvariable \"instance_count\" {\n  type = number\n  default = 1\n}\n\nvariable \"tags\" {\n  type = map(string)\n  default = {\n    Environment = \"dev\"\n    Project     = \"terraform-learning\"\n  }\n}",
        hint: "Déclarez chaque variable avec `variable \"nom\" { type = TYPE }` et définissez une valeur par défaut avec `default = VALEUR`.",
        validation: "variables_types_correctes"
      },
      {
        title: "Premier Resource AWS EC2",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Créons notre première ressource AWS : une instance EC2.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Créer une instance EC2 avec les spécifications de base.</p></div><p>Utilisez le bloc <code>resource</code> pour définir une instance EC2 avec :</p><ul class='list-disc pl-6 mb-4'><li>Une AMI (Amazon Machine Image) valide</li><li>Un type d'instance défini</li><li>Des tags pour identifier votre instance</li></ul><p class='mb-4'>Exemple :</p><pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>resource \"aws_instance\" \"mon_instance\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t2.micro\"\n  \n  tags = {\n    Name = \"mon-instance\"\n  }\n}</code></pre><p class='mb-4'>À vous de jouer ! Définissez votre première instance EC2.</p></div>",
        initialCode: "# Définissez ici votre ressource EC2\n# Exemple:\n# resource \"aws_instance\" \"mon_instance\" {\n#   ami           = \"ami-xxxxxxxxxxxxxxxxx\"\n#   instance_type = \"t2.micro\"\n#   tags = {\n#     Name = \"mon-instance\"\n#   }\n# }",
        solution:
        "resource \"aws_instance\" \"mon_instance\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t2.micro\"\n  \n  tags = {\n    Name = \"mon-instance\"\n  }\n}",
        hint:
        "Utilisez le bloc 'resource' avec le type 'aws_instance'. Pensez à bien spécifier l'AMI et le type d'instance.",
        validation: "ec2_instance"
      },
      {
        title: "Outputs",
        content: 
        "<div class='prose prose-invert'>\n" +
        "<p class='mb-4'>Les outputs permettent d’afficher des informations essentielles sur les ressources créées après l’application d’une configuration Terraform.</p>\n" +
        "<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n" +
        "<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n" +
        "<p>Définir des outputs pour récupérer et afficher certaines informations sur une instance EC2.</p>\n" +
        "</div>\n" +
        "<p class='mb-4'>Un output dans Terraform est défini à l'aide du bloc <code>output</code>. Il sert à récupérer des valeurs importantes après le déploiement.</p>\n" +
        "<p class='mb-4'>Voici les outputs que nous allons créer :</p>\n" +
        "<ul class='list-disc pl-6 mb-4'>\n" +
        "<li><strong>L'ID de l'instance</strong> pour identifier l'instance EC2 créée</li>\n" +
        "<li><strong>L'adresse IP publique</strong> pour accéder à l'instance</li>\n" +
        "<li><strong>Le nom DNS public</strong> pour des connexions facilitées</li>\n" +
        "</ul>\n" +
        "<p class='mb-4'>Exemple de syntaxe d'un output :</p>\n" +
        "<pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>\n" +
        "output \"instance_id\" {\n" +
        "  value = aws_instance.example.id\n" +
        "}</code></pre>\n" +
        "<p class='mb-4'>À vous de jouer ! Ajoutez les trois outputs nécessaires pour votre instance EC2.</p>\n" +
        "</div>",
        initialCode: 
        "# Ajoutez vos outputs ici\n" +
        "# Exemple :\n" +
        "# output \"instance_id\" {\n" +
        "#   value = aws_instance.example.id\n" +
        "# }",
        solution:
        "output \"instance_id\" {\n" +
        "  value = aws_instance.example.id\n" +
        "}\n\n" +
        "output \"public_ip\" {\n" +
        "  value = aws_instance.example.public_ip\n" +
        "}\n\n" +
        "output \"public_dns\" {\n" +
        "  value = aws_instance.example.public_dns\n" +
        "}",
        hint: 
        "Utilisez le mot-clé 'output' suivi d'un nom et d'une valeur référencée depuis 'aws_instance.example'.",
        validation: "outputs"
      },
      {
        title: "Data Sources",
        content:
          "<div class='prose prose-invert'><p class='mb-4'>Les data sources permettent de récupérer des informations sur des ressources existantes. Elles sont utiles lorsque vous voulez utiliser une ressource qui n'est pas directement gérée par votre configuration Terraform.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Utiliser une data source pour récupérer la dernière AMI Amazon Linux 2.</p></div><p>Dans cet exercice, vous allez configurer une data source qui :</p><ul class='list-disc pl-6 mb-4'><li>Recherche l'AMI Amazon Linux 2 la plus récente</li><li>Utilise les filtres appropriés pour s'assurer qu'on sélectionne la bonne image</li></ul><p>Voici un exemple de syntaxe pour une data source :</p><pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>data \"aws_ami\" \"amazon_linux_2\" {\n  most_recent = true\n  filter {\n    name   = \"name\"\n    values = [\"amzn2-ami-hvm-*-x86_64-gp2\"]\n  }\n  owners = [\"amazon\"]\n}</code></pre><p>À vous de jouer ! Déclarez une data source similaire dans l'éditeur.</p></div>",
        initialCode: "# Définissez votre data source ici\n",
        solution:
          'data "aws_ami" "amazon_linux_2" {\n  most_recent = true\n\n  filter {\n    name   = "name"\n    values = ["amzn2-ami-hvm-*-x86_64-gp2"]\n  }\n\n  filter {\n    name   = "virtualization-type"\n    values = ["hvm"]\n  }\n\n  owners = ["amazon"]\n}',
        hint: "Utilisez le type de data source 'aws_ami' avec les bons filtres pour récupérer l'AMI la plus récente.",
        validation: "data_source_ami"
      },
      {
        title: "Modules",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Les modules permettent de regrouper et réutiliser du code Terraform.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Créer un module simple pour déployer une instance EC2.</p></div><p>Créez un module avec:</p><ul class='list-disc pl-6 mb-4'><li>Variables d'entrée pour l'instance_type et les tags</li><li>Une ressource EC2</li><li>Des outputs</li></ul></div>",
        initialCode: "# Créez votre module ici\n",
        solution:
        'variable "instance_type" {\n  type = string\n  default = "t2.micro"\n}\n\nvariable "tags" {\n  type = map(string)\n  default = {}\n}\n\nresource "aws_instance" "main" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = var.instance_type\n  tags          = var.tags\n}\n\noutput "instance_id" {\n  value = aws_instance.main.id\n}\n\noutput "public_ip" {\n  value = aws_instance.main.public_ip\n}',
        hint: "Un module doit avoir des variables, des ressources et des outputs",
        validation: "module_structure"
      },
      {
        title: "Workspaces",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Les workspaces permettent de gérer plusieurs états pour une même configuration.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Créer une configuration qui utilise les workspaces.</p></div><p>Créez une configuration qui:</p><ul class='list-disc pl-6 mb-4'><li>Utilise une variable workspace</li><li>Configure des ressources différemment selon le workspace</li></ul></div>",
        initialCode: "# Configurez vos ressources avec workspace ici\n",
        solution:
        'locals {\n  workspace_env = terraform.workspace\n}\n\nvariable "instance_type" {\n  type = map(string)\n  default = {\n    dev  = "t2.micro"\n    prod = "t2.small"\n  }\n}\n\nresource "aws_instance" "main" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = var.instance_type[local.workspace_env]\n  \n  tags = {\n    Environment = local.workspace_env\n  }\n}',
        hint:
        "Utilisez terraform.workspace pour accéder au nom du workspace actuel",
        validation: "workspace_config"
      },
      {
        title: "Remote State",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Le remote state permet de stocker et partager l'état Terraform de manière sécurisée.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Configurer le backend S3 pour le remote state.</p></div><p>Configurez le backend avec:</p><ul class='list-disc pl-6 mb-4'><li>Un bucket S3</li><li>Une table DynamoDB pour le locking</li></ul></div>",
        initialCode: "# Configurez le backend ici\n",
        solution:
        'terraform {\n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.tfstate"\n    region         = "us-west-2"\n    encrypt        = true\n    dynamodb_table = "terraform-locks"\n  }\n}',
        hint:
        "N'oubliez pas d'activer le chiffrement et de spécifier la table DynamoDB",
        validation: "remote_state"
      },
      {
        title: "Count et For Each",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Count et for_each permettent de créer plusieurs ressources similaires.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-draska-cyan'>🎯 Objectif:</strong><p>Créer plusieurs instances EC2 avec des configurations différentes.</p></div><p>Créez:</p><ul class='list-disc pl-6 mb-4'><li>3 instances avec count</li><li>Des instances basées sur une map avec for_each</li></ul></div>",
        initialCode: "# Créez vos instances multiples ici\n",
        solution:
        '# Using count\nresource "aws_instance" "count_example" {\n  count         = 3\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n  \n  tags = {\n    Name = "instance-${count.index}"\n  }\n}\n\n# Using for_each\nlocal {\n  instances = {\n    small  = "t2.micro"\n    medium = "t2.small"\n    large  = "t2.medium"\n  }\n}\n\nresource "aws_instance" "for_each_example" {\n  for_each      = local.instances\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = each.value\n  \n  tags = {\n    Name = "instance-${each.key}"\n  }\n}',
        hint:
        "Utilisez count.index avec count et each.key/each.value avec for_each",
        validation: "count_foreach"
      },
      {
        title: "Premiers pas avec les VPC",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Un VPC (Virtual Private Cloud) est un réseau virtuel isolé dans le cloud AWS.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Créer un VPC avec un bloc CIDR personnalisé.</p></div></div>",
        initialCode: "# Créez votre VPC ici\n",
        solution:
        'resource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n  \n  tags = {\n    Name = "main"\n  }\n}',
        hint: "Le bloc CIDR doit être au format 10.0.0.0/16",
        validation: "vpc_creation"
      },
      {
        title: "Sous-réseaux et Zones de Disponibilité",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Les sous-réseaux permettent de segmenter votre VPC en plusieurs réseaux plus petits.</p><div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'><strong class='text-dracula-cyan'>🎯 Objectif:</strong><p>Créer des sous-réseaux publics et privés dans différentes AZ.</p></div></div>",
        initialCode: "# Créez vos subnets ici\n",
        solution:
        'resource "aws_subnet" "public" {\n  vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.1.0/24"\n  \n  tags = {\n    Name = "Public"\n  }\n}\n\nresource "aws_subnet" "private" {\n  vpc_id     = aws_vpc.main.id\n  cidr_block = "10.0.2.0/24"\n  \n  tags = {\n    Name = "Private"\n  }\n}',
        hint: "N'oubliez pas d'associer les subnets au VPC avec vpc_id",
        validation: "subnet_creation"
      },
      {
        title: "Tables de Routage et Internet Gateway",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Pour permettre l'accès à Internet, nous devons configurer une Internet Gateway et les tables de routage.</p></div>",
        initialCode: "# Configurez l'Internet Gateway et les routes ici\n",
        solution:
        'resource "aws_internet_gateway" "main" {\n  vpc_id = aws_vpc.main.id\n}\n\nresource "aws_route_table" "public" {\n  vpc_id = aws_vpc.main.id\n\n  route {\n    cidr_block = "0.0.0.0/0"\n    gateway_id = aws_internet_gateway.main.id\n  }\n}',
        hint: "La route par défaut utilise 0.0.0.0/0 comme CIDR",
        validation: "routing_config"
      },
      {
        title: "Security Groups et Network ACLs",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>La sécurité réseau dans AWS est gérée par les Security Groups et les Network ACLs.</p></div>",
        initialCode: "# Définissez vos règles de sécurité ici\n",
        solution:
        'resource "aws_security_group" "web" {\n  name        = "web"\n  description = "Allow web traffic"\n  vpc_id      = aws_vpc.main.id\n\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}',
        hint: "N'oubliez pas les règles entrantes pour HTTP (port 80)",
        validation: "security_config"
      },
      {
        title: "Auto Scaling Groups",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Les Auto Scaling Groups permettent de gérer automatiquement la capacité de vos applications.</p></div>",
        initialCode: "# Configurez l'Auto Scaling Group ici\n",
        solution:
        'resource "aws_launch_template" "example" {\n  name_prefix   = "example"\n  image_id      = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n}\n\nresource "aws_autoscaling_group" "example" {\n  desired_capacity    = 2\n  max_size            = 4\n  min_size            = 1\n  target_group_arns   = [aws_lb_target_group.example.arn]\n  vpc_zone_identifier = [aws_subnet.public.id]\n\n  launch_template {\n    id      = aws_launch_template.example.id\n    version = "$Latest"\n  }\n}',
        hint: "Définissez les capacités min, max et désirées",
        validation: "asg_config"
      },
      {
        title: "Load Balancers",
        content:
        "<div class='prose prose-invert'><p class='mb-4'>Les Load Balancers permettent de distribuer le trafic entre plusieurs instances.</p></div>",
        initialCode: "# Créez votre Load Balancer ici\n",
        solution:
        'resource "aws_lb" "example" {\n  name               = "example"\n  internal           = false\n  load_balancer_type = "application"\n  security_groups    = [aws_security_group.web.id]\n  subnets            = [aws_subnet.public.id]\n}\n\nresource "aws_lb_target_group" "example" {\n  name     = "example"\n  port     = 80\n  protocol = "HTTP"\n  vpc_id   = aws_vpc.main.id\n}',
        hint: "Utilisez un Application Load Balancer (ALB)",
        validation: "lb_config"
      },
      
      {
        title: "Conditionnels et Locals Avancés",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Lorsque vous gérez plusieurs environnements (dev, staging, prod), vous ne voulez pas forcément dupliquer tout votre code. Les <code>locals</code> vous permettent de définir des valeurs réutilisables dans un même fichier. Les <em>expressions conditionnelles</em> (la syntaxe <code>condition ? valeur_si_vrai : valeur_si_faux</code>) rendent ces valeurs encore plus dynamiques. Ainsi, vous pouvez ajuster des paramètres (ex. le type d'instance) selon l’environnement, sans créer plusieurs blocs.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong><br/>Vous déclarez d’abord un bloc <code>locals</code> en précisant des clés (comme <code>environment</code>) et des expressions conditionnelles (comme <code>instance_type</code>). Ensuite, vous pouvez utiliser <code>local.instance_type</code> à l’intérieur de vos ressources Terraform pour éviter de tout retaper.</p>\n\n<p class='mb-4'><strong>Exemple d’utilisation :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Déclarer la variable d’environnement :</em> Dans le bloc <code>locals</code>, créez par exemple <code>environment = \"dev\"</code>. Vous pouvez changer la valeur plus tard (ex. <code>prod</code>).</li>\n  <li><em>Ajouter une expression conditionnelle :</em> <code>instance_type = local.environment == \"dev\" ? \"t2.micro\" : \"t2.medium\"</code>. Cela signifie : « Si on est en dev, on utilise t2.micro, sinon t2.medium. »</li>\n  <li><em>Utiliser ces valeurs dans vos ressources :</em> Dans la ressource <code>aws_instance</code>, référez-vous à <code>local.instance_type</code> pour le champ <code>instance_type</code>. Dans vos <code>tags</code>, indiquez <code>Environment = local.environment</code> pour garder une trace claire de l’environnement.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Toujours nommer explicitement vos <code>locals</code> pour éviter la confusion (ex. <code>locals { environment = ... }</code> au lieu de <code>env</code>).</li>\n  <li>Privilégiez la logique conditionnelle dans les <code>locals</code> plutôt que dans les ressources directement, afin de garder un code plus propre.</li>\n</ul>\n\n<p>Ce mécanisme est très puissant pour harmoniser et centraliser des changements qui pourraient impacter plusieurs ressources.</p>\n</div>",
        initialCode:
        '# Déclarez un local pour l\'environnement et un conditionnel pour le type d\'instance\n# Exemple :\n# locals {\n#   environment   = "dev"\n#   instance_type = local.environment == "dev" ? "t2.micro" : "t2.medium"\n# }',
        solution:
        'locals {\n  environment   = "dev"\n  instance_type = local.environment == "dev" ? "t2.micro" : "t2.medium"\n}\n\nresource "aws_instance" "conditional" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = local.instance_type\n\n  tags = {\n    Name        = "conditional-instance"\n    Environment = local.environment\n  }\n}',
        hint:
        "Utilisez la syntaxe 'condition ? valeur_si_vrai : valeur_si_faux' dans vos blocs locals pour gérer la logique conditionnelle.",
        validation: "conditionnels_locals"
      },
      {
        title: "Importer des Ressources Existantes",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Si vous avez créé des ressources manuellement dans votre console AWS (ou dans un autre provider), Terraform ne les connaît pas encore. Pour éviter que Terraform ne recrée ces ressources (ou ne les supprime), il faut les « importer » dans l’état (state) de Terraform. Ainsi, Terraform pourra ensuite les gérer comme s’il les avait créées lui-même.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong><br/>Vous écrivez le bloc de ressource correspondant (même nom, même provider, etc.) dans votre fichier .tf, puis vous exécutez la commande <code>terraform import</code> avec l’ID de la ressource réelle. Terraform met alors à jour son état pour faire correspondre votre code à la ressource déjà existante.</p>\n\n<p class='mb-4'><strong>Étapes détaillées :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Déclarez la ressource</em> dans votre code Terraform. Par exemple, une instance EC2 avec un champ <code>ami</code> et <code>instance_type</code>. Le provider doit être le même que celui utilisé pour créer la ressource.</li>\n  <li><em>Notez l’ID de la ressource</em> (par exemple, <code>i-0123456789abcdef0</code> pour une instance EC2). Cet ID est visible dans la console AWS ou via la CLI AWS.</li>\n  <li><em>Importez la ressource</em> en lançant <code>terraform import aws_instance.imported i-0123456789abcdef0</code>. Terraform met à jour son état local.</li>\n  <li><em>Vérifiez</em> avec <code>terraform plan</code>. Terraform vous indiquera s’il y a des différences entre le code et la ressource actuelle.</li>\n</ol>\n\n<p><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Gardez en tête que la plupart des champs configurables doivent correspondre à la ressource déjà existante pour éviter des destructions/recréations inattendues.</li>\n  <li>Ne changez pas immédiatement les champs critiques (ex. <code>vpc_security_group_ids</code>) avant de faire un <code>terraform plan</code> pour comprendre l’impact de vos modifications.</li>\n</ul>\n</div>",
        initialCode:
        '# Déclarez une ressource aws_instance avec un ID quelconque\n# Exemple:\n# resource "aws_instance" "imported" {\n#   ami           = "ami-00000000000000000"\n#   instance_type = "t2.micro"\n# }',
        solution:
        'resource "aws_instance" "imported" {\n  ami           = "ami-00000000000000000"\n  instance_type = "t2.micro"\n}\n\n# Exécutez ensuite :\n# terraform import aws_instance.imported i-0123456789abcdef0',
        hint:
        "Écrivez la ressource comme si vous alliez la créer, puis exécutez 'terraform import' avec l'ID de la ressource réelle.",
        validation: "import_resource"
      },
      {
        title: "Lifecycle et Stratégies de Remplacement",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Par défaut, quand Terraform doit remplacer une ressource, il détruit l’ancienne avant de créer la nouvelle. Cela peut engendrer des coupures de service. Pour certaines ressources critiques (instances de production, bases de données), on veut souvent d’abord créer la nouvelle ressource, puis détruire l’ancienne. C’est ce que permet <code>create_before_destroy</code>.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong><br/>Dans votre ressource, vous ajoutez un bloc <code>lifecycle</code> contenant <code>create_before_destroy = true</code>. Cela indique à Terraform que lorsque des changements majeurs exigent la recréation de la ressource, il faut d’abord en déployer une nouvelle, transférer éventuellement les dépendances, puis supprimer l’ancienne.</p>\n\n<p class='mb-4'><strong>Exemple concret :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Déclarer la ressource</em> (ex. <code>aws_instance</code>).</li>\n  <li><em>Ajouter le bloc lifecycle</em> : <code>lifecycle { create_before_destroy = true }</code>.</li>\n  <li><em>Lancer un plan</em> : si vous modifiez un paramètre critique (ex. <code>instance_type</code>), Terraform va d’abord créer une nouvelle instance, puis détruire l’ancienne.</li>\n</ol>\n\n<p><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Faites attention à d'autres dépendances externes non gérées par Terraform : si un load balancer ou un DNS pointe vers votre ancienne ressource, assurez-vous que la transition se fasse correctement.</li>\n  <li>Utilisez <code>prevent_destroy</code> (autre option <code>lifecycle</code>) si vous voulez éviter qu’une ressource ne soit supprimée par erreur.</li>\n</ul>\n</div>",
        initialCode: "# Ajoutez un bloc lifecycle à votre ressource\n",
        solution:
        'resource "aws_instance" "example_lifecycle" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  lifecycle {\n    create_before_destroy = true\n  }\n\n  tags = {\n    Name = "lifecycle-instance"\n  }\n}',
        hint:
        "Placez le bloc lifecycle { create_before_destroy = true } dans votre ressource pour éviter toute coupure.",
        validation: "lifecycle_rules"
      },
      {
        title: "Provisioners",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Après la création (ou avant la destruction) d’une ressource, vous pouvez vouloir effectuer des opérations de configuration ou d'installation de logiciels. Les <code>provisioners</code> vous permettent d'automatiser ces tâches. Par exemple, copier un script dans une instance, puis l’exécuter, ou encore envoyer des alertes vers un service externe.</p>\n\n<p class='mb-4'><strong>Deux provisioners courants :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><code>file</code> : copie des fichiers depuis votre machine ou un chemin local vers la ressource distante.</li>\n  <li><code>remote-exec</code> : exécute des commandes sur la ressource distante, souvent via SSH (pour Linux) ou WinRM (pour Windows).</li>\n</ul>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>N’utilisez les provisioners que si vous ne pouvez pas faire autrement. Idéalement, la configuration logicielle se fait via des images prêtes à l’emploi ou des outils comme Ansible/Chef/Puppet.</li>\n  <li>Les provisioners peuvent échouer si le script ou la connexion SSH/WinRM n’est pas correctement configuré. Assurez-vous que l’instance soit accessible (groupe de sécurité, clé SSH, etc.).</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Configurer un provisioner <code>file</code> pour copier un script, puis un provisioner <code>remote-exec</code> pour l'exécuter.</p>\n</div>\n</div>",
        initialCode: "# Ajoutez des provisioners à votre instance\n",
        solution:
        'resource "aws_instance" "with_provisioners" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  provisioner "file" {\n    source      = "./setup.sh"\n    destination = "/tmp/setup.sh"\n  }\n\n  provisioner "remote-exec" {\n    inline = [\n      "chmod +x /tmp/setup.sh",\n      "/tmp/setup.sh"\n    ]\n  }\n\n  tags = {\n    Name = "instance-with-provisioners"\n  }\n}',
        hint:
        "Un provisioner 'file' copie vos fichiers. Le 'remote-exec' exécute des commandes (ex. chmod +x) sur l'instance distante.",
        validation: "provisioners"
      },
      {
        title: "Terraform Plan et Apply",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Ces deux commandes constituent le cœur de l’utilisation de Terraform. <code>terraform plan</code> vous montre ce que Terraform compte faire (créer, modifier, détruire). <code>terraform apply</code> exécute réellement ces actions dans votre infrastructure.</p>\n\n<p class='mb-4'><strong>Cycle standard :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><code>terraform init</code> (une seule fois) : initialise le répertoire, télécharge les providers.</li>\n  <li><code>terraform plan</code> : compare votre code .tf à l’état actuel (et aux ressources réelles) pour déterminer les changements à effectuer.</li>\n  <li><code>terraform apply</code> : effectue réellement les modifications proposées par <code>terraform plan</code>. Terraform vous demande souvent une confirmation avant de se lancer.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Ne jamais appliquer un <code>terraform plan</code> dont vous ne comprenez pas chaque ligne de changement.</li>\n  <li>Utilisez des environnements de test pour valider un <code>plan</code> avant de l’appliquer en production.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Ajouter une configuration simple et exécuter <code>terraform plan</code> pour voir les modifications, puis <code>terraform apply</code> pour les appliquer.</p>\n</div>\n</div>",
        initialCode: "# Exemple minimal pour exécuter un plan et un apply\n",
        solution:
        'resource "aws_instance" "plan_apply_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n}',
        hint:
        "Après avoir écrit votre code, faites 'terraform plan' pour visualiser les changements, puis 'terraform apply'.",
        validation: "plan_apply"
      },
      {
        title: "Terraform Destroy",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Parfois, vous souhaitez supprimer tout ce que Terraform a créé (environnement de test, démonstration, etc.). <code>terraform destroy</code> fait exactement cela : il détruit toutes les ressources gérées par votre configuration .tf.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong><br/>Terraform lit l’état actuel et considère qu’il doit supprimer toutes les ressources trouvées. Il vous demande une confirmation, puis procède à la destruction. Cela est irréversible (sauf si vous refaites un <code>terraform apply</code> pour les recréer).</p>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>N’utilisez cette commande qu’en étant sûr de ne pas affecter un environnement de production !</li>\n  <li>Vérifiez d'abord <code>terraform plan -destroy</code> pour voir la liste exacte des ressources qui seront supprimées.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Créer et détruire une ressource pour observer le cycle de vie complet d'une infrastructure gérée par Terraform.</p>\n</div>\n</div>",
        initialCode: "# Déclarez une ressource simple à détruire ensuite\n",
        solution:
        'resource "aws_s3_bucket" "destroy_demo" {\n  bucket = "my-terraform-destroy-demo"\n  acl    = "private"\n}',
        hint:
        "Utilisez 'terraform destroy' pour tout supprimer, après un 'terraform plan -destroy' si vous voulez prévisualiser.",
        validation: "destroy_demo"
      },
      {
        title: "Taint et Targeting de Ressource",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Parfois, vous avez besoin de recréer spécifiquement une ressource (par exemple, une instance bloquée). Terraform ne la recréera pas automatiquement s’il ne voit pas de différence dans le code. Avec <code>terraform taint</code>, vous forcez Terraform à considérer cette ressource comme « endommagée » et à la remplacer au prochain <code>terraform apply</code>. D’autre part, <code>terraform apply -target=</code> vous permet de n’appliquer que les modifications sur une ressource ciblée.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><code>terraform taint aws_instance.example</code> : marque la ressource <code>aws_instance.example</code> comme needing replacement.</li>\n  <li><code>terraform apply</code> : Terraform recrée la ressource au lieu de la conserver.</li>\n  <li><code>terraform apply -target=aws_instance.example</code> : applique uniquement les modifications pour cette ressource, sans toucher le reste.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Utiliser <code>terraform taint</code> pour marquer une ressource, puis <code>terraform apply -target</code> pour cibler une ressource spécifique.</p>\n</div>\n</div>",
        initialCode: "# Déclarez une ressource simple, par exemple une instance\n",
        solution:
        'resource "aws_instance" "taint_target_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  tags = {\n    Name = "taint-target-demo"\n  }\n}\n\n# Exemple de commandes :\n# terraform taint aws_instance.taint_target_demo\n# terraform apply -target=aws_instance.taint_target_demo',
        hint:
        "Après avoir déclaré la ressource, utilisez terraform taint <ressource>, puis terraform apply -target=...",
        validation: "taint_target"
      },
      {
        title: "Terraform Graph",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Terraform construit automatiquement un graphe de dépendances. Comprendre ce graphe est très utile pour visualiser l’architecture, détecter des dépendances circulaires, etc. La commande <code>terraform graph</code> génère un fichier au format DOT. On peut ensuite convertir ce fichier en image avec <code>dot</code> (un outil Graphviz).</p>\n\n<p class='mb-4'><strong>Exemple d’utilisation :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Plusieurs ressources interdépendantes</em> : VPC, Subnet, Instance (l’instance dépendant du Subnet, lui-même dépendant du VPC).</li>\n  <li><em>Exécuter la commande</em> : <code>terraform graph > graph.dot</code> pour générer le fichier DOT.</li>\n  <li><em>Convertir le DOT en image</em> (si vous avez Graphviz) : <code>dot -Tpng graph.dot -o graph.png</code>.</li>\n</ol>\n\n<p class='mb-4'><strong>Bon à savoir :</strong> Le graphe généré inclut les ressources, les outputs, les data sources, etc. C’est très pratique pour avoir un \"plan visuel\" de votre infrastructure.</p>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Créer plusieurs ressources dépendantes et exécuter <code>terraform graph</code> pour visualiser leur relation.</p>\n</div>\n</div>",
        initialCode: "# Déclarez quelques ressources interdépendantes\n",
        solution:
        'resource "aws_vpc" "graph_demo" {\n  cidr_block = "10.1.0.0/16"\n}\n\nresource "aws_subnet" "graph_demo" {\n  vpc_id            = aws_vpc.graph_demo.id\n  cidr_block        = "10.1.1.0/24"\n  availability_zone = "us-west-2a"\n}\n\nresource "aws_instance" "graph_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n  subnet_id     = aws_subnet.graph_demo.id\n}',
        hint:
        "Référencez les IDs (ex: aws_vpc.graph_demo.id) pour créer une dépendance. Ensuite, terraform graph !",
        validation: "terraform_graph"
      },
      {
        title: "Terraform Console",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>La commande <code>terraform console</code> vous permet d’ouvrir une console interactive où vous pouvez tester des expressions Terraform (par exemple, vérifier <code>var.nom_variable</code> ou <code>aws_instance.example.public_ip</code>) sans avoir besoin de relancer un plan. C’est un moyen rapide de s’assurer que vous comprenez la structure de vos données.</p>\n\n<p class='mb-4'><strong>Comment l’utiliser ?</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Créer ou importer vos ressources</em> : assurez-vous d’avoir fait un <code>terraform apply</code>, afin que l’état soit à jour.</li>\n  <li><em>Exécuter <code>terraform console</code></em> : vous entrez alors dans une console. Tapez <code>aws_instance.console_demo.public_ip</code>, par exemple, pour voir l’adresse IP publique stockée dans l’état.</li>\n  <li><em>Tester des fonctions Terraform</em> : par exemple, <code>upper(\"hello\")</code> ou <code>length(list(\"a\",\"b\"))</code>.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong> Cette console est idéale pour valider vos expressions HCL (HashiCorp Configuration Language) sans avoir à lancer un <code>plan</code> complet.</p>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Expérimenter des expressions et référencer vos variables et ressources dans la console.</p>\n</div>\n</div>",
        initialCode:
        "# Déclarez une ressource ou une variable à tester dans la console\n",
        solution:
        'resource "aws_instance" "console_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  tags = {\n    Name = "console-demo"\n  }\n}\n\n# Ensuite, exécutez terraform console et testez :\n# > aws_instance.console_demo.public_ip\n',
        hint:
        "Après un terraform apply, lancez 'terraform console' pour interroger l'état et tester vos expressions.",
        validation: "terraform_console"
      },
      {
        title: "Terraform Cloud",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile ?</strong><br/>Si vous travaillez en équipe ou que vous avez besoin d'un stockage d’état à distance (remote), Terraform Cloud vous permet de centraliser et sécuriser l’état (state). De plus, vous pouvez y configurer vos variables sensibles (par exemple les clés d’accès) et lancer des plans/applies depuis l’interface web ou via des hooks Git.</p>\n\n<p class='mb-4'><strong>Comment ça marche ?</strong><br/>Au lieu d’utiliser un backend local ou S3, vous configurez le bloc <code>terraform</code> pour pointer vers Terraform Cloud (ex. <code>app.terraform.io</code>) et votre organisation. Chaque workspace dans Terraform Cloud correspond à un jeu de ressources distinct. Vous pouvez ensuite donner accès à d’autres membres de l’équipe, gérer les \"runs\" (plans et applies) et voir l’historique.</p>\n\n<p class='mb-4'><strong>Exemple de configuration :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Déclarer le backend remote</em> : dans votre bloc <code>terraform</code>, spécifiez <code>hostname</code>, <code>organization</code>, et le nom de workspace.</li>\n  <li><em>Exécuter <code>terraform login</code></em> pour authentifier votre terminal à Terraform Cloud.</li>\n  <li><em>Faire <code>terraform init</code></em> : Terraform télécharge la configuration et vérifie l’accès au workspace.</li>\n  <li><em>Plan/Apply depuis Terraform Cloud</em> : vos \"runs\" s'affichent dans l’interface web, vous pouvez collaborer ou consulter les logs en équipe.</li>\n</ol>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif:</strong>\n<p>Configurer un backend pour Terraform Cloud et comprendre le workflow (runs, variables partagées, etc.).</p>\n</div>\n</div>",
        initialCode: "# Configurez votre backend pour Terraform Cloud\n",
        solution:
        'terraform {\n  backend "remote" {\n    hostname     = "app.terraform.io"\n    organization = "my-organization"\n\n    workspaces {\n      name = "my-workspace"\n    }\n  }\n}\n\nresource "aws_instance" "tfcloud_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n}',
        hint:
        'Dans le bloc terraform { backend "remote" { ... } }, renseignez hostname, organization et workspace.',
        validation: "terraform_cloud"
      },
      
      {
        title: "Validation Personnalisée Avancée sur les Variables",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Certaines variables doivent répondre à des critères spécifiques (taille minimale, format d’une URL, etc.). Avec les blocs <code>validation</code>, vous pouvez forcer ces exigences. Cela garantit que vos collaborateurs ou vous-même ne passiez pas des valeurs incorrectes qui pourraient casser votre déploiement.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans la déclaration de la variable (<code>variable \"nom\" { ... }</code>), vous ajoutez un bloc <code>validation</code> contenant :</p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><code>condition</code> : une expression Terraform qui doit retourner <code>true</code> pour être valide.</li>\n  <li><code>error_message</code> : le message renvoyé si la condition n’est pas remplie.</li>\n</ul>\n\n<p class='mb-4'>Vous pouvez combiner des fonctions comme <code>regex()</code>, <code>startswith()</code>, <code>length()</code>, etc., pour bâtir des validations avancées (par exemple exiger qu’un champ soit un e-mail ou un préfixe particulier).</p>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Rendez le message d’erreur suffisamment explicite pour guider la personne qui utiliserait cette variable.</li>\n  <li>Décomposez les validations pour les rendre lisibles : si vous avez plusieurs conditions, utilisez des parenthèses claires.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer une variable avec un bloc <code>validation</code> qui vérifie un format et une longueur minimale.</p>\n</div>\n</div>",
        initialCode:
        '# Déclarez une variable avec un bloc validation avancé.\n# Exemple:\n# variable "username" {\n#   type = string\n#   validation {\n#     condition = can(regex("^[a-zA-Z0-9_]+$", var.username))\n#     error_message = "Le nom d\'utilisateur ne doit contenir que des lettres, chiffres ou underscores."\n#   }\n# }',
        solution:
        'variable "username" {\n  type = string\n\n  validation {\n    condition     = can(regex("^[a-zA-Z0-9_]+$", var.username)) && length(var.username) >= 3\n    error_message = "Le nom d\'utilisateur doit faire au moins 3 caractères et contenir uniquement des lettres, chiffres ou underscores."\n  }\n}\n\nresource "null_resource" "user_demo" {\n  # Juste pour l\'exemple\n}',
        hint:
        "Utilisez la fonction regex() pour le format et length() pour la taille minimale, dans la condition.",
        validation: "advanced_variable_validation"
      },
      {
        title:
        "Gestion Manuelle de l’État avec terraform state (mv, rm, pull, push)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Parfois, vous devez réorganiser vos ressources ou corriger un état incohérent sans modifier votre code. Les commandes <code>terraform state</code> vous aident à déplacer, supprimer ou exporter/importer l’état d’une ressource. Cela peut être indispensable pour résoudre des problèmes de nommage ou de duplication de ressources.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><code>terraform state mv [ancienne] [nouvelle]</code> : déplace une ressource d’un nom à un autre dans l’état (pratique si vous renommez la ressource dans le code).</li>\n  <li><code>terraform state rm [ressource]</code> : supprime la ressource de l’état (Terraform ne la gère plus mais ne la détruit pas physiquement).</li>\n  <li><code>terraform state pull</code> et <code>terraform state push</code> : exportent et importent l’état au format JSON. Utile pour un backup manuel ou une analyse hors-ligne.</li>\n</ul>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Ne manipulez pas l’état directement si vous pouvez effectuer les modifications par votre code .tf.</li>\n  <li>Faites toujours un backup (par ex. <code>terraform state pull > backup.json</code>) avant toute manipulation risquée.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Renommer dans l’état une ressource <code>aws_instance.old_name</code> en <code>aws_instance.new_name</code>, sans la recréer.</p>\n</div>\n</div>",
        initialCode:
        '# Déclarez deux ressources, old_name et new_name, ou du moins simulez un changement de nom\n# Par exemple:\n# resource "aws_instance" "old_name" {\n#   ami           = "ami-0123456789abcdef0"\n#   instance_type = "t2.micro"\n# }',
        solution:
        'resource "aws_instance" "old_name" {\n  ami           = "ami-0123456789abcdef0"\n  instance_type = "t2.micro"\n}\n\n# Commande de déplacement dans l\'état :\n# terraform state mv aws_instance.old_name aws_instance.new_name\n\n# Après le mv, vous pouvez changer votre code .tf pour déclarer \'new_name\' à la place de \'old_name\'.',
        hint:
        "Utilisez 'terraform state mv ancien.nom nouveau.nom' pour renommer une ressource dans l'état.",
        validation: "state_management"
      },
      {
        title: "Utilisation Avancée de for_each et de la Fonction for",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Lorsque vous voulez créer plusieurs ressources avec des variations, <code>for_each</code> est plus flexible que <code>count</code>. En effet, <code>for_each</code> permet d’indexer vos ressources par des clés (ex. un <code>map</code> ou un <code>set</code>), ce qui facilite la mise à jour et l’adressage précis (au lieu d’avoir seulement un index numérique).</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Vous déclarez un bloc <code>for_each</code> au lieu d’un <code>count</code>. Chaque clé de la structure (ex. un <code>map</code>) génère une ressource distincte, et vous y accédez avec <code>each.key</code> ou <code>each.value</code>. La fonction <code>for</code> peut aussi être utilisée dans des expressions Terraform pour transformer des listes ou maps (ex. <code>[for s in var.liste : upper(s)]</code>).</p>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Préférez <code>for_each</code> pour gérer un ensemble unique, car les modifications ultérieures (ajout/suppression d’un élément) sont moins destructrices (Terraform comprend quel élément a été enlevé ou ajouté via la clé).</li>\n  <li>Utilisez la fonction <code>for</code> dans les expressions pour générer des structures complexes (ex. pour combiner des tags ou des noms).</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer plusieurs buckets S3 à partir d’un <code>for_each</code> sur un <code>map</code> de configurations et utiliser la fonction <code>for</code> dans un local pour générer les noms de chaque bucket.</p>\n</div>\n</div>",
        initialCode:
        '# Déclarez un local ou variable avec un map de configurations, puis utilisez for_each\n# Exemple:\n# variable "buckets_config" {\n#   type = map(string)\n#   default = {\n#     dev  = "my-dev-bucket"\n#     prod = "my-prod-bucket"\n#   }\n# }',
        solution:
        'locals {\n  environments = {\n    dev  = "my-dev-bucket"\n    prod = "my-prod-bucket"\n  }\n\n  # Exemple de transformation avec for\n  upper_names = [for name in values(local.environments) : upper(name)]\n}\n\nresource "aws_s3_bucket" "advanced_for_each" {\n  for_each = local.environments\n\n  bucket = each.value\n  acl    = "private"\n\n  tags = {\n    Environment = each.key\n    UpperName   = local.upper_names[var.index] # Exemple si on gère un index\n  }\n}',
        hint:
        "Dans la ressource, utilisez 'for_each = map', puis each.key/each.value pour référencer chaque entrée.",
        validation: "advanced_for_each"
      },
      {
        title: "Protéger une Ressource avec prevent_destroy",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Certaines ressources doivent <em>absolument</em> rester en place, même si quelqu’un exécute un <code>terraform destroy</code> global ou si un plan propose de les remplacer. L’option <code>prevent_destroy</code> empêche Terraform de les supprimer. Il faut ensuite la retirer manuellement du code si vous voulez vraiment les détruire plus tard.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans le bloc <code>lifecycle</code> d’une ressource, ajoutez <code>prevent_destroy = true</code>. Si Terraform tente de détruire cette ressource, il génèrera une erreur et arrêtera le plan/apply.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Utilisez <code>prevent_destroy</code> sur des ressources critiques (base de données, secrets, etc.).</li>\n  <li>Soyez conscient que si vous avez vraiment besoin de la détruire, vous devrez modifier votre code pour enlever <code>prevent_destroy</code>, puis refaire un apply.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Configurer une ressource pour qu’elle ne puisse jamais être détruite involontairement via Terraform.</p>\n</div>\n</div>",
        initialCode: "# Ajoutez prevent_destroy dans le lifecycle\n",
        solution:
        'resource "aws_rds_instance" "critical_db" {\n  engine         = "mysql"\n  instance_class = "db.t2.micro"\n  allocated_storage = 20\n  name           = "criticaldb"\n  username       = "admin"\n  password       = "change_me!"\n\n  lifecycle {\n    prevent_destroy = true\n  }\n}',
        hint:
        "Dans le bloc lifecycle, placez prevent_destroy = true pour empêcher la destruction.",
        validation: "prevent_destroy_config"
      },
      {
        title: "Outputs Sensibles (sensitive = true)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Certains outputs, comme un mot de passe ou une clé d’API, ne doivent pas apparaître en clair dans la console ni dans les logs. En déclarant un output comme <em>sensitif</em>, Terraform masquera sa valeur dans la plupart des affichages (par exemple au moment du <code>terraform output</code> ou d’un <code>plan</code>).</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Dans votre bloc <code>output</code>, ajoutez <code>sensitive = true</code>.</li>\n  <li>Lorsque vous ferez un <code>terraform output</code>, la valeur sera affichée comme <code>&lt;sensitive&gt;</code> au lieu du contenu réel.</li>\n  <li>Le contenu reste toutefois présent dans l’état Terraform (le .tfstate). Pour une sécurité totale, stockez votre état dans un backend sécurisé (comme Terraform Cloud ou un bucket S3 chiffré + KMS).</li>\n</ul>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>N'affichez jamais un secret en clair en guise de tags ou de logs.</li>\n  <li>Combinez <code>sensitive</code> et un backend sécurisé (encrypté) pour éviter les fuites.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Déclarer un output qui contient un secret ou un mot de passe, et le marquer comme sensible.</p>\n</div>\n</div>",
        initialCode: "# Créez un output sensible\n",
        solution:
        'resource "random_password" "example" {\n  length  = 16\n  special = true\n}\n\noutput "db_password" {\n  value     = random_password.example.result\n  sensitive = true\n}',
        hint:
        "Dans le bloc output, indiquez sensitive = true pour masquer la valeur dans les affichages.",
        validation: "sensitive_output"
      },
      
      {
        title: "Blocs Dynamiques (dynamic blocks)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Lorsque vous souhaitez générer un nombre variable de sous-blocs (tags, règles de sécurité, etc.) selon une liste ou un map, les blocs dynamiques (<code>dynamic</code>) simplifient grandement le code. Au lieu de répéter manuellement chaque sous-bloc, vous pouvez les créer en boucle.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans une ressource, vous déclarez un bloc <code>dynamic \"nom_du_bloc\"</code> et vous spécifiez la source de données (par exemple <code>for_each</code> avec une liste). À l’intérieur, vous pouvez utiliser <code>content { ... }</code> pour décrire la structure de chaque sous-bloc.</p>\n\n<p class='mb-4'><strong>Exemple :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Définir une variable ou un local</em> qui contient une liste ou un map à partir duquel vous générez les sous-blocs.</li>\n  <li><em>Ajouter un bloc dynamic</em> dans la ressource (ex. <code>dynamic \"ingress\"</code> dans un <code>aws_security_group</code>).</li>\n  <li><em>Utiliser <code>each.key</code>, <code>each.value</code></em> dans <code>content { ... }</code> pour remplir les champs.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Ne pas abuser des blocs dynamiques si une simple itération <code>for_each</code> sur plusieurs ressources distinctes peut suffire.</li>\n  <li>Vérifiez le rendu final avec <code>terraform plan</code> pour vous assurer que la structure générée correspond à vos attentes.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer une règle de sécurité AWS avec plusieurs règles <code>ingress</code>, générées dynamiquement depuis une liste de ports.</p>\n</div>\n</div>",
        initialCode:
        "# Déclarez un local listant plusieurs ports, puis utilisez dynamic dans une ressource\n# Exemple:\n# locals {\n#   allowed_ports = [22, 80, 443]\n# }",
        solution:
        'locals {\n  allowed_ports = [22, 80, 443]\n}\n\nresource "aws_security_group" "dynamic_sg" {\n  name        = "dynamic-sg"\n  description = "SG with dynamic ingress rules"\n  vpc_id      = aws_vpc.main.id\n\n  dynamic "ingress" {\n    for_each = local.allowed_ports\n    content {\n      from_port   = ingress.value\n      to_port     = ingress.value\n      protocol    = "tcp"\n      cidr_blocks = ["0.0.0.0/0"]\n    }\n  }\n}',
        hint:
        'Utilisez dynamic "ingress" { for_each = ... } puis content { ... } pour créer chaque sous-bloc.',
        validation: "dynamic_blocks"
      },
      {
        title: "Ignorer Certains Changements (ignore_changes)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Il arrive que certaines valeurs d’une ressource soient modifiées automatiquement par le provider ou par un autre processus, et que vous ne souhaitiez pas que Terraform essaie de les rétablir à chaque plan. L’option <code>ignore_changes</code> dans <code>lifecycle</code> vous permet de dire à Terraform de ne pas se préoccuper de certains attributs.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans un bloc <code>lifecycle</code> de la ressource, vous précisez <code>ignore_changes = [\"attribut\"]</code>. Ainsi, même si l’état local diffère de la configuration sur cet attribut, Terraform ne le modifiera pas lors d’un <code>apply</code>.</p>\n\n<p class='mb-4'><strong>Exemple d’utilisation :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Déclarer la ressource</em>, par exemple un <code>aws_autoscaling_group</code>.</li>\n  <li><em>Identifier l’attribut</em> qui est souvent modifié par AWS ou un autre outil (ex. <code>desired_capacity</code> si vous avez un auto-scaler externe).</li>\n  <li><em>Ajouter le bloc <code>lifecycle</code></em> avec <code>ignore_changes</code> pointant sur cet attribut.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Utilisez <code>ignore_changes</code> de manière sélective et réfléchie, afin de ne pas masquer des changements importants.</li>\n  <li>Documentez clairement pourquoi vous ignorez ce changement (ex. commentaire dans le code .tf).</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Configurer une ressource qui ignore les modifications externes sur un attribut précis (ex. <code>desired_capacity</code> d’un ASG).</p>\n</div>\n</div>",
        initialCode:
        '# Ajoutez un lifecycle ignore_changes dans votre ressource\n# Exemple:\n# resource "aws_autoscaling_group" "example" {\n#   desired_capacity = 2\n#   max_size = 4\n#   min_size = 1\n# }',
        solution:
        'resource "aws_autoscaling_group" "example_asg" {\n  name               = "example-asg"\n  desired_capacity   = 2\n  max_size           = 4\n  min_size           = 1\n  launch_configuration = aws_launch_configuration.main.id\n  vpc_zone_identifier = [aws_subnet.public.id]\n\n  lifecycle {\n    ignore_changes = ["desired_capacity"]\n  }\n}',
        hint:
        'Utilisez lifecycle { ignore_changes = ["nom_de_l_attribut"] } pour ne pas tenir compte d\'un changement.',
        validation: "ignore_changes"
      },
      {
        title: "Exécuter des Commandes Locales (local-exec) Avancé",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Le provisioner <code>local-exec</code> vous permet d’exécuter des commandes sur votre machine locale plutôt que dans la ressource distante. Vous pouvez ainsi automatiser certains tests, déclencher un script de déploiement externe, ou interagir avec un autre service (ex. Git, Slack, etc.) après la création ou la mise à jour d’une ressource.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Dans votre ressource, ajoutez un bloc <code>provisioner \"local-exec\"</code>.</li>\n  <li>Le champ <code>command</code> contient la commande exacte que vous souhaitez exécuter. Vous pouvez y inclure des interpolations (ex. <code>${self.id}</code>) pour récupérer des informations sur la ressource.</li>\n  <li>Lors de l’<code>apply</code>, Terraform lance la commande localement. Si elle retourne un code d’erreur, Terraform considère le provisioner comme échoué.</li>\n</ul>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Évitez de trop complexifier ces scripts. Si vous devez faire beaucoup de logique, songez à un outil dédié (Jenkins, GitLab CI, etc.).</li>\n  <li>Rappelez-vous que <em>local-exec</em> s’exécute depuis la machine où vous lancez Terraform, pas sur la ressource cible.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Après la création d’une instance, exécuter un script local qui envoie un message de confirmation (ex. via Slack ou par e-mail).</p>\n</div>\n</div>",
        initialCode:
        '# Ajoutez un provisioner local-exec à une ressource\n# Exemple:\n# provisioner "local-exec" {\n#   command = "echo \'Instance ${self.id} créée\'"\n# }',
        solution:
        'resource "aws_instance" "local_exec_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  provisioner "local-exec" {\n    command = "bash ./scripts/notify_slack.sh ${self.id}"\n  }\n}',
        hint:
        "Placez provisioner \"local-exec\" dans la ressource. La commande s'exécute sur votre machine, pas sur l'instance.",
        validation: "local_exec_usage"
      },
      {
        title: "Gestion Avancée des Workspaces (Filtrage par Workspace)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Les workspaces vous permettent de gérer plusieurs états (et donc plusieurs déploiements) à partir d’une même configuration. Par exemple, vous pouvez avoir un workspace <code>dev</code> et un workspace <code>prod</code>. Il est parfois utile d’adapter quelques paramètres (comme un préfixe de nom, un compte AWS différent) selon le workspace courant.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Vous pouvez accéder au nom du workspace actuel via <code>terraform.workspace</code>. Vous pouvez aussi utiliser des conditions, des <code>for_each</code>, ou des maps pour définir des valeurs différentes selon le workspace. Exemple :</p>\n<pre class='bg-dracula-background p-4 rounded-lg mb-4'><code>locals {\n  prefix = terraform.workspace == \"prod\" ? \"production\" : \"sandbox\"\n}</code></pre>\n<p class='mb-4'>De cette façon, vous pouvez personnaliser certains éléments (tags, noms de ressources) sans dupliquer toute la configuration.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Veillez à bien séparer vos state files en workspaces pour éviter de déployer en prod par erreur.</li>\n  <li>Utilisez un naming clair (\"dev\", \"stage\", \"prod\") et évitez trop de workspaces (risque de confusion).</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Gérer un code unique pour \"dev\" et \"prod\" via les workspaces, tout en ajustant automatiquement le nom d’un bucket selon le workspace.</p>\n</div>\n</div>",
        initialCode:
        "# Utilisez terraform.workspace dans vos expressions pour distinguer dev / prod\n",
        solution:
        'locals {\n  prefix = terraform.workspace == "prod" ? "prod" : "dev"\n}\n\nresource "aws_s3_bucket" "workspace_bucket" {\n  bucket = "my-${local.prefix}-bucket"\n  acl    = "private"\n\n  tags = {\n    Environment = terraform.workspace\n  }\n}',
        hint:
        "Accédez au workspace via terraform.workspace et adaptez vos ressources en conséquence.",
        validation: "advanced_workspaces"
      },
      {
        title: "Verrouillage de l’État avec DynamoDB (S3 Backend)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Si vous stockez l’état dans S3, vous pouvez rencontrer des problèmes lorsque plusieurs personnes lancent Terraform en même temps. Terraform propose un mécanisme de verrouillage (\"state locking\") via DynamoDB pour éviter que plusieurs opérations se chevauchent. Cela empêche la corruption de l’état.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Vous configurez votre backend S3 en spécifiant <code>dynamodb_table</code>. Vous devez préalablement créer une table DynamoDB (avec comme clé primaire \"LockID\" par exemple). Lorsqu’une commande Terraform est lancée, elle crée un verrou (entrée dans la table), et le libère ensuite.</p>\n\n<p class='mb-4'><strong>Exemple :</strong></p>\n<ol class='list-decimal pl-6 mb-4'>\n  <li><em>Créer une table DynamoDB</em> dans AWS, par exemple <code>terraform-locks</code>, avec une clé primaire <code>LockID</code> en type String.</li>\n  <li><em>Configurer le backend S3</em> en ajoutant <code>dynamodb_table = \"terraform-locks\"</code> et <code>encrypt = true</code> si possible.</li>\n  <li><em>Exécuter <code>terraform init</code></em> : Terraform activera le locking lors de chaque plan/apply/destroy.</li>\n</ol>\n\n<p class='mb-4'><strong>Bonnes pratiques :</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Nommez la table DynamoDB de façon explicite (ex. <code>terraform-locks</code>), et ne la supprimez pas par inadvertance.</li>\n  <li>Activez le chiffrement côté serveur sur votre bucket S3 (et si possible sur la table DynamoDB) pour protéger votre état et le verrou.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Configurer un backend S3 qui utilise une table DynamoDB pour le verrouillage de l’état.</p>\n</div>\n</div>",
        initialCode:
        '# Configurez votre backend S3 avec un locking DynamoDB\n# Exemple:\n# terraform {\n#   backend "s3" {\n#     bucket         = "my-terraform-state"\n#     key            = "env/terraform.tfstate"\n#     region         = "us-east-1"\n#     dynamodb_table = "terraform-locks"\n#   }\n# }',
        solution:
        'terraform {\n  backend "s3" {\n    bucket         = "my-terraform-state"\n    key            = "prod/terraform.tfstate"\n    region         = "us-east-1"\n    encrypt        = true\n    dynamodb_table = "terraform-locks"\n  }\n}\n\nresource "aws_vpc" "dynamodb_lock_demo" {\n  cidr_block = "10.0.0.0/16"\n}',
        hint:
        "Ajoutez 'dynamodb_table = \"nom_de_table\"' dans votre bloc backend 's3' pour activer le locking.",
        validation: "dynamodb_locking"
      },
      {
        title: "Utiliser des Fonctions de Transformation (coalesce, join, etc.)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Terraform propose de nombreuses fonctions intégrées pour manipuler des chaînes, des listes, des maps, et gérer des cas particuliers. Par exemple, la fonction <code>coalesce()</code> permet de choisir la première valeur non-nulle parmi plusieurs arguments, et <code>join()</code> assemble les éléments d’une liste en une seule chaîne. Ces fonctions vous aident à éviter la répétition de code et à gérer élégamment des valeurs par défaut.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans vos blocs Terraform (variables, resources, outputs, locals), vous pouvez appeler ces fonctions. Exemples&nbsp;:</p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><code>coalesce(var.custom_value, var.default_value)</code> renvoie <code>var.custom_value</code> si elle est définie, sinon <code>var.default_value</code>.</li>\n  <li><code>join(\"-\", [\"word1\", \"word2\"])</code> renvoie <code>\"word1-word2\"</code>.</li>\n</ul>\n<p class='mb-4'>Vous pouvez combiner plusieurs fonctions pour construire des noms de ressources, des tags, ou des chemins de fichiers plus complexes.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques&nbsp;:</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Regroupez votre logique dans des <code>locals</code> afin de simplifier la lecture de vos ressources.</li>\n  <li>Lorsque vous faites appel à des fonctions de manipulation de chaînes ou de listes, assurez-vous que les types de données (string, list, map, etc.) correspondent à ce que la fonction attend.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Utiliser les fonctions <code>coalesce</code> et <code>join</code> pour gérer un nom de ressource, en prenant d’abord une variable facultative, puis une valeur par défaut si elle est absente.</p>\n</div>\n</div>",
        initialCode:
        '# Exemple:\n# locals {\n#   optional_name = var.custom_name\n#   resource_name = coalesce(local.optional_name, "default-name")\n# }\n# resource "null_resource" "example" {\n#   triggers = {\n#     full_name = join("-", [local.resource_name, "tag"])\n#   }\n# }',
        solution:
        'locals {\n  optional_name = var.custom_name\n  resource_name = coalesce(local.optional_name, "default-name")\n}\n\nresource "null_resource" "example" {\n  triggers = {\n    full_name = join("-", [local.resource_name, "tag"])\n  }\n}',
        hint:
        'Dans le code, essayez coalesce(var.custom_name, "default-name"), puis join("-", [...]).',
        validation: "terraform_functions_transformation"
      },
      {
        title: "Arguments de Connexion (connection) pour SSH et WinRM",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Lors de l’utilisation des provisioners (comme <code>remote-exec</code> ou <code>file</code>), Terraform doit savoir comment se connecter à la ressource distante. Les <code>connection</code> blocks permettent de préciser si vous utilisez SSH (pour Linux) ou WinRM (pour Windows), et sous quel compte utilisateur.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li><em>Définir un bloc <code>connection</code></em> dans la ressource, avec les champs requis (ex. <code>type</code>, <code>host</code>, <code>user</code>, <code>password</code> ou <code>private_key</code> selon les cas).</li>\n  <li><em>Choisir le protocole</em> : <code>type = \"ssh\"</code> ou <code>type = \"winrm\"</code>.</li>\n  <li><em>Le resource data</em> : souvent, l’<code>ip</code> ou l’<code>hostname</code> est récupéré depuis la ressource elle-même (ex. <code>self.public_ip</code>).</li>\n</ul>\n\n<p class='mb-4'><strong>Bonnes pratiques&nbsp;:</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Utilisez un utilisateur non-root lorsqu’il s’agit d’un OS Linux. Assurez-vous que la clé SSH est stockée de manière sécurisée.</li>\n  <li>Pour Windows, configurez correctement WinRM et chiffrez le mot de passe si possible. Testez la connexion en dehors de Terraform avant de lancer un provisioner.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Configurer un bloc <code>connection</code> SSH pour exécuter une commande remote-exec sur une instance Linux.</p>\n</div>\n</div>",
        initialCode:
        '# Ex. d\'utilisation:\n# resource "aws_instance" "connect_demo" {\n#   # ...\n#   provisioner "remote-exec" {\n#     connection {\n#       type        = "ssh"\n#       host        = self.public_ip\n#       user        = "ec2-user"\n#       private_key = file("~/.ssh/id_rsa")\n#     }\n#     inline = ["echo Hello"]\n#   }\n# }',
        solution:
        'resource "aws_instance" "connect_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n\n  provisioner "remote-exec" {\n    connection {\n      type        = "ssh"\n      host        = self.public_ip\n      user        = "ec2-user"\n      private_key = file("~/.ssh/id_rsa")\n    }\n\n    inline = [\n      "echo \'Commande exécutée sur l\'instance Linux\'"\n    ]\n  }\n}',
        hint:
        'Définissez connection { type = "ssh", host = self.public_ip, user = ... } pour un remote-exec Linux.',
        validation: "connection_blocks"
      },
      {
        title: "Gérer un Volume EBS et Son Attachement à une Instance",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Au sein d’AWS, vous pouvez créer des volumes EBS distincts de vos instances pour les attacher ou les détacher dynamiquement. Cela vous permet d’augmenter la taille de stockage sans recréer l’instance, ou de séparer la couche de stockage d’une instance éphémère.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Vous déclarez d’abord la ressource <code>aws_ebs_volume</code> pour définir le volume (taille, type). Puis vous créez une ressource <code>aws_volume_attachment</code> qui associe ce volume à une instance spécifique (<code>device_name</code> pour Linux, par ex. <code>/dev/xvdf</code>). Au <code>terraform apply</code>, Terraform crée le volume et l’attache à l’instance.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques&nbsp;:</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>N’utilisez pas <code>root_block_device</code> pour la racine si vous comptez la changer souvent. Séparez le root device et les volumes de données.</li>\n  <li>Pensez à bien gérer vos backups (SnapShots EBS). Terraform peut aussi gérer ces snapshots, mais c’est un processus supplémentaire.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer un volume EBS de 20 Go et l’attacher à une instance EC2 en tant que disque additionnel.</p>\n</div>\n</div>",
        initialCode:
        '# Ex.:\n# resource "aws_ebs_volume" "data_volume" {\n#   availability_zone = "us-west-2a"\n#   size             = 20\n#   type             = "gp2"\n# }\n# resource "aws_volume_attachment" "attach_data_volume" {\n#   device_name  = "/dev/xvdf"\n#   volume_id    = aws_ebs_volume.data_volume.id\n#   instance_id  = aws_instance.myserver.id\n# }',
        solution:
        'resource "aws_ebs_volume" "data_volume" {\n  availability_zone = "us-west-2a"\n  size             = 20\n  type             = "gp2"\n}\n\nresource "aws_instance" "myserver" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = "t2.micro"\n}\n\nresource "aws_volume_attachment" "attach_data_volume" {\n  device_name = "/dev/xvdf"\n  volume_id   = aws_ebs_volume.data_volume.id\n  instance_id = aws_instance.myserver.id\n}',
        hint:
        "Créez d'abord le volume (aws_ebs_volume), puis attachez-le à l'instance (aws_volume_attachment).",
        validation: "ebs_volume_attachment"
      },
      {
        title: "Créer un Module Réutilisable pour la Sécurité Réseau",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Les modules Terraform vous aident à réutiliser du code (par exemple, configuration d’un Security Group, d’une liste de règles d’accès). Au lieu de copier-coller des blocs de ressources dans plusieurs projets, vous les encapsulez dans un module. Ainsi, vous maintenez un code centralisé et vous pouvez versionner ce module indépendamment.</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Un module est simplement un dossier avec des fichiers .tf contenant des ressources, variables et outputs. Dans votre configuration principale, vous déclarez un bloc <code>module</code> en précisant le chemin du module (<code>source</code>), et vous passez les valeurs requises (variantes de ports, etc.). Vous pouvez ensuite le déployer dans différents environnements en ne changeant que les variables.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques&nbsp;:</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Documentez dans le <code>README.md</code> de votre module les variables attendues (ex. <code>allowed_ports</code>, <code>vpc_id</code>).</li>\n  <li>Créez des <code>outputs</code> utiles (comme l’ID du Security Group) pour que les projets qui l’utilisent puissent y faire référence.</li>\n  <li>Versionnez vos modules dans un repo Git, ou dans le <em>Terraform Registry</em> si vous souhaitez les partager publiquement.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer un module \"network-security\" qui définit un Security Group, et l’appeler depuis une configuration principale avec des variables (ports autorisés, description, etc.).</p>\n</div>\n</div>",
        initialCode:
        '# Dans le module (ex: modules/network-security/main.tf):\n# variable "allowed_ports" {\n#   type = list(number)\n# }\n# variable "vpc_id" {\n#   type = string\n# }\n# resource "aws_security_group" "module_sg" {\n#   name        = "network-security-sg"\n#   vpc_id      = var.vpc_id\n#   dynamic "ingress" {\n#     for_each = var.allowed_ports\n#     content {\n#       from_port   = ingress.value\n#       to_port     = ingress.value\n#       protocol    = "tcp"\n#       cidr_blocks = ["0.0.0.0/0"]\n#     }\n#   }\n# }\n',
        solution:
        'module "network_security" {\n  source        = "./modules/network-security"\n  vpc_id        = aws_vpc.main.id\n  allowed_ports = [22, 80, 443]\n}\n\n# Ce module va créer un SG avec ces ports ouverts.\n',
        hint:
        'Placez vos ressources dans un dossier \'modules/network-security\', puis referencez-les via module "xxx" { source = "./modules/network-security" }.',
        validation: "reusable_module_network"
      },
      {
        title:
        "Personnaliser Terraform Plan avec des Fichiers de Variables (.tfvars)",
        content:
        "<div class='prose prose-invert'>\n<p class='mb-4'><strong>Pourquoi c’est utile&nbsp;?</strong><br/>Au lieu de passer des <em>variables</em> en ligne de commande (<code>-var</code>) ou de les définir toutes dans vos fichiers <code>.tf</code>, vous pouvez stocker vos variables dans un ou plusieurs fichiers <code>.tfvars</code> pour séparer la configuration des valeurs (par exemple un fichier <code>dev.tfvars</code> et un <code>prod.tfvars</code>).</p>\n\n<p class='mb-4'><strong>Comment ça marche&nbsp;?</strong><br/>Dans un fichier <code>dev.tfvars</code>, vous déclarez vos valeurs de variables au format <code>variable_name = \"valeur\"</code>. Pour les appliquer, vous faites <code>terraform plan -var-file=dev.tfvars</code>. Terraform va alors utiliser ces valeurs pour remplir les variables correspondantes. Vous pouvez avoir plusieurs fichiers pour différents environnements ou scénarios.</p>\n\n<p class='mb-4'><strong>Bonnes pratiques&nbsp;:</strong></p>\n<ul class='list-disc pl-6 mb-4'>\n  <li>Ne stockez jamais d’informations sensibles (mots de passe, clés d’API) en clair dans un fichier versionné. Utilisez des mécanismes de chiffrement ou un <code>.tfvars</code> non versionné.</li>\n  <li>Nommer vos fichiers .tfvars clairement (ex. <code>dev.tfvars</code>, <code>prod.tfvars</code>) pour éviter toute confusion.</li>\n</ul>\n\n<div class='bg-dracula-selection border-l-4 border-dracula-cyan p-4 rounded my-6'>\n<strong class='text-dracula-cyan'>🎯 Objectif :</strong>\n<p>Créer deux fichiers <code>.tfvars</code> (dev et prod) pour appliquer des paramètres différents (ex. taille d’instance, tags) sans changer le code principal.</p>\n</div>\n</div>",
        initialCode:
        '# Exemple:\n# vars.tf :\n# variable "instance_type" {\n#   type = string\n#   default = "t2.micro"\n# }\n# variable "environment_name" {\n#   type = string\n#   default = "dev"\n# }\n\n# dev.tfvars :\n# instance_type = "t2.micro"\n# environment_name = "development"\n\n# prod.tfvars :\n# instance_type = "t2.medium"\n# environment_name = "production"\n',
        solution:
        'resource "aws_instance" "tfvars_demo" {\n  ami           = data.aws_ami.amazon_linux_2.id\n  instance_type = var.instance_type\n\n  tags = {\n    Environment = var.environment_name\n  }\n}\n\n# Exécution:\n# terraform plan -var-file=dev.tfvars\n# terraform plan -var-file=prod.tfvars',
        hint:
        "Définissez vos variables dans un .tf, puis mettez les valeurs dans dev.tfvars et prod.tfvars. Utilisez -var-file=... lors du plan/apply.",
        validation: "tfvars_files"
      }
    ];
    
    
    
    
    
    function getValidationFunction(validationType) {
      const validationFunctions = {
        provider_aws_region: (code) => {
          // Validation plus flexible pour le provider AWS
          return /provider\s+"aws"\s*{[^}]*region\s*=\s*"us-west-2"[^}]*}/i.test(code);
        },
        variables_types: (code) => {
          // Validation plus flexible pour les variables
          return /variable\s+"instance_type"\s*{[^}]*type\s*=\s*string[^}]*}/i.test(code) &&
          /variable\s+"instance_count"\s*{[^}]*type\s*=\s*number[^}]*}/i.test(code) &&
          /variable\s+"tags"\s*{[^}]*type\s*=\s*map\s*\(\s*string\s*\)[^}]*}/i.test(code);
        },
        ec2_instance: (code) => {
          // Validation plus flexible pour l'instance EC2
          return /resource\s+"aws_instance"[^{]*{[^}]*ami\s*=\s*"ami-0c55b159cbfafe1f0"[^}]*instance_type\s*=\s*"t2\.micro"[^}]*tags\s*=[^}]*}/i.test(code);
        },
        outputs: (code) => {
          // Validation plus flexible pour les outputs
          return /output\s+"instance_id"[^{]*{[^}]*}/i.test(code) &&
          /output\s+"public_ip"[^{]*{[^}]*}/i.test(code) &&
          /output\s+"public_dns"[^{]*{[^}]*}/i.test(code);
        },
        data_source_ami: (code) => {
          // Validation plus flexible pour la data source AMI
          return /data\s+"aws_ami"[^{]*{[^}]*most_recent\s*=\s*true[^}]*amzn2-ami-hvm[^}]*owners\s*=\s*\[\s*"amazon"\s*\][^}]*}/i.test(code);
        },
        module_structure: (code) => {
          // Validation plus flexible pour la structure du module
          return /variable\s+"[^"]+"\s*{[^}]*}/i.test(code) &&
          /resource\s+"[^"]+"\s*"[^"]+"\s*{[^}]*}/i.test(code) &&
          /output\s+"[^"]+"\s*{[^}]*}/i.test(code);
        }
      };
      
      return validationFunctions[validationType] || (() => true);
    }
    
    async function validateLesson(code, lesson) {
      // Nettoyage plus approfondi du code
      const cleanCode = code
      .replace(/\/\*[\s\S]*?\*\//gm, '') // Supprime les commentaires multi-lignes
      .replace(/^\s*#.*$/gm, '') // Supprime les commentaires #
      .replace(/^\s*\/\/.*$/gm, '') // Supprime les commentaires //
      .replace(/^\s*$/gm, '') // Supprime les lignes vides
      .replace(/\s+/g, ' ') // Normalise les espaces multiples
      .replace(/\s*=\s*/g, '=') // Normalise les espaces autour des =
      .replace(/\s*{\s*/g, '{') // Normalise les espaces autour des {
      .replace(/\s*}\s*/g, '}') // Normalise les espaces autour des }
      .trim();
      
      // Si après nettoyage le code est vide, c'est probablement juste des commentaires
      if (!cleanCode) {
        return {
          success: false,
          error: "Veuillez écrire du code Terraform valide"
        };
      }
      
      // Expressions régulières plus souples pour la validation
      const patterns = {
        provider_aws_region: /provider\s*"aws"\s*{[^}]*region\s*=\s*"us-west-2"[^}]*}/i,
        variables_types: /variable\s*"instance_type"\s*{[^}]*type\s*=\s*string[^}]*}.*variable\s*"instance_count"\s*{[^}]*type\s*=\s*number[^}]*}.*variable\s*"tags"\s*{[^}]*type\s*=\s*map\s*\(\s*string\s*\)[^}]*}/is,
        ec2_instance: /resource\s+"aws_instance"\s+"\w+"\s+{\s*ami\s*=\s*"\w+"\s*instance_type\s*=\s*"\w+"\s*tags\s*=\s*{\s*Name\s*=\s*"\w+"\s*}\s*}/s,
        outputs: /output\s*"\w+"\s*{[^}]*value\s*=\s*aws_instance\.\w+\.(id|public_ip|public_dns)[^}]*}/gis,
        data_source_ami: /data\s*"aws_ami"\s*"[^"]*"\s*{[^}]*most_recent\s*=\s*true[^}]*filter\s*{[^}]*name\s*=\s*"name"[^}]*values\s*=\s*\["amzn2-ami-hvm-\*-x86_64-gp2"\][^}]*}[^}]*filter\s*{[^}]*name\s*=\s*"virtualization-type"[^}]*values\s*=\s*\["hvm"\][^}]*}[^}]*owners\s*=\s*\[\s*"amazon"\s*\][^}]*}/i,
        module_structure: /variable\s*"[^"]+"\s*{[^}]*}.*resource\s*"[^"]+"\s*"[^"]+"\s*{[^}]*}.*output\s*"[^"]+"\s*{[^}]*}/is,
        
        conditionnels_locals: /locals\s*{[^}]*environment\s*=\s*["']dev["'][^}]*\?[^:]*:[^}]*}[\s\S]*resource\s+"aws_instance"/i,
        import_resource: /resource\s+"aws_instance"\s+"imported"[\s\S]*terraform\s+import/i,
        lifecycle_rules: /lifecycle\s*{[^}]*create_before_destroy\s*=\s*true[^}]*}/i,
        provisioners: /provisioner\s+"file"[\s\S]*provisioner\s+"remote-exec"/i,
        plan_apply: /resource\s+"aws_instance"\s+"plan_apply_demo"/i,
        destroy_demo: /resource\s+"aws_s3_bucket"\s+"destroy_demo"/i,
        taint_target: /resource\s+"aws_instance"\s+"taint_target_demo"/i,
        terraform_graph: /resource\s+"aws_vpc"\s+"graph_demo"[\s\S]*resource\s+"aws_subnet"\s+"graph_demo"[\s\S]*resource\s+"aws_instance"\s+"graph_demo"/i,
        terraform_console: /resource\s+"aws_instance"\s+"console_demo"/i,
        terraform_cloud: /backend\s*"remote"\s*{[^}]*hostname\s*=\s*"app\.terraform\.io"[^}]*organization[^}]*}/i,
        advanced_variable_validation: /variable\s+"\w+"\s*{[^}]*validation\s*{[^}]*condition\s*=.*error_message\s*=/i,
        state_management: /terraform\s+state\s+mv/i,
        advanced_for_each: /for_each\s*=\s*local\.environments/i,
        prevent_destroy_config: /lifecycle\s*{[^}]*prevent_destroy\s*=\s*true[^}]*}/i,
        sensitive_output: /output\s+".*"\s*{[^}]*sensitive\s*=\s*true[^}]*}/i,
        dynamic_blocks: /dynamic\s+"ingress"\s*{[^}]*content\s*{[^}]*}/i,
        ignore_changes: /lifecycle\s*{[^}]*ignore_changes\s*=\s*\[[^]]*\]/i,
        local_exec_usage: /provisioner\s+"local-exec"/i,
        advanced_workspaces: /terraform\.workspace/i,
        dynamodb_locking: /dynamodb_table\s*=\s*["']terraform-locks["']/i,
        terraform_functions_transformation: /coalesce\(.*?\).*join\(.*?\)/is,
        connection_blocks: /connection\s*{[^}]*type\s*=\s*["']ssh["'][^}]*host\s*=\s*self\.public_ip[^}]*}/i,
        ebs_volume_attachment: /resource\s+"aws_volume_attachment"\s+"attach_data_volume"/i,
        reusable_module_network: /module\s+"network_security"[^}]*source\s*=\s*["']\.\/modules\/network-security["']/i,
        tfvars_files: /terraform\s+plan\s+-var-file=.*\.tfvars/i
      };
      
      try {
        if (lesson.validation && patterns[lesson.validation]) {
          const isValid = patterns[lesson.validation].test(cleanCode);
          if (!isValid) {
            const validationHints = {
              provider_aws_region: [
                "Un bloc provider \"aws\"",
                "La région définie sur \"us-west-2\"",
                "La syntaxe correcte du bloc (accolades, guillemets, etc.)"
              ],
              variables_types: [
                "Une variable 'instance_type' de type string",
                "Une variable 'instance_count' de type number",
                "Une variable 'tags' de type map(string)",
                "La syntaxe correcte des déclarations de variables"
              ],
              ec2_instance: [
                "Une ressource 'aws_instance'",
                "L'AMI spécifiée: ami-0c55b159cbfafe1f0",
                "Le type d'instance: t2.micro",
                "Au moins un tag avec 'Name'"
              ],
              outputs: [
                "Un output pour l'ID de l'instance",
                "Un output pour l'IP publique",
                "Un output pour le DNS public",
                "Les références correctes aux attributs"
              ],
              data_source_ami: [
                "Un bloc 'data \"aws_ami\"'",
                "Le paramètre most_recent = true",
                "Les filtres pour Amazon Linux 2",
                "L'owner Amazon spécifié"
              ],
              module_structure: [
                "Les variables d'entrée nécessaires",
                "La ressource principale",
                "Les outputs requis",
                "Les références correctes aux variables"
              ]
            };
            
            return {
              success: false,
              error: `Le code ne correspond pas aux critères attendus.\n\nVérifiez que vous avez bien :\n${validationHints[lesson.validation].map(hint => `- ${hint}`).join('\n')}`
            };
          }
        }
        
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: `Erreur de validation: ${error.message}`
        };
      }
    }
    
    
    
    
    
    class TerraformHero {
      constructor() {
        this.currentLessonIndex = 0;
        this.editor = null;
        this.lessons = [];
        this.initializeApp();
      }
      
      async initializeApp() {
        try {
          // Attendre que Ace soit complètement chargé
          if (typeof ace === 'undefined') {
            throw new Error('Ace editor not loaded');
          }
          
          this.lessons = lessons;
          this.setupEditor();
          this.setupLessonsList();
          this.loadLesson(0);
          this.setupEventListeners();
        } catch (error) {
          console.error('Error initializing app:', error);
          this.showError('Une erreur est survenue lors de l\'initialisation de l\'application');
        }
      }
      
      setupEditor() {
        try {
          const editorElement = document.getElementById('editor');
          if (!editorElement) {
            throw new Error('Editor element not found');
          }
          
          this.editor = ace.edit("editor");
          
          // Configuration de l'éditeur avec coloration syntaxique HCL
          this.editor.setTheme("ace/theme/dracula");
          this.editor.session.setMode("ace/mode/ruby"); // Utilisation du mode Ruby pour HCL
          
          this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            fontSize: "14px",
            tabSize: 2,
            useSoftTabs: true,
            showPrintMargin: false,
            wrap: true
          });
          
          // Ajout du raccourci Ctrl+/
          this.editor.commands.addCommand({
            name: 'toggleComment',
            bindKey: {win: 'Ctrl-/', mac: 'Command-/'},
            exec: function(editor) {
              editor.toggleCommentLines();
            }
          });
          
        } catch (error) {
          console.error('Error setting up editor:', error);
          this.showError('Erreur lors de l\'initialisation de l\'éditeur');
        }
      }
      
      showError(message) {
        const terminal = document.getElementById('terminal');
        if (terminal) {
          terminal.innerHTML += `<div class="text-red-500">Erreur: ${message}</div>\n`;
        }
      }
      
      setupLessonsList() {
        const lessonsList = document.getElementById('lessons-list');
        this.lessons.forEach((lesson, index) => {
          const li = document.createElement('li');
          li.className = 'p-3 rounded-lg cursor-pointer transition-colors';
          li.classList.add(index === 0 ? 'bg-dracula-blue' : 'hover:bg-dracula-selection');
          li.textContent = `${index + 1}. ${lesson.title}`;
          li.addEventListener('click', () => this.loadLesson(index));
          lessonsList.appendChild(li);
        });
      }
      
      loadLesson(index) {
        this.currentLessonIndex = index;
        const lesson = this.lessons[index];
        
        // Ajout d'une section "Critères de validation"
        const validationCriteria = {
          provider_aws_region: [
            "Un bloc provider \"aws\"",
            "La région définie sur \"us-west-2\""
          ],
          variables_types: [
            "Variable 'instance_type' de type string",
            "Variable 'instance_count' de type number",
            "Variable 'tags' de type map(string)"
          ],
          ec2_instance: [
            "Ressource aws_instance",
            "AMI: ami-0c55b159cbfafe1f0",
            "Type: t2.micro",
            "Tags avec au moins Name"
          ],
          outputs: [
            "Output pour l'ID de l'instance",
            "Output pour l'IP publique",
            "Output pour le DNS public"
          ],
          data_source_ami: [
            "Data source aws_ami",
            "most_recent = true",
            "Filtre pour Amazon Linux 2",
            "Owner Amazon"
          ],
          module_structure: [
            "Variables d'entrée",
            "Ressource principale",
            "Outputs"
          ]
        };
        
        const criteria = validationCriteria[lesson.validation] || [];
        const criteriaHtml = criteria.length ? `
          <div class="bg-dracula-background p-4 rounded-lg mt-4 mb-6">
            <h3 class="text-dracula-orange mb-2">✅ Critères de validation:</h3>
            <ul class="list-inside list-disc space-y-1">
              ${criteria.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : '';
        
        document.getElementById('lesson-content').innerHTML = `
          <h2 class="text-2xl text-dracula-cyan mb-6">${lesson.title}</h2>
          ${lesson.content}
          ${criteriaHtml}
        `;
        
        this.editor.setValue(lesson.initialCode || '');
        this.editor.clearSelection();
        
        document.getElementById('terminal').innerHTML = '';
        
        const progress = ((index + 1) / this.lessons.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        document.querySelectorAll('#lessons-list li').forEach((item, i) => {
          item.classList.toggle('bg-dracula-blue', i === index);
        });
      }
      
      setupEventListeners() {
        try {
          const validateBtn = document.getElementById('validate-btn');
          const mobileValidateBtn = document.getElementById('mobile-validate-btn');
          const hintBtn = document.getElementById('hint-btn');
          const mobileHintBtn = document.getElementById('mobile-hint-btn');
          const nextLessonBtn = document.getElementById('next-lesson-btn');
          const sidebar = document.getElementById('sidebar');
          
          if (validateBtn) {
            validateBtn.addEventListener('click', () => this.validateCurrentLesson());
          }
          
          if (mobileValidateBtn) {
            mobileValidateBtn.addEventListener('click', () => this.validateCurrentLesson());
          }
          
          if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
          }
          
          if (mobileHintBtn) {
            mobileHintBtn.addEventListener('click', () => this.showHint());
          }
          
          if (nextLessonBtn) {
            nextLessonBtn.addEventListener('click', () => this.nextLesson());
          }
          
          if (sidebar) {
            const toggleSidebarBtn = document.querySelector('[data-toggle-sidebar]');
            if (toggleSidebarBtn) {
              toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
              });
            }
          }
          
          // Window resize handler
          let resizeTimeout;
          window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
              if (this.editor) {
                this.editor.resize();
              }
            }, 100);
          });
          
        } catch (error) {
          console.error('Error setting up event listeners:', error);
          this.showError('Erreur lors de l\'initialisation des événements');
        }
      }
      
      async validateCurrentLesson() {
        try {
          if (!this.editor) {
            throw new Error('Editor not initialized');
          }
          
          const code = this.editor.getValue();
          const lesson = this.lessons[this.currentLessonIndex];
          const terminal = document.getElementById('terminal');
          
          if (!terminal) {
            throw new Error('Terminal element not found');
          }
          
          if (!lesson) {
            throw new Error('No lesson loaded');
          }
          
          const result = await validateLesson(code, lesson);
          
          if (result.success) {
            terminal.innerHTML += '<span class="text-dracula-green">✅ Validation réussie!</span>\n';
            const successModal = document.getElementById('success-modal');
            if (successModal) {
              successModal.classList.remove('hidden');
            }
          } else {
            terminal.innerHTML += `<span class="text-red-500">❌ ${result.error}</span>\n`;
          }
          
          terminal.scrollTop = terminal.scrollHeight;
          
        } catch (error) {
          console.error('Error during validation:', error);
          this.showError('Erreur lors de la validation');
        }
      }
      
      showHint() {
        try {
          const lesson = this.lessons[this.currentLessonIndex];
          const terminal = document.getElementById('terminal');
          
          if (!terminal || !lesson) {
            throw new Error('Required elements not found');
          }
          
          terminal.innerHTML += `<div class="text-dracula-yellow">💡 Indice: ${lesson.hint}</div>\n`;
          terminal.scrollTop = terminal.scrollHeight;
          
        } catch (error) {
          console.error('Error showing hint:', error);
          this.showError('Erreur lors de l\'affichage de l\'indice');
        }
      }
      
      nextLesson() {
        try {
          const successModal = document.getElementById('success-modal');
          if (successModal) {
            successModal.classList.add('hidden');
          }
          
          if (this.currentLessonIndex < this.lessons.length - 1) {
            this.loadLesson(this.currentLessonIndex + 1);
          }
          
        } catch (error) {
          console.error('Error loading next lesson:', error);
          this.showError('Erreur lors du chargement de la leçon suivante');
        }
      }
    }
    
    
    window.app = new TerraformHero();
    
    
  }, []);
  
  // return (
  //   <>
  //     <Navbar />
  //     <div className={`${styles.terraformHeroContainer} pt-0 flex flex-col md:flex-row h-[calc(100vh-112px)] md:h-[calc(100vh-104px)]`}>
  //       <nav
  //         id="mobile-nav"
  //         className="md:hidden fixed bottom-0 left-0 right-0 bg-dracula-current z-50 p-2"
  //       >
  //         <div className="flex justify-around items-center ${styles.terraformHeroContainer}">
  //           <button
  //             className="p-3 text-dracula-cyan"
  //             onClick={() =>
    //               document.getElementById("sidebar")?.classList.toggle("hidden")
  //             }
  //           >
  //             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  //             </svg>
  //           </button>
  //           <button
  //             id="mobile-validate-btn"
  //             className="bg-dracula-blue px-4 py-2 rounded-lg"
  //           >
  //             Valider
  //           </button>
  //           <button id="mobile-hint-btn" className="p-3 text-dracula-yellow">
  //             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  //             </svg>
  //           </button>
  //         </div>
  //       </nav>
  
  //       <nav
  //         id="sidebar"
  //         className="hidden md:block md:w-80 bg-dracula-current p-4 overflow-y-auto h-[89vh] md:h-auto  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:bg-[#6272a4] [&::-webkit-scrollbar-thumb]:rounded-[3px]">
  //         <div className="flex items-center gap-3 mb-6">
  //           <svg width="32" height="32" viewBox="0 0 40 40" className="text-dracula-cyan">
  //             <path d="M23.4 15.6v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
  //             <path d="M14.2 11.2v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
  //             <path d="M5 15.6v8.8l7.6-4.4v-8.8L5 15.6z" fill="currentColor" />
  //             <path d="M14.2 24.4v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
  //           </svg>
  //           <h1 className="text-xl font-bold text-dracula-cyan">Terraform Hero</h1>
  //         </div>
  
  //         <div className="w-full h-1 bg-dracula-background rounded mb-4">
  //           <div
  //             id="progress-bar"
  //             className="h-full bg-dracula-cyan rounded transition-all duration-300"
  //           />
  //         </div>
  
  //         <ul id="lessons-list" className="space-y-2" />
  //       </nav>
  
  //       <main className="pt-0 flex-1 p-4 flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-104px)] overflow-y-auto">
  //         <div id="lesson-container" className="flex flex-col md:flex-row gap-4 h-full">
  //           <div
  //             id="lesson-content"
  //             className="md:w-1/2 bg-dracula-current p-6 rounded-lg overflow-y-auto"
  //           />
  //           <div id="challenge-container" className="md:w-1/2 flex flex-col gap-4">
  //             <div
  //               id="editor"
  //               className="flex-1 rounded-lg overflow-hidden min-h-[200px]"
  //             />
  //             <div
  //               id="terminal"
  //               className="h-32 bg-dracula-background rounded-lg p-4 font-mono text-sm overflow-y-auto"
  //             />
  //             <div className="flex gap-4">
  //               <button
  //                 id="validate-btn"
  //                 className="hidden md:block flex-1 bg-dracula-blue hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
  //               >
  //                 Valider
  //               </button>
  //               <button
  //                 id="hint-btn"
  //                 className="hidden md:block flex-1 bg-dracula-comment hover:bg-opacity-80 text-white py-2 px-4 rounded-lg transition-colors"
  //               >
  //                 Indice
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  
  //     <div
  //       id="success-modal"
  //       className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  //     >
  //       <div className="bg-dracula-current p-8 rounded-lg text-center max-w-md w-full">
  //         <h2 className="text-2xl text-dracula-green mb-4">Félicitations! 🎉</h2>
  //         <p className="mb-6">Vous avez réussi ce niveau!</p>
  //         <button
  //           id="next-lesson-btn"
  //           className="bg-dracula-green hover:bg-opacity-80 text-dracula-background py-2 px-6 rounded-lg transition-colors"
  //         >
  //           Niveau suivant
  //         </button>
  //       </div>
  //     </div>
  //   </>
  // );
  
  return (
    <>
    <Navbar />
    <div className={`${styles.terraformHeroContainer} pt-0 flex flex-col h-[calc(100vh-112px)] md:h-[calc(100vh-104px)]`}>
    {/* Mobile Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dracula-current z-50 p-2 border-t border-dracula-comment">
    <div className="flex justify-around items-center">
    <button
    className="p-3 text-dracula-cyan"
    onClick={() => document.getElementById("sidebar")?.classList.toggle("hidden")}
    aria-label="Toggle sidebar"
    >
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    </button>
    <button
    id="mobile-validate-btn"
    className="bg-dracula-blue px-4 py-2 rounded-lg text-sm"
    >
    Valider
    </button>
    <button 
    id="mobile-hint-btn" 
    className="p-3 text-dracula-yellow"
    aria-label="Show hint"
    >
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
    </button>
    </div>
    </nav>
    
    {/* Main Content */}
    <div className="flex flex-1 overflow-hidden">
    {/* Sidebar (Hidden on mobile) */}
    <nav
    id="sidebar"
    className="hidden md:block w-80 bg-dracula-current p-4 overflow-y-auto border-r border-dracula-comment"
    >
    <div className="flex items-center gap-3 mb-6">
    <svg width="32" height="32" viewBox="0 0 40 40" className="text-dracula-cyan">
    <path d="M23.4 15.6v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
    <path d="M14.2 11.2v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
    <path d="M5 15.6v8.8l7.6-4.4v-8.8L5 15.6z" fill="currentColor" />
    <path d="M14.2 24.4v8.8l7.6-4.4v-8.8l-7.6 4.4z" fill="currentColor" />
    </svg>
    <h1 className="text-xl font-bold text-dracula-cyan">Terraform Hero</h1>
    </div>
    
    <div className="w-full h-1 bg-dracula-background rounded mb-4">
    <div
    id="progress-bar"
    className="h-full bg-dracula-cyan rounded transition-all duration-300"
    />
    </div>
    
    <ul id="lessons-list" className="space-y-2" />
    </nav>
    
    {/* Content Area */}
    <main className="flex-1 flex flex-col overflow-hidden">
    <div className="flex-1 flex flex-col md:flex-row overflow-auto">
    {/* Lesson Content */}
    <div 
    id="lesson-container" 
    className="flex-1 md:w-1/2 bg-dracula-current p-4 md:p-6 overflow-y-auto"
    >
    <div id="lesson-content" className="prose prose-invert max-w-none" />
    </div>
    
    {/* Editor & Terminal */}
    <div className="flex-1 md:w-1/2 flex flex-col border-t md:border-t-0 md:border-l border-dracula-comment">
    {/* Editor */}
    <div className="flex-1 relative min-h-[300px]">
    <div 
    id="editor" 
    className="absolute inset-0 bg-dracula-background rounded-lg"
    />
    </div>
    
    {/* Terminal */}
    <div className="h-48 border-t border-dracula-comment">
    <div 
    id="terminal" 
    className="h-full bg-dracula-background p-4 font-mono text-sm overflow-y-auto"
    />
    </div>
    </div>
    </div>
    
    {/* Desktop Buttons */}
    <div className="hidden md:flex gap-4 p-4 border-t border-dracula-comment">
    <button
    id="validate-btn"
    className="flex-1 bg-dracula-blue hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
    >
    Valider
    </button>
    <button
    id="hint-btn"
    className="flex-1 bg-dracula-comment hover:bg-opacity-80 text-white py-2 px-4 rounded-lg transition-colors"
    >
    Indice
    </button>
    </div>
    </main>
    </div>
    
    {/* Success Modal */}
    <div
    id="success-modal"
    className="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
    <div className="bg-dracula-current p-8 rounded-lg text-center max-w-md w-full mx-4">
    <h2 className="text-2xl text-dracula-green mb-4">Félicitations! 🎉</h2>
    <p className="mb-6">Vous avez réussi ce niveau!</p>
    <button
    id="next-lesson-btn"
    className="bg-dracula-green hover:bg-opacity-80 text-dracula-background py-2 px-6 rounded-lg transition-colors w-full"
    >
    Niveau suivant
    </button>
    </div>
    </div>
    </div>
    </>
  );
  
  
}

// Export sans SSR (important pour éviter "document is not defined")
export default dynamic(() => Promise.resolve(TerraformHeroPage), { ssr: false });