// components/TerminalTrainer.js
import React, { useState, useEffect, useRef } from 'react';
import { FileSystem } from '../lib/filesystem';
import { loadCourse } from '../lib/courseLoader';

const TerminalTrainer = ({ missionSlug }) => {
  // Si un missionSlug est fourni, on l'utilise sinon on utilise une valeur par défaut
  const [course, setCourse] = useState(missionSlug || '01_Bases_Linux');
  const [modalOpen, setModalOpen] = useState(true); // On démarre avec la modale ouverte
  const [output, setOutput] = useState([]); // Tableau d’objets { text, className }
  const [command, setCommand] = useState('');
  const [missions, setMissions] = useState([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);

  const currentMission = missions[currentMissionIndex] || null;
  const fsRef = useRef(new FileSystem());
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Charger le cours dès que la valeur de `course` change
  useEffect(() => {
    async function initCourse() {
      const loadedMissions = await loadCourse(course);
      setMissions(loadedMissions);
      setCurrentMissionIndex(0);
      setScore(0);
      setOutput([]);
      setHintVisible(false);
      appendOutput('Bienvenue dans le Terminal Trainer DevOps !');
      appendOutput('Commencez votre formation en complétant les missions.');
    }
    initCourse();
  }, [course]);

  const appendOutput = (text, className = '') => {
    setOutput((prev) => [...prev, { text, className }]);
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleCommand = () => {
    if (!currentMission) return;
    appendOutput(`user@devops:~$ ${command}`);
    if (command.trim() === '') {
      setCommand('');
      return;
    }
    const result = currentMission.verify(command, fsRef.current);
    if (result.success) {
      appendOutput(result.output, 'text-green-400');
      setScore((prev) => prev + 10);
      setTimeout(() => {
        appendOutput('Mission accomplie !', 'text-green-400');
        const nextIndex = currentMissionIndex + 1;
        if (nextIndex < missions.length) {
          appendOutput('--- Nouvelle mission ---');
          setCurrentMissionIndex(nextIndex);
          setHintVisible(false);
        } else {
          appendOutput('Félicitations ! Vous avez terminé toutes les missions !', 'text-green-400');
        }
      }, 500);
    } else {
      appendOutput(result.output, 'text-red-400');
    }
    setCommand('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showHint = () => {
    setHintVisible(true);
  };

  // Si la modale est fermée, ne rien afficher
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col p-4">
      {/* Entête du terminal */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold">Terminal DevOps</h2>
        <button onClick={closeModal} className="text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Fenêtre du terminal */}
      <div className="flex-grow flex flex-col bg-gray-800 rounded-lg overflow-hidden">
        <div className="flex items-center bg-gray-700 px-4 py-2 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div ref={outputRef} className="flex-grow p-4 overflow-auto font-mono text-sm">
          {output.map((line, index) => (
            <div key={index} className={line.className}>
              {line.text}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-blue-400 mr-2">user@devops:~$</span>
            <input
              type="text"
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow bg-transparent text-white focus:outline-none"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Panneau de mission */}
      <div className="mt-4 bg-gray-800 rounded-lg p-4">
        {currentMission && (
          <>
            <h3 className="text-white font-bold mb-2">{currentMission.title}</h3>
            <p className="text-gray-300 mb-4">{currentMission.description}</p>
          </>
        )}
        <button onClick={showHint} className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
          Besoin d&apos;aide ?
        </button>
        {hintVisible && currentMission && (
          <div className="mt-4 p-3 bg-gray-700 rounded text-yellow-300">
            {currentMission.hint}
          </div>
        )}
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-green-400">Score: {score}</span>
          <span className="text-blue-400">Niveau: {currentMissionIndex + 1}</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalTrainer;
