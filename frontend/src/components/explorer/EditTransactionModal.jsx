import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { MdClose, MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';

const EditTransactionModal = ({ transaction, categories, onClose }) => {
  const { updateTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense',
    date: transaction?.date ? transaction.date.split('T')[0] : '',
    notes: transaction?.notes || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const result = await updateTransaction(transaction._id, {
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setLoading(false);
    if (result.success) {
      toast.success('Transaction updated!');
      onClose();
    } else {
      toast.error(result.message || 'Failed to update');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose} id="edit-transaction-modal"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 animate-scale-in"
        style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.95), rgba(30,41,59,0.9))', boxShadow: '0 20px 25px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-100">Edit Transaction</h2>
          <button className="btn-icon w-8 h-8 text-sm" onClick={onClose}><MdClose /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
            <input type="text" name="title" className="form-input" placeholder="Transaction title"
              value={formData.title} onChange={handleChange} />
          </div>

          {/* Amount & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Amount *</label>
              <input type="number" name="amount" className="form-input" placeholder="0.00" step="0.01" min="0"
                value={formData.amount} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
              <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date *</label>
              <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Notes (optional)</label>
            <textarea name="notes" className="form-input min-h-[80px] resize-y" placeholder="Add a note..."
              value={formData.notes} onChange={handleChange} />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary text-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading}>
              {loading ? (<><div className="spinner spinner-sm"></div> Saving...</>) : (<><MdSave /> Save Changes</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
