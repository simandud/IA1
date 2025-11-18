const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword,
  updatePrivacySettings,
  googleCallback,
  facebookCallback
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validator');

// Standard auth routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/privacy-settings', protect, updatePrivacySettings);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// Facebook OAuth routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  facebookCallback
);

module.exports = router;
