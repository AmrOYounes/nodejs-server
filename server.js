const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');

const connectDB = require('./config/db'); 
dotenv.config({ path: "./config/config.env" });
const errorHandler = require('./middleware/error');
const bootcamps = require('./routes/bootcamps');

const colors = require('colors');
const fileUpload = require('express-fileupload');

// connectDB();
// const logger = require('./middleware/logger')
var cors = require('cors');
const app = express();

// app.use( express.json());
// app.use(logger);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}
// app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(fileUpload());
app.use('/api/v1/bootcamps', bootcamps);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server =  app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} modr in port ${PORT} `.yellow.bold)
);








process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.green);
  server.close( () => {
    process.exit(1);
  })
})
