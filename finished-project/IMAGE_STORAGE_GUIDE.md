#  Image Storage Guide

##  **Dimana Menyimpan Image Assets?**

### **1. Static Images (Frontend - Public Folder)**

**Location:** `health-ecommerce-production-uiux/finished-project/public/`

**Untuk:**
- Logo
- Icons
- Placeholder images
- Static marketing images
- Favicon

**Cara Menggunakan:**
```jsx
// Di React component
<img src="/logo.png" alt="Logo" />
<img src="/placeholder.webp" alt="Placeholder" />
<img src="/icons/shopping-cart.svg" alt="Cart" />
```

**Current Structure:**
```
public/
├── placeholder.webp          # Product placeholder image
├── vite.svg                  # Vite icon
└── (add more static assets here)
```

**Benefits:**
-  Fast loading (direct access)
-  No build processing needed
-  Easy to reference
-  Cached by browser

---

### **2. Product Images (Backend Storage)**

**Recommended Approach: Backend Upload dengan Multer**

#### **Option A: Local Storage (Development)**

**Location:** `health-ecommerce-external-integration/finished-project/uploads/`

**Setup:**
```javascript
// Backend: Add to server.js or create upload middleware
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Upload endpoint
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl,
    filename: req.file.filename
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));
```

**Pros:**
-  Simple setup
-  No external dependencies
-  Good for development

**Cons:**
-  Not scalable for production
-  Files lost if server restarts (unless persistent volume)
-  No CDN benefits

---

#### **Option B: Cloud Storage (Production) - RECOMMENDED**

**Popular Options:**

**1. Cloudinary (Recommended)**

```bash
npm install cloudinary multer-storage-cloudinary
```

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'health-ecommerce/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });
```

**2. AWS S3**

```bash
npm install aws-sdk multer-s3
```

```javascript
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `products/${Date.now()}-${file.originalname}`);
    }
  })
});
```

**Pros:**
-  Scalable
-  CDN support
-  Image transformations
-  Backup & recovery
-  No server storage needed

**Cons:**
-  Costs money (but free tier available)
-  Requires setup

---

### **3. Current Product Images (Seed Data)**

**Untuk product seeding di database:**

```javascript
// Backend: scripts/seed.js
const products = [
  {
    name: "Vitamin C 1000mg",
    imageUrl: "https://example.com/vitamin-c.jpg", // External URL
    // OR
    imageUrl: "/placeholder.webp", // Local placeholder
  }
];
```

**Best Practice:**
1. **Development:** Use placeholder.webp atau external URLs
2. **Production:** Upload real images ke cloud storage

---

##  **Recommendation Summary**

### **For Your Project:**

**Current (Development):**
```
 Static assets → public/ folder
 Product placeholders → public/placeholder.webp
```

**For Production:**
```
 Product images → Cloudinary or AWS S3
 User avatars → Cloudinary
 Static assets → Stay in public/ folder
```

---

##  **Quick Implementation (Cloudinary)**

### **1. Signup & Get Credentials**
- Go to [Cloudinary](https://cloudinary.com/)
- Sign up for free account
- Get: cloud_name, api_key, api_secret

### **2. Add to .env**
```env
# Backend .env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **3. Install & Configure**
```bash
cd health-ecommerce-external-integration/finished-project
npm install cloudinary multer multer-storage-cloudinary
```

### **4. Create Upload Route**
```javascript
// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Config file

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'health-ecommerce/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  res.json({
    success: true,
    imageUrl: req.file.path // Cloudinary URL
  });
});

module.exports = router;
```

### **5. Frontend Upload Component**
```jsx
// Component untuk upload image
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.imageUrl;
};
```

---

##  **Kesimpulan**

**Untuk sekarang:**
- Static images → `public/` folder 
- Product images → Gunakan `placeholder.webp` atau external URLs 

**Untuk production:**
- Implement Cloudinary atau AWS S3 untuk product images 
- Keep static assets di `public/` folder 

---

**Last Updated:** November 5, 2025

