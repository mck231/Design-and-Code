import { Link } from "react-router";
import { supabase } from "../utils/supabase";
import type { Route } from "./+types/blog.$slug";

interface Profile {
  display_name: string;
  avatar_url?: string;
  bio?: string;
  custom_css?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  profiles: Profile;
}

interface LoaderData {
  post: Post;
}

// 1. THE LOADER: Fetches real data from Supabase
export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url,
        bio,
        custom_css 
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (error || !data) {
    throw new Response("Post Not Found", { status: 404 });
  }

  return { post: data };
}

// 2. META: Uses the fetched data for SEO
export function meta({ data }: Route.MetaArgs) {
  const loaderData = data as unknown as LoaderData;
  if (!loaderData || !loaderData.post) return [{ title: "Post Not Found" }];
  
  return [
    { title: `${loaderData.post.title} | Design & Code Memphis` },
    { name: "description", content: loaderData.post.excerpt || "Read this article from our community." },
  ];
}

// 3. THE COMPONENT: Renders the post
export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData as unknown as LoaderData;
  const author = post.profiles;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Inject Author's "Wild West" CSS if it exists */}
      {author?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: author.custom_css }} />
      )}

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wide">
            {new Date(post.published_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
             {author?.avatar_url && (
                <img src={author.avatar_url} alt={author.display_name} className="w-10 h-10 rounded-full" />
             )}
             <div className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">
                  {author?.display_name || "Community Member"}
                </span>
                <p className="text-xs">{author?.bio}</p>
             </div>
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-gray-900 dark:prose-headings:text-gray-100
            prose-p:text-gray-700 dark:prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link 
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to All Posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
