import React from 'react';
import { Routes, Route } from 'react-router-dom'; // No BrowserRouter, as it's in index.js
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminAllTicketsPage from './pages/AdminAllTicketsPage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';
import NotFoundPage from './pages/NotFoundPage'; 

// Component Imports
import Navbar from './components/Navbar';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Style and Asset Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AppWrapper = styled.div`
  /* This component's only job is to be a container for the routes. */
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <AppWrapper>
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* === Standalone Protected Routes (Customer & Mechanic) === */}
          <Route 
            path="/dashboard/customer" 
            element={<RoleProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></RoleProtectedRoute>} 
          />
          <Route 
            path="/dashboard/mechanic" 
            element={<RoleProtectedRoute allowedRoles={['technician']}><MechanicDashboard /></RoleProtectedRoute>} 
          />
          <Route 
            path="/tickets/new" 
            element={<RoleProtectedRoute allowedRoles={['customer']}><CreateTicketPage /></RoleProtectedRoute>} 
          />
          <Route 
            path="/tickets/:ticketId"
            element={<RoleProtectedRoute allowedRoles={['customer', 'technician', 'admin']}><TicketDetailPage /></RoleProtectedRoute>}
          />
          
          {/* === Admin Routes (All nested within AdminLayout) === */}
          <Route 
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AdminAllTicketsPage />} />
            <Route path="/admin/users" element={<AdminManageUsersPage />} />
          </Route>

          {/* --- 2. THE FINAL CATCH-ALL ROUTE --- */}
          {/* This route will match any URL that was not matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppWrapper>
    </>
  );
}

export default App;

