"use client";

import { useRef } from "react";
import UploadIcon from "@/components/icons/upload-icon.svg";

interface FileUploadProps {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
}

export default function FileUpload({ onFileSelect, accept = ".obj,.stl,.step" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect?.(e.target.files);
  };

  return (
    <div className="w-full border-[2px] border-dashed border-(--color-border-primary) rounded-[15px] p-12 flex flex-col items-center justify-center gap-6">
      <UploadIcon className="w-[52px] h-[51px]" style={{ fill: "#64748B" }} />
      <p className="text-[24px] font-medium text-(--color-text-primary)">
        Upload 3D files (.obj, .stl, .step)
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="px-6 py-2 bg-(--color-text-secondary) text-(--color-text-primary) rounded-md text-[22px] font-semibold hover:opacity-90 transition-opacity"
      >
        Select file
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </div>
  );
}
