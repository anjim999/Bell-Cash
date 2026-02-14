const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
  getCategories,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const transactionValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be at least 0.01'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Please provide a valid date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

// Special routes (must be before /:id)
router.get('/stats/dashboard', getDashboardStats);
router.get('/categories', getCategories);

// CRUD routes
router.route('/').get(getTransactions).post(transactionValidation, createTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(transactionValidation, updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
