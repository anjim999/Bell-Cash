const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions for user (with pagination, search, filter)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Type filter (expense/income)
    if (type && type !== 'All') {
      query.type = type;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: total,
          itemsPerPage: Number(limit),
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    const { title, amount, type, category, date, notes, isRecurring, tags } =
      req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      type: type || 'expense',
      category,
      date: date || new Date(),
      notes: notes || '',
      isRecurring: isRecurring || false,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
        errors: errors.array(),
      });
    }

    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const { title, amount, type, category, date, notes, isRecurring, tags } =
      req.body;

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, date, notes, isRecurring, tags },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/transactions/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Aggregate pipeline for current month stats
    const [
      totalStats,
      currentMonthStats,
      lastMonthStats,
      categoryBreakdown,
      monthlyTrend,
      recentTransactions,
      dailySpending
    ] = await Promise.all([
      // All-time total
      Transaction.aggregate([
        { $match: { userId: req.user._id } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Current month
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            date: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Last month
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Category breakdown (current month)
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            type: 'expense',
            date: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),

      // Monthly trend (last 6 months)
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            date: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$date' },
              year: { $year: '$date' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      // Recent transactions (last 5)
      Transaction.find({ userId: req.user._id })
        .sort({ date: -1, createdAt: -1 })
        .limit(5),

      // Daily spending (last 7 days)
      Transaction.aggregate([
        {
          $match: {
            userId: req.user._id,
            type: 'expense',
            date: {
              $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Process stats
    const processStats = (stats) => {
      const result = { expense: 0, income: 0, count: 0 };
      stats.forEach((s) => {
        result[s._id] = s.total;
        result.count += s.count;
      });
      return result;
    };

    const total = processStats(totalStats);
    const currentMonth = processStats(currentMonthStats);
    const lastMonth = processStats(lastMonthStats);

    // Calculate month-over-month change
    const expenseChange =
      lastMonth.expense > 0
        ? ((currentMonth.expense - lastMonth.expense) / lastMonth.expense) * 100
        : currentMonth.expense > 0
        ? 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalExpenses: total.expense,
          totalIncome: total.income,
          balance: total.income - total.expense,
          totalTransactions: total.count,
        },
        currentMonth: {
          expenses: currentMonth.expense,
          income: currentMonth.income,
          balance: currentMonth.income - currentMonth.expense,
          transactionCount: currentMonth.count,
          expenseChange: Math.round(expenseChange * 100) / 100,
        },
        categoryBreakdown: categoryBreakdown.map((cat) => ({
          category: cat._id,
          total: cat.total,
          count: cat.count,
          percentage:
            currentMonth.expense > 0
              ? Math.round((cat.total / currentMonth.expense) * 10000) / 100
              : 0,
        })),
        monthlyTrend,
        recentTransactions,
        dailySpending,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/transactions/categories
// @access  Private
const getCategories = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { categories: Transaction.getCategories() },
  });
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
  getCategories,
};
