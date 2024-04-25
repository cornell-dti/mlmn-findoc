import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

function ChatComponent({message}: { message: any }) {
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {/* Repeat the Message component for each message in your state or props */}
            <Message
              model={{
                message: message,
                sentTime: "just now",
                sender: "Joe",
                direction: "incoming",
                position: "single",
              }}
            />
            {/* ... other messages */}
          </MessageList>
          <MessageInput placeholder="Placeholder message" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatComponent;