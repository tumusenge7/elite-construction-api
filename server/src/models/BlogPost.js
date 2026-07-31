const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String
  },
  content: {
    type: String
  },
  featuredImage: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory'
  },
  tags: {
    type: [String]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
