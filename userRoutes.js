const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// User Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({
                path: 'course',
                select: 'title image slug instructor',
                populate: {
                    path: 'instructor',
                    select: 'firstName lastName'
                }
            });
            
        res.render('user/dashboard', { 
            title: 'Dashboard',
            enrollments 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Error loading dashboard' 
        });
    }
});

// View enrolled course
router.get('/courses/:slug', ensure
