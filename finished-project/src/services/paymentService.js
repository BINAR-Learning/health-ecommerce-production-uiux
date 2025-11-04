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
    const response = await apiClient.post('/api/external/payment/create', orderData);

    if (response.data.success && response.data.data.paymentUrl) {
      return response.data.data;
    } else {
      throw new Error('Invalid payment response');
    }
  } catch (error) {
    console.error('Payment Service Error:', error);
    throw new Error(
      error.message || 
      'Gagal membuat pembayaran. Pastikan backend berjalan dan MIDTRANS keys terkonfigurasi.'
    );
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
