import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';

// --- Styled Components (No changes needed) ---
const Header = styled.h1`
  font-size: 2.2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
  border: 1px solid ${tokens.colors.inputBorder};
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: ${tokens.colors.textSecondary};
`;

const StatValue = styled.p`
  font-size: 2.5rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-top: 0.5rem;
`;

const TicketTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  background: ${tokens.colors.cardBg};
  border-radius: ${tokens.sizes.cardRadius};
  overflow: hidden;
  
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid ${tokens.colors.inputBorder};
  }

  th {
    color: ${tokens.colors.textSecondary};
    font-weight: ${tokens.fontWeights.semibold};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.8rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
`;

const StyledLink = styled(Link)`
  color: ${tokens.colors.primary};
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
  &:hover {
    text-decoration: underline;
  }
`;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- THIS IS THE FIX ---
        // We now make three separate, correct API calls.
        const [statsRes, ticketsRes, techniciansRes] = await Promise.all([
          axiosInstance.get('/dashboard-stats/'),      // 1. Get the accurate stats (not paginated)
          axiosInstance.get('/tickets/?page_size=5'), // 2. Get 5 recent tickets (paginated)
          axiosInstance.get('/users/?role=technician') // 3. Get technicians (paginated)
        ]);
        
        setStats(statsRes.data);
        setRecentTickets(ticketsRes.data.results); // Get 'results' from paginated tickets
        setTechnicians(techniciansRes.data.results); // Get 'results' from paginated technicians
      
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // This effect runs once on mount

  const handleAssignmentChange = async (ticketId, technicianId) => {
    const assigned_to = technicianId ? parseInt(technicianId) : null;
    try {
      const response = await axiosInstance.patch(`/tickets/${ticketId}/`, { assigned_to });
      // Update the 'recentTickets' list to show the change immediately
      setRecentTickets(recentTickets.map(t => t.id === ticketId ? response.data : t));
    } catch (err) {
      console.error("Failed to update assignment", err);
      alert("Could not update assignment.");
    }
  };

  // This check is now safe because 'stats' is correctly fetched
  if (loading || !stats) return <p>Loading Dashboard Overview...</p>;

  return (
    <div>
      <Header>Dashboard Overview (Welcome, {user?.first_name || user?.email}!)</Header>
      <StatsGrid>
        {/* These stats are now 100% accurate from our new endpoint */}
        <StatCard><StatTitle>Total Tickets</StatTitle><StatValue>{stats.total_tickets}</StatValue></StatCard>
        <StatCard><StatTitle>Open Tickets</StatTitle><StatValue>{stats.open_tickets}</StatValue></StatCard>
        <StatCard><StatTitle>Technicians</StatTitle><StatValue>{stats.total_technicians}</StatValue></StatCard>
        <StatCard><StatTitle>Customers</StatTitle><StatValue>{stats.total_customers}</StatValue></StatCard>
      </StatsGrid>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Manage Recent Tickets</h2>
      <TicketTable>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Customer</th><th>Status</th><th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {/* This .map() is now safe because 'recentTickets' is a guaranteed array */}
          {recentTickets.map(ticket => (
            <tr key={ticket.id}>
              <td><StyledLink to={`/tickets/${ticket.id}`}>#{ticket.id}</StyledLink></td>
              <td>{ticket.title}</td>
              <td>{ticket.created_by_email}</td>
              <td>{ticket.status}</td>
              <td>
                <Select 
                  value={ticket.assigned_to || ''} 
                  onChange={(e) => handleAssignmentChange(ticket.id, e.target.value)}
                >
                  <option value="">-- Unassigned --</option>
                  {/* This .map() is now safe because 'technicians' is a guaranteed array */}
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.first_name}</option>
                  ))}
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </TicketTable>
    </div>
  );
};

export default AdminDashboard;

