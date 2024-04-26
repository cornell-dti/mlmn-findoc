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
    // getUserIdByEmail(session?.user?.email!).then((data) => console.log(data));
    // getDocsByUserId(9).then((data) => console.log(data));
    // getQueries(9, 448985163764903046n).then((data) => console.log(data));
    uploadDoc(9, 448985163764903046n, "test2").then((data) => console.log(data));
    const userMessage = {
      sender: session?.user?.name!,
      content: inputRef.current?.value!,
      pfp: session?.user?.image!,
      timestamp: new Date(),
    };
    const gptResponse = await fetchResponse(inputRef.current?.value!);
    setMessages([...messages, userMessage, gptResponse]);
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
      <div className="flex relative flex-col w-full h-full text-white">
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
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender} content={msg.content} pfp={msg.pfp} timestamp={msg.timestamp.getTime()} />
        ))}
      </div>
      <InputField />
    </div>
  );
};

export default Chat;
