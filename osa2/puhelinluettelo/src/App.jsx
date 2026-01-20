import { useState, useEffect } from 'react'
import Filter from '../components/Filter'
import PersonForm from '../components/PersonForm'
import Persons from '../components/Persons'
import personService from "./services/persons"
import Notification from '../components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log("effect")
    personService
      .getAllPersons()
        .then(persons => {
          setPersons(persons)
        })
  }, [])

  const personsToShow = showAll ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setShowAll(false)
  }

  const addNumber = (event) => {
    event.preventDefault()

    const numberObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if(existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = {...existingPerson, number: newNumber}
        personService
          .updatePerson(existingPerson.id, changedPerson)
          .then(response => {
            setSuccessMessage(
              `${newName} number updated`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)

            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response))
            setNewName("")
            setNewNumber("")
          })

          .catch(error => {
            setErrorMessage(
              `information of ${existingPerson.name} has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
      .createPerson(numberObject)
        .then(response => {
          setSuccessMessage(
              `Added ${newName}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          setPersons(persons.concat(response))
          setNewName("")
          setNewNumber("")
        })

        .catch(error => {
            console.log(error.response.data.error)
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
    }
  }

  const deleteNumberOf = (id) => {
    console.log("number " + id + " needs to be deleted")
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`))
      personService
        .deletePerson(id)
          .then(() => {
            setSuccessMessage(
              `${person.name} deleted`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)

            setPersons(persons.filter(p => p.id !== id))
          })
          
          .catch(error => {
            setErrorMessage(
              `information of ${person.name} has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage}/>
      <Notification message={errorMessage} type="error" />
      <Filter filterValue={newFilter} onFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm
        onSubmitValue={addNumber}
        newNameValue={newName}
        onNameChange={handleNameChange}
        newNumberValue={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteNumber={deleteNumberOf}/>
    </div>
  )

}

export default App