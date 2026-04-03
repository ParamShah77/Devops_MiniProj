const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a course name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please provide a course code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  teacher: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: [true, 'Please specify a department'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Please specify credits'],
    min: 1,
    max: 5
  },
  enrollmentPassword: {
    type: String,
    required: [true, 'Please provide an enrollment password']
  },
  description: {
    type: String,
    trim: true
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
