"use client";
import Image from "next/image";

export default function Home() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(files);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl text-white mb-6">Welcome to dtigpt™ :)</h1>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-lg p-6">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-3">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-lg">+</span> Upload new file
            </label>
          </button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <span className="text-gray-400">
            Drag and drop or choose a file to upload
          </span>
        </div>
      </div>
    </main>
  );
}
