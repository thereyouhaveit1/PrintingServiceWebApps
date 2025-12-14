"use client";

import React, { useState, useEffect } from "react";
import Editor from "./Editor";   
import ColorPlugin from 'editorjs-text-color-plugin';

const App: React.FC = () => {
  const initialData = {
    blocks: [
      {
        type: "paragraph",
        data: {
          text: "Hello, this is the initial content loaded from JSON!",
        },
      },
    ],
    version: "2.28.2",
  };

  const [orderData, setOrderState] = useState<Record<string, any>>({
    frontEditorData: initialData, // Set the initial editor data
  });
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set client-side flag to true after mounting
  }, []);

  return (
    <div style={{ display: "flex", gap: "0px" }}>
      <div>
        {/* This will only render on the client side */}
        {isClient && (
          <Editor
            initialData={orderData.frontEditorData}
            onSave={(data) => setOrderState((prev) => ({ ...prev, frontEditorData: data }))}
            paperOptions={[]}   
            productName={[]}   
            quantityOptions={[]} 
            onSubmit={(data) => { 
              console.log('Form Submitted', data);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;