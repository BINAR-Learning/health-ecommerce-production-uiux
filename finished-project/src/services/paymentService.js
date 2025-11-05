/**
 * Payment Service
 * Service untuk integrate dengan Midtrans payment gateway melalui backend
 */

import apiClient from './api';

/**
 * Create payment transaction via Midtrans
 * @param {Object} orderData - Order data untuk payment
 * @param {string} orderData.orderId - Unique order ID
 * @param {number} orderData.amount - Total amount
 * @param {Array} orderData.items - Array of items
 * @param {Object} orderData.customerDetails - Customer info
 * @returns {Promise} Payment URL dan token
 */
export const createPayment = async (orderData) => {
  try {
    const response = await apiClient.post('/api/external/payment/create', {
      orderId: orderData.orderId,
      amount: orderData.total,
      items: orderData.items.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        category: item.category || 'health_product'
      })),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || '',
    });

    // Handle response
    if (response.data.success && response.data.data) {
      return {
        success: true,
        paymentUrl: response.data.data.paymentUrl || response.data.data.redirectUrl,
        token: response.data.data.token,
      };
    } else {
      // Handle error response from backend
      const errorMessage = response.data.message || 'Payment creation failed';
      const errorDetails = response.data.details || '';
      
      throw new Error(
        errorMessage + (errorDetails ? `\n${errorDetails}` : '')
      );
    }
  } catch (error) {
    console.error('Payment Service Error:', error);
    
    // Enhanced error handling
    if (error.response) {
      // Backend returned error
      const errorData = error.response.data;
      const errorMessage = errorData?.message || 
        'Gagal membuat pembayaran. Pastikan backend berjalan dan MIDTRANS_SERVER_KEY terkonfigurasi di .env file.';
      
      throw new Error(errorMessage);
    } else if (error.request) {
      // Network error
      throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000');
    } else {
      // Other errors
      throw error;
    }
  }
};

/**
 * Open Midtrans Snap payment popup
 * @param {string} snapToken - Snap token from createPayment
 * @param {Function} onSuccess - Callback when payment success
 * @param {Function} onPending - Callback when payment pending
 * @param {Function} onError - Callback when payment error
 */
export const openSnapPayment = (snapToken, onSuccess, onPending, onError) => {
  if (!window.snap) {
    console.error('Midtrans Snap.js not loaded');
    if (onError) {
      onError(new Error('Midtrans Snap.js belum dimuat. Silakan refresh halaman.'));
    }
    return;
  }

  window.snap.pay(snapToken, {
    onSuccess: (result) => {
      console.log('Payment Success:', result);
      if (onSuccess) onSuccess(result);
    },
    onPending: (result) => {
      console.log('Payment Pending:', result);
      if (onPending) onPending(result);
    },
    onError: (result) => {
      console.error('Payment Error:', result);
      if (onError) onError(result);
    },
    onClose: () => {
      console.log('Payment popup closed');
    }
  });
};

/**
 * Load Midtrans Snap.js script
 * Call this in your component's useEffect
 */
export const loadSnapScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.snap) {
      resolve(window.snap);
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Sandbox
    // For production: https://app.midtrans.com/snap/snap.js
    
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      reject(new Error('VITE_MIDTRANS_CLIENT_KEY not configured'));
      return;
    }

    script.setAttribute('data-client-key', clientKey);
    script.onload = () => resolve(window.snap);
    script.onerror = () => reject(new Error('Failed to load Midtrans Snap.js'));
    
    document.body.appendChild(script);
  });
};
