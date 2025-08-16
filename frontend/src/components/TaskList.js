import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete, theme = 'light' }) {
  if (tasks.length === 0)
    return (
      <p
        style={{
          textAlign: 'center',
          marginTop: 40,
          color: theme === 'light' ? '#555' : '#ccc',
          fontSize: 18,
          userSelect: 'none',
        }}
      >
        No tasks available.
      </p>
    );

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    boxShadow:
      theme === 'light'
        ? '0 2px 8px rgba(0,0,0,0.1)'
        : '0 2px 12px rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a',
    color: theme === 'light' ? '#222' : '#eee',
  };

  const headerStyle = {
    backgroundColor: theme === 'light' ? '#28a745' : '#3a7d32',
    color: 'white',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 16,
    userSelect: 'none',
  };

  const thTdStyle = {
    padding: '12px 16px',
    borderBottom: theme === 'light' ? '1px solid #e0e0e0' : '1px solid #e0e0e0',
    verticalAlign: 'middle',
    color: theme === 'light' ? '#222' : '#000',   // black text in dark mode
  };
  
  const tbodyStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#222' : '#000',   // black text in tbody too
  };  

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...thTdStyle, ...headerStyle, width: 60 }}>Done</th>
          <th style={{ ...thTdStyle, ...headerStyle }}>Title</th>
          <th style={{ ...thTdStyle, ...headerStyle }}>Description</th>
          <th style={{ ...thTdStyle, ...headerStyle, width: 140 }}>Deadline</th>
          <th
            style={{ ...thTdStyle, ...headerStyle, width: 160, textAlign: 'center' }}
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody style={tbodyStyle}>
        {tasks.map((task, idx) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            rowIndex={idx} // optionally to do striped rows in TaskItem
            theme={theme}  // pass theme here too if needed for TaskItem
          />
        ))}
      </tbody>
    </table>
  );
}
