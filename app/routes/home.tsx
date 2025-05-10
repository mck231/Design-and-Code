// app/routes/home.tsx
import { Link, useLoaderData, type MetaFunction, type LoaderFunctionArgs } from "react-router-dom";

// Assuming Event interface is exported from events.tsx or a shared types file
// If not, you'll need to define it here as well.
import type { Event } from "./events"; // Or adjust path to where Event interface is defined
import eventsDataMay2025 from "../events/may-2025.json"; // Relative path from app/routes/ to app/events/
// Import other month data files here if you have them and combine them
// import eventsDataJune2025 from "../events/june-2025.json";

// Combine all event data sources
const allEvents: Event[] = [
    ...(eventsDataMay2025 as Event[]), // Cast to Event[]
    // ...eventsDataJune2025, // Add other months here
];

// Helper function to format date (can be moved to a utils file)
function formatDate(dateString: string): string {
  if (!dateString) return "Date TBD";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  // Ensure the date string is treated as local time to avoid timezone shifts if only date is provided.
  // Appending T00:00:00 makes it explicit.
  return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
}

// Loader to find the next upcoming event
export async function loader({}: LoaderFunctionArgs) { // Using LoaderFunctionArgs
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date + 'T00:00:00') >= new Date()) // Ensure comparison is fair
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return {
    nextEvent: upcomingEvents.length > 0 ? upcomingEvents[0] : null,
  };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Design & Code Memphis | Tech Community, Events & Resources" },
    { name: "description", content: "Join Design & Code Memphis, a vibrant community for designers, developers, and tech enthusiasts. Explore upcoming events, workshops, and resources to connect, learn, and grow in the Memphis tech scene." },
    // You can add more meta tags here (e.g., Open Graph for social sharing)
    { property: "og:title", content: "Design & Code Memphis | Tech Community, Events & Resources" },
    { property: "og:description", content: "Connect, learn, and create with Memphis's leading tech community. Find events, resources, and networking opportunities." },
    // { property: "og:image", content: "your-logo-or-banner-url.jpg" }, // Add a URL to an image for social sharing
    // { property: "og:url", content: "your-website-url.com" },
    // { name: "twitter:card", content: "summary_large_image" },
  ];
};

// Helper Icon Components (using Heroicons SVG paths)
const CodeBracketIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const PaintBrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a15.995 15.995 0 00-4.764 4.648l-3.876 5.814a1.151 1.151 0 001.597 1.597l5.814-3.875a15.995 15.995 0 004.648-4.763m-4.648 4.763l-.009-.009c-.007-.007-.014-.014-.022-.022L12 16.01l-3.388 1.873.009.009a15.995 15.995 0 01-2.245 2.403l-3.036 2.024a1.149 1.149 0 01-1.597-1.597l2.024-3.035a15.995 15.995 0 012.403-2.245L12 16.01z" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.582M12 15.75a3 3 0 01-3-3A3 3 0 0112 9.75v1.5a1.5 1.5 0 01-3 0m-2.906 6.086a9.093 9.093 0 01-3.741-.479 3 3 0 013.741-5.582m0 0V9.75m3.75 0a3 3 0 00-3-3A3 3 0 0012 9.75v1.5a1.5 1.5 0 003 0m0 0h1.5m-1.5 0a3 3 0 01-3 3m0 0a3 3 0 01-3-3m0 0a3 3 0 01-3-3m0 0a3 3 0 013-3m0 0a3 3 0 013-3m0 0a3 3 0 013-3" />
  </svg>
);

const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a7.5 7.5 0 01-7.5 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21a2.25 2.25 0 004.5 0M12 18.75a.75.75 0 01.75.75v.008c0 .414-.336.75-.75.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-.828 0-1.5.672-1.5 1.5v1.5a.75.75 0 001.5 0v-1.5A1.5 1.5 0 0012 3zM12 9a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

const features = [
  { name: 'Learn & Grow', description: 'Expand your knowledge in UI/UX, coding, and emerging tech through insightful talks and workshops.', icon: LightBulbIcon },
  { name: 'Network & Connect', description: 'Meet fellow designers, developers, founders, and tech enthusiasts in the Memphis area.', icon: UsersIcon },
  { name: 'Share & Collaborate', description: 'Present your projects, share your expertise, and find collaborators for new ventures.', icon: CodeBracketIcon },
  { name: 'Get Inspired', description: 'Hear from industry professionals, discover new ideas, and fuel your passion for technology.', icon: PaintBrushIcon },
];


