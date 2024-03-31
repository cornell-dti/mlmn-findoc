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

async function processResponse(response: Response, setMessages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>): Promise<void> {
    if (response.ok && response.body) {
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            const content: Content = JSON.parse(value);
            for (const [key, value] of Object.entries(content)) {
                if (key === "get_dates") {
                    const dates = processDatesResponse(value, setMessages);
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [key]: dates,
                    }));
                    continue;
                }
                let messageSection = "";
                const words = value.split(" ");
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
    let markdown = "## Events\n\n";
    console.log(dates);

    for (let event of dates.events) {
        markdown += `### ${event.summary}\n\n`;
        markdown += `**Start Date:** ${event.start_datetime}\n\n`;
        markdown += `**End Date:** ${event.end_datetime}\n\n`;
        markdown += `**Location:** ${event.location}\n\n`;
        markdown += `**Description:** ${event.description}\n\n`;
        markdown += `**Email Reminder Minutes:** ${event.email_reminder_minutes}\n\n`;
    }

    return markdown;
}



export { uploadFile, processResponse };