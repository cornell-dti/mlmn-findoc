"use client";
import { useState, useRef, useEffect } from "react";
import { type Message } from "@/types";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getDocsByUserId, getQueries, getUserIdByEmail, uploadDoc } from "@/utils/chatUtils";

const Message = (props: { sender: string; content: string; pfp: string; timestamp: number }) => {
  return (
    <div className="flex flex-row">
      <img src={props.pfp} alt="pfp" width={50} height={50} className="rounded-full h-12 w-12 mr-4" />
      <div className="flex flex-col">
        <p className="font-bold">{props.sender}</p>
        <p>{props.content}</p>
      </div>
    </div>
  );
};

const Chat = (props: { messages: Message[]; doc_id: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const userMessage = {
      sender: session?.user?.name!,
      content: inputRef.current?.value!,
      pfp: session?.user?.image!,
      timestamp: new Date(),
    };
    const gptResponse = await fetchResponse(inputRef.current?.value!);
    setMessages([...messages, userMessage, gptResponse]);
    inputRef.current!.value = ""; // clear input after sending
  };

  const fetchResponse = async (message: string): Promise<Message> => {
    setLoading(true);
    // const doc = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doc/${props.doc_id}`);
    const response = await fetch("http://localhost:8080/");
    // headers: {
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify({ doc: props.doc_id, query: message }),
    // });
    const data = await response.json();

    const newMessage = {
      sender: "chat",
      content: data,
      pfp: "https://avatars.githubusercontent.com/u/19356609?s=280&v=4",
      timestamp: new Date(),
    };
    setLoading(false);
    return newMessage;
  };

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  const InputField = () => {
    return (
      <div className="flex items-center border border-blue-500 rounded-lg overflow-hidden mt-4">
        <input
          className="flex-grow p-2 bg-white text-black rounded-l-lg border-none"
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          style={{ borderTopLeftRadius: "0.375rem", borderBottomLeftRadius: "0.375rem", borderRight: "none" }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-r-lg"
          onClick={handleSend}
          style={{ borderTopRightRadius: "0.375rem", borderBottomRightRadius: "0.375rem" }}
        >
          Send
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex flex-col gap-1 overflow-auto">
        {/* <div className="flex relative flex-col w-full h-full text-white"> */}
        {/* <p className="text-white text-4xl mb-4"> Summary: </p> */}
        <p className="mb-3"> </p>
        <Message sender={session?.user?.name!} content="hello" pfp={session?.user?.image!} timestamp={Date.now()} />
        <p className="mb-5"> </p>
        <Message
          sender="chat"
          content="hello I am a language model built by DTI"
          pfp={"https://avatars.githubusercontent.com/u/19356609?s=280&v=4"}
          timestamp={Date.now()}
        />
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender} content={msg.content} pfp={msg.pfp} timestamp={msg.timestamp.getTime()} />
        ))}
      </div>
      <InputField />
    </div>
  );
};

export default Chat;
