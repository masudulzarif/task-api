const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Helper function to read tasks from the JSON file
const readTasks = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(fileData);
    } catch (error) {
        return [];
    }
};

// Helper function to write tasks to the JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};

// ==================== TASK API ENDPOINTS ====================

// 1. CREATE: Add a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description || '',
        done: false, // Default task status
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json({
        message: 'Task created successfully',
        task: newTask
    });
});

// 2. READ: Get all tasks with optional query filter (e.g., ?done=true)
app.get('/tasks', (req, res) => {
    let tasks = readTasks();
    const { done } = req.query;

    // Filter tasks if 'done' query parameter is present
    if (done !== undefined) {
        const isDone = done === 'true';
        tasks = tasks.filter(task => task.done === isDone);
    }

    res.status(200).json(tasks);
});

// 3. READ: Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
});

// 4. UPDATE: Modify an existing task
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        title: req.body.title !== undefined ? req.body.title : tasks[taskIndex].title,
        description: req.body.description !== undefined ? req.body.description : tasks[taskIndex].description,
        done: req.body.done !== undefined ? req.body.done : tasks[taskIndex].done,
        updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask
    });
});

// 5. DELETE: Remove a task by ID
app.delete('/tasks/:id', (req, res) => {
    let tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask[0]
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});