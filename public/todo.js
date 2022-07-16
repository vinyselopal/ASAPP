const task = document.querySelector('#task')
const listContainer = document.body.querySelector('ul')
const addTask = document.querySelector('#addTask')

function createTodoComponent () {
  const element = document.createElement('li')
  listContainer.appendChild(element)
  return element
}

function createHiddenTodoComponent (data1, id, done, selected, notesPassed, datePassed, listItem) {
  // creating invisible part of the listItem
  const invisible = document.createElement('div')
  listItem.appendChild(invisible)
  invisible.classList.add('invisible')
  invisible.style.display = 'none'

  // creating and appending child elements to invisible

  // create and append left and right panes of invisible
  const left = document.createElement('div')
  left.classList.add('left')
  const right = document.createElement('div')
  right.classList.add('right')
  invisible.appendChild(left)
  invisible.appendChild(right)

  // create and append notes to left
  const notes = document.createElement('textarea')
  left.appendChild(notes)
  if (notesPassed) {
    notes.value = notesPassed
  }
  notes.classList.add('notes')

  // addeventlistener to notes
  notes.addEventListener('change', (e) => {
    const obj = JSON.parse(localStorage.getItem('todoItems'))
    obj.notes = e.target.value
    saveToLocalStorage('todoItems', obj)
  })

  // create and append date, select, and delete button to right
  const date = document.createElement('input')
  date.setAttribute('type', 'date')
  right.appendChild(date)
  if (datePassed) {
    date.value = datePassed
  }
  date.classList.add('date')

  // addeventlistener to date
  date.addEventListener('change', (e) => {
    const obj = getFromLocalStorage('todoItems')
    obj.date = e.target.value
    localStorage.setItem('todoItems', JSON.stringify(obj))
  })

  const priority = document.createElement('select')
  right.appendChild(priority)
  priority.classList.add('priority')
  if (selected) {
    priority.selectedIndex = selected
  }

  const low = document.createElement('option')
  priority.appendChild(low)
  low.value = 'low'
  low.textContent = 'low'

  const medium = document.createElement('option')
  priority.appendChild(medium)
  medium.value = 'medium'
  low.textContent = 'medium'

  const high = document.createElement('option')
  priority.appendChild(high)
  high.value = 'high'
  low.textContent = 'high'

  function onSelection (event) {
    if (event.target.selectedIndex) {
      const filtered3 = getFromLocalStorage('todoItems').map(a => {
        if (a.id === listItem.dataset.id) {
          a.selected = event.target.selectedIndex
        }
        return a
      })
      saveToLocalStorage('todoItems', filtered3)
    }
  }

  priority.addEventListener('change', onSelection)

  const deleteButton = document.createElement('input')
  deleteButton.type = 'button'
  deleteButton.value = 'delete'
  deleteButton.classList.add('delete')

  right.appendChild(deleteButton) // delete button appended

  deleteButton.addEventListener('click', () => {
    const filtered = getFromLocalStorage('todoItems').filter(a => a.id !== listItem.dataset.id)
    saveToLocalStorage('todoItems', filtered)
    listItem.remove()
  })
  return invisible
}

function createVisibleTodoComponent (data1, id, done, selected, notesPassed, datePassed, listItem, invisible) {
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
  visible.dataset.id = id

  // checkbox event listener
  checkbox.addEventListener('change', () => {
    if (checkbox.checked === true) {
      savedTextarea.classList.add('taskCompletion')
    } else {
      savedTextarea.classList.remove('taskCompletion')
    }

    console.log(checkbox.checked)
    const filtered2 = getFromLocalStorage('todoItems').map(a => {
      if (a.id === listItem.dataset.id) {
        a.done = checkbox.checked
      }
      return a
    })
    console.log(filtered2)
    saveToLocalStorage('todoItems', filtered2)
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
  const invisible = createHiddenTodoComponent(data1, id, done, selected, notesPassed, datePassed, listItem)
  createVisibleTodoComponent(data1, id, done, selected, notesPassed, datePassed, listItem, invisible)
}

// buildContainer called from buttonClick as callback for event listener on add button
function buildContainer () {
  // condition for what to pass as id to build container
  // and also to increment local storage counter
  const uniqueId = getFromLocalStorage('counter')
  if (uniqueId) {
    buildElement(task.value, uniqueId)
    saveToLocalStorage('counter', (uniqueId + 1).toString(10))
  } else {
    buildElement(task.value, 0)
    saveToLocalStorage('counter', 1)
  }
  const listItem2 = listContainer.lastChild
  pushTodoToLocalStorage(listItem2)
}

// push todo to local storage
function pushTodoToLocalStorage (todo) {
  const arr = getFromLocalStorage('todoItems')
  const obj = {
    id: todo.dataset.id,
    content: task.value,
    done: false,
    selected: null,
    notes: null,
    date: null // careful
  }
  arr.push(obj)
  saveToLocalStorage('todoItems', arr)
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
  if (!getFromLocalStorage('todoItems')) {
    const arrTemp = []
    saveToLocalStorage('todoItems', arrTemp)
  } else {
    const getTodoItems = getFromLocalStorage('todoItems')
    getTodoItems.forEach(a => {
      buildElement(a.content, a.id, a.done, a.selected, a.notes, a.date)
    })
  }
}

function makeTodo () {
  addTask.addEventListener('keypress', buttonClick)
  renderTodo()
}

makeTodo()
