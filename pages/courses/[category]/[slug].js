import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Navbar from "@/components/Navbar";
import Quiz from "@/components/Quiz";
import Link from "next/link";

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

  return { props: { data, content, courses, quiz } };
}

export default function CoursePage({ data, content, courses, quiz }) {
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
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-10 mb-4 text-blue-300" {...props} />, 
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-3 text-green-300" {...props} />, 
              h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-2 text-yellow-300" {...props} />, 
              p: ({ node, ...props }) => <p className="text-gray-300 mb-4 text-base leading-relaxed" {...props} />, 
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />, 
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />, 
              li: ({ node, ...props }) => <li className="mb-1" {...props} />, 
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" className="rounded-lg shadow-lg border border-gray-700" {...props}>
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
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">📘 Quiz : Teste tes connaissances !</h2>
            <div id="quiz-section" className="mt-6">
              <Quiz questions={quiz.questions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
