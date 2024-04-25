import { Page } from "@/types";

const pages: Page[] = [
    {
        index: 0,
        name: "Summarize",
        route: "/chat/summarize",
        description: "Summarize",
        icon: "/icons/summarize.png",
    },
    {
        index: 1,
        name: "Parse",
        route: "/chat/parse",
        description: "Parse",
        icon: "/icons/parse.png",
    },
    {
        index: 2,
        name: "Compare",
        route: "/chat/compare",
        description: "Compare",
        icon: "/icons/compare.png",
    }
];


export default pages;