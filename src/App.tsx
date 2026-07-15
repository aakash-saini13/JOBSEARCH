import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/dashboard'));
const JobSearch = lazy(() => import('./pages/dashboard/search'));
const Emails = lazy(() => import('./pages/dashboard/emails'));
const Applications = lazy(() => import('./pages/dashboard/applications'));
const Resume = lazy(() => import('./pages/dashboard/resume'));
const Networking = lazy(() => import('./pages/dashboard/networking'));
const Settings = lazy(() => import('./pages/dashboard/settings'));
const Profile = lazy(() => import('./pages/dashboard/profile'));
const Analytics = lazy(() => import('./pages/dashboard/analytics'));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center h-full">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
  </div>
);
import Login from './pages/auth/login';
import { ToastProvider } from './context/ToastContext';
import { UserProvider, useUser } from './context/UserContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, firebaseUser } = useUser();
  if (!isLoggedIn || !firebaseUser) {
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
              <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="search" element={<Suspense fallback={<PageLoader />}><JobSearch /></Suspense>} />
              <Route path="applications" element={<Suspense fallback={<PageLoader />}><Applications /></Suspense>} />
              <Route path="resume" element={<Suspense fallback={<PageLoader />}><Resume /></Suspense>} />
              <Route path="emails" element={<Suspense fallback={<PageLoader />}><Emails /></Suspense>} />
              <Route path="networking" element={<Suspense fallback={<PageLoader />}><Networking /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
              <Route path="analytics" element={<Suspense fallback={<PageLoader />}><Analytics /></Suspense>} />
            </Route>
          </Routes>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
