import type { Route } from "./+types/blog"; // Adjust if not using generated types

export function meta({}: Route.MetaArgs) { // Adjust Route.MetaArgs if needed
  return [
    { title: "Blog & Resources | Design & Code Memphis" },
    { name: "description", content: "Read our latest blog posts and find helpful resources." },
  ];
}

export default function BlogPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog & Resources</h1>
      <p>Welcome to our blog and resources section. Here you'll find event recaps, speaker spotlights, and useful links.</p>
      {/* Placeholder for blog posts list */}
      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">Sample Blog Post Title</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Published on: May 10, 2025</p>
        <p className="mt-2">This is a brief excerpt of a sample blog post...</p>
        <a href="#" className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
      </div>
    </div>
  );
}