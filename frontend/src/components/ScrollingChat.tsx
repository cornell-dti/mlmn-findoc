import React, { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from "@chatscope/chat-ui-kit-react";

function ChatComponent({ fileContent, message }: { fileContent: string; message: any[] }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [file, setFile] = useState<string>("");

  useEffect(() => {
    setMessages(message);
    setFile(fileContent);
  }, [message, fileContent]);

  const sendMessage = async (text: string) => {
    if (text.trim()) {
      const sentMessage = {
        message: text,
        sentTime: new Date().toISOString(),
        sender: "You",
        direction: "outgoing",
        position: "single",
      };

      setMessages((messages) => [...messages!, sentMessage]);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/followup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doc: file, query: text }),
        });
        const message = await response.json();
        const serverMessage = {
          message: message,
          sentTime: new Date().toISOString(),
          sender: "Support",
          direction: "incoming",
          position: "single",
        };

        setMessages((messages) => [...messages, serverMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.message,
                  sentTime: msg.sentTime,
                  sender: msg.sender,
                  direction: msg.direction,
                  position: msg.position,
                }}
              />
            ))}
          </MessageList>
          <MessageInput placeholder="Type your message here..." onSend={sendMessage} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatComponent;
