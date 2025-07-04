const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.lectures'
    }],
    lastAccessed: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateId: String
});

// Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
