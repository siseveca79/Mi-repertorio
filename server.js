const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));  

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


app.post('/cancion', async (req, res) => {
    const { titulo, artista, tono } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING *',
            [titulo, artista, tono]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/canciones', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM canciones');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put('/cancion/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    try {
        const result = await pool.query(
            'UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING *',
            [titulo, artista, tono, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/cancion', async (req, res) => {
    const { id } = req.query;
    try {
        const result = await pool.query(
            'DELETE FROM canciones WHERE id = $1 RETURNING *',
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
