import React from 'react';
import styled from 'styled-components';
import { NavLink, Outlet } from 'react-router-dom';
import tokens from '../styles/tokens';

// --- Icon Imports (placeholders) ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const TicketsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

// --- Styled Components (WITH RESPONSIVE FIXES) ---
const AdminPageWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Mobile-first: stack layout */
  background-color: ${tokens.colors.pageBg};
  color: ${tokens.colors.textPrimary};
  min-height: calc(100vh - 60px);

  @media (min-width: ${tokens.breakpoints.tablet}) {
    flex-direction: row; /* Desktop: side-by-side layout */
  }
`;

const Sidebar = styled.aside`
  width: 100%; /* Mobile-first: full width */
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: rgba(26, 32, 44, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Mobile: border on bottom */
  
  @media (min-width: ${tokens.breakpoints.tablet}) {
    width: 260px; /* Desktop: fixed width */
    flex-shrink: 0; /* Prevent shrinking */
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: none; /* No bottom border on desktop */
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.textSecondary};
  margin-bottom: 2rem;
  padding-left: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  a {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.9rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    color: ${tokens.colors.textSecondary};
    font-weight: ${tokens.fontWeights.semibold};
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: rgba(46, 163, 255, 0.1);
      color: ${tokens.colors.textPrimary};
    }
    
    &.active {
      color: ${tokens.colors.primary};
      background-color: rgba(46, 163, 255, 0.1);
    }

    &.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 70%;
      width: 4px;
      background-color: ${tokens.colors.primary};
      border-radius: 2px;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 1.5rem; /* Mobile-first padding */
  overflow-y: auto;

  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 2rem 3rem; /* Desktop padding */
  }
`;

const AdminLayout = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard/admin' },
        { name: 'All Tickets', path: '/admin/tickets' },
        { name: 'Manage Users', path: '/admin/users' },
    ];

    return (
        <AdminPageWrapper>
            <Sidebar>
                <SidebarTitle>Admin Panel</SidebarTitle>
                <NavList>
                    {navItems.map(item => (
                        <NavItem key={item.name}>
                            {/* The 'end' prop ensures the Dashboard link is only active on its exact path */}
                            <NavLink to={item.path} end> 
                                {item.name === 'Dashboard' && <DashboardIcon />}
                                {item.name === 'All Tickets' && <TicketsIcon />}
                                {item.name === 'Manage Users' && <UsersIcon />}
                                {item.name}
                            </NavLink>
                        </NavItem>
                    ))}
                </NavList>
            </Sidebar>
            <MainContent>
                <Outlet /> {/* This is where the child route components will render */}
            </MainContent>
        </AdminPageWrapper>
    );
};

export default AdminLayout;

