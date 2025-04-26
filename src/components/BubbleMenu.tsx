import React from 'react';
import { BubbleMenu as TippyBubbleMenu, Editor } from '@tiptap/react';
import { Bold, Italic, Link2 } from 'lucide-react';

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null;

  return (
    <TippyBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex space-x-2 bg-white shadow-lg rounded p-2"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${editor.isActive('bold') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${editor.isActive('italic') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          
          // cancelled
          if (url === null) {
            return;
          }
          
          // empty
          if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
          }
          
          // update link
          editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`${editor.isActive('link') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Link2 size={18} />
      </button>
    </TippyBubbleMenu>
  );
} 