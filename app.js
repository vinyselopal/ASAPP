
const task = document.querySelector('#task')
let data = task.value
const add = document.querySelector('#add')
const list = []

function buildContainer (data) {
  const selectContainer = document.body.querySelector('ul')

  // create li
  const listItem = document.createElement('li')
  selectContainer.appendChild(listItem)

  const text = document.createTextNode(data)
  const checkbox = document.createElement('input')

  checkbox.type = 'button'
  listItem.appendChild(text)
  listItem.appendChild(checkbox)
  checkbox.addEventListener('click', (e) => {
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
