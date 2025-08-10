const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post('/notes', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ msg: 'Content cannot be empty' });
    }
    const newNote = await pool.query(
      'INSERT INTO notes (content) VALUES($1) RETURNING *',
      [content]
    );
    res.status(201).json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/notes', async (req, res) => {
  try {
    const allNotes = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(allNotes.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await pool.query('SELECT * FROM notes WHERE note_id = $1', [id]);

    if (note.rows.length === 0) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    res.json(note.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ msg: 'Content cannot be empty' });
    }

    const updateNote = await pool.query(
      'UPDATE notes SET content = $1 WHERE note_id = $2 RETURNING *',
      [content, id]
    );

    if (updateNote.rows.length === 0) {
        return res.status(404).json({ msg: 'Note not found' });
    }
    res.json(updateNote.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNote = await pool.query('DELETE FROM notes WHERE note_id = $1 RETURNING *', [
      id,
    ]);

    if (deleteNote.rowCount === 0) {
        return res.status(404).json({ msg: 'Note not found' });
    }
    res.json({ msg: 'Note was deleted!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
