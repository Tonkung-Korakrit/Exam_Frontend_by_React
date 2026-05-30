// src/pages/Auth/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../types';
import { api } from '../../utils/api'

interface LoginTokens {
  access: string;
  refresh: string;
}

export default function Login() {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const tokens = await api.post<typeof formData, LoginTokens>('/auth/login/', formData);
      
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);

      // Step 3: ยิง API อีกครั้งเพื่อไปเอาข้อมูล User (username, role)
      const userData = await api.get<User>('/auth/profile/');
      
      const mappedUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        profile: {
          role: userData.profile?.role || 'BUYER'
        }
      };

      // Step 4: เซฟข้อมูล User ลง localStorage แล้วไปหน้าแรก
      localStorage.setItem('user', JSON.stringify(mappedUser));

      if (mappedUser.profile.role === 'SELLER') window.location.href = '/seller';
      else window.location.href = '/buyer';

      // navigate('/');
      
      // แอบกระซิบ: เราต้องใช้ window.location.href เพราะเราใช้ localStorage ใน App.tsx 
      // การใช้ navigate ธรรมดา App.tsx อาจจะยังไม่อ่านค่าใหม่ทันที
      // window.location.href = '/'; 

    } catch (error: unknown) {
      console.error('Login failed:', error);
      setErrorMsg('เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่าน');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-sm w-96 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-gray-500 mt-2 text-sm">Please enter your details to sign in.</p>
        </div>
        
        {/* แสดงข้อความ Error */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}
        
        <input 
          className="w-full border-b border-gray-300 py-2 mb-6 focus:outline-none focus:border-black transition" 
          type="text" 
          placeholder="Username" 
          onChange={e => setFormData({...formData, username: e.target.value})} 
          required 
        />
          
        <input 
          className="w-full border-b border-gray-300 py-2 mb-8 focus:outline-none focus:border-black transition" 
          type="password" 
          placeholder="Password" 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required 
        />
        
        <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium">
          Sign In
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-black font-medium hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}