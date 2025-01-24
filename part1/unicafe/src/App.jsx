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

const StatisticLine = (props) => (
  <tr><td>{props.text}: {props.value}</td></tr>
)

const Statistics = ({ good, neutral, bad, total, avg, positive }) => {
  if (total === 0) {
    return (
      <p>No feedback given yet</p>
    )
  }
  else {
    return (
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={total} />
          <StatisticLine text='average' value={parseFloat(avg.toFixed(1))} />
          <StatisticLine text='positive' value={parseFloat(positive.toFixed(1)) + ' %'} />
        </tbody>
      </table>
    )
  }
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
  const positive = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <Header text='Give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Header text='Statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} avg={avg} positive={positive} />
    </div>
  )
}

export default App 