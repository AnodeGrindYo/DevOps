import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Quiz({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showRetryMessage, setShowRetryMessage] = useState(false);

  useEffect(() => {
    setRoundQuestions(shuffleArray([...questions]));
  }, [questions]);

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function handleAnswer(choice) {
    setSelectedAnswer(choice);
    setShowExplanation(true);
    
    if (choice !== roundQuestions[currentIndex].answer) {
      setIncorrectQuestions((prev) => [...prev, roundQuestions[currentIndex]]);
    }
  }

  function nextQuestion() {
    if (currentIndex < roundQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (incorrectQuestions.length > 0) {
      setShowRetryMessage(true);
    } else {
      setIsOpen(false);
    }
    setSelectedAnswer(null);
    setShowExplanation(false);
  }

  function restartIncorrectQuestions() {
    setRoundQuestions(shuffleArray([...incorrectQuestions]));
    setIncorrectQuestions([]);
    setCurrentIndex(0);
    setShowRetryMessage(false);
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-md border border-yellow-700">
        🎯 Commencer le Quiz
      </button>
      <Transition appear show={isOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-lg">
              {showRetryMessage ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">😬 Oups ! Quelques erreurs...</h2>
                  <p className="text-lg text-gray-300">On va revoir ensemble les questions où tu t&apos;es trompé. 💪</p>
                  <button className="mt-6 p-3 bg-yellow-500 text-black rounded-md w-full hover:bg-yellow-600" onClick={restartIncorrectQuestions}>
                    🔄 Recommencer les erreurs
                  </button>
                </div>
              ) : (
                <>
                  <Dialog.Title className="text-2xl font-bold text-yellow-400 mb-4">
                    🧠 Question {currentIndex + 1} / {roundQuestions.length || questions.length}
                  </Dialog.Title>
                  <p className="text-lg mb-4">{roundQuestions[currentIndex]?.question}</p>
                  <div className="space-y-2">
                    {shuffleArray([...roundQuestions[currentIndex]?.choices || []]).map((choice, index) => (
                      <button
                        key={index}
                        className={`block w-full text-left p-3 rounded-md transition-colors duration-300 ${
                          selectedAnswer
                            ? choice === roundQuestions[currentIndex]?.answer
                              ? "bg-green-500"
                              : choice === selectedAnswer
                              ? "bg-red-500"
                              : "bg-gray-700"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => handleAnswer(choice)}
                        disabled={selectedAnswer}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {showExplanation && (
                    <p className="mt-4 text-blue-300">💡 {roundQuestions[currentIndex]?.explanation}</p>
                  )}
                  {showExplanation && (
                    <button
                      className="mt-4 p-3 bg-yellow-500 text-black rounded-md w-full hover:bg-yellow-600"
                      onClick={nextQuestion}
                    >
                      {currentIndex < roundQuestions.length - 1 ? "➡️ Question suivante" : "🏆 Terminer le quiz"}
                    </button>
                  )}
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
