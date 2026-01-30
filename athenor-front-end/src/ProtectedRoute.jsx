import { Navigate } from 'react-router-dom';

/**
 * Authentication utility functions for Demo Mode
 * No backend required - uses localStorage only
 */

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUser();
  // In demo mode, just check if token and user exist
  return token && user;
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || 'Tutor';
};

export const isTutor = () => {
  return true; // Demo mode: always tutor
};

/**
 * Get the dashboard path - always tutor dashboard in demo mode
 */
export const getDashboardPath = () => {
  return '/tutor-dashboard';
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const setAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Protected Route Component - Requires Authentication
 */
export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * Admin-Only Route Component - Requires Admin Role
 */
export function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin()) {
    // Redirect to tutor dashboard if not admin
    return <Navigate to="/tutor-dashboard" replace />;
  }
  
  return children;
}

/**
 * Guest Route Component - Only accessible when NOT logged in
 * (Used for login, register pages)
 */
export function GuestRoute({ children }) {
  if (isAuthenticated()) {
    const role = getUserRole();
    // Redirect to appropriate dashboard if already logged in
    if (role === 'Admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/tutor-dashboard" replace />;
  }
  return children;
}
