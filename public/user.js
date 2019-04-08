var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

class User {
    constructor(fName, lName, email, psw) {
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.psw = psw;
    }
}

//Sync database file if available.
var fs = require("fs");
var file = __dirname + "\/" + "users.db";
var exists = fs.existsSync(file);
if (!exists) {
    fs.openSync(file, "w");
}

//Create a new database.
var sqlite3 = require("sqlite3").verbose();
var dbUser = new sqlite3.Database(file);
//Create a table of Users for the database. Email has to be a unique value.
dbUser.serialize(function() {
    if (!exists) {
        dbUser.run("CREATE TABLE accounts (`id` int(11) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(100) NOT NULL UNIQUE)");
    }

    dbUser.run("INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com')");

    if (confirmPurchase() == true) {
        dbUser.run("UPDATE `accounts` SET `username` = 'Joshua' WHERE `id` = 2");
    }
});

var appLogin = express();
appLogin.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
appLogin.use(bodyParser.urlencoded({ extended: false }));
appLogin.use(bodyParser.json());

appLogin.get('/loginPage.html', function(request, response) {
    response.sendFile(path.join(__dirname + '/loginPage.html'));
});

appLogin.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        results = dbUser.run("SELECT * FROM 'accounts' WHERE 'username' = (?) AND 'password' = (?)", [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/public/bookShop.html');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

appLogin.get('/public/bookShop.html', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

appLogin.listen(3000);

dbUser.close();