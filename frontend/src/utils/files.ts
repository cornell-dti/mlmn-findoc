import { Content } from "@/types";

async function uploadFile(file: File | File[], endpoint: string, options: { [key: string]: boolean }): Promise<Response> {
    const formData = new FormData();
    if (file instanceof File) {
        formData.append("file", file);
    } else {
        file.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });
    }

    formData.append("options", JSON.stringify(options));
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
    });
    return response;
}

async function processResponse(response: Response, setMessages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, setDocumentID: React.Dispatch<React.SetStateAction<string | null>>): Promise<void> {
    if (response.ok && response.body) {
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            console.log(value)
            const content: Content = JSON.parse(value);
            console.log(content)
            for (const [key, value] of Object.entries(content)) {
                if (key === "get_dates") {
                    const text = value[0]
                    console.log(value[1])
                    setDocumentID(value[1]);
                    const dates = processDatesResponse(text, setMessages);
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [key]: dates,
                    }));
                    continue;
                }
                let messageSection = "";
                const text = value[0]
                const words = text.split(" ");
                for (let index = 0; index < words.length; index++) {
                    messageSection += words[index] + (index < words.length - 1 ? " " : "");
                }
                messageSection += "\n\n\n";
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [key]: messageSection,
                }));
            }
        }
    }
}

function processDatesResponse(content: string, setMessages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>): string {
    setMessages((prevMessages) => ({
        ...prevMessages,
        ["dates"]: content,
    }));
    const dates = JSON.parse(content);

    let markdown = "";

    for (const key in dates) {
        const items = dates[key];
        markdown += `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n\n`;

        for (let item of items) {
            markdown += `### ${item.summary}\n\n`;
            markdown += `**Start Date:** ${item.start_datetime}\n\n`;
            markdown += `**End Date:** ${item.end_datetime}\n\n`;
            markdown += `**Location:** ${item.location ?? 'N/A'}\n\n`;
            markdown += `**Description:** ${item.description ?? 'No description provided.'}\n\n`;
            if (item.email_reminder_minutes) {
                markdown += `**Email Reminder Minutes:** ${item.email_reminder_minutes}\n\n`;
            }
        }
    }

    return markdown;
}

export { uploadFile, processResponse };