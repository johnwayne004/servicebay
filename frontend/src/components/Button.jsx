import React from 'react';
import styled from 'styled-components';
import tokens from '../styles/tokens';

const StyledButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-weight: ${tokens.fontWeights.semibold};
  font-size: ${tokens.fontSizes.btn};
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  display: inline-block;
  text-decoration: none;

  /* --- Variant Styling --- */

  /* Primary Button (Blue) */
  ${props => props.$variant === 'primary' && `
    background: ${tokens.colors.primary};
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `}

  /* Secondary Button (Grey) */
  ${props => props.$variant === 'secondary' && `
    background: ${tokens.colors.subtle};
    color: ${tokens.colors.textPrimary};
    border-color: ${tokens.colors.inputBorder};
    &:hover {
      background: ${tokens.colors.inputBorder};
    }
  `}

  /* Danger/Hover Button (Red) - for things like Logout */
  ${props => props.$variant === 'danger' && `
    background: ${tokens.colors.logoutBg || tokens.colors.inputBg};
    color: ${tokens.colors.textSecondary};
    border: 1px solid ${tokens.colors.inputBorder};
    &:hover {
      background: ${tokens.colors.error};
      border-color: ${tokens.colors.error};
      color: white;
    }
  `}

  /* Disabled State */
  &:disabled {
    background: ${tokens.colors.subtle};
    color: ${tokens.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

/**
 * The main reusable button for the application.
 * @param {object} props
 * @param {'primary' | 'secondary' | 'danger'} props.$variant - The visual style of the button.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {function} [props.onClick] - Click event handler.
 * @param {string} [props.type] - The button type (e.g., 'button', 'submit').
 * @param {React.ReactNode} props.children - The text or content inside the button.
 */
const Button = ({ $variant = 'primary', children, ...props }) => {
  return (
    <StyledButton $variant={$variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
