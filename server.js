const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Para maintindihan ng server ang JSON data)
app.use(cors());
app.use(express.json());
// I-serve ang static files (HTML/CSS) mula sa 'public' folder
app.use(express.static('public'));

// Basic Route (Test kung gumagana)
app.get('/api', (req, res) => {
    res.json({ message: "Gumagana ang Expense Tracker Backend!" });
});
// Idagdag ito sa server.js mo sa itaas ng app.listen

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
    // Idagdag ito para siguradong babasahin ang index.html sa main link
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// I-import ang Expense Model (siguraduhing tama ang path)
const Expense = require('./models/Expense');

// --- MGA ROUTES ---

// 1. GET ALL EXPENSES (Kunin lahat ng records mula sa MongoDB)
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ADD NEW EXPENSE (Mag-save ng bagong record sa MongoDB)
app.post('/api/expenses', async (req, res) => {
    const expense = new Expense({
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. DELETE EXPENSE (Burahin ang record sa MongoDB)
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});