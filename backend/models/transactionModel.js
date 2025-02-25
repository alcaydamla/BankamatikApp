const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Kullanici' },
    type: { 
        type: String, 
        enum: ['deposit', 'withdraw'], 
        required: true },
    amount: { 
        type: Number, 
        required: true },
    date: { 
        type: Date, 
        default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
