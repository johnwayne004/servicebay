const tokens = {
  fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  fontWeights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },

  colors: {
    pageBg: "#4a4f56",
    cardBg: "#14171a",
    cardPanel: "#1b1f23",
    heroOverlay: "rgba(6,9,12,0.55)",
    primary: "#2EA3FF",
    primaryHover: "#1f8de0",
    accent: "#0086FF",
    textPrimary: "#e6eef6",
    textSecondary: "#98a0aa",
    inputBg: "#101214",
    inputBorder: "#2b3238",
    inputPlaceholder: "#6f7780",
    focusRing: "rgba(46,163,255,0.25)",
    outline: "#2f3640",
    subtle: "#2b3035",
    error: "#ff6b6b",
    
    // --- NEW COLORS ---
    success: "#2ecc71", // A clear green for active status
    successMuted: "rgba(46, 204, 113, 0.1)", // A subtle background for the active section
  },

  sizes: {
    pagePadding: "32px",
    cardRadius: "18px",
    cardMaxWidth: "1100px",
    formWidth: "520px",
    inputHeight: "44px",
    navbarHeight: "60px",
  },

  fontSizes: {
    h1: "36px",
    subtitle: "13px",
    input: "14px",
    btn: "15px",
    small: "12px",
  },

  breakpoints: {
    tablet: "900px",
    mobile: "560px",
  },
};

export default tokens;
