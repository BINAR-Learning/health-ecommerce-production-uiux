/**
 * AI Chatbot Service
 * Service untuk interact dengan Google Gemini AI melalui backend
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
