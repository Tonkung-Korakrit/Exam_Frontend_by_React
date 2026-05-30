// src/pages/Auth/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import { api } from '../../utils/api';

interface RegisterForm extends User {
  password?: string; 
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({ 
    id: 0,
    username: '', 
    password: '', 
    email: '', 
    profile: { role: 'BUYER' }
  });
  
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await api.post<RegisterForm, User>('/register/', formData);
      
      console.log('Registration Successful:', response);
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      
      // เมื่อสมัครเสร็จ ไปที่หน้า Login
      navigate('/login');
      
    } catch (error: unknown) {
      
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('เกิดข้อผิดพลาดในการสมัครสมาชิก (Unknown Error)');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        {/* แสดงข้อความ Error ถ้ามี */}
        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm text-center">
            {errorMsg}
          </div>
        )}
        
        <input className="w-full border p-2 mb-4 rounded" type="text" name="username" placeholder="Username" 
          onChange={handleChange} required />
          
        <input className="w-full border p-2 mb-4 rounded" type="email" name="email" placeholder="Email" 
          onChange={handleChange} required />
          
        <input className="w-full border p-2 mb-4 rounded" type="password" name="password" placeholder="Password" 
          onChange={handleChange} required />
          
        <select className="w-full border p-2 mb-6 rounded bg-white" name="role" onChange={handleChange}>
          <option value="BUYER">Buyer (ผู้ซื้อ)</option>
          <option value="SELLER">Seller (ผู้ขาย)</option>
        </select>
        
        <button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}