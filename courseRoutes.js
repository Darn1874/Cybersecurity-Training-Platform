const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate('instructor', 'firstName lastName profilePicture')
            .limit(6);
            
        res.render('courses/index', { 
            title: 'Our Courses',
            courses 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Error loading courses' 
        });
    }
});

// Get single course
router.get('/:slug', async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
            .populate('instructor', 'firstName lastName profilePicture bio')
            .populate('reviews.user', 'firstName lastName profilePicture');
            
        if (!course) {
            return res.status(404).render('error', { 
                title: 'Not Found', 
                message: 'Course not found' 
            });
        }
        
        // Check if user is enrolled
        let isEnrolled = false;
        if (req.user) {
            const enrollment = await Enrollment.findOne({ 
                user: req.user._id, 
                course: course._id 
            });
            isEnrolled = !!enrollment;
        }
        
        res.render('courses/show', { 
            title: course.title,
            course,
            isEnrolled
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Error loading course' 
        });
    }
});

// Enroll in course
router.post('/:id/enroll', ensureAuthenticated, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            req.flash('error', 'Course not found');
            return res.redirect('/courses');
        }
        
        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: course._id
        });
        
        if (existingEnrollment) {
            req.flash('error', 'You are already enrolled in this course');
            return res.redirect(`/courses/${course.slug}`);
        }
        
        // Create new enrollment
        const enrollment = new Enrollment({
            user: req.user._id,
            course: course._id
        });
        
        await enrollment.save();
        
        // Update course student count
        course.totalStudents += 1;
        await course.save();
        
        req.flash('success', 'Successfully enrolled in course');
        res.redirect(`/user/courses/${course.slug}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error enrolling in course');
        res.redirect('/courses');
    }
});

module.exports = router;
