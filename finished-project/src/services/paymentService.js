/**
 * Payment Service (Frontend)
 * 
 * CATATAN: Ini adalah Service Layer untuk call backend API, BUKAN membuat API!
 * 
 * Flow:
 * Frontend (React) → HTTP Request → Backend API (Node.js) → Midtrans API
 * 
 * Backend API endpoint: POST /api/external/payment/create
 * (ada di: health-ecommerce-external-integration/finished-project/routes/externalRoutes.js)
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
    // Validate input data
    if (!orderData.orderId) {
      throw new Error('Order ID is required');
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Items array is required and cannot be empty');
    }

    // Prepare request payload
    const payload = {
      orderId: orderData.orderId,
      amount: orderData.total || orderData.amount, // Support both total and amount
      items: orderData.items.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: typeof item.price === 'number' ? item.price : parseInt(item.price),
        quantity: item.quantity || 1,
        category: item.category || 'health_product'
      })),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone || '',
    };

    // Log request for debugging
    console.log('Creating payment with payload:', {
      orderId: payload.orderId,
      amount: payload.amount,
      itemsCount: payload.items.length,
      items: payload.items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      customerName: payload.customerName,
      customerEmail: payload.customerEmail
    });

    const response = await apiClient.post('/api/external/payment/create', payload);

    // Comprehensive logging
    console.log(' Payment API Full Response:', {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      dataSuccess: response.data?.success,
      hasDataField: 'data' in (response.data || {}),
      responseDataKeys: response.data ? Object.keys(response.data) : [],
      fullResponseData: response.data,
    });

    // Handle multiple possible response structures
    let paymentUrl = null;
    let token = null;

    // Structure 1: { success: true, data: { paymentUrl, token } }
    if (response.data?.success && response.data?.data) {
      paymentUrl = response.data.data.paymentUrl || response.data.data.redirectUrl;
      token = response.data.data.token;
      console.log(' Structure 1: success + data field');
    }
    // Structure 2: { success: true, paymentUrl, token } (flat structure)
    else if (response.data?.success) {
      paymentUrl = response.data.paymentUrl || response.data.redirectUrl;
      token = response.data.token;
      console.log(' Structure 2: flat structure');
    }
    // Structure 3: Direct response { token, redirect_url }
    else if (response.data?.token || response.data?.redirect_url) {
      paymentUrl = response.data.redirect_url || response.data.redirectUrl;
      token = response.data.token;
      console.log(' Structure 3: direct Midtrans response');
    }

    if (paymentUrl) {
      console.log(' Payment URL found:', paymentUrl);
      return {
        success: true,
        paymentUrl,
        token,
      };
    }

    // If we reach here, payment URL not found in any structure
    console.error(' Payment URL not found in response:', response.data);
    throw new Error('Payment URL not found in response. Backend may have returned unexpected format.');
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
