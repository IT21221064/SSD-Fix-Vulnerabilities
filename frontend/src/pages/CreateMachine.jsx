import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

const CreateMachine = () => {
    const [machineNumber, setMachineNumber] = useState(1);
    const [machineName, setMachineName] = useState('');
    const [machineType, setMachineType] = useState('');
    const [installationDate, setInstallationDate] = useState('');
    const [warrentyInformation, setWarrentyInformation] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5555/machines')
            .then((response) => {
                const lastMachineNumber = response.data.data.length + 1;
                setMachineNumber(lastMachineNumber);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSaveMachines = () => {
        const data = {
            machineNumber,
            machineName,
            machineType,
            installationDate,
            warrentyInformation,
            Status: 'Available'
        };
        setLoading(true);
        axios.post('http://localhost:5555/machines', data)
            .then(() => {
                setLoading(false);
                navigate('/MachineHome');
            })
            .catch((error) => {
                alert('An error occurred');
                console.log(error);
                setLoading(false);
            });
    };

    return (
        <div className='bg-gray-100 min-h-screen' style={{ backgroundImage: "url('/images/create.png')" }}>
            <NavigationBar />
            <nav className="bg-green-500 p-4">
                <div className="container mx-auto flex justify-center">
                    <div className="flex space-x-4">
                        <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link to="/MachineHome" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Machines</Link>
                        <Link to="/machines/creates" className="text-gray-300 bg-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Create table</Link>
                        <Link to="/MachineReport" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Machine report generate</Link>
                        <Link to="/user-profile-page" className="absolute right-10 flex space-x-2">
                            <img src="/images/user.png" alt="User Profile" className="w-8 h-8 rounded-full" />
                        </Link>
                    </div>
                </div>
            </nav>
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8'>
                    <h1 className='text-3xl mb-4 font-bold text-gray-800 text-center'>Create Machine Schedule</h1>
                    {loading && <Spinner />}
                    <div className='space-y-4'>
                        <div className='mb-4'>
                            <label htmlFor='machineNumber' className='text-lg text-gray-600'>Machine Number</label>
                            <input
                                id='machineNumber'
                                type='text'
                                value={machineNumber}
                                readOnly
                                className='input-field'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='machineName' className='text-lg text-gray-600'>Machine Name</label>
                            <input
                                id='machineName'
                                type='text'
                                value={machineName}
                                onChange={(e) => setMachineName(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='machineType' className='text-lg text-gray-600'>Machine Type</label>
                            <input
                                id='machineType'
                                type='text'
                                value={machineType}
                                onChange={(e) => setMachineType(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='installationDate' className='text-lg text-gray-600'>Installation Date</label>
                            <input
                                id='installationDate'
                                type='date'
                                value={installationDate}
                                onChange={(e) => setInstallationDate(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='warrentyInformation' className='text-lg text-gray-600'>Warrenty Information</label>
                            <input
                                id='warrentyInformation'
                                type='text'
                                value={warrentyInformation}
                                onChange={(e) => setWarrentyInformation(e.target.value)}
                                className='input-field'
                            />
                        </div>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full'
                            onClick={handleSaveMachines}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMachine;
