import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, FloatButton } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

const { Content } = Layout

function App() {
  const [chatbotVisible, setChatbotVisible] = useState(false)

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout className="min-h-screen flex flex-col">
            <Navbar />
            
            <Content className="bg-gray-50 flex-1 w-full">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/order-success" element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Content>
            
            <Footer />

            {/* AI Chatbot Floating Button */}
            <FloatButton
              icon={<RobotOutlined />}
              type="primary"
              style={{
                right: 24,
                bottom: 24,
                width: 60,
                height: 60,
              }}
              onClick={() => setChatbotVisible(true)}
              tooltip={<div>AI Assistant</div>}
            />

            {/* AI Chatbot Modal */}
            <AIChatbot
              visible={chatbotVisible}
              onClose={() => setChatbotVisible(false)}
            />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

