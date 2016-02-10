var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
    res.status(200).sendFile(__dirname + '/app/index.html');
});

router.get('/getUsers', function(req, res) {
    var bankDB = new sqlite3.Database('./data/BANK.db');
    bankDB.all('SELECT * FROM USERS', function(err, rows) {
        if (err) {
            console.log(err);
            res.status(404).send('Internal error.');
        }

        res.status(200).type('json').json(JSON.stringify(rows));
    });
});

router.get('/getUsers', function(req, res) {
    var bankDB = new sqlite3.Database('./data/BANK.db');
    bankDB.all('SELECT * FROM USERS', function(err, rows) {
        if (err) {
            console.log(err);
            res.status(404).send('Internal error.');
        }

        res.status(200).type('json').json(JSON.stringify(rows));
    });
});

module.exports = router;
