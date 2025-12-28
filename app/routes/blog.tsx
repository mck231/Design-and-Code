import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { supabase } from "../utils/supabase";

export default function BlogLayout() {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  // 1. Check Auth State
  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // No need to redirect manually, state update will re-render the menu
  };

  // Helper for active link styling
  const isActive = (path: string) => location.pathname === path 
    ? "text-blue-600 dark:text-blue-400 font-bold" 
    : "text-gray-600 dark:text-gray-400 hover:text-blue-500";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      
      {/* --- BLOG MINI-MENU BAR --- */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          
          {/* Brand / Home Link */}
          <Link to="/blog" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs uppercase tracking-wide">Blog</span>
            <span>Design & Code</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/blog" className={isActive("/blog")}>
              All Posts
            </Link>

            {/* LOGGED IN LINKS */}
            {user ? (
              <>
                <Link to="/blog/create" className={isActive("/blog/create")}>
                  Write Post
                </Link>
                
                {/* Admin Dashboard (Red for Dev/Admin visibility) */}
                {import.meta.env.DEV && (
                  <Link to="/blog/admin/dashboard" className="text-red-500 hover:text-red-700 border border-red-200 px-2 py-0.5 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    Dashboard
                  </Link>
                )}

                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  Sign Out
                </button>
                
                {/* Optional: Tiny Avatar */}
                {user.user_metadata?.avatar_url && (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-6 h-6 rounded-full border border-gray-200" />
                )}
              </>
            ) : (
              /* LOGGED OUT LINKS */
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
              >
                Log In
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}