import type { Route } from "./+types/blog"; // Adjust if not using generated types

export function meta({}: Route.MetaArgs) { // Adjust Route.MetaArgs if needed
  return [
    { title: "Blog & Resources | Design & Code Memphis" },
    { name: "description", content: "Read our latest blog posts and find helpful resources." },
  ];
}

// We can change or add to this interface as we decide which each Blog Card should display
interface BlogCardProps {
  title: string;
  date: string;
  excerpt: string;
}

export default function BlogPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16 text-blue-600 dark:text-blue-400">
          Blog & Resources
        </h1>
        <p className="mb-6 font-semibold text-gray-800 dark:text-gray-200 text-2xl">
          Welcome to our blog and resources section! Here you will find event recaps, speaker spotlights, and useful links.
        </p>
        
        <section className="mb-12 md:mb-16">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-1">
            {/* Iterable will go here to display list of blog posts */}
            <BlogCard title="Leveraging Animations" date="December 10, 2025" excerpt="This is a third brief excerpt of a sample blog post..."/>
            <BlogCard title="The Power of SVGs" date="June 7, 2025" excerpt="This is a second brief excerpt of a sample blog post..."/>
            <BlogCard title="Welcome to Design & Code Memphis" date="May 10, 2025" excerpt="This is a one brief excerpt of a sample blog post..."/>
          </div>
        </section>
      </div>
    </div>
  );
}

function BlogCard({title, date, excerpt}: BlogCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl transition-all duration-300 hover:shadow-2xl relative">
      <div className="p-6 md:p-8">
        <div className="md:flex md:items-start md:justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Published on: {date}
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {excerpt}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
          <a href="#"  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out cursor-pointer">
            Read More &rarr;
          </a>
          {/* Share button could go here. We would need a new ShareButtons component compatible with blog posts. */ }
        </div>
      </div>
    </div>
  )
}