const Filter = ({ filterText, handleFilterChange }) => {

    return (
        <div>
            filter shown with <input id="filter" value={filterText} onChange={handleFilterChange}></input>
        </div>
    )
}

export default Filter