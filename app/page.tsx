import BlogsSlider from "@/components/common/BlogSlider";
import HeroSection from "@/components/pages/hmoe/HeroSection";
import Image from "next/image";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/blog");
  const blogs = await res.json();
  return (
    <>
      <HeroSection />
      <div className="container mx-auto my-5 bg-white shadow-sm p-10 rounded-md">
        <h1 className="flex gap-3 justify-center items-center text-[36px] font-bold text-center text-[#384967] mb-[40px]">
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
          Latest Blog
          <div className="h-[2px] w-[20px] bg-[#384967]"></div>
        </h1>
        <BlogsSlider blogs={blogs.data} />

        <Image
          width={400}
          height={250}
          alt=""
          src={blogs.data[0].imageUrl}
          className="w-full rounded-2xl mb-[24px] max-h-[500px] object-cover"
        />
        <h1 className="font-bold !text-[64px] border-b-2 mb-[32px]">
          {blogs.data[0].title}
        </h1>

        <ReactMarkDown
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
          children={blogs.data[1].content}
        />
        {/* <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} />
          <BlogCard blog={sampleContent[0]} /> */}
      </div>
    </>
  );
}
