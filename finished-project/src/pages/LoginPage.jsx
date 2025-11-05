import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get the page they were trying to access (if any)
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await login(values.email, values.password);
      
      // Update auth context
      setAuthLogin(response.user, response.token);
      
      message.success('Login berhasil! Selamat datang ' + response.user.name);
      
      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-12">
      <Card 
        className="w-full max-w-md shadow-xl"
        style={{ borderRadius: '12px' }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LoginOutlined className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Masuk
          </h1>
          <p className="text-gray-500">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email wajib diisi!' },
              { type: 'email', message: 'Format email tidak valid!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password wajib diisi!' },
              { min: 6, message: 'Password minimal 6 karakter!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
              icon={<LoginOutlined />}
              className="!h-12 !text-base font-semibold"
            >
              Masuk
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Belum punya akun?</Divider>

        <div className="text-center">
          <Link to="/register">
            <Button type="default" block className="!h-11">
              Daftar Sekarang
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

export default LoginPage;
