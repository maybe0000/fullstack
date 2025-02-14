import { useState, useEffect } from 'react'
import axios from 'axios'

import Person from './components/Person'
import Header from './components/Header'
import Filter from './components/Filter'
import Form from './components/Form'
import Phonebook from './components/Phonebook'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  console.log(persons)

  const [newPerson, setNewPerson] = useState({
    newName: '',
    newNumber: ''
  })

  const addPerson = (event) => {
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
      setPersons(oldPersons => oldPersons.concat(personToAdd));
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

  return (
    <div>
      <Header title='Phonebook' />
      <Filter filterText={filterText} handleFilterChange={handleFilterChange} />
      <Header title='Add New Entry' />
      <Form addPerson={addPerson} newPerson={newPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Header title='Numbers' />
      <Phonebook filteredPersons={filteredPersons} Person={Person} />
    </div>
  )
}

export default App