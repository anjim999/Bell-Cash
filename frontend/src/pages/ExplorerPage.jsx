import { useState, useEffect, useCallback, useRef } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers';
import {
  MdSearch, MdFilterList, MdClose, MdArrowUpward, MdArrowDownward,
  MdEdit, MdDelete, MdVisibility, MdRefresh, MdExpandMore,
  MdCalendarToday, MdCurrencyRupee, MdCategory, MdSort, MdDescription,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import TransactionModal from '../components/explorer/TransactionModal';
import EditTransactionModal from '../components/explorer/EditTransactionModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

const ExplorerPage = () => {
  const {
    transactions, pagination, loading, filters, categories,
    fetchTransactions, fetchCategories, updateFilters, resetFilters, deleteTransaction,
  } = useTransactions();

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const searchTimeout = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchTransactions(1, 20); }, [filters, fetchTransactions]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => updateFilters({ search: value }), 400);
  };

  const clearSearch = () => { setSearchInput(''); updateFilters({ search: '' }); };

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage && !loading) fetchTransactions(pagination.currentPage + 1, 20);
  }, [pagination, loading, fetchTransactions]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - scrollTop - clientHeight < 200) loadMore();
    };
    const ref = listRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, [loadMore]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteTransaction(deleteTarget._id);
    if (result.success) { toast.success('Transaction deleted'); setDeleteTarget(null); }
    else toast.error(result.message || 'Failed to delete');
  };

  const handleResetFilters = () => { resetFilters(); setSearchInput(''); };

  const activeFilterCount = [
    filters.category !== 'All', filters.type !== 'All',
    filters.startDate, filters.endDate, filters.minAmount, filters.maxAmount,
  ].filter(Boolean).length;

  return (
    <div className="page-container" id="explorer-page">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="page-title">Transaction Explorer</h1>
        <p className="page-subtitle">
          Browse, search and manage your transactions
          {pagination.totalItems > 0 && (
            <span className="ml-2 text-blue-400 font-semibold">({pagination.totalItems} total)</span>
          )}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 mb-6 animate-fade-in-up" id="explorer-toolbar">
        {/* Search */}
        <div className="flex-1 relative flex items-center min-w-0">
          <MdSearch className="absolute left-3 text-lg text-slate-500 pointer-events-none" />
          <input
            type="text"
            className="form-input pl-10 pr-10 w-full"
            placeholder="Search by title or notes..."
            value={searchInput}
            onChange={handleSearchChange}
            id="explorer-search"
          />
          {searchInput && (
            <button className="absolute right-3 text-slate-500 hover:text-slate-200 transition-colors bg-transparent border-none cursor-pointer p-0" onClick={clearSearch}>
              <MdClose />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className={`btn-secondary relative px-3 py-2 text-sm ${showFilters ? '!border-blue-500 !text-blue-400' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            id="toggle-filters"
          >
            <MdFilterList /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            className="form-select min-w-[160px] py-2 text-sm"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              updateFilters({ sortBy, sortOrder });
            }}
            id="explorer-sort"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card p-5 mb-6 animate-fade-in-up" id="filter-panel">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterSelect label="Category" icon={<MdCategory />} value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })} id="filter-category">
              <option value="All">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </FilterSelect>

            <FilterSelect label="Type" icon={<MdSort />} value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value })} id="filter-type">
              <option value="All">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </FilterSelect>

            <FilterInput label="From Date" icon={<MdCalendarToday />} type="date"
              value={filters.startDate} onChange={(e) => updateFilters({ startDate: e.target.value })} id="filter-start-date" />
            <FilterInput label="To Date" icon={<MdCalendarToday />} type="date"
              value={filters.endDate} onChange={(e) => updateFilters({ endDate: e.target.value })} id="filter-end-date" />
            <FilterInput label="Min Amount" icon={<MdCurrencyRupee />} type="number" placeholder="0"
              value={filters.minAmount} onChange={(e) => updateFilters({ minAmount: e.target.value })} id="filter-min-amount" />
            <FilterInput label="Max Amount" icon={<MdCurrencyRupee />} type="number" placeholder="99999"
              value={filters.maxAmount} onChange={(e) => updateFilters({ maxAmount: e.target.value })} id="filter-max-amount" />
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
            <button className="btn-secondary text-sm" onClick={handleResetFilters} id="reset-filters">
              <MdRefresh /> Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="flex flex-col gap-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1" ref={listRef} id="transaction-list">
        {transactions.length > 0 ? (
          <>
            {transactions.map((txn, index) => (
              <div
                className="glass-card flex items-center gap-4 px-5 py-4 cursor-default transition-all duration-200 hover:translate-x-1 hover:border-blue-500/30 group"
                key={txn._id}
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${getCategoryColor(txn.category)}15`, color: getCategoryColor(txn.category) }}
                >
                  {txn.type === 'income' ? <MdArrowDownward /> : <MdArrowUpward />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-sm font-semibold text-slate-200 truncate">{txn.title}</span>
                    <span className={`text-base font-bold font-mono whitespace-nowrap ${txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${getCategoryColor(txn.category)}15`, color: getCategoryColor(txn.category) }}
                    >{txn.category}</span>
                    <span className="text-xs text-slate-500">{formatDate(txn.date)}</span>
                    {txn.notes && <MdDescription className="text-slate-500 text-[10px]" title="Has notes" />}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-icon w-8 h-8 text-sm" title="View" onClick={() => setViewTransaction(txn)}><MdVisibility /></button>
                  <button className="btn-icon w-8 h-8 text-sm" title="Edit" onClick={() => setEditTransaction(txn)}><MdEdit /></button>
                  <button className="btn-icon w-8 h-8 text-sm hover:!text-red-400 hover:!bg-red-500/10 hover:!border-red-500/30" title="Delete" onClick={() => setDeleteTarget(txn)}><MdDelete /></button>
                </div>
              </div>
            ))}

            {/* Load More */}
            {pagination.hasNextPage && (
              <div className="flex flex-col items-center gap-2 py-6">
                <button className="btn-secondary min-w-[220px]" onClick={loadMore} disabled={loading} id="load-more-btn">
                  {loading ? (<><div className="spinner spinner-sm"></div> Loading...</>) : (<><MdExpandMore /> Load More Transactions</>)}
                </button>
                <span className="text-xs text-slate-500">Showing {transactions.length} of {pagination.totalItems}</span>
              </div>
            )}
          </>
        ) : loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3,4,5,6].map((i) => <div className="skeleton" key={i} style={{ height: '80px', borderRadius: '0.75rem' }} />)}
          </div>
        ) : (
          <div className="empty-state animate-fade-in-up">
            <div className="empty-state-icon"><MdSearch /></div>
            <h3 className="empty-state-title">No transactions found</h3>
            <p className="empty-state-text">
              {filters.search || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Start by adding your first transaction'}
            </p>
            {activeFilterCount > 0 && (
              <button className="btn-primary mt-4" onClick={handleResetFilters}><MdRefresh /> Clear Filters</button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {viewTransaction && (
        <TransactionModal transaction={viewTransaction} onClose={() => setViewTransaction(null)}
          onEdit={(txn) => { setViewTransaction(null); setEditTransaction(txn); }} />
      )}
      {editTransaction && (
        <EditTransactionModal transaction={editTransaction} categories={categories} onClose={() => setEditTransaction(null)} />
      )}
      {deleteTarget && (
        <DeleteConfirmModal title="Delete Transaction"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
};

/* Filter Sub-Components */
const FilterSelect = ({ label, icon, value, onChange, id, children }) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-1">
      <span className="text-sm">{icon}</span> {label}
    </label>
    <select className="form-select text-sm" value={value} onChange={onChange} id={id}>{children}</select>
  </div>
);

const FilterInput = ({ label, icon, type, placeholder, value, onChange, id }) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-semibold text-slate-400 mb-1">
      <span className="text-sm">{icon}</span> {label}
    </label>
    <input type={type} className="form-input text-sm" placeholder={placeholder} value={value} onChange={onChange} id={id} />
  </div>
);

export default ExplorerPage;
