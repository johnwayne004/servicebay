import { createGlobalStyle } from 'styled-components';
import tokens from './tokens';

const GlobalStyle = createGlobalStyle`
  /* A modern CSS reset to ensure consistency across all browsers */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Set base styles for the entire application */
  body {
    background-color: ${tokens.colors.pageBg};
    color: ${tokens.colors.textPrimary};
    font-family: ${tokens.fontFamily};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased; /* Improves font rendering on some displays */
  }

  /* Make images and other media responsive by default */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* Remove default form styles to allow for custom styling */
  input, button, textarea, select {
    font: inherit;
  }
`;

export default GlobalStyle;

