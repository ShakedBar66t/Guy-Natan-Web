'use client';

import React, { useState, useEffect } from 'react';

interface HebrewEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const HebrewEditor: React.FC<HebrewEditorProps> = ({ 
  initialValue = '', 
  onChange, 
  placeholder = 'תתחילו לכתוב כאן...',
  height = '300px'
}) => {
  const [content, setContent] = useState(initialValue);
  
  // Update content when initialValue changes
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div dir="rtl">
      <textarea
        value={content}
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
};

export default HebrewEditor; 