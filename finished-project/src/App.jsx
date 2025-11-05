import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, FloatButton } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import LoginPage from './pages/LoginPage'

const { Content } = Layout

function App() {
  const [chatbotVisible, setChatbotVisible] = useState(false)

  return (
    <Layout className="min-h-screen flex flex-col">
      <Navbar />
      
      <Content className="bg-gray-50 flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
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
  )
}

export default App

