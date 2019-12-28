var storage = window.localStorage;
var totalTaskCount;
var deleteIcon;
var taskToDeleteId;
var deletePopupEl = document.getElementsByClassName('delete-popup')[0];
var taskListEl = document.getElementsByClassName('task-list')[0];
const all = 'all';
const active = 'active';
const complete = 'complete';
var currentFilter = all;

initializeCount();
displayTasks(all);
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
      onClickDeleteIcon(event.target);
      break;
    case 'delete-btn':
      onClickDeleteBtn();
      break;
    case 'cancel':
      onClickCancel();
      break;
    case null:
      break;
    default:
      onClickCheckbox(clickId);
  }
}

function onKeyDown(event) {
  if ('Enter' === event.key) {
    event.preventDefault();
    addTask();
  }
}

function onMouseoverTask(event) {
  if (deleteIcon !== event.target) {
    event.target.appendChild(deleteIcon);
  }
}

function onMouseleaveTask() {
  if (deleteIcon.parentElement) {
    deleteIcon.parentElement.removeChild(deleteIcon);
  }
}

function initializeCount() {
  totalTaskCount = storage.getItem('total-task-count');
  if (null === totalTaskCount) {
    storage.clear();
    totalTaskCount = 0;
    storage.setItem('total-task-count', totalTaskCount);
  }
}

function addTask() {
  var taskAdded = document.getElementsByClassName('input-textbox')[0];
  var taskText = taskAdded.value;
  if (taskText) {
    var newTaskId;
    taskAdded.value = null;
    totalTaskCount++;
    newTaskId = addActiveToTaskId(totalTaskCount);
    storage.setItem('total-task-count', totalTaskCount);
    storage.setItem(newTaskId, taskText);
    if (!(complete === currentFilter)) {
      addTaskToPage(newTaskId, taskText);
    }
  }
}

function onClickFilter(newFilter) {
  setHighlightFilterBorder(newFilter);
  if (currentFilter === newFilter) {
    return;
  } else {
    currentFilter = newFilter;
    removeAllTasksFromPage();
    displayTasks(newFilter);
  }
}

function displayTasks(filter) {
  for (var index = 1; index <= totalTaskCount; index++) {
    var taskContent;
    var activeId = addActiveToTaskId(index);
    var completeId = addCompleteToTaskId(index);
    if ((all === filter) || (active === filter)) {
      if (taskContent = storage.getItem(activeId)) {
        addTaskToPage(activeId, taskContent);
      }
    }
    if ((all === filter) || (complete === filter)) {
      if (taskContent = storage.getItem(completeId)) {
        addTaskToPage(completeId, taskContent);
        setCompleteTaskStyle(completeId);
      }
    }
  }
}

function setHighlightFilterBorder(filter) {
  document.getElementById(all).style.borderColor = 'transparent';
  document.getElementById(active).style.borderColor = 'transparent';
  document.getElementById(complete).style.borderColor = 'transparent';
  document.getElementById(filter).style.borderColor = '#cccccc';
}

function onClickCheckbox(oldTaskId) {
  var newTaskId = toggleTaskId(oldTaskId);
  toggleTaskInStorage(oldTaskId, newTaskId);
  toggleTaskDisplayed(oldTaskId, newTaskId);
}

function onClickDeleteIcon(target) {
  deletePopupEl.style.display = "flex";
  taskToDeleteId = target.parentElement.getAttribute('id');
}

function onClickDeleteBtn() {
  deletePopupEl.style.display = "none";
  deleteTask(taskToDeleteId);
}
function onClickCancel() {
  deletePopupEl.style.display = "none";
}

function deleteTask(taskId) {
  taskListEl.removeChild(document.getElementById(taskId));
  storage.removeItem(taskId);
}

function initializeDeleteIcon() {
  deleteIcon = document.createElement('div');
  deleteIcon.setAttribute('class', 'delete-icon');
  deleteIcon.setAttribute('id', 'delete-icon');
  deleteIcon.textContent = '×';
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

function setCompleteTaskStyle(taskId) {
  var taskEl = document.getElementById(taskId);
  taskEl.style.textDecoration = 'line-through';
  taskEl.style.color = 'gray';
  taskEl.firstChild.checked = true;
}

function setActiveTaskStyle(taskId) {
  var taskEl = document.getElementById(taskId);
  taskEl.style.textDecoration = 'none';
  taskEl.style.color = 'black';
  taskEl.firstChild.checked = false;
}

function removeAllTasksFromPage() {
  while (taskListEl.firstChild) {
    taskListEl.removeChild(taskListEl.firstChild);
  }
}

function toggleTaskId(taskId) {
  var taskNum = extractNumFromTaskId(taskId);
  var taskStatus = extractStatusFromTaskId(taskId);
  if (active === taskStatus) {
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

function toggleTaskDisplayed(oldId, newId) {
  var clickedTask = document.getElementById(oldId);
  if (all === currentFilter) {
    clickedTask.setAttribute('id', newId);
    var status = extractStatusFromTaskId(oldId);
    if (active === status) {
      setCompleteTaskStyle(newId);
    }
    else {
      setActiveTaskStyle(newId);
    }
  }
  else {
    taskListEl.removeChild(clickedTask);
  }
}

function extractNumFromTaskId(idStr) {
  return idStr.split(' ')[0];
}

function extractStatusFromTaskId(idStr) {
  return idStr.split(' ')[1];
}

function addActiveToTaskId(idStr) {
  return idStr + ' ' + active;
}

function addCompleteToTaskId(idStr) {
  return idStr + ' ' + complete;
}