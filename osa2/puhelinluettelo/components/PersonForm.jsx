const PersonForm = ({onSubmitValue, newNameValue, onNameChange, newNumberValue, onNumberChange}) => {
    return(
        <form onSubmit={onSubmitValue}>
        <div>
          name: <input value={newNameValue} onChange={onNameChange}/>
        </div>
        <div>
          number: <input value={newNumberValue} onChange={onNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm