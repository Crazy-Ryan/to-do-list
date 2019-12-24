
var storage = window.localStorage;

var count = 0;

var totalTaskCount;
var validTaskCount;
var activeTaskCount;
var completedTaskCount;
var taskListEl = document.getElementsByClassName('task-list')[0];

initializeCount();
displayAllTasks();
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

function newTaskCount() {
  totalTaskCount++;
  validTaskCount++;
  activeTaskCount++;
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

function displayAllTasks() {
  for (var index = 1; index <= totalTaskCount; index++) {
    var taskContent = storage.getItem(index);
    addTaskToPage(taskContent);
  }
}

function onClickAdd() {
  addTask();
}

function onKeyDown(event) {
  if ('Enter' === event.key) {
    event.preventDefault();
    addTask();
  }
}

var taskAdded = document.getElementsByClassName('input-textbox')[0];
function addTask() {
  var taskText;
  if (taskText = taskAdded.value) {
    taskAdded.value = null;
    newTaskCount();
    writeCountToStorage();
    storage.setItem(totalTaskCount, taskText);
    addTaskToPage(taskText);
  }
}

function addTaskToPage(content) {
  var newTask = document.createElement('li');
  var newCheckBox = document.createElement('input');
  var newTaskTitle = document.createElement('span');

  newCheckBox.setAttribute('type', 'checkbox');
  newTaskTitle.textContent = content;
  newTask.appendChild(newCheckBox);
  newTask.appendChild(newTaskTitle);
  taskListEl.appendChild(newTask);
}

