import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = 'http://localhost:5000/tasks';

export default function App() {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task by id
  const updateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (res.ok) {
        setTaskToEdit(null);
        fetchTasks();
      } else {
        const errData = await res.json();
        alert('Update failed: ' + errData.error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // Toggle completed status
  const toggleComplete = async (task) => {
    const updatedTask = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      completed: !task.completed,
    };
    await updateTask(task._id, updatedTask);
  };

  // Add new task
  const addTask = async (task) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const errData = await res.json();
        alert('Add failed: ' + errData.error);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // Delete task by id
  const deleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTasks();
        else alert('Delete failed');
      } catch {
        alert('Network error');
      }
    }
  };

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    let valA, valB;
    if (sortBy === 'title') {
      valA = a.title.toLowerCase();
      valB = b.title.toLowerCase();
    } else if (sortBy === 'deadline') {
      valA = new Date(a.deadline);
      valB = new Date(b.deadline);
    } else {
      valA = new Date(a.createdAt);
      valB = new Date(b.createdAt);
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter by search term
  const filteredTasks = sortedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Separate by completion
  const pendingTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  // Notifications: tasks due in 3 days or less, incomplete
  useEffect(() => {
    const now = new Date();
    const notifTasks = tasks.filter((task) => {
      if (task.completed) return false;
      const deadline = new Date(task.deadline);
      const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 3;
    });
    setNotifications(notifTasks);
  }, [tasks]);

  // Toggle theme
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Styles with dark/light theme switch
  const styles = {
    container: {
      maxWidth: 800,
      margin: '2rem auto',
      padding: 24,
      borderRadius: 12,
      boxShadow:
        theme === 'light'
          ? '0 6px 20px rgba(0,0,0,0.08)'
          : '0 6px 20px rgba(255,255,255,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
      color: theme === 'light' ? '#222' : '#eee',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      position: 'relative',
    },
    header: {
      textAlign: 'center',
      color: theme === 'light' ? '#2e7d32' : '#a5d6a7',
      marginBottom: 30,
      fontWeight: '700',
      fontSize: 32,
      userSelect: 'none',
      letterSpacing: 1,
      textShadow: theme === 'light' ? '0 1px 3px rgba(46,125,50,0.4)' : 'none',
    },
    toggleBtn: {
      position: 'fixed',
      top: 20,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: '50%',
      border: 'none',
      backgroundColor: theme === 'light' ? '#2e7d32' : '#a5d6a7',
      color: theme === 'light' ? 'white' : '#222',
      fontSize: 24,
      cursor: 'pointer',
      boxShadow:
        theme === 'light'
          ? '0 3px 8px rgba(46,125,50,0.6)'
          : '0 3px 8px rgba(165,214,167,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      userSelect: 'none',
      zIndex: 9999,
    },
    toggleBtnHover: {
      filter: 'brightness(1.1)',
    },
    searchSortContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 24,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    searchInput: {
      flexGrow: 1,
      minWidth: 220,
      padding: '14px 16px',
      fontSize: 16,
      borderRadius: 10,
      border: `2px solid ${theme === 'light' ? '#a5d6a7' : '#4caf50'}`,
      outline: 'none',
      transition: 'border-color 0.3s ease',
      backgroundColor: theme === 'light' ? '#f9fff9' : '#2a2a2a',
      color: theme === 'light' ? '#222' : '#ddd',
      boxShadow: theme === 'light' ? '0 0 6px #a5d6a7' : '0 0 8px #4caf50',
      fontWeight: '600',
    },
    selectSort: {
      padding: '14px 16px',
      fontSize: 16,
      borderRadius: 10,
      border: `2px solid ${theme === 'light' ? '#a5d6a7' : '#4caf50'}`,
      cursor: 'pointer',
      backgroundColor: theme === 'light' ? '#f9fff9' : '#2a2a2a',
      color: theme === 'light' ? '#222' : '#ddd',
      fontWeight: '600',
      boxShadow: theme === 'light' ? '0 0 6px #a5d6a7' : '0 0 8px #4caf50',
      transition: 'all 0.3s ease',
      minWidth: 180,
      userSelect: 'none',
    },
    notification: {
      backgroundColor: theme === 'light' ? '#fff8e1' : '#4b3b00',
      color: theme === 'light' ? '#795548' : '#ffecb3',
      padding: 16,
      borderRadius: 14,
      marginBottom: 24,
      fontWeight: '700',
      boxShadow:
        theme === 'light'
          ? '0 0 12px rgba(255,193,7,0.6)'
          : '0 0 14px rgba(255, 214, 88, 0.8)',
      userSelect: 'none',
      fontSize: 16,
    },
    notifItem: {
      marginTop: 8,
      fontWeight: '600',
    },
    tabsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: 24,
      marginBottom: 32,
      flexWrap: 'wrap',
    },
    tabButton: {
      padding: '12px 28px',
      borderRadius: 30,
      border: `2.5px solid ${theme === 'light' ? '#2e7d32' : '#a5d6a7'}`,
      cursor: 'pointer',
      fontWeight: '700',
      backgroundColor: theme === 'light' ? 'transparent' : '#2e7d3240',
      color: theme === 'light' ? '#2e7d32' : '#a5d6a7',
      fontSize: 18,
      transition: 'all 0.3s ease',
      userSelect: 'none',
      minWidth: 180,
      textAlign: 'center',
    },
    activeTabButton: {
      backgroundColor: theme === 'light' ? '#2e7d32' : '#a5d6a7',
      color: theme === 'light' ? 'white' : '#222',
      boxShadow: theme === 'light' ? '0 0 12px #2e7d32' : '0 0 14px #a5d6a7',
    },
    noTasks: {
      textAlign: 'center',
      padding: 28,
      fontStyle: 'italic',
      color: theme === 'light' ? '#777' : '#bbb',
      fontSize: 18,
      userSelect: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={toggleTheme}
        style={styles.toggleBtn}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <h1 style={styles.header}>Task Management System</h1>

      {notifications.length > 0 && (
        <section style={styles.notification} role="alert" aria-live="assertive">
          ⚠️ Upcoming deadlines within 3 days:
          {notifications.map((task) => (
            <div key={task._id} style={styles.notifItem}>
              &quot;{task.title}&quot; due on{' '}
              {new Date(task.deadline).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          ))}
        </section>
      )}

<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
  <TaskForm
    onAdd={addTask}
    onUpdate={updateTask}
    taskToEdit={taskToEdit}
    cancelEdit={() => setTaskToEdit(null)}
    theme={theme}
  />
</div>

      <div style={styles.searchSortContainer}>
        <input
          type="search"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          aria-label="Search tasks"
        />
        <select
          aria-label="Sort tasks"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-');
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}
          style={styles.selectSort}
        >
          <option value="createdAt-desc">Sort by Created (Newest)</option>
          <option value="createdAt-asc">Sort by Created (Oldest)</option>
          <option value="title-asc">Sort by Title (A → Z)</option>
          <option value="title-desc">Sort by Title (Z → A)</option>
          <option value="deadline-asc">Sort by Deadline (Soonest)</option>
          <option value="deadline-desc">Sort by Deadline (Latest)</option>
        </select>
      </div>

      <nav style={styles.tabsContainer} role="tablist" aria-label="Task Status Tabs">
        <button
          role="tab"
          aria-selected={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'pending' ? styles.activeTabButton : {}),
          }}
          id="tab-pending"
          aria-controls="tabpanel-pending"
          tabIndex={activeTab === 'pending' ? 0 : -1}
        >
          Pending Tasks ({pendingTasks.length})
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'completed' ? styles.activeTabButton : {}),
          }}
          id="tab-completed"
          aria-controls="tabpanel-completed"
          tabIndex={activeTab === 'completed' ? 0 : -1}
        >
          Completed Tasks ({completedTasks.length})
        </button>
      </nav>

      {activeTab === 'pending' && (
        <section
          role="tabpanel"
          id="tabpanel-pending"
          aria-labelledby="tab-pending"
          tabIndex={0}
        >
          {pendingTasks.length === 0 ? (
            <p style={styles.noTasks}>No pending tasks to show.</p>
          ) : (
            <TaskList
              tasks={pendingTasks}
              onEdit={setTaskToEdit}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              theme={theme}
            />
          )}
        </section>
      )}

      {activeTab === 'completed' && (
        <section
          role="tabpanel"
          id="tabpanel-completed"
          aria-labelledby="tab-completed"
          tabIndex={0}
        >
          {completedTasks.length === 0 ? (
            <p style={styles.noTasks}>No completed tasks yet.</p>
          ) : (
            <TaskList
              tasks={completedTasks}
              onEdit={setTaskToEdit}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
              theme={theme}
            />
          )}
        </section>
      )}
    </div>
  );
}
