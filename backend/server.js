require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

const MONGO_URI = process.env.MONGO_URI;

// CORS setup to allow frontend localhost:3000 and all methods
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json()); // built-in express json parser

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add priority and tags fields to schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  tags: [String],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, deadline, priority = 'Medium', tags = [] } = req.body;

    if (!title || !deadline) 
      return res.status(400).json({ error: 'Title and deadline are required' });

    // Create new task with priority and tags
    const newTask = new Task({ title, description, deadline, priority, tags });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in POST /tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error in GET /tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // Optional: validate priority if provided
    if (updateData.priority && !['High', 'Medium', 'Low'].includes(updateData.priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error('Error in PUT /tasks/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error in DELETE /tasks/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
