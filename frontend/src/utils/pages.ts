import { Page } from "@/types";

const pages: Page[] = [
    {
        index: 0,
        name: "Dashboard",
        route: "/",
        description: "Dashboard",
        icon: "/icons/dashboard.png",
    },
    {
        index: 1,
        name: "Algo Syllabus",
        route: "/chat/algo-syllabus",
        description: "Algo Syllabus",
        icon: "/icons/algo.png",
    },
    {
        index: 2,
        name: "Q3 KPIs",
        route: "/chat/q3-kpis",
        description: "Q3 KPIs",
        icon: "/icons/q3.png",
    },
    {
        index: 3,
        name: "Challenges",
        route: "/chat/challenges",
        description: "Challenges",
        icon: "/icons/challenges.png",
    },
    {
        index: 4,
        name: "Classes",
        route: "/chat/classes",
        description: "Classes",
        icon: "/icons/classes.png",

    },
    {
        index: 5,
        name: "Timetable",
        route: "/chat/timetable",
        description: "Timetable",
        icon: "/icons/timetable.png",
    },
    {
        index: 6,
        name: "Notifications",
        route: "/chat/notifications",
        description: "Notifications",
        icon: "/icons/notifications.png",
    }
];


export default pages;