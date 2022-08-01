const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'todoapp',
  password: 'abcd'
})
const findTodoItem = (id) => {
  return pool.query('SELECT * from todoitems WHERE id = $1', [id])
}
const deleteTodoItem = (id) => {
  return pool.query('DELETE FROM todoitems WHERE id = $1;', [id])
}
const deleteAllTodoItems = (id) => {
  return pool.query('DELETE FROM todoitems;')
}
const deleteDoneTodoItems = (id) => {
  return pool.query('DELETE FROM todoitems WHERE donestatus = true;')
}
const updateTodoItem = (parameter, parameterValue, id) => {
  return pool.query(`UPDATE todoitems SET ${parameter} = $1 WHERE id = $2;`, [parameterValue, id])
}
const countDoneTodoItems = (id) => {
  return pool.query('SELECT COUNT (*)  FROM todoitems WHERE donestatus = true;')
}
const getAllTodoItems = (id) => {
  return pool.query('SELECT * FROM todoitems ORDER BY id ASC;')
}
const insertTodoItem = (todoContent, doneStatus, selectedPriority, notes, done) => {
  return pool.query(
    'INSERT INTO todoitems (todoContent, doneStatus, selectedPriority, notes, date) VALUES ($1, $2, $3, $4,$5) RETURNING *', [todoContent, doneStatus, selectedPriority, notes, done]
  )
}
module.exports = { findTodoItem, deleteTodoItem, deleteAllTodoItems, deleteDoneTodoItems, updateTodoItem, countDoneTodoItems, getAllTodoItems, insertTodoItem }
