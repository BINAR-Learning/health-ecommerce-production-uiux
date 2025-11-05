# 🏗️ Architecture Overview - Health E-Commerce

## 📋 **Project Structure**

Proyek ini menggunakan **Full Stack Architecture** dengan pemisahan yang jelas antara Frontend dan Backend.

---

## 🎨 **Frontend (React)**

**Location:** `health-ecommerce-production-uiux/finished-project/`

### **⚠️ PENTING: Frontend TIDAK Membuat API!**

Frontend hanya melakukan **HTTP requests** ke backend API. Tidak ada API server di React!

### **Folder Structure:**

```
src/
├── services/          # ⚠️ BUKAN API Server!
│   ├── api.js         # HTTP Client (axios) untuk call backend
│   ├── paymentService.js  # Service layer untuk call payment API
│   └── aiService.js   # Service layer untuk call AI API
├── components/        # React components
├── pages/            # Page components
└── context/          # React Context (state management)
```

### **Services Folder:**

**Maksud "services" di sini:**
- ✅ **Service Layer** - Abstraksi untuk HTTP calls
- ✅ **HTTP Client** - Menggunakan axios untuk call backend
- ❌ **BUKAN API Server** - Tidak ada endpoint yang dibuat di sini!

**Contoh:**
```javascript
// api.js - HTTP Client
import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'http://localhost:5000' // Backend URL
});

// paymentService.js - Service untuk call backend
export const createPayment = async (orderData) => {
  // Call backend API endpoint
  const response = await apiClient.post('/api/external/payment/create', orderData);
  return response.data;
};
```

**Flow:**
```
React Component
  ↓
paymentService.createPayment()
  ↓
apiClient.post() (HTTP Request)
  ↓
Backend API (Node.js/Express) ← INI YANG MEMBUAT API!
  ↓
Midtrans API
```

---

## 🔧 **Backend (Node.js/Express)**

**Location:** `health-ecommerce-external-integration/finished-project/`

### **Ini yang Membuat API!**

Backend inilah yang membuat semua API endpoints:

```
routes/
├── productRoutes.js     # GET /api/products, GET /api/products/:id
├── authRoutes.js        # POST /api/auth/login, POST /api/auth/register
└── externalRoutes.js    # POST /api/external/payment/create, POST /api/external/ai/chat
```

**API Endpoints yang Dibuat:**

1. **Products API:**
   - `GET /api/products` - Get all products
   - `GET /api/products/:id` - Get product by ID
   - `POST /api/products` - Create product (admin)
   - `PUT /api/products/:id` - Update product (admin)
   - `DELETE /api/products/:id` - Delete product (admin)

2. **Auth API:**
   - `POST /api/auth/register` - Register user
   - `POST /api/auth/login` - Login user

3. **External Integrations API:**
   - `POST /api/external/payment/create` - Create Midtrans payment
   - `POST /api/external/payment/webhook` - Midtrans webhook
   - `POST /api/external/ai/chat` - AI chatbot
   - `GET /api/external/kemenkes/medications` - Kemenkes API

---

## 🔄 **Data Flow:**

### **1. Products Flow:**
```
User clicks "Products" 
  ↓
React: ProductsPage.jsx
  ↓
apiClient.get('/api/products')  ← HTTP Request
  ↓
Backend: GET /api/products        ← API Endpoint (Node.js)
  ↓
Database: MongoDB
  ↓
Backend returns JSON
  ↓
React displays products
```

### **2. Payment Flow:**
```
User clicks "Bayar Sekarang"
  ↓
React: CheckoutPage.jsx
  ↓
paymentService.createPayment()   ← Service Layer
  ↓
apiClient.post('/api/external/payment/create')  ← HTTP Request
  ↓
Backend: POST /api/external/payment/create     ← API Endpoint (Node.js)
  ↓
midtransService.createTransaction()            ← Backend Service
  ↓
Midtrans API (External)
  ↓
Backend returns payment URL
  ↓
React opens Midtrans payment page
```

### **3. AI Chatbot Flow:**
```
User types message in chatbot
  ↓
React: AIChatbot.jsx
  ↓
aiService.getProductRecommendations()  ← Service Layer
  ↓
apiClient.post('/api/external/ai/chat')  ← HTTP Request
  ↓
Backend: POST /api/external/ai/chat      ← API Endpoint (Node.js)
  ↓
aiService.getHealthRecommendation()      ← Backend Service
  ↓
Google Gemini AI (External)
  ↓
Backend returns AI response
  ↓
React displays response
```

---

## ✅ **Summary:**

| Component | Location | Purpose |
|-----------|----------|---------|
| **Frontend** | `health-ecommerce-production-uiux/` | UI, HTTP requests ke backend |
| **Backend** | `health-ecommerce-external-integration/` | **API Server**, business logic |
| **Services (FE)** | `src/services/` | HTTP client, service layer |
| **Routes (BE)** | `routes/` | **API endpoints** |
| **Controllers (BE)** | `controllers/` | Request handlers |

---

## 🎯 **Key Points:**

1. ✅ **Frontend = Client** - Hanya melakukan HTTP requests
2. ✅ **Backend = Server** - Membuat API endpoints
3. ✅ **Services di Frontend** - Abstraksi HTTP calls, bukan API
4. ✅ **Routes di Backend** - Inilah yang membuat API!

---

## 📚 **Technology Stack:**

**Frontend:**
- React 18
- React Router (routing)
- Axios (HTTP client)
- Ant Design (UI components)
- Tailwind CSS (styling)

**Backend:**
- Node.js
- Express.js (**API Server**)
- MongoDB (database)
- Mongoose (ODM)

**External APIs:**
- Midtrans (Payment)
- Google Gemini AI (AI Chatbot)
- Kemenkes API (Medications)

---

**Last Updated:** November 5, 2025

