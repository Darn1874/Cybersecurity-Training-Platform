const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// User Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/courses';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Admin Dashboard
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const [users, courses, enrollments] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments()
        ]);
        
        res.render('admin/dashboard', { 
            title: 'Admin Dashboard',
            users,
            courses,
            enrollments
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Error loading admin dashboard' 
        });
    }
});

// Manage Courses
router.get('/courses', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'firstName lastName')
            .sort({ createdAt: -1 });
            
        res.render('admin/courses', { 
            title: 'Manage Courses',
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

// Add Course Page
router.get('/courses/add', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' });
        
        res.render('admin/add-course', { 
            title: 'Add New Course',
            instructors 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Error loading form' 
        });
    }
});

// Add Course Handle
router.post('/courses/add', ensureAuthenticated, ensureAdmin, upload.single('image'), async (req, res) => {
    try {
        const { 
            title, 
            description, 
            shortDescription, 
            instructor, 
            category, 
            level, 
            duration, 
            price, 
            discountPrice,
            prerequisites,
            learningOutcomes
        } = req.body;
        
        // Create slug from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newCourse = new Course({
            title,
            slug,
            description,
            shortDescription,
            instructor,
            category,
            level,
            duration: parseInt(duration),
            price: parseFloat(price),
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            image: req.file ? `/uploads/courses/${req.file.filename}` : '/images/default-course.jpg',
            prerequisites: prerequisites.split(',').map(item => item.trim()),
            learningOutcomes: learningOutcomes.split(',').map(item => item.trim()),
            isPublished: false
        });
        
        await newCourse.save();
        
        req.flash('success', 'Course created successfully');
        res.redirect('/admin/courses');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creating course');
        res.redirect('/admin/courses/add');
    }
});

// Publish/Unpublish Course
router.post('/courses/:id/publish', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            req.flash('error', 'Course not found');
            return res.redirect('/admin/courses');
        }
        
        course.isPublished = !course.isPublished;
        if (course.isPublished && !course.publishedAt) {
            course.publishedAt = Date.now();
        }
        
        await course.save();
        
        req.flash('success', `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`);
        res.redirect('/admin/courses');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating course status');
        res.redirect('/admin/courses');
    }
});

module.exports = router;
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
