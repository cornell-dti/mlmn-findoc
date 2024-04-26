"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { uploadFile, processResponse } from "@/utils/files";
import { areCredentialsValid } from "@/utils/auth";
import FormattedMessage from "@/components/ResponseFormat";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { getSession } from "next-auth/react";
import Chat from "@/components/ScrollingChat";
import supabase from "@/utils/supabase";
import { TbRuler } from "react-icons/tb";
import "./page.css";

const summary_options = ["policies", "dates", "summary", "resources", "instructors"];

interface HomeProps {
  function: string;
}

const Home: React.FC<HomeProps> = (props) => {
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [secondFileName, setSecondFileName] = useState<string>();
  const [firstFile, setFirstFile] = useState<File | null>(null);
  const [secondFile, setSecondFile] = useState<File | null>(null);
  const [firstFileContent, setFirstFileContent] = useState("");
  const [uploadedFiles, setuploadedFiles] = useState<File[]>([]);
  const [temp, setTemp] = useState<Number>(0.0);
  const [savedDocumentName, setSavedDocumentName] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const isSummarize = props.function === "summarize";
  const isParse = props.function === "parse";
  const isCompare = props.function === "compare";
  const [file, setFile] = React.useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [doneProcessing, setDoneProcessing] = useState<boolean>(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [documentID, setDocumentID] = useState<string | null>(null);

  const options_to_use = summary_options.reduce((acc: any, option) => {
    acc[option] = false;
    return acc;
  }, {});

  const [options, setOptions] = useState<{ [key: string]: boolean }>(options_to_use);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    text: string;
  }>({ title: "", text: "" });

  const handleOpenDialog = (title: string, text: string) => {
    setDialogContent({ title, text });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDocumentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSavedDocumentName(event.target.value);
  };

  const handleSubmitButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(savedDocumentName);
    const response = await uploadFile(firstFile!, "summarize", options);
    await processResponse(response, setMessages, setDocumentID);

    setIsSubmitted(true);
    setIsTransitioning(true);
  };

  const handleOptionChange = (option: string) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };
  const onSubmitParse = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Handle the submission logic here
  };
  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== process.env.NEXT_PUBLIC_SERVER_URL) return;

        if (event.data.type === "authentication") {
          localStorage.setItem("gCalCreds", JSON.stringify(event.data.data));
        }
      },
      false
    );
  }, []);

  const onExportClick = async () => {
    const dates = JSON.parse(messages["dates"]);
    const credentials = JSON.parse(localStorage.getItem("gCalCreds")!);
    if (!credentials || !areCredentialsValid(credentials)) {
      window.open(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth`, "_blank");
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dates, credentials, userEmail }),
      });
      localStorage.removeItem("gCalCreds");
    }
  };

  useEffect(() => {
    getSession().then((session) => {
      setUserEmail(session?.user?.email!);
    });
  }, []);

  const handleFirstFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files[0]) {
      setMessages({});
      setUploadedFileName(files[0].name);
      setFirstFile(files[0]);
      setuploadedFiles([files[0]]);
      setSubmitDisabled(false);
    }
  };

  const handleSecondFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files[0] && firstFile) {
      setSecondFileName(files[0].name);
      setSecondFile(files[0]);
      setuploadedFiles([firstFile, files[0]]);
    }
  };

  const handleSummarizeSubmit = async () => {
    setIsProcessing(true);
    if (firstFile instanceof File) {
      try {
        setSubmitDisabled(false);
        // const response = await uploadFile(files[0], "summarize", options);
        // await processResponse(response, setMessages);
      } catch (error) {
        console.error("Error during file upload or response processing:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCompareSubmit = async () => {
    setIsProcessing(true);
    if (firstFile && secondFile) {
      const formData = new FormData();
      formData.append("file1", firstFile);
      formData.append("file2", secondFile);
      formData.append("temperature", temp.toString()); // Convert temperature to a string
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${"compare"}`, {
          method: "POST",
          body: formData,
        });
        if (response && response.ok) {
          let streamData = "";
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("text/event-stream")) {
            const reader = response.body?.getReader();
            reader?.read().then(function processStream({ done, value }): Promise<void> {
              if (done) {
                console.log("Stream complete");
                setDoneProcessing(true);
                setOutput(streamData);
                return Promise.resolve();
              }
              const chunk = new TextDecoder().decode(value);
              streamData += chunk;
              return reader.read().then(processStream);
            });
          }
        }
      } catch (error) {
        console.error("Error during file comparison:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.error("One or both files are null");
      setIsProcessing(false);
    }
  };

  const handleDropDownChange = (event: SelectChangeEvent) => {
    setFile(event.target.value as string);
    setSubmitDisabled(false);
  };

  async function getFileHistory(): Promise<string[]> {
    const response = await supabase.from("user-doc").select("*").eq("userID", 9);

    // Map the response data to extract the "docID" values
    return response.data?.map((val) => val["docID"]) as string[];
  }

  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFileHistory = async () => {
      const fileHistory = await getFileHistory();
      setFiles(fileHistory);
    };

    fetchFileHistory();
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-8">
      {!isSubmitted && (
        <div className={`page-transition ${isTransitioning ? "page-transition-exit-active" : ""}`}>
          <div className="flex flex-col items-center justify-center h-full pt-2">
            <h1 className="text-4xl text-white mb-6">
              {isSummarize ? "What do you want to summarize?" : ""}
              {!firstFileContent && isParse ? "What do you want to parse?" : ""}
              {isCompare ? "What do you want to compare?" : ""}
              {firstFileContent && isParse ? "Select all information you want to parse" : ""}
            </h1>

            {firstFileContent && isParse ? (
              <div className="flex justify-center gap-5 w-full" style={{ marginBottom: "20px" }}>
                {summary_options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionChange(option)}
                    className={`rounded-md shadow cursor-pointer p-4 transition-colors duration-300 ${
                      options[option] ? "selected-background" : "default-background"
                    } border border-gray-200 flex flex-col items-center justify-center flex-grow`}
                    style={{
                      width: "150px",
                      height: "75px",
                      minWidth: "150px",
                      minHeight: "75px",
                      maxWidth: "150px",
                      maxHeight: "75px",
                    }}
                  >
                    <div className="text-white text-lg font-medium">{option}</div>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            <div className="flex w-full justify-center gap-4 mb-4">
              {(!firstFileContent && isParse) || isSummarize || isCompare ? (
                <div
                  className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 ${
                    isProcessing ? ".default-background" : ".default-background"
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
              ) : (
                ""
              )}
              {isSummarize ? (
                <>
                  <div className="text-white" style={{ marginTop: "65px" }}>
                    or
                  </div>
                  <FormControl
                    sx={{
                      width: "40%",
                      marginTop: "50px",
                      ".MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white",
                          borderStyle: "dashed",
                        },
                        "&:hover fieldset": {
                          borderColor: "white",
                          borderStyle: "dashed",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white",
                          borderStyle: "dashed",
                        },
                      },
                      color: "white", // Optional: If you also want to change the color of the input label and icon
                    }}
                  >
                    <InputLabel id="demo-simple-select-label" style={{ color: "white" }}>
                      Select from existing file
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={file}
                      label="Select from existing file"
                      onChange={handleDropDownChange}
                      sx={{
                        color: "white", // sets the color of the select input text
                        "& .MuiSvgIcon-root": {
                          // targets the dropdown arrow icon specifically
                          color: "white", // sets the color of the dropdown arrow
                        },
                      }}
                      MenuProps={{
                        autoFocus: false,
                        PaperProps: {
                          style: {
                            height: "125px",
                            overflowY: "scroll",
                          },
                        },
                      }}
                    >
                      {files.map((file) => (
                        <MenuItem key={file} value={file}>
                          {file}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                ""
              )}

              {uploadedFileName && isCompare && (
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
            {isCompare && (
              <div style={{color: "white"}}>
                <div style={{ marginBottom: "10px"}}>
                  <label htmlFor="temperature-slider">Temperature Adjustment for Comparisons: {parseFloat(temp.toFixed(1))}</label>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>0</span>
                  <input
                    style={{ flex: 1 }}
                    type="range"
                    id="temperature-slider"
                    defaultValue={0}
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => {
                      setTemp(Number(e.target.value));
                    }}
                  />
                  <span style={{ marginLeft: "10px" }}>1</span>
                </div>
              </div>
            )}

            {isCompare && firstFile && (
              <button
                type="submit"
                onClick={handleCompareSubmit}
                disabled={!secondFileName}
                className={`mt-3 w-3/4 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm ${
                  secondFileName ? "hover:bg-blue-700" : "opacity-80 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            )}

            {doneProcessing && (
              <div
                className="file-preview-content mt-4 p-4 bg-white bg-opacity-10 text-white overflow-y-auto max-h-96 w-full"
                style={{ marginTop: 40, border: "1px solid #D1D5DB", resize: "vertical" }}
              >
                <h2>Output: </h2>
                <h4>{output}</h4>
              </div>
            )}

            {isSummarize || isParse ? (
              <>
                <div className="flex flex-col items-center mt-4">
                  <label htmlFor="document-name" className="text-white font-bold mb-2">
                    What do you want to call this document?
                  </label>
                  <input
                    id="document-name"
                    type="text"
                    placeholder="Enter here"
                    value={savedDocumentName}
                    onChange={handleDocumentNameChange}
                    className="text-black w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    type="submit"
                    onClick={handleSubmitButton}
                    disabled={submitDisabled}
                    className={`mt-3 w-3/4 bg-buttonColor text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm ${
                      !submitDisabled ? "hover:bg-hoverColor" : "opacity-80 cursor-not-allowed"
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              ""
            )}
            {isProcessing && <h2 className="text-white text-lg">Processing...</h2>}
            {isParse && options.dates && !isProcessing && firstFile !== null && (
              <div className="flex flex-col items-center justify-center">
                <button className="bg-buttonColor text-normal text-white text-sm font-bold py-2 px-7 rounded mt-4" onClick={onExportClick}>
                  Export to Google Calendar
                </button>
              </div>
            )}
            {/* <div className="overflow-x-scroll overflow-y-hidden max-w-screen-lg mt-10 max-h-80">
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
 */}
            {/* <ScrollingChat
          fileContent={firstFileContent}
          message={Object.values(messages).map((msg) => ({
            message: msg,
            sentTime: new Date().toISOString(),
            sender: "Support",
            direction: "incoming",
            position: "single",
          }))}
        /> */}

            {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogContent>
            <IconButton aria-label="close" onClick={handleCloseDialog} style={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
            <div className="bg-white bg-opacity-10 p-4">
              <FormattedMessage message={dialogContent.text} />
            </div>
          </DialogContent>
        </Dialog> */}
          </div>
        </div>
      )}
      {isSubmitted && (
        <div className="flex flex-col items-center justify-end h-screen w-full">
          <h3 className="text-4xl text-white mb-6">
            {isSummarize
              ? `Summarizing ${uploadedFileName}`
              : isParse
              ? `Processing ${uploadedFileName}`
              : `Comparing ${uploadedFileName} and ${secondFileName}`}
          </h3>
          <Chat messages={messages} doc_id={documentID!} />
        </div>
      )}
    </main>
  );
};

export default Home;
