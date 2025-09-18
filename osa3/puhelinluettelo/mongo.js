const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.1dyjo7n.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person =>
        console.log(`${person.name} ${person.number}`)
    )
    mongoose.connection.close()
})
} else {
    const person = new Person({
        name: personName,
        number: personNumber,
})

    person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})
}