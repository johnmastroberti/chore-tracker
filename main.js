chores = ["Clean the counters", "Do the dishes", "Take out the trash"];

is_chore_completed = [false, false, false];

function createChores() {
  var i = 0;
  for (c in chores) {
    var ele = document.createElement('input');
    ele.setAttribute('type', 'checkbox');
    ele.setAttribute('id', 'chore' + i.toString());
    ele.setAttribute('name', 'chore' + i.toString());
    ele.setAttribute('onclick', 'updateChores()');

    var label = document.createElement('label');
    label.setAttribute('for', 'chore' + i.toString());
    label.setAttribute('id', 'chorelabel' + i.toString());
    label.innerHTML = chores[c];

    var space = document.createElement('br');

    document.body.appendChild(ele);
    document.body.appendChild(label);
    document.body.appendChild(space);
    i++;
  }
}

function updateChores() {
  for (i in chores) {
    is_chore_completed[i] = document.getElementById('chore' + i.toString()).checked;
    var label = document.getElementById('chorelabel' + i.toString());
    label.style.textDecoration = is_chore_completed[i] ? "line-through" : "none";
  }
  console.log("Chore completion status:")

  for (i in chores)
    console.log(chores[i] + " : " + is_chore_completed[i])


}
