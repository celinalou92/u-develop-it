const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');


// return all voters
router.get('/voters', (req, res) => {
    // use sql sort options to alphabetize the list
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ err: message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});


// route to return a single voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ err: message });
            return;
        }
        res.json({
            message: 'sucess',
            data: row
        })
    });
});

// POST route to accept new registrants
router.post('/voter', ({ body }, res) => {
    // data validation
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if(errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES(?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ err: message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// PUT requests to update email address
router.put('/voter/:id', (req, res) => {
    // data validation 
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
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

// delete a voter from the database
router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;

    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).res.json({ err: res.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'success',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


module.exports = router;