const Phonebook = ({ filteredPersons, Person, DeleteButton, deletePerson }) => {
    return (
        <div>{filteredPersons.map(person => <div key={person.name} style={{ display: 'flex', gap: '10px', padding: '5px' }}>
            <Person name={person.name} number={person.number} />
            <DeleteButton deletePerson={() => deletePerson(person)} /></div>)}
        </div>
    )
}


export default Phonebook