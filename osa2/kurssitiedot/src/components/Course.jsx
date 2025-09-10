const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course}/>
    </div>
  )
}

const Header = ({course}) => {
  return(
      <h1>{course.name}</h1>
  )
}

const Content = ({course}) => {
  return(
    <div>
      {course.parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
      <Total course={course}/>
    </div>
  )
}

const Part = ({ name, exercises}) => {
  return (
    <p>{name} {exercises}</p>
  )
}

const Total = ({ course }) => {
  const totalAmount = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>total of {totalAmount} exercises</p>
  )
}

export default Course;