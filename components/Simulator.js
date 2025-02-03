import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css?global";

export default function Simulator({ mode = "terminal", onClose }) {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const userInputRef = useRef(""); // Stocker l'input utilisateur
  const [currentStep, setCurrentStep] = useState(0);
  const initialized = useRef(false); // Empêcher l'affichage double

  const exercises = {
    terminal: [
      { question: "Affiche la liste des fichiers", expected: "ls", hint: "Commande de base pour voir les fichiers.", output: "Documents  Images  Musique  Téléchargements  Bureau" },
      { question: "Affiche aussi les fichiers cachés", expected: "ls -a", hint: "Ajoute une option pour voir les fichiers cachés.", output: ".bashrc  .gitconfig  .ssh  Documents  Images  Musique  Téléchargements  Bureau" }
    ],
  };

  useEffect(() => {
    if (mode === "terminal" && !xtermInstance.current) {
      xtermInstance.current = new Terminal({ cursorBlink: true, cursorStyle: "block", allowTransparency: true });
      xtermInstance.current.open(terminalRef.current);

      // Affichage initial du terminal
      xtermInstance.current.writeln("\x1b[1;36mBienvenue dans le simulateur de terminal !\x1b[0m");
      xtermInstance.current.writeln("\x1b[1;32mTape la commande demandée.\x1b[0m\n");

      if (!initialized.current) {
        initialized.current = true; // Empêcher l'affichage double
        showNextQuestion(0); // Affiche la première question
      }

      xtermInstance.current.onData(handleUserInput);
    }
  }, [mode]);

  const showNextQuestion = (step) => {
    console.log(`📌 Demande de la question à l'étape ${step}`);

    if (step < exercises.terminal.length) {
      const { question } = exercises.terminal[step];
      xtermInstance.current.writeln(`\x1b[1;33m→ ${question}\x1b[0m`);
      xtermInstance.current.write("$ ");
    } else {
      xtermInstance.current.writeln("\x1b[1;32m🎉 Exercice terminé !\x1b[0m");
    }
  };

  const handleUserInput = (data) => {
    console.log(`📝 Donnée reçue dans handleUserInput: '${data}'`);

    if (data === "\r") {
      const command = userInputRef.current.trim().toLowerCase();
      console.log(`🔄 Validation de la commande: '${command}'`);

      userInputRef.current = ""; // Réinitialisation après validation
      processCommand(command);
    } else if (data === "\u007F") { // Suppression (Backspace)
      if (userInputRef.current.length > 0) {
        console.log("⬅ Suppression du dernier caractère");
        userInputRef.current = userInputRef.current.slice(0, -1);
        xtermInstance.current.write("\b \b");
      }
    } else {
      console.log(`✍ Ajout de '${data}' à l'input`);
      userInputRef.current += data;
      xtermInstance.current.write(data);
    }
  };

  const processCommand = (input) => {
    const normalizedInput = input.trim().toLowerCase().replace(/\s+/g, " "); // Normalisation
    const expected = exercises.terminal[currentStep]?.expected.trim().toLowerCase().replace(/\s+/g, " ");
    const output = exercises.terminal[currentStep]?.output;

    console.log(`⚡ Commande entrée : '${normalizedInput}'`);
    console.log(`🎯 Commande attendue : '${expected}'`);

    xtermInstance.current.writeln("");

    if (normalizedInput === expected) {
      console.log("✅ Bonne réponse détectée !");
      xtermInstance.current.writeln("\x1b[1;32m✅ Bonne réponse !\x1b[0m");
      if (output) {
        xtermInstance.current.writeln(output);
      }

      // Mise à jour immédiate de `currentStep`
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      setTimeout(() => {
        showNextQuestion(nextStep);
      }, 1000);

    } else {
      console.log("❌ Mauvaise réponse");
      xtermInstance.current.writeln(`\x1b[1;31m❌ Mauvaise réponse ! Indice : ${exercises.terminal[currentStep]?.hint}\x1b[0m`);
      xtermInstance.current.write("$ ");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-3/4 max-w-4xl shadow-lg relative">
        <button className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-lg" onClick={onClose}>
          ❌ Fermer
        </button>
        <h1 className="text-2xl font-bold text-blue-400 mb-4">🚀 Simulateur {mode === "terminal" ? "Terminal" : "IDE"}</h1>
        <div>
          <div ref={terminalRef} className="h-64 bg-black p-2 rounded"></div>
        </div>
      </div>
    </div>
  );
}
