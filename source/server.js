const express = require('express')
const app = express()
const database = require('./db.js')
app.use(express.json()) // doubt

app.use(express.static('public'))

// ROUTES//

// get all todos

app.get('/todos', async (req, res) => {
  try {
    const allTodos = await database.query('SELECT * FROM todoitems')
    res.json(allTodos.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/todos/countDone', async (req, res) => {
  console.log('hi2')
  try {
    const count = await database.query('SELECT COUNT (*)  FROM todoitems WHERE doneStatus = true;')
    res.json(count)
  } catch (err) {
    console.error(err.message)
  }
})

// get a todo

app.get('/todos/:id', async (req, res) => {
  console.log(req.params)
  const { id } = req.params
  // add an error handler when id isnt present in the table
  try {
    const todo = await database.query('SELECT * from todoitems WHERE id = $1', [id])
    res.json(todo)
  } catch (err) {
    console.error(err)
  }
})

// create a todo

app.post('/todos', async (req, res) => {
  try {
    // await
    const { todoContent, doneStatus, selectedPriority, notes, done } = req.body
    console.log(todoContent)
    const result = await database.query(
      'INSERT INTO todoitems (todoContent, doneStatus, selectedPriority, notes, date) VALUES ($1, $2, $3, $4,$5) RETURNING *', [todoContent, doneStatus, selectedPriority, notes, done]
    )
    console.log(result.rows[0].id)
    res.json(result.rows[0].id)
  } catch (err) {
    console.log(err.message)
  }
})

// update a todo
// date field datatype doubt

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const parameter = Object.keys(req.body)[0]
  console.log(req.body)
  await database.query(`UPDATE todoitems SET ${parameter} = $1 WHERE id = $2`, [req.body[parameter], id])
  res.json('TODO was updated')
})

// delete a todo

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    await database.query('DELETE FROM todoitems WHERE id = $1', [id])
    res.json('TODO was deleted')
  } catch (err) {
    console.error(err.message)
  }
})
app.delete('/todos/clearDone', async (req, res) => {
  try {
    await database.query('DELETE FROM todoitems WHERE doneStatus = 1')
    res.json('done todos deleted')
  } catch (err) {
    console.error(err.message)
  }
})
app.delete('/todos', async (req, res) => {
  try {
    await database.query('DELETE FROM todoitems;')
    res.json('All todos were deleted')
  } catch (err) {
    console.err(err.message)
  }
})

app.listen(3000)
