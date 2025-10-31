import styled from 'styled-components';
import tokens from '../styles/tokens';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// --- This is the ONLY component that controls the page background ---
const PageWrapper = styled.div`
  width: 100%;
  background-color: ${tokens.colors.pageBg};
  font-family: ${tokens.fontFamily};
  color: ${tokens.colors.textPrimary};
`;

const HomePageContainer = styled.div`
  min-height: calc(100vh - ${tokens.sizes.navbarHeight || '60px'});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background-image: url("/assets/register-hero.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(6, 9, 12, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  padding: 1rem;
`;

const HeroTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: ${tokens.fontSizes.h1};
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 1rem;
  color: ${tokens.colors.primary};
  @media (max-width: ${tokens.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: ${tokens.fontSizes.subtitle};
  color: ${tokens.colors.textPrimary};
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CtaButtons = styled.div`
  font-family: 'Poppins', sans-serif;
  display: flex;
  gap: 1.5rem;
  @media (max-width: ${tokens.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CtaButton = styled(Link)`
  font-family: 'Poppins', sans-serif;
  background: ${props => props.$primary ? `linear-gradient(180deg, ${tokens.colors.primary}, ${tokens.colors.primaryHover})` : tokens.colors.inputBg};
  color: ${props => props.$primary ? 'white' : tokens.colors.textPrimary};
  border: ${props => props.$primary ? 'none' : `1px solid ${tokens.colors.inputBorder}`};
  padding: 12px 28px;
  border-radius: 999px;
  font-size: ${tokens.fontSizes.btn};
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.$primary ? '0 8px 20px rgba(46,163,255,0.14)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$primary ? '0 10px 25px rgba(46,163,255,0.2)' : '0 2px 8px rgba(0,0,0,0.4)'};
    background: ${props => props.$primary ? `linear-gradient(180deg, ${tokens.colors.primaryHover}, ${tokens.colors.primary})` : tokens.colors.cardBg};
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px ${tokens.colors.focusRing};
  }
`;

// --- THIS IS THE FIX (PART 1) ---
const Section = styled.section`
  font-family: 'Poppins', sans-serif;
  padding: 4rem 2rem;
  /* background-color: ${tokens.colors.cardPanel}; <-- REMOVED */
  color: ${tokens.colors.textPrimary};
  text-align: center;
  width: 100%;
  /* box-shadow: inset 0 8px 20px rgba(0,0,0,0.1); <-- REMOVED */
  /* margin-top: 2rem; <-- REMOVED */
`;

const SectionTitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 2.5rem;
  color: ${tokens.colors.primary};
  @media (max-width: ${tokens.breakpoints.mobile}) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const HowItWorksGrid = styled.div`
  font-family: 'Poppins', sans-serif;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 2rem;
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.accent});
  color: white;
  font-size: 1.5rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: ${tokens.fontWeights.semibold};
  margin-bottom: 0.8rem;
`;

const StepDescription = styled.p`
  font-size: ${tokens.fontSizes.subtitle};
  color: ${tokens.colors.textSecondary};
  line-height: 1.6;
`;

// --- THIS IS THE FIX (PART 2) ---
const ImageSection = styled(Section)`
  background-color: ${tokens.colors.cardPanel}; /* We add a contrasting background HERE */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    padding: 4rem;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  max-width: 500px;
  border-radius: ${tokens.sizes.cardRadius};
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
`;

const MechanicImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(20%) brightness(80%);
  transition: filter 0.3s ease;
  &:hover {
    filter: grayscale(10%) brightness(100%);
  }
`;

const ImageSectionContent = styled.div`
  flex: 1;
  text-align: left;
  max-width: 500px;
  @media (max-width: ${tokens.breakpoints.tablet}) {
    text-align: center;
  }
`;

const ImageSectionTitle = styled(SectionTitle)`
  font-size: 2rem;
  text-align: left;
  margin-bottom: 1.5rem;
  @media (max-width: ${tokens.breakpoints.tablet}) {
    text-align: center;
  }
`;

const ImageSectionText = styled.p`
  font-size: 1rem;
  color: ${tokens.colors.textSecondary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const Footer = styled.footer`
  background-color: ${tokens.colors.cardBg}; /* We add a contrasting background HERE */
  color: ${tokens.colors.textSecondary};
  padding: 3rem 2rem;
  text-align: center;
  border-top: 1px solid ${tokens.colors.inputBorder};
  font-size: 0.9rem;
