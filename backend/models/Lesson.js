const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  videoUrl: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);