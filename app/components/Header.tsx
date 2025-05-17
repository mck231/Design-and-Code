// app/components/Header.tsx
import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState for mobile menu toggle
import Logo from "../assets/Logo.svg?react"; // Corrected SVG import for Vite + svgr

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define common link classes to avoid repetition
  const linkClassName = "block py-2 px-3 border border-black bg-white text-black rounded-md font-medium hover:bg-cyan-600 hover:text-white hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out";

  return (
    // Removed grayscale and brightness filters from the header
    // Kept the blue background from a previous version, adjust as needed e.g., bg-gray-100 for a light header
    <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo // Use the imported SVG component
          title="Design & Code Memphis Logo" // Title for accessibility
          width={50} // Width of the SVG
            height={50} // Height of the SVG
            className="h-12 mr-3 bg-black" // Styles for size, margin, and background. Background applies if SVG is transparent.
            aria-label="Design & Code Memphis Logo" // For accessibility
          />
          {/* Optional: If you want to add the text next to the logo if it's not clear in the SVG */}
          {/* <span className="text-xl font-bold text-white">Design & Code</span> */}
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden px-3 py-2 border rounded text-white border-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Navigation Links */}
        {/* Apply 'hidden' class based on isMobileMenuOpen state for small screens, always flex for md and up */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:w-auto w-full`} id="navbarNav">
          <ul className="flex flex-col md:flex-row md:space-x-2 lg:space-x-4 mt-4 md:mt-0 text-sm"> {/* Reduced space-x for smaller screens if needed */}
            <li>
              <Link
                to="/"
                className={linkClassName}
                aria-current="page"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className={linkClassName}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                Events
              </Link>
            </li>
            {/* <li>
              <Link
                to="/blog"
                className={linkClassName}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                Blog/Resources
              </Link>
            </li> */}
            <li>
              <Link
                to="/about"
                className={linkClassName}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
