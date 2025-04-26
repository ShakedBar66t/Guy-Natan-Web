'use client';

import React from 'react';
import { EditorContent } from '@tiptap/react';
import EditorProvider from './EditorProvider';
import MenuBar from './MenuBar';
import BubbleMenu from './BubbleMenu';

interface TipTapEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
  height?: string;
}

export default function TipTapEditor({ initialContent, onChange, height = '300px' }: TipTapEditorProps) {
  return (
    <EditorProvider initialContent={initialContent} onUpdate={onChange} height={height}>
      {(editor) => (
        <div className="bg-white rounded-lg shadow p-6 mb-6 relative editor-wrapper">
          <MenuBar editor={editor} />
          <BubbleMenu editor={editor} />
          <div className="min-h-[200px] overflow-auto editor-content" style={{ height }}>
            <EditorContent editor={editor} />
          </div>
          <style jsx global>{`
            .editor-content .ProseMirror {
              padding: 0.5rem;
              outline: none;
            }
            .editor-content .ProseMirror a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .editor-content ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin: 1rem 0;
            }
            .editor-content ol {
              list-style-type: decimal;
              padding-left: 1.5rem;
              margin: 1rem 0;
            }
            .editor-content blockquote {
              border-left: 3px solid #e5e7eb;
              padding-left: 1rem;
              margin-left: 0;
              margin-right: 0;
              font-style: italic;
            }
            .editor-content code {
              background-color: #f3f4f6;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-family: monospace;
            }
            .editor-content pre {
              background-color: #1f2937;
              color: #f3f4f6;
              padding: 0.75rem 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }
            .editor-content p {
              margin: 0.5rem 0;
            }
          `}</style>
        </div>
      )}
    </EditorProvider>
  );
} 