const jwt = require('jsonwebtoken');
const Kullanici = require('../models/kullaniciModel');

const authKontrol = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token gerekli.' });
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = _id; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Geçersiz token' });
    }
};

module.exports = authKontrol;
