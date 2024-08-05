const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS if frontend and backend are on different origins

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Initialize SQLite database
const dbPath = path.join(__dirname, '../database.db');  // Adjust path if needed
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database at', dbPath);
    }
});

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    }
});

// Handle POST request to submit name
app.post('/submit', (req, res) => {
    const { name } = req.body;
    console.log('Received request to /submit with data:', req.body);  // Logging incoming data
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    db.run('INSERT INTO scores (name) VALUES (?)', [name], function(err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to save name' });
        }
        console.log('Data inserted with ID:', this.lastID);  // Logging successful insertion
        res.status(200).json({ id: this.lastID, name });
    });
});

// Example GET endpoint to retrieve names (for testing)
app.get('/scores', (req, res) => {
    db.all('SELECT * FROM scores', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve names' });
        }
        res.status(200).json(rows);
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
