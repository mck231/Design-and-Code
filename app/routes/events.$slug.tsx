// app/routes/events.$slug.tsx
import { useParams, Link } from "react-router-dom";
import { type MetaFunction, type LoaderFunction, useLoaderData, redirect } from "react-router-dom"; // Using react-router-dom's types

// Re-using the Event interface from your events listing page or define it here
// Ensure this matches your JSON structure
interface EventTime {
  start: string;
  end: string;
  full: string;
}
interface EventLocation {
  name: string;
  address?: string | null;
}
interface Speaker {
  key: string;
  name: string;
  talkTitle: string;
  bio?: string; // Optional: Add more speaker details
  linkedIn?: string; // Optional
  twitter?: string; // Optional
}
interface AgendaItem {
  order: number;
  type: string;
  speakerKey?: string;
  activity: string;
  durationMinutes: number;
  details: string;
}
interface RsvpInfo {
  platform: string;
  details: string;
  link?: string | null;
}
interface Sponsor {
  name:string;
  contribution: string;
  website?: string; // Optional
}
interface EventDescription {
  whoIsThisFor: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  rsvp: RsvpInfo;
  sponsors: Sponsor[];
  parkingInfo: string;
}
export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: EventTime;
  location: EventLocation;
  summary: string;
  description: EventDescription;
  topics: string[];
}

// Dynamically import all JSON files from the events directory
const eventModules = import.meta.glob('../events/*.json', { eager: true });
let allEvents: Event[] = [];

for (const path in eventModules) {
  const module = eventModules[path] as { default: Event[] }; // Type assertion for the module
  if (module.default) {
    allEvents = allEvents.concat(module.default);
  }
}

// Helper function to format date (same as in EventsPage)
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
}

// Loader function to get the event data based on the slug
// This function runs on the server (if SSR) or client-side before rendering.
export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  const event = allEvents.find(e => e.slug === slug);

  if (!event) {
    // If event not found, throw a 404 response.
    // This will be caught by your ErrorBoundary in root.tsx.
    throw new Response("Event Not Found", { status: 404 });
  }
  return event; // Return the event data
};

// Meta function for setting page title and description
export const meta: MetaFunction = ({ data }) => {
  const event = data as Event; // Type assertion for loaded data
  if (!event) {
    return [
        { title: "Event Not Found | Design & Code Memphis" },
        { name: "description", content: "The event you are looking for could not be found." }
    ];
  }
  return [
    { title: `${event.title} | Design & Code Memphis` },
    { name: "description", content: event.summary },
  ];
};


export default function EventDetailPage() {
  const event = useLoaderData() as Event; // Get data from the loader

  if (!event) {
    // This case should ideally be handled by the loader throwing a 404,
    // but as a fallback or if loader isn't used in certain setups:
    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold">Event Not Found</h1>
            <p>The event you are looking for does not exist.</p>
            <Link to="/events" className="text-blue-600 hover:underline mt-4 inline-block">
                Back to Events
            </Link>
        </div>
    );
  }

  // Check if the event has passed
  const isEventPast = new Date(event.date + 'T00:00:00') < new Date();

  // Helper to find speaker details for an agenda item
  const getSpeakerForAgenda = (speakerKey?: string) => {
    if (!speakerKey) return null;
    return event.description.speakers.find(s => s.key === speakerKey);
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"> {/* Max width for readability */}
        {/* Back to Events Link */}
        <div className="mb-6">
            <Link to="/events" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
                Back to All Events
            </Link>
        </div>

        {/* Event Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-3">{event.title}</h1>
          <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-400 gap-x-4 gap-y-1 mb-2">
            <span><strong>Date:</strong> {formatDate(event.date)}</span>
            <span><strong>Time:</strong> {event.time.full}</span>
            <span><strong>Location:</strong> {event.location.name}</span>
          </div>
          {/* Topics as Chips */}
          {event.topics && event.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                  {event.topics.map((topic, index) => (
                      <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                      >
                          {topic}
                      </span>
                  ))}
              </div>
          )}
        </header>

        {/* Main Event Content Sections */}
        <div className="space-y-8">
          {/* Who is this for? */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Who Is This For?</h2>
            <p className="leading-relaxed whitespace-pre-line">{event.description.whoIsThisFor}</p>
          </section>

          {/* Agenda */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Agenda</h2>
            <ul className="space-y-6">
              {event.description.agenda.sort((a,b) => a.order - b.order).map((item) => {
                const speaker = getSpeakerForAgenda(item.speakerKey);
                return (
                  <li key={item.order} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-1">{item.activity}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">({item.durationMinutes} minutes)</p>
                    {speaker && item.type === 'talk' && (
                        <div className="mb-2 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                            <p className="text-md font-medium text-gray-700 dark:text-gray-300">Speaker: {speaker.name}</p>
                            {/* <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{speaker.talkTitle}"</p> */}
                        </div>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{item.details}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Speakers (Optional: if you want a separate speaker bio section) */}
          {event.description.speakers && event.description.speakers.length > 0 && (
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Speakers</h2>
                <div className="space-y-6">
                    {event.description.speakers.map(speaker => (
                        <div key={speaker.key} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300">{speaker.name}</h3>
                            <p className="text-md italic text-gray-600 dark:text-gray-400 mb-2">"{speaker.talkTitle}"</p>
                            {/* Add more bio, links here if available in your JSON */}
                            {/* <p className="text-sm">{speaker.bio}</p> */}
                        </div>
                    ))}
                </div>
            </section>
          )}


          {/* RSVP Information - Only show for upcoming events */}
          {!isEventPast && (
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">RSVP</h2>
              <p className="leading-relaxed mb-3">{event.description.rsvp.details}</p>
              {event.description.rsvp.link && (
                <a
                  href={event.description.rsvp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                >
                  RSVP via {event.description.rsvp.platform}
                </a>
              )}
            </section>
          )}

          {/* Sponsors */}
          {event.description.sponsors && event.description.sponsors.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Our Sponsors</h2>
              <ul className="list-disc list-inside space-y-1">
                {event.description.sponsors.map((sponsor, index) => (
                  <li key={index} className="leading-relaxed">
                    <strong>{sponsor.name}</strong> - {sponsor.contribution}.
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Parking Info */}
          {event.description.parkingInfo && (
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Parking Information</h2>
              <p className="leading-relaxed">{event.description.parkingInfo}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
