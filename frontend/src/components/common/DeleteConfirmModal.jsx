import { MdWarning } from 'react-icons/md';

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 animate-scale-in text-center p-6"
        style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.95), rgba(30,41,59,0.9))', boxShadow: '0 20px 25px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-red-400 mx-auto mb-4"
          style={{ background: 'rgba(239,68,68,0.1)' }}
        >
          <MdWarning />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button className="btn-secondary text-sm px-6" onClick={onCancel}>Cancel</button>
          <button className="btn-danger text-sm px-6" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
