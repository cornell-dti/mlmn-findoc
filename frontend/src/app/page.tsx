"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const formData = new FormData();
      formData.append("file", files[0]);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/summarize`,
          { method: "POST", body: formData }
        );
        const reader = response
          .body!.pipeThrough(new TextDecoderStream())
          .getReader();
        while (true) {
          const { done, value } = await reader.read();
          console.log(value);
          if (done) break;
          setMessages((prevMessages) => [...prevMessages, value.toString()]);
        }
      } catch (error) {
        console.error("Error sending text to the server:", error);
      }
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/events");
    eventSource.onmessage = (event) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-12">
      <div className="flex flex-col items-center justify-center h-full pt-16">
        <h1 className="text-4xl text-white mb-6">Welcome to dtigpt™ :)</h1>
        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 mb-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col align-center justify-center text-center"
          >
            <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
              <Image
                src="/icons/upload-file.png"
                alt="Upload"
                className="mx-auto"
                width={50}
                height={50}
              />
              <label className=" text-sm -mb-2">Upload new file</label>
            </div>
            <span className="text-gray-500 text-center font-semibold text-sm min-w-min">
              Drag and drop <br />
              or choose a file to upload
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-lg text-white">Server Messages:</h2>
          <div className="max-h-52 overflow-auto bg-white bg-opacity-10 p-4 text-white rounded">
            {messages.join(" ")}
          </div>
        </div>
      </div>
    </main>
  );
}
