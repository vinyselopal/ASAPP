const task = document.querySelector('#task')
//let data = task.value

// on first run, creating list elements stored in local storage
if (!localStorage.getItem('todoItems')) {
  const arrTemp = []
  const serial = JSON.stringify(arrTemp)
  localStorage.setItem('todoItems', serial)
} else {
  const getTodoItems = JSON.parse(localStorage.getItem('todoItems'))
  getTodoItems.forEach(a => {
    const listItem = document.querySelector('ul').lastChild
    buildElements(a.content, a.id, a.done)
  })
}

//buildElements called inside buildContainer
function buildElements (data1, id, done) {
  const selectContainer = document.body.querySelector('ul')

  const listItem = document.createElement('li')
  
  selectContainer.appendChild(listItem)

  const p = document.createElement('p')
  const savedTextarea = p.appendChild(document.createElement('input'))

  savedTextarea.value = data1
  savedTextarea.className = 'savedTextarea'
  savedTextarea.spellcheck = false
  p.classList.add('savedTask')

  const deleteButton = document.createElement('input')

  const checkbox = document.createElement('input')


  checkbox.type = 'checkbox'
  if (done) {
    checkbox.checked = done
    savedTextarea.classList.add('taskCompletion')
  }
  checkbox.classList.add('strike')

  deleteButton.type = 'button'
  deleteButton.value = 'delete'
  deleteButton.classList.add('delete')

  listItem.appendChild(p)
  listItem.appendChild(checkbox)
  listItem.appendChild(deleteButton)

  listItem.dataset.id = id

  
    //checkbox event listener
    checkbox.addEventListener('change', () => {
      if (checkbox.checked === true) {
        savedTextarea.classList.add('taskCompletion')
      } else {
        savedTextarea.classList.remove('taskCompletion')
      }
      console.log(checkbox.checked)
      let filtered2 = JSON.parse(localStorage.getItem('todoItems')).map(a => {
        if (a.id === listItem.dataset.id) {
          a.done = checkbox.checked
        }
        return a
      })
      console.log(filtered2)
      localStorage.setItem('todoItems', JSON.stringify(filtered2))
    })
  
    //delete-button event listener
    deleteButton.addEventListener('click', () => {
      const filtered = JSON.parse(localStorage.getItem('todoItems')).filter(a => a.id !== listItem.dataset.id)
      localStorage.setItem('todoItems', JSON.stringify(filtered))
      listItem.remove()
    })
}

//buildContainer called from buttonClick as callback for event listener on add button
function buildContainer () {
  
  //condition for what to pass as id to build container
  //and also to increment local storage counter 
  let uniqueId = Number.parseInt(localStorage.getItem('counter')) 
  if (uniqueId){
    buildElements(task.value, uniqueId)
    localStorage.setItem('counter', (uniqueId + 1).toString(10))
  } else {
    localStorage.setItem('counter', 1)
    buildElements(task.value, 0)
  }
  const listItem2 = document.querySelector('ul').lastChild

  //store newly created listItem in local storage
  const arr = JSON.parse(localStorage.getItem('todoItems'))
  const obj = {
    id: listItem2.dataset.id,
    content: task.value,
    done: false
  }
  console.log(obj)
  arr.push(obj)
  localStorage.setItem('todoItems', JSON.stringify(arr))

}

// callback function for add, calls buildContainer 
function buttonClick (e) {
  if (e.target.value && e.keyCode == 13) {
    buildContainer()
    e.target.value = ''
  }
}

//add event listeners to DOM elements, add and task, on initiation
// task.addEventListener('input', () => {
//   data = task.value
// })
const addTask = document.querySelector('#addTask')
addTask.addEventListener('keypress', buttonClick)