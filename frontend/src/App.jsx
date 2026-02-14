import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExplorerPage from './pages/ExplorerPage';
import AddTransactionPage from './pages/AddTransactionPage';
import { Toaster } from 'react-hot-toast';

const AppLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1" style={{ paddingTop: '1rem' }}>{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(148,163,184,0.1)',
                borderRadius: '0.75rem',
                fontSize: '0.9rem',
                boxShadow: '0 10px 15px rgba(0,0,0,0.4)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/explorer" element={
              <ProtectedRoute>
                <AppLayout><ExplorerPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/add-transaction" element={
              <ProtectedRoute>
                <AppLayout><AddTransactionPage /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
