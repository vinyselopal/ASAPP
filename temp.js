const e = require('express')

const task = document.querySelector('#task')
const listContainer = document.body.querySelector('ul')
const addTask = document.querySelector('#addTask')
function createTodoComponent () {
  const element = document.createElement('li')
  listContainer.appendChild(element)
  return element
}

function createTodoPriorityElm (todoPriorities, updateTodoItemPriority, selected) {
  const TodoPriorityElm = document.createElement('select')
  TodoPriorityElm.classList.add('priority')

  todoPriorities.map((priority) => {
    const elm = document.createElement('option')
    elm.value = priority
    elm.textContent = priority

    return elm
  }).forEach((elm) => {
    TodoPriorityElm.appendChild(elm)
  })

  TodoPriorityElm.addEventListener('change', updateTodoItemPriority)

  if (selected) {
    TodoPriorityElm.selectedIndex = selected
  }

  return TodoPriorityElm
}

function createTodoNotesElm (notesPassed, onNotesChange) {
  const notesElm = document.createElement('textarea')
  if (notesPassed) {
    notesElm.value = notesPassed
  }
  notesElm.classList.add('notes')
  // addeventlistener to notes
  notesElm.addEventListener('input', onNotesChange)
  notesElm.spellCheck = false
  return notesElm
}

function createTodoDateElm (datePassed, onChange) {
  const date = document.createElement('input')
  date.setAttribute('type', 'date')
  if (datePassed) {
    date.value = datePassed
  }
  date.classList.add('date')
  // addeventlistener to date
  date.addEventListener('change', onChange)

  return date
}

function createTodoItemDeleteElm (onClick) {
  const deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.value = 'delete'
  deleteButton.classList.add('delete')
  deleteButton.addEventListener('click', onClick)

  return deleteButton
}

function createHiddenTodoComponent (selected, notesPassed, datePassed, listItem) {
  // creating invisible part of the listItem
  const invisible = document.createElement('div')
  invisible.classList.add('invisible')
  invisible.style.display = 'none'
  listItem.appendChild(invisible)

  // create and append left and right panes of invisible
  const left = document.createElement('div')
  left.classList.add('left')
  invisible.appendChild(left)

  const right = document.createElement('div')
  right.classList.add('right')
  invisible.appendChild(right)

  // create and append notes to left
  const notes = createTodoNotesElm(notesPassed, (e) => { fetch(`localhost:3000/todos/:${listItem.dataset.id}`, { method: 'PUT', body: JSON.stringify({ notes: e.target.value }) }) })

  //     (e) => {
  //     const filtered4 = getFromLocalStorage('todoItems').map(a => { // UPDATE
  //       if (a.id === listItem.dataset.id) {
  //         a.notes = e.target.value
  //       }
  //       return a
  //     })
  //     saveToLocalStorage('todoItems', filtered4)
  //   })
  left.appendChild(notes)

  // create and append date, select, and delete button to right
  const date = createTodoDateElm(datePassed, (e) => { fetch(`localhost:3000/todos/:${listItem.dataset.id}`, { method: 'PUT', body: JSON.stringify({ date: e.target.value }) }) })

  //     (e) => {
  //     const filtered5 = getFromLocalStorage('todoItems').map(a => { // UPDATE
  //       if (a.id === listItem.dataset.id) {
  //         a.date = e.target.value
  //       }
  //       return a
  //     })
  //     saveToLocalStorage('todoItems', filtered5)
  //   })
  right.appendChild(date)

  function updateTodoItemPriority (event) {
    if (!isNaN(event.target.selectedIndex)) {
      fetch(`localhost:3000/todos/:${listItem.dataset.id}`, { method: 'PUT', body: JSON.stringify({ priority: event.target.value }) })

    //   const filtered3 = getFromLocalStorage('todoItems').map(a => { // UPDATE todoitems SET priority = selectedIndex WHERE id.....
    //     if (a.id === listItem.dataset.id) {
    //       a.selected = event.target.selectedIndex
    //     }
    //     return a
    //   })
    //   saveToLocalStorage('todoItems', filtered3)
    }
  }
  const TodoPriorityElm = createTodoPriorityElm(['low', 'medium', 'high'], updateTodoItemPriority, selected)
  right.appendChild(TodoPriorityElm)

  const deleteButton = createTodoItemDeleteElm((event) => {
    fetch(`localhost:3000/todos/:${listItem.dataset.id}`, { method: 'DELETE' })
    // const filtered = getFromLocalStorage('todoItems').filter(a => a.id !== listItem.dataset.id) // DELETE FROM todoitems WHERE id = listITEM.Dataset.id;
    // saveToLocalStorage('todoItems', filtered)
    listItem.remove()
  })
  right.appendChild(deleteButton) // delete button appended

  return invisible
}

