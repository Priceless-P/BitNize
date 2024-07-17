// frontend/src/components/LoginForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { loginUser } from '../../../functions/api';
import { toast } from 'react-toastify';
import Navbar from '../../Homepage/Navigation/Navbar';

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = sessionStorage.getItem('user');
        const token = document.cookie.split('; ').find(row => row.startsWith('Bit-Token='));

        if (user && token) {
          navigate('/dashboard');
        }
      }, [navigate]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      if (response.success) {
        toast.success(response.message);
        navigate("/dashboard")
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
  <>
  <Navbar />
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img src="/images/logo-white.png" alt="logo" height={50} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span className="text-600 font-medium line-height-3">Don't have an account?</span>
          <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href='/register'>Create today!</a>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
          <InputText id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full mb-3" />

          <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
          <InputText id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="w-full mb-3" />

          <Button label="Sign In" icon="pi pi-user" className="w-full" />
        </form>
      </div>
    </div>
     </>
  );
};

export default Login;
