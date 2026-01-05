
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

// Manually register Transmit routes if the provider failed to do so automatically
transmit.registerRoutes()

const DeliveriesController = () => import('#controllers/deliveries_controller')
const ProductsControllerPublic = () => import('#controllers/products_controller')
const MediaController = () => import('#controllers/media_controller')

router.get('/', async () => {
  return {
    hello: 'world',
    service: 'delivery-api',
    status: 'running'
  }
})

// Public Product routes
router.get('/api/products', [ProductsControllerPublic, 'index'])
router.get('/api/products/:id', [ProductsControllerPublic, 'show'])

// Media proxy route (serves S3 files publicly)
router.get('/api/media/*', [MediaController, 'serve'])

// Public settings route (for storefront to fetch dynamic config)
const PublicSettingsController = () => import('#controllers/public_settings_controller')
router.get('/api/settings/public', [PublicSettingsController, 'index'])

router.group(() => {
  router.post('/estimate', [DeliveriesController, 'estimate'])
  router.get('/search', [DeliveriesController, 'searchPlaces'])
  router.post('/create', [DeliveriesController, 'create'])
}).prefix('api/deliveries')

// Payment routes (Moneroo integration)
const PaymentsController = () => import('#controllers/payments_controller')

router.group(() => {
  router.post('/initiate', [PaymentsController, 'initiate'])
  router.get('/verify/:paymentId?', [PaymentsController, 'verify'])
  router.post('/proof', [PaymentsController, 'submitProof'])
  router.post('/submit-reference', [PaymentsController, 'submitReference'])
  router.post('/webhook', [PaymentsController, 'webhook'])
  router.post('/httpsms-webhook', [PaymentsController, 'httpsmsWebhook'])
}).prefix('api/payments')

// Customer Auth routes
const CustomerAuthController = () => import('#controllers/auth_controller')

router.group(() => {
  router.post('/register', [CustomerAuthController, 'register'])
  router.post('/login', [CustomerAuthController, 'login'])
  router.get('/me', [CustomerAuthController, 'me'])
  router.get('/orders', [CustomerAuthController, 'orders'])
  router.patch('/profile', [CustomerAuthController, 'updateProfile'])

  // OTP Auth
  router.post('/send-otp', [CustomerAuthController, 'sendOtp'])
  router.post('/verify-otp', [CustomerAuthController, 'verifyOtp'])

  // Addresses
  router.post('/addresses', [CustomerAuthController, 'addAddress'])
  router.patch('/addresses/:id', [CustomerAuthController, 'updateAddress'])
  router.delete('/addresses/:id', [CustomerAuthController, 'deleteAddress'])
  router.patch('/addresses/:id/default', [CustomerAuthController, 'setDefaultAddress'])
}).prefix('api/auth')

// OTP for phone change (separate routes with security)
const OtpController = () => import('#controllers/otp_controller')
router.group(() => {
  router.post('/request-phone-change', [OtpController, 'requestPhoneChange'])
  router.post('/verify-phone-change', [OtpController, 'verifyPhoneChange'])
}).prefix('api/otp')

// Admin routes
const AdminAuthController = () => import('#controllers/admin/auth_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminTestimonialsController = () => import('#controllers/admin/testimonials_controller')
const AdminProductsController = () => import('#controllers/admin/products_controller')
const AdminShippingController = () => import('#controllers/admin/shipping_controller')
const AdminUploadsController = () => import('#controllers/admin/uploads_controller')
const AdminSettingsController = () => import('#controllers/admin/settings_controller')

// Admin Auth (public)
router.group(() => {
  router.post('/login', [AdminAuthController, 'login'])
  router.post('/send-otp', [AdminAuthController, 'sendOtp'])
  router.post('/verify-otp', [AdminAuthController, 'verifyOtp'])
  router.post('/seed', [AdminAuthController, 'seedAdmin']) // First-time setup only
}).prefix('api/admin/auth')

// Admin Protected Routes
router.group(() => {
  // Auth
  router.get('/me', [AdminAuthController, 'me'])
  router.post('/users', [AdminAuthController, 'create'])

  // Dashboard
  router.get('/dashboard', [AdminDashboardController, 'overview'])
  router.get('/notifications', [AdminDashboardController, 'notifications'])
  router.get('/orders', [AdminDashboardController, 'orders'])

  router.get('/orders/:id', [AdminDashboardController, 'orderDetails'])
  router.patch('/orders/:id/status', [AdminDashboardController, 'updateOrderStatus'])
  router.patch('/orders/:id/manual-status', [AdminDashboardController, 'updateManualPaymentStatus'])

  // Dead Letter Queue
  router.get('/dlq', [AdminDashboardController, 'dlq'])
  router.post('/dlq/:id/retry', [AdminDashboardController, 'retryNotification'])

  // Testimonials
  router.get('/testimonials', [AdminTestimonialsController, 'index'])
  router.get('/testimonials/:id', [AdminTestimonialsController, 'show'])
  router.post('/testimonials', [AdminTestimonialsController, 'store'])
  router.patch('/testimonials/:id', [AdminTestimonialsController, 'update'])
  router.delete('/testimonials/:id', [AdminTestimonialsController, 'destroy'])
  router.post('/testimonials/:id/toggle', [AdminTestimonialsController, 'toggle'])
  router.post('/testimonials/reorder', [AdminTestimonialsController, 'reorder'])

  // Products
  router.get('/products', [AdminProductsController, 'index'])
  router.get('/products/:id', [AdminProductsController, 'show'])
  router.post('/products', [AdminProductsController, 'store'])
  router.patch('/products/:id', [AdminProductsController, 'update'])
  router.delete('/products/:id', [AdminProductsController, 'destroy'])
  router.post('/products/:id/toggle', [AdminProductsController, 'toggle'])
  router.post('/products/seed', [AdminProductsController, 'seed'])

  // Shipping
  router.get('/shipping', [AdminShippingController, 'index'])
  router.get('/shipping/:id', [AdminShippingController, 'show'])
  router.post('/shipping', [AdminShippingController, 'store'])
  router.patch('/shipping/:id', [AdminShippingController, 'update'])
  router.delete('/shipping/:id', [AdminShippingController, 'destroy'])
  router.post('/shipping/:id/toggle', [AdminShippingController, 'toggle'])
  router.post('/shipping/seed', [AdminShippingController, 'seed'])

  // Admin - Payments
  router.get('/payments', [PaymentsController, 'listPayments'])
  router.post('/payments/:id/confirm', [PaymentsController, 'adminConfirm'])

  // Test Notification
  router.get('/test-notification', [AdminDashboardController, 'testNotification'])

  // Uploads (S3/Garage)
  router.post('/uploads/image', [AdminUploadsController, 'upload'])
  router.post('/uploads/video', [AdminUploadsController, 'uploadVideo'])
  router.delete('/uploads', [AdminUploadsController, 'delete'])

  // Settings
  router.get('/settings', [AdminSettingsController, 'index'])
  router.get('/settings/:key', [AdminSettingsController, 'show'])
  router.patch('/settings/:key', [AdminSettingsController, 'update'])
  router.post('/settings', [AdminSettingsController, 'store'])
  router.post('/settings/bulk', [AdminSettingsController, 'bulkUpdate'])
  router.delete('/settings/:key', [AdminSettingsController, 'destroy'])
}).prefix('api/admin')
