const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./health_data.db');

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS health_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, weight REAL, blood_pressure TEXT)");
});

app.get('/api/logs', (req, res) => {
    db.all("SELECT * FROM health_logs ORDER BY id DESC", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/logs', (req, res) => {
    const { date, weight, blood_pressure } = req.body;
    db.run("INSERT INTO health_logs (date, weight, blood_pressure) VALUES (?, ?, ?)", 
    [date, weight, blood_pressure], function(err) {
        if (err) res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
