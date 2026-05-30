// src/pages/Buyer/BuyerDashboard.tsx
import { useState, useEffect, useCallback } from "react";
import type { Product } from "../../types";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

interface ProductDetail {
  id: number;
  title: string;
  unit_price: string;
  image: string;
}

// 2. ปรับ Interface ของ CartItem ให้ตรงกับ JSON จริง
interface CartItem {
  id: number;
  product: number; // ตาม JSON คือ ID (ตัวเลข)
  product_detail: ProductDetail; // ต้องเพิ่มก้อนนี้เข้าไป
  quantity: number; // แก้จาก available_quantity เป็น quantity ตาม JSON
  subtotal: number;
}

export default function BuyerDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [ordering, setOrdering] = useState<string>(""); // เรียงลำดับราคามากไปน้อย หรือน้อยไปมาก

  const [orders, setOrders] = useState<any[]>([]); // ประวัติคำสั่งซื้อ

  // เอาหน้า PAYMENT ออก เพราะเราใช้ navigate ไปหน้าใหม่แล้ว
  const [currentView, setCurrentView] = useState<"SHOP" | "CART" | "HISTORY">(
    "SHOP",
  );

  // 1. ฟังก์ชันดึงข้อมูลตะกร้าจาก Backend
  const fetchCart = useCallback(async () => {
    try {
      const data = await api.get<any>("/cart/");

      // เพิ่ม console.log ตรงนี้เพื่อดูโครงสร้างข้อมูลที่คุณถามหาครับ
      console.log("Data from /cart/:", data);

      if (data && data.items) {
        setCart(data.items);
        setCartTotal(data.total_price || 0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (minPrice) params.append("min_price", minPrice);
      if (maxPrice) params.append("max_price", maxPrice);
      if (ordering) params.append("ordering", ordering);

      const queryString = params.toString();
      const data = await api.get<Product[]>(`/products/?${queryString}`);
      setProducts(data);
    } catch (error: unknown) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      // ยิง API ลบรายการสินค้า (ปรับ path ให้ตรงกับ API ของคุณ เช่น /cart/remove/{id}/)
      await api.delete(`/cart/${itemId}/`);
      alert("ลบสินค้าออกจากตะกร้าแล้ว");

      // ดึงตะกร้าใหม่เพื่ออัปเดต UI
      fetchCart();
    } catch (error) {
      console.error("Remove item failed:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  useEffect(() => {
    const initData = async () => {
      await fetchCart();
    };
    initData();
  }, [fetchCart]);

  // ดึงตะกร้าใหม่ทุกครั้งที่สลับมาหน้า CART
  useEffect(() => {
    const loadCartOnViewChange = async () => {
      if (currentView === "CART") {
        await fetchCart();
      }
    };
    loadCartOnViewChange();
  }, [currentView, fetchCart]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, minPrice, maxPrice, ordering]);

  // 2. แก้ไขการคำนวณราคาให้ชี้ไปที่ item.product.unit_price
  // const safeCart = Array.isArray(cart) ? cart : [];

  // const totalPrice = safeCart.reduce(
  //   (sum, item) => sum + Number(item.product_detail.unit_price) * item.quantity,
  //   0,
  // );

  // 3. ฟังก์ชันเพิ่มลงตะกร้าแบบยิงเข้า Backend
  const handleAddToCart = async (productId: number) => {
    try {
      await api.post("/cart/", {
        product_id: productId,
        quantity: 1,
      });
      alert("เพิ่มลงตะกร้าสำเร็จ! 🛒");
      fetchCart(); // อัปเดตตัวเลขตะกร้าด้านบนทันที
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มลงตะกร้า");
    }
  };

  useEffect(() => {
    if (currentView === "HISTORY") {
      const fetchOrders = async () => {
        try {
          const data = await api.get<any[]>("/orders/history/");
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch history:", error);
        }
      };
      fetchOrders();
    }
  }, [currentView]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* --- แถบเมนูด้านบน (Navigation) --- */}
      <div className="flex gap-6 mb-8 border-b pb-4">
        <button
          onClick={() => setCurrentView("SHOP")}
          className={`font-bold pb-2 ${currentView === "SHOP" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}
        >
          🛍️ Shop
        </button>
        <button
          onClick={() => setCurrentView("CART")}
          className={`font-bold pb-2 ${currentView === "CART" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}
        >
          🛒 Cart ({cart.length})
        </button>
        <button
          onClick={() => setCurrentView("HISTORY")}
          className={`font-bold pb-2 ${currentView === "HISTORY" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}
        >
          📦 History
        </button>
      </div>

      {/* =========================================
          หน้า 1: SHOP
          ========================================= */}
      {currentView === "SHOP" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">All Products</h1>
            <button
              onClick={() => setCurrentView("CART")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
            >
              View Cart ({cart.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <input
              type="text"
              placeholder="Search keywords..."
              className="border border-gray-300 p-2 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:border-black"
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Price"
              className="border border-gray-300 p-2 rounded-lg w-32 focus:outline-none focus:border-black"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="border border-gray-300 p-2 rounded-lg w-32 focus:outline-none focus:border-black"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <select
              className="border border-gray-300 p-2 rounded-lg bg-white w-48 focus:outline-none focus:border-black"
              onChange={(e) => setOrdering(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="unit_price">Price: Low to High</option>
              <option value="-unit_price">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition flex flex-col cursor-pointer"
                  onClick={() => navigate(`/buyer/product/${product.id}`)}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-48 w-full object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description || "No description available"}
                  </p>

                  <div className="mt-auto">
                    <p className="font-semibold text-lg mb-4">
                      ฿{(product.unit_price || 0).toLocaleString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id); // 4. เปลี่ยนมาเรียกใช้ API แทน
                      }}
                      className="w-full border border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                ไม่พบสินค้าที่คุณค้นหา
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          หน้า 2: CART
          ========================================= */}
      {currentView === "CART" && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border">
              <p className="text-gray-500 mb-4">ตะกร้าของคุณว่างเปล่า</p>
              <button
                onClick={() => setCurrentView("SHOP")}
                className="text-blue-600 hover:underline"
              >
                กลับไปเลือกซื้อสินค้า
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              {/* ส่วนแสดงรายการสินค้าในตะกร้า */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div className="flex gap-4 items-center">
                    {/* แสดงรูปภาพจาก backend (ถ้ามี) */}
                    {item.product_detail.image ? (
                      <img
                        src={`http://localhost:8000${item.product_detail.image}`}
                        alt={item.product_detail.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        Img
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-lg">
                        {item.product_detail.title}
                      </p>
                      <p className="text-gray-500 text-sm">
                        จำนวน: {item.quantity} ชิ้น
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 text-xs hover:underline mt-1"
                      >
                        ลบสินค้า
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    {/* แสดง subtotal ของรายการนั้นๆ */}
                    <p className="font-bold text-lg">
                      ฿{Number(item.subtotal).toLocaleString()}
                    </p>
                    {/* แสดงราคาต่อหน่วย */}
                    <p className="text-xs text-gray-400">
                      ราคาต่อหน่วย: ฿
                      {Number(item.product_detail.unit_price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* ส่วนแสดงราคารวมที่ดึงมาจาก total_price ของ Backend */}
              <div className="text-right mt-8">
                <p className="text-xl mb-4">
                  ยอดรวมทั้งหมด:{" "}
                  <span className="font-bold text-3xl text-blue-600">
                    ฿{cartTotal.toLocaleString()}
                  </span>
                </p>

                <button
                  onClick={() => navigate("/buyer/payment")}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          หน้า 3: HISTORY
          ========================================= */}
      {currentView === "HISTORY" && (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Order History</h1>

          {/* สมมติว่าคุณมี state ชื่อ orders ที่เก็บข้อมูลจาก API ไว้ */}
          {orders.length === 0 ? (
            <div className="bg-gray-50 p-10 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-500 text-lg mb-2">
                คุณยังไม่มีประวัติการสั่งซื้อ
              </p>
              <button
                onClick={() => setCurrentView("SHOP")}
                className="text-blue-600 font-medium hover:underline"
              >
                ไปช้อปปิ้งกันเลย!
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <div>
                      <p className="font-bold text-lg">Order #{order.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        {order.status}
                      </span>
                      <p className="text-xl font-bold mt-2">
                        ฿{Number(order.total_price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.product_title} x {item.quantity}
                        </span>
                        <span>
                          ฿{Number(item.price_at_purchase).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
