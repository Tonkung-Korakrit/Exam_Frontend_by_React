// src/pages/Buyer/ProductDetail.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import type { Product } from '../../types';

export default function ProductDetail() {
  const { id } = useParams(); // ดึง ID จาก URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ดึงข้อมูลสินค้าตาม ID
        const data = await api.get<Product>(`/products/${id}/`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ฟังก์ชันเพิ่มลงตะกร้า
  const handleAddToCart = async () => {
    try {
      await api.post('/cart/', { product_id: Number(id), quantity: quantity });
      alert('เพิ่มลงตะกร้าเรียบร้อย!');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเพิ่มลงตะกร้า');
    }
  };

  // ฟังก์ชันซื้อทันที (Buy Now)
  const handleBuyNow = async () => {
    try {
      // 1. เอาใส่ตะกร้าก่อน
      await api.post('/cart/', { product_id: Number(id), quantity: quantity });
      // 2. เด้งไปหน้าชำระเงินทันที
      navigate('/buyer/payment');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  if (loading) return <div className="text-center p-20 text-xl">Loading...</div>;
  if (!product) return <div className="text-center p-20 text-xl text-red-500">ไม่พบสินค้า</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-black hover:underline">
        &larr; กลับไปหน้าหลัก
      </button>

      <div className="bg-white p-8 rounded-xl shadow-sm border flex flex-col md:flex-row gap-10">
        {/* รูปภาพ */}
        <div className="md:w-1/2">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-96 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400">No Image</div>
          )}
        </div>

        {/* รายละเอียด */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">฿{(product.unit_price || 0).toLocaleString()}</p>
          
          <div className="mb-6">
            <h3 className="font-bold mb-2 text-gray-700">รายละเอียดสินค้า</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{product.description || 'ไม่มีรายละเอียด'}</p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">สินค้าคงเหลือ: {product.available_quantity} ชิ้น</p>
            {/* ตัวปรับจำนวน */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">จำนวน:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border-r"
                >-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center focus:outline-none"
                  min="1"
                  max={product.available_quantity}
                />
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.available_quantity || 99, prev + 1))}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border-l"
                >+</button>
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border-2 border-black text-black py-3 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              เพิ่มลงตะกร้า
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
            >
              ซื้อสินค้าทันที
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}