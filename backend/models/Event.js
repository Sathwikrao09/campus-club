const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  clubName: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Academic', 'Social'],
    required: [true, 'Category is required'],
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required'],
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  expectedAttendees: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewNote: {
    type: String,
    default: '',
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
