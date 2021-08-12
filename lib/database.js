const mysql = require('mysql');
const Chore = require('./chore');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'john',
  password: 'password',
  database: 'chores'
});

exports.initDatabase = function () {
  db.query("CREATE TABLE IF NOT EXISTS chores("
           + "id INT(10) NOT NULL AUTO_INCREMENT, "
           + "name VARCHAR(100), "
           + "frequency VARCHAR(20), "
           + "date DATE, "
           + "completed INT(1), "
           + "PRIMARY KEY(id))",
           function(err) {
             if (err) throw err;
           });
};

exports.addChore = function(chore) {
  // Add the chore only if there isn't already a chore with the same name, frequency, and day
  db.query("SELECT id FROM chores WHERE name=? AND frequency=? and date=CURDATE()",
           [chore.name, chore.freq],
           function(err, rows) {
             if (err) throw err;
             if (rows.length != 0) return;
             db.query("INSERT INTO chores (name, frequency, date, completed) "
                      + "VALUES (?, ?, CURDATE(), 0)",
                      [chore.name, chore.freq],
                      (err) => {if (err) throw err;}
                     );
           });
}

exports.clearOldChores = function() {
  db.query("DELETE FROM chores WHERE completed=1 AND date!=CURDATE()",
           function(err) { if (err) throw err; });
}
