import type { Route } from "./+types/events";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Upcoming Events | Desing and Code Memphis" },
        { name: "description", content: "Join us for our upcoming events, workshops, and meetups in Memphis. Stay updated with the latest happenings in the design and development community." },
    ];
}

export default function EventsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
            <p>This is where the events calendar will be displayed.</p>
            {/* Placeholder for events list/calendar */}
            <div className="mt-6 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold">Event Title Example</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: May 15, 2025</p>
                <p className="mt-2">Details about the event will go here. Speaker information, topic, and RSVP links.</p>
            </div>
        </div>
    )
}