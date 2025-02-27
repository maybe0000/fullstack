const Form = ({ addPerson, newPerson, handleNameChange, handleNumberChange }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input id="name" value={newPerson.newName} onChange={handleNameChange} />
            </div>
            <div>
                number: <input id="number" value={newPerson.newNumber} onChange={handleNumberChange} ></input>
            </div>
            <div>
                <button type="submit" >add</button>
            </div>
        </form>
    )
}

export default Form