import { formatCurrency, formatDate, getCategoryColor } from '../../utils/helpers';
import { MdClose, MdEdit, MdArrowUpward, MdArrowDownward, MdCalendarToday, MdCategory, MdNotes, MdLabel } from 'react-icons/md';

const TransactionModal = ({ transaction, onClose, onEdit }) => {
  if (!transaction) return null;
  const txn = transaction;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose} id="view-transaction-modal"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 animate-scale-in"
        style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.95), rgba(30,41,59,0.9))', boxShadow: '0 20px 25px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-100">Transaction Details</h2>
          <button className="btn-icon w-8 h-8 text-sm" onClick={onClose}><MdClose /></button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          {/* Amount */}
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-2xl"
              style={{ backgroundColor: `${getCategoryColor(txn.category)}15`, color: getCategoryColor(txn.category) }}
            >
              {txn.type === 'income' ? <MdArrowDownward /> : <MdArrowUpward />}
            </div>
            <div className={`text-3xl font-extrabold tracking-tight ${txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
            </div>
            <div className="text-slate-500 mt-1 text-sm font-medium">{txn.type === 'income' ? 'Income' : 'Expense'}</div>
          </div>

          {/* Details */}
          <div className="space-y-0">
            <DetailRow icon={<MdLabel />} label="Title" value={txn.title} />
            <DetailRow icon={<MdCategory />} label="Category"
              value={
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${getCategoryColor(txn.category)}15`, color: getCategoryColor(txn.category) }}
                >{txn.category}</span>
              }
            />
            <DetailRow icon={<MdCalendarToday />} label="Date" value={formatDate(txn.date)} />
            {txn.notes && <DetailRow icon={<MdNotes />} label="Notes" value={txn.notes} />}
            {txn.tags?.length > 0 && (
              <DetailRow icon={<MdLabel />} label="Tags"
                value={<div className="flex flex-wrap gap-1">{txn.tags.map((tag) => (
                  <span key={tag} className="badge badge-violet text-xs">{tag}</span>
                ))}</div>}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button className="btn-secondary text-sm" onClick={onClose}>Close</button>
          <button className="btn-primary text-sm" onClick={() => onEdit(txn)}><MdEdit /> Edit</button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/5">
    <span className="text-slate-500 text-lg mt-0.5">{icon}</span>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-medium text-slate-500 mb-0.5">{label}</div>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  </div>
);

export default TransactionModal;
