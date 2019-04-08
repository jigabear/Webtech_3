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

// var fs = require("fs");
// var sqlite3 = require("sqlite3").verbose();
// var dbUser = new sqlite3.Database('C:/Users/Marco Brouwer/Desktop/AppLogin - Copy/public/dbUser/test.dbUser', sqlite3.OPEN_READWRITE, (err) => {
//     if (err){
//         console.error(err.message);
//     }
//     console.log('Connected to the test database.');
// });
// dbUser.serialize(function() {
//         dbUser.run("CREATE TABLE Stuff (thing TEXT)");

//     var stmt = dbUser.prepare("INSERT INTO Stuff Values (?)");
//     var rnd;
//     for (var i = 0; i <10; i++){
//         rnd = Math.floor(Math.random() * 100000000);
//         stmt.run("Thing #" + rnd);
//     }
//     stmt.finalize();
//     dbUser.each("SELECT rowid AS id, thing FROM Stuff", function(err, row){
//         console.log(row.id + ":" + row.thing);
//     });
// });
// dbUser.close();


//Sync database file if available.
var fs = require("fs");
var file = __dirname + "\\" + "users.db";
console.log(file);
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
        dbUser.run("CREATE TABLE accounts (`id` int(11) NOT NULL, `username` varchar(50) NOT NULL, `password` varchar(255) NOT NULL, `email` varchar(100) NOT NULL)");
    }

    //Insert data into Users. Deze data moet op een of andere manier eigenlijk uit de Sign-up form komen, maar geen flauw idee hoe precies.
    /*dbUser.run("INSERT OR IGNORE INTO Users (fName, lName, email, psw, productsPurchased) VALUES (?, ?, ?, ?, ?)", ["Marco", "Brouwer", "m.m.f.brouwer@students.uu.nl", "geitenkaas", "Watergun"]);
    dbUser.run("INSERT OR IGNORE INTO Users (fName, lName, email, psw, productsPurchased) VALUES (?, ?, ?, ?, ?)", ["Joshua", "Hicks", "j.j.m.hicks@students.uu.nl", "karnemelk", "WheelOfTime"]);*/

    dbUser.run("INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com')");
    /*dbUser.run("ALTER TABLE `accounts` ADD PRIMARY KEY (`id`)");
    dbUser.run("ALTER TABLE `accounts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2");*/
    //Een of andere If-statement met een of ander stuk code waarin duidelijk gemaakt wordt van yo, er is een boek gekocht, update productsPurchased. 
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
    console.log(username);
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

/*var appLogin = express();

appLogin.use(bodyParser.urlencoded({ extended: false }));
appLogin.use(bodyParser.json());
appLogin.use(cookieParser());

appLogin.use(express.static("../"))

appLogin.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

appLogin.use(passport.initialize());
appLogin.use(passport.session());

appLogin.use(flash());

// Global variables
appLogin.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const PORT = process.env.PORT || 3000;*/

dbUser.close();