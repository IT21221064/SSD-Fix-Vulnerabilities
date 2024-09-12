import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButtonForCreateEmployee from "../components/BackbuttonForCreateEmployee";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";

const ShowEmployee = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Function to sanitize the image path
  const sanitizeImagePath = (path) => {
    if (!path) return ""; // Return empty if path is falsy
    // Remove any dangerous characters (basic example)
    const sanitizedPath = path.replace(/[^a-zA-Z0-9._-]/g, "");
    return sanitizedPath;
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/employees/${id}`)
      .then((response) => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setLoading(false);
      });
  }, [id]);

  const renderEmployeeDetails = () => {
    return (
      <form className="bg-gray-200 rounded-lg p-6 w-full max-w-xl">
        {/*<FormField  value={employee.employeeName} />
        <FormField  value={employee.employeeEmail} />*/}
        <FormField label="Employee Mobile" value={employee.employeeMobile} />
        <FormField label="Employee Address" value={employee.employeeAddress} />
        <FormField label="Employee Role" value={employee.employeeRoles} />
        <FormField
          label="Created On"
          value={new Date(employee.createdAt).toLocaleString()}
        />
        <FormField
          label="Created At"
          value={new Date(employee.createdAt).toLocaleString()}
        />
        <FormField
          label="Last Updated At"
          value={new Date(employee.updatedAt).toLocaleString()}
        />
      </form>
    );
  };

  const FormField = ({ label, value, isImage }) => {
    return (
      <div className="flex flex-col">
        <label className="text-gray-700">{label}</label>
        {isImage ? (
          <img
            src={`http://localhost:5555/${sanitizeImagePath(employee.image)}`}
            alt="Employee"
            className="block mx-auto h-20 w-20 rounded-full"
          />
        ) : (
          <input
            type="text"
            value={value}
            className="border border-gray-500 rounded-md px-3 py-2 mt-1"
            readOnly
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex-grow">
        <div className="p-4">
          <BackButtonForCreateEmployee />
          <div className="flex flex-col items-center justify-center ">
            <h1 className="text-3xl my-4">Employee Details</h1>
            <>
              <img
                src={`http://localhost:5555/${sanitizeImagePath(
                  employee.image
                )}`}
                alt="Employee"
                className="block mx-auto h-20 w-20 rounded-full"
              />
              <p className="mt-2">{employee.employeeName}</p>
              <p>{employee.employeeEmail}</p>
            </>
            {loading ? <Spinner /> : renderEmployeeDetails()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShowEmployee;
