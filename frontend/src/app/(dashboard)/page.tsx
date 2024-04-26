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
import './page.css';
import { TbRuler } from "react-icons/tb";

const summary_options = ["Policies", "Dates", "Summary", "Resources", "Instructors"];
const kpi_options = ["course_instructors", "office_hours", "lectures", "description", "learning_objectives", "prerequisites"];
const kpiHighlightMapping = {
  course_instructors: "Eshan Chattopadhyay",
  office_hours: "Monday 10:30am-11:30am, Thursday 1:30pm-2:30pm.",
  lectures: "MWF 9:05am-9:55am, Uris Hall G01.",
  description: `This course develops techniques used in the design and analysis of algorithms, with an empha-
sis on problems arising in computing applications. Example applications are drawn from sys-
tems and networks, artificial intelligence, computer vision, data mining, and computational bi-
ology. This course covers four major algorithm design techniques (greedy algorithms, divide and
conquer, dynamic programming, and network flow), computability theory focusing on undecid-
ability, computational complexity focusing on NP-completeness, and algorithmic techniques for
intractable problems, including identification of structured special cases, approximation algo-
rithms, and local search heuristics. This course continues to build on work in previous courses
on proofwriting and asymptotic runtime analysis of algorithms.`,
  learning_objectives: `On completing this course, students should be able to:
• Identify problems solvable with a greedy algorithm, design and prove the correctness of
such an algorithm, and supply asymptotic running time for a variety of given algorithms.
• Recognize problems to which divide and conquer or dynamic programming approaches
may apply, design algorithms with these approaches, and analyze their computational ef-
ficiency;`, // Continue the text as necessary
  prerequisites: `The prerequisites for the course are, either having an A- or better in both CS 2800 and CS 2110,
or having successfully completed all three of CS 2800, CS 2110, and CS 3110. We assume that
everyone is familiar with the material in CS 2110, CS 3110, and CS 2800, and we will use it as nec-
essary in CS 4820`, // Continue the text as necessary
};

interface HomeProps {
  function: string;
}

const Home: React.FC<HomeProps> = (props) => {
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [secondFileName, setSecondFileName] = useState<string>("");
  const [firstFile, setFirstFile] = useState<File | null>(null);
  const [firstFileContent, setFirstFileContent] = useState("");
  const [savedDocumentName, setSavedDocumentName] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const isSummarize = props.function === "summarize"
  const isParse = props.function === "parse"
  const isCompare = props.function === "compare"
  const [file, setFile] = React.useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);



  const options_to_use = summary_options.reduce((acc: any, option) => {
    acc[option] = false;
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

  const handleDocumentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSavedDocumentName(event.target.value);
  };

  const handleSubmitButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(savedDocumentName);
    setIsSubmitted(true);
  };

  const handleOptionChange = (option: string) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
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
      setIsProcessing(true);

      const reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = async (e) => {
        if (e && e.target && e.target.result) {
          const text = e.target.result.toString();
          setFirstFileContent(text); // Store the content in the state
        } else {
          console.error("Failed to load the file content.");
          setFirstFileContent("");
        }
      };

      try {
        setSubmitDisabled(false);
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

  const handleDropDownChange = (event: SelectChangeEvent) => {
    setFile(event.target.value as string);
    setSubmitDisabled(false);
  };

  async function getFileHistory(): Promise<string[]> {
    const response = await supabase
      .from("user-doc")
      .select("*")
      .eq("userID", 9);

    // Map the response data to extract the "docID" values
    return response.data?.map(val => val["docID"]) as string[];
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
      <div className="flex flex-col items-center justify-center h-full pt-2">
        <h1 className="text-4xl text-white mb-6">
          {isSummarize ? "What do you want to summarize?" : ""}
          {(!firstFileContent && isParse) ? "What do you want to parse?" : ""}
          {isCompare ? "What do you want to compare?" : ""}
          {(firstFileContent && isParse) ? "Select all information you want to parse" : ""}
        </h1>


        {(firstFileContent && isParse) ? (
          <div className="flex justify-center gap-5 w-full" style={{ marginBottom: "20px" }}>
            {summary_options.map((option, index) => (
              <div key={index}
                onClick={() => handleOptionChange(option)}
                className={`rounded-md shadow cursor-pointer p-4 transition-colors duration-300 ${options[option] ? "selected-background" : "default-background"} border border-gray-200 flex flex-col items-center justify-center flex-grow`}
                style={{ width: '150px', height: '75px', minWidth: '150px', minHeight: '75px', maxWidth: '150px', maxHeight: '75px' }}
              >
                <div className="text-white text-lg font-medium">
                  {option}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        {((!firstFileContent && isParse) || isSummarize || isCompare) ? (
          <div className="flex w-full justify-center gap-4 mb-4">
            <div
              className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 ${isProcessing ? ".default-background" : ".default-background"
                } max-w-sm`}
            >
              <label htmlFor="first-file-upload" className="flex flex-col align-center justify-center text-center">
                <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
                  <Image src="/icons/upload-file.png" alt="Upload" className="mx-auto" width={50} height={50} />
                  {(uploadedFileName) ? (
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
          </div>
        ) : (
          ""
        )}

        <div className="flex w-full flex-col justify-center gap-4 mb-4">
          {/* <div className="flex w-full justify-center gap-4 mb-4">
            <div
              className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 ${isProcessing ? "bg-gray-200" : "bg-transparent"
                } max-w-sm`}
            >
              <label htmlFor="first-file-upload" className="flex flex-col align-center justify-center text-center">
                <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
                  <Image src="/icons/upload-file.png" alt="Upload" className="mx-auto" width={50} height={50} />
                  {(uploadedFileName) ? (
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
          </div> */}

          {isSummarize ? (
            <>
              <div className="text-white" style={{ marginTop: "65px" }}>
                or
              </div>
              <div
                className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 ${isProcessing ? "bg-gray-200" : "bg-transparent"
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
            </>
          ) : (
            ""
          )}

          {
            uploadedFileName && isCompare && (
              <div
                className={`flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6 bg-transparent ${isProcessing ? "bg-gray-200" : "bg-transparent"
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
            )
          }
        </div >

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
                className={`mt-3 w-3/4 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm ${!submitDisabled ? 'hover:bg-blue-700' : 'opacity-80 cursor-not-allowed'
                  }`}              >
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
            <button className="bg-button-color text-white font-bold py-2 px-4 rounded mt-4" onClick={onExportClick}>
              Export to Google Calendar
            </button>
          </div>
        )} */}
        {/* {Object.values(options).some(value => value) && !isProcessing && firstFile !== null && (
          <div className="flex flex-col items-center justify-center">
            <button className="gray text-white font-bold py-2 px-4 rounded mt-4" onClick={onSubmitParse}>
              Submit
            </button>
          </div>
        )} */}
        {
          !isProcessing && firstFile !== null && (
            <div className="flex flex-col items-center justify-center">
              <button className={`${Object.values(options).some(value => value) ? "selected-background" : "default-background"} text-white font-bold py-2 px-4 rounded mt-4`} onClick={onSubmitParse}>
                Submit
              </button>

            </div>
          )
        }
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
        </div> */}
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


      {isSubmitted && (
        // {isSubmitted && firstFileContent && (
        <>
          <h3 className="text-4xl text-white mb-6" style={{ marginTop: "30px" }}>
            Chat
          </h3>
          {/* <Chat messages={[]} doc_id={448985163764905353} /> */}
          <Chat messages={[]} doc_id={448985163764905353} />
        </>
      )}
    </main >
  );
};

export default Home;
