import React from 'react';
import styled, { keyframes } from 'styled-components';
import tokens from '../styles/tokens';

// --- Keyframes for animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// --- Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalCard = styled.div`
  background: ${tokens.colors.cardPanel};
  color: ${tokens.colors.textPrimary};
  padding: 2.5rem;
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: ${scaleIn} 0.3s ease-out;
`;

const IconWrapper = styled.div`
  margin: 0 auto 1.5rem auto;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border: 2px solid ${props => props.type === 'success' ? '#2ecc71' : '#e74c3c'};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 0.5rem;
`;

const ModalMessage = styled.p`
  color: ${tokens.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ModalButton = styled.button`
  width: 100%;
  background: ${props => props.type === 'success' ? '#2ecc71' : '#e74c3c'};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: ${tokens.fontSizes.btn};
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.type === 'success' ? '#27ae60' : '#c0392b'};
  }
`;

// --- Main Component ---
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <IconWrapper type={type}>
          {type === 'success' ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
        </IconWrapper>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalButton type={type} onClick={onClose}>
          {type === 'success' ? 'Ok' : 'Try again'}
        </ModalButton>
      </ModalCard>
    </ModalOverlay>
  );
};

export default NotificationModal;
