const express = require('express');
const { deposit, withdraw, transfer, getBalance, getTransactions } = require('../controllers/bankController');
const authKontrol = require('../middlewares/authKontrol');

const router = express.Router();

router.post('/deposit/:userId', authKontrol, deposit);
router.post('/withdraw/:userId', authKontrol, withdraw);
router.post('/transfer', authKontrol, transfer);
router.get('/balance/:userId', authKontrol, getBalance);
router.get('/transactions/:userId', authKontrol, getTransactions);

module.exports = router;
