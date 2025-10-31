import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { NavLink as RouterNavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';
import axiosInstance from '../api/axiosConfig';
import NotificationDropdown from './NotificationDropdown';
import { playNotificationSound } from '../utils/audioManager';

// --- Styled Components ---
const Nav = styled.nav`
  background: ${tokens.colors.cardBg};
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  min-height: ${tokens.sizes.navbarHeight || '60px'};
  position: relative;
  z-index: 100;

  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 1rem 2rem;
  }
`;

const NavBrand = styled(Link)`
  color: ${tokens.colors.textPrimary};
  font-size: 1.5rem;
  font-weight: ${tokens.fontWeights.bold};
  text-decoration: none;
  z-index: 1001;
`;

const DesktopNavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    display: flex;
  }
`;

const LinksContainer = styled.div`
  background-color: ${tokens.colors.cardPanel};
  border-radius: 999px;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const NavLinkBase = styled(RouterNavLink)`
  color: ${tokens.colors.textSecondary};
  text-decoration: none;
  font-weight: ${tokens.fontWeights.medium};
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  white-space: nowrap;
  &.active {
    background: ${tokens.colors.primary};
    color: white;
    font-weight: ${tokens.fontWeights.semibold};
  }
`;

const LogoutButton = styled.button`
  background: ${tokens.colors.logoutBg || tokens.colors.inputBg};
  color: ${tokens.colors.textSecondary};
  border: 1px solid ${tokens.colors.inputBorder};
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  &:hover {
    background: ${tokens.colors.error};
    border-color: ${tokens.colors.error};
    color: white;
  }
`;

const NotificationWrapper = styled.div` position: relative; `;
const NotificationButton = styled.button`
  background: none; border: none; color: ${tokens.colors.textSecondary};
  font-size: 1.5rem; cursor: pointer; position: relative; display: flex; align-items: center;
  &:hover { color: ${tokens.colors.primary}; }
`;
const UnreadIndicator = styled.div`
  position: absolute; top: 0; right: 0; width: 10px; height: 10px;
  background-color: ${tokens.colors.error}; border-radius: 50%;
  border: 2px solid ${tokens.colors.cardBg};
`;

const HamburgerButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;

  div {
    width: 2rem; height: 0.25rem; background: ${tokens.colors.textPrimary};
    border-radius: 10px; transition: all 0.3s linear; position: relative;
    transform-origin: 1px;
    :first-child { transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'}; }
    :nth-child(2) { opacity: ${({ open }) => open ? '0' : '1'}; transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'}; }
    :nth-child(3) { transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'}; }
  }

  @media (min-width: ${tokens.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileNavMenu = styled.nav`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${tokens.colors.cardBg};
  border-bottom: 1px solid ${tokens.colors.inputBorder};
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  overflow: hidden;
  
  max-height: ${({ open }) => open ? '500px' : '0'};
  opacity: ${({ open }) => open ? '1' : '0'};
  visibility: ${({ open }) => open ? 'visible' : 'hidden'};
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const MobileNavLink = styled(RouterNavLink)`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${tokens.colors.textSecondary};
  text-decoration: none;
  padding: 0.5rem 0;
  &.active { color: ${tokens.colors.primary}; }
`;

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const prevUnreadCount = useRef(0);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications/');
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 20000);
    return () => clearInterval(intervalId);
  }, [user]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      playNotificationSound();
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.post('/notifications/mark_all_as_read/');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  let dashboardPath = '/';
  if (user) {
    switch (user.user_role) {
      case 'admin': dashboardPath = '/dashboard/admin'; break;
      case 'technician': dashboardPath = '/dashboard/mechanic'; break;
      case 'customer': dashboardPath = '/dashboard/customer'; break;
      default: dashboardPath = '/dashboard/customer';
    }
  }

  return (
    <Nav>
      <NavBrand to="/">Service Bay</NavBrand>

      <DesktopNavLinks>
        {user ? (
          <>
            <LinksContainer>
              <NavLinkBase to={dashboardPath}>Dashboard</NavLinkBase>
            </LinksContainer>
            <NotificationWrapper>
              <NotificationButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {unreadCount > 0 && <UnreadIndicator />}
              </NotificationButton>
              {isDropdownOpen && ( <NotificationDropdown notifications={notifications} onMarkAllRead={handleMarkAllRead} /> )}
            </NotificationWrapper>
            <LogoutButton onClick={logoutUser}>Logout</LogoutButton>
          </>
        ) : (
          <LinksContainer>
            <NavLinkBase to="/">Home</NavLinkBase>
            <NavLinkBase to="/login">Login</NavLinkBase>
            <NavLinkBase to="/register">Register</NavLinkBase>
          </LinksContainer>
        )}
      </DesktopNavLinks>

      <HamburgerButton open={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <div /><div /><div />
      </HamburgerButton>
      
      <MobileNavMenu open={isMobileMenuOpen}>
        {user ? (
          <>
            <MobileNavLink to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            <LogoutButton onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }}>Logout</LogoutButton>
          </>
        ) : (
          <>
            <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLink>
            <MobileNavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</MobileNavLink>
          </>
        )}
      </MobileNavMenu>
    </Nav>
  );
};

export default Navbar;

