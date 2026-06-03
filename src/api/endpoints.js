import api from './client.js';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put('/auth/reset-password/' + token, data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get('/products/' + id),
  getFeatured: (limit) => api.get('/products/featured', { params: { limit } }),
  getBestSellers: (limit) => api.get('/products/best-sellers', { params: { limit } }),
  getNewArrivals: (limit) => api.get('/products/new-arrivals', { params: { limit } }),
  getTrending: (limit) => api.get('/products/trending', { params: { limit } }),
  getRelated: (id) => api.get('/products/related/' + id),
  search: (q) => api.get('/products/search', { params: { q } }),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put('/products/' + id, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete('/products/' + id),
  bulkUpload: (products) => api.post('/products/bulk-upload', { products }),
};

export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get('/categories/' + id),
  getProducts: (id, params) => api.get('/categories/' + id + '/products', { params }),
  create: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put('/categories/' + id, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete('/categories/' + id),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get('/orders/' + id),
  cancel: (id, reason) => api.put('/orders/' + id + '/cancel', { reason }),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put('/orders/' + id + '/status', data),
  refund: (id, data) => api.put('/orders/' + id + '/refund', data),
  getInvoice: (id) => api.get('/orders/' + id + '/invoice'),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateItem: (itemId, data) => api.put('/cart/item/' + itemId, data),
  removeItem: (itemId) => api.delete('/cart/item/' + itemId),
  clear: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist/add', { productId }),
  remove: (productId) => api.delete('/wishlist/' + productId),
  clear: () => api.delete('/wishlist'),
};

// export const reviewAPI = {
//   create: (data) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   getProductReviews: (productId, params) => api.get('/products/' + productId + '/reviews', { params }),
//   getAll: (params) => api.get('/reviews/admin/all', { params }),
//   approve: (id) => api.put('/reviews/' + id + '/approve'),
//   delete: (id) => api.delete('/reviews/' + id),
// };

export const reviewAPI = {
  create: (data) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getProductReviews: (productId, params) => api.get(`/products/${productId}/reviews`, { params }),
  getUserReviews: () => api.get('/reviews/my-reviews'),   // new: get current user's reviews
  update: (id, data) => api.put(`/reviews/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  // admin only
  getAll: (params) => api.get('/reviews/admin/all', { params }),
  approve: (id) => api.put(`/reviews/${id}/approve`),
};

export const couponAPI = {
  getAll: (params) => api.get('/coupons', { params }),
  getPublic: () => api.get('/coupons/public'),
  validate: (data) => api.post('/coupons/validate', data),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put('/coupons/' + id, data),
  delete: (id) => api.delete('/coupons/' + id),
};

export const addressAPI = {
  getAll: () => api.get('/addresses'),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put('/addresses/' + id, data),
  delete: (id) => api.delete('/addresses/' + id),
  setDefault: (id) => api.put('/addresses/' + id + '/default'),
};

export const paymentAPI = {
  getRazorpayKey: () => api.get('/payment/key'),
  createOrder: (data) => api.post('/payment/razorpay/create', data),
  verifyPayment: (data) => api.post('/payment/razorpay/verify', data),
  mockVerify: (orderId) => api.post('/payment/mock/verify', { orderId }),
  confirmCOD: (orderId) => api.post('/payment/cod/confirm', { orderId }),
};

export const settingsAPI = {
  getPublic: () => api.get('/settings/public'),
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateHeroBanners: (formData) => api.put('/settings/hero-banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateGallery: (images) => api.put('/settings/gallery', { galleryImages: images }),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRevenue: (period) => api.get('/analytics/revenue', { params: { period } }),
  getSales: (params) => api.get('/analytics/sales', { params }),
  getTopProducts: (limit) => api.get('/analytics/top-products', { params: { limit } }),
  getCategoryReport: () => api.get('/analytics/categories'),
  getCustomerReport: () => api.get('/analytics/customers'),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get('/users/' + id),
  update: (id, data) => api.put('/users/' + id, data),
  block: (id) => api.put('/users/' + id + '/block'),
  unblock: (id) => api.put('/users/' + id + '/unblock'),
  delete: (id) => api.delete('/users/' + id),
  getStats: () => api.get('/users/me/stats'),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  unsubscribe: (data) => api.post('/newsletter/unsubscribe', data),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadImages: (formData) => api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (publicId) => api.post('/upload/delete', { public_id: publicId }),
};