function createVisibleTodoComponent (data1, done, listItem, invisible) {
  const visible = document.createElement('div')
  listItem.insertBefore(visible, invisible)
  visible.classList.add('visible')

  // creating and appending child elements to visible

  // creating p element and textbox inside
  const p = document.createElement('p')
  const savedTextarea = p.appendChild(document.createElement('input'))

  savedTextarea.value = data1
  savedTextarea.className = 'savedTextarea'
  savedTextarea.spellcheck = false
  p.classList.add('savedTask')

  // checkbox created
  const checkbox = document.createElement('input')
  // set checkbox properties
  checkbox.type = 'checkbox'
  checkbox.classList.add('strike')
  if (done) {
    checkbox.checked = done
    savedTextarea.classList.add('taskCompletion')
  }

  // collapsible button

  const collapse = document.createElement('input')
  collapse.type = 'button'
  collapse.classList.add('collapse')
  collapse.value = 'v'

  visible.appendChild(p)
  visible.appendChild(checkbox)
  visible.appendChild(collapse)

  // checkbox event listener
  checkbox.addEventListener('change', (event) => {
    if (checkbox.checked === true) {
      savedTextarea.classList.add('taskCompletion')
    } else {
      savedTextarea.classList.remove('taskCompletion')
    }
    fetch(`localhost:3000/todos/:${listItem.dataset.id}`, { method: 'PUT', body: JSON.stringify({ done: event.target.checked }) })

    // const filtered2 = getFromLocalStorage('todoItems').map(a => { // updating checked column of a row // UPDATE todoitems SET done = x WHERE id = listItem.dataset.id;
    //   if (a.id === listItem.dataset.id) {
    //     a.done = checkbox.checked
    //   }
    //   return a
    // })
    // saveToLocalStorage('todoItems', filtered2)
    toggleDoneTodoFooter()
  })

  // collapse button event listener
  collapse.addEventListener('click', (e) => {
    const parent = collapse.parentElement.parentElement
    const toCollapse = parent.querySelector('.invisible')
    if (toCollapse.style.display === 'flex') {
      toCollapse.style.display = 'none'
      collapse.value = 'v'
    } else {
      const openDropDown = document.getElementsByClassName('invisible')
      for (let i = 0; i < openDropDown.length; i++) {
        if (openDropDown[i].style.display === 'flex') {
          openDropDown[i].style.display = 'none'
        }
      }
      toCollapse.style.display = 'flex'
      collapse.value = '^'
    }
  })
}
// buildElement called inside buildContainer
function buildElement (data1, id, done, selected, notesPassed, datePassed) {
  const listItem = createTodoComponent()
  listItem.dataset.id = id
  const invisible = createHiddenTodoComponent(selected, notesPassed, datePassed, listItem)
  createVisibleTodoComponent(data1, done, listItem, invisible)
}

// buildContainer called from buttonClick as callback for event listener on add button
function buildContainer () {
  // condition for what to pass as id to build container
  // and also to increment local storage counter
  const uniqueId = getFromLocalStorage('counter') // unique id got from serial primary key after saving todo to database //start from here
  if (uniqueId) {
    buildElement(task.value, uniqueId)
    saveToLocalStorage('counter', uniqueId + 1)
  } else {
    buildElement(task.value, 0)
    saveToLocalStorage('counter', 1)
  }
  const listItem2 = listContainer.lastChild
  pushTodoToLocalStorage(listItem2)
}

