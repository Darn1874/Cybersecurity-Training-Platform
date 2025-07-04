const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['network-security', 'ethical-hacking', 'cloud-security', 'devsecops', 'compliance']
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'Duration must be at least 1 week']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    discountPrice: {
        type: Number,
        validate: {
            validator: function(value) {
                return value < this.price;
            },
            message: 'Discount price must be less than regular price'
        }
    },
    image: {
        type: String,
        required: true
    },
    thumbnail: String,
    videoIntro: String,
    prerequisites: [String],
    learningOutcomes: [String],
    sections: [{
        title: String,
        lectures: [{
            title: String,
            duration: Number,
            videoUrl: String,
            resources: [{
                name: String,
                url: String
            }]
        }]
    }],
    totalStudents: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: 4.5
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

// Update timestamp before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
