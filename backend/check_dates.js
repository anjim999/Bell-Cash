const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');

dotenv.config();

const checkDates = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const transactions = await Transaction.find({
    date: { $gte: last7Days }
  });
  
  console.log(`Total transactions in last 7 days: ${transactions.length}`);
  transactions.forEach(t => {
    console.log(`Date: ${t.date} | Type: ${t.type} | Amount: ${t.amount}`);
  });
  
  const expenses = transactions.filter(t => t.type === 'expense');
  console.log(`Expenses in last 7 days: ${expenses.length}`);

  process.exit(0);
};

checkDates();
