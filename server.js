var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var express = require('express');
var bankRoutes = require('./bank_routes');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bank routing
app.use('/bank', bankRoutes);

// Favicon routing
app.get('/favicon.ico', function(req, res) {
    if (fs.existsSync(__dirname + req.url)) {
        res.status(200).sendFile(__dirname + req.url);
    } else {
        res.status(404).send('Not found.');
    }
});

// node_modules routing
app.get('/node_modules/*.*', function(req, res) {
    if (fs.existsSync(__dirname + req.url)) {
        res.status(200).sendFile(__dirname + req.url);
    } else {
        res.status(404).send('Not found.');
    }
});

// bower_components routing
app.get('/bower_components/*.*', function(req, res) {
    if (fs.existsSync(__dirname + req.url)) {
        res.status(200).sendFile(__dirname + req.url);
    } else {
        res.status(404).send('Not found.');
    }
});

// Server statup function
app.listen(80, function () {
    console.log('Home Server started on port 80.');
});