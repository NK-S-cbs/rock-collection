const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Geologic Collection',
  password: '87360',
  port: 5432
});


/////// ROCK DATA SHOWCASE ///////


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

  const params = [];
  const conditions = [];

  if (query) {
    params.push(`%${query.toLowerCase()}%`);
    conditions.push(`(LOWER(rocks.name) LIKE $${params.length} OR LOWER(rocktypes.name) LIKE $${params.length})`);
  }

  if (rock_type_id) {
    params.push(rock_type_id);
    conditions.push(`rocks.rock_type_id = $${params.length}`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY rocks.name ASC';

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

    const minerals = await pool.query(
      `SELECT minerals.*
       FROM Minerals
       JOIN RockMinerals ON minerals.mineral_id = rockminerals.mineral_id
       WHERE rockminerals.rock_id = $1
       ORDER BY minerals.name ASC`,
      [id]
    );    

    res.json({ ...rock.rows[0], minerals: minerals.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Adding a new rock
app.post('/api/rocks', async (req, res) => {
  let { name, rock_type_id, rock_type, texture, color } = req.body;

  if (!name) return res.status(400).json({ error: 'Rock name is required.' });

  try {
    //looking up rock, if doesnt exist --> create
    if (!rock_type_id && rock_type) {
      const typeResult = await pool.query(
        `SELECT rock_type_id FROM rocktypes WHERE LOWER(name) = LOWER($1)`,
        [rock_type]
      );
      if (typeResult.rows.length) {
        rock_type_id = typeResult.rows[0].rock_type_id;
      } else {
        const insertType = await pool.query(
          `INSERT INTO rocktypes (name) VALUES ($1) RETURNING rock_type_id`,
          [rock_type]
        );
        rock_type_id = insertType.rows[0].rock_type_id;
      }
    }

    if (!rock_type_id) return res.status(400).json({ error: 'Rock type is required.' });

    const result = await pool.query(
      `INSERT INTO Rocks (name, rock_type_id, texture, color)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, rock_type_id, texture || null, color || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Updating existing rock
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

  if (query) {
    params.push(`%${query.toLowerCase()}%`);
    sql += ` WHERE LOWER(name) LIKE $1 OR LOWER(chemical_formula) LIKE $1`;
  }

  sql += ' ORDER BY name ASC';  

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

// Getting rock and minerals link database

app.get('/api/rocks/:id/minerals', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT minerals.*
       FROM Minerals
       JOIN RockMinerals ON minerals.mineral_id = rockminerals.mineral_id
       WHERE rockminerals.rock_id = $1
       ORDER BY minerals.name ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Linking mineral to a specific rock

app.post('/api/rocks/:id/minerals', async (req, res) => {
  const { id } = req.params;
  const { mineral_id } = req.body;

  if (!mineral_id) return res.status(400).json({ error: 'mineral_id is required.' });

  try {
   // avoiding duplicate if conflicts
    await pool.query(
      `INSERT INTO RockMinerals (rock_id, mineral_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [id, mineral_id]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a mineral linked to rock

app.delete('/api/rocks/:id/minerals/:mineralId', async (req, res) => {
  const { id, mineralId } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM RockMinerals WHERE rock_id = $1 AND mineral_id = $2 RETURNING *',
      [id, mineralId]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Link not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/////// ROCK LOANING SIDE ///////

///// Borrowers /////

// Getting the borrowers
app.get('/api/borrowers', async (req, res) => {
  const { query } = req.query;
  let sql = 'SELECT * FROM Borrowers';
  const params = [];

   if (query) {
    params.push(`%${query.toLowerCase()}%`);
    sql += ' WHERE LOWER(name) LIKE $1';
  }

  sql += ' ORDER BY name ASC';
 
  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adding new borrowers
app.post('/api/borrowers', async (req, res) => {
  const { name, email, institution } = req.body;

  if (!name) return res.status(400).json({ error: 'Borrower name is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO Borrowers (name, email, institution)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email || null, institution || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if borrower name exist --> change info in database for existing borrower
app.put('/api/borrowers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, institution } = req.body;

  if (!name) return res.status(400).json({ error: 'Borrower name is required.' });

  try {
    const result = await pool.query(
      `UPDATE Borrowers SET name = $1, email = $2, institution = $3
       WHERE borrower_id = $4
       RETURNING *`,
      [name, email || null, institution || null, id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Borrower not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deleting a borrower
app.delete('/api/borrowers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Borrowers WHERE borrower_id = $1 RETURNING *',
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Borrower not found.' });
    res.json({ message: 'Borrower deleted', success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///// Loans /////

// Getting loans (the return date is not null)
app.get('/api/loans', async (req, res) => {
  const { returned } = req.query;
  let sql = `
    SELECT
      loans.*,
      rocks.name AS rock_name,
      borrowers.name AS borrower_name,
      (loans.return_date IS NOT NULL) AS is_returned,
      (loans.due_date < NOW() AND loans.return_date IS NULL) AS is_overdue
    FROM Loans
    JOIN Rocks ON loans.rock_id = rocks.rock_id
    JOIN Borrowers ON loans.borrower_id = borrowers.borrower_id
  `;
  const params = [];

  if (returned === 'true') {
    sql += ` WHERE loans.return_date IS NOT NULL`;
  } else if (returned === 'false') {
    sql += ` WHERE loans.return_date IS NULL`;
  }

  sql += ' ORDER BY loans.due_date ASC';

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Creating a new loan
app.post('/api/loans', async (req, res) => {
  const { rock_id, borrower_id, due_date } = req.body;

  if (!rock_id) return res.status(400).json({ error: 'rock_id is required.' });
  if (!borrower_id) return res.status(400).json({ error: 'borrower_id is required.' });
  if (!due_date) return res.status(400).json({ error: 'due_date is required.' });

  try {
    const result = await pool.query(
      `INSERT INTO Loans (rock_id, borrower_id, loan_date, due_date)
       VALUES ($1, $2, NOW(), $3)
       RETURNING *`,
      [rock_id, borrower_id, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returning the loans (updating)
app.put('/api/loans/:id/return', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE Loans
       SET return_date = NOW()
       WHERE loan_id = $1
       RETURNING *`,
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Loan not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deleting a loan from database
app.delete('/api/loans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Loans WHERE loan_id = $1 RETURNING *',
      [id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'Loan not found.' });
    res.json({ message: 'Loan deleted', success: true, deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

