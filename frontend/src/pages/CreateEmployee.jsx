import React, { useState } from 'react';
import BackButtonForCreateEmployee from '../components/BackbuttonForCreateEmployee';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../components/Footer';
import NavigationBar from '../components/NavigationBar';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
 
const CreateEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeMobile, setEmployeeMobile] = useState('');
  const [employeeAddress, setEmployeeAddress] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [createdOn, setCreatedOn] = useState(new Date());
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
 
  // Handler for Google Sign-In Success
  const handleGoogleSuccess = (response) => {
    const decodedData = JSON.parse(atob(response.credential.split('.')[1]));
    const { name, email } = decodedData;
    setEmployeeName(name);
    setEmployeeEmail(email);
    setIsGoogleSignedIn(true);
    enqueueSnackbar('Google Sign-In successful!', { variant: 'success' });
  };
 
  // Handler for Google Sign-In Failure
  const handleGoogleFailure = () => {
    enqueueSnackbar('Google Sign-In failed!', { variant: 'error' });
  };
 
  const handleSaveEmployee = async () => {
    if (!validateForm()) {
      return;
    }
 
    const formData = new FormData();
    formData.append('employeeName', employeeName);
    formData.append('employeeEmail', employeeEmail);
    formData.append('employeeMobile', employeeMobile);
    formData.append('employeeAddress', employeeAddress);
    formData.append('employeeRole', employeeRole);
    formData.append('createdOn', createdOn.getTime());
    formData.append('password', password);
    formData.append('image', image);
 
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5555/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      setLoading(false);
      enqueueSnackbar(response.data.message, { variant: 'success' });
      navigate('/EmployeeHome');
    } catch (error) {
      console.error('AxiosError:', error);
      setLoading(false);
      enqueueSnackbar('Error: Failed to add employee', { variant: 'error' });
    }
  };
 
  const validateForm = () => {
    setIsValid(true);
 
    if (!employeeName || !employeeEmail || !employeeMobile || !employeeAddress || !employeeRole || !createdOn || !password) {
      setIsValid(false);
      return false;
    }
 
    if (employeeName.trim() === '' || /\d/.test(employeeName) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeName)) {
      setIsValid(false);
      return false;
    }
 
    if (!/^[a-zA-Z\s]*$/.test(employeeAddress) || /\d/.test(employeeAddress) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeAddress)) {
      setIsValid(false);
      return false;
    }
 
    if (!/^[a-zA-Z\s]*$/.test(employeeRole) || /\d/.test(employeeRole) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeRole)) {
      setIsValid(false);
      return false;
    }
 
    if (employeeMobile.length !== 10 || isNaN(employeeMobile)) {
      setIsValid(false);
      return false;
    }
 
    if (!/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(employeeEmail.toLowerCase())) {
      setIsValid(false);
      return false;
    }
 
    setIsValid(true);
    return true;
  };
 
  return (
    <GoogleOAuthProvider clientId="646292097148-ipqm7p81lkb2jo6kdrlu5dm10dbg3tjs.apps.googleusercontent.com">
      <div className="flex flex-col h-screen" style={{ backgroundImage: `url("./public/images/Vehicle new.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <NavigationBar />
        <div className="flex-grow">
          <div className="container mx-auto p-4">
            <BackButtonForCreateEmployee />
 
            {!isGoogleSignedIn && (
              <div className="my-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>
            )}
            <h1 className="text-3xl my-4 text-center">Add New Employee</h1>
 
            {loading && <Spinner />}
 
            <div className="max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-200 shadow">
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Employee Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className={`form-input mt-2 block w-full border ${!isValid && !image ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                />
                {!isValid && !image && <p className="text-red-500 text-sm mt-1">Please select an image</p>}
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Employee Name</label>
                <input
                  type="text"
                  placeholder="Enter employee name here "
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className={`form-input mt-2 block w-full border ${!isValid && (!employeeName.trim() || /\d/.test(employeeName) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeName)) ? 'border-red-500' : 'border-gray-300'} rounded-md px-2 py-2`}
                />
                {!isValid && (!employeeName.trim() || /\d/.test(employeeName) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeName)) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid employee name</p>
                )}
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Email Address</label>
                <input
                  type="text"
                  placeholder="Enter Email address here "
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className={`form-input mt-2 block w-full border ${!isValid && (!employeeEmail.trim() || !/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(employeeEmail.toLowerCase())) ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                />
                {!isValid && (!employeeEmail.trim() || !/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(employeeEmail.toLowerCase())) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                )}
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Employee Mobile</label>
                <input
                  type="text"
                  placeholder="Enter employee mobile number"
                  value={employeeMobile}
                  onChange={(e) => setEmployeeMobile(e.target.value)}
                  className={`form-input mt-2 block w-full border ${!isValid && (employeeMobile.length !== 10 || isNaN(employeeMobile)) ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                />
                {!isValid && (employeeMobile.length !== 10 || isNaN(employeeMobile)) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid mobile number</p>
                )}
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Employee Address</label>
                <input
                  type="text"
                  placeholder="Enter employee address"
                  value={employeeAddress}
                  onChange={(e) => setEmployeeAddress(e.target.value)}
                  className={`form-input mt-2 block w-full border ${!isValid && (!employeeAddress.trim() || /\d/.test(employeeAddress) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeAddress)) ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                />
                {!isValid && (!employeeAddress.trim() || /\d/.test(employeeAddress) || /[!@#$%^&*(),.?":{}|<>]/.test(employeeAddress)) && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid address</p>
                )}
              </div>
 
              

              <div className="my-4">

              <label className="block text-lg text-gray-700 mb-2 font-bold">Employee Role</label>

              <select

                value={employeeRole}

                onChange={(e) => setEmployeeRole(e.target.value)}

                className={`form-select mt-2 block w-full border ${!isValid && !employeeRole ? 'border-red-500' : 'border-gray-300'

                  } rounded-md px-4 py-2`}

              >

                <option value="">Select Role</option>

                <option value="EmployeeMangeAdmin">Employee-Mange Admin</option>

                <option value="InventryManager">Inventry Manager</option>

                <option value="VehicleManager">Vehicle Manager</option>

                <option value="ProductionManager">Production Manager</option>

                <option value="PaymentManager">Payment Manager</option>

                <option value="SupplierManager">Supplier Manager</option>

                <option value="OrderManager">Order Manager</option>

                <option value="MaintainceManager">Maintaince Manager</option>

                <option value="Staff">Staff</option>

                <option value="Other">Other</option>

              </select>

              {!isValid && !employeeRole && (

                <p className="text-red-500 text-sm mt-1">Please select an employee role</p>

              )}
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Date of Joining</label>
                <DatePicker
                  selected={createdOn}
                  onChange={(date) => setCreatedOn(date)}
                  className="form-input mt-2 block w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
 
              <div className="my-4">
                <label className="block text-lg text-gray-700 mb-2 font-bold">Password</label>
                <input
                  type="password"
                  placeholder="Enter employee password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input mt-2 block w-full border ${!isValid && !password ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2`}
                />
                {!isValid && !password && <p className="text-red-500 text-sm mt-1">Please enter a password</p>}
              </div>
 
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveEmployee}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};
 
export default CreateEmployee;