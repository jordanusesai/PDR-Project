const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'GBP',
    uppercase: true
  },
  conversionRate: {
    type: Number,
    required: true,
    min: 0,
    default: 1.00
  },
  amountGBP: {
    type: Number,
    required: true,
    min: 0
  },
  expenseType: {
    type: String,
    required: true,
    enum: ['food', 'accommodation', 'transport', 'entertainment', 'shopping', 'other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitBetween: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate amountGBP before saving
expenseSchema.pre('save', function(next) {
  this.amountGBP = this.amount * this.conversionRate;
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
