import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from "../../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
        
        {/* Logo + Site Name */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-xl font-bold">Healthcare Corner</h2>
        </div>

        {/* Copyright */}
        <div className="text-sm">
          <p>&copy; {new Date().getFullYear()} Healthcare Corner. All rights reserved.</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end gap-6 text-lg">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-500 transition-all duration-300"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-400 transition-all duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition-all duration-300"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-300 transition-all duration-300"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
