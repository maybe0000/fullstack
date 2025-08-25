const Notification = ({ message, msgType }) => {
  if (message === null) {
    return null
  }

  return <div className={`notification ${msgType}`}>{message}</div>
}

export default Notification
