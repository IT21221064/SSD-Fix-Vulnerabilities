import  express, { request, response }  from "express";
import { PORT,mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { inventory } from "./models/inventorymodel.js";
import { orders } from "./models/orderModel.js";
import { waste } from "./models/wastemodel.js";
import Production from './models/production_schedule_model_t.js';
import  Teatype  from "./models/teatype_management_model.js";
import  Machine  from "./models/machineModel.js";
import  Maintenance  from "./models/maintenanceModel.js";
import machineRoute from "./routes/machineRoute.js";
import maintenanceRoute from "./routes/maintenanceRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import wasteRoute from "./routes/wasteRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productionScheduleRoute from "./routes/production_schedule_route.js";
import teatypeManagementRoute from "./routes/teatype_management_route.js";
import cors from "cors";
import payments from "./routes/payment.js";

////Import Supplier management model & Route ////
import { supplier } from "./models/supplierModel.js";
import supplierRoute from "./routes/supplierRoute.js";
import { SupplyRecord } from "./models/supplyrecordModel.js";
import supplyrecordRoute from "./routes/supplyrecordRoute.js";

import { Department } from "./models/departmentModel.js";
import { Employee }  from "./models/employeeModel.js";
import departmentRoute from "./routes/departmentRoute.js";
import employeeRoute from "./routes/employeeRoute.js";

const app = express();
//this allow express to use json or json to express 
app.use(express.json());
//adding cors policy
app.use(
    cors(
));


//default / get to show normal message
app.get('/',(request, response)=>{
    console.log(request);
    return response.status(234).send('welcome to mern tutorial');
});



app.use('/inventory',inventoryRoute);
app.use('/waste',wasteRoute)
app.use('/productions',productionScheduleRoute);
app.use('/teatypes',teatypeManagementRoute);
app.use('/machines',machineRoute);
app.use('/maintenances',maintenanceRoute);
app.use('/orders',orderRoute);
app.use('/payments',payments);


// Mounting supplier management routes
app.use('/suppliers', supplierRoute);
app.use('/supplyrecords', supplyrecordRoute);


app.use('/departments', departmentRoute);
app.use('/employees', employeeRoute);






mongoose.connect(mongoDBURL).then(()=>{
    console.log('app connected to database');
    app.listen(PORT,()=>{
        console.log(`app is listen to port :${PORT}`);
    });

}).catch((error)=>{
    console.log(error);

});

