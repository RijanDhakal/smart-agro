import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaImage } from "react-icons/fa6";

export default function Dropzone({
  onChange,
  prompt,
}: {
  onChange: (file: File) => void;
  prompt?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
          setPreview(reader.result as string);
        };

        reader.readAsDataURL(file);
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      className="h-64 aspect-video border-2 border-dashed flex flex-col items-center justify-center rounded-xl cursor-pointer hover:border-primary transition-all duration-300"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <img
            src={preview}
            alt="Citizenship preview"
            className="w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <FaImage className="text-2xl" />
          <p className="text-xs text-center px-2">{prompt}</p>
        </div>
      )}
    </div>
  );
}
