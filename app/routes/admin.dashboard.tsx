import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch Pending Posts
  useEffect(() => {
    const fetchPending = async () => {
      if (!isSupabaseConfigured) return;

      // Security Check: Ideally done with RLS, but UI check helps too
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data } = await supabase
        .from('posts')
        .select('*, profiles(display_name)')
        .eq('status', 'pending');
        
      if (data) setPosts(data);
    };
    fetchPending();
  }, [navigate]);

  // Actions
  const handleDecision = async (id: string, status: 'published' | 'rejected') => {
    const { error } = await supabase
        .from('posts')
        .update({ status, published_at: new Date() })
        .eq('id', id);

    if (!error) {
        // Remove from list locally
        setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {!isSupabaseConfigured && (
        <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-2">Supabase Connection Required</h2>
          <p className="text-amber-700 dark:text-amber-300">
            The Admin Dashboard requires a valid Supabase configuration. Please set your environment variables to manage posts.
          </p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-500">Pending Review ({posts.length})</h2>

      <div className="space-y-4">
        {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded shadow flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-500">
                        By {post.profiles?.display_name} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2 text-blue-500 text-sm">
                        <Link target="_blank" to={`/blog/${post.slug}`}>
                            Preview Post (New Tab)
                        </Link>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleDecision(post.id, 'rejected')}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                        Reject
                    </button>
                    <button 
                        onClick={() => handleDecision(post.id, 'published')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Approve
                    </button>
                </div>
            </div>
        ))}
        {posts.length === 0 && <p>No pending posts. Good job!</p>}
      </div>
    </div>
  );
}
