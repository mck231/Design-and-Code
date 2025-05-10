// app/root.tsx
import {
  isRouteErrorResponse,
  Links, // Renders <link> tags provided by `links` exports
  Meta,  // Renders <meta> tags provided by `meta` exports
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router-dom";

import type {
  
} from "./+types/root"; 

import "./app.css";

// Import your Header and Footer components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Define a more generic ErrorBoundaryProps if a specific one isn't available from generated types
interface MyErrorBoundaryProps {
  error: any; // You can refine this type
}

// Define a generic type for the `links` export if a specific one isn't available.
// This is a common structure for link descriptors.
type LinkDescriptor = {
  rel: string;
  href: string;
  crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
  // Add other properties like as, type, sizes, etc., if needed
  [key: string]: any;
};

type AppLinksFunction = () => LinkDescriptor[];


export const links: AppLinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* The <Meta /> component from react-router-dom renders meta tags 
            based on 'meta' exports from your route components. */}
        <Meta />
        {/* The <Links /> component from react-router-dom renders link tags
            based on 'links' exports (like the one above in this file). */}
        <Links />
      </head>
      <body className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: MyErrorBoundaryProps) {
  let message = "Oops! An Error Occurred";
  let details = "Something went wrong, and we're not sure what.";
  let status = 500;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText || (error.status === 404 ? "Page Not Found" : "Error");
    details = error.data?.message || error.data || (error.status === 404
        ? "The page you are looking for does not exist or has been moved."
        : "An unexpected error occurred while trying to load this page.");
  } else if (error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  const showStack = import.meta.env.DEV && stack;

  return (
    <div className="text-center py-10 px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">{status}</h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{message}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        {details}
      </p>
      {showStack && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-sm text-left overflow-x-auto text-sm text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          <code>{stack}</code>
        </pre>
      )}
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
