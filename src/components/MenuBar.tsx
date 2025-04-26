import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from 'lucide-react';

interface MenuBarProps {
  editor: Editor;
}

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;
  return (
    <div className="flex items-center space-x-3 border-b pb-2 mb-4">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${editor.isActive('bold') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Bold size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${editor.isActive('italic') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Italic size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${editor.isActive('underline') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <UnderlineIcon size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${editor.isActive('strike') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <StrikethroughIcon size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${editor.isActive('code') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Code size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${editor.isActive('bulletList') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <List size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${editor.isActive('orderedList') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <ListOrdered size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${editor.isActive('blockquote') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-600 p-1`}
      >
        <Quote size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="text-gray-500 hover:text-gray-700 p-1"
      >
        <UndoIcon size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="text-gray-500 hover:text-gray-700 p-1"
      >
        <RedoIcon size={20} />
      </button>
    </div>
  );
} 