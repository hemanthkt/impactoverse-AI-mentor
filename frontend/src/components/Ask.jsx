import { ArrowUp, Plus, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

function Ask({ handleSubmit, messages, setMessages }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("PDF uploaded:", file.name);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  useEffect(() => {
    if (!pdfFile) {
      return;
    }

    const parsePDF = async () => {
      const formData = new FormData();
      formData.append("file", pdfFile);

      try {
        const response = await fetch("http://127.0.0.1:8000/parse", {
          method: "POST",
          body: formData,
        });

        console.log(pdfFile, "sent to backend");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to parse PDF");
        }

        const data = await response.json();
        console.log("Document ID received:", data.document_id);
        setDocumentId(data.document_id);
        alert("PDF processed successfully");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };

    parsePDF();
  }, [pdfFile]);

  const handleSubmitWithDocumentId = (e) => {
    e.preventDefault();
    console.log(e, documentId);

    handleSubmit(e, documentId);
  };

  return (
    // <div className="z-10  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
    //   <form onSubmit={handleSubmitWithDocumentId} className="flex gap-2">
    //     <label
    //       htmlFor="file-upload"
    //       className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md flex items-center justify-center cursor-pointer"
    //     >
    //       <span className="text-white">Upload PDF</span>
    //       <input
    //         id="file-upload"
    //         type="file"
    //         accept=".pdf"
    //         className="hidden"
    //         onChange={handleFileUpload}
    //       />
    //     </label>
    //     <input
    //       type="text"
    //       // className="w-full max-w-3xl p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
    //       value={messages}
    //       onChange={(e) => setMessages(e.target.value)}
    //       placeholder="Ask anything..."
    //     />
    //     <button
    //       type="submit"
    //       className="px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md flex items-center justify-center"
    //     >
    //       <img src="/file.png" alt="Send" className="w-5 h-5" />
    //     </button>
    //   </form>
    // </div>

    <div className="flex w-2/4 z-10 flex-col space-y-4 bg-[#17142B] p-4 backdrop-blur-md rounded-xl border border-slate-100/30 shadow-md">
      <form
        onSubmit={handleSubmitWithDocumentId}
        className="flex flex-col space-y-3"
      >
        <div className="">
          <div className="flex items-center  bg-[#1E1B3A] border border-gray-600 rounded-2xl p-3 shadow-sm">
            <input
              type="text"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white p-2 outline-none text-m"
            />
            <div className="flex justify-start rounded-full">
              <button
                type="submit"
                className="px-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md flex items-center justify-end"
              >
                <ArrowUp />
              </button>
            </div>
          </div>
          <div className="p-3 flex justify-start w-20 h-15">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center border border-gray-600 rounded-full p-3 text-white bg-[#1E1B3A] cursor-pointer hover:bg-[#29264A] transition duration-300"
            >
              <Upload />
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Ask;
