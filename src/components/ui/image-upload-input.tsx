"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { CloudUpload, LoaderCircle } from "lucide-react";
import { Label } from "./label";
import { Button } from "./button";
import { useDropzone } from "react-dropzone";

export const ImageUpload = ({
  onUploadComplete,
}: {
  onUploadComplete?: (url: string | null) => void;
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null,
  );

  const handleImageUpload = async (image: File) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulates a 2-second delay

      // Simulate a successful upload response
      const fakeResponse = {
        success: true,
        message: "Image uploaded successfully",
        url: `/image-speaker-zx9.png`,
      };

      setUploadedImagePath(fakeResponse.url);
      if (onUploadComplete) {
        onUploadComplete(fakeResponse.url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const image = acceptedFiles.at(0);
    if (!image) return;
    void handleImageUpload(image);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className="space-y-3 focus:outline-none" {...getRootProps()}>
      <div className="cursor-pointer rounded-md border-2 border-dashed p-4">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LoaderCircle className="animate-spin" />
            <p className="text-sm font-medium leading-none">Uploading...</p>
          </div>
        ) : uploadedImagePath ? (
          <div className="space-y-2 text-center">
            <Image
              width={1000}
              height={1000}
              src={uploadedImagePath}
              className="max-h-16 w-full object-contain opacity-70"
              alt="uploaded image"
            />
            <p className="text-sm font-medium leading-none">Image Uploaded</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-md border p-2">
              <CloudUpload />
            </div>

            <Label htmlFor="image-upload">Drag an image</Label>

            <input
              id="image-upload"
              className="focus:outline-none"
              accept="image/png, image/jpeg"
              disabled={isLoading}
              {...getInputProps()}
            />
          </div>
        )}
      </div>

      {uploadedImagePath && (
        <Button
          className="w-full"
          type="button"
          variant="secondary"
          onClick={() => {
            setUploadedImagePath(null);
            if (onUploadComplete) {
              onUploadComplete(null);
            }
          }}
        >
          Remove
        </Button>
      )}
    </div>
  );
};
