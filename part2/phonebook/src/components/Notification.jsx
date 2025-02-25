const Notification = ({ content, type }) => {
    if (content == null || content == '') {
        return null
    }
    let typeOfMsg = ''
    if (type === 0) {
        typeOfMsg = 'msg'
    }
    else {
        typeOfMsg = 'error'
    }
    return (
        <h3 className={`notification ${typeOfMsg}`}>{content}</h3>
    )
}

export default Notification