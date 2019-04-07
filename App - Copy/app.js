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

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(xssFilter());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/* app.use(session({
    store: new SQLiteStore.Database('public/test.dbBooks', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
        dbBooks
    }),
    secret: 'webshop123abc',
})); */

/* Database */
var file = "public/database/books.db";
var exists = fs.existsSync(file);
var dbBooks = new SQLiteStore.Database(file);

/*dbBooks.serialize(function() {
    if (!exists) {
        dbBooks.run("CREATE TABLE books (bookid TEXT, xml TEXT, stock INTEGER)");
    }
    / stmt = dbBooks.prepare("INSERT INTO books(bookid, xml) VALUES (?, ?)");

    var xmlfile;
    fs.readFile("text.txt", 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    console.log(typeof xmlfile);

    var xmlfile = fs.readFileSync("public/books.xml", { "encoding": "utf8" });
    parseBooks("public/books.xml");
    console.log(bookCollection);
    stmt.run("01", parseBooks("public/books.xml"));

    stmt.finalize();
    dbBooks.each("SELECT rowid AS id, bookid FROM books, xml FROM books", function(err, row) {
        console.log(row.id + ": " + row.bookid + ": " + row.xml);
    });
});*/

var sql = `SELECT DISTINCT xml name FROM books ORDER BY name`;
dbBooks.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    var booksFromDbBooks = [];
    booksFromDbBooks.push('<?xml version="1.0"?>\r\n<catalog>')
    rows.forEach((row) => {
        console.log(row.name);
        booksFromDbBooks.push(row.name);
    });
    booksFromDbBooks.push('\r\n</catalog>')
    booksFromDbBooks = booksFromDbBooks.join("\r\n");

    fs.writeFile("public/database/xmlFromDbBooks.xml", booksFromDbBooks, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});

// close the database connection
dbBooks.close();

/* Xml parser 
var xml = "<book><id></id>bk101<author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publisher>Penguin Random House</publisher><image>images/logoUtrecht.png</image></book>"
parseString(xml, function(err, result) {
    console.dir(result);
});*/

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

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});