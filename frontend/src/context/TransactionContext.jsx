import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const TransactionContext = createContext(null);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Filters state (persisted during browsing)
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Fetch transactions with pagination and filters
  const fetchTransactions = useCallback(async (page = 1, limit = 20, customFilters = null) => {
    try {
      setLoading(true);
      const activeFilters = customFilters || filters;
      const params = new URLSearchParams();

      params.append('page', page);
      params.append('limit', limit);

      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.category && activeFilters.category !== 'All') params.append('category', activeFilters.category);
      if (activeFilters.type && activeFilters.type !== 'All') params.append('type', activeFilters.type);
      if (activeFilters.startDate) params.append('startDate', activeFilters.startDate);
      if (activeFilters.endDate) params.append('endDate', activeFilters.endDate);
      if (activeFilters.minAmount) params.append('minAmount', activeFilters.minAmount);
      if (activeFilters.maxAmount) params.append('maxAmount', activeFilters.maxAmount);
      if (activeFilters.sortBy) params.append('sortBy', activeFilters.sortBy);
      if (activeFilters.sortOrder) params.append('sortOrder', activeFilters.sortOrder);

      const response = await api.get(`/transactions?${params.toString()}`);

      if (response.data.success) {
        const { transactions: txns, pagination: pag } = response.data.data;

        if (page === 1) {
          setTransactions(txns);
        } else {
          // Append for infinite scroll / load more
          setTransactions((prev) => [...prev, ...txns]);
        }
        setPagination(pag);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      setDashboardLoading(true);
      const response = await api.get('/transactions/stats/dashboard');
      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/transactions/categories');
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Create transaction
  const createTransaction = useCallback(async (data) => {
    try {
      const response = await api.post('/transactions', data);
      if (response.data.success) {
        // Refresh data
        await fetchTransactions(1, pagination.itemsPerPage);
        return { success: true, data: response.data.data.transaction };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create transaction';
      return { success: false, message };
    }
  }, [fetchTransactions, pagination.itemsPerPage]);

  // Update transaction
  const updateTransaction = useCallback(async (id, data) => {
    try {
      const response = await api.put(`/transactions/${id}`, data);
      if (response.data.success) {
        setTransactions((prev) =>
          prev.map((t) => (t._id === id ? response.data.data.transaction : t))
        );
        return { success: true, data: response.data.data.transaction };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update transaction';
      return { success: false, message };
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      if (response.data.success) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        setPagination((prev) => ({
          ...prev,
          totalItems: prev.totalItems - 1,
        }));
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete transaction';
      return { success: false, message };
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'All',
      type: 'All',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  }, []);

  const value = {
    transactions,
    pagination,
    loading,
    dashboardStats,
    dashboardLoading,
    categories,
    filters,
    fetchTransactions,
    fetchDashboardStats,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilters,
    resetFilters,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
