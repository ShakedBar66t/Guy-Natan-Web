'use client';

import { useEffect, useState } from 'react';

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

export default function QuillEditor({ 
  value, 
  onChange, 
  placeholder = 'כתוב כאן...',
  height = '300px' 
}: QuillEditorProps) {
  const [editorValue, setEditorValue] = useState(value);

  // Update internal state when prop value changes
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // Handle editor content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setEditorValue(content);
    onChange(content);
  };

  return (
    <div dir="rtl">
      <textarea
        value={editorValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ 
          height,
          width: '100%',
          direction: 'rtl',
          textAlign: 'right',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem'
        }}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
} 