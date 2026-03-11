const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Geologic Collection',
  password: '87360',
  port: 5432
});

///// Rock Types /////

// Getting the rock types
app.get('/api/rocktypes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rocktypes ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///// Rocks /////

// Getting the rocks
app.get('/api/rocks', async (req, res) => {
  const { query, rock_type_id } = req.query;
  let sql = `
    SELECT rocks.*, rocktypes.name AS rock_type_name
    FROM Rocks
    JOIN rocktypes ON rocks.rock_type_id = rocktypes.rock_type_id
  `;

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single rock by ID and include the mineral
app.get('/api/rocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rock = await pool.query(
      `SELECT rocks.*, rocktypes.name AS rock_type_name
       FROM Rocks
       JOIN rocktypes ON rocks.rock_type_id = rocktypes.rock_type_id
       WHERE rocks.rock_id = $1`,
      [id]
    );
    
    if (!rock.rowCount) {
      return res.status(404).json({ error: 'Rock not found.' });
    }

    res.json({ ...rock.rows[0], minerals: minerals.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Adding new rock into the database
app.put('/api/rocks/:id', async (req, res) => {
  const { id } = req.params;
  const { name, rock_type_id, texture, color } = req.body;

  if (!name) return res.status(400).json({ error: 'Rock name is required.' });
  if (!rock_type_id) return res.status(400).json({ error: 'Rock type is required.' });

  try {
    const result = await pool.query(
      `UPDATE Rocks
       SET name = $1, rock_type_id = $2, texture = $3, color = $4
       WHERE rock_id = $5
       RETURNING *`,
      [name, rock_type_id, texture || null, color || null, id]
    );

    if (!result.rowCount) return res.status(404).json({ error: 'Rock not found.' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deleting the rock using delete
app.delete('/api/rocks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Rocks WHERE rock_id = $1 RETURNING *',
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Rock not found.' });
    res.json({ message: 'Successfully deleted', success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///// Minerals /////

// Getting mineral from the database
app.get('/api/minerals', async (req, res) => {
  const { query } = req.query;
  let sql = 'SELECT * FROM Minerals';
  const params = [];


  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adding a new mineral to the database
app.post('/api/minerals', async (req, res) => {
  const { name, chemical_formula } = req.body;

  if (!name) return res.status(400).json({ error: 'Mineral name is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO Minerals (name, chemical_formula)
       VALUES ($1, $2)
       RETURNING *`,
      [name, chemical_formula || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deleting the mineral form the database
app.delete('/api/minerals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Minerals WHERE mineral_id = $1 RETURNING *',
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Mineral not found.' });
    res.json({ message: 'Mineral deleted', success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
