import { useEffect, useState } from 'react';
import { getCurrentUser } from '../lib/supabaseClient';

export default function UserDebugPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { user, error } = await getCurrentUser();
    console.log('User check:', { user, error });
    setUser(user);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 User Debug Info</h1>
      
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ User Logged In</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">User ID:</span> 
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">{user.id}</code>
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at).toLocaleString()}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <details>
              <summary className="cursor-pointer font-medium">Full User Object</summary>
              <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </details>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">❌ No User Logged In</h2>
          <p className="text-red-700">Please sign in to create posts.</p>
          <a href="/signin" className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Sign In
          </a>
        </div>
      )}
    </div>
  );
}
