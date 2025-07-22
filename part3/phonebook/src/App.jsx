import { useEffect, useState } from 'react'
import personService from './services/persons'

import DeleteButton from './components/DeleteButton'
import Filter from './components/Filter'
import Form from './components/Form'
import Header from './components/Header'
import Notification from './components/Notification'
import Person from './components/Person'
import Phonebook from './components/Phonebook'

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

  const [message, setMessage] = useState({
    content: '',
    error: 0
  })

  const displayMessage = (action, name) => {
    if (action === 'a') {
      setMessage({
        content: `Added ${name}`,
        error: 0
      })
    }
    else if (action === 'u') {
      setMessage({
        content: `Changed number of ${name}`,
        error: 0
      })
    }
    else if (action === 'e') {
      setMessage({
        content: `Information of ${name} has already been removed from the server`,
        error: 1
      })
    } else if (action === 'ne') {
      setMessage({
        content: name,
        error: 1
      })
    }
    setTimeout(() => {
      setMessage({
        content: '',
        error: 0
      })
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
            displayMessage('u', updatedPerson.name)
          })
          .catch(err => {
            const errMsg = err.response?.data?.error || 'Unexpected error'
            console.error('Error updating person', errMsg)
            if (errMsg.includes('validation')) {
              displayMessage('ne', errMsg)
            } else {
              displayMessage('e', updatedPerson.name)
            }
          })
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
        .catch(error => {
          const errMsg = error.response?.data?.error || 'An error occured';
          displayMessage('ne', errMsg)
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
      <Notification content={message.content} type={message.error} />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <Header title='Add New Entry' />
      <Form addPerson={addPerson} newPerson={newPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Header title='Numbers' />
      <Phonebook filteredPersons={filteredPersons} Person={Person} DeleteButton={DeleteButton} deletePerson={deletePerson} />
    </div>
  )
}

export default App