import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';

// --- Icon Components ---
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.94V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h9Z"></path><path d="M11 9H2a2 2 0 0 0-2 2v2"></path><path d="m7 17-5-5"></path><path d="M22 9h-6"></path><path d="m16 17 6-6"></path><path d="M9 17H3"></path><path d="M15 9h5"></path></svg>;
const WrenchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;

// --- Styled Components (WITH RESPONSIVE & STYLE FIXES) ---
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: ${tokens.colors.pageBg};
  padding: 2rem 1.5rem; /* Mobile-first padding */
  font-family: ${tokens.fontFamily};
  color: ${tokens.colors.textPrimary};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: -1;
    background-image: 
      radial-gradient(circle at 10% 20%, ${tokens.colors.primary} 0%, transparent 40%),
      radial-gradient(circle at 80% 90%, ${tokens.colors.accent} 0%, transparent 40%);
    filter: blur(150px);
    opacity: 0.15;
  }

  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 2rem 4rem; /* Desktop padding */
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column; /* Mobile-first: stack */
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: ${tokens.breakpoints.tablet}) {
    flex-direction: row; /* Desktop: side-by-side */
    justify-content: space-between;
    align-items: flex-start;
  }
`;
const Title = styled.h1` font-size: 2rem; font-weight: ${tokens.fontWeights.bold}; `;
const Subtitle = styled.p` color: ${tokens.colors.textSecondary}; font-size: 1rem; margin-top: 0.25rem;`;

const JobBoardLayout = styled.div` display: grid; grid-template-columns: 1fr; gap: 2rem; `;
const NextUpCard = styled.div`
  background: rgba(28, 31, 36, 0.6); /* Glassmorphism background */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 2rem;
  }
`;
const NextUpHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const NextUpTitle = styled.h2` font-size: 1.5rem; font-weight: ${tokens.fontWeights.bold}; `;
const PriorityTag = styled.span`
  padding: 0.4rem 1rem; border-radius: 999px; font-size: 0.8rem;
  font-weight: ${tokens.fontWeights.bold}; text-transform: uppercase;
  background-color: ${props => {
    if (props.priority === 'Urgent' || props.priority === 'Critical') return tokens.colors.error;
    if (props.priority === 'High') return '#f1c40f';
    return tokens.colors.primary;
  }};
  color: ${props => (props.priority === 'High' ? 'black' : 'white')};
`;
const NextUpDetails = styled.p` font-size: 1rem; color: ${tokens.colors.textSecondary}; line-height: 1.6; `;
const NextUpLink = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  background: transparent;
  color: ${tokens.colors.primary};
  border: 1px solid ${tokens.colors.primary};
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
  transition: all 0.2s ease-in-out;
  &:hover {
    background: ${tokens.colors.primary};
    color: white;
  }
`;

const QueueSection = styled.div``;
const SectionTitle = styled.h2` font-size: 1.5rem; font-weight: ${tokens.fontWeights.bold}; margin-bottom: 1.5rem; `;

const JobSlip = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: ${tokens.colors.cardBg}; border-radius: 8px;
  padding: 1rem 1.5rem; text-decoration: none; color: inherit;
  border: 1px solid ${tokens.colors.inputBorder}; margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }

  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;
const JobSlipInfo = styled.div``;
const JobSlipTitle = styled.h3` font-size: 1.1rem; font-weight: ${tokens.fontWeights.semibold}; margin-bottom: 0.5rem;`;
const JobSlipMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${tokens.colors.textSecondary};
  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    gap: 1rem;
  }
`;
const MetaItem = styled.span` display: flex; align-items: center; gap: 0.4rem; `;

const ReportButton = styled.button`
  background: ${tokens.colors.inputBg};
  color: ${tokens.colors.textPrimary};
  border: 1px solid ${tokens.colors.inputBorder};
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  align-self: flex-start;
  
  @media (min-width: ${tokens.breakpoints.tablet}) {
    align-self: auto;
  }
`;

const HistorySection = styled.div`
  margin-top: 3rem;
  background: ${tokens.colors.cardBg};
  border-radius: ${tokens.sizes.cardRadius};
  overflow: hidden;
`;
const HistoryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  
  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    @media (max-width: ${tokens.breakpoints.mobile}) { display: none; }
  }
  tbody, tr {
    @media (max-width: ${tokens.breakpoints.mobile}) { display: block; width: 100%; }
  }
  
  tr {
    @media (max-width: ${tokens.breakpoints.mobile}) {
      border: 1px solid ${tokens.colors.inputBorder};
      border-radius: 8px;
      margin-bottom: 1.5rem; /* <-- FIX 1: Increased mobile spacing */
      padding: 1rem;
    }
  }
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid ${tokens.colors.inputBorder};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
  
  td {
    @media (max-width: ${tokens.breakpoints.mobile}) {
      display: block; width: 100%; text-align: right;
      border-bottom: none; padding-left: 50%; position: relative;
      &::before {
        content: attr(data-label);
        position: absolute; left: 1rem; width: calc(50% - 1rem);
        text-align: left; font-weight: ${tokens.fontWeights.semibold};
        color: ${tokens.colors.textSecondary};
      }
    }
  }
`;

const StyledLink = styled(Link)`
  color: ${tokens.colors.primary}; /* <-- FIX 2: Link is now blue by default */
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
  transition: color 0.2s ease;
  &:hover {
    text-decoration: underline;
  }
`;
const ViewAllButton = styled.button`
  background: none; border: none; color: ${tokens.colors.primary};
  font-weight: ${tokens.fontWeights.semibold}; cursor: pointer; font-size: 0.9rem;
`;

const MechanicDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/tickets/');
        setTickets(response.data);
      } catch (err) { console.error('Failed to fetch tickets', err); } 
      finally { setLoading(false); }
    };
    fetchTickets();
  }, []);

  const { nextUpTicket, queuedTickets, allCompletedTickets } = useMemo(() => {
    const active = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
    const completed = tickets.filter(t => t.status === 'Completed' || t.status === 'Cancelled').sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    const sortedActive = [...active].sort((a, b) => {
      const priorityOrder = { 'Critical': 4, 'Urgent': 3, 'High': 2, 'Standard': 1, 'Routine': 0 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) return priorityOrder[b.priority] - priorityOrder[a.priority];
      return new Date(a.created_at) - new Date(b.created_at);
    });
    const nextUp = sortedActive.length > 0 ? sortedActive[0] : null;
    const queue = nextUp ? sortedActive.slice(1) : [];
    return { nextUpTicket: nextUp, queuedTickets: queue, allCompletedTickets: completed };
  }, [tickets]);

  const historyToShow = showAllHistory ? allCompletedTickets : allCompletedTickets.slice(0, 5);

  const handleDownloadReport = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const completedToday = allCompletedTickets.filter(t => new Date(t.updated_at) >= startOfToday);
    if (completedToday.length === 0) {
      alert("No jobs completed today to generate a report.");
      return;
    }
    let reportContent = `Mechanic Daily Report\nTechnician: ${user?.first_name || user?.email}\nDate: ${new Date().toLocaleDateString()}\nTotal Jobs Completed: ${completedToday.length}\n------------------------------------\n\n`;
    completedToday.forEach(ticket => {
      reportContent += `Ticket ID: #${ticket.id}\nTitle: ${ticket.title}\nCustomer: ${ticket.created_by_name}\nVehicle: ${ticket.vehicle_make} ${ticket.vehicle_model}\nCompleted At: ${new Date(ticket.updated_at).toLocaleTimeString()}\n------------------------------------\n`;
    });
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `mechanic_report_${user?.email}_${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <PageWrapper><p>Loading workbench...</p></PageWrapper>;

  return (
    <PageWrapper>
      <Header>
        <div>
          <Title>Mechanic Workbench</Title>
          <Subtitle>Welcome back, {user?.first_name || user?.email}!</Subtitle>
        </div>
        <ReportButton onClick={handleDownloadReport}>Download Today's Report</ReportButton>
      </Header>

      <JobBoardLayout>
        {nextUpTicket ? (
          <NextUpCard>
            <NextUpHeader>
              <NextUpTitle>Next Up: #{nextUpTicket.id} - {nextUpTicket.title}</NextUpTitle>
              <PriorityTag priority={nextUpTicket.priority}>{nextUpTicket.priority}</PriorityTag>
            </NextUpHeader>
            <NextUpDetails>
              {/* --- FIX 3: Using Customer Name --- */}
              <strong>Customer:</strong> {nextUpTicket.created_by_name || 'N/A'}<br/>
              <strong>Vehicle:</strong> {nextUpTicket.vehicle_make} {nextUpTicket.vehicle_model} ({nextUpTicket.vehicle_year})
            </NextUpDetails>
            <NextUpLink to={`/tickets/${nextUpTicket.id}`}>View Full Details & Update Status</NextUpLink>
          </NextUpCard>
        ) : (
          <NextUpCard><NextUpTitle>All jobs are complete.</NextUpTitle></NextUpCard>
        )}

        {queuedTickets.length > 0 && (
          <QueueSection>
            <SectionTitle>In the Queue</SectionTitle>
            {queuedTickets.map(ticket => (
              <JobSlip key={ticket.id} to={`/tickets/${ticket.id}`}>
                <JobSlipInfo>
                  <JobSlipTitle>#{ticket.id}: {ticket.title}</JobSlipTitle>
                  <JobSlipMeta>
                    {/* --- FIX 3: Using Customer Name --- */}
                    <MetaItem><UserIcon/> {ticket.created_by_name || 'N/A'}</MetaItem>
                    <MetaItem><CarIcon/> {ticket.vehicle_make} {ticket.vehicle_model}</MetaItem>
                    <MetaItem><WrenchIcon/> {ticket.category}</MetaItem>
                  </JobSlipMeta>
                </JobSlipInfo>
                <PriorityTag priority={ticket.priority}>{ticket.priority}</PriorityTag>
              </JobSlip>
            ))}
          </QueueSection>
        )}

        <HistorySection>
          <HistoryHeader>
            <SectionTitle>Work History</SectionTitle>
            {allCompletedTickets.length > 5 && (
              <ViewAllButton onClick={() => setShowAllHistory(!showAllHistory)}>
                {showAllHistory ? 'Show Less' : `View All (${allCompletedTickets.length})`}
              </ViewAllButton>
            )}
          </HistoryHeader>
          <HistoryTable>
            <thead>
              <tr>
                <th>Ticket ID</th><th>Title</th><th>Customer</th><th>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {historyToShow.length > 0 ? (
                historyToShow.map(ticket => (
                  <tr key={ticket.id}>
                    {/* --- FIX 3: Using Customer Name --- */}
                    <td data-label="Ticket ID"><StyledLink to={`/tickets/${ticket.id}`}>#{ticket.id}</StyledLink></td>
                    <td data-label="Title">{ticket.title}</td>
                    <td data-label="Customer">{ticket.created_by_name || 'N/A'}</td>
                    <td data-label="Completed At">{new Date(ticket.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No completed jobs yet.</td></tr>
              )}
            </tbody>
          </HistoryTable>
        </HistorySection>
      </JobBoardLayout>
    </PageWrapper>
  );
};

export default MechanicDashboard;

