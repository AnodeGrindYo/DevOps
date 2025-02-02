// components/LoadingRobot.js
import { useState, useEffect } from 'react';
import styles from './LoadingRobot.module.css';

const LoadingRobot = () => {
  const thoughts = [
    "Compilant un pipeline de blagues...",
    "Déployant une armée de conteneurs Docker...",
    "Équilibrage de charge du fun en cours...",
    "Vérification des logs pour des easter eggs...",
    "Terraforming un meilleur futur numérique...",
    "Calcul en cours : (42 * X) / DevOps = 🚀",
    "Génération d'une réponse optimisée avec GPT-X...",
    "Chargement... AI-driven, mais toujours lent 🧠⚡",
    "Monitorage en temps réel... Niveau de fun : 99%",
    "Kubernetes me dit que tout va bien... probablement",
    "Pipeline CI/CD en attente d'un café ☕...",
    "Optimisation des algos IA... Veuillez patienter 🏗️",
    "Vérification des dépendances... npm ou pip ?",
    "Simulating Skynet... Annulation en cours 🤖❌",
    "Connexion au cloud... Oh non, un coût imprévu ☁️💸",
    "Debugging en cours... AI assistant activé !",
    "Compilation en 42 étapes... Espérons que ça passe...",
    "Nettoyage des fichiers temporaires... Du moins, j'essaie...",
    "Formation de modèles IA... Les neurones sont en feu ! 🔥",
    "Réduction de la dette technique... Ou pas. 🤷",
    "CI/CD échoué... Essayons de relancer avec espoir...",
    "Calcul de la complexité algorithmique... Trop élevée !",
    "Upgrade en cours... Espérons qu'il n'y ait pas de breaking change...",
    "Execution d'un test unitaire... Ah, une régression non prévue !",
    "Monitoring des logs... Erreur détectée, suppression des preuves...",
    "Refactoring du code... Encore un fichier legacy à réécrire...",
    "Analyse des performances... Conclusion : Ça rame !",
    "Installation des mises à jour... Cela prendra une éternité...",
    "DevOps en action... Le SRE est en PLS...",
    "Ajout de tests unitaires... Oh, qui suis-je en train de tromper ?",
    "Automatisation des tâches... Maintenant je peux procrastiner en paix !",
    "Le déploiement est en cours... Croisons les doigts ! 🤞",
    "Jenkins build en échec... Est-ce vraiment une surprise ?",
    "Récupération des logs... Mais pourquoi sont-ils en JSON compressé ?",
    "Docker-compose up... Cela pourrait prendre un moment...",
    "Scaling horizontal... Parce que vertical, c'est trop cher !",
    "IA en cours d'apprentissage... Soyons patients, c'est une forte tête !",
    "Reverse proxy configuré... Mais où est passée la requête HTTP ?",
    "Mise en production en cours... Que la force soit avec nous !",
    "Recherche de mémoire RAM... Résultat : Insuffisant !",
    "Installation d'une dépendance... Oh non, conflit de versions !",
    "Nettoyage du cache... Mais ça servira-t-il vraiment à quelque chose ?",
    "Synchronisation avec le cloud... Latence imprévisible en cours...",
    "Refonte du backend... Le front-end pleure déjà...",
    "Requête SQL optimisée... ou bien j'ai juste ajouté un INDEX ?",
    "Exécution du script de migration... RIP base de données...",
    "Mise à jour de la doc... Ah non, personne ne la lit de toute façon !",
    "Rollback en cours... Mais où est passée la sauvegarde ?",
    "Test de charge en cours... Le serveur fume déjà...",
    "Retrying request... Again... And again...",
    "Ajout d'un print debug... Résultat : Ça ne s'affiche pas !",
    "Chasse aux memory leaks... Mais pourquoi ça fuit partout ?",
    "Rebuild du cache... Un jour, je comprendrai comment ça marche !",
    "Connexion SSH... Pourquoi est-ce si lent aujourd’hui ?",
    "Mise à jour des packages... Ah non, j'ai tout cassé !",
    "Backup des données... Trop tard, c'est déjà perdu...",
    "Attente d'un merge request... Ça prendra une éternité...",
    "Recherche d'un bug... Il disparaît dès que quelqu'un regarde !",
    "Réduction de la dette technique... Oh, une pull request de 10000 lignes !",
    "Découverte d'un bug en prod... Chut, personne ne le saura...",
    "Investigation de logs... Je crois que j'ai trouvé, mais non...",
    "Installation d'une feature... Ah non, elle a tout cassé...",
    "Désactivation d'un feature flag... Et tout redevient stable !",
    "Migration vers Kubernetes... On espère que tout tiendra...",
    "Upgrade de la base de données... C'est long, très long...",
    "Monitoring en temps réel... Erreur critique détectée !",
    "Nettoyage du backlog Jira... Ah non, c’est peine perdue...",
    "Merge en cours... Attention aux conflits git !",
    "Planification des sprints... Déjà en retard avant de commencer !",
    "Déploiement en rollback... Le chaos est notre quotidien !",
    "Installation des outils DevOps... Mais j'avais déjà fait ça hier ?",
    "Debugging d’un script shell... Pourquoi ça marche pas ???",
    "Ajout de logs... Pourquoi maintenant il y en a trop ?!",
    "Jenkins build réussi ! Un miracle vient de se produire !",
    "Déploiement avec Ansible... Un jour ça marchera du premier coup !"
  ];

  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [thoughtOpacity, setThoughtOpacity] = useState(1);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Mise à jour de la pensée toutes les 3 secondes (avec fondu sortant/entrant)
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setThoughtOpacity(0); // fondu sortant
      setTimeout(() => {
        setCurrentThoughtIndex((prev) => (prev + 1) % thoughts.length);
        setThoughtOpacity(1); // fondu entrant
      }, 500);
    }, 3000);

    return () => clearInterval(thoughtInterval);
  }, [thoughts.length]);

  // Affichage cyclique des items toutes les 2 secondes
  useEffect(() => {
    const itemInterval = setInterval(() => {
      setCurrentItemIndex((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(itemInterval);
  }, []);

  return (
    <div className={styles.scene}>
      <div className={styles['thought-bubble']}>
        <div
          id="thoughts"
          style={{ opacity: thoughtOpacity, transition: 'opacity 0.5s' }}
        >
          {thoughts[currentThoughtIndex]}
        </div>
      </div>

      <div className={styles.robot}>
        <div className={styles.head}>
          <div className={styles.eyes}>
            <div className={`${styles.eye} ${styles.left}`}></div>
            <div className={`${styles.eye} ${styles.right}`}></div>
          </div>
          <div className={styles.antenna}></div>
        </div>
        <div className={styles.body}>
          <div className={styles.chest}></div>
          <div className={styles.arms}>
            <div className={`${styles.arm} ${styles.left}`}></div>
            <div className={`${styles.arm} ${styles.right}`}></div>
          </div>
          <div className={styles.legs}>
            <div className={`${styles.leg} ${styles.left}`}></div>
            <div className={`${styles.leg} ${styles.right}`}></div>
          </div>
        </div>
      </div>

      <div className={styles.items}>
        <div
          className={`${styles.item} ${styles.book}`}
          style={{ opacity: currentItemIndex === 0 ? 1 : 0 }}
        >
          📚
        </div>
        <div
          className={`${styles.item} ${styles.coffee}`}
          style={{ opacity: currentItemIndex === 1 ? 1 : 0 }}
        >
          ☕
        </div>
        <div
          className={`${styles.item} ${styles.computer}`}
          style={{ opacity: currentItemIndex === 2 ? 1 : 0 }}
        >
          💻
        </div>
        <div
          className={`${styles.item} ${styles.lightbulb}`}
          style={{ opacity: currentItemIndex === 3 ? 1 : 0 }}
        >
          💡
        </div>
      </div>
    </div>
  );
};

export default LoadingRobot;
