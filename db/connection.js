const mysql = require('mysql2');

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

module.exports = db;