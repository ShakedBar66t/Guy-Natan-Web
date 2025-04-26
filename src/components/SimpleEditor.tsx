'use client';

import React, { useState, useEffect } from 'react';

interface SimpleEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  height?: string;
}

export default function SimpleEditor({
  initialContent = '',
  onChange,
  height = '300px'
}: SimpleEditorProps) {
  const [content, setContent] = useState(initialContent);

  // Update content when initialContent prop changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ height, resize: 'vertical' }}
        placeholder="Enter text here..."
      />
    </div>
  );
} 