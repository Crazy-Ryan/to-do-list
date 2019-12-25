
var storage = window.localStorage;

var totalTaskCount;
var validTaskCount;
var activeTaskCount;
var completedTaskCount;
var taskListEl = document.getElementsByClassName('task-list')[0];
var deleteIcon;
var currentFilter = 'all';

initializeCount();
displayTasks('all');
initializeDeleteIcon();

function onInterfaceClick(event) {
  var clickId = event.target.getAttribute('id')
    || event.target.parentElement.getAttribute('id');
  switch (clickId) {
    case 'add':
      addTask();
      break;
    case 'all':
    case 'active':
    case 'complete':
      onClickFilter(clickId);
      break;
    case 'delete-icon':
      deleteTask(event.target);
      break;
    case null:
      break;
    default:
      onClickCheckboxHandle(clickId);
  }
  console.log(clickId);
}

function onKeyDown(event) {
  if ('Enter' === event.key) {
    event.preventDefault();
    addTask();
  }
}

function initializeCount() {
  retriveCountFromStorage();
  if (null === totalTaskCount) {
    storage.clear();
    totalTaskCount = 0;
    validTaskCount = 0;
    activeTaskCount = 0;
    completedTaskCount = 0;
    writeCountToStorage();
  }
}

function displayTasks(filter) {
  for (var index = 1; index <= totalTaskCount; index++) {
    var taskContent;
    var activeId = addActiveToTaskId(index);
    var completeId = addCompleteToTaskId(index);
    if (('all' === filter) || ('active' === filter)) {
      if (taskContent = storage.getItem(activeId)) {
        addTaskToPage(activeId, taskContent);
      }
    }
    if (('all' === filter) || ('complete' === filter)) {
      if (taskContent = storage.getItem(completeId)) {
        addTaskToPage(completeId, taskContent);
        var taskEl = document.getElementById(completeId);
        taskEl.style.textDecoration = 'line-through';
        taskEl.style.color = 'gray';
        taskEl.firstChild.checked = true;
      }
    }
  }
}

function retriveCountFromStorage() {
  totalTaskCount = storage.getItem('total-task-count');
  validTaskCount = storage.getItem('valid-task-count');
  activeTaskCount = storage.getItem('active-task-count');
  completedTaskCount = storage.getItem('completed-task-count');
}

function writeCountToStorage() {
  storage.setItem('total-task-count', totalTaskCount);
  storage.setItem('valid-task-count', validTaskCount);
  storage.setItem('active-task-count', activeTaskCount);
  storage.setItem('completed-task-count', completedTaskCount);
}

function addTask() {
  var taskAdded = document.getElementsByClassName('input-textbox')[0];
  var taskText;
  if (taskText = taskAdded.value) {
    var newTaskId;
    taskAdded.value = null;
    newTaskCount();
    newTaskId = addActiveToTaskId(totalTaskCount);
    writeCountToStorage();
    storage.setItem(newTaskId, taskText);
    if (!('complete' === currentFilter)) {
      addTaskToPage(newTaskId, taskText);
    }
  }
}

function addTaskToPage(taskId, content) {
  var newTask = document.createElement('li');
  var newCheckBox = document.createElement('input');
  var newTaskTitle = document.createElement('span');

  newCheckBox.setAttribute('type', 'checkbox');
  newTaskTitle.textContent = content;
  newTask.appendChild(newCheckBox);
  newTask.appendChild(newTaskTitle);
  newTask.setAttribute('id', taskId);
  taskListEl.appendChild(newTask);
}

function removeAllTasksFromPage() {
  while (taskListEl.firstChild) {
    taskListEl.removeChild(taskListEl.firstChild);
  }
}

function newTaskCount() {
  totalTaskCount++;
  validTaskCount++;
  activeTaskCount++;
}

function onClickFilter(newFilter) {
  if (currentFilter === newFilter) {
    return;
  }
  else {
    currentFilter = newFilter;
    removeAllTasksFromPage();
    switch (newFilter) {
      case 'all':
        displayTasks('all');
        break;
      case 'active':
        displayTasks('active');
        break;
      case 'complete':
        displayTasks('complete');
        break;
    }
  }
}

function onClickCheckboxHandle(oldTaskId) {
  newTaskId = toggleTaskId(oldTaskId);
  toggleTaskInStorage(oldTaskId, newTaskId);
  toggleTaskDisplayed(oldTaskId, newTaskId);
}

function toggleTaskId(taskId) {
  var taskNum = extractNumFromTaskId(taskId);
  var taskStatus = extractStatusFromTaskId(taskId);
  if ('active' === taskStatus) {
    return addCompleteToTaskId(taskNum);
  }
  else {
    return addActiveToTaskId(taskNum);
  }
}

function toggleTaskInStorage(oldId, newId) {
  storage.setItem(newId, storage.getItem(oldId));
  storage.removeItem(oldId);
}

function toggleTaskDisplayed(oldTaskId, newTaskId) {
  var clickedTask = document.getElementById(oldTaskId);
  var status = extractStatusFromTaskId(oldTaskId);
  clickedTask.setAttribute('id', newTaskId);
  if ('active' === status) {
    clickedTask.style.textDecoration = 'line-through';
    clickedTask.style.color = 'gray';
    clickedTask.firstChild.checked = true;
  }
  else {
    clickedTask.style.textDecoration = 'none';
    clickedTask.style.color = 'black';
    clickedTask.firstChild.checked = false;
  }
}

function extractNumFromTaskId(idStr) {
  return idStr.split(' ')[0];
}

function extractStatusFromTaskId(idStr) {
  return idStr.split(' ')[1];
}

function addActiveToTaskId(idStr) {
  return idStr + ' ' + 'active'
}

function addCompleteToTaskId(idStr) {
  return idStr + ' ' + 'complete'
}

function initializeDeleteIcon() {
  deleteIcon = document.createElement('div');
  deleteIcon.setAttribute('class', 'delete-icon');
  deleteIcon.setAttribute('id', 'delete-icon');
  deleteIcon.textContent = '×';
}

function onMouseoverTask(event) {
  if (deleteIcon !== event.target) {
    event.target.appendChild(deleteIcon);
    // console.log(event);
  }
}

function onMouseleaveTask(event) {
  if (deleteIcon.parentElement) {
    deleteIcon.parentElement.removeChild(deleteIcon);
  }
}

function deleteTask(target) {
  var taskId = target.parentElement.getAttribute('id');
  target.parentElement.parentElement.removeChild(target.parentElement);
  storage.removeItem(taskId);
}