import React, { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import FormattedMessage from "@/components/ResponseFormat";

interface ScrollingChatProps {
  messages: string[];
}

// ChatInput component for typing and sending messages
const ChatInput: React.FC<{ onSend: (message: string) => void }> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend(message);
    setMessage('');
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

// ChatWindow component for displaying messages
const ChatWindow: React.FC<ScrollingChatProps> = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((message, index) => (
        <div className="message" key={index}>
          {/* <IconButton
            aria-label="expand"
            onClick={() => onExpand && onExpand(message)}
            className="message-expand-button"
          >
            <OpenInFullIcon />
          </IconButton> */}
          {/* <h2>{message.author}</h2> */}
          <h2>{"Sample message"}</h2>
          <FormattedMessage message={message} />
        </div>
      ))}
    </div>
  );
};

// ScrollingChat component that includes ChatWindow and ChatInput
const ScrollingChat=({message}: { message: any }) => {
  // const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (newMessage: string) => {
    const message: Message = { author: 'User', content: newMessage };
    // setMessages([...messages, message]);
  };

  const handleExpand = (message: string) => {
    // Handle expand icon click here (e.g., open a dialog with the message)
    console.log('Expand clicked for message:', message);
  };
  console.log(message);
  return (
    <div className="scrolling-chat">
      <ChatWindow messages={message} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ScrollingChat;
