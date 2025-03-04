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
    <div>
      <form onSubmit={handleSubmitWithDocumentId} className="flex gap-2">
        <label
          htmlFor="file-upload"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md flex items-center justify-center cursor-pointer"
        >
          <span className="text-white">Upload PDF</span>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <input
          type="text"
          className="flex-1 p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          className="px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 drop-shadow-md flex items-center justify-center"
        >
          <img src="/file.png" alt="Send" className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default Ask;
