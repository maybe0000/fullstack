import { useState } from 'react'

const Header = ({ text }) => {
  return (
    <h1>{text}</h1>
  )
}

const Anecdote = (props) => {
  return (
    <>
      <Header text={props.text} />
      <p>{props.anecdotes[props.item]}</p>
      <p>has {props.votes[props.item]} votes</p>
    </>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const getRandomQuote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  }

  const voteForQuote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVote(newVotes);
  }

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))
  const maxVotes = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <Anecdote text='Anecdote of the day' anecdotes={anecdotes} votes={votes} item={selected} />
      <br></br>
      <Button onClick={getRandomQuote} text='next quote' />
      <Button onClick={voteForQuote} text='vote' />
      <br></br>
      {maxVotes == 0 ? null : <Anecdote text='Anecdote with most votes' anecdotes={anecdotes} votes={votes} item={maxVotes} />}
    </div>
  )
}

export default App