const Notification = ({ message }) => {
    if (message == '') {
        return null
    }
    return (
        <h3 className="msg">{message}</h3>
    )
}

export default Notification