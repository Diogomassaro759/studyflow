"use client";

import { useState } from "react";

export default function PDFs() {
  const [files, setFiles] = useState<File[]>([]);

  function upload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    setFiles([...files, file]);
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">
        📚 Meus PDFs
      </h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={upload}
      />

      <ul className="mt-4 space-y-2">

        {files.map((file, i) => (
          <li key={i} className="bg-white p-3 rounded shadow">

            {file.name}

          </li>
        ))}

      </ul>

    </div>
  );
}
