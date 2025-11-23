// routes/authRoutes.js
import { Router } from 'express';
import { signup, login, forgotPassword,
      getDashboardStats,sendResetCode,
      verifyCode, resetPassword,
      getAssets, updateAsset} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js'; // assumes JWT or session-based auth
const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword); // ✅ Add this
router.post('/dashboard', getDashboardStats); // ✅ Add this route
router.post('/forgot-password', sendResetCode);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);
router.get('/', authenticate, getAssets);
router.put('/:id', authenticate, updateAsset);

export default router;