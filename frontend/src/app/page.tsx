"use client";
import Image from "next/image";
import React, { useState } from "react";
import { uploadFile, processResponse } from "@/utils/files";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files[0]) {
      setMessages([]);
      setUploadedFileName(files[0].name);
      setIsProcessing(true);
      try {
        const response = await uploadFile(files[0], "summarize");
        console.log("Response:", response);
        await processResponse(response, setMessages);
      } catch (error) {
        console.error("Error during file upload or response processing:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-12">
      <div className="flex flex-col items-center justify-center h-full pt-16">
        <h1 className="text-4xl text-white mb-6">Welcome to dtigpt™ :)</h1>
        <div
          className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 mb-4 ${
            isProcessing ? "bg-gray-200" : "bg-transparent"
          }`}
        >
          <label htmlFor="file-upload" className="flex flex-col align-center justify-center text-center">
            <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
              <Image src="/icons/upload-file.png" alt="Upload" className="mx-auto" width={50} height={50} />
              {uploadedFileName ? (
                <span className="text-sm text-blue-500">{uploadedFileName}</span> // Display the file name
              ) : (
                <label className="text-sm -mb-2">Upload new file</label>
              )}
            </div>
            {!uploadedFileName && (
              <span className="text-gray-500 text-center font-semibold text-sm min-w-min">
                Drag and drop <br />
                or choose a file to upload
              </span>
            )}
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
        </div>
        {isProcessing && <p className="text-white">Uploading and processing your file...</p>}
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-lg text-white">Server Messages:</h2>
          <div className="max-h-52 overflow-auto bg-white bg-opacity-10 p-4 text-white rounded">{messages.join(" ")}</div>
        </div>
      </div>
    </main>
  );
}
