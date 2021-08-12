function weekdayToNum(dayStr) {
  dayStr = dayStr.toLowerCase();
  switch (dayStr) {
    case "sunday": return 0;
    case "monday": return 1;
    case "tuesday": return 2;
    case "wednesday": return 3;
    case "thursday": return 4;
    case "friday": return 5;
    case "saturday": return 6;
    default: return -1;
  }
}

function Chore(name, frequency, day) {
  this.name = name;
  this.freq = frequency.toLowerCase();
  this.day = day;
  this.isCompleted = false;
  this.isAssignedToday = function() {
    var today = new Date();
    switch (this.freq) {
      case "daily":
        return true;
      case "weekly":
        return (weekdayToNum(this.day) == today.getDay());
      case "monthly":
        var parts = this.day.split(" ");
        var weeknum = Math.floor((today.getDate() - 1) / 7) + 1;
        return (parts.length == 2 && weekdayToNum(parts[0]) == today.getDay() && weeknum == parts[1]);
      default:
        return false;
    }
  };
}

module.exports = Chore;
