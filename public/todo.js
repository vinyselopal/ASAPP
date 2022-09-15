import DB from './src/DB.js'
const SERVER_URL = 'http://localhost:3000/todos'
renderTodo()
// on first run, rendering list elements stored in local storage
async function renderTodo () {
  makeFooter()
  await toggleDoneTodoFooter()
  const addTodoBar = document.querySelector('#addTodoBar')
  addTodoBar.addEventListener('keypress', addTaskAction)

  const getTodoItems = await DB.getTodos()
  getTodoItems.forEach(a => {
    buildElements(a.todocontent, a.id, a.donestatus, a.selectedpriority, a.notes, a.date)
  })
}
function makeFooter () {
  const footer = document.createElement('footer')
  const div = document.createElement('div')
  footer.appendChild(div)
  div.classList.add('footerDiv')
  footer.classList.add('.footer')
  document.body.appendChild(footer)
  makeClearDoneButton(div)
  makeClearAllButton(div)
}
function makeClearDoneButton (footer) {
  const clearDone = document.createElement('input')
  clearDone.type = 'button'
  clearDone.value = 'Clear Done'
  clearDone.addEventListener('click', clearDoneEventListener)
  footer.appendChild(clearDone)
  clearDone.classList.add('clearDone')
}
function clearDoneEventListener () {
  fetch(`${SERVER_URL}/clearDone`, { method: 'DELETE' })

  while (document.querySelector('.taskCompletion')) {
    document.querySelector('.taskCompletion').parentElement.parentElement.remove()
  }
  toggleDoneTodoFooter()
}
function makeClearAllButton (footer) {
  const clearAll = document.createElement('input')
  clearAll.type = 'button'
  clearAll.value = 'Clear All'
  clearAll.addEventListener('click', clearAllEventListener)
  footer.appendChild(clearAll)
  clearAll.classList.add('clearAll')
}
function clearAllEventListener () {
  fetch(`${SERVER_URL}`, { method: 'DELETE' })

  while (document.querySelector('li')) {
    document.querySelector('li').remove()
  }
}
async function toggleDoneTodoFooter () {
  const clearDone = document.querySelector('.clearDone')
  const condition = await countDone()

  if (condition) {
    clearDone.style.visibility = 'visible'
  } else {
    clearDone.style.visibility = 'hidden'
  }
}
// callback function for addTodoBar bar, calls buildContainer
function addTaskAction (e) {
  if (e.target.value && e.keyCode === 13) {
    buildContainer()
    e.target.value = ''
  }
}

async function countDone () {
  const result = (await DB.countDone())
  if (result.numberOfDoneTasks > 0) return 1
  else return 0
}
function buildContainer () {
  const typeTodo = document.querySelector('#typeTodo')
  const id = pushTodoToDatabase(typeTodo)
  buildElements(typeTodo.value, id)
}
function buildElements (todoContent, id, doneStatus, selectedPriority, savedNotes, savedDate) {
  const todo = makeTodoComponent()
  todo.dataset.id = id
  const hiddenComponent = makeHiddenTodoComponent(selectedPriority, savedNotes, savedDate, todo)
  makeVisibleTodoComponent(todoContent, doneStatus, todo, hiddenComponent)
}
function makeTodoComponent () {
  const listContainer = document.body.querySelector('ul')
  const element = document.createElement('li')
  listContainer.appendChild(element)
  return element
}
function makeHiddenTodoComponent (selectedPriority, savedNotes, savedDate, todo) {
  // creating hidden part of the todo
  const hiddenComponent = document.createElement('div')
  hiddenComponent.classList.add('hidden')
  hiddenComponent.style.display = 'none'
  todo.appendChild(hiddenComponent)

  // make and append leftHidden and rightHidden panes of hidden
  const leftHidden = document.createElement('div')
  leftHidden.classList.add('leftHidden')
  hiddenComponent.appendChild(leftHidden)

  const rightHidden = document.createElement('div')
  rightHidden.classList.add('rightHidden')
  hiddenComponent.appendChild(rightHidden)

  // make and append notes to leftHidden
  const notes = makeTodoNotesElm(savedNotes)
  leftHidden.appendChild(notes)

  function makeTodoNotesElm (savedNotes) {
    const notes = document.createElement('textarea')
    if (savedNotes) {
      notes.value = savedNotes
    }
    notes.classList.add('notes')

    // addeventlistener to notes
    notes.addEventListener('input', async (event) => {
      const str = JSON.stringify({ notes: event.target.value })
      await DB.updateTodo(todo.dataset.id, str)
    })
    notes.spellCheck = false
    return notes
  }

  //  make and append date to rightHidden
  const date = makeTodoDateElm(savedDate, todo)
  rightHidden.appendChild(date)

  // priority event listener
  async function priorityElmEventListener (event) {
    if (!isNaN(event.target.selectedIndex)) {
      const str = JSON.stringify({ selectedPriority: event.target.selectedIndex })
      await DB.updateTodo(todo.dataset.id, str)
    }
  }

  // make and append priority to rightHidden
  const TodoPriorityElm = makeTodoPriorityElm(['low', 'medium', 'high'], priorityElmEventListener, selectedPriority)
  rightHidden.appendChild(TodoPriorityElm)

  // delete event listener
  async function deleteElmEventListener () {
    await DB.deleteTodo(todo.dataset.id)
    todo.remove()
  }
  const deleteButton = makeTodoItemDeleteElm(deleteElmEventListener)
  rightHidden.appendChild(deleteButton) // delete button appended

  return hiddenComponent
}
function makeTodoItemDeleteElm (onClick) {
  const deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.value = 'delete'
  deleteButton.classList.add('delete')
  deleteButton.addEventListener('click', onClick)

  return deleteButton
}
function makeTodoDateElm (savedDate, todo) {
  const date = document.createElement('input')
  date.setAttribute('type', 'date')
  if (savedDate) {
    date.value = savedDate
  }
  date.classList.add('date')

  // addeventlistener to date
  date.addEventListener('change', async (event) => {
    const str = JSON.stringify({ date: event.target.value })
    await DB.updateTodo(todo.dataset.id, str)
  })

  return date
}

