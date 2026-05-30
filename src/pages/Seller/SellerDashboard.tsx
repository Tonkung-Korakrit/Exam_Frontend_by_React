// src/pages/Seller/SellerDashboard.tsx
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import type { Product } from '../../types';

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   unit_price: number;
//   available_quantity: number;
//   image?: string; 
// }

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unit_price: '',
    available_quantity: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // ใช้เก็บ ID สินค้าที่กำลังแก้ไขอยู่ (ถ้าเป็น null แปลว่ากำลังเพิ่มสินค้าใหม่)
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const data = await api.get<Product[]>('/products/me/');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchMyProducts();
  }, [refreshTrigger]);

  // จัดการฟอร์ม (ทั้งเพิ่มและแก้ไข)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('unit_price', String(formData.unit_price));
    submitData.append('available_quantity', String(formData.available_quantity));
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    // แปลงตัวเลขจาก String เป็น Number ก่อนส่งให้ Backend
    // const payload = {
    //   ...formData,
    //   unit_price: Number(formData.unit_price),
    //   available_quantity: Number(formData.available_quantity)
    // };

    try {
      if (editingId) {
        // อัปเดตสินค้า (PUT)
        await api.put(`/products/${editingId}/`, submitData);
        alert('อัปเดตสินค้าสำเร็จ!');
      } else {
        // สร้างสินค้าใหม่ (POST)
        await api.post('/products/', submitData);
        alert('เพิ่มสินค้าสำเร็จ!');
      }
      
      // รีเซ็ตฟอร์มและดึงข้อมูลใหม่
      resetForm();
      setImageFile(null); 
      setRefreshTrigger(prev => prev + 1);

    } catch (error) {
      console.error('Failed to save product:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // ลบสินค้า
  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) return;
    try {
      await api.delete(`/products/${id}/`);
      setProducts(products.filter(p => p.id !== id)); // ลบออกจากหน้าจอโดยไม่ต้องยิง API ซ้ำ
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('ลบสินค้าไม่สำเร็จ');
    }
  };

  // เมื่อกดปุ่มแก้ไข ให้ดึงข้อมูลมาใส่ในฟอร์ม
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description || '',
      unit_price: String(product.unit_price || 0), 
      available_quantity: String(product.available_quantity || 0),
      image: product.image || '' 
    });
  };

  // รีเซ็ตฟอร์มให้ว่างเปล่า
  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', unit_price: '', available_quantity: '', image: '' });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      
      {/* ฟอร์มเพิ่ม/แก้ไข สินค้า */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-10">
        <h2 className="font-bold text-xl mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" placeholder="Product Title" required
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-black"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            
            <input 
              type="number" placeholder="Unit Price (฿)" required min="0"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-black"
              value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} />
            
            <input 
              type="number" placeholder="Available Quantity" required min="0"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-black"
              value={formData.available_quantity} onChange={e => setFormData({...formData, available_quantity: e.target.value})} />
            
            <input 
              type="file" 
              accept="image/*"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-black"
              onChange={e => {
                // ถ้ามีการเลือกไฟล์ ให้เก็บไฟล์แรกลงใน State
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }} 
            />
          </div>
          
          <textarea 
            placeholder="Product Description" required
            className="border border-gray-300 p-2 rounded-lg w-full mb-4 h-24 focus:outline-none focus:border-black"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          
          <div className="flex gap-4">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition font-medium">
              {editingId ? 'Update Product' : 'Save Product'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ตารางจัดการสินค้า */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Image</th>
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{product.title}</td>
                  <td className="p-4">฿{product.unit_price.toLocaleString()}</td>
                  <td className="p-4">{product.available_quantity}</td>
                  <td className="p-4">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 font-medium hover:underline mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 font-medium hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  คุณยังไม่มีสินค้าในร้าน เริ่มต้นเพิ่มสินค้าด้านบนได้เลย
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}