import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import tokens from '../styles/tokens';
import Button from './Button';

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
const ModalHeader = styled.h2` font-size: 1.5rem; font-weight: ${tokens.fontWeights.bold}; margin-bottom: 1.5rem; `;
const Form = styled.form` display: grid; gap: 1.5rem; `;
const FieldGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; `;
const Field = styled.div` display: flex; flex-direction: column; `;
const Label = styled.label` font-size: 0.9rem; margin-bottom: 0.5rem; color: ${tokens.colors.textSecondary};`;
const Input = styled.input`
  padding: 0.8rem 1rem; background: ${tokens.colors.inputBg}; border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px; color: ${tokens.colors.textPrimary};
`;
const Select = styled.select`
  padding: 0.8rem 1rem; background: ${tokens.colors.inputBg}; border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px; color: ${tokens.colors.textPrimary};
`;
const ButtonGroup = styled.div` display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; `;
const ErrorText = styled.p` color: ${tokens.colors.error}; font-size: 0.9rem; margin-top: -0.5rem; `;

const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    password2: '',
    user_role: 'customer'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }
    // We send all data except password2
    const { password2, ...dataToSave } = formData;
    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Create New User</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Email Address</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Field>
          <FieldGrid>
            <Field>
              <Label>First Name</Label>
              <Input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
            </Field>
            <Field>
              <Label>Last Name</Label>
              <Input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
            </Field>
          </FieldGrid>
          <Field>
            <Label>Phone Number</Label>
            <Input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </Field>
          <Field>
            <Label>User Role</Label>
            <Select name="user_role" value={formData.user_role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <FieldGrid>
            <Field>
              <Label>Password</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Confirm Password</Label>
              <Input type="password" name="password2" value={formData.password2} onChange={handleChange} required />
            </Field>
          </FieldGrid>
          
          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" $variant="primary">Create User</Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default CreateUserModal;
