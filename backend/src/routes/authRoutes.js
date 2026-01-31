import express from 'express';
import { sendSignupOtp, verifySignupOtp } from '../Controllers/signupOtpController.js';

const router = express.Router();

router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);

export default router;
