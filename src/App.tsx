import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/dashboard';
import JobSearch from './pages/dashboard/search';
import Emails from './pages/dashboard/emails';
import Applications from './pages/dashboard/applications';
import Resume from './pages/dashboard/resume';
import Settings from './pages/dashboard/settings';
import Profile from './pages/dashboard/profile';
import Login from './pages/auth/login';
import { ToastProvider } from './context/ToastContext';
import { UserProvider, useUser } from './context/UserContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="search" element={<JobSearch />} />
              <Route path="applications" element={<Applications />} />
              <Route path="resume" element={<Resume />} />
              <Route path="emails" element={<Emails />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
