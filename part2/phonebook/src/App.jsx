import { useState, useEffect } from 'react'
import personService from './services/persons'

import Person from './components/Person'
import Header from './components/Header'
import Filter from './components/Filter'
import Form from './components/Form'
import Phonebook from './components/Phonebook'
import DeleteButton from './components/DeleteButton'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    // console.log('effect')
    personService.getAll().then(initialPersons => {
      // console.log('promise fulfilled')
      setPersons(initialPersons)
    })
  }, [])
  // console.log('render', persons.length, 'persons')
  // console.log(persons)

  const [newPerson, setNewPerson] = useState({
    newName: '',
    newNumber: ''
  })

  const [message, setMessage] = useState('')

  const displayMessage = (action, name) => {
    if (action == 'a') {
      setMessage(`Added ${name}`)
    }
    else if (action == 'u') {
      setMessage(`Changed number of ${name}`)
    }
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault();
    const newId = persons.length > 0 ? String(persons.length + 1) : '1';

    const person = persons.find(p => p.name.toUpperCase() === newPerson.newName.toUpperCase())

    if (person) {
      if (confirm(`${newPerson.newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {
          ...person,
          number: newPerson.newNumber
        }
        personService
          .update(person.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => (p.id === returnedPerson.id ? returnedPerson : p)))
          })
        displayMessage('u', updatedPerson.name)
      }
    }
    else {
      const personToAdd = {
        name: newPerson.newName,
        number: newPerson.newNumber,
        id: newId
      }
      personService
        .create(personToAdd)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          displayMessage('a', returnedPerson.name)
        })
    }
    setNewPerson({
      newName: '',
      newNumber: ''
    })
  }

  const handleNameChange = (event) => {
    setNewPerson(previousPerson => ({
      ...previousPerson,
      newName: event.target.value
    }));
  }

  const handleNumberChange = (event) => {
    setNewPerson(previousPerson => ({
      ...previousPerson,
      newNumber: event.target.value
    }));
  }

  const [filterText, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const filteredPersons = persons.filter(person => person.name.toUpperCase().includes(filterText.toUpperCase()));

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personService.deletePerson(person.id).then(() =>
        personService.getAll()).then(initialPersons => {
          // console.log('promise fulfilled')
          setPersons(initialPersons)
        })
    }
  }

  return (
    <div>
      <Header title='Phonebook' />
      <Notification message={message} />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <Header title='Add New Entry' />
      <Form addPerson={addPerson} newPerson={newPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Header title='Numbers' />
      <Phonebook filteredPersons={filteredPersons} Person={Person} DeleteButton={DeleteButton} deletePerson={deletePerson} />
    </div>
  )
}

export default App