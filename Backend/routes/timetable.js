const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, isTeacher } = require('../middleware/auth');

// @route   GET /api/timetable
// @desc    Get all timetable entries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate('courseId', 'name code')
      .populate('teacherId', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timetable/course/:courseId
// @desc    Get timetable entries by course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const timetable = await Timetable.find({ courseId: req.params.courseId })
      .sort({ day: 1, startTime: 1 });

    res.json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/timetable/teacher/:teacherId
// @desc    Get timetable entries by teacher
// @access  Private
router.get('/teacher/:teacherId', protect, async (req, res) => {
  try {
    const timetable = await Timetable.find({ teacherId: req.params.teacherId })
      .sort({ day: 1, startTime: 1 });

    res.json(timetable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/timetable
// @desc    Create a timetable entry
// @access  Private (Teacher only)
router.post('/', protect, isTeacher, async (req, res) => {
  try {
    const { courseId, courseName, courseCode, day, startTime, endTime, room } = req.body;

    const timetableEntry = await Timetable.create({
      courseId,
      courseName,
      courseCode,
      day,
      startTime,
      endTime,
      room,
      teacher: req.user.name,
      teacherId: req.user._id
    });

    res.status(201).json(timetableEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update a timetable entry
// @access  Private (Teacher only - own entries)
router.put('/:id', protect, isTeacher, async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    // Check if the user is the teacher of this entry
    if (timetableEntry.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete a timetable entry
// @access  Private (Teacher only - own entries)
router.delete('/:id', protect, isTeacher, async (req, res) => {
  try {
    const timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    // Check if the user is the teacher of this entry
    if (timetableEntry.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
