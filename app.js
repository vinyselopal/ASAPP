
const task = document.querySelector('#task')
let data = task.value
const add = document.querySelector('#add')
const list = []

function buildContainer (data) {
  const selectContainer = document.body.querySelector('ul')

  // create li
  const listItem = document.createElement('li')
  selectContainer.appendChild(listItem)

  const p = document.createElement('p')
  const savedTextarea = p.appendChild(document.createElement('textarea'))
  savedTextarea.value = data
  savedTextarea.spellcheck = false
  savedTextarea.className = 'savedTextarea'
  p.classList.add('savedTask')

  const deleteButton = document.createElement('input')

  const checkbox = document.createElement('input')

  checkbox.type = 'button'
  checkbox.value = 'strike'
  checkbox.classList.add('strike')

  deleteButton.type = 'button'
  deleteButton.value = 'delete'
  deleteButton.classList.add('delete')

  listItem.appendChild(p)
  listItem.appendChild(checkbox)
  listItem.appendChild(deleteButton)

  checkbox.addEventListener('click', () => {
    if (checkbox.value === 'strike') {
      savedTextarea.classList.add('taskCompletion')
      checkbox.value = 'unstrike'
    } else {
      savedTextarea.classList.remove('taskCompletion')
      checkbox.value = 'strike'
    }
  })

  deleteButton.addEventListener('click', () => {
    listItem.remove()
  })

  list.push(listItem)
}
function buttonClick () {
  if (task.value) {
    buildContainer(data)
    task.value = ''
  }
}
task.addEventListener('input', () => {
  data = task.value
})
add.addEventListener('click', buttonClick)
