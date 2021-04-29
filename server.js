const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');

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



// ----------------------------------- Candidate Routes -----------------------------------// 

// get all candidates before express route
// return all data in candidates table 
// db.query('Select * FROM candidates', (err, rows) => {
//     console.log(rows);
// });

// Get all candidates after express route
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// GET a single candidate before express route
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(row);
// });

// Get a single candidate after express route
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });



// DELETE a candidate before express route
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) =>{
//     if (err) {
//         console.log(err);
//     }
//     console.log(result)
// })

// DELETE a candidate after express route
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });


// CREATE a candidate before express route
// const sql = `INSERT INTO candidates(id, first_name, last_name, industry_connected)
//     VALUES(?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// })


// CREATE a candidate after express route
app.post('/api/candidate', ({ body }, res) => {
    // inputCheck function provided by class work
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // db query block 
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
     VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
        message: 'success',
        data: body
    });
    });
  });

// Update a candidate's party
// affected row's id always apart of the route
app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
                //  actual fields we are updating's id in the body
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });
  
// ----------------------------------- Party Routes -----------------------------------// 
// all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// single party 
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });

//   delete party
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: res.message });
        // checks if anything was deleted
      } else if (!result.affectedRows) {
        res.json({
          message: 'Party not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });

// ----------------------------------- Catchall Route -----------------------------------// 

// Default response for any other request (Not Found) *catchall route* must be last
app.use((req, res) => {
    res.status(404).end();
});


// -----------------------------------  Listen Port -----------------------------------// 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });