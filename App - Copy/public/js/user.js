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
// var db = new sqlite3.Database('C:/Users/Marco Brouwer/Desktop/App - Copy/public/db/test.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err){
//         console.error(err.message);
//     }
//     console.log('Connected to the test database.');
// });
// db.serialize(function() {
//         db.run("CREATE TABLE Stuff (thing TEXT)");

//     var stmt = db.prepare("INSERT INTO Stuff Values (?)");
//     var rnd;
//     for (var i = 0; i <10; i++){
//         rnd = Math.floor(Math.random() * 100000000);
//         stmt.run("Thing #" + rnd);
//     }
//     stmt.finalize();
//     db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row){
//         console.log(row.id + ":" + row.thing);
//     });
// });
// db.close();


//Sync database file if available.
var fs = require("fs");
var file = __dirname + "/" + "users.db";
var exists = fs.existsSync(file);
if(!exists) {
fs.openSync(file, "w");
}

//Create a new database.
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
//Create a table of Users for the database. Email has to be a unique value.
db.serialize(function() {
    if(!exists) {
        db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY, fName TEXT, lName TEXT, email TEXT NOT NULL UNIQUE, psw TEXT, productsPurchased TEXT)");
    }

//Insert data into Users. Deze data moet op een of andere manier eigenlijk uit de Sign-up form komen, maar geen flauw idee hoe precies.
db.run("INSERT OR IGNORE INTO Users (fName, lName, email, psw, productsPurchased) VALUES (?, ?, ?, ?, ?)", ["Marco", "Brouwer", "m.m.f.brouwer@students.uu.nl", "geitenkaas", "Watergun"]);
db.run("INSERT OR IGNORE INTO Users (fName, lName, email, psw, productsPurchased) VALUES (?, ?, ?, ?, ?)", ["Joshua", "Hicks", "j.j.m.hicks@students.uu.nl", "karnemelk", "WheelOfTime"]);


//Een of andere If-statement met een of ander stuk code waarin duidelijk gemaakt wordt van yo, er is een boek gekocht, update productsPurchased. 


});
db.close();



