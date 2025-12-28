import { Link } from "react-router";
import { supabase } from "../utils/supabase";
import type { Route } from "./+types/blog.home";

interface Profile {
  display_name: string;
}

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  profiles: Profile | Profile[];
}

interface LoaderData {
  posts: PostSummary[] | null;
}

export async function loader(): Promise<LoaderData> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, published_at,
      profiles ( display_name )
    `)
    .eq('status', 'published') // Only show published posts
    .order('published_at', { ascending: false });

  if (error) throw new Error("Failed to fetch posts");
  return { posts: data as PostSummary[] };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog & Resources | Design & Code Memphis" },
    { name: "description", content: "Read our latest blog posts and find helpful resources." },
  ];
}

export default function BlogHome({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData as unknown as LoaderData;

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
            {posts?.map((post) => (
              <BlogCard 
                key={post.id}
                title={post.title}
                date={new Date(post.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                excerpt={post.excerpt}
                author={Array.isArray(post.profiles) ? post.profiles[0]?.display_name : post.profiles?.display_name || "Community Member"}
                slug={post.slug}
              />
            ))}
            {posts?.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No posts published yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

interface BlogCardProps {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  slug: string;
}

function BlogCard({ title, date, excerpt, author, slug }: BlogCardProps) {
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
          <Link 
            to={`/blog/${slug}`}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out cursor-pointer"
          >
            Read More &rarr;
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            By {author}
          </span>
        </div>
      </div>
    </div>
  );
}
