const Header = ({ name }) => {
  return <h1>{name}</h1>
}

const Part = ({ part }) => {
  return (<li>{part.name} {part.exercises}</li>)
}

const Content = ({ parts }) => {
  return (
    <>
      <ul style={{ listStyleType: "none", padding: 0 }}>{parts.map(part => <Part key={part.id} part={part} />)}</ul>
      <Total total={parts.reduce((sum, i) => sum + i.exercises, 0)} />
    </>
  )
}

const Total = ({ total }) => {
  return <p style={{ fontWeight: "bold" }}>total of {total} exercises</p>
}

const Course = ({ course }) => {
  return <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
  </div>
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App