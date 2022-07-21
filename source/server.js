const express = require('express')
const app = express()
const database = require('./db.js')
app.use(express.json()) // doubt

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

// get a todo

app.get('/todos:id', async (req, res) => {
  const { id } = req.params
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
    const { content } = req.body
    const newTodo = await database.query(
      'INSERT INTO todoitems (content) VALUES ($1) RETURNING *', [content]
    )
    res.json(newTodo.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

// update a todo

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { content } = req.body
  const updateTodo = await database.query('UPDATE todoitems SET content = $1 WHERE content = $2', [content, id])
  res.json('TODO was updated')
})

// delete a todo

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteTodo = await database.query('DELETE FROM todoitems WHERE content = $1', [id])
    res.json('TODO was deleteed')
  } catch (err) {
    console.error(err.message)
  }
})

// app.use(express.static('public'))

app.listen(3000)
