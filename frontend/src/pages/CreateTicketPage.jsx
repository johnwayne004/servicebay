import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import tokens from '../styles/tokens';
import NotificationModal from '../components/NotificationModal';

// --- Styled Components ---

// 1. NEW full-width wrapper for the background
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px); /* Fill screen height below navbar */
  background-color: ${tokens.colors.pageBg};
  padding: 2rem 4rem;
  font-family: ${tokens.fontFamily};
  color: ${tokens.colors.textPrimary};

  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

// 2. RENAMED and MODIFIED to be the centered content container
const FormContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: ${tokens.fontWeights.bold};
  margin-bottom: 2rem;
  border-bottom: 1px solid ${tokens.colors.inputBorder};
  padding-bottom: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  background: ${tokens.colors.cardBg};
  padding: 2rem;
  border-radius: ${tokens.sizes.cardRadius};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: ${tokens.fontWeights.semibold};
  color: ${tokens.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
  font-size: ${tokens.fontSizes.input};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.focusRing};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
  font-size: ${tokens.fontSizes.input};
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.focusRing};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: ${tokens.colors.inputBg};
  border: 1px solid ${tokens.colors.inputBorder};
  border-radius: 8px;
  color: ${tokens.colors.textPrimary};
  font-size: ${tokens.fontSizes.input};
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.focusRing};
  }
`;

const Button = styled.button`
  background: linear-gradient(180deg, ${tokens.colors.primary}, ${tokens.colors.primaryHover});
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 999px;
  font-size: ${tokens.fontSizes.btn};
  font-weight: ${tokens.fontWeights.semibold};
  cursor: pointer;
  justify-self: start;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 8px 20px rgba(46, 163, 255, 0.14);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(46, 163, 255, 0.2);
  }
`;

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'Standard',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    license_plate: '',
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/tickets/', formData);
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Ticket Created',
        message: 'Your service request has been submitted successfully!',
      });
    } catch (err) {
      console.error("Create Ticket Error:", err);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Creation Failed',
        message: 'There was an issue submitting your ticket. Please try again.',
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: 'success', title: '', message: '' });
    if (modalState.type === 'success') {
      navigate('/dashboard/customer');
    }
  };

  return (
    <>
      <NotificationModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
      />
      
      {/* 3. WRAP content in the new full-width PageWrapper */}
      <PageWrapper>
        <FormContainer>
          <Title>Create a New Service Ticket</Title>
          
          <Form onSubmit={handleSubmit}>
            <Field>
              <Label htmlFor="title">Title / Main Issue</Label>
              <Input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required />
            </Field>

            <Field>
              <Label htmlFor="description">Detailed Description</Label>
              <TextArea name="description" id="description" value={formData.description} onChange={handleChange} required />
            </Field>

            <Field>
              <Label htmlFor="category">Service Category</Label>
              <Select name="category" id="category" value={formData.category} onChange={handleChange}>
                <option value="Maintenance">Routine Maintenance</option>
                <option value="Engine">Engine Services</option>
                <option value="Brakes">Brake Services</option>
                <option value="Tires">Tire Services</option>
                <option value="Suspension">Suspension & Steering</option>
                <option value="Electrical">Electrical System</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Bodywork">Bodywork/Cosmetic</option>
                <option value="Other">Other Service</option>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" id="priority" value={formData.priority} onChange={handleChange}>
                <option value="Routine">Routine</option>
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </Select>
            </Field>

            <hr style={{borderColor: tokens.colors.inputBorder, margin: '1rem 0'}} />

            <h3 style={{fontSize: '1.2rem', fontWeight: tokens.fontWeights.semibold}}>Vehicle Information</h3>
            
            <Field>
              <Label htmlFor="vehicle_make">Vehicle Make (e.g., Toyota)</Label>
              <Input type="text" name="vehicle_make" id="vehicle_make" value={formData.vehicle_make} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="vehicle_model">Vehicle Model (e.g., Corolla)</Label>
              <Input type="text" name="vehicle_model" id="vehicle_model" value={formData.vehicle_model} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="vehicle_year">Vehicle Year</Label>
              <Input type="number" name="vehicle_year" id="vehicle_year" value={formData.vehicle_year} onChange={handleChange} />
            </Field>

            <Field>
              <Label htmlFor="license_plate">License Plate</Label>
              <Input type="text" name="license_plate" id="license_plate" value={formData.license_plate} onChange={handleChange} />
            </Field>

            <Button type="submit">Submit Ticket</Button>
          </Form>
        </FormContainer>
      </PageWrapper>
    </>
  );
};

export default CreateTicketPage;

