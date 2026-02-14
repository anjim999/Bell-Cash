const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Rent',
  'Insurance',
  'Savings & Investments',
  'Personal Care',
  'Gifts & Donations',
  'Subscriptions',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be at least 0.01'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user queries with date sorting
transactionSchema.index({ userId: 1, date: -1 });
// Text index for search functionality
transactionSchema.index({ title: 'text', notes: 'text', category: 'text' });

// Static method to get categories
transactionSchema.statics.getCategories = function () {
  return CATEGORIES;
};

module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
