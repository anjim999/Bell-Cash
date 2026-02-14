import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { MdSave, MdArrowBack, MdTrendingDown, MdTrendingUp } from 'react-icons/md';
import toast from 'react-hot-toast';

const AddTransactionPage = () => {
  const { createTransaction, categories, fetchCategories } = useTransactions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errs.amount = 'Valid amount is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await createTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setLoading(false);
    if (result.success) {
      toast.success('Transaction added!');
      navigate('/explorer');
    } else {
      toast.error(result.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="page-container" id="add-transaction-page">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <MdArrowBack />
        </button>
        <div>
          <h1 className="page-title">Add Transaction</h1>
          <p className="page-subtitle">Record a new income or expense</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 sm:p-10 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6" id="add-transaction-form">
            {/* Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button"
                  className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                    formData.type === 'expense'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'border-white/10 text-slate-500 hover:border-white/20'
                  }`}
                  style={formData.type === 'expense' ? {} : { background: 'rgba(17,24,39,0.5)' }}
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MdTrendingDown /> Expense
                  </span>
                </button>
                <button type="button"
                  className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                    formData.type === 'income'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'border-white/10 text-slate-500 hover:border-white/20'
                  }`}
                  style={formData.type === 'income' ? {} : { background: 'rgba(17,24,39,0.5)' }}
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                >
                  <span className="flex items-center justify-center gap-2">
                    <MdTrendingUp /> Income
                  </span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="txn-title">Title *</label>
              <input type="text" id="txn-title" name="title"
                className={`form-input ${errors.title ? '!border-red-500' : ''}`}
                placeholder="e.g., Grocery Shopping"
                value={formData.title} onChange={handleChange} />
              {errors.title && <span className="text-xs text-red-400 mt-1 block">{errors.title}</span>}
            </div>

            {/* Amount & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="txn-amount">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">₹</span>
                  <input type="number" id="txn-amount" name="amount"
                    className={`form-input pl-8 ${errors.amount ? '!border-red-500' : ''}`}
                    placeholder="0.00" step="0.01" min="0"
                    value={formData.amount} onChange={handleChange} />
                </div>
                {errors.amount && <span className="text-xs text-red-400 mt-1 block">{errors.amount}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="txn-category">Category *</label>
                <select id="txn-category" name="category"
                  className={`form-select ${errors.category ? '!border-red-500' : ''}`}
                  value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <span className="text-xs text-red-400 mt-1 block">{errors.category}</span>}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="txn-date">Date *</label>
              <input type="date" id="txn-date" name="date"
                className={`form-input ${errors.date ? '!border-red-500' : ''}`}
                value={formData.date} onChange={handleChange} />
              {errors.date && <span className="text-xs text-red-400 mt-1 block">{errors.date}</span>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="txn-notes">Notes (optional)</label>
              <textarea id="txn-notes" name="notes"
                className="form-input min-h-[100px] resize-y"
                placeholder="Add any additional notes..."
                value={formData.notes} onChange={handleChange} />
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading} id="submit-transaction">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner spinner-sm"></div> Adding...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2"><MdSave /> Add Transaction</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;
