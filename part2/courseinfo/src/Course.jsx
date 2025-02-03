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

export default Course