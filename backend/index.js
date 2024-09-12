import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet"; // Import helmet
import { PORT, mongoDBURL } from "./config.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import wasteRoute from "./routes/wasteRoute.js";
import teaLeavesRoute from "./routes/teaLeavesRoute.js";
import productionScheduleRoute from "./routes/production_schedule_route.js";
import teatypeManagementRoute from "./routes/teatype_management_route.js";
import machineRoute from "./routes/machineRoute.js";
import maintenanceRoute from "./routes/maintenanceRoute.js";
import orderRoute from "./routes/orderRoute.js";
import payments from "./routes/payment.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import paymentsEmployee from "./routes/paymentEmployee.js";
import orderPayments from "./routes/orderPayments.js";
import supplierRoute from "./routes/supplierRoute.js";
import supplyrecordRoute from "./routes/supplyrecordRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import { body, validationResult } from "express-validator";
import { generatePassword } from "./utils/passwordUtils.js";

const app = express();

// Use Helmet to secure the app by setting various HTTP headers
app.use(
  helmet({
    noSniff: true, // Enable X-Content-Type-Options: nosniff
    // other helmet options if needed
  })
);

// Allow express to use JSON
app.use(express.json());

// Configure CORS policy
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow only trusted domains
    methods: ["GET", "POST", "PUT", "DELETE"], // Restrict methods
    allowedHeaders: ["Content-Type", "Authorization"], // Restrict headers
    credentials: true, // If credentials (cookies, HTTP authentication) are needed
  })
);

// Define your routes
app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Welcome to MERN tutorial");
});

app.use("/inventory", inventoryRoute);
app.use("/waste", wasteRoute);
app.use("/teaLeaves", teaLeavesRoute);
app.use("/productions", productionScheduleRoute);
app.use("/teatypes", teatypeManagementRoute);
app.use("/machines", machineRoute);
app.use("/maintenances", maintenanceRoute);
app.use("/orders", orderRoute);
app.use("/payments", payments);
app.use("/paymentsEmployee", paymentsEmployee);
app.use("/orderPayments", orderPayments);
app.use("/vehicles", vehicleRoute);
app.use("/suppliers", supplierRoute);
app.use("/supplyrecords", supplyrecordRoute);
app.use("/departments", departmentRoute);
app.use("/employees", employeeRoute);

// Serve static files
app.use("/uploads", express.static("uploads"));

// Example usage of generatePassword function
app.post(
  "/generate_password",
  // Validation middleware
  body("length")
    .optional()
    .isInt({ min: 8, max: 128 }) // Validate that length is an integer between 8 and 128
    .withMessage("Length must be an integer between 8 and 128")
    .toInt(), // Convert validated length to integer
  (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Retrieve validated length, default to 8 if not provided
    const length = 8;
    const password = generatePassword(length);
    res.json({ password });
  }
);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
