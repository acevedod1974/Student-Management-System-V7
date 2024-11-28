import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CoursePage } from './pages/CoursePage';
import { StudentDetailsPage } from './pages/StudentDetailsPage';
import { LoginPage } from './components/LoginPage';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {user && <Navigation />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <CoursePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:courseId/student/:studentId"
              element={
                <PrivateRoute>
                  <StudentDetailsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;