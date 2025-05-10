// app/routes/events.tsx
import { Link } from "react-router-dom"; // For "Read More" links

// Import the event data directly from the JSON file
// Vite will handle the import and make the data available.
import eventsDataMay2025 from "~/../app/events/may-2025.json"; // Adjusted path to be relative to project root or app

// Define TypeScript interfaces for our event data structure
// This should match the structure of your may-2025.json
interface EventTime {
  start: string;
  end: string;
  full: string;
}

interface EventLocation {
  name: string;
  address?: string | null; // Optional address
}

interface Speaker {
  key: string;
  name: string;
  talkTitle: string;
  // You could add bio, image, etc. here in the future
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
  link?: string | null; // Optional link
}

interface Sponsor {
  name: string;
  contribution: string;
}

interface EventDescription {
  whoIsThisFor: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  rsvp: RsvpInfo;
  sponsors: Sponsor[];
  parkingInfo: string;
}

export interface Event { // Exporting Event interface for potential use elsewhere
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: EventTime;
  location: EventLocation;
  summary: string;
  description: EventDescription;
  topics: string[];
}

// Assuming your JSON file directly contains an array of Event objects
const allEvents: Event[] = [...eventsDataMay2025]; // Combine future month data here if needed

// Helper function to format date (optional, but nice for display)
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options); // Add T00:00:00 to avoid timezone issues if date is just YYYY-MM-DD
}

export function meta() { // Removed args: Route.MetaArgs as it might not be set up yet
    return [
        { title: "Upcoming Events | Design & Code Memphis" }, // Corrected typo "Desing"
        { name: "description", content: "Join us for our upcoming events, workshops, and meetups in Memphis. Stay updated with the latest happenings in the design and development community." },
    ];
}

export default function EventsPage() {
    // For now, we are directly using imported data.
    // If you were fetching from an API, you'd use useState and useEffect here.
    const upcomingEvents = allEvents
        .filter(event => new Date(event.date) >= new Date()) // Filter for upcoming or current events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

    const pastEvents = allEvents
        .filter(event => new Date(event.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-blue-600 dark:text-blue-400">
                    Our Events
                </h1>

                {upcomingEvents.length > 0 && (
                    <section className="mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Upcoming Events</h2>
                        <div className="grid gap-6 md:gap-8 lg:grid-cols-1"> {/* Changed to 1 column for more focus per event */}
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {pastEvents.length > 0 && (
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Past Events</h2>
                        <div className="grid gap-6 md:gap-8 lg:grid-cols-1"> {/* Changed to 1 column */}
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} isPastEvent={true} />
                            ))}
                        </div>
                    </section>
                )}

                {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                    <p className="text-center text-gray-600 dark:text-gray-400 text-xl">
                        No events scheduled at the moment. Check back soon!
                    </p>
                )}
            </div>
        </div>
    );
}

// EventCard component to display individual event information
interface EventCardProps {
    event: Event;
    isPastEvent?: boolean;
}

function EventCard({ event, isPastEvent = false }: EventCardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${isPastEvent ? 'opacity-75' : ''}`}>
            <div className="p-6 md:p-8">
                <div className="md:flex md:items-start md:justify-between mb-3">
                    <div>
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                            {event.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <span className="font-semibold">Date:</span> {formatDate(event.date)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <span className="font-semibold">Time:</span> {event.time.full}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span className="font-semibold">Location:</span> {event.location.name}
                        </p>
                    </div>
                    {!isPastEvent && event.description.rsvp.link && (
                         <a
                            href={event.description.rsvp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 md:mt-0 md:ml-4 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out whitespace-nowrap"
                        >
                            RSVP Now
                        </a>
                    )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {event.summary}
                </p>

                {/* Topics as Chips */}
                {event.topics && event.topics.length > 0 && (
                    <div className="mb-5">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                            {event.topics.map((topic, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Placeholder for "Read More" - this could link to a dynamic route like /events/[event.slug] */}
                <Link
                    to={`/events/${event.slug}`} // Assuming you'll set up routes for individual event details
                    className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-semibold hover:underline transition duration-150 ease-in-out"
                >
                    Read More & See Full Agenda &rarr;
                </Link>
            </div>
        </div>
    );
}
