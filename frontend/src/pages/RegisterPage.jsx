// filename: RegisterPage.jsx
// Dependency: styled-components (npm install styled-components)
// Google Font recommendation: "Poppins" (import in your index.html or main CSS):
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

/*
  RegisterPage.jsx
  - Pixel-accurate, responsive signup component based on the uploaded design.
  - Uses styled-components for styling and CSS-in-JS.
  - Accessible form markup, inline SVG icons, show/hide password toggle, client-side validation.
  - Design tokens below reflect the main colors, font sizes, and spacing to customize easily.
*/

import React, { useState, useRef } from "react";
import styled from "styled-components";
import tokens from '../styles/tokens';
import axiosInstance from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

/* -----------------------------
   Design tokens / colors / fonts
   -----------------------------
   Adjust these tokens to tweak the design globally.
*/


/* -----------------------------
   Styled components
   ----------------------------- */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden; /* Important to prevent gradient overflow */

  /* --- NEW MODERN GRADIENT BACKGROUND --- */
  background: radial-gradient(
      circle at 10% 20%,
      ${tokens.colors.pageBg} 0%,
      #121824 50%, /* A slightly deeper dark for the center */
      ${tokens.colors.pageBg} 100%
  );
  /* You can add a subtle brand glow if desired: */
  /*
  background:
    radial-gradient(ellipse at 80% 0%, rgba(46,163,255,0.1) 0%, transparent 50%), // Primary blue glow top right
    radial-gradient(ellipse at 20% 100%, rgba(94,255,179,0.08) 0%, transparent 50%), // Accent green glow bottom left
    radial-gradient(
      circle at 10% 20%,
      ${tokens.colors.pageBg} 0%,
      #121824 50%,
      ${tokens.colors.pageBg} 100%
  );
  background-size: 100% 100%;
  */
  /* --- END NEW GRADIENT BACKGROUND --- */


  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

/* The main card container */
const Card = styled.main`
  width: 100%;
  max-width: ${tokens.sizes.cardMaxWidth};
  background: linear-gradient(180deg, ${tokens.colors.cardBg} 0%, ${tokens.colors.cardPanel} 100%);
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 20px 40px rgba(3,6,10,0.6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  min-height: 540px;

  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-template-columns: 1fr; /* stack for smaller screens */
    min-height: auto;
  }
`;

/* Left side: form area (padding and content alignment) */
const FormWrap = styled.section`
  padding: 56px 48px;
  color: ${tokens.colors.textPrimary};
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: 28px 20px;
  }
`;

/* Top logo row */
const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoMark = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.accent});
  box-shadow: 0 4px 10px rgba(46,163,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Small brand text */
const Brand = styled.h3`
  margin: 0;
  font-weight: ${tokens.fontWeights.semibold};
  font-size: 15px;
  color: ${tokens.colors.textPrimary};
`;

/* Heading */
const Title = styled.h1`
  margin: 6px 0 0 0;
  font-size: ${tokens.fontSizes.h1};
  line-height: 1.05;
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
`;

/* Subtitle / hint */
const Subtitle = styled.p`
  margin: 6px 0 18px 0;
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.fontSizes.subtitle};
`;

/* Form */
const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 6px;
`;

/* Row for two small inputs (first + last names) */
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${tokens.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

/* Input wrapper */
const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

/* Label visually hidden but accessible (we keep visible per design but small) */
const Label = styled.label`
  font-size: 12px;
  color: ${tokens.colors.textSecondary};
  margin-bottom: 6px;
`;

/* Input element */
const Input = styled.input.attrs((props) => ({
  "aria-invalid": props["aria-invalid"] || undefined,
}))`
  width: 100%;
  background: ${tokens.colors.inputBg};
  border: 1px solid ${(p) => (p["aria-invalid"] ? tokens.colors.error : tokens.colors.inputBorder)};
  color: ${tokens.colors.textPrimary};
  padding: 10px 40px 10px 12px; /* added right padding for icon */
  border-radius: 10px;
  font-size: ${tokens.fontSizes.input};
  outline: none;
  transition: box-shadow 120ms ease, border-color 120ms ease;

  &::placeholder {
    color: ${tokens.colors.inputPlaceholder};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${tokens.colors.focusRing};
    border-color: ${tokens.colors.primary};
  }
`;

const PasswordWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    flex: 1;
    width: 100%;
  }
`;

/* Eye button for show/hide (no border, just icon) */
const IconButton = styled.button`
  position: absolute;
  right: 10px;
  height: 28px;
  width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${tokens.colors.inputPlaceholder};

  &:focus {
    outline: 2px solid ${tokens.colors.focusRing};
    border-radius: 6px;
  }
`;

/* Inline helper for error text */
const ErrorText = styled.span`
  font-size: ${tokens.fontSizes.small};
  color: ${tokens.colors.error};
  margin-top: 6px;
`;

/* Buttons row */
const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  align-items: center;
  flex-wrap: wrap;
`;

/* Secondary button (Change method) */
const SecondaryBtn = styled.button`
  background: ${tokens.colors.subtle};
  color: ${tokens.colors.textPrimary};
  border: none;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: ${tokens.fontSizes.btn};
  cursor: pointer;
  min-width: 140px;
  &:hover { opacity: 0.92; }
  &:focus { box-shadow: 0 0 0 4px ${tokens.colors.focusRing}; }
`;

/* Primary action */
const PrimaryBtn = styled.button`
  background: linear-gradient(180deg, ${tokens.colors.primary}, ${tokens.colors.primaryHover});
  color: white;
  border: none;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: ${tokens.fontSizes.btn};
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  min-width: 160px;
  box-shadow: 0 8px 20px rgba(46,163,255,0.14);
  &:hover { transform: translateY(-1px); }
  &:focus { box-shadow: 0 0 0 6px ${tokens.colors.focusRing}; }
`;

/* Footer link row */
const FooterRow = styled.div`
  margin-top: auto;
  font-size: 13px;
  color: ${tokens.colors.textSecondary};
`;

/* Link styled */
const LinkAction = styled(Link)`
  color: ${tokens.colors.primary};
  margin-left: 6px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

/* Right hero area */
const Hero = styled.figure`
  position: relative;
  background-image: url("/assets/register-hero.png"); /* replace with the uploaded image filename e.g. /assets/801cb901-a436-40c2-9d03-ff26490f0c4c.png */
  background-size: cover;
  background-position: center;
  min-height: 100%;
  display: block;
  @media (max-width: ${tokens.breakpoints.tablet}) {
    display: none; /* hide hero on smaller screens to prioritize form */
  }
`;

/* Overlay gradient on hero to match the image dim */
const HeroOverlay = styled.div`
  inset: 0;
  position: absolute;
  background: linear-gradient(90deg, rgba(19,21,24,0.82) 0%, rgba(18,20,23,0.25) 100%);
`;

/* Decorative dotted dashed path (approx from image) */
const Dashed = styled.svg`
  position: absolute;
  right: 36px;
  bottom: 36px;
  width: 160px;
  height: 240px;
  opacity: 0.08;
  filter: blur(0.2px);
`;

/* For screen-reader only live region */
const LiveRegion = styled.div`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

/* -----------------------------
   RegisterPage component
   ----------------------------- */

export default function RegisterPage() {
  // Form state
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    user_role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const liveRef = useRef(null);

  // Basic client-side validation
  const validate = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) newErrors.email = "Please enter a valid email.";
    }
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required.";

    setErrors(newErrors);
    // update live region for screen reader
    if (liveRef.current) {
      liveRef.current.textContent = Object.keys(newErrors).length ? "Form submission contains errors" : "Form looks good";
    }
    return Object.keys(newErrors).length === 0;
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // toggle show/hide password
  const togglePassword = () => setShowPassword((s) => !s);

  // submit handler
const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    const isValid = validate();
    if (!isValid) return;

    try {
      // Send data to the Django backend
      const response = await axiosInstance.post('http://127.0.0.1:8000/api/users/register/', form);
      
      console.log("SUCCESS:", response.data);
      setFormMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
          navigate('/login'); // Redirect to your login page
      }, 1500);
      // Optionally, you can reset the form after successful submission
      // setForm({ first_name: "", last_name: "", email: "", password: "", phone_number: "", user_role: "customer" });

    } catch (error) {
      console.error("API ERROR:", error.response ? error.response.data : error.message);
      
      // Handle specific errors from Django (e.g., email already exists)
      if (error.response && error.response.data && error.response.data.email) {
        setFormMessage(`Error: ${error.response.data.email[0]}`);
      } else {
        setFormMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Page>
      <Card role="region" aria-label="Create account">
        <FormWrap>
          <LogoRow>
            <LogoMark aria-hidden>
              {/* small white dot inside logo - inline SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="5" fill="white" opacity="0.95" />
              </svg>
            </LogoMark>
            <Brand>Service Bay </Brand>
          </LogoRow>

          <Title>Create new account<span style={{ color: tokens.colors.accent }}>.</span></Title>
          <Subtitle>Already A Member? <LinkAction to ="/login">Log In</LinkAction></Subtitle>

          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              <Field>
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  aria-invalid={errors.first_name ? "true" : "false"}
                  aria-describedby={errors.first_name ? "err-first_name" : undefined}
                />
                {errors.first_name && <ErrorText id="err-first_name">{errors.first_name}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  aria-invalid={errors.last_name ? "true" : "false"}
                  aria-describedby={errors.last_name ? "err-last_name" : undefined}
                />
                {errors.last_name && <ErrorText id="err-last_name">{errors.last_name}</ErrorText>}
              </Field>
            </Row>

            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
              {errors.email && <ErrorText id="err-email">{errors.email}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="phone_number">Phone number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="0700 112 233"
                value={form.phone_number}
                onChange={handleChange}
                aria-invalid={errors.phone_number ? "true" : "false"}
                aria-describedby={errors.phone_number ? "err-phone_number" : undefined}
              />
              {errors.phone_number && <ErrorText id="err-phone_number">{errors.phone_number}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
              <PasswordWrap>
                <Input
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "err-password" : undefined}
                />
                <IconButton
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    // eye-off icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5c5 0 8.5 3.5 9 7-0.4 1.44-2.36 4.1-5.18 5.86" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6.3C4 7.9 2.6 9.8 2 12c0.6 1.9 2.5 4.2 5.2 5.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    // eye icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </IconButton>
              </PasswordWrap>
              {errors.password && <ErrorText id="err-password">{errors.password}</ErrorText>}
            </Field>

            {/* role hidden (we default to customer in model). Provide option if desired */}
            <input type="hidden" name="user_role" value={form.user_role} />

            <ButtonsRow>
              <SecondaryBtn type="button" onClick={() => alert("Change method clicked (demo)")}>
                Change method
              </SecondaryBtn>

              <PrimaryBtn type="submit" aria-label="Create account">
                Create account
              </PrimaryBtn>
            </ButtonsRow>

            {/* form message / feedback */}
            {formMessage && <ErrorText role="status" aria-live="polite" style={{ color: "#bfe9ff" }}>{formMessage}</ErrorText>}
          </Form>

          <FooterRow>
            By continuing you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>.
          </FooterRow>

          {/* Screen reader live region */}
          <LiveRegion aria-live="polite" ref={liveRef} />
        </FormWrap>

        <Hero aria-hidden>
          <HeroOverlay />
          {/* Decorative dashed path svg; purely decorative */}
          <Dashed aria-hidden>
            <svg width="160" height="240" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 30 C60 80, 100 120, 150 200" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.6"/>
            </svg>
          </Dashed>
        </Hero>
      </Card>
    </Page>
  );
}

/* -----------------------------
  Notes / How to customize
  - Replace the hero background placeholder ("/assets/register-hero.jpg") with the uploaded image:
    e.g. import hero from './assets/801cb901-a436-40c2-9d03-ff26490f0c4c.png'; then set Hero style background-image: url(${hero});
  - Fonts: Add <link> to Poppins in your index.html as suggested above.
  - Colors, spacing and font sizes are in the `tokens` object at top to easily tweak.
  - API: replace the commented fetch in handleSubmit with your real endpoint.
  - Accessibility: The form uses aria-invalid, aria-describedby, and a hidden live region for screen readers.
  - Responsive: The hero image is hidden under 900px; form becomes full-width stacking inputs under 560px.
----------------------------- */
