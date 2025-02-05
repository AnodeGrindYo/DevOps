import { useState, useRef } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import LoadingRobot from "./LoadingRobot";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DevOpsChecklist() {
  const questions = [
    "Quel est l'environnement cible (On-Premise, Cloud, hybride) ?",
    "Quels sont les outils CI/CD actuellement utilisés ?",
    "Quelle est la structure actuelle des déploiements ?",
    "Quelles sont les contraintes de sécurité à respecter ?",
    "Quels sont les besoins en monitoring et logging ?",
    "Comment sont gérées les bases de données et migrations ?",
  ];

  const [answers, setAnswers] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q]: "" }), {})
  );
  const [loading, setLoading] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState([]);
  const generatedStepsRef = useRef([]);

  const handleChange = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const fetchResponseWithRetry = async (prompt) => {
    let attempts = 0;
    while (attempts < 5) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Pause de 1s entre les requêtes
        const response = await axios.post(
          "https://api.mistral.ai/v1/chat/completions", // Utilisation de l'API Mistral
          {
            model: "mistral-medium",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.choices[0].message.content.trim();
      } catch (error) {
        attempts++;
        console.error(`⚠️ Erreur, tentative ${attempts}/5...`);
        if (error.response && error.response.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 30000)); // Attente de 30s en cas de rate-limit
        } else {
          throw error;
        }
      }
    }
    throw new Error("Échec après plusieurs tentatives.");
  };

  const generateInstructions = async () => {
    setLoading(true);
    setGeneratedSteps([]);

    const prompts = questions.map((question) => ({
      question,
      prompt: `En tant que DevOps, voici une question importante : '${question}'. Voici la réponse fournie par l'utilisateur : '${answers[question] || "Non renseigné"}'. En te basant sur cette réponse, génère des instructions détaillées expliquant comment mettre en place cette étape dans un environnement DevOps.`,
    }));

    const responses = await Promise.all(
      prompts.map(async ({ question, prompt }) => {
        const responseText = await fetchResponseWithRetry(prompt);
        return { question, response: responseText };
      })
    );

    generatedStepsRef.current = responses;
    setGeneratedSteps(responses);
    setLoading(false);
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("DevOps Checklist", 10, 10);
    pdf.setFontSize(12);
    pdf.text("Instructions détaillées pour chaque étape", 10, 20);

    const tableData = generatedSteps.map(({ question, response }) => [question, response]);

    autoTable(pdf, {
      head: [["Question", "Réponse"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10, cellWidth: 'wrap' },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } },
    });

    pdf.save("devops_checklist.pdf");
  };

  const progress = (generatedSteps.length / questions.length) * 100;

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
        {loading ? <LoadingRobot /> : "📄 Générer les instructions"}
      </button>

      {loading && (
        <div className="w-full bg-gray-700 rounded-lg h-2 mt-4">
          <div className="bg-green-500 h-2 rounded-lg" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {generatedSteps.length > 0 && (
        <div id="pdf-content" className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">📌 Instructions générées</h2>
          {generatedSteps.map(({ question, response }, index) => (
            <div key={index} className="mb-6 border-2 border-yellow-500 p-4">
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
