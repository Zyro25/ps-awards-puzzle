const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like your frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Open database
const db = new sqlite3.Database('./puzzle.db');

// Endpoint to save score
app.post('/submit', (req, res) => {
    const { name, score } = req.body;

    db.run('INSERT INTO scores (name, score) VALUES (?, ?)', [name, score], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: this.lastID });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
