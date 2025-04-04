export default function AdminPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
        <p>This is a test page to check if routing works.</p>
        <a 
          href="/admin/login" 
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
} 