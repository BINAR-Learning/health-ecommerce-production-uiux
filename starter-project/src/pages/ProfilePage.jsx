/**
 * Profile Page
 * 
 * TODO untuk peserta:
 * 1. Import components dari Ant Design (Card, Form, Input, Button, Upload, Avatar, message)
 * 2. Import useAuth dari '../context/AuthContext'
 * 3. Import apiClient dari '../services/api'
 * 4. Create ProfilePage component:
 *    - Display user info dengan Avatar
 *    - Form untuk update profile (name, phone, address, password optional)
 *    - Upload profile photo menggunakan FormData (terintegrasi dengan update)
 *    - Handle form submit dengan FormData (multipart/form-data)
 *    - Call updateProfile dari authService
 *    - Update user in AuthContext
 * 
 * 5. Important: Image upload sekarang terintegrasi dengan update profile!
 *    - Tidak perlu endpoint terpisah /api/upload/profile
 *    - Gunakan PUT /api/auth/profile dengan FormData
 *    - Include image file di FormData saat submit form
 * 
 * Reference: ../finished-project/src/pages/ProfilePage.jsx
 */

// TODO: Import dependencies
// import { Card, Form, Input, Button, Upload, Avatar, message } from 'antd';
// import { useAuth } from '../context/AuthContext';
// import apiClient from '../services/api';

// TODO: Create ProfilePage component
// function ProfilePage() {
//   // Get user from useAuth
//   // Form state (useState, Form.useForm)
//   // Image file state (useState untuk menyimpan file yang dipilih)
//   // Handle image change (preview image, simpan file)
//   // Handle form submit:
//   //   - Create FormData
//   //   - Append form fields (name, phone, address, password optional)
//   //   - Append image file jika ada
//   //   - Call updateProfile(formData)
//   //   - Update user in AuthContext
//   // Return JSX dengan:
//   //   - Avatar dengan preview image
//   //   - Form dengan fields: name, phone, address, password (optional)
//   //   - Upload component untuk image (beforeUpload untuk preview)
//   //   - Submit button
// }

// TODO: Export
// export default ProfilePage;

