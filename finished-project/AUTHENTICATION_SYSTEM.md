# 🔐 Authentication System - Complete Guide

## ✅ **SISTEM AUTHENTICATION SUDAH DIBUAT!**

### 📋 **What's Included:**

1. ✅ **Login Page** (`/login`)
2. ✅ **Register Page** (`/register`)
3. ✅ **Profile Page** (`/profile`)
4. ✅ **Protected Routes** (Cart, Checkout, Profile)
5. ✅ **AuthContext** (Global auth state)
6. ✅ **Auto redirect** ke login jika belum login
7. ✅ **User menu** di Navbar (Avatar, Profile, Logout)
8. ✅ **Token management** (localStorage + Bearer token)

---

## 🎯 **Flow Authentication:**

### **1. Registration Flow:**

```
User → /register → Fill form → Backend API → Token + User Data → 
localStorage → AuthContext updated → Redirect to Home
```

**Fields:**
- Name (min 3 chars)
- Email (valid format)
- Password (min 6 chars, harus ada huruf besar, kecil, dan angka)
- Confirm Password (must match)

### **2. Login Flow:**

```
User → /login → Email + Password → Backend API → Token + User Data → 
localStorage → AuthContext updated → Redirect to previous page or Home
```

**Features:**
- Remember last page (redirect back after login)
- Error handling untuk wrong credentials
- Loading state

### **3. Protected Route Flow:**

```
User tries to access /cart or /checkout → 
Check isLoggedIn → 
If NOT logged in → Redirect to /login (save attempted URL) →
After login → Redirect back to saved URL
```

### **4. Logout Flow:**

```
User clicks Logout → Clear localStorage → Clear AuthContext → 
Redirect to Home → Show success message
```

---

## 🗂️ **File Structure:**

```
src/
├── context/
│   └── AuthContext.jsx          # ✅ Auth state management
│
├── services/
│   └── authService.js           # ✅ API calls (login, register, profile)
│
├── components/
│   ├── Navbar.jsx               # ✅ Updated with user menu
│   └── ProtectedRoute.jsx       # ✅ Protect routes yang butuh auth
│
└── pages/
    ├── LoginPage.jsx            # ✅ Login form
    ├── RegisterPage.jsx         # ✅ Register form
    └── ProfilePage.jsx          # ✅ User profile & edit
```

---

## 🔧 **API Endpoints (Backend):**

### **POST /api/auth/register**

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### **POST /api/auth/login**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### **GET /api/auth/profile**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-05T10:00:00.000Z"
  }
}
```

---

## 💾 **LocalStorage Structure:**

```javascript
// Token
localStorage.getItem('auth_token')
// Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// User Data
localStorage.getItem('user_data')
// Value: {"id":"507f...","name":"John Doe","email":"john@example.com","role":"user"}
```

---

## 🔐 **Token Management:**

### **HTTP Client (api.js):**

```javascript
// Auto-attach token ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🎨 **UI Components:**

### **1. Login Page**

**Features:**
- Email validation
- Password visibility toggle
- Loading state
- Error messages
- Link to register
- Remember attempted page

**URL:** `/login`

### **2. Register Page**

**Features:**
- Name, Email, Password, Confirm Password
- Password strength requirements
- Password match validation
- Loading state
- Link to login

**URL:** `/register`

### **3. Profile Page**

**Features:**
- User avatar
- Display name, email, role
- Edit profile form
- Change password form
- Member stats (orders, etc)
- Refresh profile button

**URL:** `/profile`

### **4. Navbar User Menu**

**Desktop:**
- Avatar dengan dropdown
- Profile link
- Logout button

**Mobile:**
- User info di drawer
- Profile link
- Logout button

---

## 🛡️ **Protected Routes:**

**Routes yang memerlukan authentication:**
- `/cart` - Shopping Cart
- `/checkout` - Checkout Page
- `/profile` - User Profile
- `/order-success` - Order Success Page

**How it works:**
```jsx
<Route path="/cart" element={
  <ProtectedRoute>
    <CartPage />
  </ProtectedRoute>
} />
```

Jika user belum login, akan di-redirect ke `/login` dengan menyimpan URL yang ingin diakses. Setelah login, user akan di-redirect kembali ke URL tersebut.

---

## 🧪 **Testing:**

### **Test Case 1: Register**
1. Go to `/register`
2. Fill form dengan data valid
3. Click "Daftar"
4. Should redirect to home dengan user logged in

### **Test Case 2: Login**
1. Go to `/login`
2. Enter valid credentials
3. Click "Masuk"
4. Should redirect to home (or saved page)

### **Test Case 3: Protected Route**
1. Logout (if logged in)
2. Try to access `/cart`
3. Should redirect to `/login`
4. Login
5. Should redirect back to `/cart`

### **Test Case 4: Logout**
1. Login
2. Click avatar menu
3. Click "Logout"
4. Should clear token and redirect to home

### **Test Case 5: Profile**
1. Login
2. Go to `/profile`
3. Edit name
4. Click "Simpan Perubahan"
5. Should update local storage

---

## ⚙️ **Environment Variables:**

**Backend (.env):**
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 **Quick Start:**

### **1. Start Backend:**
```bash
cd health-ecommerce-external-integration/finished-project
npm run dev
```

### **2. Start Frontend:**
```bash
cd health-ecommerce-production-uiux/finished-project
npm run dev
```

### **3. Test Authentication:**
1. Open `http://localhost:5173/register`
2. Register new account
3. Should auto-login and redirect
4. Try accessing `/cart` - should work!
5. Logout and try again - should redirect to login

---

## 📝 **Common Issues & Solutions:**

### **Issue 1: Token not sent to backend**
**Solution:** Check api.js interceptor sudah benar

### **Issue 2: 401 error loop**
**Solution:** Check path in api.js: `!window.location.pathname.includes('/login')`

### **Issue 3: User data tidak persist**
**Solution:** Check localStorage dan AuthContext initialization

### **Issue 4: Protected route tidak redirect**
**Solution:** Check ProtectedRoute component dan AuthProvider wrapping

---

## ✅ **Summary:**

✅ **Login & Register** - Complete UI dan backend integration  
✅ **Protected Routes** - Auto redirect jika belum login  
✅ **Token Management** - Auto-attach ke headers  
✅ **User Menu** - Avatar, Profile, Logout  
✅ **Profile Page** - View dan edit profile  
✅ **Error Handling** - Clear messages untuk user  

**AUTHENTICATION SYSTEM IS READY TO USE!** 🎉

---

**Last Updated:** November 5, 2025

