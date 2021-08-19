const mysql = require('mysql');
const Chore = require('./chore');
const importChores = require('./import-chores');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'choreman',
  password: 'password',
  database: 'chores'
});

const errfunc = (err) => { if (err) throw err; };

exports.initDatabase = function () {
  db.query("CREATE TABLE IF NOT EXISTS chores("
           + "id INT(10) NOT NULL AUTO_INCREMENT, "
           + "name VARCHAR(100), "
           + "frequency VARCHAR(20), "
           + "date DATE, "
           + "completed INT(1), "
           + "PRIMARY KEY(id))",
           errfunc);

  db.query("CREATE TABLE IF NOT EXISTS lastupdate ("
           + "id INT(10) NOT NULL AUTO_INCREMENT, "
           + "date DATE, "
           + "PRIMARY KEY(id))",
           (err) => {
             errfunc(err);
             initUpdateHistory();
           });
};


function initUpdateHistory() {
  db.query("SELECT * from lastupdate",
           (err, rows) => {
             errfunc(err);
             if (rows.length) return;
             db.query("INSERT INTO lastupdate (date) "
                      + "VALUES (NULL)",
                      errfunc);
           });
}


function updateDatabase() {
  console.log("calling updateDatabase");
  db.query("SELECT * from lastupdate WHERE ISNULL(date) OR date != CURDATE()",
           (err, rows) => {
             errfunc(err);
             console.log(rows);
             if (rows.length) {
               // Need to update the database
               db.query("UPDATE lastupdate SET date=CURDATE()", errfunc);
               importChores('chores.csv');
               exports.clearOldChores();
             }
           });
}


function rowToClientChore(row) {
  return {name: row.name,
          freq: row.frequency,
          completed: row.completed,
          overdue: row['date != CURDATE()'] };
}


exports.getChores = function(callback) {
  updateDatabase();
  db.query("SELECT name, frequency, completed, date != CURDATE() FROM chores",
           (err, rows) => {
             errfunc(err);
             const rowList = rows.map(rowToClientChore);
             callback(rowList);
           });
}

exports.addChore = function(chore) {
  // Add the chore only if there isn't already a chore with the same name, frequency, and day
  db.query("SELECT id FROM chores WHERE name=? AND frequency=? and date=CURDATE()",
           [chore.name, chore.freq],
           function(err, rows) {
             errfunc(err);
             if (rows.length != 0) return;
             db.query("INSERT INTO chores (name, frequency, date, completed) "
                      + "VALUES (?, ?, CURDATE(), 0)",
                      [chore.name, chore.freq],
                      errfunc
                     );
           });
}

exports.clearOldChores = function() {
  db.query("DELETE FROM chores WHERE completed=1 AND date!=CURDATE()", errfunc);
  db.query("DELETE FROM chores WHERE frequency='daily' AND date!=CURDATE()", errfunc);
}

exports.setChoreStatus = function(choreName, status) {
  console.log(`setChoreStatus(${choreName}, ${status})`);
  db.query("UPDATE chores SET completed=? WHERE name=?",
           [status, choreName], errfunc);
}
