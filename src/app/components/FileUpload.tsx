"use client";

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: Array<{file: File, url: string, type: 'gltf' | 'obj' | 'stl'}>) => void;
  accept?: string;
}

export default function FileUpload({ onFileSelect, accept = ".gltf,.glb,.obj,.stl" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getFileType = (filename: string): 'gltf' | 'obj' | 'stl' => {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'gltf' || ext === 'glb') return 'gltf';
    if (ext === 'obj') return 'obj';
    if (ext === 'stl') return 'stl';
    return 'gltf';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileData = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file),
        type: getFileType(file.name)
      }));
      onFileSelect(fileData);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fileData = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file),
        type: getFileType(file.name)
      }));
      onFileSelect(fileData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-[#4a9eff] bg-[#4a9eff]/10'
          : 'border-[#333b45] hover:border-[#4a9eff]/50'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      
      <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
      
      <p className="text-slate-300 font-medium mb-2">
        Click to upload or drag and drop
      </p>
      <p className="text-slate-500 text-sm">
        GLTF, GLB, OBJ, or STL files
      </p>
    </div>
  );
}
