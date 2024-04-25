<<<<<<< HEAD
"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import supabase from "@/utils/supabase";

const Message = (props: { sender: string; content: string; pfp: string; timestamp: number }) => {
  return (
    <div className="flex flex-row">
      <img src={props.pfp} alt="pfp" width={50} height={50} className="rounded-full h-12 w-12 mr-4" />
      <div className="flex flex-col">
        <p className="font-bold">{props.sender}</p>
        <p>{props.content}</p>
      </div>
=======
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
>>>>>>> 46adc7a6026c41d5294e783d6c38a786a18ec3b9
    </div>
  );
};

interface Message {
  sender: string;
  content: string;
  pfp: string;
  timestamp: Date;
}

<<<<<<< HEAD
const ScrollingChat = (props: { messages: Message[] }) => {
  const { data: session } = useSession();

  return (
    <div className="flex border-2 border-red-500 relative flex-col w-full h-full text-white">
      <p className="text-white text-4xl"> Summary: </p>
      <p className="mb-3"> </p>
      <Message sender={session?.user?.name!} content="hello" pfp={session?.user?.image!} timestamp={Date.now()} />
      <p className="mb-5"> </p>
      <Message
        sender="chat"
        content="hello I am a language model build by DTI"
        pfp={"https://avatars.githubusercontent.com/u/19356609?s=280&v=4"}
        timestamp={Date.now()}
      />
      {/* {props.messages.map((msg) => (
        <Message key={msg.content} sender={msg.sender} content={msg.content} pfp={msg.pfp} timestamp={msg.timestamp} />
      ))} */}
    </div>
  );
};

const Chat = (props: { messages: Message[] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setMessages([
      ...messages,
      {
        sender: session?.user?.name!,
        content: inputRef.current?.value!,
        pfp: session?.user?.image!,
        timestamp: new Date(),
      },
    ]);
  };

  const fetchResponse = async (message: string) => {
    setLoading(true);
  };

  const InputField = () => {
    return (
      <div>
        <input className="text-black" ref={inputRef} type="text" placeholder="Type a message..." />
        <button className="bg-red-500" onClick={handleSend}>
          Send
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex border-2 border-red-500 relative flex-col w-full h-full text-white">
        <p className="text-white text-4xl"> Summary: </p>
        <p className="mb-3"> </p>
        <Message sender={session?.user?.name!} content="hello" pfp={session?.user?.image!} timestamp={Date.now()} />
        <p className="mb-5"> </p>
        <Message
          sender="chat"
          content="hello I am a language model build by DTI"
          pfp={"https://avatars.githubusercontent.com/u/19356609?s=280&v=4"}
          timestamp={Date.now()}
        />
        {messages.map((msg) => (
          <Message key={msg.content} sender={msg.sender} content={msg.content} pfp={msg.pfp} timestamp={msg.timestamp.getTime()} />
        ))}
      </div>
      <InputField />
    </div>
  );
};

export default Chat;
=======
export default ChatComponent;
>>>>>>> 46adc7a6026c41d5294e783d6c38a786a18ec3b9
