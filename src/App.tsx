import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layouts/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ModulesList from './pages/modules/ModulesList';
import ModuleDetail from './pages/modules/ModuleDetail';
import SkillDetail from './pages/modules/SkillDetail';
import ChallengeDetail from './pages/modules/ChallengeDetail';
import ProgressPage from './pages/ProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Modules Routes */}
        <Route path="modules">
          <Route index element={
            <ProtectedRoute>
              <ModulesList />
            </ProtectedRoute>
          } />
          <Route path=":moduleId" element={
            <ProtectedRoute>
              <ModuleDetail />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Skills Route */}
        <Route path="skills/:skillId" element={
          <ProtectedRoute>
            <SkillDetail />
          </ProtectedRoute>
        } />
        
        {/* Challenge Route */}
        <Route path="challenges/:challengeId" element={
          <ProtectedRoute>
            <ChallengeDetail />
          </ProtectedRoute>
        } />
        
        {/* Progress Route */}
        <Route path="progress" element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        } />
        
        {/* Achievements Route */}
        <Route path="achievements" element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        } />
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
