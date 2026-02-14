const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'name email');
  users.forEach(u => console.log(`User: ${u.name} | ${u.email} | ID: ${u._id}`));
  
  const stats = await Transaction.aggregate([
    { $group: { _id: '$userId', count: { $sum: 1 } } }
  ]);
  stats.forEach(s => console.log(`User ID: ${s._id} | Count: ${s.count}`));
  process.exit(0);
};

check();
