"use client";
import Image from "next/image";
import React, { useState } from "react";
import { uploadFile, processResponse } from "@/utils/files";
import FormattedMessage from "@/components/ResponseFormat";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton } from "@mui/material";

const summary_options = ["policies", "dates", "summary", "resources", "instructors"];

export default function Home() {
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [secondFileName, setSecondFileName] = useState<string>("");
  const [firstFile, setFirstFile] = useState<File | null>(null);
  const options_to_use = summary_options.reduce((acc: any, option) => {
    acc[option] = true;
    return acc;
  }, {});
  const [options, setOptions] = useState<{ [key: string]: boolean }>(options_to_use);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; text: string }>({ title: "", text: "" });

  const handleOpenDialog = (title: string, text: string) => {
    setDialogContent({ title, text });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOptionChange = (option: string) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };

  const onExportClick = async () => {
    const dates = messages["dates"];
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dates,
    });
  };

  const handleFirstFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files[0]) {
      setMessages({});
      setUploadedFileName(files[0].name);
      setFirstFile(files[0]);
      setIsProcessing(true);
      try {
        const response = await uploadFile(files[0], "summarize", options);
        await processResponse(response, setMessages);
      } catch (error) {
        console.error("Error during file upload or response processing:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSecondFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files[0] && firstFile) {
      setSecondFileName(files[0].name);
      setIsProcessing(true);
      const filesList = [firstFile, files[0]];
      try {
        const response = await uploadFile(filesList, "compare", options);
        setMessages({});
        await processResponse(response, setMessages);
      } catch (error) {
        console.error("Error during file comparison:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-8">
      <div className="flex flex-col items-center justify-center h-full pt-2">
        <h1 className="text-4xl text-white mb-6">Welcome to dtigpt™ :)</h1>
        <div className="flex w-full justify-center gap-4 mb-4">
          <div
            className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 ${
              isProcessing ? "bg-gray-200" : "bg-transparent"
            } max-w-sm`}
          >
            <label htmlFor="first-file-upload" className="flex flex-col align-center justify-center text-center">
              <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
                <Image src="/icons/upload-file.png" alt="Upload" className="mx-auto" width={50} height={50} />
                {uploadedFileName ? (
                  <span className="text-sm text-blue-500">{uploadedFileName}</span>
                ) : (
                  <label className="text-sm -mb-2">Upload first file</label>
                )}
              </div>
              {!uploadedFileName && (
                <span className="text-gray-500 text-center font-semibold text-sm min-w-min">
                  Drag and drop <br />
                  or choose a file to upload
                </span>
              )}
            </label>
            <input id="first-file-upload" type="file" accept=".txt" className="hidden" onChange={handleFirstFileUpload} />
          </div>

          {uploadedFileName && (
            <div
              className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 bg-transparent ${
                isProcessing ? "bg-gray-200" : "bg-transparent"
              } max-w-sm`}
            >
              <label htmlFor="second-file-upload" className="flex flex-col align-center justify-center text-center">
                <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
                  <Image src="/icons/upload-file.png" alt="Upload" className="mx-auto" width={50} height={50} />
                  {secondFileName ? (
                    <span className="text-sm text-blue-500">{secondFileName}</span>
                  ) : (
                    <label className="text-sm -mb-2">Upload second file</label>
                  )}
                </div>
                {!secondFileName && (
                  <span className="text-gray-500 text-center font-semibold text-sm min-w-min">
                    Drag and drop <br />
                    or choose a second file to compare with the first
                  </span>
                )}
              </label>
              <input id="second-file-upload" type="file" accept=".txt" className="hidden" onChange={handleSecondFileUpload} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-white">
          {summary_options.map((option, index) => (
            <div key={index} className="flex items-center gap-1">
              <input
                type="checkbox"
                id={option}
                name={option}
                checked={options[option]}
                onChange={() => handleOptionChange(option)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor={option} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>

        {isProcessing && <h2 className="text-white text-lg">Processing...</h2>}
        {options.dates && !isProcessing && firstFile !== null && (
          <div className="flex flex-col items-center justify-center">
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4" onClick={onExportClick}>
              Export to Google Calendar
            </button>
          </div>
        )}
        <div className="overflow-x-scroll overflow-y-hidden max-w-screen-lg mt-10 max-h-80">
          <div className="flex flex-no-wrap max-h-96">
            {Object.entries(messages).map(([key, message], index) =>
              key === "dates" ? null : (
                <div className="relative flex-shrink-0 w-1/2 min-w-64 h-64 mt-2" key={index}>
                  <IconButton
                    aria-label="expand"
                    onClick={() => handleOpenDialog(`Response ${key}`, message)}
                    className="absolute top-2 right-2 text-white bg-gray-500 bg-opacity-100 hover:bg-gray-600"
                  >
                    <OpenInFullIcon />
                  </IconButton>
                  <h2 className="text-white text-lg">
                    <mark className="bg-gray-500 text-white px-2 py-1">{`Response ${key}`}</mark>
                  </h2>
                  <div className="bg-white bg-opacity-10 mr-4 pb-64 overflow-y-auto max-h-96">
                    <FormattedMessage key={index} message={message} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogContent>
            <IconButton aria-label="close" onClick={handleCloseDialog} style={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
            <div className="bg-white bg-opacity-10 p-4">
              <FormattedMessage message={dialogContent.text} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
