const Curriculum = ({ curriculum }) => {
  return <h1>{curriculum}</h1>
}

const Header = ({ name }) => {
  return <h2>{name}</h2>
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
  return <div className="course">
    <Header name={course.name} />
    <Content parts={course.parts} />
  </div>
}
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
      <Curriculum curriculum='Web development curriculum' />
      <div id="courses">
        {courses.map(course => <Course key={course.id} course={course} />)}
      </div>
    </>
  )
}

export default App