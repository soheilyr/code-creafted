import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AvatarDefault from "@/public/icon/avatar.webp";
import { Bookmark, Pen } from "lucide-react";
import FollowBtn from "./_components/FollowBtn";

const BlogDetailPage = async ({ params }) => {
  const { id } = await params;
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const { data: blogDetail } = await res.json();

  return (
    <div className="container mx-auto p-[32px] bg-white shadow-sm roudned-md my-20">
      <Image
        width={400}
        height={250}
        alt=""
        src={blogDetail.imageUrl}
        className="w-full rounded-2xl mb-[24px] max-h-[500px] object-cover"
      />
      <div className="flex mb-8 divide-x-2 gap-3 items-center ">
        <div className="flex items-center gap-[24px] pr-3">
          {/* Author Info */}
          <div className="flex items-center gap-4">
            <Image
              src={blogDetail.author?.avatr ?? AvatarDefault}
              alt={blogDetail.author.name}
              width={48}
              height={48}
              className="rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <p className="text-lg font-bold text-gray-800">
                {blogDetail.author.name}
              </p>
              <span className="gap-2 text-gray-400 flex items-center">
                <Pen className="w-[12px]" />
                {new Date(blogDetail.createdAt)
                  .toISOString()
                  .split("T")[0]
                  .replaceAll("-", "/")}
              </span>
            </div>
          </div>

          {/* Follow Button */}
          <FollowBtn id={blogDetail.author.id} />
        </div>
        <div className="flex items-center">
          <button>
            <Bookmark className="text-gray-500 hover:translate-y-[-2px] hover:fill-gray-500 hover:scale-105 cursor-pointer transition-all" />
          </button>
        </div>
      </div>

      <h1 className="font-bold !text-[64px] mb-[32px] border-b-2">
        {blogDetail.title}
      </h1>

      {/* <div className="flex items-center gap-4 mb-8">
        <Image
          src={blogDetail.author?.avatr ?? AvatarDefault}
          alt={blogDetail.author.name}
          width={48}
          height={48}
          className="rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div>
          <p className="text-sm text-gray-500">Written by</p>
          <p className="text-lg font-semibold text-gray-800">
            {blogDetail.author.name}
          </p>
        </div>
      </div> */}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.75rem",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ lineHeight: "1.6", marginBottom: "1rem" }}>
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              style={{ color: "#3b82f6", textDecoration: "underline" }}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: "0.25rem" }}>{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #ddd",
                paddingLeft: "1rem",
                fontStyle: "italic",
                color: "#555",
                marginBottom: "1rem",
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code
                style={{
                  backgroundColor: "rgba(240, 240, 240, 0.8)", // Subtle background for inline code
                  padding: "0.2em 0.4em",
                  borderRadius: "6px", // Slightly larger radius for smooth edges
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  fontSize: "0.9em", // Slightly smaller font size for inline code
                  color: "#d73a49", // A vibrant color to highlight inline code
                  border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border for distinction
                }}
              >
                {children}
              </code>
            ) : (
              <pre
                style={{
                  backgroundColor: "#1e1e1e", // Dark theme for block code
                  color: "#d4d4d4", // Light text for contrast
                  padding: "1.5rem", // Increased padding for better spacing
                  borderRadius: "12px", // Larger radius for a modern look
                  overflowX: "auto", // Horizontal scrolling for long lines
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  fontSize: "1rem", // Standard font size for block code
                  lineHeight: "1.5", // Improved line height for readability
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)", // Subtle shadow for depth
                  marginBottom: "1.5rem", // Spacing below the block
                }}
              >
                <code>{children}</code>
              </pre>
            ),
          table: ({ children }) => (
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md my-4">
              {children}
            </table>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-300 hover:bg-gray-50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-4 py-2">{children}</td>,
          img: ({ src, alt }) => (
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                margin: "1rem 0",
              }}
            />
          ),
        }}
        children={blogDetail.content}
      />
    </div>
  );
};
export default BlogDetailPage;
