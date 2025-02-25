const Kullanici = require('../models/kullaniciModel');
const jwt = require('jsonwebtoken');

const tokenOlustur = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '30d' });
};

const loginKullanici = async (req, res) => {
    const { phone, parola } = req.body;

    try {
        const kullanici = await Kullanici.login(phone, parola); 

        const token = tokenOlustur(kullanici._id);
        res.status(200).json({ 
            _id: kullanici._id, 
            phone: kullanici.phone, 
            balance: kullanici.balance,
            token 
        });
    } catch (error) {
        console.error("Giriş Hatası:", error.message); 
        res.status(400).json({ hata: error.message });
    }
};

const signupKullanici = async (req, res) => {
    const { phone, parola } = req.body;

    try {
        const kullanici = await Kullanici.signup(phone, parola);
        const token = tokenOlustur(kullanici._id);

        res.status(200).json({ 
            _id: kullanici._id,
            phone: kullanici.phone,
            balance: kullanici.balance,
            token 
        });

    } catch (error) {
        console.error("Kayıt Hatası:", error.message); 
        res.status(400).json({ hata: error.message });
    }
};


module.exports = {
    loginKullanici,
    signupKullanici
};
