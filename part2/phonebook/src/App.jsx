import { useState, useEffect } from 'react'
import personService from './services/persons'

import Person from './components/Person'
import Header from './components/Header'
import Filter from './components/Filter'
import Form from './components/Form'
import Phonebook from './components/Phonebook'
import DeleteButton from './components/DeleteButton'

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

  const addPerson = event => {
    event.preventDefault();
    const newId = persons.length > 0 ? String(persons.length + 1) : '1';

    if (persons.some(person => person.name.toUpperCase() === newPerson.newName.toUpperCase())) {
      alert(`${newPerson.newName} is already added to the phonebook`)
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
          setPersons(persons.concat(returnedPerson));
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
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <Header title='Add New Entry' />
      <Form addPerson={addPerson} newPerson={newPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Header title='Numbers' />
      <Phonebook filteredPersons={filteredPersons} Person={Person} DeleteButton={DeleteButton} deletePerson={deletePerson} />
    </div>
  )
}

export default App