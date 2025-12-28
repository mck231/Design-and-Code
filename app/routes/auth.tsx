import { useState } from "react";
import { supabase } from "../utils/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // New State for confirmation
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // --- NEW VALIDATION: Check Passwords ---
    if (isSignUp && password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match!" });
      setLoading(false);
      return; // Stop execution here
    }

    try {
      if (isSignUp) {
        // --- SIGN UP ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName, 
              avatar_url: `https://api.dicebear.com/9.x/dylan/svg?seed=${displayName}`
            },
          },
        });

        if (error) throw error;
        
        if (data.user && !data.session) {
           setMessage({ type: 'success', text: "Account created! Check your email to confirm." });
        } else {
           navigate("/blog");
        }

      } else {
        // --- LOG IN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/blog");
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          {isSignUp ? "Join the Community" : "Welcome Back"}
        </h1>

        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${
            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Display Name (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Display Name</label>
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                required 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6} 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={6} 
                placeholder="Re-type password"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Log In")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => {
                setIsSignUp(!isSignUp); 
                setMessage(null); 
                setConfirmPassword(""); // Reset confirm field on toggle
            }} 
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
            <Link to="/blog" className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-400">← Back to Blog</Link>
        </div>
      </div>
    </div>
  );
}