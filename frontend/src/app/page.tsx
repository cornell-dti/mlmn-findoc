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
      <div className="flex flex-col items-center justify-center h-full pt-32">
        <h1 className="text-4xl text-white mb-6">Welcome to dtigpt™ :)</h1>
        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg px-6 pt-4 pb-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col align-center justify-center text-center"
          >
            <div className="flex flex-col align-center text-white font-bold rounded mb-3 justify-center cursor-pointer">
              <Image
                src="/icons/upload-file.png"
                alt="Upload"
                className="mx-auto"
                width={50}
                height={50}
              />
              <label className=" text-sm -mb-2">Upload new file</label>
            </div>
            <span className="text-gray-500 text-center font-semibold text-sm min-w-min">
              Drag and drop <br />
              or choose a file to upload
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </main>
  );
}
