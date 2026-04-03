const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: [true, 'Please specify a day'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Please specify start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please specify end time']
  },
  room: {
    type: String,
    required: [true, 'Please specify a room']
  },
  teacher: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);
