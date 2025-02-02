import { useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import LoadingRobot from "./LoadingRobot";
import ReactMarkdown from "react-markdown";

export default function DevOpsChecklist() {
  const questions = [
    "Quel est l'environnement cible (On-Premise, Cloud, hybride) ?",
    "Quels sont les outils CI/CD actuellement utilisés ?",
    "Quelle est la structure actuelle des déploiements ?",
    "Quelles sont les contraintes de sécurité à respecter ?",
    "Quels sont les besoins en monitoring et logging ?",
    "Comment sont gérées les bases de données et migrations ?",
  ];

  const [answers, setAnswers] = useState(questions.reduce((acc, q) => ({ ...acc, [q]: "" }), {}));
  const [loading, setLoading] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);

  const handleChange = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const fetchResponseWithRetry = async (prompt) => {
    while (true) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/completions",
          {
            model: "deepseek/deepseek-r1:free",
            prompt,
            max_tokens: 500,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        let textResponse = response.data.choices[0].text.trim();
        textResponse = textResponse.replace(/\n{2,}/g, "\n"); // Nettoie les lignes vides en excès

        if (response.data.choices[0].finish_reason === "length") {
          const additionalResponse = await fetchResponseWithRetry(textResponse + "\n\nContinue la réponse...");
          return textResponse + additionalResponse;
        }
        return textResponse;
      } catch (error) {
        console.error("⚠️ Erreur, nouvelle tentative... Attente de 30 secondes avant de réessayer.");
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  };

  const generateInstructions = async () => {
    setLoading(true);
    setGeneratedSteps([]);
    setCurrentResponseIndex(-1);
    
    try {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const fullPrompt = `En tant que DevOps, voici une question importante : '${question}'. Voici la réponse fournie par l'utilisateur : '${answers[question] || "Non renseigné"}'. En te basant sur cette réponse, génère des instructions détaillées expliquant comment mettre en place cette étape dans un environnement DevOps.`;
        
        const responseText = await fetchResponseWithRetry(fullPrompt);
        setGeneratedSteps(prevSteps => [...prevSteps, { question, response: responseText }]);
        setCurrentResponseIndex(i);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la génération des instructions :", error.message);
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const pdfContent = generatedSteps.map(({ question, response }) => `### ${question}\n${response}`).join("\n\n");
    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "devops_roadmap.pdf");
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">🚀 DevOps Checklist</h1>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <label className="block text-lg font-semibold text-gray-300">{question}</label>
          <textarea
            className="w-full p-3 rounded-lg bg-gray-800 text-white mt-2"
            rows={3}
            value={answers[question]}
            onChange={(e) => handleChange(question, e.target.value)}
          />
        </div>
      ))}
      <button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
        onClick={generateInstructions}
        disabled={loading}
      >
        {loading ? "Génération..." : "📄 Générer les instructions"}
      </button>

      {loading && <div className="flex justify-center items-center min-h-screen bg-[#282a36]"><LoadingRobot /></div>} 
      
      {generatedSteps.length > 0 && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">📌 Instructions générées</h2>
          {generatedSteps.map(({ question, response }, index) => (
            <div key={index} className={`mb-6 border-2 border-yellow-500 p-4`}>
              <h3 className="text-xl font-semibold text-blue-300">{question}</h3>
              <ReactMarkdown className="text-gray-300 mt-2 whitespace-pre-line">{response}</ReactMarkdown>
            </div>
          ))}
          <button
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg"
            onClick={downloadPDF}
          >
            📥 Télécharger en PDF
          </button>
        </div>
      )}
    </div>
  );
}