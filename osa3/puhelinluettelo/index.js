require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")

app.use(cors())

app.use(express.static('dist'))

morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let puhelinnumerot = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    },
]

app.get("/api/persons", (request, response) =>  {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    Person.countDocuments({})
    .then(length => {
      response.send(`
        <p>Phonebook has info for ${length} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => {
      console.error(err)
      response.status(500).send("Error fetching info")
    })
})

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
}) 

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    puhelinnumerot = puhelinnumerot.filter(numero => numero.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "name or number missing"
        })
    }

    const puhelinnumero = new Person({
        name: body.name,
        number: body.number
    })

    puhelinnumero.save().then(savedNumber => {
        response.json(savedNumber)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})