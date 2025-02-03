import { useState } from 'react'
import Person from './Person'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
    }
    else {
      const newPerson = {
        name: newName
      }
      setPersons(oldPersons => oldPersons.concat(newPerson));
    }
    setNewName('');
  }

  const handleChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>{persons.map(person => <Person key={person.name} name={person.name} />)}</div>
    </div>
  )
}

export default App