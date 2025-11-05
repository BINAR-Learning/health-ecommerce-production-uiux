/**
 * AI Chatbot Service (Frontend)
 * 
 * CATATAN: Ini adalah Service Layer untuk call backend API, BUKAN membuat API!
 * 
 * Flow:
 * Frontend (React) → HTTP Request → Backend API (Node.js) → Google Gemini AI
 * 
 * Backend API endpoint: POST /api/external/ai/chat
 * (ada di: health-ecommerce-external-integration/finished-project/routes/externalRoutes.js)
 */

import apiClient from './api';

/**
 * Send message ke AI chatbot dan get response
 * @param {string} message - Pesan dari user
 * @param {string} context - Context untuk AI (default: health_product_recommendation)
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, context = 'health_product_recommendation') => {
  try {
    const response = await apiClient.post('/api/external/ai/chat', {
      message,
      context
    });

    return response.data;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error(
      error.message || 'Gagal menghubungi AI chatbot. Pastikan backend berjalan dan GEMINI_API_KEY terkonfigurasi.'
    );
  }
};

/**
 * Get product recommendations berdasarkan query
 * @param {string} query - User query untuk rekomendasi
 * @returns {Promise} Product recommendations
 */
export const getProductRecommendations = async (query) => {
  try {
    const response = await sendChatMessage(
      `Berikan rekomendasi produk kesehatan untuk: ${query}`,
      'health_product_recommendation'
    );

    return response;
  } catch (error) {
    console.error('Get Recommendations Error:', error);
    throw error;
  }
};

/**
 * Fetch full product details by ID
 * Fallback jika AI response tidak lengkap
 */
const fetchProductDetails = async (productId) => {
  try {
    const response = await apiClient.get(`/api/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return null;
  }
};

/**
 * Format AI response untuk display di chatbot
 * @param {Object} response - Response dari AI service
 * @returns {Object} Formatted response dengan message dan products
 */
export const formatAIResponse = async (response) => {
  try {
    // Check if response has the expected structure
    if (!response) {
      return {
        message: 'Maaf, saya tidak dapat memberikan rekomendasi saat ini.',
        products: []
      };
    }

    // Extract message and products from response
    const message = response.answer || response.message || 'Berikut adalah rekomendasi produk untuk Anda.';
    const products = response.recommendedProducts || response.products || [];

    // Process products dan ensure all required fields
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        // Ensure _id is set (critical for cart matching)
        const productId = product._id || product.id || product.productId;
        
        if (!productId) {
          console.warn('Product missing ID:', product);
          return null;
        }

        // If product is missing critical fields, try to fetch full details
        const needsFetch = !product.imageUrl || product.stock === undefined;
        
        if (needsFetch) {
          const fullProduct = await fetchProductDetails(productId);
          if (fullProduct) {
            return {
              _id: fullProduct._id || productId,
              id: fullProduct._id || productId,
              name: fullProduct.name || product.name,
              price: fullProduct.price || product.price,
              category: fullProduct.category || product.category,
              description: fullProduct.description || product.description || '',
              imageUrl: fullProduct.imageUrl || product.imageUrl || '/placeholder.webp',
              stock: fullProduct.stock !== undefined ? fullProduct.stock : (product.stock !== undefined ? product.stock : 100),
              manufacturer: fullProduct.manufacturer || product.manufacturer || '',
              isActive: fullProduct.isActive !== undefined ? fullProduct.isActive : true
            };
          }
        }

        // Return formatted product with all fields
        return {
          _id: productId, // Must have _id for cart matching
          id: productId, // Also keep id for compatibility
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description || '',
          imageUrl: product.imageUrl || product.image || '/placeholder.webp',
          stock: product.stock !== undefined ? product.stock : 100, // Default stock
          manufacturer: product.manufacturer || '',
          isActive: product.isActive !== undefined ? product.isActive : true
        };
      })
    );

    return {
      message,
      products: formattedProducts.filter(Boolean) // Remove any null products
    };
  } catch (error) {
    console.error('Format AI Response Error:', error);
    return {
      message: 'Maaf, terjadi kesalahan dalam memproses rekomendasi.',
      products: []
    };
  }
};