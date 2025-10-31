import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import tokens from '../styles/tokens';
import Button from '../components/Button';

// The image is in public/assets/, so we reference it directly in CSS
// We no longer import it as a JS module.

// --- Styled Components ---
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px); /* Fill screen height below navbar */
  color: ${tokens.colors.textPrimary};
  font-family: ${tokens.fontFamily};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  
  position: relative;
  overflow: hidden;

  /* --- DEFINITIVE BACKGROUND IMAGE STYLING --- */
  background-image: url("/assets/404-ninjas.png"); /* Use the public path */
  background-size: cover; /* Cover the entire area */
  background-position: center center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  
  /* Ensure content is above the overlay */
  z-index: 1; 
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0; /* Cover the entire parent */
  background: rgba(6, 9, 12, 0.75); /* Dark, slightly transparent overlay */
  backdrop-filter: blur(3px); /* Subtle blur for effect */
  -webkit-backdrop-filter: blur(3px);
  z-index: 0; /* Place behind content */
`;

const ContentWrapper = styled.div`
  position: relative; /* Ensure this content is above the overlay */
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorCode = styled.h1`
  font-size: 10rem;
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.primary};
  line-height: 1;
  text-shadow: 0 0 20px rgba(46, 163, 255, 0.3); /* Stronger shadow */
  margin-bottom: 1rem;

  @media (max-width: ${tokens.breakpoints.mobile}) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.p`
  font-size: 1.75rem;
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.textPrimary};
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${tokens.colors.textSecondary};
  max-width: 400px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const NotFoundPage = () => {
  return (
    <PageWrapper>
      <Overlay /> {/* The overlay goes inside PageWrapper, but covers it */}
      <ContentWrapper>
        <ErrorCode>404</ErrorCode> {/* Reintroducing the 404 text */}
        <ErrorTitle>Page Not Found</ErrorTitle> 
        <ErrorMessage>
          It looks like the page you were trying to find has been taken away by our stealthy ninjas.
          Don't worry, we'll help you find your way back.
        </ErrorMessage>
        <Button as={Link} to="/" $variant="primary">
          Go to Homepage
        </Button>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default NotFoundPage;

