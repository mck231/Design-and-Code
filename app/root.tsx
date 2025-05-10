// app/root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet, 
  Scripts,
  ScrollRestoration,
} from "react-router-dom"; 
import type { Route } from "./+types/root"; 
import "./app.css";

// Import your new components
import Header from "./components/Header"; // Adjust path if you didn't use app/components/
import Footer from "./components/Footer"; // Adjust path

export const links: Route.LinksFunction = () => [ // Or LinksFunction if type Route is not defined yet
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous", // 'anonymous' as a string
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// This Layout component is likely what's used by your default export App or directly
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-full"> {/* Ensure body can flex and take min height */}
        <Header /> {/* Add the Header here */}
        <main className="flex-grow"> {/* This main tag will make the content area grow */}
          {children} {/* This is where Outlet will render the page content */}
        </main>
        <Footer /> {/* Add the Footer here */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // The Outlet renders the matched route's component
  return <Outlet />;
}

// ErrorBoundary remains the same
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) { // Or ErrorBoundaryProps if Route is not defined
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    // It's good practice for the error boundary to also be within a basic HTML structure
    // or use the Layout component if possible, though that can be tricky if Layout itself errors.
    <html lang="en">
      <head>
        <title>{message}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="pt-16 p-4 container mx-auto">
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </main>
        <Scripts />
      </body>
    </html>
  );
}