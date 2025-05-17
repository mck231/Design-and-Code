// app/routes/home.tsx
import { Link, useLoaderData, type MetaFunction, type LoaderFunctionArgs } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

// Assuming Event interface is exported from events.tsx or a shared types file
// If not, you'll need to define it here as well.
import type { Event } from "./events"; // Or adjust path to where Event interface is defined
import eventsDataMay2025 from "../events/may-2025.json"; // Relative path from app/routes/ to app/events/
import { BrainCircuit, Lightbulb, Network, Users } from "lucide-react";
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


const features = [
  { name: 'Learn & Grow', description: 'Expand your knowledge in UI/UX, coding, and emerging tech through insightful talks and workshops.', icon: BrainCircuit },
  { name: 'Network & Connect', description: 'Meet fellow designers, developers, founders, and tech enthusiasts in the Memphis area.', icon: Network },
  { name: 'Share & Collaborate', description: 'Present your projects, share your expertise, and find collaborators for new ventures.', icon: Users },
  { name: 'Get Inspired', description: 'Hear from industry professionals, discover new ideas, and fuel your passion for technology.', icon: Lightbulb },
];


export default function HomePage() {
  const { nextEvent } = useLoaderData() as { nextEvent: Event | null };

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const bannerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroBgRef.current || !bannerTextRef.current || !heroSectionRef.current) {
        return;
      }

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // --- Animation Keyframes (as fractions of viewport height) ---
      // Banner Text Fade Out
      const bannerFadeStartScroll = 0;
      const bannerFadeEndScroll = vh * 0.4; // Banner fully faded by 40% of vh scroll

      // Hero Image Fade In
      const imageFadeInStartScroll = vh * 0.1; // Image starts fading in at 10% vh scroll
      const imageFadeInEndScroll = vh * 0.6;   // Image fully visible by 60% vh scroll

      // Hero Image Fade Out (as the entire hero section scrolls up)
      // This needs to be relative to the hero section's position or a larger scroll range
      const imageVisibleDuration = vh * 0.5; // How long the image stays fully opaque
      const imageFadeOutStartScroll = imageFadeInEndScroll + imageVisibleDuration; // Start fading out after it has been visible
      const imageFadeOutEndScroll = imageFadeOutStartScroll + vh * 0.5; // Fully faded out over another 50% vh scroll

      // --- Opacity Calculations ---

      // Banner Text Opacity
      let bannerOpacity = 1;
      if (scrollY >= bannerFadeStartScroll && scrollY <= bannerFadeEndScroll) {
        bannerOpacity = 1 - (scrollY - bannerFadeStartScroll) / (bannerFadeEndScroll - bannerFadeStartScroll);
      } else if (scrollY > bannerFadeEndScroll) {
        bannerOpacity = 0;
      }
      bannerTextRef.current.style.opacity = `${Math.max(0, Math.min(1, bannerOpacity))}`;
      // Optionally hide banner with display:none when fully transparent to prevent interaction
      bannerTextRef.current.style.display = bannerOpacity <= 0 ? 'none' : 'flex';


      // Hero Background Image Opacity
      let imageOpacity = 0;
      if (scrollY < imageFadeInStartScroll) {
        imageOpacity = 0;
      } else if (scrollY >= imageFadeInStartScroll && scrollY < imageFadeInEndScroll) {
        imageOpacity = (scrollY - imageFadeInStartScroll) / (imageFadeInEndScroll - imageFadeInStartScroll);
      } else if (scrollY >= imageFadeInEndScroll && scrollY < imageFadeOutStartScroll) {
        imageOpacity = 1; // Fully visible
      } else if (scrollY >= imageFadeOutStartScroll && scrollY < imageFadeOutEndScroll) {
        imageOpacity = 1 - (scrollY - imageFadeOutStartScroll) / (imageFadeOutEndScroll - imageFadeOutStartScroll);
      } else if (scrollY >= imageFadeOutEndScroll) {
        imageOpacity = 0;
      }
      heroBgRef.current.style.opacity = `${Math.max(0, Math.min(1, imageOpacity))}`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call on mount to set initial opacities

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* 1. Hero Section - Increased height to allow for scroll animations */}
      <div ref={heroSectionRef} className="relative isolate overflow-hidden pt-14 min-h-[180vh] md:min-h-[200vh]">
        {/* Background Image - Starts transparent, positioned to fill */}
        <img
          ref={heroBgRef}
          id="hero-bg"
          src="/memtech.png"
          alt="Memphis Tech Community"
          className="absolute inset-0 -z-10 h-full w-full object-contain opacity-0 transition-opacity duration-300 ease-in-out" // Changed object-cover to object-contain
        />
        {/* Gradient overlay for image - ensure it's behind text but can overlay image if needed */}
        <div className="absolute inset-0 -z-5 bg-gradient-to-b from-gray-900/10 via-transparent to-transparent dark:from-gray-900/30 dark:via-transparent"></div>

        {/* Banner Text Container - Fixed positioned to center in viewport initially */}
        <div
          ref={bannerTextRef}
          id="banner-text"
          className="fixed inset-0 flex items-center justify-center p-4 z-20 transition-opacity duration-300 ease-in-out" // Changed to fixed
        >
          {/* Inner div for styling the text box content */}
              <div className="mx-auto max-w-4xl py-10 sm:py-16 lg:py-20 px-6 lg:px-8 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-400/20">
              {/* Wrapper for text alignment and structure of the top part (image, H1, paragraph) */}
              <div className="text-center sm:text-left">
                {/* Flex container for Image and H1 */}              
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 justify-center sm:justify-start mb-6">
                <img
                  src="/Design_&_Code_Logo_Email.svg"
                  alt="Design & Code Memphis Logo"
                  className="mt-5 h-20 w-auto sm:h-24 flex-shrink-0" // flex-shrink-0 prevents image from shrinking in flex row
                />
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md">
                  Memphis: Where Design Meets Code.
                </h1>
                </div>

                {/* Paragraph below the Image/H1 row. Inherits text-alignment from parent. */}
                <p className="text-lg leading-8 text-gray-200 sm:text-xl drop-shadow-sm">
                Your hub for UI/UX design, software development, and tech innovation in the heart of Memphis. Join a thriving community of creators and builders.
                </p>
              </div>

              {/* Buttons container - remains unchanged */}
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
