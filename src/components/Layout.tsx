import { Outlet, useNavigate } from 'react-router-dom';
import type { User } from '../types';

export default function Layout() {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navbar แบบ Minimal */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold tracking-wider cursor-pointer" onClick={() => navigate('/')}>
          MINI<span className="text-gray-400">STORE</span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
              Role: {user?.profile?.role}
            </span>
            <span className="text-gray-600">Hi, {user.username}</span>
            <button 
              onClick={handleLogout}
              className="border border-black px-4 py-1.5 rounded hover:bg-black hover:text-white transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="hover:underline">Login</button>
            <button onClick={() => navigate('/register')} className="bg-black text-white px-4 py-1.5 rounded">Register</button>
          </div>
        )}
      </nav>

      {/* พื้นที่สำหรับแสดงเนื้อหาของแต่ละหน้า */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}