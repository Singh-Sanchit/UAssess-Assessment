const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/reports/:id', function (req, res) {
    req.params.id;
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/form/:id', function (req, res) {
    req.params.id;
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/template/:id', function (req, res) {
    req.params.id;
    res.sendFile(path.join(__dirname, 'build', 'index.html'));    
});
app.get('/assessments', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));    
});
app.get('/create', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));    
});
app.get('/feedback', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/logout', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen('8080', '127.0.0.1');
console.log('Server started at port 8080');
