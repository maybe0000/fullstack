require('dotenv').config()
const express = require('express')
const app = express()
// const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const PORT = process.env.PORT

app.use(express.static('dist'))
app.use(express.json())
// app.use(cors())
//app.use(morgan('tiny'))

morgan.token('body', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Notes API</h1><h2>Go to /api/persons</h2>')
})

app.get('/api/persons', (req, res) => {
  // res.json(notes)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(noteLength => {
      const currTime = new Date()
      res.send(`
            <p>Phonebook has info for ${noteLength} people</p>
            ${currTime}
        `)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  // notes = notes.filter(note => note.id !== id)
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  // const nameExists = notes.find(note => note.name === body.name)

  // if (nameExists) {
  //     return res.status(400).json({
  //         error: "name must be unique"
  //     })
  // }

  const person = new Person({
    'name': body.name,
    'number': body.number
  })

  person.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id

  Person.findById(id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))

})

const errorHandler = (err, req, res, next) => {
  console.log(err)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)

}

app.use(errorHandler)

app.listen(PORT)
console.log(`Server running on port ${PORT}`)