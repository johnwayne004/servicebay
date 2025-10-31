import React, { useContext } from 'react'; // Import useContext
import styled from 'styled-components';
import tokens from '../styles/tokens';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - ${tokens.sizes.navbarHeight || '60px'});
    background-color: ${tokens.colors.cardBg}; /* Or pageBg if you prefer it blending with AppWrapper */
    color: ${tokens.colors.textPrimary};
    font-family: ${tokens.fontFamily};
    padding: 2rem;
    text-align: center;
`;

const WelcomeMessage = styled.h2`
    font-size: ${tokens.fontSizes.h3};
    color: ${tokens.colors.primary};
    margin-bottom: 1rem;
`;

const SubText = styled.p`
    font-size: ${tokens.fontSizes.subtitle};
    color: ${tokens.colors.textSecondary};
    max-width: 600px;
    line-height: 1.5;
`;

const DashboardPage = () => {
    const { user } = useContext(AuthContext); // Get user from context

    return (
        <DashboardContainer>
            <WelcomeMessage>Welcome to your Dashboard, {user ? user.email : 'Guest'}!</WelcomeMessage>
            <SubText>
                This is your personalized area where you can manage service requests, view your profile, and access exclusive tools.
                We'll build out the full functionality here soon!
            </SubText>
            {/* Add more dashboard content here later */}
        </DashboardContainer>
    );
};

export default DashboardPage;