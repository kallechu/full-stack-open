const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(cors())

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
    response.json(puhelinnumerot)
})

app.get("/info", (request, response) => {
    const length = puhelinnumerot.length
    response.send(`
        <p>Phonebook has info for ${length} people</p>
        <p>${new Date()}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const numero = puhelinnumerot.find(numero => numero.id === id)
    if (numero) {
        response.json(numero)
    } else {
        response.status(404).end()
    }
}) 

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    puhelinnumerot = puhelinnumerot.filter(numero => numero.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    const userCheck = puhelinnumerot.find(numero => numero.name === body.name)

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "name or number missing"
        })
    } else if (userCheck) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const puhelinnumero = {
        id: `${Math.floor(Math.random() * 1000000)}`,
        name: body.name,
        number: body.number
    }

    puhelinnumerot = puhelinnumerot.concat(puhelinnumero)
    response.json(puhelinnumero)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})