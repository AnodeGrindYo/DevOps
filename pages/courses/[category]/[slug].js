import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Navbar from "@/components/Navbar";
import Quiz from "@/components/Quiz";
import TerminalTrainer from "@/components/TerminalTrainer";
import { useState } from "react";

export async function getStaticPaths() {
  const categories = ["cours_devops", "outils", "tp"];
  let paths = [];
  
  categories.forEach((category) => {
    const folderPath = path.join(process.cwd(), "content", category);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      paths = paths.concat(
        files.map((file) => ({
          params: { category, slug: file.replace(".md", "") },
        }))
      );
    }
  });
  
  return { paths, fallback: false };
}

export async function getStaticProps({ params: { category, slug } }) {
  const filePath = path.join(process.cwd(), "content", category, `${slug}.md`);
  const quizPath = path.join(process.cwd(), "content/quizz", `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  function getFilesInFolder(folder) {
    return fs.readdirSync(path.join("content", folder)).map((file) => ({
      slug: file.replace(".md", ""),
      category: folder,
    }));
  }

  const courses = [
    ...getFilesInFolder("cours_devops"),
    ...getFilesInFolder("outils"),
    ...getFilesInFolder("tp"),
  ];

  const quiz = fs.existsSync(quizPath)
    ? JSON.parse(fs.readFileSync(quizPath, "utf-8"))
    : { questions: [] };

  // Correction : Vérification dans public/ et non pages/
  const missionPath = path.join(
    process.cwd(),
    "public",
    "courses",
    "TerminalCourses",
    `${slug}.json`
  );
  console.log("Vérification du fichier mission :", missionPath);

  const hasTerminalMission = fs.existsSync(missionPath);

  return {
    props: {
      data: { ...data, slug },
      content,
      courses,
      quiz,
      hasTerminalMission,
    },
  };
}

export default function CoursePage({ data, content, courses, quiz, hasTerminalMission }) {
  const [showTerminal, setShowTerminal] = useState(false);

  console.log("hasTerminalMission:", hasTerminalMission);

  return (
    <div>
      <Navbar courses={courses} />
      <div className="bg-gray-900 text-white min-h-screen p-8">
        <h1 className="text-4xl font-bold border-b border-gray-700 pb-4 mt-8 text-blue-400">
          {data.title}
        </h1>
        <p className="text-gray-400 mb-6 text-lg">{data.description}</p>

        <div className="prose prose-invert max-w-full mt-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg shadow-lg border border-gray-700"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-800 text-yellow-300 px-2 py-1 rounded-md" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {quiz.questions.length > 0 && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              📘 Quiz : Teste tes connaissances !
            </h2>
            <Quiz questions={quiz.questions} />
          </div>
        )}

        {/* Bouton d'ouverture du Terminal si un fichier de mission existe */}
        {hasTerminalMission && (
          <div className="mt-10">
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showTerminal ? "Fermer le Terminal" : "Lancer le Terminal"}
            </button>
          </div>
        )}

        {/* Affichage du TerminalTrainer */}
        <p className="text-red-500">hasTerminalMission: {hasTerminalMission ? "✅ Oui" : "❌ Non"}</p>
        {showTerminal && hasTerminalMission && (
          <TerminalTrainer missionSlug={data.slug} />
        )}
      </div>
    </div>
  );
}
