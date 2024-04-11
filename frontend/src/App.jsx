import { Routes, Route } from "react-router-dom";

import ContactUs from "./pages/ContactUs.jsx";
import Aboutus from "./pages/Aboutus.jsx"
import HomePage from "./pages/HomePage.jsx";
import Service from "./pages/Service.jsx";


import Inventoryhome from "./pages/Inventoryhome";
import I_home from "./pages/I_home.jsx";
import CreateInventory from "./pages/CreateInventory";
import DeleteInventory from "./pages/DeleteInventory";
import EditInvenory from "./pages/EditInventory";
import ShowInventory from "./pages/ShowInventory";
import Inventorys from "./pages/Inventorys";


import Vehiclehome from './pages/Vehiclehome'; 
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';


import Createproductions from './pages/Createproductions';
import Createteatypes from './pages/Createteatypes';
import Deleteproductions from './pages/Deleteproductions';
import Deleteteatypes from './pages/Deleteteatypes';
import Editproductions from './pages/Editproductions';
import Editteatypes from './pages/Editteatypes';
import Showproductions from './pages/Showproductions';
import ProductionReport from "./pages/ProductionReport.jsx";
import Productionstatus from "./pages/Productionstatus.jsx";
import Productionmachineavailability from "./pages/Productionmachineavailability.jsx";

import Showteatypes from './pages/Showteatypes';
import Teatypehome from "./pages/Teatypehome";
import Productionhome from "./pages/Productionhome";
import Home from "./pages/Home.jsx";
import P_home from "./pages/P_home.jsx";
import TeaTypeReport from "./pages/TeaTypeReport.jsx";


/*********Supplier***********/
import S_home from "./pages/S_home.jsx";
import SupplierHome from './pages/SupplierHome';
import CreateSupplier from './pages/CreateSupplier';
import ShowSupplier from './pages/ShowSupplier';
import EditSupplier from './pages/EditSupplier';
import DeleteSupplier from './pages/DeleteSupplier';
import SupplyRecordTable from './pages/SupplyRecordTable';
import CreateSupplyRecord from './pages/CreateSupplyRecord';
import ShowSupplyRecord from './pages/ShowSupplyRecord';
import EditSupplyRecord from './pages/EditSupplyRecord';
import DeleteSupplyRecord from './pages/DeleteSupplyRecord';
// import SupplierTable from './pages/SupplierTable';



import M_home from './pages/M_home'
import MachineHome from './pages/MachineHome'
import CreateMachine from './pages/CreateMachine'
import ShowMachine from './pages/ShowMachine'
import EditMachine from './pages/EditMachine'
import DeleteMachine from './pages/DeleteMachine'
import MachineReport from "./pages/MachineReport.jsx";

import MaintenanceHome from './pages/MaintenanceHome'
import CreateMaintenance from './pages/CreateMaintenance'
import ShowMaintenance from './pages/ShowMaintenance'
import EditMaintenance from './pages/EditMaintenance'
import DeleteMaintenance from './pages/DeleteMaintenance'
import MaintenanceReport from "./pages/MaintenanceReport.jsx";



//*************Order***************//
import CreateOrder from './pages/CreateOrder';
import ShowOrder from './pages/ShowOrder';
import UpdateOrder from './pages/UpdateOrder';
import DeleteOrder from './pages/DeleteOrder';
import OrderHome from './pages/OrderHome';
import O_home from "./pages/O_home.jsx";

//*************Payment***************//
import PaymentsHome from "./pages/PaymentsHome.jsx";
import PaymentsEmployee from "./pages/PaymentsEmployee.jsx";
import PaymentSupplierCreate from "./pages/PaymentSupplierCreate.jsx";
import PaymentSupplierEdit from "./pages/PaymentsSupplierEdit.jsx";
import Py_home from "./pages/Py_home.jsx";

import V_home from "./pages/V_home.jsx";


import E_home from "./pages/E_home.jsx";


