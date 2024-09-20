import express from 'express';
import path from 'path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { Employee } from '../models/employeeModel.js';
import { generatePassword } from '../utils/passwordUtils.js';

const router = express.Router();
const __dirname = path.resolve();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static('uploads'));

// Setup express-session for OAuth
router.use(session({
  secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport for Google OAuth
router.use(passport.initialize());
router.use(passport.session());

// Function to generate a unique employee ID
function generateEmployeeId() {
  const prefix = 'EMI';
  const randomNumber = Math.floor(Math.random() * 1000);
  return prefix + randomNumber;
}

// Passport configuration for Google OAuth
passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const employee = await Employee.findById(id);
    done(null, employee);
  } catch (error) {
    done(error);
  }
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: 'http://localhost:5555/employees/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    let employee = await Employee.findOne({ employeeEmail: profile.emails[0].value });

    if (!employee) {
      // Generate a new employee ID
      const employeeId = generateEmployeeId();

      // If the user doesn't exist, create a new employee record with default values
      employee = new Employee({
        employeeName: profile.displayName,
        employeeEmail: profile.emails[0].value,
        googleId: profile.id, // Store Google ID for future logins
        employeeId: employeeId,  // Generated employee ID
        // Fields like mobile, address, roles, and createdOn will have default values in your schema
      });

      await employee.save();
    }

    // Log the user in (either existing or newly created)
    return done(null, employee);
  } catch (error) {
    return done(error, null);
  }
}));

// Route to trigger Google authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route (GET request)
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/HomePage');  // Adjust redirect as needed
  }
);

// Email/password login route
router.post('/login', async (request, response) => {
  try {
    const { employeeEmail, password } = request.body;

    const employee = await Employee.findOne({ employeeEmail });

    if (!employee) {
      return response.status(404).json({ message: 'Employee not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    request.login(employee, (err) => {
      if (err) {
        return response.status(500).json({ message: 'Login failed' });
      }
      return response.status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error('Error during login:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
});

// Function to hash the password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Route for adding a new employee with image upload
router.post('/', upload.single('image'), async (request, response) => {
  try {
    const { employeeName, employeeEmail, employeeMobile, employeeAddress, employeeRole, createdOn, password } = request.body;

    if (!employeeName || !employeeEmail || !employeeMobile || !employeeAddress || !employeeRole || !createdOn || !password) {
      return response.status(400).json({ message: 'Send all required fields: employeeName, employeeEmail, employeeMobile, employeeAddress, employeeRole, createdOn, password' });
    }

    const employeeId = generateEmployeeId();
    const hashedPassword = await hashPassword(password);

    const newEmployee = new Employee({
      employeeId,
      employeeName,
      employeeEmail,
      employeeMobile,
      employeeAddress,
      employeeRoles: employeeRole,
      createdOn,
      password: hashedPassword,
      image: request.file ? path.join('uploads', request.file.filename) : null,
    });

    await newEmployee.save();

    return response.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('ServerError:', error);
    return response.status(500).json({ message: 'An error occurred on the server' });
  }
});

// Route for getting all employees
router.get('/', async (request, response) => {
  try {
    const employees = await Employee.find({});
    response.status(200).json({ count: employees.length, data: employees });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An error occurred on the server' });
  }
});

// Route for getting a specific employee by ID
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return response.status(404).json({ message: 'Employee not found' });
    }
    response.status(200).json(employee);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An error occurred on the server' });
  }
});

// Route for updating an employee
router.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const updatedEmployee = {
      employeeName: request.body.employeeName,
      employeeEmail: request.body.employeeEmail,
      employeeMobile: request.body.employeeMobile,
      employeeAddress: request.body.employeeAddress,
      employeeRoles: request.body.employeeRoles,
      createdOn: request.body.createdOn,
    };
    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, { new: true });
    if (!employee) {
      return response.status(404).json({ message: 'Employee not found' });
    }
    response.status(200).json({ message: 'Employee details updated successfully' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An error occurred on the server' });
  }
});

// Route for deleting an employee
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return response.status(404).json({ message: 'Employee not found' });
    }
    response.status(200).json({ message: 'Employee profile deleted successfully' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'An error occurred on the server' });
  }
});

// Define your nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
});

// Define your API endpoint to send emails
router.post('/send_email', async (req, res) => {
  const { employeeEmail } = req.body;
  try {
    const password = generatePassword();
    const url = `http://localhost:5173/HomePage`;

    const emailContent = `
      <p>Welcome to Ever Green Tea. You have been successfully added to the system.</p>
      <p>Your login credentials:</p>
      <p>Email: ${employeeEmail}</p>
      <p>Password: ${password}</p>
      <p>Please click the link below to log in:</p>
      <p><a href="${url}">${url}</a></p>
    `;

    await transporter.sendMail({
      from: { name: "Employee-Manage Department", address: '2001imashaperera@gmail.com' },
      to: employeeEmail,
      subject: "Invitation to Join Us",
      html: emailContent
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;