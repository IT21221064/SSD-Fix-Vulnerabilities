import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import SupplierSearch from '../components/SupplierSearch';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const SupplyRecordTable = () => {
    const [supplyrecords, setSupplyRecords] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState(''); 
    const [filterdSupplyRecords, setfilterdSupplyRecords] = useState([]);
    const tableRef = useRef();
 
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5555/supplyrecords')
            .then((response) => {
                setSupplyRecords(response.data); 
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    //search function
    useEffect(() => {
        handleSearch(); 
    }, [searchInput, searchType]);

    const handleSearch = () => {
        if (searchInput.trim() === '') {
            setfilterdSupplyRecords([]);
        } else {
            const filtered = supplyrecords.filter(record => {
               return record.supplier.toLowerCase().includes(searchInput.toLowerCase()); 
            });
            setfilterdSupplyRecords(filtered);
        }
    };

    //report generate function
    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            const tableData = supplyrecords.map(supplyrecord => [supplyrecord.supplier, supplyrecord.date, supplyrecord.quantity, supplyrecord.unitPrice ]);
    
            doc.setFontSize(16);
            const topic = 'Supply Records Report';
            const topicX = 15; 
            const topicY = 15; 
    
            doc.text(topic, topicX, topicY);

            doc.autoTable({
                head: [['Supplier', 'Date', 'Quantity', 'UnitPrice']],
                body: tableData,
                margin: { top: 25 }, 
                columnStyles: {
                    0: { cellWidth: 'auto' } 
                }
            });
            
            doc.save('Supply Report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }; 
    
    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Navigation Bar */}
            <nav style={{ backgroundColor: '#3FC060' }} className="p-4">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-white text-xl font-bold">
                            Ever Green Tea
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/" className="text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/SupplierHome" className="text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Suppliers</Link>
                            <Link to="/SupplyRecordTable" className="text-gray-300 bg-black hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Supply Records</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className='p-16' style={{ paddingBottom: '100px' }}>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>Supply Record Table</h1>
                    <div className="flex items-center">
                        <button onClick={downloadPDF} className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all'>
                            Generate Report
                        </button>
                        <Link
                            to='/supplyrecords/create'
                            className='bg-green-950 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-all flex items-center ml-4'>
                            Add New
                        </Link>
                    </div>
                </div>

                 {/* SupplierSearch component */}
                 <SupplierSearch
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    // handleButtonClick={handleButtonClick}
                    showSearchType={false}
                />

            {loading ? (
                <Spinner />
            ) : (
                <div id="pdf-content" ref={tableRef}>
                <table className='w-full border-collapse border border-gray-300'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='border border-gray-300 p-4 text-left'>SUPPLIER</th>
                            <th className='border border-gray-300 p-4 text-left'>DATE</th>
                            <th className='border border-gray-300 p-4 text-left'>QUANTITY (KG)</th>
                            <th className='border border-gray-300 p-4 text-left'>UNIT PRICE</th>
                            <th className='bg-slate-300 border border-gray-300 p-4 text-left'>Cost</th>
                            <th className='border border-gray-300 p-4 text-left'>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filterdSupplyRecords.length > 0 ? filterdSupplyRecords : supplyrecords).map((item, index) => ( 
                            <tr key={item._id} className='border border-gray-300'>
                                <td className='border border-gray-300 p-4'>{item.supplier}</td>
                                <td className='border border-gray-300 p-4'>{item.date}</td>
                                <td className='border border-gray-300 p-4'>{item.quantity}</td>
                                <td className='border border-gray-300 p-4'>{item.unitPrice}</td>
                                <td className='border border-gray-300 p-4'>{item.quantity * item.unitPrice}</td>
                                <td className='border border-gray-300 p-4'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/supplyrecords/details/${item._id}`} className='text-2xl text-green-800'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/supplyrecords/edit/${item._id}`} className='text-2xl text-yellow-600'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <Link to={`/supplyrecords/delete/${item._id}`} className='text-2xl text-red-600'>
                                            <MdOutlineDelete />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
            )}
        </div>
         {/* Footer */}
             <footer style={{ backgroundColor: '#3FC060', position: 'absolute', bottom: 0, left: 0, right: 0 }} className="text-white py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <p>&copy; 1998-{new Date().getFullYear()} Ever Green Tea Factory. All rights reserved.</p>
                        <p>Contact: 0112787678</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default SupplyRecordTable;
