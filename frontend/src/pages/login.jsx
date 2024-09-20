import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState("");


  useEffect(() => {
    // Fetch the CSRF token when the component mounts
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("http://localhost:5555/form");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        setError("Failed to fetch CSRF token");
      }
    };

    fetchCsrfToken();
  }, []);
 
  // Normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post(
        "http://localhost:5555/employees/login",
        { employeeEmail: email, password },
        { headers: { "CSRF-Token": csrfToken } } // Include CSRF token in headers
      );

 
      localStorage.setItem('role', response.data.role);
 
      // Route based on the role or email
      if (email === 'tharusha@gmail.com') {
        window.location.href = '/P_home';
      } else if (email === 'imasha@gmail.com') {
        window.location.href = '/E_home';
      } else if (email === 'ravindu@gmail.com') {
        window.location.href = '/V_home';
      } else if (email === 'nadeen@gmail.com') {
        window.location.href = '/O_home';
      } else if (email === 'dilmi@gmail.com') {
        window.location.href = '/M_home';
      } else if (email === 'kavindu@gmail.com') {
        window.location.href = '/S_home';
      } else if (email === 'susiru@gmail.com') {
        window.location.href = '/Py_home';
      } else if (email === 'yuvindu@gmail.com') {
        window.location.href = '/I_home';
      } else {
        window.location.href = '/HomePage';
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };
    // Handle Google OAuth login
    const handleGoogleLogin = () => {
      // Redirect the user to the backend route that starts the OAuth flow
      window.location.href = 'http://localhost:5555/employees/auth/google';
    };
  return (
<GoogleOAuthProvider clientId="646292097148-ipqm7p81lkb2jo6kdrlu5dm10dbg3tjs.apps.googleusercontent.com">
<div className="login-container min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-xl p-8">
<h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
<div className="rounded-md shadow-sm -space-y-px">
<div>
<label htmlFor="email-address" className="sr-only">Email address</label>
<input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
</div>
<div>
<label htmlFor="password" className="sr-only">Password</label>
<input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
</div>
</div>
 
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
 
            <div className="flex items-center justify-between">
<div className="flex items-center">
<input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
</div>
 
              <div className="text-sm">
<a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
</div>
</div>
 
            <div>
<button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
                Sign in
</button>
</div>
</form>
 
          <div className="mt-6">
<GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError('Google login failed')}
            />
</div>
</div>
</div>
</GoogleOAuthProvider>
  );
};
 
export default Login;