// push todo to local storage
function pushTodoToLocalStorage (todo) {
  fetch(`localhost:3000/todos/:${todo.dataset.id}`, {
    method: 'POST',
    body: JSON.stringify({
      id: todo.dataset.id,
      content: task.value,
      done: false,
      selected: null,
      notes: null,
      date: null
    })
  })

//   const arr = getFromLocalStorage('todoItems') // SELECT * FROM todoitems
//   const obj = {
//     id: todo.dataset.id,
//     content: task.value,
//     done: false,
//     selected: null,
//     notes: null,
//     date: null
//   }
//   if (!arr) {
//     saveToLocalStorage('todoItems', []) // CREATE TABLE IF NOT EXISTS todoitems(id SERIAL PRIMARY KEY, content text, done boolean, selected int, notes text, date date);
//   }
//   arr.push(obj)
//   saveToLocalStorage('todoItems', arr)
}

// save to Local Storage
function saveToLocalStorage (localStorageKey, value) {
  localStorage.setItem(localStorageKey, JSON.stringify(value))
}

// retrive from Local Storage
function getFromLocalStorage (localStorageKey) {
  return JSON.parse(localStorage.getItem(localStorageKey))
}

// callback function for addTask bar, calls buildContainer
function buttonClick (e) {
  if (e.target.value && e.keyCode === 13) {
    buildContainer()
    e.target.value = ''
  }
}

// on first run, rendering list elements stored in local storage
function renderTodo () {
  makeFooter()
  toggleDoneTodoFooter()
  addTask.addEventListener('keypress', buttonClick)
  if (!getFromLocalStorage('todoItems')) {
    const arrTemp = []
    saveToLocalStorage('todoItems', arrTemp)
  } else {
    const getTodoItems = fetch('localhost:3000/todos', { method: 'GET' }) // Work on res.body u get including whole table in form of json
    // getFromLocalStorage('todoItems')

    // getTodoItems.forEach(a => {
    //   buildElement(a.content, a.id, a.done, a.selected, a.notes, a.date)
    // })
  }
}

function countDone () {
  fetch('localhost:3000/todos/countDone', { method: 'GET' })
//   const arr = getFromLocalStorage('todoItems') // SELECT COUNT (*)  FROM todoitems WHERE done = 1;
//   if (arr.filter(a => a.done).length) {
//     return 1
//   } else return 0
}

function toggleDoneTodoFooter () {
  const getButton = document.querySelector('.clearDone')
  if (countDone()) getButton.style.visibility = 'visible'
  else getButton.style.visibility = 'hidden'
}

function createClearAll (footer) {
  const clearAll = document.createElement('input')
  clearAll.type = 'button'
  clearAll.value = 'Clear All'
  clearAll.addEventListener('click', clearAllEventListener)
  footer.appendChild(clearAll)
  clearAll.classList.add('clearAll')
}

function clearAllEventListener () {
  fetch('localhost:3000/todos', { method: 'DELETE' })
//   saveToLocalStorage('todoItems', []) // DELETE FROM todoitems;
//   while (document.querySelector('li')) {
//     document.querySelector('li').remove()
//   }
}
function createClearDone (footer) {
  const clearDone = document.createElement('input')
  clearDone.type = 'button'
  clearDone.value = 'Clear Done'
  clearDone.addEventListener('click', clearDoneEventListener)
  footer.appendChild(clearDone)
  clearDone.classList.add('clearDone')
}

function clearDoneEventListener () {
  fetch('localhost:3000/todos/clearDone', { method: 'DELETE' })
  //   const arr1 = getFromLocalStorage('todoItems').filter(a => !a.done) // DELETE FROM todoitems WHERE done = 1
  //   saveToLocalStorage('todoItems', arr1)
  //   while (document.querySelector('.taskCompletion')) {
  //     document.querySelector('.taskCompletion').parentElement.parentElement.remove()
  //   }
  toggleDoneTodoFooter()
}

function makeFooter () {
  const footer = document.createElement('footer')
  const div = document.createElement('div')
  footer.appendChild(div)
  div.classList.add('footerDiv')
  footer.classList.add('.footer')
  document.body.appendChild(footer)
  createClearDone(div)
  createClearAll(div)
}
function main () {
  renderTodo()
}

main()

// fix checkbox and delete error
