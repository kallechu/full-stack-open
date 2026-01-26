const NoteForm = ({ addNote, newNote, handleNoteChange }) => {
  return (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange}></input>
      <button type="submit">save</button>
    </form>
  );
};

export default NoteForm;
