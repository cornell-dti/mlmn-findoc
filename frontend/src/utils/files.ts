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
    if (response.body) {
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            setMessages((prevMessages) => [...prevMessages, value.toString()]);
        }
    }
}


export { uploadFile, processResponse };