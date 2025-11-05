import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider, Tag } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/authService';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Set initial form values
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

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
      // TODO: Call update profile API when available
      // For now, just update local storage
      const updatedUser = {
        ...user,
        name: values.name,
        // Email biasanya tidak bisa diubah atau perlu verifikasi
      };

      updateUser(updatedUser);
      message.success('Profile berhasil diupdate!');
    } catch (error) {
      message.error('Gagal update profile');
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
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              className="mb-4 bg-blue-500"
            />
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

          <Divider>Ganti Password</Divider>

          <Form
            name="changePassword"
            layout="vertical"
            size="large"
            onFinish={(values) => {
              // TODO: Implement change password
              message.info('Fitur ganti password akan segera tersedia');
            }}
          >
            <Form.Item
              label="Password Lama"
              name="oldPassword"
              rules={[{ required: true, message: 'Password lama wajib diisi!' }]}
            >
              <Input.Password placeholder="Password Lama" />
            </Form.Item>

            <Form.Item
              label="Password Baru"
              name="newPassword"
              rules={[
                { required: true, message: 'Password baru wajib diisi!' },
                { min: 6, message: 'Password minimal 6 karakter!' }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password Baru" />
            </Form.Item>

            <Form.Item
              label="Konfirmasi Password Baru"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: 'Konfirmasi password wajib diisi!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password tidak cocok!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Konfirmasi Password Baru" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Ganti Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;

