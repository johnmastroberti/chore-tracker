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
  this.freq = frequency;
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

var chores = [ new Chore("Do the dishes", "daily", ""),
               new Chore("Clean the counters", "daily", ""),
               new Chore("Run the shark", "daily", ""),
               new Chore("Laundry", "weekly", "Sunday"),
               new Chore("Water the plants", "weekly", "Monday"),
               new Chore("Vacuuming", "weekly", "Tuesday"),
               new Chore("Clean guest bathroom", "weekly", "Wednesday"),
               new Chore("Clean bedroom", "weekly", "Thursday"),
               new Chore("Clean master bath", "weekly", "Friday"),
               new Chore("Mow the Lawn", "weekly", "Saturday"),
               new Chore("Wash the cars", "monthly", "Sunday 1"),
               new Chore("Clean the gutters", "monthly", "Wednesday 3") ];


function createChores() {
  for (i in chores) {
    if (!chores[i].isAssignedToday()) continue;

    var ele = document.createElement('input');
    ele.setAttribute('type', 'checkbox');
    ele.setAttribute('id', 'chore' + i.toString());
    ele.setAttribute('name', 'chore' + i.toString());
    ele.setAttribute('onclick', `updateChores(${i})`);

    var label = document.createElement('label');
    label.setAttribute('for', 'chore' + i.toString());
    label.setAttribute('id', 'chorelabel' + i.toString());
    label.innerHTML = chores[i].name;

    var space = document.createElement('br');

    var parent = null;
    console.log(chores[i].freq);
    switch (chores[i].freq) {
      case "daily":
        parent = document.getElementById("daily-chores");
        break;
      case "weekly":
        parent = document.getElementById("weekly-chores");
        break;
      case "monthly":
        parent = document.getElementById("monthly-chores");
        break;
    }
    console.log(parent);

    parent.appendChild(ele);
    parent.appendChild(label);
    parent.appendChild(space);
    i++;
  }
}

var socket = io("localhost:8080");

function updateChores(choreNum) {
  if (!chores[choreNum].isAssignedToday()) return;
  const choreComp = document.getElementById('chore' + choreNum.toString()).checked;
  const event = choreComp ? "chore-complete" : "chore-uncomplete";
  socket.emit(event, chores[choreNum].name);
}

function choreNameToNum(choreName) {
  for (i in chores) {
    console.log("chores[i].name = " + chores[i].name);
    console.log("choreName = ", choreName);
    console.log("chores[i].name matches choreName: ", chores[i].name == choreName);
    if (chores[i].name == choreName) return i;
  }
  return -1;
}

socket.on('chore-complete', (choreName) => {
  const choreNum = choreNameToNum(choreName);
  console.log("chore-complete for chore #" + choreNum);
  if (choreNum == -1) return;
  chores[choreNum].isCompleted = true;
  updateDisplay();
});

socket.on('chore-uncomplete', (choreName) => {
  const choreNum = choreNameToNum(choreName);
  if (choreNum == -1) return;
  chores[choreNum].isCompleted = false;
  updateDisplay();
});

function updateDisplay() {
  for (i in chores) {
    if (!chores[i].isAssignedToday()) continue;
    document.getElementById('chore' + i.toString()).checked = chores[i].isCompleted;
    var label = document.getElementById('chorelabel' + i.toString());
    label.style.textDecoration = chores[i].isCompleted ? "line-through" : "none";
  }
}
