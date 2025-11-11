import { Result, Button, Card, Tag } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get parameters dari URL (dari Midtrans redirect)
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status') || searchParams.get('status');
  const statusCode = searchParams.get('status_code');

  useEffect(() => {
    // Log redirect info
    console.log(' Redirected from Midtrans:', {
      orderId,
      transactionStatus,
      statusCode,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    // Check if this is from a successful payment
    if (orderId && (transactionStatus === 'settlement' || transactionStatus === 'capture')) {
      // Clear pending order from localStorage
      localStorage.removeItem('pending_order');
      
      // Optionally clear cart (payment confirmed)
      // Note: Better to do this via webhook in real production
      console.log(' Payment confirmed, order can be processed');
    }
  }, [orderId, transactionStatus, statusCode, searchParams]);

  // Determine status type
  const isPending = transactionStatus === 'pending';
  const isSuccess = transactionStatus === 'settlement' || transactionStatus === 'capture' || !transactionStatus;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 max-w-4xl">
      <Result
        icon={isPending ? <ClockCircleOutlined className="text-orange-500" /> : <CheckCircleOutlined className="text-green-500" />}
        status={isPending ? "warning" : "success"}
        title={isPending ? "Pembayaran Sedang Diproses" : "Pembayaran Berhasil!"}
        subTitle={
          isPending 
            ? "Pembayaran Anda sedang kami proses. Anda akan menerima konfirmasi via email segera." 
            : "Pesanan Anda telah kami terima dan sedang diproses. Terima kasih telah berbelanja!"
        }
        extra={[
          <Button 
            type="primary" 
            key="orderHistory" 
            onClick={() => navigate('/orders')} 
            size="large"
          >
            Cek Status Pesanan
          </Button>,
          <Button key="products" onClick={() => navigate('/products')} size="large">
            Lanjut Belanja
          </Button>,
          <Button key="home" onClick={() => navigate('/')} size="large">
            Kembali ke Home
          </Button>,
        ]}
      >
        {orderId && (
          <Card className="max-w-md mx-auto mb-6" size="small">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Order ID:</span>
              <Tag color="blue" className="font-mono">{orderId}</Tag>
            </div>
            {transactionStatus && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Status:</span>
                <Tag color={isPending ? "orange" : "green"}>
                  {transactionStatus.toUpperCase()}
                </Tag>
              </div>
            )}
          </Card>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl max-w-md mx-auto">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">
            {isPending ? " Selanjutnya:" : " Selanjutnya:"}
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-blue-500 font-bold"></span>
              <span>Konfirmasi pesanan telah dikirim ke email Anda</span>
            </p>
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-blue-500 font-bold"></span>
              <span>Estimasi pengiriman: 2-3 hari kerja</span>
            </p>
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-blue-500 font-bold"></span>
              <span>Nomor resi akan dikirimkan via email</span>
            </p>
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-blue-500 font-bold"></span>
              <span>Hubungi customer service jika ada pertanyaan</span>
            </p>
          </div>
        </div>

        {isPending && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
               Tip: Beberapa metode pembayaran memerlukan waktu konfirmasi. 
              Silakan cek email Anda untuk update status.
            </p>
          </div>
        )}
      </Result>
    </div>
  );
}

export default OrderSuccessPage;

