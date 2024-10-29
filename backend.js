const express = require('express');
const app = express();
const mysql = require('mysql');
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'youruser',
    password: 'yourpassword',
    database: 'license_plate_tracker'
});

app.post('/update-count', (req, res) => {
    const { state, value } = req.body;
    db.query('UPDATE plates SET count = count + ? WHERE state = ?', [value, state], (err) => {
        if (err) throw err;
        db.query('SELECT count FROM plates WHERE state = ?', [state], (err, result) => {
            if (err) throw err;
            res.json({ newCount: result[0].count });
        });
    });
});

app.get('/get-counts', (req, res) => {
    db.query('SELECT state, count FROM plates', (err, results) => {
        if (err) throw err;
        const counts = {};
        results.forEach(row => counts[row.state] = row.count);
        res.json(counts);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
