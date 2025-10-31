import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import tokens from '../styles/tokens';
import AuthContext from "../context/AuthContext";
import { Link } from 'react-router-dom';

// --- All your styled components remain the same ---
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  background: radial-gradient(
      circle at 10% 20%,
      ${tokens.colors.pageBg} 0%,
      #121824 50%,
      ${tokens.colors.pageBg} 100%
  );
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: 1rem;
  }
`;
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
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;
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
const Brand = styled.h3`
  margin: 0;
  font-weight: ${tokens.fontWeights.semibold};
  font-size: 15px;
  color: ${tokens.colors.textPrimary};
`;
const Title = styled.h1`
  margin: 6px 0 0 0;
  font-size: ${tokens.fontSizes.h1};
  line-height: 1.05;
  font-weight: ${tokens.fontWeights.bold};
  color: ${tokens.colors.textPrimary};
`;
const Subtitle = styled.p`
  margin: 6px 0 18px 0;
  color: ${tokens.colors.textSecondary};
  font-size: ${tokens.fontSizes.subtitle};
`;
const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 6px;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  font-size: 12px;
  color: ${tokens.colors.textSecondary};
  margin-bottom: 6px;
`;
const Input = styled.input.attrs((props) => ({
  "aria-invalid": props["aria-invalid"] || undefined,
}))`
  width: 100%;
  background: ${tokens.colors.inputBg};
  border: 1px solid ${(p) => (p["aria-invalid"] ? tokens.colors.error : tokens.colors.inputBorder)};
  color: ${tokens.colors.textPrimary};
  padding: 10px 40px 10px 12px;
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
const ErrorText = styled.span`
  font-size: ${tokens.fontSizes.small};
  color: ${tokens.colors.error};
  margin-top: 6px;
`;
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
const FooterRow = styled.div`
  margin-top: auto;
  font-size: 13px;
  color: ${tokens.colors.textSecondary};
`;
const LinkAction = styled(Link)`
  color: ${tokens.colors.primary};
  margin-left: 6px;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
const Hero = styled.figure`
  position: relative;
  background-image: url("/assets/register-hero.png");
  background-size: cover;
  background-position: center;
  min-height: 100%;
  display: block;
  @media (max-width: ${tokens.breakpoints.tablet}) {
    display: none;
  }
`;
const HeroOverlay = styled.div`
  inset: 0;
  position: absolute;
  background: linear-gradient(90deg, rgba(19,21,24,0.82) 0%, rgba(18,20,23,0.25) 100%);
`;
const Dashed = styled.svg`
  position: absolute;
  right: 36px;
  bottom: 36px;
  width: 160px;
  height: 240px;
  opacity: 0.08;
  filter: blur(0.2px);
`;
const LiveRegion = styled.div`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const liveRef = useRef(null);
  const { loginUser } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) newErrors.email = "Please enter a valid email.";
    }
    if (!form.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (liveRef.current) {
      liveRef.current.textContent = Object.keys(newErrors).length ? "Form submission contains errors" : "Form looks good";
    }
    return Object.keys(newErrors).length === 0;
  };

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

  const togglePassword = () => setShowPassword((s) => !s);

  // --- 👇 THIS IS THE CORRECTED LOGIC 👇 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    const isValid = validate();
    if (!isValid) return;

    try {
      await loginUser(form.email, form.password);
      // Success is handled by redirection in AuthContext
    } catch (error) {
      // AuthContext throws the error, and we catch it here to update the UI.
      if (error.response && error.response.data && error.response.data.detail) {
        // Use the specific error message from the Django backend
        setFormMessage(error.response.data.detail);
      } else {
        // Fallback for other network errors
        setFormMessage("Login failed. Please check your credentials or network connection.");
      }
      console.error("Login attempt failed:", error);
    }
  };

  return (
    <Page>
      <Card role="region" aria-label="Login">
        <FormWrap>
          <LogoRow>
            <LogoMark aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="5" fill="white" opacity="0.95" /></svg>
            </LogoMark>
            <Brand>Service Bay</Brand>
          </LogoRow>
          <Title>Welcome Back<span style={{ color: tokens.colors.accent }}>.</span></Title>
          <Subtitle>New to Service Bay? <LinkAction to="/register">Create an account</LinkAction></Subtitle>
          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="you@example.com" type="email" value={form.email} onChange={handleChange} aria-invalid={errors.email ? "true" : "false"} aria-describedby={errors.email ? "err-email" : undefined} />
              {errors.email && <ErrorText id="err-email">{errors.email}</ErrorText>}
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <PasswordWrap>
                <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} aria-invalid={errors.password ? "true" : "false"} aria-describedby={errors.password ? "err-password" : undefined} />
                <IconButton type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={togglePassword}>
                  {showPassword ? (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 5c5 0 8.5 3.5 9 7-0.4 1.44-2.36 4.1-5.18 5.86" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 6.3C4 7.9 2.6 9.8 2 12c0.6 1.9 2.5 4.2 5.2 5.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>) : (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                </IconButton>
              </PasswordWrap>
              {errors.password && <ErrorText id="err-password">{errors.password}</ErrorText>}
            </Field>
            <FooterRow style={{ marginTop: '0', textAlign: 'right', fontSize: tokens.fontSizes.small }}>
              <LinkAction to="/forgot-password">Forgot password?</LinkAction>
            </FooterRow>
            <PrimaryBtn type="submit" aria-label="Login to account">Log In</PrimaryBtn>
            {/* The form message will now be red, using the ErrorText component */}
            {formMessage && <ErrorText role="status" aria-live="polite">{formMessage}</ErrorText>}
          </Form>
          <FooterRow>By logging in you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>.</FooterRow>
          <LiveRegion aria-live="polite" ref={liveRef} />
        </FormWrap>
        <Hero aria-hidden>
          <HeroOverlay />
          <Dashed aria-hidden>
            <svg width="160" height="240" viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 30 C60 80, 100 120, 150 200" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.6" /></svg>
          </Dashed>
        </Hero>
      </Card>
    </Page>
  );
}

