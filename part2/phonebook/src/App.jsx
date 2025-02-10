import { useState } from 'react'
import Person from './Person'

const App = () => {

  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-1234567'
    }
  ])
  const [newPerson, setNewPerson] = useState({
    newName: '',
    newNumber: ''
  })

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

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      <div>{persons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}</div>
    </div>
  )
}

export default App