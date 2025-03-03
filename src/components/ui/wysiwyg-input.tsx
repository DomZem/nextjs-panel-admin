"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog";
import { FilePenLine } from "lucide-react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { Button } from "./button";

export const WysiwygInput = ({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (data: string) => void;
  id?: string;
}) => {
  const editor = useCreateBlockNote({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    initialContent: value ? JSON.parse(value) : undefined,
  });

  return (
    <Dialog>
      <div className="flex h-9 w-full items-center gap-3 rounded-md border border-input px-3 shadow-sm">
        <input
          value={value || ""}
          disabled
          id={id}
          className="flex-1 bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <DialogTrigger asChild>
          <Button className="size-8" variant="ghost" size="icon">
            <FilePenLine />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Text Editor</DialogTitle>
          <DialogDescription className="sr-only">
            Use the text editor to edit the content
          </DialogDescription>
        </DialogHeader>

        <BlockNoteView
          editor={editor}
          onChange={() => {
            onChange(JSON.stringify(editor.document));
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
