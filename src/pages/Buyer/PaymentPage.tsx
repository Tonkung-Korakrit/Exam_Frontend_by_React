import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // 1. ดึงข้อมูลจาก /cart/ ซึ่งได้เป็น Object { items: [], total_price: ... }
        const data = await api.get<any>('/cart/');
        
        console.log("Payment Data:", data); // ดูโครงสร้างข้อมูลใน Console

        // 2. ดึงค่า total_price จาก Backend มาใช้เลย ไม่ต้องคำนวณเอง
        if (data && typeof data.total_price !== 'undefined') {
          setTotalPrice(data.total_price);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleConfirmPayment = async () => {
    try {
      // ยิง API ยืนยันการตัดเงิน
      await api.post('/cart/payment/', {});
      
      alert('ชำระเงินสำเร็จ! ขอบคุณที่อุดหนุนครับ 🎉');
      
      // จ่ายเสร็จ เด้งกลับไปหน้าประวัติ หรือหน้า Shop
      navigate('/buyer'); 
    } catch (error) {
      console.error('Payment failed:', error);
      alert('เกิดข้อผิดพลาดในการชำระเงิน');
    }
  };

  if (loading) return <div className="text-center p-20 text-xl">กำลังโหลดข้อมูลชำระเงิน...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto mt-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-black hover:underline">
        &larr; กลับ
      </button>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">ชำระเงิน</h1>
        
        <div className="bg-blue-50 p-6 rounded-xl mb-8">
          <p className="text-gray-600 mb-2">ยอดที่ต้องชำระทั้งสิ้น</p>
          <p className="text-4xl font-bold text-blue-600">
            {/* แสดงยอดรวมจาก Backend */}
            ฿{Number(totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        {/* Mock รูป QR Code */}
        <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 mb-8 flex flex-col items-center justify-center">
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
             alt="Mock QR" 
             className="w-48 h-48 mb-6 opacity-80 mix-blend-multiply" 
           />
           <p className="font-medium text-gray-600">สแกน QR Code ด้วยแอปธนาคาร</p>
        </div>

        <button 
          onClick={handleConfirmPayment} 
          className="w-full bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 font-bold text-xl shadow-md transition transform hover:-translate-y-1"
        >
          ยืนยันว่าชำระเงินแล้ว
        </button>
      </div>
    </div>
  );
}