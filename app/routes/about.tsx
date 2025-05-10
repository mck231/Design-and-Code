// app/routes/about.tsx
import type { Route } from "./+types/about"; // Adjust if not using generated types or if path differs

export function meta({}: Route.MetaArgs) { // Adjust Route.MetaArgs if needed
  return [
    { title: "About Us | Design & Code Memphis" },
    { name: "description", content: "Learn about Design & Code Memphis: our mission, community, and how we're working to elevate the local tech scene." },
  ];
}

export default function AboutUsPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-blue-600 dark:text-blue-400">
          About Design & Code Memphis
        </h1>

        {/* Section 1: Summary with Image */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-12 md:mb-16">
          {/* Text Content (Left) */}
          <div className="md:w-1/2 md:pr-8 lg:pr-12 text-lg">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
              Sparking Tech Innovation in Memphis
            </h2>
            <p className="mb-4">
              At Design & Code Memphis, we're passionate about being the change we want to see in our local tech scene.
              We believe Memphis is brimming with talent, and our mission is to provide a vibrant hub where this talent
              can connect, learn, and flourish.
            </p>
            <p className="mb-4">
              We're building more than just a meetup; we're cultivating a community. A place where designers, developers,
              entrepreneurs, and tech enthusiasts from all backgrounds and experience levels can come together to share
              ideas, showcase their work, and inspire one another.
            </p>
          </div>

          {/* Image (Right) */}
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-4 lg:pl-6">
            {/* Placeholder for your meetup image */}
            {/* Replace this div with your <img> tag */}
            {/* Example: <img src="/path/to/your/meetup-image.jpg" alt="Design & Code Memphis Meetup" className="rounded-lg shadow-xl w-full h-auto object-cover" style={{maxHeight: '400px'}} /> */}
            <img src="family.jpeg" alt="Design & Code Memphis Meetup" className="rounded-lg shadow-xl w-full h-auto object-cover" style={{maxHeight: '400px'}} /> 
            <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
              A glimpse from one of our engaging sessions!
            </p>
          </div>
        </div>

        {/* Section 2: More Detailed Text */}
        <div className="text-lg">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Fostering a Creative & Inclusive Tech Community
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <p>
              Since our inception, we've been thrilled by the enthusiasm and engagement from the Memphis tech community.
              We've already hosted several successful talks, workshops, and networking events, covering everything from
              cutting-edge UI/UX design principles and full-stack development workflows to inspiring tech journeys and
              the art of design/dev collaboration. And this is just the beginning!
            </p>
            <p>
              Our core philosophy is simple: <strong className="text-blue-600 dark:text-blue-400">to foster a creative, inclusive space where design meets
              development—and ideas turn into action.</strong> We welcome everyone, from seasoned professionals to students
              just starting out, to share their unique perspectives and learn from one another.
            </p>
            <p>
              We're committed to showcasing a diverse range of topics and speakers. Whether it's deep dives into software
              architecture, explorations of user research, tales of startup life, or discussions on emerging trends like AI
              in the creative fields, there's something for everyone at Design & Code.
            </p>
            <p>
              Join us as we continue to build a stronger, more connected, and innovative technology ecosystem right here in Memphis.
              Let's learn, build, and grow together!
            </p>
          </div>
        </div>

        {/* Optional: Call to Action or Link to Events */}
        <div className="text-center mt-12 md:mt-16">
          <a
            href="/events" // Or use Link from react-router-dom if this component is within your Router context
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            Check Out Our Upcoming Events
          </a>
        </div>

      </div>
    </div>
  );
}
