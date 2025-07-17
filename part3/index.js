const express = require('express')
const app = express()

app.use(express.json())

let notes = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Notes API</h1><h2>Go to /api/persons</h2>')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    const noteLength = notes.length
    const currTime = new Date()
    res.send(`
        <p>Phonebook has info for ${noteLength} people</p>
        ${currTime}
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        res.json(note)
    } else {
        res.status(400).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const newId = Math.floor(Math.random() * 1_000_000_000)
    const body = req.body

    if (!body || !body.name || !body.number) {
        return res.status(400).json({
            error: "content missing"
        })
    }

    const note = {
        "id": newId,
        "name": body.name,
        "number": body.number
    }
    notes = notes.concat(note)
    res.json(note)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)