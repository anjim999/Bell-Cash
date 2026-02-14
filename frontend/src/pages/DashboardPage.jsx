import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, getRelativeTime, getCategoryColor } from '../utils/helpers';
import {
  MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet, MdReceipt,
  MdArrowForward, MdAddCircle, MdArrowUpward, MdArrowDownward,
} from 'react-icons/md';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area,
} from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const { dashboardStats, dashboardLoading, fetchDashboardStats } = useTransactions();

  useEffect(() => { fetchDashboardStats(); }, [fetchDashboardStats]);

  if (dashboardLoading && !dashboardStats) {
    return <div className="page-container"><DashboardSkeleton /></div>;
  }

  const stats = dashboardStats;
  const greeting = getGreeting();
  const monthlyData = processMonthlyTrend(stats?.monthlyTrend || []);
  const dailyData = stats?.dailySpending || [];

  return (
    <div className="page-container" id="dashboard-page">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-10 animate-fade-in-up">
        <div>
          <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]}!</h1>
          <p className="page-subtitle">Here&apos;s an overview of your financial activity</p>
        </div>
        <Link to="/add-transaction" className="btn-primary" id="dashboard-add-btn">
          <MdAddCircle /> Add Transaction
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="stats-cards">
        <StatCard title="Total Balance" amount={stats?.overview?.balance || 0}
          icon={<MdAccountBalanceWallet />} gradient="linear-gradient(135deg, #06b6d4, #3b82f6)" delay={0} />
        <StatCard title="This Month Expense" amount={stats?.currentMonth?.expenses || 0}
          icon={<MdTrendingDown />} gradient="linear-gradient(135deg, #ef4444, #f43f5e)"
          trend={stats?.currentMonth?.expenseChange} trendLabel="vs last month" delay={1} />
        <StatCard title="This Month Income" amount={stats?.currentMonth?.income || 0}
          icon={<MdTrendingUp />} gradient="linear-gradient(135deg, #10b981, #06b6d4)" delay={2} />
        <StatCard title="Transactions" amount={stats?.overview?.totalTransactions || 0}
          icon={<MdReceipt />} gradient="linear-gradient(135deg, #f59e0b, #f97316)" isCurrency={false} delay={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <div className="glass-card p-6 animate-fade-in-up" id="category-chart">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-100">Category Breakdown</h2>
            <span className="text-xs text-slate-500 font-medium">This month</span>
          </div>
          {stats?.categoryBreakdown?.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={stats.categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="total" nameKey="category">
                      {stats.categoryBreakdown.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={getCategoryColor(entry.category)} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {stats.categoryBreakdown.slice(0, 6).map((cat) => (
                  <div className="flex items-center gap-2 text-xs" key={cat.category}>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat.category) }} />
                    <span className="text-slate-400 flex-1 truncate">{cat.category}</span>
                    <span className="text-slate-200 font-semibold font-mono text-[11px]">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state"><p className="empty-state-text">No expenses this month yet</p></div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="glass-card p-6 animate-fade-in-up" id="monthly-trend-chart">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-100">Monthly Trend</h2>
            <span className="text-xs text-slate-500 font-medium">Last 6 months</span>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} name="Expense" />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state-text">Not enough data for trends</p></div>
          )}
        </div>
      </div>

      {/* Daily Spending + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spending */}
        <div className="glass-card p-6 animate-fade-in-up" id="daily-spending-chart">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-100">Daily Spending</h2>
            <span className="text-xs text-slate-500 font-medium">Last 7 days</span>
          </div>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={11}
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" fill="url(#barGradient)" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p className="empty-state-text">No spending data for the last 7 days</p></div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6 animate-fade-in-up" id="recent-transactions">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-100">Recent Transactions</h2>
            <Link to="/explorer" className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View All <MdArrowForward />
            </Link>
          </div>
          {stats?.recentTransactions?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {stats.recentTransactions.map((txn) => (
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors" key={txn._id}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: `${getCategoryColor(txn.category)}20`, color: getCategoryColor(txn.category) }}
                  >
                    {txn.type === 'income' ? <MdArrowDownward /> : <MdArrowUpward />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">{txn.title}</div>
                    <div className="text-xs text-slate-500">{txn.category} · {getRelativeTime(txn.date)}</div>
                  </div>
                  <span className={`text-sm font-bold font-mono whitespace-nowrap ${txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No transactions yet. Add your first one!</p>
              <Link to="/add-transaction" className="btn-primary mt-4"><MdAddCircle /> Add Transaction</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* Sub-Components */
const StatCard = ({ title, amount, icon, gradient, trend, trendLabel, isCurrency = true, delay }) => (
  <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${delay * 100}ms` }}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-medium text-slate-400">{title}</span>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white" style={{ background: gradient }}>{icon}</div>
    </div>
    <div className="text-2xl font-extrabold text-slate-100 tracking-tight">{isCurrency ? formatCurrency(amount) : amount}</div>
    {trend !== null && trend !== undefined && (
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
        {trend >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
        <span>{Math.abs(trend).toFixed(1)}% {trendLabel}</span>
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg border border-white/10 text-xs" style={{ background: '#1a2035', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }}>
        <p className="text-slate-400 mb-0.5">{payload[0].name}</p>
        <p className="text-slate-100 font-semibold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg border border-white/10 text-xs" style={{ background: '#1a2035', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }}>
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardSkeleton = () => (
  <div>
    <div className="mb-8">
      <div className="skeleton" style={{ width: '300px', height: '32px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '200px', height: '20px' }} />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {[1,2,3,4].map((i) => <div className="skeleton" key={i} style={{ height: '140px', borderRadius: '1.25rem' }} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="skeleton" style={{ height: '350px', borderRadius: '1.25rem' }} />
      <div className="skeleton" style={{ height: '350px', borderRadius: '1.25rem' }} />
    </div>
  </div>
);

/* Helpers */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function processMonthlyTrend(trend) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = {};
  trend.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    if (!data[key]) data[key] = { month: months[item._id.month - 1], expense: 0, income: 0 };
    data[key][item._id.type] = item.total;
  });
  return Object.values(data);
}

export default DashboardPage;
