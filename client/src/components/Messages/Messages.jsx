import Message from '../Message/Message';
import './Messages.css';
import ScrollToBottom from 'react-scroll-to-bottom';

function Messages ({messages, name}) {
    return (
        <ScrollToBottom className='messages'>
            {messages.map(
                function (message, i) {
                    return (<div key={i}>
                                <Message message={message} name={name}/>
                            </div>)
                }
            )
            }
        </ScrollToBottom>
        )
}

export default Messages; 