const BASE_URL = import.meta.env.VITE_API_URL;

// เพิ่ม parameter isFormData เพื่อเช็คว่าต้องใส่ Content-Type ไหม
const getHeaders = (isFormData: boolean = false) => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    // ถ้ามี Token ก็ใส่เข้าไป
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  // 💡 ถ้าไม่ใช่ FormData ค่อยบังคับให้เป็น JSON (ถ้าเป็น FormData บราวเซอร์จะจัดการให้เอง)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json(); 
  },

  post: async <T, R = unknown>(endpoint: string, body: T): Promise<R> => {
    // เช็คว่า body ที่ส่งมาเป็น FormData ใช่ไหม
    const isFormData = body instanceof FormData;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData), // ดึง Headers แบบไดนามิก
      body: isFormData ? (body as unknown as BodyInit) : JSON.stringify(body), // ถ้าใช่ส่งตรงๆ ถ้าไม่ใช่แปลงเป็น JSON
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  put: async <T, R = unknown>(endpoint: string, body: T): Promise<R> => {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? (body as unknown as BodyInit) : JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  },

  delete: async <R = unknown>(endpoint: string): Promise<R> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as R;
  },
};