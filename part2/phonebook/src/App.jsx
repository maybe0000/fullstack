import { useState } from 'react'

const Person = ({ name }) => {
  return (
    <p>{name}</p>
  )
}

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName
    }
    setPersons(persons.concat(newPerson));
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