import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';

// --- Styled Components (WITH RESPONSIVE FIXES) ---
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: ${tokens.colors.pageBg};
  font-family: ${tokens.fontFamily};
  color: ${tokens.colors.textPrimary};
`;

const HeroSection = styled.div`
  position: relative;
  padding: 3rem 1.5rem;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url('/assets/register-hero.png');
  background-size: cover;
  background-position: center;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 4rem;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 16, 28, 1) 0%, rgba(10, 16, 28, 0.6) 100%);
`;

const WelcomeCard = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(28, 31, 36, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: ${tokens.sizes.cardRadius};
  max-width: 800px;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin: 0;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${tokens.colors.textSecondary};
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
`;

const CreateTicketButton = styled(Link)`
  background: ${tokens.colors.primary};
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
`;

const MainContent = styled.div`
  padding: 2rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 2rem 4rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 1.5rem;
`;

const TrackerContainer = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
  margin-bottom: 2rem;
`;

const TrackerHeader = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

// --- RESPONSIVE STEPPER (WITH TRANSIENT PROPS FIX) ---
const Stepper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
  }
`;

const Step = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  flex-direction: row;
  width: 100%;
  text-align: left;
  gap: 1rem;
  
  &:not(:last-child)::after {
    content: ''; 
    position: absolute;
    top: 40px; 
    left: 20px; 
    width: 4px; 
    height: 100%;
    /* Use $completed prop */
    background-color: ${props => (props.$completed ? tokens.colors.primary : tokens.colors.subtle)};
    z-index: -1;
  }

  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    width: 20%;
    text-align: center;
    gap: 0;

    &:not(:last-child)::after {
      top: 20px; left: 50%; width: 100%; height: 4px;
    }
  }
`;

const StepIcon = styled.div`
  width: 40px; 
  height: 40px; 
  border-radius: 50%;
  /* Use $active and $completed props */
  background-color: ${props => (props.$active || props.$completed ? tokens.colors.primary : tokens.colors.subtle)};
  color: white; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-weight: bold; 
  border: 4px solid ${tokens.colors.cardBg};
  flex-shrink: 0;
`;

const StepLabel = styled.p`
  margin-top: 0;
  font-weight: ${tokens.fontWeights.semibold};
  /* Use $active and $completed props */
  color: ${props => (props.$active || props.$completed ? tokens.colors.textPrimary : tokens.colors.textSecondary)};
  @media (min-width: ${tokens.breakpoints.mobile}) {
    margin-top: 0.8rem;
  }
`;
// --- END RESPONSIVE STEPPER ---

const HistorySection = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
`;

// --- RESPONSIVE TABLE (CARD LIST ON MOBILE) ---
const TicketTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    @media (max-width: ${tokens.breakpoints.mobile}) {
      display: none;
    }
  }
  tbody, tr {
    @media (max-width: ${tokens.breakpoints.mobile}) {
      display: block;
      width: 100%;
    }
  }
  tr {
    @media (max-width: ${tokens.breakpoints.mobile}) {
      border: 1px solid ${tokens.colors.inputBorder};
      border-radius: 8px;
      margin-bottom: 1rem;
      padding: 1rem;
    }
  }
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${tokens.colors.inputBorder};
    
    @media (max-width: ${tokens.breakpoints.mobile}) {
      display: block;
      width: 100%;
      text-align: right;
      border-bottom: none;
      padding-left: 50%;
      position: relative;
      
      &::before {
        content: attr(data-label); 
        position: absolute;
        left: 1rem;
        width: calc(50% - 1rem);
        text-align: left;
        font-weight: ${tokens.fontWeights.semibold};
        color: ${tokens.colors.textSecondary};
      }
    }
  }
  tbody tr:last-child td { border-bottom: none; }
`;

const StyledLink = styled(Link)`
  color: ${tokens.colors.primary};
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
  &:hover { text-decoration: underline; }
`;

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/tickets/');
        setTickets(response.data);
      } catch (err) { console.error('Failed to fetch tickets', err); } 
      finally { if (loading) setLoading(false); }
    };

    fetchTickets();
    const intervalId = setInterval(fetchTickets, 10000);
    return () => clearInterval(intervalId);
  }, [loading]);

  const { activeTicket, historicalTickets } = useMemo(() => {
    const sorted = [...tickets].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const firstActive = sorted.find(t => t.status !== 'Completed' && t.status !== 'Cancelled');
    return { activeTicket: firstActive, historicalTickets: sorted };
  }, [tickets]);
  
  const journeySteps = ['Open', 'Scheduled', 'In Progress', 'Awaiting Parts', 'Completed'];
  let activeStepIndex = activeTicket ? journeySteps.indexOf(activeTicket.status) : -1;
  if (activeStepIndex === -1 && activeTicket) activeStepIndex = 2;

  const renderContent = () => {
    if (loading) return <p style={{ padding: '2rem' }}>Loading dashboard...</p>;

    return (
      <>
        {activeTicket ? (
          <TrackerContainer>
            <TrackerHeader>Following Up On: #{activeTicket.customer_ticket_id} - {activeTicket.title}</TrackerHeader>
            <Stepper>
              {journeySteps.map((step, index) => (
                <Step key={step} $completed={index < activeStepIndex} $active={index === activeStepIndex}>
                  <StepIcon $completed={index < activeStepIndex} $active={index === activeStepIndex}>
                    {index < activeStepIndex ? '✓' : index + 1}
                  </StepIcon>
                  <StepLabel $completed={index < activeStepIndex} $active={index === activeStepIndex}>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </TrackerContainer>
        ) : (
          <TrackerContainer style={{ textAlign: 'center' }}>
            <h2>You have no active service tickets.</h2>
          </TrackerContainer>
        )}
        <HistorySection>
          <SectionTitle>Full Service History</SectionTitle>
          <TicketTable>
            <thead>
              <tr>
                <th>Ticket #</th><th>Title</th><th>Status</th><th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {historicalTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td data-label="Ticket #"><StyledLink to={`/tickets/${ticket.id}`}>#{ticket.customer_ticket_id}</StyledLink></td>
                  <td data-label="Title">{ticket.title}</td>
                  <td data-label="Status">{ticket.status}</td>
                  <td data-label="Created On">{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </TicketTable>
        </HistorySection>
      </>
    );
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroOverlay />
        <WelcomeCard>
          <WelcomeTitle>Welcome, {user?.first_name || user?.email}!</WelcomeTitle>
          <WelcomeSubtitle>This is your personal hub to manage all your service requests.</WelcomeSubtitle>
          <CreateTicketButton to="/tickets/new">Create New Ticket</CreateTicketButton>
        </WelcomeCard>
      </HeroSection>
      <MainContent>
        {renderContent()}
      </MainContent>
    </PageWrapper>
  );
};

export default CustomerDashboard;

