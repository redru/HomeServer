var fs = require('fs');
var bcrypt = require('bcryptjs');
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var router = express.Router();

// DATABASE FUNCTIONS ***************************************************
function BankDb() {
    this.db = {};

    this.open = function() {
        this.db = new sqlite3.Database('./data/BANK.db');
        this.db.all('PRAGMA foreign_keys = ON');
    };

    this.close = function() {
        this.db.close();
    };

    this.getUser = function(username, password, callback) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        this.db.all('SELECT * FROM users WHERE username=' + username + ' AND password=' + hash, function(err, rows) {
            if (err)
                console.log(err);

            callback(err, rows);
        });
    };

    this.checkUserAccount = function(userId, accountId, callback) {
        this.db.all('SELECT * FROM accounts WHERE id=' + accountId + ' AND user_id=' + userId, function(err, rows) {
            if (err)
                console.log(err);

            callback(err, rows);
        });
    };

    this.getEntries = function(userId, accountId, callback) {
        this.db.all('SELECT * FROM account_entry WHERE user_id=' + userId + ' AND account_id=' + accountId, function(err, rows) {
            if (err)
                console.log(err);

            callback(err, rows);
        });
    };

    this.deleteEntry = function (entryId, callback) {
        this.db.run('DELETE FROM account_entry WHERE id=$entryId', { $entryId: entryId }, function(err) {
            if (err)
                console.log(err);

            callback(err);
        });
    };

};
//***********************************************************************

// define the home page route
router.get('/', function(req, res) {
    res.status(200).sendFile(__dirname + '/app/index.html');
});

router.get('/*.*', function(req, res) {
    if (fs.existsSync(__dirname + '/app' + req.url)) {
        res.status(200).sendFile(__dirname + '/app' + req.url);
    } else {
        res.status(404).send('Not found.');
    }
});

/**
 *
 */
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

/**
 *
 */
router.get('/getAccounts', function(req, res) {
    if (!req.query.USER_ID) {
        res.status(200).send({});
        return;
    }

    var db = new sqlite3.Database('./data/BANK.db');
    db.all('SELECT * FROM accounts WHERE user_id=' + req.query.USER_ID,
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

/**
 * Get entries from DB checking the combo USER_ID and ACCOUNT_ID
 */
router.get('/getEntries', function(req, res) {
    if (!req.query.USER_ID || !req.query.ACCOUNT_ID) {
        res.status(200).send({});
        return;
    }

    var db = new BankDb();
    db.open();
    db.checkUserAccount(req.query.USER_ID, req.query.ACCOUNT_ID, function(err, rows) { // First DB call
        if (rows) {
            db.getEntries(req.query.USER_ID, req.query.ACCOUNT_ID, function(err, rows) { // Second DB call
                res.status(200).type('json').json(JSON.stringify(rows ? rows : {}));
                db.close();
            })
        } else {
            res.status(200).send({});
            db.close();
        }
    });
});

/**
 *
 */
router.post('/addEntry', function(req, res) {
    var db = new sqlite3.Database('./data/BANK.db');
    db.all('PRAGMA foreign_keys = ON');

    var entry = req.body.entry;

    // Controllo valore data
    if (!entry.DATE)
        entry.DATE = new Date().toLocaleDateString();

    db.run('INSERT INTO ACCOUNT_ENTRY (user_id, account_id, value, code, causal, date) VALUES($USER_ID, $ACCOUNT_ID, $VALUE, $CODE, $CAUSAL, $DATE)',
        { $USER_ID: entry.USER_ID, $ACCOUNT_ID: entry.ACCOUNT_ID, $CODE: entry.CODE, $VALUE: entry.VALUE, $CAUSAL: entry.CAUSAL, $DATE: entry.DATE },
        function(err) {
            if (err) {
                res.status(200).send({});
                console.log(err);
                db.close();
            } else {
                db.close();
                db = new BankDb();
                db.open();
                db.getEntries(entry.USER_ID, entry.ACCOUNT_ID, function(err, rows) {
                    if (err) {
                        res.status(200).send({});
                        console.log(err);
                    } else {
                        res.status(200).type('json').json(JSON.stringify(rows ? rows : 'EMPTY'));
                    }

                    db.close();
                });
            }
        });
});

router.post('/deleteEntry', function(req, res) {
    var db = new BankDb();
    db.open();

    db.deleteEntry(req.body.ENTRY_ID, function(err) { // First DB call
        if (!err) {
            db.getEntries(req.body.USER_ID, req.body.ACCOUNT_ID, function(err, rows) { // Second DB call
                res.status(200).type('json').json(JSON.stringify(rows ? rows : {}));
                db.close();
            })
        } else {
            res.status(200).send('EMPTY');
            db.close();
        }
    });
});

module.exports = router;
