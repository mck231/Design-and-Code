// app/components/Footer.tsx
import { Link } from "react-router-dom"; // Import Link if you want the logo to link to home
import Logo from "../assets/Logo.svg?react"; // Corrected SVG import for Vite + svgr

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center p-6 mt-auto"> {/* Increased padding a bit */}
      <div className="container mx-auto text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-col items-center mb-2"> {/* Flex container to center logo */}
         <Link to="/" className="flex items-center">
          <Logo // Use the imported SVG component
          title="Design & Code Memphis Logo" // Title for accessibility
          width={50} // Width of the SVG
            height={50} // Height of the SVG
            className="h-12 mr-3 bg-cyan-600" // Styles for size, margin, and background. Background applies if SVG is transparent.
            aria-label="Design & Code Memphis Logo" // For accessibility
          />
          {/* Optional: If you want to add the text next to the logo if it's not clear in the SVG */}
          {/* <span className="text-xl font-bold text-white">Design & Code</span> */}
        </Link>
        </div>
        <p>
          &copy; {currentYear} Design & Code Memphis. All Rights Reserved.
        </p>
        {/* You could add social media links or other info here */}
        <p className="mt-2">
          {/* Example: Add a link back to the main site or a "contact us" if relevant */}
          {/* <Link to="/contact" className="hover:underline">Contact Us</Link> */}
        </p>
      </div>
    </footer>
  );
}