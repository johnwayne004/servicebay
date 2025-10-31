import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';
import NotificationModal from '../components/NotificationModal';

// --- Styled Components (WITH RESPONSIVE FIXES) ---
const PageContainer = styled.div`
  padding: 2rem 1.5rem; /* Mobile-first padding */
  font-family: ${tokens.fontFamily};
  color: ${tokens.colors.textPrimary};
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  background-color: ${tokens.colors.pageBg};

  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: 2rem 4rem; /* Desktop padding */
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.8rem; /* Mobile size */
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 1.5rem;
  @media (min-width: ${tokens.breakpoints.tablet}) {
    font-size: 2.2rem; /* Desktop size */
  }
`;

const DetailPageLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile First: Single column */
  gap: 1.5rem;

  @media (min-width: ${tokens.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr; /* Two columns on larger screens */
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailCard = styled.div`
  background: ${tokens.colors.cardPanel};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${tokens.fontWeights.semibold};
  margin-bottom: 1rem;
  border-bottom: 1px solid ${tokens.colors.inputBorder};
  padding-bottom: 0.8rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.8rem;
`;

const InfoLabel = styled.span`
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.textSecondary};
`;

const InfoValue = styled.span`
  word-break: break-word;
`;

const DescriptionBlock = styled.div`
  margin-top: 1.5rem;
  line-height: 1.7;
  white-space: pre-wrap;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
`;

const UpdateButton = styled.button`
  width: 100%;
  background: linear-gradient(180deg, ${tokens.colors.primary}, ${tokens.colors.primaryHover});
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  margin-top: 1rem;
`;

const ClosedTicketCard = styled(DetailCard)`
  border-left: 4px solid ${tokens.colors.textSecondary};
  p { margin: 0; font-weight: ${tokens.fontWeights.semibold}; color: ${tokens.colors.textSecondary}; }
`;

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false });

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;
      try {
        const response = await axiosInstance.get(`/tickets/${ticketId}/`);
        setTicket(response.data);
        setCurrentStatus(response.data.status);
      } catch (err) {
        setError('Failed to fetch ticket details. You may not have permission to view this ticket.');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const handleStatusUpdate = async () => {
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/`, { status: currentStatus });
      setTicket(response.data);
      setModalState({ isOpen: true, type: 'success', title: 'Status Updated', message: 'The ticket status has been saved.' });
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Update Failed', message: 'Could not save the new status.' });
    }
  };

  if (loading) return <PageContainer><p>Loading ticket details...</p></PageContainer>;
  if (error) return <PageContainer><p style={{ color: tokens.colors.error }}>{error}</p></PageContainer>;
  if (!ticket) return null;

  const isTicketClosed = ticket.status === 'Completed' || ticket.status === 'Cancelled';
  const canAdminEdit = user?.user_role === 'admin';
  const canMechanicEdit = user?.user_role === 'technician' && !isTicketClosed;
  const showActionsPanel = canAdminEdit || canMechanicEdit;

  // --- PRIVACY FIX ---
  // Determine which customer identifier to show
  const isCustomerViewing = user?.user_role === 'customer';
  const customerIdentifier = isCustomerViewing ? ticket.created_by_email : (ticket.created_by_name || 'N/A');
  const customerLabel = isCustomerViewing ? 'Your Email' : 'Customer';

  // Determine which ticket ID to show
  const displayTicketId = isCustomerViewing ? ticket.customer_ticket_id : ticket.id;

  return (
    <>
      <NotificationModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        {...modalState}
      />
      <PageContainer>
        <HeaderTitle>Ticket #{displayTicketId}: {ticket.title}</HeaderTitle>
        
        <DetailPageLayout>
          <MainContent>
            <CardTitle>Service Request Details</CardTitle>
            <InfoGrid>
              <InfoLabel>Category:</InfoLabel><InfoValue>{ticket.category}</InfoValue>
              <InfoLabel>Priority:</InfoLabel><InfoValue>{ticket.priority}</InfoValue>
              <InfoLabel>Status:</InfoLabel><InfoValue>{ticket.status}</InfoValue>
              <InfoLabel>Created:</InfoLabel><InfoValue>{new Date(ticket.created_at).toLocaleString()}</InfoValue>
            </InfoGrid>
            <DescriptionBlock>
              <CardTitle>Description</CardTitle>
              <p>{ticket.description}</p>
            </DescriptionBlock>
          </MainContent>

          <Sidebar>
            <DetailCard>
              <CardTitle>Customer Information</CardTitle>
              <InfoGrid>
                <InfoLabel>{customerLabel}:</InfoLabel>
                <InfoValue>{customerIdentifier}</InfoValue>
              </InfoGrid>
            </DetailCard>

            <DetailCard>
              <CardTitle>Vehicle Information</CardTitle>
              <InfoGrid>
                <InfoLabel>Make:</InfoLabel><InfoValue>{ticket.vehicle_make || 'N/A'}</InfoValue>
                <InfoLabel>Model:</InfoLabel><InfoValue>{ticket.vehicle_model || 'N/A'}</InfoValue>
                <InfoLabel>Year:</InfoLabel><InfoValue>{ticket.vehicle_year || 'N/A'}</InfoValue>
                <InfoLabel>Plate #:</InfoLabel><InfoValue>{ticket.license_plate || 'N/A'}</InfoValue>
              </InfoGrid>
            </DetailCard>
            
            {showActionsPanel && (
              <DetailCard>
                <CardTitle>Actions</CardTitle>
                <InfoLabel>Change Status</InfoLabel>
                <Select 
                  value={currentStatus} 
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting Parts">Awaiting Parts</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
                <UpdateButton onClick={handleStatusUpdate}>Update Status</UpdateButton>
              </DetailCard>
            )}

            {user?.user_role === 'technician' && isTicketClosed && (
              <ClosedTicketCard>
                <p>This ticket is closed. Please contact an administrator to reopen it.</p>
              </ClosedTicketCard>
            )}
          </Sidebar>
        </DetailPageLayout>
      </PageContainer>
    </>
  );
};

export default TicketDetailPage;

