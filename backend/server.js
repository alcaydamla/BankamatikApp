const express = require('express');
require('dotenv').config();
const cors = require('cors'); 
const mongoose = require('mongoose');

const kullaniciRoute = require('./routes/kullanici');
const bankRoute = require('./routes/bankRoutes');

const app = express(); 

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB bağlantısı başarılı');


        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });

        const shutdown = (signal) => {
            console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log('Sunucu kapatıldı.');
                process.exit(0);
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));  
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    })
    .catch(err => {
        console.error('MongoDB bağlantı hatası:', err.message);
        process.exit(1); 
    });

app.use('/api/kullanici', kullaniciRoute);
app.use('/api/banka', bankRoute);

app.use((err, req, res, next) => {
    console.error('Sunucu Hatası:', err.message);
    res.status(500).json({ hata: 'Sunucu hatası, lütfen tekrar deneyin!' });
});

module.exports = app;
