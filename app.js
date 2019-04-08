'use strict';
var debug = require('debug');
var express = require('express');
var session = require('express-session');
var SQLiteStore = require('sqlite3').verbose();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var parseString = require('xml2js').parseString;

var routes = require('./routes/index');
var users = require('./routes/users');

// Cross-site scripting protection
const xssFilter = require('x-xss-protection');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(xssFilter());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/* Database */
var file = "public/database/books.db";
var exists = fs.existsSync(file);
var dbBooks = new SQLiteStore.Database(file);

var sql = `SELECT DISTINCT xml name FROM books ORDER BY name`;
dbBooks.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    var booksFromDbBooks = [];
    booksFromDbBooks.push('<?xml version="1.0"?>\r\n<catalog>')
    rows.forEach((row) => {
        booksFromDbBooks.push(row.name);
    });
    booksFromDbBooks.push('\r\n</catalog>')
    booksFromDbBooks = booksFromDbBooks.join("\r\n");

    fs.writeFile("public/database/xmlFromDbBooks.xml", booksFromDbBooks, function(err) {
        if (err) {
            return console.log(err);
        }

    });
});

// close the database connection
dbBooks.close();

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 8018);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});