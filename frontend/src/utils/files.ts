import { Content } from "@/types";

async function uploadFile(file: File | File[], endpoint: string): Promise<Response> {
    const formData = new FormData();
    if (file instanceof File) {
        formData.append("file", file);
    } else {
        file.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
    });
    return response;
}

async function processResponse(response: Response, setMessages: React.Dispatch<React.SetStateAction<string[]>>): Promise<void> {
    if (response.ok) {
        const content: Content = await response.json();
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        for (const [key, value] of Object.entries(content)) {
            setMessages((prevMessages) => [...prevMessages, key + ":\n"]);
            const words = value.split(" ");
            for (let index = 0; index < words.length; index++) {
                await delay(20);
                setMessages((prevMessages) => [...prevMessages, words[index] + (index < words.length - 1 ? " " : "")]);
            }
            setMessages(prevMessages => [...prevMessages, "\n\n\n"]);
        }
    }
}


export { uploadFile, processResponse };