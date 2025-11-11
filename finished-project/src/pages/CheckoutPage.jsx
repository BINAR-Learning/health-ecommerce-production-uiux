import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Card, Form, Input, Button, Alert, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPayment } from '../services/paymentService';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  
  // Calculate cart total safely
  const cartTotal = getCartTotal() || 0;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <Alert
          message="Keranjang Kosong"
          description="Silakan tambahkan produk ke keranjang terlebih dahulu"
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate('/products')} size="large">
              Belanja Sekarang
            </Button>
          }
        />
      </div>
    );
  }

  const steps = [
    {
      title: 'Informasi Pengiriman',
      content: <ShippingForm 
        onComplete={(data) => {
          setShippingInfo(data);
          setCurrentStep(1);
        }}
      />
    },
    {
      title: 'Ringkasan & Pembayaran',
      content: <PaymentSummary
        cart={cart}
        cartTotal={cartTotal}
        shippingInfo={shippingInfo}
        onPayment={handlePayment}
        loading={loading}
      />
    }
  ];

  async function handlePayment() {
    setLoading(true);

    try {
      // Validate data sebelum payment
      if (!shippingInfo) {
        message.error('Silakan lengkapi informasi pengiriman terlebih dahulu');
        setLoading(false);
        return;
      }

      const safeCartTotal = cartTotal || 0;
      if (safeCartTotal <= 0) {
        message.error('Total pembayaran tidak valid');
        setLoading(false);
        return;
      }

      // Create payment via Midtrans
      const paymentData = {
        orderId: `ORDER-${Date.now()}`,
        total: safeCartTotal,
        items: cart.map(item => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 1
        })),
        customerName: shippingInfo.name,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address
      };

      const paymentResponse = await createPayment(paymentData);

      // Debug logging
      console.log('CreatePayment result:', {
        success: paymentResponse?.success,
        hasPaymentUrl: !!paymentResponse?.paymentUrl,
        paymentUrl: paymentResponse?.paymentUrl,
        allKeys: paymentResponse ? Object.keys(paymentResponse) : [],
      });

      if (paymentResponse && paymentResponse.success && paymentResponse.paymentUrl) {
        // Open Midtrans payment page in same tab (will redirect back via callbacks)
        console.log(' Redirecting to payment URL:', paymentResponse.paymentUrl);
        
        // Save order info to localStorage (for after payment redirect)
        localStorage.setItem('pending_order', JSON.stringify({
          orderId: paymentData.orderId,
          total: safeCartTotal,
          items: cart.length,
          timestamp: Date.now(),
        }));
        
        message.success({
          content: ' Membuka halaman pembayaran Midtrans...',
          duration: 2,
        });
        
        // Clear cart before redirect
        await clearCart();
        
        // Redirect to Midtrans in same tab (Midtrans will redirect back via callbacks)
        // User will complete payment → Midtrans redirects → Our /order-success page
        window.location.href = paymentResponse.paymentUrl;
      } else {
        // Payment URL not found
        console.error(' Payment URL missing in response:', paymentResponse);
        message.error('Payment URL tidak ditemukan. Silakan coba lagi atau hubungi customer service.');
      }
    } catch (error) {
      console.error('Payment error caught:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Payment gagal. Silakan coba lagi.';
      message.error('Payment failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800">Checkout</h1>
      
      <Steps current={currentStep} className="mb-6 sm:mb-8">
        {steps.map((step, idx) => (
          <Steps.Step key={idx} title={step.title} />
        ))}
      </Steps>

      <Card>
        {steps[currentStep].content}
      </Card>

      {currentStep > 0 && (
        <Button
          className="mt-4"
          size="large"
          onClick={() => setCurrentStep(0)}
        >
          Kembali
        </Button>
      )}
    </div>
  );
}

// Shipping Form Component
function ShippingForm({ onComplete }) {
  const [form] = Form.useForm();
  const { user } = useAuth();

  // Auto-fill form dengan data user jika ada
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, form]);

  const onFinish = (values) => {
    onComplete(values);
  };

  return (
    <div>
      {user && (user.name || user.email || user.phone || user.address) && (
        <Alert
          message="Informasi pengiriman telah diisi otomatis dari profil Anda"
          description="Anda dapat mengubah informasi ini jika diperlukan"
          type="info"
          showIcon
          className="mb-4"
          closable
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Nama Lengkap"
          name="name"
          rules={[{ required: true, message: 'Nama wajib diisi!' }]}
        >
          <Input placeholder="Nama lengkap" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email wajib diisi!' },
            { type: 'email', message: 'Email tidak valid!' }
          ]}
        >
          <Input placeholder="email@example.com" size="large" />
        </Form.Item>

        <Form.Item
          label="No. Telepon"
          name="phone"
          rules={[{ required: true, message: 'Telepon wajib diisi!' }]}
        >
          <Input placeholder="08123456789" size="large" />
        </Form.Item>

        <Form.Item
          label="Alamat Lengkap"
          name="address"
          rules={[{ required: true, message: 'Alamat wajib diisi!' }]}
        >
          <Input.TextArea rows={4} placeholder="Alamat lengkap untuk pengiriman" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Lanjut ke Pembayaran
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Payment Summary Component
function PaymentSummary({ cart, cartTotal, shippingInfo, onPayment, loading }) {
  const shippingCost = 15000; // Fixed shipping cost
  
  // Safe defaults untuk prevent undefined errors
  const safeCartTotal = cartTotal || 0;
  const total = safeCartTotal + shippingCost;
  
  // Helper function untuk format currency dengan null check
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    return Number(value).toLocaleString('id-ID');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>
      
      {/* Shipping Info */}
      <Card size="small" className="mb-4">
        <h4 className="font-semibold mb-2">Informasi Pengiriman:</h4>
        <p className="text-sm mb-1"><strong>Nama:</strong> {shippingInfo.name}</p>
        <p className="text-sm mb-1"><strong>Email:</strong> {shippingInfo.email}</p>
        <p className="text-sm mb-1"><strong>Telepon:</strong> {shippingInfo.phone}</p>
        <p className="text-sm"><strong>Alamat:</strong> {shippingInfo.address}</p>
      </Card>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Produk ({cart.length} items):</h4>
        {cart.map(item => {
          const itemPrice = item.price || 0;
          const itemQuantity = item.quantity || 1;
          const subtotal = itemPrice * itemQuantity;
          
          return (
            <div key={item._id} className="flex justify-between mb-2 text-sm">
              <span>{item.name || 'Produk'} x{itemQuantity}</span>
              <span>Rp {formatCurrency(subtotal)}</span>
            </div>
          );
        })}
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>Rp {formatCurrency(safeCartTotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Ongkir:</span>
          <span>Rp {formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-blue-600 border-t pt-2">
          <span>Total:</span>
          <span>Rp {formatCurrency(total)}</span>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        block
        icon={<CreditCardOutlined />}
        onClick={onPayment}
        loading={loading}
        className="mt-6 h-12"
      >
        Bayar Sekarang via Midtrans
      </Button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Anda akan diarahkan ke halaman pembayaran Midtrans yang aman
      </p>
    </div>
  );
}

export default CheckoutPage;

