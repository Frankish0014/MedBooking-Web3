import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 4v8M8 8h8" />
                <path d="M8 16c0 2.2 1.8 4 4 4s4-1.8 4-4" />
              </svg>
            </div>
            <span className="text-dark-400 text-sm">
              © 2025 MedBooking. Built with{' '}
              {/* <Heart className="w-4 h-4 inline text-red-500 fill-red-500" />{' '} */}
              on Ethereum
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-dark-400 hover:text-dark-100 transition-colors text-sm"
            >
              About
            </a>
            <a
              href="#"
              className="text-dark-400 hover:text-dark-100 transition-colors text-sm"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-dark-400 hover:text-dark-100 transition-colors text-sm"
            >
              Support
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-dark-100 hover:bg-dark-700 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;