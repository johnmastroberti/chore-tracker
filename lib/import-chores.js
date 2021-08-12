const fs = require('fs');
const assert = require('assert');
const parse = require('csv-parse/lib/sync');
const Chore = require('./chore');
const Database = require('./database')

module.exports = function importChores(filename) {
  console.log('calling import chores');
  const choresData = parse(fs.readFileSync(filename), {
    columns: true,
    skip_empty_lines: true
  });


  for (const c of choresData) {
    const chore = new Chore(c.Chore, c.Frequency, c.Day);
    if (chore.isAssignedToday()) {
      Database.addChore(chore);
    }
  }
}
