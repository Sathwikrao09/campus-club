const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/events/approved  - public calendar (students)
router.get('/approved', protect, async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .populate('submittedBy', 'name email')
      .sort({ dateTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events  - all events (admin/clubadmin)
router.get('/', protect, requireRole('clubadmin', 'superadmin'), async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'clubadmin') filter.submittedBy = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    const events = await Event.find(filter)
      .populate('submittedBy', 'name email clubName')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('submittedBy', 'name email clubName')
      .populate('reviewedBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events  - club admin submits event
router.post('/', protect, requireRole('clubadmin', 'superadmin'), async (req, res) => {
  try {
    const { name, clubName, category, dateTime, venue, description, expectedAttendees } = req.body;
    const event = await Event.create({
      name, clubName, category, dateTime, venue, description,
      expectedAttendees: expectedAttendees || 0,
      submittedBy: req.user._id,
      status: req.user.role === 'superadmin' ? 'approved' : 'pending',
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id/approve  - superadmin approves
router.put('/:id/approve', protect, requireRole('superadmin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', reviewedBy: req.user._id, reviewedAt: new Date(), reviewNote: req.body.note || '' },
      { new: true }
    ).populate('submittedBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id/reject  - superadmin rejects
router.put('/:id/reject', protect, requireRole('superadmin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reviewedBy: req.user._id, reviewedAt: new Date(), reviewNote: req.body.note || '' },
      { new: true }
    ).populate('submittedBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id  - update event (owner or superadmin)
router.put('/:id', protect, requireRole('clubadmin', 'superadmin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (req.user.role !== 'superadmin' && event.submittedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', protect, requireRole('clubadmin', 'superadmin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (req.user.role !== 'superadmin' && event.submittedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
