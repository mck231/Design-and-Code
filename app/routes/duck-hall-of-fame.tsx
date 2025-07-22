// app/routes/duck-hall-of-fame.tsx
import { Link } from "react-router-dom";
import { type MetaFunction } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Duck Hall of Fame | Design & Code Memphis" },
    { name: "description", content: "Meet our speakers and their rubber duck companions in the Duck Hall of Fame!" },
  ];
};

// Real speaker data from our events - organized chronologically
const speakers = [
  { 
    id: 1, 
    name: "Tasneem Wakil", 
    talkTitle: "Learning to Make Mistakes",
    event: "April 2025",
    photo: "/speaker-pictures/Tasneem.jpeg"
  },
  { 
    id: 2, 
    name: "Andre Brumfield", 
    talkTitle: "Taking Initiative: Web Automation & Networking Through Projects",
    event: "May 2025",
    photo: "/speaker-pictures/Andrew.jpeg"
  },
  { 
    id: 3, 
    name: "John Fleenor", 
    talkTitle: "Design Systems in UX: Structure, Benefits, and Real-World Impact",
    event: "May 2025",
    photo: "/speaker-pictures/JohnF.jpeg"
  },
  { 
    id: 4, 
    name: "Lawrence Lockhart", 
    talkTitle: "Control Freaks Don't Scale: How to Score Wins in UI Creation with Shared Workflows",
    event: "June 2025",
    photo: "/speaker-pictures/Lawrence.jpeg"
  },
];

export default function DuckHallOfFamePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
       

        {/* Page Header */}
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            🦆 Duck Hall of Fame 🦆
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Meet our amazing speakers and their rubber duck companions! Every great developer needs a duck to help debug their code.
          </p>
        </header>

        {/* Speaker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              Want to Join the Hall of Fame?
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mb-6">
              Speak at one of our events and get your rubber duck featured here! Every speaker gets a special place in our Duck Hall of Fame.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:memphisdesignandcode@gmail.com?subject=I%20would%20like%20to%20present&body=Please%20insert%20the%20topic%20you'd%20like%20to%20present%20on.%20Also%20some%20projects%20or%20github%20links%20to%20your%20work."
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
              >
                Speak at an Event
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Speaker Card Component
interface SpeakerCardProps {
  speaker: {
    id: number;
    name: string;
    talkTitle: string;
    event: string;
    photo: string;
  };
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      {/* Speaker photo */}
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={speaker.photo} 
          alt={`${speaker.name} with their rubber duck`}
          className="w-full h-full object-cover"
        />
        {/* Cute little badge */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          🦆 Hall of Fame
        </div>
      </div>

      {/* Speaker Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {speaker.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          "{speaker.talkTitle}"
        </p>
        <p className="text-blue-600 dark:text-blue-400 text-xs mb-3 font-medium">
          {speaker.event}
        </p>
        
      </div>
    </div>
  );
}
