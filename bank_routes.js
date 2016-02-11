var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

// define the home page route
router.get('/', function(req, res) {
    res.status(200).sendFile(__dirname + '/app/index.html');
});

router.get('/getUsers', function(req, res) {
    var db = new sqlite3.Database('./data/BANK.db');
    db.all('SELECT * FROM USERS', function(err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send('ERROR');
        } else {
            if (rows[0])
                rows.splice(0, 1);

            res.status(200).type('json').json(JSON.stringify(rows));
        }

        db.close();
    });
});

router.get('/getAccounts', function(req, res) {
    var db = new sqlite3.Database('./data/BANK.db');
    db.all('SELECT * FROM accounts WHERE owner_id=' + req.query.OWNER_ID,
        function(err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send('ERROR');
            } else {
                res.status(200).type('json').json(JSON.stringify(rows));
            }

            db.close();
        });
});

router.get('/getEntries', function(req, res) {
    var db = new sqlite3.Database('./data/BANK.db');
    db.all('SELECT * FROM account_entry', function(err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send('ERROR');
        } else {
            res.status(200).type('json').json(JSON.stringify(rows));
        }

        db.close();
    });
});

router.post('/addEntry', function(req, res) {
    var db = new sqlite3.Database('./data/BANK.db');
    db.all('PRAGMA foreign_keys = ON');

    var entry = req.body.entry;

    db.run('INSERT INTO ACCOUNT_ENTRY (user_id, account_id, value, code, causal, date) VALUES($USER_ID, $ACCOUNT_ID, $VALUE, $CODE, $CAUSAL, $DATE)',
        { $USER_ID: entry.USER_ID, $ACCOUNT_ID: entry.ACCOUNT_ID, $CODE: entry.CODE, $VALUE: entry.VALUE, $CAUSAL: entry.CAUSAL, $DATE: entry.DATE},
        function(err) {
            if (err) {
                res.status(200).send('ERROR');
                console.log(err);
            } else {
                res.status(200).send('OK');
            }

            db.close();
        });
});

module.exports = router;
