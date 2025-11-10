import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider, Tag, Upload } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined, ShoppingOutlined, UploadOutlined, CameraOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/authService';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.profilePhoto || null);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Set initial form values
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
      setPhotoUrl(user.profilePhoto || null);
    }
  }, [user, form]);

  const handleImageChange = (info) => {
    if (info.file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
      setImageFile(info.file.originFileObj);
    }
    return false; // Prevent default upload behavior
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const profile = await getProfile();
      updateUser(profile);
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
      });
      message.success('Profile refreshed!');
    } catch (error) {
      message.error('Failed to refresh profile');
    } finally {
      setRefreshing(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      if (values.name) formData.append('name', values.name);
      if (values.phone) formData.append('phone', values.phone);
      if (values.address) formData.append('address', values.address);
      if (values.password) formData.append('password', values.password);
      
      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Call update profile API
      const updatedUser = await updateProfile(formData);
      
      updateUser(updatedUser);
      setPhotoUrl(updatedUser.profilePhoto || null);
      setImageFile(null); // Reset image file after successful upload
      
      message.success('Profile berhasil diupdate!');
    } catch (error) {
      message.error(error.message || 'Gagal update profile');
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800">
        Profile Saya
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar 
                size={100} 
                src={photoUrl}
                icon={!photoUrl && <UserOutlined />} 
                className="bg-blue-500"
              />
              <Upload
                showUploadList={false}
                beforeUpload={handleImageChange}
                accept="image/*"
              >
                <Button
                  icon={<CameraOutlined />}
                  shape="circle"
                  size="small"
                  className="absolute bottom-0 right-0"
                  title="Change photo"
                />
              </Upload>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {user?.name || 'User'}
            </h2>
            <p className="text-gray-500 mb-4">{user?.email || '-'}</p>
            
            <Tag color={user?.role === 'admin' ? 'red' : 'blue'} className="mb-4">
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </Tag>

            <Divider />

            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold">2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-semibold">0</span>
              </div>
            </div>

            <Button 
              type="dashed" 
              block 
              className="mt-4"
              icon={<ShoppingOutlined />}
              onClick={() => window.location.href = '/products'}
            >
              Mulai Belanja
            </Button>
          </div>
        </Card>

        {/* Edit Profile Card */}
        <Card title="Edit Profile" className="lg:col-span-2">
          <Form
            form={form}
            name="profile"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Nama Lengkap"
              name="name"
              rules={[
                { required: true, message: 'Nama wajib diisi!' },
                { min: 3, message: 'Nama minimal 3 karakter!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nama Lengkap"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              tooltip="Email tidak dapat diubah"
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email"
                disabled
              />
            </Form.Item>

            <Form.Item
              label="Nomor Telepon"
              name="phone"
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="081234567890"
              />
            </Form.Item>

            <Form.Item
              label="Alamat"
              name="address"
            >
              <Input.TextArea 
                prefix={<HomeOutlined />} 
                placeholder="Jl. Merdeka No. 123, Jakarta"
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label="Foto Profile"
            >
              <Upload
                showUploadList={false}
                beforeUpload={handleImageChange}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>
                  {imageFile ? 'Ganti Foto' : 'Upload Foto'}
                </Button>
              </Upload>
              {imageFile && (
                <p className="text-sm text-gray-500 mt-2">
                  Foto baru akan diupload saat menyimpan
                </p>
              )}
            </Form.Item>

            <Form.Item>
              <div className="flex gap-3">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  className="flex-1"
                >
                  Simpan Perubahan
                </Button>
                <Button 
                  onClick={handleRefresh}
                  loading={refreshing}
                >
                  Refresh
                </Button>
              </div>
            </Form.Item>
          </Form>

          <Divider>Ganti Password (Opsional)</Divider>

          <Form.Item
            label="Password Baru"
            name="password"
            tooltip="Kosongkan jika tidak ingin mengubah password"
            rules={[
              { min: 6, message: 'Password minimal 6 karakter!' }
            ]}
          >
            <Input.Password placeholder="Password Baru (opsional)" />
          </Form.Item>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;

