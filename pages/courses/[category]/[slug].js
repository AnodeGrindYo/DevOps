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
        <h1 className="text-4xl font-bold border-b border-gray-700 pb-4 mt-8 mb-8 text-blue-400">
          {data.title}
        </h1>
        <p className="text-gray-400 mb-6 text-lg">{data.description}</p>

        {/* Personnalisation du rendu Markdown */}
        <div className="prose prose-invert max-w-full mt-8 space-y-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-5xl font-bold mt-12 mb-6 text-blue-400 underline uppercase" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-4xl font-semibold mt-10 mb-5 text-blue-300 underline uppercase" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-3xl font-semibold mt-8 mb-4 text-blue-200" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-2xl font-semibold mt-6 mb-3 text-white inline-block" {...props} />
              ),
              h5: ({ node, ...props }) => (
                <h5 className="text-xl font-semibold mt-4 mb-2 text-gray-300 inline-block" {...props} />
              ),
              h6: ({ node, ...props }) => (
                <h6 className="text-lg font-semibold mt-3 mb-2 text-gray-400 inline-block" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-white" {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-t border-gray-700 my-8" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 text-gray-300" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 text-gray-300" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-2 flex items-start gap-2">
                  <span className="shrink-0">{props.children}</span>
                </li>
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="mt-1 mb-4 w-full">
                    <SyntaxHighlighter
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg shadow-lg border border-gray-700 p-4 w-full"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="bg-gray-800 text-yellow-300 px-2 py-1 rounded-md font-mono mt-0 mb-1 inline-block"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ node, ...props }) => (
                <table className="table-auto w-full text-left border-collapse border border-gray-700" {...props} />
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-gray-800 text-white" {...props} />
              ),
              tbody: ({ node, ...props }) => <tbody {...props} />,
              tr: ({ node, ...props }) => (
                <tr className="border-t border-gray-700 hover:bg-gray-800 transition" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-4 py-2 font-bold border border-gray-700 bg-gray-900 text-white" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 border border-gray-700 text-gray-300" {...props} />
              ),
              
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
          <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              🖥️ Terminal Trainer : Pratique tes commandes !
            </h2>
            <button
              onClick={() => setShowTerminal((prev) => !prev)}
              className="bg-green-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition"
            >
              {showTerminal ? "❌ Fermer le Terminal" : "🖥️ Lancer le Terminal"}
            </button>
          </div>
        )}

        {/* Affichage du TerminalTrainer */}
        {showTerminal && hasTerminalMission && (
          <TerminalTrainer missionSlug={data.slug} />
        )}
      </div>
    </div>
  );
}
