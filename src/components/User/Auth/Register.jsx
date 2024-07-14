// frontend/src/components/RegisterForm.js

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { registerUser } from '../../../functions/api';
import { toast } from 'react-toastify';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import { convertToBase64 } from '../../../functions/utils';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isCompany: false,
    businessName: '',
    location: '',
    yearStarted: '',
    legalDocumentsURI: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const onFileSelect = async (e, fileKey) => {
    const file = e.files[0];
    const base64 = await convertToBase64(file);
    setFormData((prevState) => ({
      ...prevState,
      [fileKey]: base64,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      console.log(response)
      if (response.success) {
        toast.success(response.message);
        console.log(response)
        navigate('/dashboard')
      } else {
        toast.error(response.message);
        console.log(response)
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img src="/images/logo-white.png" alt="logo" height={50} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Register</div>
          <span className="text-600 font-medium line-height-3">Already have an account?</span>
          <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href='/login'>Sign in</a>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName" className="block text-900 font-medium mb-2">First Name</label>
          <InputText id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="w-full mb-3" />

          <label htmlFor="lastName" className="block text-900 font-medium mb-2">Last Name</label>
          <InputText id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="w-full mb-3" />

          <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
          <InputText id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full mb-3" />

          <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
          <InputText id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="w-full mb-3" />

          <div className="flex align-items-center mb-3">
            <Checkbox inputId="isCompany" name="isCompany" checked={formData.isCompany} onChange={handleChange} className="mr-2" />
            <label htmlFor="isCompany">Registering as a company?</label>
          </div>

          {formData.isCompany && (
            <>
              <label htmlFor="businessName" className="block text-900 font-medium mb-2">Business Name</label>
              <InputText id="businessName" name="businessName" type="text" value={formData.businessName} onChange={handleChange} className="w-full mb-3" />

              <label htmlFor="location" className="block text-900 font-medium mb-2">Location</label>
              <InputText id="location" name="location" type="text" value={formData.location} onChange={handleChange} className="w-full mb-3" />

              <label htmlFor="yearStarted" className="block text-900 font-medium mb-2">Year Started</label>
              <InputText id="yearStarted" name="yearStarted" type="text" value={formData.yearStarted} onChange={handleChange} className="w-full mb-3" />


                  <label className="block text-900 font-medium mb-2" htmlFor="legalDocumentsURI">Business Documents </label>
                  <FileUpload
                    mode="basic"
                    name="legalDocumentsURI"
                    accept="application/pdf"
                    className="document w-full mb-3"
                    maxFileSize={1000000}
                    onSelect={(e) => onFileSelect(e, "legalDocumentsURI")}
                  />
                  <Tooltip
                    target=".document"
                    content="Documents containing information investors need to know about your business"
                  />

            </>
          )}

          <Button label="Register" icon="pi pi-user" className="w-full" type='submit' />
        </form>
      </div>
    </div>
  );
};

export default Register;
