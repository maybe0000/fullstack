import { useState } from 'react'
import Person from './components/Person'
import Header from './components/Header'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newPerson, setNewPerson] = useState({
    newName: '',
    newNumber: ''
  })

  const [filterText, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name.toUpperCase() === newPerson.newName.toUpperCase())) {
      alert(`${newPerson.newName} is already added to the phonebook`)
    }
    else {
      const personToAdd = {
        name: newPerson.newName,
        number: newPerson.newNumber
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const filteredPersons = persons.filter(person => person.name.toUpperCase().includes(filterText.toUpperCase()));

  return (
    <div>
      <Header title='Phonebook' />
      <div>
        filter shown with <input value={filterText} onChange={handleFilterChange}></input>
      </div>
      <Header title='Add New Entry' />
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newPerson.newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newPerson.newNumber} onChange={handleNumberChange}></input>
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
      <Header title='Numbers' />
      <div>{filteredPersons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}</div>
    </div>
  )
}

export default App