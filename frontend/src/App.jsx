import { useState, useEffect } from 'react';
import './App.css';

// The base URL of your backend API.
// Make sure your backend server is running on port 5000.
const API_BASE = 'http://localhost:5000';

function App() {
  // State to hold the list of notes
  const [notes, setNotes] = useState([]);
  // State for the new note input field
  const [newNoteContent, setNewNoteContent] = useState('');
  // State to manage which note is currently being edited
  const [editingNote, setEditingNote] = useState(null);
  // State for the content of the note being edited
  const [editingContent, setEditingContent] = useState('');

  // useEffect hook to fetch notes when the component mounts
  useEffect(() => {
    getNotes();
  }, []);

  // --- API Functions ---

  // Function to fetch all notes from the backend
  const getNotes = async () => {
    try {
      const response = await fetch(API_BASE + '/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Function to create a new note
  const addNote = async () => {
    if (!newNoteContent.trim()) return; // Prevent adding empty notes
    try {
      const response = await fetch(API_BASE + '/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNoteContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to add note');
      }
      const data = await response.json();
      // Add the new note to the top of the list
      setNotes([data, ...notes]);
      // Clear the input field
      setNewNoteContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Function to delete a note by its ID
  const deleteNote = async (id) => {
    try {
      const response = await fetch(API_BASE + '/notes/' + id, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      // Filter out the deleted note from the state
      setNotes(notes.filter((note) => note.note_id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Function to update a note
  const updateNote = async (id) => {
    if (!editingContent.trim()) return; // Prevent empty updates
    try {
        const response = await fetch(API_BASE + '/notes/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: editingContent }),
        });
        if (!response.ok) {
            throw new Error('Failed to update note');
        }
        const data = await response.json();
        // Update the notes list with the modified note
        setNotes(notes.map(note => (note.note_id === id ? data : note)));
        // Exit editing mode
        setEditingNote(null);
        setEditingContent('');
    } catch (error) {
        console.error('Error updating note:', error);
    }
  };

  // --- Helper Functions ---

  // Function to enter editing mode for a note
  const startEditing = (note) => {
    setEditingNote(note.note_id);
    setEditingContent(note.content);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingNote(null);
    setEditingContent('');
  };


  return (
    <div className="App">
      <header>
        <h1>Swift Notes</h1>
      </header>
      <div className="add-note-form">
        <input
          type="text"
          placeholder="Enter a new note..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.note_id} className="note-item">
            {editingNote === note.note_id ? (
              <div className="edit-view">
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button className="save-btn" onClick={() => updateNote(note.note_id)}>Save</button>
                <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div className="display-view">
                <p className="note-content">{note.content}</p>
                <div className="note-actions">
                  <button className="edit-btn" onClick={() => startEditing(note)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteNote(note.note_id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

