import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'user' // Default role
      };

      const response = await register(userData);
      
      // Update auth context
      login(response.user, response.token);
      
      message.success('Registrasi berhasil! Selamat datang ' + response.user.name);
      
      // Redirect to home
      navigate('/', { replace: true });
    } catch (error) {
      message.error(error.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-12">
      <Card 
        className="w-full max-w-md shadow-xl"
        style={{ borderRadius: '12px' }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserAddOutlined className="text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Daftar
          </h1>
          <p className="text-gray-500">
            Buat akun baru untuk mulai berbelanja
          </p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Nama wajib diisi!' },
              { min: 3, message: 'Nama minimal 3 karakter!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nama Lengkap"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email wajib diisi!' },
              { type: 'email', message: 'Format email tidak valid!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password wajib diisi!' },
              { min: 6, message: 'Password minimal 6 karakter!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password harus mengandung huruf besar, huruf kecil, dan angka!'
              }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Konfirmasi password wajib diisi!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password tidak cocok!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Konfirmasi Password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
              icon={<UserAddOutlined />}
              className="!h-12 !text-base font-semibold"
            >
              Daftar
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Sudah punya akun?</Divider>

        <div className="text-center">
          <Link to="/login">
            <Button type="default" block className="!h-11">
              Masuk
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;

