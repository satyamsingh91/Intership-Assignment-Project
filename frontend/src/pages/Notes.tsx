import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error:", err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        { content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote("");
      fetchNotes();
    } catch (err) {
      console.error("Create note failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Delete note failed", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${editingNoteId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingNoteId(null);
      setEditedContent("");
      fetchNotes();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-indigo-100 p-6 relative">
      {/* 🔐 Logout button top-right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Notes</h2>

        {/* Create Note */}
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {/* Notes List */}
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {editingNoteId === note._id ? (
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditedContent("");
                      }}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(note.createdAt).toLocaleString()}
                  </p>
                  <div className="flex justify-end gap-4 mt-2">
                    <button
                      onClick={() => {
                        setEditingNoteId(note._id);
                        setEditedContent(note.content);
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notes;
