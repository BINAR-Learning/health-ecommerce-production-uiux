import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import apiClient from '../services/api';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', values);
      
      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        message.success('Login berhasil!');
        navigate('/');
      }
    } catch (error) {
      message.error(error.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🏥 Health E-Commerce</h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email wajib diisi!' },
              { type: 'email', message: 'Format email tidak valid!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="email@example.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password wajib diisi!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Button type="link" onClick={() => navigate('/register')}>
              Belum punya akun? Daftar di sini
            </Button>
          </div>
        </Form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Demo credentials:</strong>
          </p>
          <p className="text-sm text-gray-600">
            Email: aila@example.com<br />
            Password: Aila123!
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;

