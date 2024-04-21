import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import {
  MarkdownH1,
  MarkdownH2,
  MarkdownCode,
  MarkdownImage,
  MarkdownLink,
  MarkdownList,
  MarkdownParagraph,
  MarkdownTable,
  MarkdownTableCell,
  MarkdownListItem,
  MarkdownH3,
} from "@/components/Markdown";

function FormattedMessage({ message }: { message: any }) {
  const formatContent = (text: string) => {
    return (
      <ReactMarkdown
        components={{
          code: MarkdownCode,
          a: MarkdownLink,
          table: MarkdownTable,
          img: MarkdownImage,
          th: MarkdownTableCell,
          td: MarkdownTableCell,
          h1: MarkdownH1,
          h2: MarkdownH2,
          h3: MarkdownH3,
          li: MarkdownListItem,
        }}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return <div className="m-3">{formatContent(message)}</div>;
}

export default FormattedMessage;
