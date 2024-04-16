import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const EditMachine = () => {
    const [machineNumber, setMachineNumber] = useState('');
    const [machineName, setMachineName] = useState('');
    const [machineType, setMachineType] = useState('');
    const [installationDate, setInstallationDate] = useState('');
    const [warrentyInformation, setWarrentyInformation] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5555/machines/${id}`)
            .then(response => {
                setMachineNumber(response.data.machineNumber);
                setMachineName(response.data.machineName);
                setMachineType(response.data.machineType);
                setInstallationDate(response.data.installationDate);
                setWarrentyInformation(response.data.warrentyInformation);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                alert('There was an error. Please check the console.');
                console.error(error);
            });
    }, [id]);

    const handleEditMachine = () => {
        const data = {
            machineNumber,
            machineName,
            machineType,
            installationDate,
            warrentyInformation,
        };

        setLoading(true);
        axios.put(`http://localhost:5555/machines/${id}`, data)
            .then(() => {
                setLoading(false);
                navigate('/MachineHome');
            })
            .catch(error => {
                setLoading(false);
                alert('An error occurred. Please check the console.');
                console.error(error);
            });
    };

    return (
        <div>
            <NavigationBar />

            {/* Additional Navigation Bar */}
            <nav className="bg-green-500 p-4">
                <div className="container mx-auto flex justify-center">
                    <div className="flex space-x-4">
                        <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link to="/MachineHome" className="text-gray-300 bg-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Machines</Link>
                        <Link to="/machines/create" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Create Machine</Link>
                        <Link to="/MachineReport" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Machine Report</Link>
                    </div>
                </div>
            </nav>

            {/* Main container */}
            <div
                className="bg-gray-100 min-h-screen"
                style={{ backgroundImage: "url('/images/create.png')" }}
            >
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
                    <h1 className="text-3xl mb-6 font-bold text-gray-800 text-center">Edit Machine</h1>

                    {loading && <Spinner />}

                    <div className="space-y-4">
                        <div className="mb-4">
                            <label htmlFor="machineNumber" className="text-lg text-gray-600">Machine Number</label>
                            <input
                                id="machineNumber"
                                type="number"
                                value={machineNumber}
                                onChange={(e) => setMachineNumber(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="machineName" className="text-lg text-gray-600">Machine Name</label>
                            <input
                                id="machineName"
                                type="text"
                                value={machineName}
                                onChange={(e) => setMachineName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="machineType" className="text-lg text-gray-600">Machine Type</label>
                            <input
                                id="machineType"
                                type="text"
                                value={machineType}
                                onChange={(e) => setMachineType(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="installationDate" className="text-lg text-gray-600">Installation Date</label>
                            <input
                                id="installationDate"
                                type="text"
                                value={installationDate}
                                onChange={(e) => setInstallationDate(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="warrentyInformation" className="text-lg text-gray-600">Warranty Information</label>
                            <input
                                id="warrentyInformation"
                                type="text"
                                value={warrentyInformation}
                                onChange={(e) => setWarrentyInformation(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full"
                            onClick={handleEditMachine}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EditMachine;
