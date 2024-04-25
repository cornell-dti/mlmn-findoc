import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./chatStyles.css";  // Make sure this import path is correct
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

function ChatComponent({ message }: { message: any }) {
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
            {/* You can add more Message components here based on your state or props */}
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatComponent;