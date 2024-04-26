export type Page = {
  index: number;
  name: string;
  route: string;
  description: string;
  icon: string;
};

export type Message = {
  sender: string;
  content: string;
  pfp: string;
  timestamp: Date;
};

export type Content = { [key: string]: string };
