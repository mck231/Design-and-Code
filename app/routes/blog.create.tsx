import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import Editor from "../components/Editor";

// Helper function to generate slug from title and username
function generateSlug(title: string, username: string): string {
  const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const timestamp = Date.now().toString().slice(-6);
  return `${cleanUsername}-${baseSlug}-${timestamp}`;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [css, setCss] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to scope CSS to the preview container
  const getScopedCSS = (customCss: string) => {
    if (!customCss.trim()) return "";
    
    // Track if we're inside an at-rule block (like @keyframes, @media, etc.)
    let insideAtRule = false;
    let braceDepth = 0;
    
    const lines = customCss.split('\n');
    const scopedLines = lines.map(line => {
      const trimmed = line.trim();
      
      // Check if this line starts an at-rule
      if (trimmed.startsWith('@') && trimmed.includes('{')) {
        insideAtRule = true;
        braceDepth = 1;
        return line;
      }
      
      // Track brace depth when inside at-rule
      if (insideAtRule) {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        
        // Exit at-rule when braces balance out
        if (braceDepth === 0) {
          insideAtRule = false;
        }
        return line;
      }
      
      // Skip empty lines and lines that are just closing braces
      if (!trimmed || trimmed === '}') return line;
      
      // If line contains opening brace, it's a selector - prefix it
      if (trimmed.includes('{')) {
        const parts = trimmed.split('{');
        const selector = parts[0].trim();
        // Don't re-scope if already scoped
        if (selector.startsWith('.blog-post-preview')) return line;
        return `.blog-post-preview ${selector} {${parts.slice(1).join('{')}`;
      }
      
      return line;
    });
    return scopedLines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("You must be logged in!");
      setIsSubmitting(false);
      return;
    }

    // 2. Get user's display name for slug
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();
    
    const displayName = profile?.display_name || user.email?.split('@')[0] || 'user';
    // 5. Save Post
    // 3. Auto-generate slug from title + username
    const slug = generateSlug(title, displayName);

    // 4. Save Custom CSS to Profile (Optional: update every time or just once)
    if (css) {
        await supabase.from('profiles').update({ custom_css: css }).eq('id', user.id);
    }

    // 4. Save Post
    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      content: htmlContent,
      content_json: JSON.parse(jsonContent || "{}"),
      author_id: user.id,
      status: 'pending' // Enforce workflow
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Post submitted for review!");
      navigate("/blog");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Write a New Post</h1>

      {/* Scoped Custom CSS Preview */}
      {css && <style>{getScopedCSS(css)}</style>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700" 
                value={title} onChange={e => setTitle(e.target.value)} required 
                placeholder="My Awesome Post Title"
            />
            <p className="text-xs text-gray-500 mt-1">URL slug will be auto-generated from your title</p>
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">
                Custom CSS (scoped to content preview)
            </label>
            <textarea 
                className="w-full h-32 p-3 font-mono text-sm bg-gray-900 text-green-400 rounded border-2 border-gray-600 dark:border-gray-500 focus:border-green-500 focus:outline-none"
                value={css}
                onChange={e => setCss(e.target.value)}
                placeholder="h1 { color: blue; }"
            />
            <p className="text-xs text-gray-500 mt-1">CSS will only affect your blog post content below</p>
        </div>

        <div className="blog-post-preview">
            <label className="block text-sm font-medium mb-1">Content</label>
            <Editor onChange={(html, json) => {
                setHtmlContent(html);
                setJsonContent(json);
            }} />
        </div>

        <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 font-bold"
        >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
