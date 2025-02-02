import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Navbar from "../components/Navbar";

export async function getStaticProps() {
  function getFilesInFolder(folder) {
    return fs.readdirSync(path.join("content", folder)).map((file) => {
      const markdown = fs.readFileSync(path.join("content", folder, file), "utf-8");
      const { data } = matter(markdown);
      return { ...data, slug: file.replace(".md", ""), category: folder };
    });
  }

  const courses = [
    ...getFilesInFolder("cours_devops"),
    ...getFilesInFolder("outils"),
    ...getFilesInFolder("tp"),
  ];

  return {
    props: {
      courses,
    },
  };
}

export default function Home({ courses }) {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-10">
      <Navbar courses={courses} />
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-400 tracking-wide">
        🚀 Formation DevOps
      </h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-300">📘 Cours DevOps</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(c => c.category === "cours_devops").map(({ title, description, slug }) => (
            <Link key={slug} href={`/courses/cours_devops/${slug}`}>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:bg-blue-900 cursor-pointer h-full flex flex-col">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="text-gray-300 mt-2 text-sm flex-grow">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-green-300">🛠 Cours sur les Outils</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(c => c.category === "outils").map(({ title, description, slug }) => (
            <Link key={slug} href={`/courses/outils/${slug}`}>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:bg-green-900 cursor-pointer h-full flex flex-col">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="text-gray-300 mt-2 text-sm flex-grow">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-yellow-300">📝 Travaux Pratiques</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(c => c.category === "tp").map(({ title, description, slug }) => (
            <Link key={slug} href={`/courses/tp/${slug}`}>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:bg-yellow-900 cursor-pointer h-full flex flex-col">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="text-gray-300 mt-2 text-sm flex-grow">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
