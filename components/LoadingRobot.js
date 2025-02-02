// components/LoadingRobot.js
import { useState, useEffect } from 'react';
import styles from './LoadingRobot.module.css';

const LoadingRobot = () => {
  const thoughts = [
    "Hmm... Laissez-moi réfléchir...",
    "Je cherche la meilleure réponse !",
    "Consultation de ma base de données...",
    "Oh ! Une idée brillante arrive !",
    "Processeur en surchauffe...",
    "Beep boop... Calculs en cours...",
    "J'ai besoin de plus de RAM !",
    "Error 404: Blague non trouvée",
    "Chargement des neurones artificiels...",
    "Je dois boire un café robot !"
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
