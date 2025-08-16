import React, { useState, useEffect } from 'react';

export default function TaskForm({ onAdd, onUpdate, taskToEdit, cancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDeadline(taskToEdit.deadline);
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (!deadline) {
      alert('Deadline is required');
      return;
    }
    const task = { title, description, deadline };
    if (taskToEdit) {
      onUpdate(taskToEdit._id, task);
    } else {
      onAdd(task);
      clearForm();
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
  };

  const inputStyle = {
    width: 800,
    maxWidth: '100%',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>

      <label style={{ alignSelf: 'flex-start', maxWidth: 400, fontWeight: 'bold', fontSize: '18px' }}>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        style={inputStyle}
      />

      <label style={{ alignSelf: 'flex-start', maxWidth: 400, fontWeight: 'bold', fontSize: '18px' }}>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        rows={3}
        style={inputStyle}
      ></textarea>

      <label style={{ alignSelf: 'flex-start', maxWidth: 400, fontWeight: 'bold', fontSize: '18px' }}>Deadline</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
        style={inputStyle}
      />

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%', maxWidth: 800 }}>
        <button
          type="submit"
          style={{
            flexGrow: 1,
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </button>

        {taskToEdit ? (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              flexGrow: 1,
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={clearForm}
            style={{
              flexGrow: 1,
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
