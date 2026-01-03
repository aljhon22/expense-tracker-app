const mongoose = require('mongoose');

// Ito ang blueprint ng iyong data
const ExpenseSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: [true, 'Please add a description'] 
    },
    amount: { 
        type: Number, 
        required: [true, 'Please add a positive number'] 
    },
    type: { 
        type: String, 
        enum: ['income', 'expense'], 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);