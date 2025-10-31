import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import tokens from '../styles/tokens';
import AuthContext from '../context/AuthContext';
import Button from './Button'; // <-- THIS IS THE DEFINITIVE FIX

// --- ANIMATIONS ---
const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const scaleUp = keyframes` from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } `;

// --- STYLED COMPONENTS ---
const ModalBackdrop = styled.div`
  position: fixed; inset: 0; background-color: rgba(10, 16, 28, 0.7);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; animation: ${fadeIn} 0.2s ease-out;
`;
const ModalContent = styled.div`
  background: ${tokens.colors.cardBg}; padding: 2rem; border-radius: ${tokens.sizes.cardRadius};
  width: 100%; max-width: 550px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${scaleUp} 0.25s ease-out; border: 1px solid ${tokens.colors.inputBorder};
`;
const ModalHeader = styled.div`
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
  border-bottom: 1px solid ${tokens.colors.inputBorder}; padding-bottom: 1.5rem;
`;
const Avatar = styled.div`
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.accent});
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: ${tokens.fontWeights.bold};
`;
const UserInfo = styled.div``;
const UserEmail = styled.h2` font-size: 1.2rem; font-weight: ${tokens.fontWeights.semibold}; margin: 0; `;
const UserId = styled.p` font-size: 0.8rem; color: ${tokens.colors.textSecondary}; margin: 0.2rem 0 0; `;
const Form = styled.form``;
const FormSection = styled.div` margin-bottom: 2rem; `;
const SectionTitle = styled.h3`
  font-size: 1rem; font-weight: ${tokens.fontWeights.bold};
  color: ${props => props.color || tokens.colors.textSecondary}; 
  margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;
  transition: color 0.2s ease;
`;
const FieldGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; `;
const Field = styled.div` display: flex; flex-direction: column; `;
const Label = styled.label` font-size: 0.9rem; margin-bottom: 0.5rem; `;
const Input = styled.input`
  padding: 0.8rem 1rem; background: ${tokens.colors.inputBg}; border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px; color: ${tokens.colors.textPrimary};
  &:read-only { background: ${tokens.colors.subtle}; cursor: not-allowed; }
`;
const Select = styled.select`
  padding: 0.8rem 1rem; background: ${tokens.colors.inputBg}; border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px; color: ${tokens.colors.textPrimary};
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;
const StatusSection = styled.div`
  border: 1px solid ${props => {
    if (props.isSelf) return tokens.colors.inputBorder;
    return props.isActive ? tokens.colors.success : tokens.colors.error;
  }};
  background: ${props => {
    if (props.isSelf) return 'transparent';
    return props.isActive ? tokens.colors.successMuted : 'rgba(252, 129, 129, 0.05)';
  }};
  padding: 1rem;
  border-radius: ${tokens.sizes.cardRadius};
  transition: all 0.2s ease;
`;
const ToggleWrapper = styled.div` display: flex; align-items: center; justify-content: space-between; `;
const ToggleLabel = styled.label`
  font-weight: ${tokens.fontWeights.semibold};
  color: ${props => {
    if (props.disabled) return tokens.colors.textSecondary;
    return props.isActive ? tokens.colors.success : tokens.colors.error;
  }};
`;
const ToggleInput = styled.input`
  opacity: 0; width: 0; height: 0;
  &:checked + span { background-color: ${tokens.colors.success}; }
  &:checked:disabled + span { background-color: ${tokens.colors.subtle}; }
`;
const ToggleSlider = styled.span`
  position: relative;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  width: 48px; height: 26px;
  background-color: ${tokens.colors.subtle};
  border-radius: 34px;
  transition: background-color 0.2s;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  &::before {
    position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px;
    background-color: white; border-radius: 50%; transition: transform 0.2s;
  }
`;
const ButtonGroup = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; `;

// --- The old, duplicated 'Button' styled-component has been DELETED ---

const EditUserModal = ({ user: userToEdit, isOpen, onClose, onSave }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState(userToEdit || {});
  
  const isSelf = currentUser && userToEdit && Number(currentUser.user_id) === Number(userToEdit.id);

  useEffect(() => { setFormData(userToEdit || {}); }, [userToEdit]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  const getInitials = (user) => {
    if (!user) return '';
    const first = user.first_name ? user.first_name[0] : '';
    const last = user.last_name ? user.last_name[0] : '';
    return `${first}${last}`.toUpperCase() || (user.email ? user.email[0].toUpperCase() : '');
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Avatar>{getInitials(userToEdit)}</Avatar>
          <UserInfo>
            <UserEmail>{userToEdit?.email}</UserEmail>
            <UserId>User ID: {userToEdit?.id}</UserId>
          </UserInfo>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>User Details</SectionTitle>
            <FieldGrid>
              <Field>
                <Label>First Name</Label>
                <Input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} />
              </Field>
              <Field>
                <Label>Last Name</Label>
                <Input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} />
              </Field>
            </FieldGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>System Role</SectionTitle>
            <Field>
              <Label>User Role</Label>
              <Select name="user_role" value={formData.user_role || 'customer'} onChange={handleChange} disabled={isSelf}>
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>
          </FormSection>
          
          <StatusSection isActive={formData.is_active} isSelf={isSelf}>
            <SectionTitle color={isSelf ? tokens.colors.textSecondary : formData.is_active ? tokens.colors.success : tokens.colors.error}>
              Account Status
            </SectionTitle>
            <ToggleWrapper>
              <ToggleLabel disabled={isSelf} isActive={formData.is_active}>
                {formData.is_active ? "Account is Active" : "Account is Deactivated"}
                {isSelf && " (Cannot change own status)"}
              </ToggleLabel>
              <label>
                <ToggleInput type="checkbox" name="is_active" checked={formData.is_active || false} onChange={handleChange} disabled={isSelf} />
                <ToggleSlider disabled={isSelf} />
              </label>
            </ToggleWrapper>
          </StatusSection>

          <ButtonGroup>
            {/* --- USING THE NEW REUSABLE BUTTON FROM THE CANVAS --- */}
            <Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" $variant="primary" disabled={isSelf}>Save Changes</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default EditUserModal;

