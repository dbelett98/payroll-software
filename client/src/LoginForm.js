// LoginForm.js: React component for login form (updates App state on success – free open-source React).
import React from 'react';
import { useForm } from 'react-hook-form';  // Free form handling lib.
import axios from 'axios';  // Free for API calls.
import { jwtDecode } from 'jwt-decode';  // Free for decoding token.

function LoginForm({ onLoginSuccess }) {
  const { register, handleSubmit } = useForm();  // Hook for form state.

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/login', data);  // Call backend API.
      const token = response.data.token;  // Extract token.
      localStorage.setItem('token', token);  // Store JWT locally.
      console.log('Login successful');  // Log success.

      const decoded = jwtDecode(token);  // Decode token to get role.
      console.log('Role:', decoded.role);  // Log role for debugging.
      onLoginSuccess();  // Update App state.
    } catch (error) {
      console.error('Login failed', error);  // Handle errors.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow">
      <input {...register('email')} placeholder="Email" className="mb-2 p-2 border text-black" />
      <input {...register('password')} type="password" placeholder="Password" className="mb-2 p-2 border text-black" />
      <button type="submit" className="bg-psb-blue text-white p-2">Login</button>
    </form>
  );
};

export default LoginForm;