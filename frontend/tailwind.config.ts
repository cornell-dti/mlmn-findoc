import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainContent: '#231F1E',
        sidebar: '#000000',
        sidebarText: '#73710',
        sidebarTextActive: '#ffffff',
      }
    },
  },
  plugins: [],
};
export default config;
