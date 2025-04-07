"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useCallback } from "react";

export default function BlogEditor({
  onContentChange,
}: {
  onContentChange?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "bg-[#212a3e] p-2 rounded text-sm text-white",
          },
        },
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] bg-white text-black rounded-md p-4 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onContentChange?.(editor.getHTML());
    },
  });

  const isBold = editor?.isActive("bold");
  const isItalic = editor?.isActive("italic");
  const isUnderline = editor?.isActive("underline");
  const isCodeBlock = editor?.isActive("codeBlock");
  const isHeading1 = editor?.isActive({ level: 1 });
  const isHeading2 = editor?.isActive({ level: 2 });

  const setColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="space-y-2 bg-white">
      {/* Toolbar */}
      <div className="flex gap-4 py-2 px-4 border-b-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${
            isBold ? "font-bold " : ""
          }text-md w- border-[1px border-[#212a35] text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${
            isItalic ? "font-bold " : ""
          } text-md w-8 h-8 italic  rounded-sm  text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${
            isUnderline ? "font-bold" : ""
          } text-md w-8 h-8  rounded-sm  text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${
            isCodeBlock ? "font-bold" : ""
          } text-md w-8 h-8  rounded-sm  text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Code Block"
        >
          {"</>"}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${
            isHeading1 ? "font-bold" : ""
          } text-md w-8 h-8  rounded-sm  text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Heading 1 (H1)"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${
            isHeading2 ? "font-bold" : ""
          } text-md w-8 h-8  rounded-sm  text-[#212a35] cursor-pointer hover:text-[#ff7e29] transition`}
          title="Heading 2 (H2)"
        >
          H2
        </button>
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => setColor(e.target.value)}
          className="cursor-pointer w-8 h-8"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
