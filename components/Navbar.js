import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar({ courses }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <nav className="mb-8 bg-gray-900 text-white py-4 px-6 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold text-blue-400 cursor-pointer">
            🚀 Formation DevOps
          </h1>
        </Link>
        <button
          className="text-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <div className={`fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-95 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out overflow-y-auto p-6`}> 
        <button
          className="absolute top-5 right-5 text-3xl text-white"
          onClick={() => setMenuOpen(false)}
        >
          <FiX />
        </button>
        <div className="mt-16">
  <Link href="/checklist">
    <div className="w-full text-xl font-semibold text-yellow-400 py-2 hover:text-yellow-500 cursor-pointer">
      ✅ DevOps Checklist
    </div>
  </Link>
</div>

        <div className="mt-16">
          {['cours_devops', 'outils', 'tp'].map((category) => (
            <div key={category}>
              <button
                className="w-full text-left text-xl font-semibold text-blue-300 py-2 hover:text-blue-500"
                onClick={() => toggleCategory(category)}
              >
                {category.replace('_', ' ').toUpperCase()}
              </button>
              <ul className={`pl-4 transition-all duration-300 ${openCategory === category ? "block" : "hidden"}`}>
                {(courses || []).filter(c => c.category === category).map(({ slug }) => (
                  <li key={slug} className="mb-2">
                    <Link
                      href={`/courses/${category}/${slug}`}
                      className="text-white block hover:text-blue-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      {slug.replace(/_/g, " ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
