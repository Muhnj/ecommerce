const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
require("dotenv").config();


//imports
const authRoutes = require('./routes/auth');



//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB Connected"))
.catch(err => console.log("DB Connection Error:", err));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json()); // Allows JSON request body



//routes middle ware
app.use("/api", authRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});