const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'todoapp',
  password: 'abcd'
})
const findTodoItem = async (id) => {
  return await pool.query('SELECT * from todoitems WHERE id = $1', [id])
}
const deleteTodoItem = async (id) => {
  return await pool.query('DELETE FROM todoitems WHERE id = $1;', [id])
}
const deleteAllTodoItems = async (id) => {
  return await pool.query('DELETE FROM todoitems;')
}
const deleteDoneTodoItems = async (id) => {
  return await pool.query('DELETE FROM todoitems WHERE donestatus = true;')
}
const updateTodoItem = async (parameter, parameterValue, id) => {
  return await pool.query(`UPDATE todoitems SET ${parameter} = $1 WHERE id = $2;`, [parameterValue, id])
}
const countDoneTodoItems = async () => {
  const result = await pool.query('SELECT COUNT (*)  FROM todoitems WHERE donestatus = true;')
  return { numberOfDoneTasks: parseInt(result.rows[0].count, 10) }
}
const getAllTodoItems = async () => {
  const result = await pool.query('SELECT * FROM todoitems ORDER BY id ASC;')
  return result.rows
}
const insertTodoItem = async (todoContent, doneStatus, selectedPriority, notes, done) => {
  const result = await pool.query(
    'INSERT INTO todoitems (todoContent, doneStatus, selectedPriority, notes, date) VALUES ($1, $2, $3, $4,$5) RETURNING *', [todoContent, doneStatus, selectedPriority, notes, done])
  return result.rows[0].id
}
module.exports = { findTodoItem, deleteTodoItem, deleteAllTodoItems, deleteDoneTodoItems, updateTodoItem, countDoneTodoItems, getAllTodoItems, insertTodoItem }
