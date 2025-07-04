const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

// Login Page
router.get('/login', ensureGuest, (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

// Login Handle
router.post('/login', ensureGuest, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Register Page
router.get('/register', ensureGuest, (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

// Register Handle
router.post('/register', ensureGuest, async (req, res) => {
    try {
        const { firstName, lastName, email, password, password2 } = req.body;
        
        // Validation
        if (password !== password2) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/auth/register');
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email is already registered');
            return res.redirect('/auth/register');
        }
        
        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: 'student'
        });
        
        await newUser.save();
        
        req.flash('success', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/auth/register');
    }
});

// Logout Handle
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});

module.exports = router;
