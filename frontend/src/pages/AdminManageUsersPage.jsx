import React, { useState, useEffect, useContext } from 'react';
import styled, { css } from 'styled-components';
import axiosInstance from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import tokens from '../styles/tokens';
import EditUserModal from '../components/EditUserModal';
import CreateUserModal from '../components/CreateUserModal';
import Button from '../components/Button';

// --- Styled Components (WITH RESPONSIVE FIXES) ---
const Header = styled.h1`
  font-size: 2.2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin: 0;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column; /* Mobile-first: stack */
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row; /* Desktop: side-by-side */
    justify-content: space-between;
    align-items: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const StatCard = styled.div`
  background: ${tokens.colors.cardBg};
  padding: 1.5rem;
  border-radius: ${tokens.sizes.cardRadius};
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${tokens.colors.inputBorder};
  margin-bottom: 2rem;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const TabButton = styled.button`
  padding: 1rem 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: ${tokens.colors.textSecondary};
  font-weight: ${tokens.fontWeights.semibold};
  font-size: 1rem;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  &:hover { color: ${tokens.colors.textPrimary}; }
  ${({ active }) => active && css`
    color: ${tokens.colors.primary};
    border-bottom-color: ${tokens.colors.primary};
  `}
`;

const FilterControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  @media (min-width: ${tokens.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
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

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${tokens.colors.cardBg};
  border-radius: ${tokens.sizes.cardRadius};
  margin-top: 1.5rem;
`;
const PageInfo = styled.span`
  color: ${tokens.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: ${tokens.fontWeights.semibold};
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${tokens.colors.cardBg};
  border-radius: ${tokens.sizes.cardRadius};
  overflow: hidden;
  thead { @media (max-width: ${tokens.breakpoints.mobile}) { display: none; } }
  tbody, tr { @media (max-width: ${tokens.breakpoints.mobile}) { display: block; width: 100%; } }
  tr { @media (max-width: ${tokens.breakpoints.mobile}) { display: block; border: 1px solid ${tokens.colors.inputBorder}; border-radius: 8px; margin-bottom: 1.5rem; padding: 1rem; } }
  th, td { padding: 1rem 1.5rem; text-align: left; border-bottom: 1px solid ${tokens.colors.inputBorder}; }
  tbody tr:last-child td { border-bottom: none; }
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

const EditButton = styled(Button)`
  padding: 0.4rem 0.8rem;
  font-weight: ${tokens.fontWeights.semibold};
`;

const AdminManageUsersPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({ results: [], count: 0, next: null, previous: null });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('customer');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // This is the single, correct function for fetching paginated users
  const fetchUsers = async (url) => {
    try {
      setLoading(true);
      // We build the URL query parameters correctly
      const response = await axiosInstance.get(url);
      setUserData(response.data); // Set the paginated object
      
      // Update current page number from the URL
      const pageNum = new URL(url, axiosInstance.defaults.baseURL).searchParams.get('page');
      setCurrentPage(pageNum ? parseInt(pageNum) : 1);
      
    } catch (err) { 
      setError('Failed to fetch users.');
      console.error(err);
    } 
    finally { setLoading(false); }
  };

  // This fetches the stats just once on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/dashboard-stats/');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);
  
  // Fetch users when component mounts or when tab or search terms change
  useEffect(() => {
    // When tab or search term changes, always reset to page 1
    fetchUsers(`/users/?page=1&role=${activeTab}&search=${searchTerm}`);
  }, [activeTab, searchTerm]); // Removed currentPage from here

  const handleSaveUser = async (updatedUser) => {
    try {
      await axiosInstance.patch(`/users/${updatedUser.id}/`, updatedUser);
      setEditingUser(null);
      fetchUsers(`/users/?page=${currentPage}&role=${activeTab}&search=${searchTerm}`); // Refresh data
    } catch (err) { alert("Failed to save changes."); }
  };

  const handleCreateUser = async (newUserData) => {
    try {
      await axiosInstance.post('/users/', newUserData);
      setIsCreateModalOpen(false);
      fetchUsers(1, newUserData.user_role || 'customer', ''); // Go to page 1 of the new user's tab
      setActiveTab(newUserData.user_role || 'customer');
      setSearchTerm('');
    } catch (err) {
      alert("Failed to create user: " + (err.response?.data?.email || 'Please check fields.'));
    }
  };

  if (loading && !userData.results.length) return <div><p>Loading user list...</p></div>;
  if (error) return <div><p style={{ color: tokens.colors.error }}>{error}</p></div>;

  const totalPages = Math.ceil(userData.count / 10); // 10 is PAGE_SIZE

  return (
    <>
      <PageHeader>
        <Header>Manage Users</Header>
        <Button $variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          + Create New User
        </Button>
      </PageHeader>
      
      {stats && (
        <StatsGrid>
          <StatCard><StatTitle>Customers</StatTitle><StatValue>{stats.total_customers}</StatValue></StatCard>
          <StatCard><StatTitle>Technicians</StatTitle><StatValue>{stats.total_technicians}</StatValue></StatCard>
          <StatCard><StatTitle>Admins</StatTitle><StatValue>{stats.total_admins}</StatValue></StatCard>
        </StatsGrid>
      )}

      <TabContainer>
        <TabButton active={activeTab === 'customer'} onClick={() => { setActiveTab('customer'); setCurrentPage(1); }}>Customers {stats ? `(${stats.total_customers})` : ''}</TabButton>
        <TabButton active={activeTab === 'technician'} onClick={() => { setActiveTab('technician'); setCurrentPage(1); }}>Technicians {stats ? `(${stats.total_technicians})` : ''}</TabButton>
        <TabButton active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setCurrentPage(1); }}>Admins {stats ? `(${stats.total_admins})` : ''}</TabButton>
      </TabContainer>

      <FilterControls>
        <SearchInput 
          type="text"
          placeholder={`Search within ${activeTab}s...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
      </FilterControls>

      <UserTable>
        <thead>
          <tr>
            <th>ID</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.results.length > 0 ? (
            userData.results.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="First Name">{user.first_name || 'N/A'}</td>
                <td data-label="Last Name">{user.last_name || 'N/A'}</td>
                <td data-label="Actions">
                  <EditButton $variant="primary" onClick={() => setEditingUser(user)}>Edit</EditButton>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No users found in this category.</td></tr>
          )}
        </tbody>
      </UserTable>
      
      <PaginationControls>
        <PageInfo>Page {currentPage} of {totalPages || 1} (Total: {userData.count} users)</PageInfo>
        <div>
          <Button $variant="secondary" onClick={() => fetchUsers(userData.previous)} disabled={!userData.previous}>Previous</Button>
          <Button $variant="secondary" style={{marginLeft: '0.5rem'}} onClick={() => fetchUsers(userData.next)} disabled={!userData.next}>Next</Button>
        </div>
      </PaginationControls>

      <EditUserModal 
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
        currentUser={currentUser} 
      />
      
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />
    </>
  );
};

export default AdminManageUsersPage;