function makeTodoPriorityElm (todoPriorities, priorityElmEventListener, selectedPriority) {
  const TodoPriorityElm = document.createElement('select')
  TodoPriorityElm.classList.add('priority')

  todoPriorities.map((priority) => {
    const option = document.createElement('option')
    option.value = priority
    option.textContent = priority

    return option
  }).forEach((option) => {
    TodoPriorityElm.appendChild(option)
  })

  TodoPriorityElm.addEventListener('change', priorityElmEventListener)
  if (selectedPriority) {
    TodoPriorityElm.selectedIndex = selectedPriority
  }

  return TodoPriorityElm
}
function makeVisibleTodoComponent (todoContent, doneStatus, todo, hiddenComponent) {
  // make visible component
  const visibleComponent = document.createElement('div')
  todo.insertBefore(visibleComponent, hiddenComponent)
  visibleComponent.classList.add('visible')

  // creating p element and textbox
  const p = document.createElement('p')
  const todoContentBar = p.appendChild(document.createElement('input'))

  todoContentBar.value = todoContent
  todoContentBar.className = 'todoContentBar'
  todoContentBar.spellcheck = false
  p.classList.add('savedTask')

  // checkbox made
  const checkbox = makeCheckboxElm(doneStatus, todoContentBar, todo)

  // collapsible button made
  makeCollapsibleButton(visibleComponent, checkbox, p)
}
function makeCheckboxElm (doneStatus, todoContentBar, todo) {
  const checkbox = document.createElement('input')
  // set checkbox properties
  checkbox.type = 'checkbox'
  checkbox.classList.add('strike')
  if (doneStatus) {
    checkbox.checked = doneStatus
    todoContentBar.classList.add('taskCompletion')
  } else checkbox.checked = false

  // checkbox event listener
  checkbox.addEventListener('change', async (event) => {
    if (checkbox.checked === true) {
      todoContentBar.classList.add('taskCompletion')
    } else {
      todoContentBar.classList.remove('taskCompletion')
    }
    const obj = { doneStatus: event.target.checked }
    const str = JSON.stringify(obj)
    await DB.updateTodo(todo.dataset.id, str)
    toggleDoneTodoFooter()
  })
  return checkbox
}
function makeCollapsibleButton (visibleComponent, checkbox, p) {
  const expandTodoButton = document.createElement('input')
  expandTodoButton.type = 'button'
  expandTodoButton.classList.add('expandTodoButton')
  expandTodoButton.value = 'v'

  visibleComponent.appendChild(p)
  visibleComponent.appendChild(checkbox)
  visibleComponent.appendChild(expandTodoButton)

  // expandTodoButton button event listener
  expandTodoButton.addEventListener('click', (e) => {
    const parent = expandTodoButton.parentElement.parentElement
    const hiddenComponent = parent.querySelector('.hidden')
    if (hiddenComponent.style.display === 'flex') {
      hiddenComponent.style.display = 'none'
      expandTodoButton.value = 'v'
    } else {
      const openDropDown = document.getElementsByClassName('hidden')
      for (let i = 0; i < openDropDown.length; i++) {
        if (openDropDown[i].style.display === 'flex') {
          openDropDown[i].style.display = 'none'
        }
      }
      hiddenComponent.style.display = 'flex'
      expandTodoButton.value = '^'
    }
  })
}
async function pushTodoToDatabase (typeTodo) {
  const obj = {
    todoContent: typeTodo.value,
    doneStatus: false,
    selectedPriority: null,
    notes: null,
    date: null
  }
  const str = JSON.stringify(obj)
  const id = await DB.postTodo(str)
  return id
}
