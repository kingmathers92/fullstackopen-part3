/* eslint-disable no-undef */
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('postData', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :postData'
    )
)

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.get('/api/persons', async (request, response) => {
    try {
        const persons = await Person.find({})
        response.json(persons)
    } catch (error) {
        console.error('Error fetching persons from MongoDB:', error.message)
        response.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get('/api/info', (request, response) => {
    const requestTime = new Date()

    const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>
    `

    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find((person) => person.id === id)
    console.log(person)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing',
        })
    } else {
        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person
            .save()
            .then((person) => {
                response.json(person)
            })
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    response.status(400).json({ error: error.message })
                } else {
                    next(error)
                }
            })
    }
})

app.delete('/api/persons/:id', async (request, response, next) => {
    const id = request.params.id

    try {
        await Person.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        console.error('Error deleting person from MongoDB:', error.message)
        response.status(500).json({ error: 'Internal Server Error' })
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
