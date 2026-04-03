const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, isTeacher } = require('../middleware/auth');

// @route   GET /api/notices
// @desc    Get all notices
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { department } = req.query;

    let query = {};
    if (department) {
      query.department = department;
    }

    const notices = await Notice.find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notices/:id
// @desc    Get notice by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('authorId', 'name email');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/notices
// @desc    Create a notice
// @access  Private (Teacher only)
router.post('/', protect, isTeacher, async (req, res) => {
  try {
    const { title, content, priority, department } = req.body;

    const notice = await Notice.create({
      title,
      content,
      author: req.user.name,
      authorId: req.user._id,
      priority: priority || 'medium',
      department: department || req.user.department
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update a notice
// @access  Private (Teacher only - own notices)
router.put('/:id', protect, isTeacher, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check if the user is the author of this notice
    if (notice.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this notice' });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedNotice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
// @access  Private (Teacher only - own notices)
router.delete('/:id', protect, isTeacher, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Check if the user is the author of this notice
    if (notice.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this notice' });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notices/department/:department
// @desc    Get notices by department
// @access  Private
router.get('/department/:department', protect, async (req, res) => {
  try {
    const notices = await Notice.find({ department: req.params.department })
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