`;
// --- END FIXES ---

const FooterLinks = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  a {
    color: ${tokens.colors.textSecondary};
    text-decoration: none;
    &:hover {
      color: ${tokens.colors.primary};
      text-decoration: underline;
    }
  }
`;

const SocialIcons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialIconLink = styled.a`
  color: ${tokens.colors.textSecondary};
  font-size: 1.5rem;
  transition: color 0.2s ease;
  &:hover {
    color: ${tokens.colors.primary};
  }
`;

const HomePage = () => {
  const { user } = useContext(AuthContext);

  let dashboardPath = '/';
  if (user) {
    switch (user.user_role) {
      case 'admin': dashboardPath = '/dashboard/admin'; break;
      // --- THIS IS THE ROLE NAME FIX ---
      case 'technician': dashboardPath = '/dashboard/mechanic'; break;
      case 'customer': dashboardPath = '/dashboard/customer'; break;
      default: dashboardPath = '/dashboard/customer';
    }
  }

  return (
    // --- THIS IS THE FIX: WRAP EVERYTHING IN PageWrapper ---
    <PageWrapper>
      <HomePageContainer>
        <HeroOverlay />
        <ContentWrapper>
          <HeroTitle>Your One-Stop Solution for Service Management</HeroTitle>
          <HeroSubtitle>
            Streamline your service requests, track progress, and get quick support.
            Whether you're a customer, technician, or administrator, we've got you covered.
          </HeroSubtitle>
          <CtaButtons>
            {user ? (
              <CtaButton to={dashboardPath} $primary>Go to Your Dashboard</CtaButton>
            ) : (
              <>
                <CtaButton to="/register" $primary>Get Started</CtaButton>
                <CtaButton to="/login">Login Now</CtaButton>
              </>
            )}
          </CtaButtons>
        </ContentWrapper>
      </HomePageContainer>

      <Section>
        <SectionTitle>How ServiceBay Works</SectionTitle>
        <HowItWorksGrid>
          <StepCard><StepNumber>1</StepNumber><StepTitle>Submit Your Request</StepTitle><StepDescription>Easily create a new service ticket with details about your issue. Our intuitive form makes it quick and hassle-free.</StepDescription></StepCard>
          <StepCard><StepNumber>2</StepNumber><StepTitle>Assigned to Expert</StepTitle><StepDescription>Your request is swiftly assigned to a qualified technician who specializes in your specific issue.</StepDescription></StepCard>
          <StepCard><StepNumber>3</StepNumber><StepTitle>Track Progress</StepTitle><StepDescription>Monitor the real-time status of your ticket, communicate with your technician, and get updates.</StepDescription></StepCard>
          <StepCard><StepNumber>4</StepNumber><StepTitle>Resolution & Feedback</StepTitle><StepDescription>Once completed, review the resolution and provide feedback to help us continually improve our services.</StepDescription></StepCard>
        </HowItWorksGrid>
      </Section>

      <ImageSection>
        <ImageWrapper>
          <MechanicImage src="/assets/certified_mechanic.png" alt="Certified Mechanic working on a vehicle" />
        </ImageWrapper>
        <ImageSectionContent>
          <ImageSectionTitle>Dedicated Professionals, Quality Service.</ImageSectionTitle>
          <ImageSectionText>
            At ServiceBay, we pride ourselves on a team of highly skilled and certified technicians.
            Every professional is rigorously trained to handle a wide range of service requests with precision and care.
            We are committed to providing transparent, efficient, and reliable solutions to all our clients.
          </ImageSectionText>
          <CtaButton to="/about" $primary>Learn More About Us</CtaButton>
        </ImageSectionContent>
      </ImageSection>

      <Footer>
        <FooterLinks>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </FooterLinks>
        <p>&copy; {new Date().getFullYear()} ServiceBay. All rights reserved.</p>
        <SocialIcons>
          <SocialIconLink href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></SocialIconLink>
          <SocialIconLink href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></SocialIconLink>
          <SocialIconLink href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></SocialIconLink>
        </SocialIcons>
      </Footer>
    </PageWrapper>
  );
};

export default HomePage;

