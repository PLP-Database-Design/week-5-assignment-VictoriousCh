// import system dependencies
const express = require("express");
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// configure environment variables
dotenv.config();

// create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// testing the connection
db.connect((err) => {
    // connection is not successful
    if(err) {
        return console.log("error connecting to the database: ", err)
    }
    // connection is successful
    console.log("Successfully connected to the database: ", db.threadId)
})

// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

// Retrieve patient_id, first_name, last_name, date_of_birth from patients in the database
app.get('/patients',(req,res) => {
    const getpatients = "SELECT   patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getpatients,(err, results) => {
        // if I have an error
        if(err){
            console.error(err);
            res.status(500).send("Failed to get patients ");
        } else{
            res.status(200).send(results)
        // res.render('data', {results: results })
         }
    })
})

// Retrieve providers first_name, last_name, provider_specialty
app.get('/providers',(req,res) => {
    const getproviders = "SELECT first_name, last_name, provider_specialty FROM providers"
    db.query(getproviders,(err, results) => {
        // if I have an error
        if(err){
            console.error(err);
            res.status(500).send("Failed to get data ");
        } else{
            res.status(200).send(results)
        // res.render('data', {results: results })
         }
    })
})

// Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.first_name;
    const query = `SELECT * FROM patients WHERE first_name =?`;
  
    db.query(query, [firstName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
// GET endpoint to retrieve all providers by their specialty
app.get('/providers/specialty/:provider_specialty', (req, res) => {
    const specialty = req.params.provider_specialty;
    const query = `SELECT * FROM providers WHERE provider_specialty = ?`;
  
    db.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while retrieving providers', details: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No providers found with the given specialty' });
      }
      res.json(results);
    });
  });


// start and listen to the server
const PORT=3300
app.listen(PORT,() => {
    console.log(`server is running on http://localhost:$(PORT)`)
})