const App = () => {
  return (
    <Routes>

      <Route path = '/V_home' element={<V_home/>} />


      <Route path = '/P_home' element={<P_home/>} />
      <Route path = '/HomePage' element={<HomePage/>} />

      <Route path = '/' element={<Home/>}  />
      <Route path = '/Inventorys' element={<Inventorys/>}  />
      <Route path = '/Inventoryhome' element={<Inventoryhome/>}  />
      <Route path = '/inventory/creates' element={<CreateInventory/>} />
      <Route path = '/inventory/details/:id' element={<ShowInventory/>}  />
      <Route path = '/inventory/edit/:id' element={<EditInvenory/>}  />
      <Route path = '/inventory/delete/:id' element={<DeleteInventory/>}  />
      <Route path = '/I_home' element={<I_home/>}  />
      

      <Route path = '/productions/creates' element={<Createproductions/>} />
      <Route path = '/productions/details/:id' element={<Showproductions/>}  />
      <Route path = '/productions/edit/:id' element={<Editproductions/>}  />
      <Route path = '/productions/delete/:id' element={<Deleteproductions/>}  />
      <Route path = '/Productionhome' element={<Productionhome/>}  />
      <Route path = '/ProductionReport' element={<ProductionReport/>}  />
      <Route path = '/Productionstatus' element={<Productionstatus/>}  />
      <Route path = '/Productionmachineavailability' element={<Productionmachineavailability/>}  />

      <Route path = '/teatypes/creates' element={<Createteatypes/>} />
      <Route path = '/teatypes/details/:id' element={<Showteatypes/>}  />
      <Route path = '/teatypes/edit/:id' element={<Editteatypes/>}  />
      <Route path = '/teatypes/delete/:id' element={<Deleteteatypes/>}  />
      <Route path = '/Teatypehome' element={<Teatypehome/>}  />
      <Route path = '/TeaTypeReport' element={<TeaTypeReport/>}  />

      <Route path = '/MachineHome' element={<MachineHome/>}  />
      <Route path = '/machines/creates' element={<CreateMachine/>} />
      <Route path = '/machines/details/:id' element={<ShowMachine/>}  />
      <Route path = '/machines/edit/:id' element={<EditMachine/>}  />
      <Route path = '/machines/delete/:id' element={<DeleteMachine/>}  />
      <Route path = '/MachineReport' element={<MachineReport/>}  />

      <Route path = '/MaintenanceHome' element={<MaintenanceHome/>}  />
      <Route path = '/maintenances/creates' element={<CreateMaintenance/>} />
      <Route path = '/maintenances/details/:id' element={<ShowMaintenance/>}  />
      <Route path = '/maintenances/edit/:id' element={<EditMaintenance/>}  />
      <Route path = '/maintenances/delete/:id' element={<DeleteMaintenance/>}  />
      <Route path = '/MaintenanceReport' element={<MaintenanceReport/>}  />
      <Route path = '/M_home' element={<M_home/>}  />



      <Route path="/S_home" element={<S_home />} />
      <Route path="/SupplierHome" element={<SupplierHome />} />
      {/* <Route path="/SupplierTable" element={<SupplierTable />} />  */}
      <Route path="/suppliers/create" element={<CreateSupplier />} />
      <Route path="/suppliers/details/:id" element={<ShowSupplier />} />
      <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
      <Route path="/suppliers/delete/:id" element={<DeleteSupplier />} />
      
      <Route path="/SupplyRecordTable" element={<SupplyRecordTable />} />
      <Route path="/supplyrecords/create" element={<CreateSupplyRecord />} />
      <Route path="/supplyrecords/details/:id" element={<ShowSupplyRecord />} />
      <Route path="/supplyrecords/edit/:id" element={<EditSupplyRecord />} />
      <Route path="/supplyrecords/delete/:id" element={<DeleteSupplyRecord />} />


      
      <Route path="/OrderHome" element={<OrderHome/>}/>
      <Route path="/orders/create" element={<CreateOrder/>}/>
      <Route path="/orders/details/:id" element={<ShowOrder/>}/>
      <Route path="/orders/edit/:id" element={<UpdateOrder/>}/>
      <Route path="/orders/delete/:id" element={<DeleteOrder/>}/>
      <Route path="/O_home" element={<O_home/>}/>

      <Route path = '/PaymentsHome' element={<PaymentsHome/>} />
      <Route path = '/PaymentsEmployee' element={<PaymentsEmployee/>} />
      <Route path = '/payments/supplier/create' element={<PaymentSupplierCreate/>} />
      <Route path = '/payments/supplier/edit/:id' element={<PaymentSupplierEdit/>} />
      <Route path = '/Py_home' element={<Py_home/>} />

      <Route path = '/E_home' element={<E_home/>} />



      <Route path = '/ContactUs' element={<ContactUs/>}  />
      <Route path = '/Aboutus' element={<Aboutus/>}  />
      <Route path = '/Service' element={<Service/>}  />
    </Routes>
  );
};


export default App;
