const express = require('express')
const app = express()
const { findTodoItem, deleteTodoItem, deleteAllTodoItems, deleteDoneTodoItems, updateTodoItem, countDoneTodoItems, getAllTodoItems, insertTodoItem } = require('./db.js')

// mounting json() middleware converting request to json
app.use(express.json())

// ROUTES //

// get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await getAllTodoItems()
    res.json(allTodos.rows)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// count number of done todos
app.get('/todos/countDone', async (req, res) => {
  try {
    const count = await countDoneTodoItems()
    res.json({ numberOfDoneTasks: parseInt(count.rows[0].count, 10) })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// get a todo
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const todo = await findTodoItem(id)
    res.json(todo)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// create a todo
app.post('/todos', async (req, res) => {
  try {
    const { todoContent, doneStatus, selectedPriority, notes, done } = req.body
    const result = await insertTodoItem(todoContent, doneStatus, selectedPriority, notes, done)
    res.json(result.rows[0].id)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const parameter = Object.keys(req.body)[0]
    await updateTodoItem(parameter, req.body[parameter], id)
    res.json('TODO was updated')
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// delete a todo
app.delete('/todos/clearDone', async (req, res) => {
  try {
    await deleteDoneTodoItems()
    res.json('done todos deleted')
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    await deleteTodoItem(id)
    res.json('TODO was deleted')
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// delete all todos
app.delete('/todos', async (req, res) => {
  try {
    await deleteAllTodoItems()
    res.json('All todos were deleted')
  } catch (err) {
    console.err(err)
    res.sendStatus(500)
  }
})

// mounting middleware static() to serve static file at path 'public'
app.use(express.static('public'))

app.listen(3000)
