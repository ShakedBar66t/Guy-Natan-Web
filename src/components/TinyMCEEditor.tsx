'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Loader from './Loader';

interface TinyMCEEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  height?: string;
}

const TinyMCEEditor = ({ initialContent, onChange, height = '300px' }: TinyMCEEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (editorRef.current) {
        const currentContent = editorRef.current.getContent();
        if (currentContent !== initialContent) {
          e.preventDefault();
          e.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [initialContent]);

  const handleInit = (evt: any, editor: any) => {
    editorRef.current = editor;
    setIsLoading(false);
    
    // Apply fix for cursor jumping issue (GitHub issue #6456)
    if (editor && editor.editorManager) {
      try {
        // Override the function that causes cursor to jump
        const originalFn = editor.editorManager.hasBetterMouseTarget;
        if (typeof originalFn === 'function') {
          editor.editorManager.hasBetterMouseTarget = function(targetElm: any, sourceElm: any) {
            // Add condition to prevent jump
            if (targetElm && sourceElm) {
              return originalFn(targetElm, sourceElm);
            }
            return false;
          };
        }
      } catch (e) {
        console.warn('Could not apply TinyMCE cursor jump fix:', e);
      }
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <Loader type="spinner" size="medium" text="טוען עורך..." />
        </div>
      )}
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={handleInit}
        value={initialContent}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | ltr rtl',
          content_style: 'body { font-family:Arial,Helvetica,sans-serif; font-size:14px; direction: rtl; }',
          directionality: 'rtl',
          language: 'he_IL',
        }}
        onEditorChange={(content) => {
          onChange(content);
        }}
      />
    </div>
  );
};

export default TinyMCEEditor; 