renderTodo()

// on first run, rendering list elements stored in local storage
async function renderTodo () {
  makeFooter()
  await toggleDoneTodoFooter()
  const addTodoBar = document.querySelector('#addTodoBar')
  addTodoBar.addEventListener('keypress', addTaskAction)
  // if (!getFromLocalStorage('todoItems')) {
  //   saveToLocalStorage('todoItems', []) // make TABLE
  // } else {
  const getTodoItems = await (await fetch('http://localhost:3000/todos', { method: 'GET' })).json()
  // getFromLocalStorage('todoItems')
  console.log(getTodoItems)
  getTodoItems.forEach(a => {
    buildElements(a.todocontent, a.id, a.donestatus, a.selectedpriority, a.notes, a.date)
  })
  // }
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
  fetch('http://localhost:3000/todos/clearDone', { method: 'DELETE' })
  // const arr1 = getFromLocalStorage('todoItems').filter(a => !a.doneStatus) // DELETE FROM todoitems WHERE doneStatus = 1
  // saveToLocalStorage('todoItems', arr1)
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
  fetch('http://localhost:3000/todos', { method: 'DELETE' })

  // saveToLocalStorage('todoItems', []) // DELETE FROM todoitems;
  while (document.querySelector('li')) {
    document.querySelector('li').remove()
  }
}
async function toggleDoneTodoFooter () {
  const clearDone = document.querySelector('.clearDone')
  const condition = await countDone()

  console.log(condition)
  if (condition) {
    clearDone.style.visibility = 'visible'
  } else {
    console.log('hi')
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
// // retrive from Local Storage
// function getFromLocalStorage (key) {
//   return JSON.parse(localStorage.getItem(key))
// }
// // save to Local Storage
// function saveToLocalStorage (key, value) {
//   localStorage.setItem(key, JSON.stringify(value))
// }
async function countDone () {
  const result = (await (await fetch('http://localhost:3000/todos/countDone', { method: 'GET' })).json())
  console.log('result', result.numberOfDoneTasks)
  if (result.numberOfDoneTasks > 0) return 1
  else return 0
  // const arr = getFromLocalStorage('todoItems')
  // if (arr.filter(a => a.doneStatus).length)
  //   return 1
  // } else return 0
}
// buildContainer called from addTaskAction as callback for event listener on add button
function buildContainer () {
  // condition for what to pass as id to build container
  // and also to increment local storage counter
  // const uniqueId = getFromLocalStorage('counter') // no unique id needed
  const typeTodo = document.querySelector('#typeTodo')
  const id = pushTodoToDatabase(typeTodo)
  buildElements(typeTodo.value, id)

  // if (uniqueId) {
  //   buildElements(typeTodo.value, uniqueId)
  //   saveToLocalStorage('counter', uniqueId + 1)
  // } else {
  //   buildElements(typeTodo.value, 0)
  //   saveToLocalStorage('counter', 1)
  // }
}
// buildElements called inside buildContainer
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
    notes.addEventListener('input', (event) => {
      const str = JSON.stringify({ notes: event.target.value })
      fetch(`http://localhost:3000/todos/${todo.dataset.id}`, { method: 'PUT', body: str, headers: { 'content-type': 'application/json' } })

      // const updatesNotes = getFromLocalStorage('todoItems').map(a => { // UPDATE
      //   if (a.id === todo.dataset.id) {
      //     a.notes = event.target.value
      //   }
      //   return a
      // })
      // saveToLocalStorage('todoItems', updatesNotes)
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
      console.log(event.target.selectedIndex)
      const str = JSON.stringify({ selectedPriority: event.target.selectedIndex })
      await fetch(`http://localhost:3000/todos/${todo.dataset.id}`, { method: 'PUT', body: str, headers: { 'content-type': 'application/json' } })
    }
  }

  // make and append priority to rightHidden
  const TodoPriorityElm = makeTodoPriorityElm(['low', 'medium', 'high'], priorityElmEventListener, selectedPriority)
  rightHidden.appendChild(TodoPriorityElm)

  // delete event listener
  async function deleteElmEventListener () {
    await fetch(`http://localhost:3000/todos/${todo.dataset.id}`, { method: 'DELETE' })
    // const filtered = getFromLocalStorage('todoItems').filter(a => a.id !== todo.dataset.id) // DELETE FROM todoitems WHERE id = todo.Dataset.id;
    // saveToLocalStorage('todoItems', filtered)
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
    console.log(event.target.value)
    await fetch(`http://localhost:3000/todos/${todo.dataset.id}`, { method: 'PUT', body: str, headers: { 'content-type': 'application/json' } })
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
    console.log(str)
    await (await fetch(`http://localhost:3000/todos/${todo.dataset.id}`, { method: 'PUT', body: str, headers: { 'content-type': 'application/json' } }))
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
// push todo to local storage
async function pushTodoToDatabase (typeTodo) {
  const obj = {
    todoContent: typeTodo.value,
    doneStatus: false,
    selectedPriority: null,
    notes: null,
    date: null
  }
  const str = JSON.stringify(obj)
  const id = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    body: str,
    headers: {
      'content-type': 'application/json'
    }
  })
  console.log(id, 'the fucking result')
  return id
  // const arr = getFromLocalStorage('todoItems') // SELECT * FROM todoitems
  // const typeTodo = document.querySelector('#typeTodo')
  // const obj = {
  //   id: todo.dataset.id,
  //   content: typeTodo.value,
  //   doneStatus: false,
  //   selectedPriority: null,
  //   notes: null,
  //   date: null
  // }
  // if (!arr) {
  //   saveToLocalStorage('todoItems', []) // make TABLE IF NOT EXISTS todoitems(id SERIAL PRIMARY KEY, content text, doneStatus boolean, selectedPriority int, notes text, date date);
  // }
  // arr.push(obj)
  // saveToLocalStorage('todoItems', arr)
}
