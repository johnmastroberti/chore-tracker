let ChoreList = []

var socket = io(`${HOST}:${PORT}`);

function getChores() {
  socket.emit('get-chores');
}

socket.on('chore-list', (choreList) => {
  ChoreList = choreList;
  renderChores();
});

socket.on('chore-complete', (choreName) => {
  setChoreStatus(choreName, true);
  updateDisplay();
});

socket.on('chore-uncomplete', (choreName) => {
  setChoreStatus(choreName, false);
  updateDisplay();
});


function setChoreStatus(choreName, status) {
  for (c of ChoreList) {
    if (c.name == choreName) {
      console.log(`Setting completion status of ${choreName}`);
      c.completed = status;
    }
  }
}



function makeChoreElements(chore, index) {
  var cb_ele = document.createElement('input');
  cb_ele.setAttribute('type', 'checkbox');
  cb_ele.setAttribute('id', 'chore' + index);
  cb_ele.setAttribute('name', 'chore' + index);
  cb_ele.setAttribute('onclick', `updateChores(${index})`);

  var label_ele = document.createElement('label');
  label_ele.setAttribute('for', 'chore' + index);
  label_ele.setAttribute('id', 'chorelabel' + index);
  label_ele.innerHTML = chore.name;

  return {checkbox: cb_ele, label: label_ele};
}


function renderChores() {
  for (i in ChoreList) {
    const eles = makeChoreElements(ChoreList[i], i);
    const space = document.createElement('br');

    let parent = null;
    switch (ChoreList[i].freq) {
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
    if (ChoreList[i].overdue)
      parent = document.getElementById("overdue-chores");

    parent.appendChild(eles.checkbox);
    parent.appendChild(eles.label);
    parent.appendChild(space);
  }
  updateDisplay();
}


function updateDisplay() {
  console.log("updateDisplay()");
  console.log("choreList = ", ChoreList);
  for (i in ChoreList) {
    let checkbox = document.getElementById('chore' + i);
    checkbox.checked = ChoreList[i].completed;
    let label = document.getElementById('chorelabel' + i);
    const newStyle = ChoreList[i].completed ? "line-through" : "none";
    label.style.textDecoration = newStyle;
  }

  // Hide headers for empty divs
  for (let category of ["overdue", "daily", "weekly", "monthly"]) {
    if (document.getElementById(category+"-chores").children.length == 0)
      document.getElementById(category+"-header").remove();
  }
}


function updateChores(choreNum) {
  const choreComp = document.getElementById('chore' + choreNum).checked;
  const event = choreComp ? "chore-complete" : "chore-uncomplete";
  socket.emit(event, ChoreList[choreNum].name);
}
