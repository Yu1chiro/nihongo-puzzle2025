const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Menyajikan file statis (HTML, CSS, JS client-side) dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Menyajikan file data soal dari folder 'data'
app.use('/data', express.static(path.join(__dirname, 'data')));


// Rute khusus untuk halaman kuis
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});