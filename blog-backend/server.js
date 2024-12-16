const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./routes/swagger.json');
const apiRoutes = require('./routes/apiRoutes');
const path = require('path');



dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
  };
  
// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// MongoDB bağlantısı
const connectDB = async () => {
    try {
        console.log('Connecting MongoDB.......');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
