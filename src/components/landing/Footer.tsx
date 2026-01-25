"use client";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-white">FinBoard</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 text-sm">
            Built for Groww Internship Assignment
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          Made with ❤️ using Next.js, TypeScript, Tailwind CSS, and Zustand
        </div>
      </div>
    </footer>
  );
}
