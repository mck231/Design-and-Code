import { type MetaFunction } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Guide | Design & Code Memphis" },
    { name: "robots", content: "noindex, nofollow" }, // Prevents search engines from indexing this page
  ];
};

// A simple component for styling code blocks
function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

export default function AdminGuidePage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-blue-600 dark:text-blue-400">
          Admin & Content Guide
        </h1>

        <div className="space-y-12">
          {/* Section: Adding a Speaker to Hall of Fame */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Adding a Speaker to the Duck Hall of Fame
            </h2>
            <div className="space-y-4 text-lg">
              <p>Follow these steps to add a new speaker to the Hall of Fame page.</p>
              <ol className="list-decimal list-inside space-y-3 pl-4">
                <li>
                  <strong>Prepare the Speaker's Photo:</strong> Obtain a square-aspect-ratio photo of the speaker.
                </li>
                <li>
                  <strong>Name and Place the Photo:</strong>
                  <ul className="list-disc list-inside mt-2 pl-6 space-y-2">
                    <li>The required naming convention is <strong>`FirstName.jpeg`</strong> (e.g., `Jane.jpeg`).</li>
                    <li>Place the named photo into the <strong>`public/speaker-pictures/`</strong> folder.</li>
                  </ul>
                </li>
                <li>
                  <strong>Update the Speakers List:</strong>
                  <p className="mt-2">Open the file: <strong>`app/routes/duck-hall-of-fame.tsx`</strong>.</p>
                  <p className="mt-2">Find the `speakers` array and add a new object for the new speaker. Ensure the `id` is unique and the `photo` path is correct.</p>
                  <CodeBlock>
                    {`const speakers = [
  // ... existing speakers
  { 
    id: 7, // Increment the ID
    name: "Jane Doe", 
    talkTitle: "The Future of AI in Design",
    event: "August 2025",
    photo: "/speaker-pictures/Jane.jpeg" // Match the filename
  },
];`}
                  </CodeBlock>
                </li>
              </ol>
            </div>
          </section>

          {/* Section: Adding an Event */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Adding a New Event
            </h2>
            <div className="space-y-4 text-lg">
              <p>Events are managed by adding JSON files. The website automatically reads them and creates the event listings.</p>
              <ol className="list-decimal list-inside space-y-3 pl-4">
                <li>
                  <strong>Create a New Event File:</strong>
                  <ul className="list-disc list-inside mt-2 pl-6 space-y-2">
                    <li>In the <strong>`app/events/`</strong> directory, create a new JSON file.</li>
                    <li>The naming convention is <strong>`month-year.json`</strong> (e.g., `september-2025.json`).</li>
                  </ul>
                </li>
                <li>
                  <strong>Fill Out Event Details:</strong>
                  <p className="mt-2">Copy the structure from a previous event file and update the details. Below is a complete template with explanations.</p>
                  <CodeBlock>
                    {`[
  {
    "id": "dc-YYYYMMDD-event-short-name",
    "slug": "event-short-name-month-year",
    "title": "Full Event Title Here",
    "date": "YYYY-MM-DD",
    "time": {
      "start": "6:00 PM",
      "end": "8:00 PM",
      "full": "6:00 PM - 8:00 PM"
    },
    "location": {
      "name": "Venue Name",
      "address": null
    },
    "summary": "A short, one-paragraph summary for the event listing page.",
    "description": {
      "whoIsThisFor": "Describe the target audience for this event.",
      "agenda": [
        {
          "order": 1,
          "type": "networking",
          "activity": "Activity Name (e.g., Mix & Mingle)",
          "durationMinutes": 30,
          "details": "Details about this agenda item."
        },
        {
          "order": 2,
          "type": "talk",
          "speakerKey": "speakerUniqueKey",
          "activity": "Keynote: Speaker Name",
          "durationMinutes": 60,
          "details": "Talk title and description."
        }
      ],
      "speakers": [
        {
          "key": "speakerUniqueKey",
          "name": "Speaker Name",
          "talkTitle": "Title of Their Talk"
        }
      ],
      "rsvp": {
        "platform": "Meetup",
        "details": "RSVP details here.",
        "link": "https://meetup.com/your-event-link"
      },
      "sponsors": [
        {
          "name": "Sponsor Name",
          "contribution": "what they provided (e.g., food, venue)"
        }
      ],
      "parkingInfo": "Details about parking."
    },
    "topics": [
      "Topic 1",
      "Topic 2",
      "Events in Memphis, TN"
    ]
  }
]`}
                  </CodeBlock>
                </li>
              </ol>
            </div>
          </section>

          {/* Section: Website Structure Overview */}
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Quick Website Overview
            </h2>
            <div className="space-y-3 text-lg">
              <p>Here are the key folders for managing content:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>`app/routes/`</strong>: Contains the main files for each page (e.g., `about.tsx`, `events.tsx`).</li>
                <li><strong>`app/components/`</strong>: Contains reusable parts of the website, like the `Header.tsx` and `Footer.tsx`.</li>
                <li><strong>`app/events/`</strong>: Holds the JSON data files for all events.</li>
                <li><strong>`public/`</strong>: For static assets that don't need to be processed, like speaker images and logos.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
