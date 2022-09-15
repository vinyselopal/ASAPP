const SERVER_URL = 'http://localhost:3000/todos'
// edit to return empty array if returned result = null after all fetch calls
async function updateTodos (str) {
  return await fetch(`${SERVER_URL}`, {
    method: 'POST',
    body: str,
    headers: {
      'content-type': 'application/json'
    }
  })
}
async function getTodos () {
  return await (await fetch(`${SERVER_URL}`, { method: 'GET' })).json()
}
async function deleteAllTodos () {
  return await fetch(`${SERVER_URL}/clearDone`, { method: 'DELETE' })
}
async function countDone () {
  return await (await fetch(`${SERVER_URL}/countDone`, { method: 'GET' })).json()
}
async function updateTodo (id, str) {
  return await fetch(`${SERVER_URL}${id}`, { method: 'PUT', body: str, headers: { 'content-type': 'application/json' } })
}
async function deleteTodo (id) {
  return await fetch(`${SERVER_URL}${id}`, { method: 'DELETE' })
}
async function postTodo (str) {
  return await fetch(`${SERVER_URL}`, {
    method: 'POST',
    body: str,
    headers: {
      'content-type': 'application/json'
    }
  })
}
export default { updateTodos, getTodos, deleteAllTodos, countDone, updateTodo, deleteTodo, postTodo }
