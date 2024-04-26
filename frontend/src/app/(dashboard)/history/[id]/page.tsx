'use client';

import Chat from "@/components/ScrollingChat";
import {Message} from "@/types/index";
import { getQueries, getUserIdByEmail } from "@/utils/chatUtils";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";


export default function Page({ params }: { params: { id: string } }) {
  const [userId, setUserId] = useState<number>();
  const [queryIds, setQueryIds] = useState<BigInt[]>();
  const [messageArr, setMessages] = useState<Message[]>();
  const { data: session } = useSession();

  useEffect(() => {
    getUserIdByEmail(session?.user?.email!).then((id) => setUserId(id))
    getQueries(userId!, BigInt(params.id)).then((query_ids) => setQueryIds(query_ids))
    const msgs : Message[]= []
    queryIds?.forEach(async (queryId) => {
      const query = await fetch(`httyp://localhost:8080/query/${queryId}`)
      const queryText = await query.json()
      const userMessage = {
        sender: session?.user?.name!,
        content: queryText,
        pfp: session?.user?.image!,
        timestamp: new Date(),
      };
      msgs.push(userMessage);
      const answer = await fetch(`httyp://localhost:8080/answer/${queryId}`)
      const answerText = await answer.json();
      const gptMessage = {
        sender: session?.user?.name!,
        content: answerText,
        pfp: session?.user?.image!,
        timestamp: new Date(),
      }
      msgs.push(gptMessage);
    })
    setMessages(msgs);
  }, []);

  return (
    <Chat messages={messageArr!} doc_id={BigInt(params.id)} />
    // <main className="flex flex-col items-center justify-between p-24">
    //   <div className="flex flex-col items-center justify-center h-full pt-32">
    //     <h1 className="text-4xl text-white mb-6">{params.id}</h1>
    //   </div>
    // </main>
  );
}