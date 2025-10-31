import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import tokens from '../styles/tokens';

// --- Styled Components ---
const Header = styled.h1`
  font-size: 2.2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 2rem;
`;
const FilterBar = styled.div`
  margin-bottom: 2rem;
`;
const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.8rem 1rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
  font-size: 1rem;
`;
const TicketTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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
    cursor: pointer;
    user-select: none;
  }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background-color: ${tokens.colors.cardPanel}; }
`;
const StyledLink = styled(Link)`
  color: ${tokens.colors.primary};
  text-decoration: none;
  font-weight: ${tokens.fontWeights.semibold};
  &:hover { text-decoration: underline; }
`;

// --- NEW PAGINATION STYLES ---
const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: ${tokens.colors.cardBg};
  border-radius: ${tokens.sizes.cardRadius};
  margin-top: 1.5rem;
`;
const PageInfo = styled.span`
  color: ${tokens.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: ${tokens.fontWeights.semibold};
`;
const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  color: ${tokens.colors.textPrimary};
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  
  &:disabled {
    background: ${tokens.colors.cardBg};
    color: ${tokens.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:not(:disabled):hover {
    background: ${tokens.colors.primary};
    border-color: ${tokens.colors.primary};
  }
`;
// --- END NEW STYLES ---


const AdminAllTicketsPage = () => {
  // --- STATE MODIFIED FOR PAGINATION ---
  const [data, setData] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');

  // --- MODIFIED fetchPage to handle pagination URLs ---
  const fetchPage = async (url) => {
    setLoading(true);
    try {
      // We use the full URL from the 'next'/'previous' links, 
      // or the base '/tickets/' endpoint.
      // We must remove the base URL part if it's already included in the 'url'
      let fetchUrl = url;
      if (url.startsWith('http')) {
        // If the URL is absolute, parse it to get the path
        fetchUrl = new URL(url).pathname + new URL(url).search;
      }
      
      const response = await axiosInstance.get(fetchUrl);
      setData(response.data);
      
      // Update current page number from the URL
      const pageNum = new URLSearchParams(new URL(url, axiosInstance.defaults.baseURL).search).get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1);

    } catch (err) {
      setError('Failed to fetch tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the first page on initial load
    fetchPage('/tickets/');
  }, []); // Only run on mount

  const filteredAndSortedTickets = useMemo(() => {
    // This logic now runs on the 'data.results' array (the current page)
    let filteredItems = [...data.results];
    
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(ticket => 
        ticket.title.toLowerCase().includes(lowercasedFilter) ||
        ticket.created_by_email.toLowerCase().includes(lowercasedFilter) ||
        (ticket.vehicle_make && ticket.vehicle_make.toLowerCase().includes(lowercasedFilter)) ||
        (ticket.license_plate && ticket.license_plate.toLowerCase().includes(lowercasedFilter)) ||
        String(ticket.id).includes(lowercasedFilter)
      );
    }
    
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filteredItems;
  }, [data.results, sortConfig, searchTerm]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading && !data.results.length) return <div><p>Loading all tickets...</p></div>;
  if (error) return <div><p style={{ color: tokens.colors.error }}>{error}</p></div>;

  const totalPages = Math.ceil(data.count / 10); // 10 is our PAGE_SIZE

  return (
    <>
      <Header>All Service Tickets</Header>
      
      <FilterBar>
        <SearchInput 
          type="text"
          placeholder="Search by ID, title, customer, vehicle, plate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterBar>

      <TicketTable>
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>ID</th>
            <th onClick={() => requestSort('title')}>Title</th>
            <th onClick={() => requestSort('created_by_email')}>Customer</th>
            <th onClick={() => requestSort('status')}>Status</th>
            <th onClick={() => requestSort('priority')}>Priority</th>
            <th onClick={() => requestSort('created_at')}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedTickets.length > 0 ? (
            filteredAndSortedTickets.map(ticket => (
              <tr key={ticket.id}>
                <td><StyledLink to={`/tickets/${ticket.id}`}>#{ticket.id}</StyledLink></td>
                <td>{ticket.title}</td>
                <td>{ticket.created_by_email}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </TicketTable>

      {/* --- NEW PAGINATION CONTROLS RENDER --- */}
      <PaginationControls>
        <PageInfo>Showing page {currentPage} of {totalPages || 1} (Total: {data.count} tickets)</PageInfo>
        <PaginationButtons>
          <PaginationButton 
            onClick={() => fetchPage(data.previous)} 
            disabled={!data.previous}
          >
            Previous
          </PaginationButton>
          <PaginationButton 
            onClick={() => fetchPage(data.next)} 
            disabled={!data.next}
          >
            Next
          </PaginationButton>
        </PaginationButtons>
      </PaginationControls>
    </>
  );
};

export default AdminAllTicketsPage;

