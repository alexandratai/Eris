import "./Message.css";

const Message = ({ message }) => {
    return (
        <>
        <div>{message.body}</div>
        </>
    );
};

export default Message;