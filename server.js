const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();
// --------------------------- Express middleware  --------------------------- //
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --------------------------- Connect to Database  --------------------------- // 
const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MySQL username,
        user: 'root',
        // your MySQL password
        password: 'Y0usuck@7',
        database: 'election'
    },
    console.log('Connected to the election database')
)

// return all data in candidates table 
db.query('Select * FROM candidates', (err, rows) => {
    console.log(rows);
});

// Default response for any other request (Not Found) *catchall route* must be last
app.use((req, res) => {
    res.status(404).end();
});










app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });