const Kullanici = require('../models/kullaniciModel');

const deposit = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { amount } = req.body;
        
        if (!userId || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Geçersiz giriş değerleri. Miktar pozitif bir sayı olmalıdır.' });
        }

        const kullanici = await Kullanici.findById(userId);
        if (!kullanici) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        kullanici.balance += Number(amount);
        
        kullanici.transactions.push({ type: "deposit", amount: Number(amount) });
        await kullanici.save();

        res.json({ message: 'Para başarıyla yatırıldı.', balance: kullanici.balance });
    } catch (error) {

        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};


const withdraw = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { amount } = req.body;

        if (!userId || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Geçersiz giriş değerleri. Miktar pozitif bir sayı olmalıdır.' });
        }

        const kullanici = await Kullanici.findById(userId);
        if (!kullanici) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        if (kullanici.balance < Number(amount)) {
            return res.status(400).json({ message: 'Yetersiz bakiye. Daha az bir miktar çekmeyi deneyin.' });
        }

        kullanici.balance -= Number(amount);
        kullanici.transactions.push({ type: "withdraw", amount: Number(amount) });
        await kullanici.save();

        res.json({ message: 'Para başarıyla çekildi.', balance: kullanici.balance });
    } catch (error) {
 
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};

const transfer = async (req, res) => {
    try {
        const { userId, recipientPhone, amount } = req.body;

        if (!userId || !recipientPhone || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Geçersiz giriş değerleri.' });
        }

        const sender = await Kullanici.findById(userId);
        if (!sender) {
            return res.status(404).json({ message: 'Gönderen kullanıcı bulunamadı.' });
        }

        if (sender.balance < Number(amount)) {
            return res.status(400).json({ message: 'Yetersiz bakiye. Daha az bir miktar gönderin.' });
        }

        const recipient = await Kullanici.findOne({ phone: recipientPhone });
        if (!recipient) {
            return res.status(404).json({ message: 'Alıcı bulunamadı.' });
        }

        sender.balance -= Number(amount);
        recipient.balance += Number(amount);

        sender.transactions.push({ type: "transfer", amount: Number(amount), recipientPhone });
        recipient.transactions.push({ type: "deposit", amount: Number(amount) });

        await sender.save();
        await recipient.save();

        res.json({ message: 'Transfer başarılı.', balance: sender.balance });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};

const getBalance = async (req, res) => {
    try {
        const userId = req.params.userId;

        const kullanici = await Kullanici.findById(userId);
        if (!kullanici) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.json({ balance: kullanici.balance });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};

const getTransactions = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const kullanici = await Kullanici.findById(userId).select("transactions");

        if (!kullanici) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        res.json(kullanici.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası. Lütfen tekrar deneyin." });
    }
};

module.exports = { deposit, withdraw, transfer, getBalance, getTransactions };
