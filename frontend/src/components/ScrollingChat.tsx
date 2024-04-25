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
    </div>
  );
};

interface Message {
  sender: string;
  content: string;
  pfp: string;
  timestamp: Date;
}

// const ScrollingChat = (props: { messages: Message[] }) => {
//   const { data: session } = useSession();

//   return (
//     <div className="flex border-2 border-red-500 relative flex-col w-full h-full text-white">
//       <p className="text-white text-4xl"> Summary: </p>
//       <p className="mb-3"> </p>
//       <Message sender={session?.user?.name!} content="hello" pfp={session?.user?.image!} timestamp={Date.now()} />
//       <p className="mb-5"> </p>
//       <Message
//         sender="chat"
//         content="hello I am a language model build by DTI"
//         pfp={"https://avatars.githubusercontent.com/u/19356609?s=280&v=4"}
//         timestamp={Date.now()}
//       />
//       {/* {props.messages.map((msg) => (
//         <Message key={msg.content} sender={msg.sender} content={msg.content} pfp={msg.pfp} timestamp={msg.timestamp} />
//       ))} */}
//     </div>
//   );
// };

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
    const response = await fetch("")

  // useEffect(() => {
  //   setMessages(props.messages);
  // }, [props.messages]);

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
