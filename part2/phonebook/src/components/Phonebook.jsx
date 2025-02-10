const Phonebook = ({ filteredPersons, Person }) => {
    return (
        <div>{filteredPersons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}</div>
    )
}


export default Phonebook