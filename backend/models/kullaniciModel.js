const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const kullaniciSema = new Schema({
    phone: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'tr-TR'), 
            message: "Geçerli bir telefon numarası girin!"
        }
    },
    parola: { type: String, required: true },
    balance: { 
        type: Number, 
        default: function () { 
            return Math.floor(Math.random() * (5000 - 100 + 1)) + 100; 
        }
    },
    transactions: [
        {
            type: { type: String, enum: ["deposit", "withdraw", "transfer"] },
            amount: Number,
            date: { type: Date, default: Date.now },
            recipientPhone: String,
            senderPhone: String
        }
    ]
});

const tokenOlustur = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '30d' });
};

kullaniciSema.statics.signup = async function(phone, parola) {
    if (!phone || !parola) throw Error('Alanlar boş geçilemez');
    if (!validator.isMobilePhone(phone, 'tr-TR')) throw Error('Geçerli bir telefon numarası girin!');
    
    if (parola.length < 6) throw Error('Parola en az 6 karakter olmalıdır.');

    const existingUser = await this.findOne({ phone });
    if (existingUser) throw Error('Bu telefon numarası zaten kullanılıyor');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parola, salt);

    const kullanici = await this.create({ phone, parola: hashedPassword });

    return {
        _id: kullanici._id,
        phone: kullanici.phone,
        balance: kullanici.balance,
        token: tokenOlustur(kullanici._id)
    };
};


kullaniciSema.statics.login = async function(phone, parola) {
    if (!phone || !parola) throw Error('Alanlar boş geçilemez');

    const kullanici = await this.findOne({ phone });
    if (!kullanici) throw Error('Telefon numarası bulunamadı');

    const parolaKontrol = await bcrypt.compare(parola, kullanici.parola);
    if (!parolaKontrol) throw Error('Hatalı parola girdiniz');

    return {
        _id: kullanici._id,
        phone: kullanici.phone,
        balance: kullanici.balance,
        token: tokenOlustur(kullanici._id)
    };
};

kullaniciSema.statics.deposit = async function(userId, amount) {
    if (!userId || amount <= 0) throw new Error('Geçerli bir kullanıcı ID ve miktar girin.');

    const kullanici = await this.findById(userId);
    if (!kullanici) throw new Error('Kullanıcı bulunamadı.');

    kullanici.balance += amount;
    kullanici.transactions.push({ type: "deposit", amount, date: new Date() });
    await kullanici.save();

    return kullanici.balance;
};

kullaniciSema.statics.withdraw = async function(userId, amount) {
    if (!userId || amount <= 0) throw new Error('Geçerli bir kullanıcı ID ve miktar girin.');

    const kullanici = await this.findById(userId);
    if (!kullanici) throw new Error('Kullanıcı bulunamadı.');
    if (kullanici.balance < amount) throw new Error('Yetersiz bakiye.');

    kullanici.balance -= amount;
    kullanici.transactions.push({ type: "withdraw", amount, date: new Date() });
    await kullanici.save();

    return kullanici.balance;
};

kullaniciSema.statics.transfer = async function(senderId, recipientPhone, amount) {
    if (!senderId || !recipientPhone || amount <= 0) throw new Error('Tüm alanlar gereklidir.');

    const sender = await this.findById(senderId);
    if (!sender) throw new Error('Gönderen kullanıcı bulunamadı.');
    if (sender.balance < amount) throw new Error('Yetersiz bakiye.');

    const recipient = await this.findOne({ phone: recipientPhone });
    if (!recipient) throw new Error('Alıcı bulunamadı.');

    sender.balance -= amount;
    recipient.balance += amount;

    sender.transactions.push({ type: "transfer", amount, recipientPhone, date: new Date() });
    recipient.transactions.push({ type: "deposit", amount, senderPhone: sender.phone, date: new Date() });

    await sender.save();
    await recipient.save();

    return sender.balance;
};

kullaniciSema.statics.getTransactions = async function(userId) {
    if (!userId) throw new Error("Kullanıcı ID gereklidir.");

    const kullanici = await this.findById(userId).select("transactions");
    if (!kullanici) throw new Error("Kullanıcı bulunamadı.");
    
    return kullanici.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

module.exports = mongoose.model('Kullanici', kullaniciSema);
