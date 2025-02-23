"use client";

import { MainWrapper } from "~/components/ui/main-wrapper";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useState, useCallback } from "react";

export default function DashboardPage() {
  const editor = useCreateBlockNote();
  const [html, setHTML] = useState<string>("");

  const onChange = useCallback(async () => {
    // Log the editor's document content
    console.log("Editor document:", editor.document);

    // Converts the editor's contents from Block objects to HTML and store to state.
    const htmlContent = await editor.blocksToFullHTML(editor.document);

    // Log the converted HTML content
    console.log("Converted HTML:", htmlContent);

    setHTML(htmlContent);
  }, [editor]);

  return (
    <MainWrapper>
      <BlockNoteView editor={editor} onChange={onChange} />
      <div className="bn-container">
        <div
          className="bn-default-styles"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </MainWrapper>
  );
}
