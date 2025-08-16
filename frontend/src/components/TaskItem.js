import React from 'react';

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <tr style={{ backgroundColor: task.completed ? '#d4edda' : 'white', textDecoration: task.completed ? 'line-through' : 'none' }}>
      <td style={{ padding: 8, textAlign: 'center', border: '1px solid #ccc' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          aria-label="Mark task complete"
        />
      </td>
      <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.title}</td>
      <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.description}</td>
      <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.deadline}</td>
      <td style={{ padding: 8, border: '1px solid #ccc' }}>
        <button
          onClick={() => onEdit(task)}
          style={{ marginRight: 8, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px' }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px' }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
