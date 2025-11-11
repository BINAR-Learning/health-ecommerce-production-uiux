import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Button, Card, Avatar, Spin, message, Tag } from 'antd';
import { RobotOutlined, UserOutlined, SendOutlined, ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductRecommendations, formatAIResponse } from '../services/aiService';

const { TextArea } = Input;

function AIChatbot({ visible, onClose }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya adalah asisten AI Health E-Commerce. Ceritakan keluhan atau kebutuhan kesehatan Anda, dan saya akan merekomendasikan produk yang tepat! '
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToCart = (product) => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      onClose(); // Close chatbot
      message.warning({
        content: 'Silakan login terlebih dahulu untuk menambahkan produk ke keranjang',
        duration: 3,
        icon: <LoginOutlined />,
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    // Ensure product has _id for cart matching
    if (!product._id) {
      console.error('Product missing _id:', product);
      message.error('Error: Produk tidak valid. Silakan coba lagi.');
      return;
    }

    // Log untuk debugging
    console.log('Adding to cart:', {
      _id: product._id,
      name: product.name,
      price: product.price,
      hasId: !!product._id,
      hasName: !!product.name,
      hasPrice: !!product.price
    });

    addToCart(product);
    message.success(` ${product.name} ditambahkan ke keranjang!`);
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Get AI recommendation
      const response = await getProductRecommendations(inputMessage);
      const formatted = await formatAIResponse(response);

      // Debug: Log formatted products
      console.log('AI Response formatted:', {
        message: formatted.message,
        productsCount: formatted.products?.length,
        products: formatted.products?.map(p => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          hasId: !!p._id,
          hasName: !!p.name,
          hasPrice: !!p.price
        }))
      });

      // Add AI response
      const aiMsg = {
        role: 'assistant',
        content: formatted.message,
        products: formatted.products
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      message.error('Maaf, terjadi kesalahan. Pastikan backend running di localhost:5000');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, saya mengalami kendala teknis. Silakan coba lagi atau hubungi customer service.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-xl sm:text-2xl text-blue-500" />
          <span className="text-sm sm:text-base">AI Assistant - Rekomendasi Produk</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="!max-w-[calc(100vw-32px)]"
    >
      {/* Chat Messages */}
      <div className="h-64 sm:h-96 overflow-y-auto mb-4 p-3 sm:p-4 bg-gray-50 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={msg.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}
                size={msg.role === 'user' ? 'default' : 'large'}
              />
              <div className="flex-1">
                <Card size="small" className="shadow-sm">
                  <p className="mb-0 text-sm sm:text-base whitespace-pre-line">{msg.content}</p>
                </Card>
                
                {/* Product Cards - Clickable with Add to Cart */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      💊 Produk yang Direkomendasikan:
                    </p>
                    {msg.products.map((product, i) => (
                      <Card
                        key={i}
                        size="small"
                        className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                        bodyStyle={{ padding: '12px' }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={product.image || product.imageUrl || '/placeholder.webp'}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.webp';
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-800 mb-1 truncate">
                              {product.name}
                            </h4>
                            {product.category && (
                              <Tag color="blue" className="text-xs mb-1">
                                {product.category}
                              </Tag>
                            )}
                            <p className="text-xs text-blue-600 font-bold mb-2">
                              Rp {product.price?.toLocaleString('id-ID')}
                            </p>
                            
                            {/* Add to Cart Button */}
                            <Button
                              type="primary"
                              size="small"
                              icon={<ShoppingCartOutlined />}
                              onClick={() => handleAddToCart(product)}
                              className="w-full sm:w-auto"
                            >
                              <span className="text-xs">Tambah ke Keranjang</span>
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex gap-2">
              <Avatar icon={<RobotOutlined />} className="bg-green-500" />
              <Card size="small">
                <Spin size="small" /> <span className="ml-2">Sedang berpikir...</span>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Contoh: Saya butuh vitamin untuk daya tahan tubuh..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!inputMessage.trim()}
        >
          Kirim
        </Button>
      </div>
    </Modal>
  );
}

export default AIChatbot;

