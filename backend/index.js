import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import csurf from "csurf";
import session from "express-session";
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
import paymentsEmployee from "./routes/paymentEmployee.js";
import orderPayments from "./routes/orderPayments.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import supplierRoute from "./routes/supplierRoute.js";
import supplyrecordRoute from "./routes/supplyrecordRoute.js";
import departmentRoute from "./routes/departmentRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import { body, validationResult } from "express-validator";
import { generatePassword } from "./utils/passwordUtils.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.disable("x-powered-by");

// Use Helmet to secure the app by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
      },
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
  })
);

// Allow express to use JSON
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // Use environment variable or default secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Helps prevent CSRF attacks
    },
  })
);

// CSRF protection middleware
const csrfProtection = csurf({
  cookie: false, // Use session to store CSRF tokens
  ignoreMethods: ["GET", "POST"],
});

// Configure CORS policy
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "CSRF-Token"],
    credentials: true,
  })
);

// Apply CSRF protection after session middleware
app.use(csrfProtection);

// Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Define your routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to MERN tutorial");
});

// Example of a route that needs CSRF token
app.get("/form", (req, res) => {
  // Send CSRF token to the client
  res.json({ csrfToken: req.csrfToken() });
});

// Protect routes by adding csrfProtection middleware
app.use("/inventory", csrfProtection, inventoryRoute);
app.use("/waste", csrfProtection, wasteRoute);
app.use("/teaLeaves", csrfProtection, teaLeavesRoute);
app.use("/productions", csrfProtection, productionScheduleRoute);
app.use("/teatypes", csrfProtection, teatypeManagementRoute);
app.use("/machines", csrfProtection, machineRoute);
app.use("/maintenances", csrfProtection, maintenanceRoute);
app.use("/orders", csrfProtection, orderRoute);
app.use("/payments", csrfProtection, payments);
app.use("/paymentsEmployee", csrfProtection, paymentsEmployee);
app.use("/orderPayments", csrfProtection, orderPayments);
app.use("/vehicles", csrfProtection, vehicleRoute);
app.use("/suppliers", csrfProtection, supplierRoute);
app.use("/supplyrecords", csrfProtection, supplyrecordRoute);
app.use("/departments", csrfProtection, departmentRoute);
app.use("/employees", csrfProtection, employeeRoute);

// Serve static files
app.use("/uploads", express.static("uploads"));

// Example usage of generatePassword function
app.post(
  "/generate_password",
  body("length")
    .optional()
    .isInt({ min: 8, max: 128 })
    .withMessage("Length must be an integer between 8 and 128")
    .toInt(),
  csrfProtection,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const length = 8; // Use provided length or default to 8
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
    console.log("Error connecting to the database:", error);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
