import Person from "./Person";

const Persons = ({personsToShow, deleteNumber}) => {
    return(
        <div>
        {personsToShow.map(person => 
        <Person key={person.name} person={person} deleteNumber={() => deleteNumber(person.id)}/>
      )}
      </div>

    )
}

export default Persons;