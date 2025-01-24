import { useState } from 'react'

const Header = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Statistics = (props) => {
  return (
    <p>{props.text}: {props.count}</p>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1);
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
  }

  const total = good + neutral + bad
  const avg = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total)*100

  return (
    <div>
      <Header text='Give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Header text='Statistics' />
      <Statistics text='good' count={good} />
      <Statistics text='neutral' count={neutral} />
      <Statistics text='bad' count={bad} />
      <Statistics text='all' count={total} />
      <Statistics text='average' count={avg} />
      <Statistics text='positive' count={positive.toString() + ' %'} />
    </div>
  )
}

export default App 