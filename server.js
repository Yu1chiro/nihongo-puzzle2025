const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // Ganti express-session dengan cookie-parser
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing body JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gunakan cookie-parser dengan secret dari .env untuk menandatangani cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

// Middleware untuk memproteksi route
const protectRoute = (req, res, next) => {
    // Periksa signed cookie, bukan session
    // Jika cookie valid dan ditandatangani dengan benar, nilainya akan ada di req.signedCookies
    if (req.signedCookies.isAdmin === 'true') {
        next(); // Lanjutkan jika cookie valid
    } else {
        res.redirect('/login'); // Arahkan ke login jika tidak ada cookie valid
    }
};

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));


// --- RUTE-RUTE ---

// Rute Halaman Login (GET)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rute Proses Login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Ambil kredensial dari environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        // Logika login: set signed cookie, bukan session
        res.cookie('isAdmin', 'true', {
            signed: true,          // Tandatangani cookie ini
            httpOnly: true,        // Cookie tidak bisa diakses via JavaScript di browser (lebih aman)
            maxAge: 24 * 60 * 60 * 1000 // Cookie berlaku selama 24 jam
        });
        res.status(200).json({ message: 'Login berhasil' });
    } else {
        res.status(401).json({ message: 'Username atau password salah!' });
    }
});

// Rute Logout
app.get('/logout', (req, res) => {
    // Logout: hapus cookie
    res.clearCookie('isAdmin');
    res.redirect('/login');
});


// Rute halaman publik (tidak diproteksi)
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

// Rute halaman admin (DIPROTEKSI DENGAN MIDDLEWARE)
app.get('/admin', protectRoute, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});
app.get('/info', protectRoute, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});