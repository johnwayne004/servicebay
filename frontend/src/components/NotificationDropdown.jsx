import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import tokens from '../styles/tokens';

// --- Styled Components ---
const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px); /* Position below the navbar */
  right: 0;
  width: 380px;
  background-color: ${tokens.colors.cardBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1001;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${tokens.colors.inputBorder};
`;

const HeaderTitle = styled.h3`
  font-size: 1rem;
  font-weight: ${tokens.fontWeights.bold};
  margin: 0;
`;

const MarkAsReadButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.primary};
  font-size: 0.8rem;
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled(Link)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid ${tokens.colors.inputBorder};
  background-color: ${props => props.is_read ? 'transparent' : 'rgba(46, 163, 255, 0.05)'};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.cardPanel};
  }
`;

const IconWrapper = styled.div`
  color: ${tokens.colors.primary};
`;

const NotificationContent = styled.div``;

const Message = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 0.3rem 0;
  color: ${tokens.colors.textPrimary};
`;

const Timestamp = styled.p`
  font-size: 0.75rem;
  color: ${tokens.colors.textSecondary};
  margin: 0;
`;

const NoNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${tokens.colors.textSecondary};
`;

const NotificationDropdown = ({ notifications, onMarkAllRead }) => {
  return (
    <DropdownContainer>
      <DropdownHeader>
        <HeaderTitle>Notifications</HeaderTitle>
        <MarkAsReadButton onClick={onMarkAllRead}>Mark all as read</MarkAsReadButton>
      </DropdownHeader>
      <NotificationList>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem key={notification.id} to={`/tickets/${notification.ticket}`} is_read={notification.is_read}>
              <IconWrapper>
                {/* Bell Icon SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </IconWrapper>
              <NotificationContent>
                <Message>{notification.message}</Message>
                <Timestamp>{new Date(notification.created_at).toLocaleString()}</Timestamp>
              </NotificationContent>
            </NotificationItem>
          ))
        ) : (
          <NoNotifications>
            <p>You have no new notifications.</p>
          </NoNotifications>
        )}
      </NotificationList>
    </DropdownContainer>
  );
};

export default NotificationDropdown;