export default function HomePage() {
  const { nextEvent } = useLoaderData() as { nextEvent: Event | null };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* 1. Hero Section */}
      <div className="relative isolate overflow-hidden pt-14 min-h-[70vh] md:min-h-[80vh] flex items-center">
        {/* Placeholder for a background image - replace with your actual image */}
        <img
          src="/memtech.png" // Corrected src path to be absolute from public folder
          alt="Memphis Tech Community"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 dark:opacity-60"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/30 via-gray-900/10 to-transparent dark:from-gray-900/50 dark:via-gray-900/30"></div>

        <div className="mx-auto max-w-4xl py-20 sm:py-32 lg:py-40 px-6 lg:px-8 text-center bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-400/20 lg:mb-[600px]">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md">
            Memphis: Where Design Meets Code.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl drop-shadow-sm">
            Your hub for UI/UX design, software development, and tech innovation in the heart of Memphis. Join a thriving community of creators and builders.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/events"
              className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-150"
            >
              View Upcoming Events
            </Link>
            <Link to="/about" className="text-base font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-150">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. "What is Design & Code?" - Quick Overview */}
      <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">CONNECT . LEARN . CREATE</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What is Design & Code Memphis?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Design & Code is a community-driven initiative fostering collaboration and knowledge-sharing at the intersection of UI/UX design, software development, and tech entrepreneurship in Memphis. We host regular events, workshops, and discussions to inspire and empower local tech talent.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Spotlight: Next Upcoming Event */}
      {nextEvent && (
        <div className="py-16 sm:py-24 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Don't Miss Out!</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Our Next Event
                </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-gray-700 p-8 sm:mt-12 lg:mx-0 lg:max-w-none lg:flex lg:flex-col lg:items-center">
                <div className="lg:max-w-3xl lg:flex-shrink-0 text-center lg:text-left">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{nextEvent.title}</h3>
                    <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
                        <strong>Date:</strong> {formatDate(nextEvent.date)} <br />
                        <strong>Time:</strong> {nextEvent.time.full} <br />
                        <strong>Location:</strong> {nextEvent.location.name}
                    </p>
                    <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                        {nextEvent.summary}
                    </p>
                    <div className="mt-8">
                        <Link
                            to={`/events/${nextEvent.slug}`}
                            className="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-150"
                        >
                            Learn More & RSVP
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
      {!nextEvent && (
        <div className="py-16 sm:py-24 text-center bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No upcoming events scheduled.</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Check back soon or <Link to="/events" className="text-blue-600 hover:underline">view past events</Link>.</p>
        </div>
      )}


      {/* 4. Why Join Design & Code Memphis? (Benefits/Value Proposition) */}
      <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Community & Growth</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Join Design & Code Memphis?
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              We're dedicated to building a supportive and dynamic environment for tech professionals and enthusiasts in Memphis.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col p-6 rounded-xl bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <feature.icon className="h-8 w-8 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* 5. A Glimpse into Our Community (Placeholder) */}
      <div className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A Glimpse Into Our Community
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            See what our meetups are like and hear from our members.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for images/testimonials - Replace these divs */}
            <div className="h-64 rounded-lg shadow-md overflow-hidden">
              <img src="/designcode1.jpg" alt="Design & Code Community Meetup" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 rounded-lg shadow-md overflow-hidden">
              <img src="/designcode2.jpeg" alt="Design & Code Community Member" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 rounded-lg shadow-md overflow-hidden">
              <img src="/designcode0.jpg" alt="Design & Code Community Event" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Get Involved / Stay Connected */}
      <div className="py-16 sm:py-24 bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Dive In?
          </h2>
          <p className="mt-4 text-lg leading-8 text-blue-100 dark:text-blue-200">
            Become a part of the Design & Code Memphis movement.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <a
              href="mailto:memphisdesignandcode@gmail.com?subject=I%20would%20like%20to%20present&body=Please%20insert%20the%20topic%20you'd%20like%20to%20present%20on.%20Also%20some%20projects%20or%20github%20links%20to%20your%20work."
              className="rounded-md bg-white px-5 py-3 text-base font-semibold text-blue-700 shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-150"
            >
              Speak at an Event
            </a>
            {/* Add links to social media or mailing list signup here */}
            {/* Example:
            <a href="#" className="text-base font-semibold leading-6 text-white hover:text-blue-100">
              Follow on Twitter <span aria-hidden="true">→</span>
            </a>
            */}
          </div>
        </div>
      </div>

    </div>
  );
}
