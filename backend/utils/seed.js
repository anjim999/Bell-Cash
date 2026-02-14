const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Transaction = require('../models/Transaction');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@bellcorp.com',
      password: 'demo123456',
      currency: 'INR',
      monthlyBudget: 50000,
    });

    console.log('👤 Created demo user: demo@bellcorp.com / demo123456');

    // Create sample transactions
    const categories = Transaction.getCategories();
    const titles = {
      'Food & Dining': ['Lunch at Cafe', 'Dinner with Friends', 'Coffee Shop', 'Pizza Night', 'Breakfast'],
      'Transportation': ['Uber Ride', 'Metro Pass', 'Fuel', 'Ola Cab', 'Bus Ticket'],
      'Shopping': ['New Shoes', 'Electronics Store', 'Amazon Order', 'Clothing', 'Home Decor'],
      'Entertainment': ['Movie Tickets', 'Netflix Sub', 'Concert', 'Gaming', 'Books'],
      'Bills & Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill', 'Gas Bill'],
      'Healthcare': ['Doctor Visit', 'Pharmacy', 'Lab Tests', 'Supplements', 'Dental Checkup'],
      'Education': ['Online Course', 'Books', 'Workshop Fee', 'Tuition', 'Stationery'],
      'Travel': ['Flight Tickets', 'Hotel Stay', 'Travel Insurance', 'Sightseeing', 'Airport Transfer'],
      'Groceries': ['Weekly Groceries', 'Fruits & Veggies', 'Dairy Products', 'Snacks', 'Beverages'],
      'Rent': ['Monthly Rent', 'Maintenance Fee', 'Parking Fee'],
      'Insurance': ['Health Insurance', 'Life Insurance', 'Vehicle Insurance'],
      'Savings & Investments': ['SIP Investment', 'Fixed Deposit', 'Stock Purchase'],
      'Personal Care': ['Salon Visit', 'Skincare Products', 'Gym Membership'],
      'Gifts & Donations': ['Birthday Gift', 'Charity Donation', 'Wedding Gift'],
      'Subscriptions': ['Spotify', 'YouTube Premium', 'Cloud Storage'],
      'Other': ['Miscellaneous', 'ATM Withdrawal', 'Deposit'],
    };

    const transactions = [];
    const now = new Date();

    // Generate 30 transactions as requested
    for (let i = 0; i < 30; i++) {
      const monthsAgo = Math.floor(Math.random() * 12);
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate() - daysAgo);
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const titleList = titles[category] || ['Transaction'];
      const title = titleList[Math.floor(Math.random() * titleList.length)];
      
      // Mix of income and expenses
      const isIncome = Math.random() < 0.2; // 20% chance of income
      
      let amount;
      if (isIncome) {
        // Larger income amounts (Salary, Freelance, etc.)
        amount = Math.round((Math.random() * 50000 + 40000) * 100) / 100;
      } else {
        // Varied expense amounts
        amount = Math.round((Math.random() * 5000 + 100) * 100) / 100;
        // Occasional large expense
        if (Math.random() < 0.1) amount += 5000;
      }

      transactions.push({
        userId: user._id,
        title: isIncome ? 'Income Credit' : title,
        amount,
        type: isIncome ? 'income' : 'expense',
        category: isIncome ? 'Other' : category,
        date,
        notes: Math.random() > 0.3 ? `Generated sample data for ${title}` : '',
        isRecurring: Math.random() < 0.1,
      });
    }

    await Transaction.insertMany(transactions);
    console.log(`📝 Created ${transactions.length} sample transactions`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('   Login: demo@bellcorp.com / demo123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
